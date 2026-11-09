import { TipoBeneficio } from '../../domain/tipos';
import { AlertaPantalla } from '../../domain/vista-pantalla';

/** Textos literales de contracts/pantalla-proyeccion.md. */
export const ALERTAS: Record<AlertaPantalla, string> = {
  errorCarga: 'No pudimos cargar sus datos. Vuelva a ingresar al módulo.',
  fallecido: 'No es posible realizar proyección para afiliados con estado matricular fallecido',
  condiciones: 'Ud. se encuentra en condiciones de jubilarse',
};

export const SEVERIDAD_ALERTA: Record<AlertaPantalla, 'error' | 'warn' | 'success'> = {
  errorCarga: 'error',
  fallecido: 'warn',
  condiciones: 'success',
};

export const TEXTO_TRAMITE = 'Inicie su trámite de jubilación aquí';

export const ERROR_GENERACION = 'No pudimos generar su proyección. Intente nuevamente.';

export const NOMBRE_BENEFICIO: Record<TipoBeneficio, string> = {
  ordinaria: 'Jubilación Ordinaria',
  parcial: 'Jubilación Parcial',
};
