import { cambiarBeneficio, elegirFecha } from './seleccion';
import { FechasMinimas, SeleccionProyeccion } from './tipos';

const FECHAS: FechasMinimas = { ordinaria: '2031-05-10', parcial: '2030-03-15' };
const PARCIAL: SeleccionProyeccion = { beneficio: 'parcial', fecha: '2030-03-15' };

describe('cambiarBeneficio (RF-03)', () => {
  it('AC-09: reemplaza la fecha elegida por la mínima del nuevo beneficio', () => {
    expect(cambiarBeneficio('ordinaria', FECHAS)).toEqual({
      beneficio: 'ordinaria',
      fecha: '2031-05-10',
    });
  });
});

describe('elegirFecha (RF-04, RF-12)', () => {
  it('AC-10: acepta la fecha mínima más un año', () => {
    expect(elegirFecha(PARCIAL, '2031-03-15', FECHAS).fecha).toBe('2031-03-15');
  });

  it('AC-11: acepta la fecha mínima', () => {
    const seleccion = { ...PARCIAL, fecha: '2030-06-01' };

    expect(elegirFecha(seleccion, '2030-03-15', FECHAS).fecha).toBe('2030-03-15');
  });

  it('AC-11: rechaza el día anterior a la fecha mínima', () => {
    expect(elegirFecha(PARCIAL, '2030-03-14', FECHAS)).toEqual(PARCIAL);
  });

  it('usa la fecha mínima del beneficio elegido', () => {
    const ordinaria: SeleccionProyeccion = { beneficio: 'ordinaria', fecha: '2031-05-10' };

    expect(elegirFecha(ordinaria, '2030-03-15', FECHAS)).toEqual(ordinaria);
  });

  it('no tiene fecha máxima', () => {
    expect(elegirFecha(PARCIAL, '2099-12-31', FECHAS).fecha).toBe('2099-12-31');
  });
});
