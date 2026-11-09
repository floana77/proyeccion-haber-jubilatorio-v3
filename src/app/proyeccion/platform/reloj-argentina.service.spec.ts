import { TestBed } from '@angular/core/testing';

import { RelojArgentina } from './reloj-argentina.service';

describe('RelojArgentina', () => {
  let reloj: RelojArgentina;

  beforeEach(() => {
    reloj = TestBed.inject(RelojArgentina);
  });

  it('devuelve la fecha con formato YYYY-MM-DD', () => {
    expect(reloj.hoy(new Date('2026-11-08T15:00:00Z'))).toBe('2026-11-08');
  });

  it('mantiene la fecha de Argentina cuando en UTC ya cambió el día', () => {
    expect(reloj.hoy(new Date('2026-11-09T02:59:59Z'))).toBe('2026-11-08');
  });

  it('cambia de día a la medianoche de Argentina', () => {
    expect(reloj.hoy(new Date('2026-11-09T03:00:00Z'))).toBe('2026-11-09');
  });

  it('usa el reloj del dispositivo si no recibe un instante', () => {
    expect(reloj.hoy()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
