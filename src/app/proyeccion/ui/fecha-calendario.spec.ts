import { dateAFecha, fechaADate, fechaParaMostrar } from './fecha-calendario';

describe('fecha-calendario', () => {
  it('convierte una fecha a un Date local del mismo día', () => {
    const date = fechaADate('2030-03-15');

    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2030, 2, 15]);
  });

  it('convierte un Date local a la fecha de ese día, sin importar la hora', () => {
    expect(dateAFecha(new Date(2030, 2, 15, 0, 0))).toBe('2030-03-15');
    expect(dateAFecha(new Date(2030, 2, 15, 23, 59))).toBe('2030-03-15');
  });

  it('completa con ceros el mes y el día', () => {
    expect(dateAFecha(new Date(2030, 0, 5))).toBe('2030-01-05');
  });

  it('ida y vuelta sin corrimiento en fin de año', () => {
    expect(dateAFecha(fechaADate('2030-12-31'))).toBe('2030-12-31');
  });

  it('muestra la fecha como DD/MM/YYYY', () => {
    expect(fechaParaMostrar('2030-03-15')).toBe('15/03/2030');
  });
});
