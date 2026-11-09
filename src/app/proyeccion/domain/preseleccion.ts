import { FechasMinimas, SeleccionProyeccion } from './tipos';

/** RF-07: la menor fecha mínima, aunque sea anterior a hoy. Si son iguales, se elige `ordinaria`. */
export function preseleccionar(fechas: FechasMinimas): SeleccionProyeccion {
  return fechas.parcial < fechas.ordinaria
    ? { beneficio: 'parcial', fecha: fechas.parcial }
    : { beneficio: 'ordinaria', fecha: fechas.ordinaria };
}
