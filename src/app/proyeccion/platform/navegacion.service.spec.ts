import { TestBed } from '@angular/core/testing';

import { Navegacion } from './navegacion.service';
import { VENTANA } from './ventana.token';

describe('Navegacion', () => {
  it('AC-26: navega en la misma pestaña a la URL recibida', () => {
    const assign = jasmine.createSpy('assign');
    const open = jasmine.createSpy('open');
    TestBed.configureTestingModule({
      providers: [{ provide: VENTANA, useValue: { location: { assign }, open } }],
    });

    TestBed.inject(Navegacion).ir('http://sitio/solicitud');

    expect(assign).toHaveBeenCalledOnceWith('http://sitio/solicitud');
    expect(open).not.toHaveBeenCalled();
  });
});
