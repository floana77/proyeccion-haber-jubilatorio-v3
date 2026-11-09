import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Calendar } from 'primeng/calendar';
import { SelectButton } from 'primeng/selectbutton';
import { Subject, of, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ProyeccionGateway } from '../../data/proyeccion.gateway';
import { EstadoMatricula, FechasMinimas, ReportePdf } from '../../domain/tipos';
import { Navegacion } from '../../platform/navegacion.service';
import { PestanaReporte } from '../../platform/pestana-reporte.service';
import { RelojArgentina } from '../../platform/reloj-argentina.service';
import { ProyeccionPageComponent } from './proyeccion-page.component';

const FECHAS: FechasMinimas = { ordinaria: '2031-05-10', parcial: '2030-03-15' };
const ERROR_RF10 = 'No pudimos generar su proyección. Intente nuevamente.';
const ERROR_RF13 = 'No pudimos cargar sus datos. Vuelva a ingresar al módulo.';

describe('ProyeccionPageComponent', () => {
  let gateway: jasmine.SpyObj<ProyeccionGateway>;
  let pestana: jasmine.SpyObj<PestanaReporte>;
  let fixture: ComponentFixture<ProyeccionPageComponent>;

  beforeEach(() => {
    gateway = jasmine.createSpyObj<ProyeccionGateway>('ProyeccionGateway', [
      'obtenerEstadoMatricula',
      'obtenerFechasMinimas',
      'generarReporte',
    ]);
    gateway.obtenerEstadoMatricula.and.returnValue(of<EstadoMatricula>('activa'));
    gateway.obtenerFechasMinimas.and.returnValue(of(FECHAS));
    pestana = jasmine.createSpyObj<PestanaReporte>('PestanaReporte', ['abrir']);
    pestana.abrir.and.returnValue({ mostrarPdf: () => undefined, cerrar: () => undefined });

    TestBed.configureTestingModule({
      imports: [ProyeccionPageComponent],
      providers: [
        provideNoopAnimations(),
        { provide: ProyeccionGateway, useValue: gateway },
        { provide: PestanaReporte, useValue: pestana },
        { provide: RelojArgentina, useValue: { hoy: () => '2026-11-08' } },
      ],
    });
  });

  function renderizar(): void {
    fixture = TestBed.createComponent(ProyeccionPageComponent);
    fixture.detectChanges();
  }

  async function renderizarEstable(): Promise<void> {
    renderizar();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function selectorBeneficio(): SelectButton {
    return fixture.debugElement.query(By.directive(SelectButton)).componentInstance;
  }

  function calendario(): Calendar {
    return fixture.debugElement.query(By.directive(Calendar)).componentInstance;
  }

  function entradaFecha(): HTMLInputElement {
    return elemento('fecha-elegida')!.querySelector('input') as HTMLInputElement;
  }

  function elemento(id: string): HTMLElement | null {
    return fixture.nativeElement.querySelector(`[data-testid="${id}"]`);
  }

  function textoCompleto(): string {
    return fixture.nativeElement.textContent;
  }

  function botonProyectar(): HTMLButtonElement {
    return elemento('proyectar') as HTMLButtonElement;
  }

  it('AC-01: muestra las dos fechas mínimas', () => {
    renderizar();

    expect(elemento('fecha-minima-ordinaria')?.textContent).toContain('10/05/2031');
    expect(elemento('fecha-minima-parcial')?.textContent).toContain('15/03/2030');
  });

  it('muestra el beneficio y la fecha propuestos', async () => {
    await renderizarEstable();

    expect(selectorBeneficio().value).toBe('parcial');
    expect(entradaFecha().value).toBe('15/03/2030');
  });

  it('AC-21: con un clic en Proyectar pide el reporte', () => {
    gateway.generarReporte.and.returnValue(new Subject<ReportePdf>());
    renderizar();

    botonProyectar().click();

    expect(gateway.generarReporte).toHaveBeenCalledOnceWith({
      beneficio: 'parcial',
      fecha: '2030-03-15',
    });
  });

  it('AC-17: durante la generación muestra el indicador y deshabilita Proyectar', () => {
    gateway.generarReporte.and.returnValue(new Subject<ReportePdf>());
    renderizar();

    botonProyectar().click();
    fixture.detectChanges();

    expect(elemento('indicador-carga')).not.toBeNull();
    expect(botonProyectar().disabled).toBeTrue();
  });

  it('AC-28: durante la carga muestra el indicador y deshabilita Proyectar', () => {
    gateway.obtenerEstadoMatricula.and.returnValue(new Subject<EstadoMatricula>());
    renderizar();

    expect(elemento('indicador-carga')).not.toBeNull();
    expect(botonProyectar().disabled).toBeTrue();
  });

  it('AC-18: muestra el mensaje literal de RF-10 y vuelve a habilitar Proyectar', () => {
    gateway.generarReporte.and.returnValue(throwError(() => new Error('falla')));
    renderizar();

    botonProyectar().click();
    fixture.detectChanges();

    expect(textoCompleto()).toContain(ERROR_RF10);
    expect(botonProyectar().disabled).toBeFalse();
  });

  it('AC-25: muestra el mensaje literal de RF-13, deshabilita Proyectar y no ofrece reintento', () => {
    gateway.obtenerEstadoMatricula.and.returnValue(throwError(() => new Error('falla')));
    renderizar();

    expect(textoCompleto()).toContain(ERROR_RF13);
    expect(botonProyectar().disabled).toBeTrue();
    expect(fixture.nativeElement.querySelectorAll('button').length).toBe(1);
  });

  describe('selector de beneficio y de fecha', () => {
    it('AC-12: la fecha es de solo lectura', async () => {
      await renderizarEstable();

      expect(calendario().readonlyInput).toBeTrue();
      expect(entradaFecha().readOnly).toBeTrue();
    });

    it('AC-11: aplica la fecha mínima del beneficio elegido', async () => {
      await renderizarEstable();

      expect(calendario().minDate).toEqual(new Date(2030, 2, 15));
    });

    it('no tiene fecha máxima', async () => {
      await renderizarEstable();

      expect(calendario().maxDate).toBeFalsy();
    });

    it('AC-09: al cambiar el beneficio muestra la mínima del nuevo y actualiza el límite', async () => {
      await renderizarEstable();

      fixture.debugElement
        .query(By.directive(SelectButton))
        .triggerEventHandler('ngModelChange', 'ordinaria');
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(entradaFecha().value).toBe('10/05/2031');
      expect(calendario().minDate).toEqual(new Date(2031, 4, 10));
    });

    it('AC-10: la fecha elegida en el calendario se usa para proyectar', async () => {
      gateway.generarReporte.and.returnValue(new Subject<ReportePdf>());
      await renderizarEstable();

      fixture.debugElement
        .query(By.directive(Calendar))
        .triggerEventHandler('ngModelChange', new Date(2031, 2, 15));
      fixture.detectChanges();
      botonProyectar().click();

      expect(gateway.generarReporte).toHaveBeenCalledOnceWith({
        beneficio: 'parcial',
        fecha: '2031-03-15',
      });
    });
  });

  describe('en condiciones de jubilarse', () => {
    const CONDICIONES = 'Ud. se encuentra en condiciones de jubilarse';
    const TRAMITE = 'Inicie su trámite de jubilación aquí';

    it('AC-02: muestra los textos literales de alerta y trámite, con Proyectar habilitado', () => {
      gateway.obtenerFechasMinimas.and.returnValue(
        of({ ordinaria: '2026-11-08', parcial: '2026-11-08' }),
      );
      renderizar();

      expect(elemento('alerta')?.textContent).toContain(CONDICIONES);
      expect(elemento('tramite')?.textContent).toContain(TRAMITE);
      expect(botonProyectar().disabled).toBeFalse();
    });

    it('AC-04: con una sola fecha cumplida muestra el trámite y no la alerta', () => {
      gateway.obtenerFechasMinimas.and.returnValue(
        of({ ordinaria: '2026-11-09', parcial: '2026-11-08' }),
      );
      renderizar();

      expect(elemento('tramite')).not.toBeNull();
      expect(elemento('alerta')).toBeNull();
    });

    it('AC-26: el clic en el trámite navega a la URL del ambiente', () => {
      const navegacion = TestBed.inject(Navegacion);
      const ir = spyOn(navegacion, 'ir');
      gateway.obtenerFechasMinimas.and.returnValue(
        of({ ordinaria: '2026-11-08', parcial: '2026-11-08' }),
      );
      renderizar();

      elemento('tramite')!.click();

      expect(ir).toHaveBeenCalledOnceWith(environment.solicitudJubilacionUrl);
    });
  });

  describe('afiliado fallecido', () => {
    const FALLECIDO =
      'No es posible realizar proyección para afiliados con estado matricular fallecido';

    beforeEach(async () => {
      gateway.obtenerEstadoMatricula.and.returnValue(of<EstadoMatricula>('fallecido'));
      await renderizarEstable();
    });

    it('AC-13: muestra el texto literal de RF-05 y deshabilita Proyectar', () => {
      expect(elemento('alerta')?.textContent).toContain(FALLECIDO);
      expect(botonProyectar().disabled).toBeTrue();
      expect(elemento('tramite')).toBeNull();
    });

    it('beneficio y fecha quedan sin valores y no se pueden operar', () => {
      expect(selectorBeneficio().value).toBeNull();
      expect(selectorBeneficio().disabled).toBeTrue();
      expect(entradaFecha().value).toBe('');
      expect(calendario().disabled).toBeTrue();
    });
  });
});
