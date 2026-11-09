import { FechaIso } from '../domain/tipos';

/** Convierte al `Date` local que necesita el selector, sin corrimientos de un día. */
export function fechaADate(fecha: FechaIso): Date {
  const [anio, mes, dia] = fecha.split('-').map(Number);

  return new Date(anio, mes - 1, dia);
}

export function dateAFecha(date: Date): FechaIso {
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}-${mes}-${dia}`;
}

/** `YYYY-MM-DD` a `DD/MM/YYYY`, sin pasar por `Date`. */
export function fechaParaMostrar(fecha: FechaIso): string {
  const [anio, mes, dia] = fecha.split('-');

  return `${dia}/${mes}/${anio}`;
}
