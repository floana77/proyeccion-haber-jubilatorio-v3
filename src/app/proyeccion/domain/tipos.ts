/** Texto `YYYY-MM-DD`. Fecha calendario, sin hora. */
export type FechaIso = string;

/** Solo estos dos beneficios: otros están fuera de alcance. */
export type TipoBeneficio = 'ordinaria' | 'parcial';

/** Solo `fallecido` impide proyectar (RF-05). */
export type EstadoMatricula = 'activa' | 'cancelado' | 'suspendido' | 'fallecido';

/** Las dos son obligatorias. */
export interface FechasMinimas {
  ordinaria: FechaIso;
  parcial: FechaIso;
}

/** `fecha` ≥ fecha mínima del beneficio (RF-04); sin máximo. */
export interface SeleccionProyeccion {
  beneficio: TipoBeneficio;
  fecha: FechaIso;
}

/** Archivo PDF. No se persiste. */
export type ReportePdf = Blob;
