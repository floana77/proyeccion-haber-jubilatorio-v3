import { Observable } from 'rxjs';

import {
  EstadoMatricula,
  FechasMinimas,
  ReportePdf,
  SeleccionProyeccion,
} from '../domain/tipos';

/**
 * Lo que la pantalla necesita de los servicios actuales. Cada operación emite un único resultado y
 * admite cancelación. Toda falla, incluida una sesión vencida, se informa como error.
 */
export abstract class ProyeccionGateway {
  abstract obtenerEstadoMatricula(): Observable<EstadoMatricula>;
  abstract obtenerFechasMinimas(): Observable<FechasMinimas>;
  abstract generarReporte(seleccion: SeleccionProyeccion): Observable<ReportePdf>;
}
