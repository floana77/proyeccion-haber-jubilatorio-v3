import { Injectable, Provider } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import {
  EstadoMatricula,
  FechasMinimas,
  ReportePdf,
  SeleccionProyeccion,
} from '../domain/tipos';
import { ProyeccionGateway } from './proyeccion.gateway';

/**
 * Versión temporal: informa error en todas las operaciones hasta tener los contratos reales de los
 * servicios (B1 y B2 del plan). Permite compilar producción sin datos simulados.
 */
@Injectable()
export class ProyeccionHttpGateway extends ProyeccionGateway {
  override obtenerEstadoMatricula(): Observable<EstadoMatricula> {
    return this.sinConectar();
  }

  override obtenerFechasMinimas(): Observable<FechasMinimas> {
    return this.sinConectar();
  }

  override generarReporte(_seleccion: SeleccionProyeccion): Observable<ReportePdf> {
    return this.sinConectar();
  }

  private sinConectar(): Observable<never> {
    return throwError(() => new Error('Servicios actuales sin conectar'));
  }
}

export function proveerGatewayHttp(): Provider[] {
  return [{ provide: ProyeccionGateway, useClass: ProyeccionHttpGateway }];
}
