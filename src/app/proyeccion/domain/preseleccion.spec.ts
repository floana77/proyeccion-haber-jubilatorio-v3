import { preseleccionar } from './preseleccion';

describe('preseleccionar (RF-07)', () => {
  it('AC-06: elige Parcial si su fecha es anterior a la de Ordinaria', () => {
    expect(preseleccionar({ ordinaria: '2031-05-10', parcial: '2030-05-10' })).toEqual({
      beneficio: 'parcial',
      fecha: '2030-05-10',
    });
  });

  it('elige Ordinaria si su fecha es anterior a la de Parcial', () => {
    expect(preseleccionar({ ordinaria: '2030-05-10', parcial: '2031-05-10' })).toEqual({
      beneficio: 'ordinaria',
      fecha: '2030-05-10',
    });
  });

  it('AC-07: elige Ordinaria si las dos fechas son iguales', () => {
    expect(preseleccionar({ ordinaria: '2030-05-10', parcial: '2030-05-10' })).toEqual({
      beneficio: 'ordinaria',
      fecha: '2030-05-10',
    });
  });

  it('AC-08: elige Parcial aunque su fecha sea anterior a hoy', () => {
    expect(preseleccionar({ ordinaria: '2031-05-10', parcial: '2020-01-01' })).toEqual({
      beneficio: 'parcial',
      fecha: '2020-01-01',
    });
  });
});
