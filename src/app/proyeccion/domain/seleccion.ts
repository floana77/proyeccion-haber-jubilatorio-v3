import { FechaIso, FechasMinimas, SeleccionProyeccion, TipoBeneficio } from './tipos';

/** RF-03: al cambiar el beneficio, la fecha pasa a ser la mínima del nuevo. */
export function cambiarBeneficio(
  beneficio: TipoBeneficio,
  fechas: FechasMinimas,
): SeleccionProyeccion {
  return { beneficio, fecha: fechas[beneficio] };
}

/** RF-04 y RF-12: se acepta si es mayor o igual a la mínima del beneficio. No hay fecha máxima. */
export function elegirFecha(
  seleccion: SeleccionProyeccion,
  fecha: FechaIso,
  fechas: FechasMinimas,
): SeleccionProyeccion {
  return fecha >= fechas[seleccion.beneficio] ? { ...seleccion, fecha } : seleccion;
}
