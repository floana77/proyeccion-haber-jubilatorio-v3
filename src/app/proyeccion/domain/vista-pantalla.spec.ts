import { calcularVista, EntradaVista, VistaPantalla } from './vista-pantalla';

const HOY = '2026-11-08';
const AYER = '2026-11-07';
const MANIANA = '2026-11-09';
const FUTURAS = { ordinaria: '2030-01-01', parcial: '2031-01-01' };

function entrada(cambios: Partial<EntradaVista> = {}): EntradaVista {
  return { carga: 'lista', generacion: 'inactiva', fechas: FUTURAS, hoy: HOY, ...cambios };
}

describe('calcularVista', () => {
  describe('Cargando', () => {
    const vista = calcularVista(entrada({ carga: 'cargando', fechas: null }));

    it('AC-28: muestra el indicador y deshabilita Proyectar', () => {
      expect(vista.mostrarIndicador).toBeTrue();
      expect(vista.proyectarHabilitado).toBeFalse();
    });

    it('no muestra alerta ni botón de trámite', () => {
      expect(vista.alerta).toBeNull();
      expect(vista.mostrarTramite).toBeFalse();
    });
  });

  describe('Falla de carga', () => {
    const vista = calcularVista(entrada({ carga: 'errorCarga', fechas: null }));

    it('AC-25: muestra el mensaje de RF-13, sin trámite y con Proyectar deshabilitado', () => {
      expect(vista.alerta).toBe('errorCarga');
      expect(vista.mostrarTramite).toBeFalse();
      expect(vista.proyectarHabilitado).toBeFalse();
      expect(vista.mostrarIndicador).toBeFalse();
    });
  });

  describe('Ninguna fecha cumplida', () => {
    const vista = calcularVista(entrada());

    it('no muestra alerta ni trámite y deja Proyectar habilitado', () => {
      expect(vista.alerta).toBeNull();
      expect(vista.mostrarTramite).toBeFalse();
      expect(vista.proyectarHabilitado).toBeTrue();
      expect(vista.mostrarIndicador).toBeFalse();
      expect(vista.mostrarErrorGeneracion).toBeFalse();
    });
  });

  describe('Generación del reporte', () => {
    it('AC-17: durante la generación muestra el indicador y deshabilita Proyectar', () => {
      const vista = calcularVista(entrada({ generacion: 'generando' }));

      expect(vista.mostrarIndicador).toBeTrue();
      expect(vista.proyectarHabilitado).toBeFalse();
    });

    it('AC-18: con error muestra el mensaje de RF-10 y deja Proyectar habilitado', () => {
      const vista = calcularVista(entrada({ generacion: 'error' }));

      expect(vista.mostrarErrorGeneracion).toBeTrue();
      expect(vista.proyectarHabilitado).toBeTrue();
    });
  });

  describe('Las dos fechas cumplidas', () => {
    function comprobar(vista: VistaPantalla): void {
      expect(vista.alerta).toBe('condiciones');
      expect(vista.mostrarTramite).toBeTrue();
      expect(vista.proyectarHabilitado).toBeTrue();
    }

    it('AC-02: las dos iguales a hoy', () => {
      comprobar(calcularVista(entrada({ fechas: { ordinaria: HOY, parcial: HOY } })));
    });

    it('AC-03: las dos anteriores a hoy', () => {
      comprobar(calcularVista(entrada({ fechas: { ordinaria: AYER, parcial: AYER } })));
    });
  });

  describe('Solo una fecha cumplida', () => {
    function comprobar(vista: VistaPantalla): void {
      expect(vista.alerta).toBeNull();
      expect(vista.mostrarTramite).toBeTrue();
      expect(vista.proyectarHabilitado).toBeTrue();
    }

    it('AC-04: Parcial igual a hoy y Ordinaria mañana', () => {
      comprobar(calcularVista(entrada({ fechas: { ordinaria: MANIANA, parcial: HOY } })));
    });

    it('Ordinaria anterior a hoy y Parcial mañana', () => {
      comprobar(calcularVista(entrada({ fechas: { ordinaria: AYER, parcial: MANIANA } })));
    });
  });

  it('AC-05: con las dos fechas en mañana no muestra alerta ni trámite', () => {
    const vista = calcularVista(entrada({ fechas: { ordinaria: MANIANA, parcial: MANIANA } }));

    expect(vista.alerta).toBeNull();
    expect(vista.mostrarTramite).toBeFalse();
    expect(vista.proyectarHabilitado).toBeTrue();
  });

  describe('Formulario y etiqueta "Ya disponible" (RF-14)', () => {
    it('muestra el formulario salvo con fallecido', () => {
      expect(calcularVista(entrada()).mostrarFormulario).toBeTrue();
      expect(calcularVista(entrada({ carga: 'cargando', fechas: null })).mostrarFormulario).toBeTrue();
      expect(calcularVista(entrada({ carga: 'errorCarga', fechas: null })).mostrarFormulario).toBeTrue();
    });

    it('AC-29: marca Parcial si solo se cumplió su fecha', () => {
      const vista = calcularVista(entrada({ fechas: { ordinaria: MANIANA, parcial: HOY } }));

      expect(vista.beneficioDisponible).toBe('parcial');
    });

    it('marca Ordinaria si solo se cumplió su fecha', () => {
      const vista = calcularVista(entrada({ fechas: { ordinaria: AYER, parcial: MANIANA } }));

      expect(vista.beneficioDisponible).toBe('ordinaria');
    });

    it('AC-30: no marca ninguno con las dos fechas cumplidas', () => {
      const vista = calcularVista(entrada({ fechas: { ordinaria: HOY, parcial: AYER } }));

      expect(vista.beneficioDisponible).toBeNull();
    });

    it('AC-30: no marca ninguno con las dos fechas posteriores a hoy', () => {
      const vista = calcularVista(entrada({ fechas: { ordinaria: MANIANA, parcial: MANIANA } }));

      expect(vista.beneficioDisponible).toBeNull();
    });
  });

  describe('Estado de matrícula', () => {
    it('AC-13: fallecido muestra su alerta, sin trámite y con Proyectar deshabilitado', () => {
      const vista = calcularVista(
        entrada({ carga: 'fallecido', fechas: { ordinaria: AYER, parcial: AYER } }),
      );

      expect(vista.alerta).toBe('fallecido');
      expect(vista.mostrarFormulario).toBeFalse();
      expect(vista.mostrarTramite).toBeFalse();
      expect(vista.proyectarHabilitado).toBeFalse();
      expect(vista.mostrarIndicador).toBeFalse();
    });

    it('AC-14: los demás estados llegan a lista, sin alerta y con Proyectar habilitado', () => {
      const vista = calcularVista(entrada({ carga: 'lista' }));

      expect(vista.alerta).toBeNull();
      expect(vista.proyectarHabilitado).toBeTrue();
    });
  });
});
