import { FechaIso, FechasMinimas, TipoBeneficio } from './tipos';

export type EstadoCarga = 'cargando' | 'lista' | 'fallecido' | 'errorCarga';
export type EstadoGeneracion = 'inactiva' | 'generando' | 'error';
export type AlertaPantalla = 'errorCarga' | 'fallecido' | 'condiciones';

export interface EntradaVista {
  carga: EstadoCarga;
  generacion: EstadoGeneracion;
  fechas: FechasMinimas | null;
  hoy: FechaIso;
}

export interface VistaPantalla {
  alerta: AlertaPantalla | null;
  mostrarFormulario: boolean;
  beneficioDisponible: TipoBeneficio | null;
  mostrarTramite: boolean;
  proyectarHabilitado: boolean;
  mostrarIndicador: boolean;
  mostrarErrorGeneracion: boolean;
}

/** Tabla "Qué muestra la pantalla" de data-model.md. */
export function calcularVista({ carga, generacion, fechas, hoy }: EntradaVista): VistaPantalla {
  const cumplidas = fechas ? [fechas.ordinaria, fechas.parcial].filter((f) => f <= hoy).length : 0;

  return {
    alerta: calcularAlerta(carga, cumplidas),
    mostrarFormulario: carga !== 'fallecido',
    beneficioDisponible: carga === 'lista' ? calcularBeneficioDisponible(fechas, hoy) : null,
    mostrarTramite: carga === 'lista' && cumplidas >= 1,
    proyectarHabilitado: carga === 'lista' && generacion !== 'generando',
    mostrarIndicador: carga === 'cargando' || generacion === 'generando',
    mostrarErrorGeneracion: generacion === 'error',
  };
}

/** RF-14: el beneficio cumplido, solo si se cumplió uno de los dos. */
function calcularBeneficioDisponible(
  fechas: FechasMinimas | null,
  hoy: FechaIso,
): TipoBeneficio | null {
  if (!fechas) {
    return null;
  }

  const ordinariaCumplida = fechas.ordinaria <= hoy;

  if (ordinariaCumplida === fechas.parcial <= hoy) {
    return null;
  }

  return ordinariaCumplida ? 'ordinaria' : 'parcial';
}

function calcularAlerta(carga: EstadoCarga, cumplidas: number): AlertaPantalla | null {
  if (carga === 'errorCarga' || carga === 'fallecido') {
    return carga;
  }

  return carga === 'lista' && cumplidas === 2 ? 'condiciones' : null;
}
