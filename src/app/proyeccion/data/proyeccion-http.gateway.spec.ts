import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, Observable } from 'rxjs';

import { ProyeccionHttpGateway } from './proyeccion-http.gateway';

describe('ProyeccionHttpGateway temporal', () => {
  let gateway: ProyeccionHttpGateway;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ProyeccionHttpGateway],
    });
    gateway = TestBed.inject(ProyeccionHttpGateway);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  async function esperarError(operacion: Observable<unknown>): Promise<void> {
    await expectAsync(firstValueFrom(operacion)).toBeRejected();
  }

  it('informa error al obtener el estado de la matrícula', async () => {
    await esperarError(gateway.obtenerEstadoMatricula());
  });

  it('informa error al obtener las fechas mínimas', async () => {
    await esperarError(gateway.obtenerFechasMinimas());
  });

  it('informa error al generar el reporte', async () => {
    await esperarError(gateway.generarReporte({ beneficio: 'ordinaria', fecha: '2030-01-01' }));
  });
});
