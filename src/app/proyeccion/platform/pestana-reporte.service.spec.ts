import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PestanaReporte } from './pestana-reporte.service';
import { VENTANA } from './ventana.token';

describe('PestanaReporte', () => {
  const PDF = new Blob(['pdf'], { type: 'application/pdf' });
  let pestana: { document: { title: string; body: { textContent: string } }; location: { href: string }; close: jasmine.Spy };
  let ventana: { open: jasmine.Spy; URL: { createObjectURL: jasmine.Spy; revokeObjectURL: jasmine.Spy } };

  beforeEach(() => {
    pestana = {
      document: { title: '', body: { textContent: '' } },
      location: { href: '' },
      close: jasmine.createSpy('close'),
    };
    ventana = {
      open: jasmine.createSpy('open').and.returnValue(pestana),
      URL: {
        createObjectURL: jasmine.createSpy('createObjectURL').and.returnValue('blob:pdf'),
        revokeObjectURL: jasmine.createSpy('revokeObjectURL'),
      },
    };
    TestBed.configureTestingModule({ providers: [{ provide: VENTANA, useValue: ventana }] });
  });

  function abrir() {
    return TestBed.inject(PestanaReporte).abrir();
  }

  it('abre una pestaña sin noopener, para poder controlarla', () => {
    abrir();

    expect(ventana.open).toHaveBeenCalledOnceWith('', '_blank');
  });

  it('escribe el texto de espera en la pestaña', () => {
    abrir();

    expect(pestana.document.body.textContent).toBe('Generando su proyección…');
    expect(pestana.document.title).toBe('Generando su proyección…');
  });

  it('muestra el PDF navegando la pestaña hacia él', () => {
    abrir()!.mostrarPdf(PDF);

    expect(ventana.URL.createObjectURL).toHaveBeenCalledOnceWith(PDF);
    expect(pestana.location.href).toBe('blob:pdf');
  });

  it('libera el enlace temporal 60 s después de cargar el PDF', fakeAsync(() => {
    abrir()!.mostrarPdf(PDF);

    tick(59_999);
    expect(ventana.URL.revokeObjectURL).not.toHaveBeenCalled();

    tick(1);
    expect(ventana.URL.revokeObjectURL).toHaveBeenCalledOnceWith('blob:pdf');
  }));

  it('cierra la pestaña', () => {
    abrir()!.cerrar();

    expect(pestana.close).toHaveBeenCalledTimes(1);
  });

  it('devuelve nulo si el navegador bloquea la pestaña', () => {
    ventana.open.and.returnValue(null);

    expect(abrir()).toBeNull();
  });
});
