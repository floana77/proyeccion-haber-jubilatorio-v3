import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap, take, timeout } from 'rxjs';

import { ProyeccionGateway } from '../data/proyeccion.gateway';
import { preseleccionar } from '../domain/preseleccion';
import { cambiarBeneficio, elegirFecha } from '../domain/seleccion';
import { FechaIso, FechasMinimas, SeleccionProyeccion, TipoBeneficio } from '../domain/tipos';
import { calcularVista, EstadoCarga, EstadoGeneracion, VistaPantalla } from '../domain/vista-pantalla';
import { PestanaReporte } from '../platform/pestana-reporte.service';
import { RelojArgentina } from '../platform/reloj-argentina.service';

const PLAZO_MS = 10_000;

@Injectable()
export class ProyeccionStore {
  private readonly gateway = inject(ProyeccionGateway);
  private readonly pestana = inject(PestanaReporte);
  private readonly reloj = inject(RelojArgentina);
  private readonly destroyRef = inject(DestroyRef);

  private readonly hoy = signal(this.reloj.hoy());

  readonly carga = signal<EstadoCarga>('cargando');
  readonly generacion = signal<EstadoGeneracion>('inactiva');
  readonly fechas = signal<FechasMinimas | null>(null);
  readonly seleccion = signal<SeleccionProyeccion | null>(null);

  readonly fechaMinimaElegida = computed<FechaIso | null>(() => {
    const fechas = this.fechas();
    const seleccion = this.seleccion();

    return fechas && seleccion ? fechas[seleccion.beneficio] : null;
  });

  readonly vista = computed<VistaPantalla>(() =>
    calcularVista({
      carga: this.carga(),
      generacion: this.generacion(),
      fechas: this.fechas(),
      hoy: this.hoy(),
    }),
  );

  cargar(): void {
    this.gateway
      .obtenerEstadoMatricula()
      .pipe(
        switchMap((estado) => (estado === 'fallecido' ? of(null) : this.gateway.obtenerFechasMinimas())),
        timeout(PLAZO_MS),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (fechas) => {
          if (!fechas) {
            this.carga.set('fallecido');
            return;
          }

          this.fechas.set(fechas);
          this.seleccion.set(preseleccionar(fechas));
          this.carga.set('lista');
        },
        error: () => this.carga.set('errorCarga'),
      });
  }

  cambiarBeneficio(beneficio: TipoBeneficio): void {
    const fechas = this.fechas();

    if (fechas) {
      this.seleccion.set(cambiarBeneficio(beneficio, fechas));
    }
  }

  elegirFecha(fecha: FechaIso): void {
    const fechas = this.fechas();
    const seleccion = this.seleccion();

    if (fechas && seleccion) {
      this.seleccion.set(elegirFecha(seleccion, fecha, fechas));
    }
  }

  /** Se llama de forma sincrónica en el clic: si no, el navegador bloquea la pestaña. */
  proyectar(): void {
    const seleccion = this.seleccion();

    if (this.carga() !== 'lista' || this.generacion() === 'generando' || !seleccion) {
      return;
    }

    const pestana = this.pestana.abrir();

    if (!pestana) {
      this.generacion.set('error');
      return;
    }

    this.generacion.set('generando');
    this.gateway
      .generarReporte(seleccion)
      .pipe(timeout(PLAZO_MS), take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pdf) => {
          pestana.mostrarPdf(pdf);
          this.generacion.set('inactiva');
        },
        error: () => {
          pestana.cerrar();
          this.generacion.set('error');
        },
      });
  }
}
