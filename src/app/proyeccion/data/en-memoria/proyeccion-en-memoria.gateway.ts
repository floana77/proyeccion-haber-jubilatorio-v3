import { DOCUMENT } from '@angular/common';
import { inject, Injectable, Provider } from '@angular/core';
import { delay, NEVER, Observable, of, throwError } from 'rxjs';

import {
  EstadoMatricula,
  FechaIso,
  FechasMinimas,
  ReportePdf,
  SeleccionProyeccion,
} from '../../domain/tipos';
import { RelojArgentina } from '../../platform/reloj-argentina.service';
import { ProyeccionGateway } from '../proyeccion.gateway';

/** Solo para desarrollo y QA: nunca se importa desde environment.prod.ts (principio V). */

const DEMORA_MS = 3_000;
const DIAS_POR_ANIO = 365;

type ComportamientoCarga = 'normal' | 'error' | 'lenta' | 'sin-respuesta';
type ComportamientoReporte = 'normal' | 'lento' | 'error' | 'sin-respuesta';

/** Desplazamiento en días de cada fecha mínima respecto de hoy. */
interface Escenario {
  estado?: EstadoMatricula;
  ordinaria: number;
  parcial: number;
  carga?: ComportamientoCarga;
  reporte?: ComportamientoReporte;
}

const FUTURAS: Escenario = { ordinaria: DIAS_POR_ANIO, parcial: 2 * DIAS_POR_ANIO };

const ESCENARIOS: Record<string, Escenario> = {
  futuras: FUTURAS,
  'futuras-iguales': { ordinaria: 1, parcial: 1 },
  'parcial-menor': { ordinaria: 2 * DIAS_POR_ANIO, parcial: DIAS_POR_ANIO },
  'parcial-vencida': { ordinaria: DIAS_POR_ANIO, parcial: -30 },
  'una-hoy': { ordinaria: 1, parcial: 0 },
  'ambas-hoy': { ordinaria: 0, parcial: 0 },
  'ambas-vencidas': { ordinaria: -30, parcial: -60 },
  fallecido: { estado: 'fallecido', ordinaria: -30, parcial: -60 },
  cancelado: { ...FUTURAS, estado: 'cancelado' },
  suspendido: { ...FUTURAS, estado: 'suspendido' },
  'error-carga': { ...FUTURAS, carga: 'error' },
  'carga-lenta': { ...FUTURAS, carga: 'lenta' },
  'carga-sin-respuesta': { ...FUTURAS, carga: 'sin-respuesta' },
  lento: { ...FUTURAS, reporte: 'lento' },
  'error-reporte': { ...FUTURAS, reporte: 'error' },
  'sin-respuesta': { ...FUTURAS, reporte: 'sin-respuesta' },
};

@Injectable()
export class ProyeccionEnMemoriaGateway extends ProyeccionGateway {
  private readonly reloj = inject(RelojArgentina);
  private readonly documento = inject(DOCUMENT);

  override obtenerEstadoMatricula(): Observable<EstadoMatricula> {
    return this.segunCarga(this.escenario().estado ?? 'activa', 0);
  }

  override obtenerFechasMinimas(): Observable<FechasMinimas> {
    const { ordinaria, parcial } = this.escenario();
    const hoy = this.reloj.hoy();

    return this.segunCarga({
      ordinaria: sumarDias(hoy, ordinaria),
      parcial: sumarDias(hoy, parcial),
    });
  }

  override generarReporte(seleccion: SeleccionProyeccion): Observable<ReportePdf> {
    const pdf = crearPdfDePrueba(seleccion);

    switch (this.escenario().reporte) {
      case 'lento':
        return of(pdf).pipe(delay(DEMORA_MS));
      case 'error':
        return throwError(() => new Error('Falla simulada del reporte'));
      case 'sin-respuesta':
        return NEVER;
      default:
        return of(pdf);
    }
  }

  /** La demora se aplica a una sola consulta, para que la carga completa tarde lo indicado. */
  private segunCarga<T>(valor: T, demoraMs = DEMORA_MS): Observable<T> {
    switch (this.escenario().carga) {
      case 'error':
        return throwError(() => new Error('Falla simulada de la carga'));
      case 'lenta':
        return of(valor).pipe(delay(demoraMs));
      case 'sin-respuesta':
        return NEVER;
      default:
        return of(valor);
    }
  }

  private escenario(): Escenario {
    const nombre = new URLSearchParams(this.documento.location.search).get('escenario') ?? '';

    return ESCENARIOS[nombre] ?? FUTURAS;
  }
}

export function proveerGatewayEnMemoria(): Provider[] {
  return [{ provide: ProyeccionGateway, useClass: ProyeccionEnMemoriaGateway }];
}

function sumarDias(fecha: FechaIso, dias: number): FechaIso {
  const instante = new Date(`${fecha}T00:00:00Z`);
  instante.setUTCDate(instante.getUTCDate() + dias);

  return instante.toISOString().slice(0, 10);
}

/** Arma un PDF mínimo que muestra la selección, para comprobar la apertura en el navegador. */
function crearPdfDePrueba({ beneficio, fecha }: SeleccionProyeccion): ReportePdf {
  const lineas = `BT /F1 18 Tf 72 720 Td (PDF de prueba - beneficio: ${beneficio} - fecha: ${fecha}) Tj ET`;
  const objetos = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${lineas.length} >>\nstream\n${lineas}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];

  let cuerpo = '%PDF-1.4\n';
  const posiciones = objetos.map((objeto, indice) => {
    const posicion = cuerpo.length;
    cuerpo += `${indice + 1} 0 obj\n${objeto}\nendobj\n`;
    return posicion;
  });

  const inicioTabla = cuerpo.length;
  const filas = posiciones.map((p) => `${String(p).padStart(10, '0')} 00000 n \n`).join('');
  cuerpo += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n${filas}`;
  cuerpo += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${inicioTabla}\n%%EOF\n`;

  return new Blob([cuerpo], { type: 'application/pdf' });
}
