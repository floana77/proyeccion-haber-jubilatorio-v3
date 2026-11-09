import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { ProyeccionGateway } from '../data/proyeccion.gateway';
import { EstadoMatricula, FechasMinimas, ReportePdf } from '../domain/tipos';
import { PestanaAbierta, PestanaReporte } from '../platform/pestana-reporte.service';
import { RelojArgentina } from '../platform/reloj-argentina.service';
import { ProyeccionStore } from './proyeccion.store';

const FECHAS: FechasMinimas = { ordinaria: '2031-05-10', parcial: '2030-05-10' };
const PDF: ReportePdf = new Blob(['pdf'], { type: 'application/pdf' });

describe('ProyeccionStore', () => {
  let estado$: Subject<EstadoMatricula>;
  let fechas$: Subject<FechasMinimas>;
  let reporte$: Subject<ReportePdf>;
  let gateway: jasmine.SpyObj<ProyeccionGateway>;
  let abierta: jasmine.SpyObj<PestanaAbierta>;
  let pestana: jasmine.SpyObj<PestanaReporte>;
  let store: ProyeccionStore;

  beforeEach(() => {
    estado$ = new Subject();
    fechas$ = new Subject();
    reporte$ = new Subject();
    gateway = jasmine.createSpyObj<ProyeccionGateway>('ProyeccionGateway', [
      'obtenerEstadoMatricula',
      'obtenerFechasMinimas',
      'generarReporte',
    ]);
    gateway.obtenerEstadoMatricula.and.returnValue(estado$);
    gateway.obtenerFechasMinimas.and.returnValue(fechas$);
    gateway.generarReporte.and.callFake(() => reporte$);
    abierta = jasmine.createSpyObj<PestanaAbierta>('PestanaAbierta', ['mostrarPdf', 'cerrar']);
    pestana = jasmine.createSpyObj<PestanaReporte>('PestanaReporte', ['abrir']);
    pestana.abrir.and.returnValue(abierta);

    TestBed.configureTestingModule({
      providers: [
        ProyeccionStore,
        { provide: ProyeccionGateway, useValue: gateway },
        { provide: PestanaReporte, useValue: pestana },
        { provide: RelojArgentina, useValue: { hoy: () => '2026-11-08' } },
      ],
    });
    store = TestBed.inject(ProyeccionStore);
  });

  function responderCarga(estado: EstadoMatricula = 'activa'): void {
    estado$.next(estado);
    estado$.complete();
    fechas$.next(FECHAS);
    fechas$.complete();
  }

  function cargarLista(): void {
    store.cargar();
    responderCarga();
  }

  describe('carga', () => {
    it('empieza en cargando', () => {
      store.cargar();

      expect(store.carga()).toBe('cargando');
    });

    it('pide primero el estado y recién después las fechas', () => {
      store.cargar();
      expect(gateway.obtenerFechasMinimas).not.toHaveBeenCalled();

      estado$.next('activa');
      expect(gateway.obtenerFechasMinimas).toHaveBeenCalledTimes(1);
    });

    it('AC-01: con datos válidos queda lista y expone las fechas', () => {
      cargarLista();

      expect(store.carga()).toBe('lista');
      expect(store.fechas()).toEqual(FECHAS);
    });

    it('preselecciona el beneficio con la menor fecha', () => {
      cargarLista();

      expect(store.seleccion()).toEqual({ beneficio: 'parcial', fecha: '2030-05-10' });
    });

    it('AC-25: una falla del estado lleva a errorCarga', () => {
      store.cargar();
      estado$.error(new Error('sesión vencida'));

      expect(store.carga()).toBe('errorCarga');
    });

    it('AC-25: una falla de las fechas lleva a errorCarga', () => {
      store.cargar();
      estado$.next('activa');
      fechas$.error(new Error('falla'));

      expect(store.carga()).toBe('errorCarga');
    });

    it('AC-25: sin respuesta en 10 s en total lleva a errorCarga', fakeAsync(() => {
      store.cargar();
      tick(6_000);
      estado$.next('activa');

      tick(3_999);
      expect(store.carga()).toBe('cargando');

      tick(1);
      expect(store.carga()).toBe('errorCarga');
    }));

    it('descarta los datos que llegan después del plazo', fakeAsync(() => {
      store.cargar();
      tick(10_000);

      estado$.next('activa');
      expect(gateway.obtenerFechasMinimas).not.toHaveBeenCalled();
      expect(store.carga()).toBe('errorCarga');
    }));
  });

  describe('generación del reporte', () => {
    it('AC-15, AC-21: genera con la selección y muestra el PDF', () => {
      cargarLista();
      store.proyectar();
      reporte$.next(PDF);

      expect(gateway.generarReporte).toHaveBeenCalledOnceWith({
        beneficio: 'parcial',
        fecha: '2030-05-10',
      });
      expect(abierta.mostrarPdf).toHaveBeenCalledOnceWith(PDF);
      expect(store.generacion()).toBe('inactiva');
    });

    it('abre la pestaña de forma sincrónica, antes de pedir el reporte', () => {
      cargarLista();
      gateway.generarReporte.and.callFake(() => {
        expect(pestana.abrir).toHaveBeenCalledTimes(1);
        return reporte$;
      });

      store.proyectar();

      expect(gateway.generarReporte).toHaveBeenCalledTimes(1);
    });

    it('AC-17: un segundo clic no envía otra solicitud ni abre otra pestaña', () => {
      cargarLista();
      store.proyectar();
      store.proyectar();

      expect(store.generacion()).toBe('generando');
      expect(gateway.generarReporte).toHaveBeenCalledTimes(1);
      expect(pestana.abrir).toHaveBeenCalledTimes(1);
    });

    it('AC-18: ante un error cierra la pestaña y permite reintentar', () => {
      cargarLista();
      store.proyectar();
      reporte$.error(new Error('falla'));

      expect(abierta.cerrar).toHaveBeenCalledTimes(1);
      expect(store.generacion()).toBe('error');

      reporte$ = new Subject();
      store.proyectar();
      expect(store.generacion()).toBe('generando');
      expect(gateway.generarReporte).toHaveBeenCalledTimes(2);
    });

    it('AC-19: a los 10 s sin respuesta informa el error y cierra la pestaña', fakeAsync(() => {
      cargarLista();
      store.proyectar();

      tick(9_999);
      expect(store.generacion()).toBe('generando');

      tick(1);
      expect(store.generacion()).toBe('error');
      expect(abierta.cerrar).toHaveBeenCalledTimes(1);
    }));

    it('AC-19: descarta la respuesta que llega después del plazo', fakeAsync(() => {
      cargarLista();
      store.proyectar();
      tick(10_000);

      reporte$.next(PDF);

      expect(abierta.mostrarPdf).not.toHaveBeenCalled();
      expect(store.generacion()).toBe('error');
    }));

    it('no vence el plazo después de recibir el PDF', fakeAsync(() => {
      cargarLista();
      store.proyectar();
      reporte$.next(PDF);

      tick(20_000);

      expect(store.generacion()).toBe('inactiva');
      expect(abierta.cerrar).not.toHaveBeenCalled();
    }));

    it('AC-27: con la pestaña bloqueada informa el error sin pedir el reporte', () => {
      cargarLista();
      pestana.abrir.and.returnValue(null);

      store.proyectar();

      expect(store.generacion()).toBe('error');
      expect(gateway.generarReporte).not.toHaveBeenCalled();
    });

    it('no hace nada si los datos todavía no se cargaron', () => {
      store.cargar();
      store.proyectar();

      expect(pestana.abrir).not.toHaveBeenCalled();
      expect(gateway.generarReporte).not.toHaveBeenCalled();
    });
  });

  describe('cambios de selección', () => {
    it('AC-09: al cambiar de beneficio la fecha pasa a ser la mínima del nuevo', () => {
      cargarLista();
      store.elegirFecha('2032-01-01');

      store.cambiarBeneficio('ordinaria');

      expect(store.seleccion()).toEqual({ beneficio: 'ordinaria', fecha: '2031-05-10' });
    });

    it('AC-10: acepta una fecha posterior a la mínima', () => {
      cargarLista();

      store.elegirFecha('2031-05-10');

      expect(store.seleccion()?.fecha).toBe('2031-05-10');
    });

    it('AC-11: ignora una fecha anterior a la mínima', () => {
      cargarLista();

      store.elegirFecha('2030-05-09');

      expect(store.seleccion()?.fecha).toBe('2030-05-10');
    });

    it('expone la fecha mínima del beneficio elegido', () => {
      cargarLista();
      expect(store.fechaMinimaElegida()).toBe('2030-05-10');

      store.cambiarBeneficio('ordinaria');
      expect(store.fechaMinimaElegida()).toBe('2031-05-10');
    });

    it('el reporte usa la selección vigente', () => {
      cargarLista();
      store.cambiarBeneficio('ordinaria');
      store.elegirFecha('2033-02-01');

      store.proyectar();

      expect(gateway.generarReporte).toHaveBeenCalledOnceWith({
        beneficio: 'ordinaria',
        fecha: '2033-02-01',
      });
    });

    it('no cambia nada si los datos todavía no se cargaron', () => {
      store.cargar();

      store.cambiarBeneficio('ordinaria');
      store.elegirFecha('2033-02-01');

      expect(store.seleccion()).toBeNull();
    });
  });

  describe('estado de matrícula', () => {
    it('RF-05: con fallecido pasa a ese estado y no pide las fechas', () => {
      store.cargar();
      estado$.next('fallecido');
      estado$.complete();

      expect(store.carga()).toBe('fallecido');
      expect(gateway.obtenerFechasMinimas).not.toHaveBeenCalled();
      expect(store.seleccion()).toBeNull();
    });

    it('RF-05: con fallecido no se puede proyectar', () => {
      store.cargar();
      estado$.next('fallecido');
      estado$.complete();

      store.proyectar();

      expect(pestana.abrir).not.toHaveBeenCalled();
    });

    (['activa', 'cancelado', 'suspendido'] as const).forEach((estado) => {
      it(`AC-14: con ${estado} queda lista`, () => {
        store.cargar();
        responderCarga(estado);

        expect(store.carga()).toBe('lista');
      });
    });
  });
});
