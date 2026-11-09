import { TipoBeneficio } from '../../domain/tipos';
import { AlertaPantalla } from '../../domain/vista-pantalla';

/** Textos literales de contracts/pantalla-proyeccion.md. */
export const ALERTAS: Record<AlertaPantalla, string> = {
  errorCarga: 'No pudimos cargar sus datos. Vuelva a ingresar al módulo.',
  fallecido: 'No es posible realizar proyección para afiliados con estado matricular fallecido',
  condiciones: 'Ud. se encuentra en condiciones de jubilarse',
};

export type VarianteAviso = 'error' | 'atencion';

export const VARIANTE_ALERTA: Record<AlertaPantalla, VarianteAviso> = {
  errorCarga: 'error',
  fallecido: 'error',
  condiciones: 'atencion',
};

export const TEXTO_TRAMITE = 'Inicie su trámite de jubilación aquí';

export const ERROR_GENERACION = 'No pudimos generar su proyección. Intente nuevamente.';

export const TITULO = 'Su proyección de haber jubilatorio';

export const SUBTITULO = 'Elija el beneficio y la fecha para proyectar su haber jubilatorio.';

export const ETIQUETA_DISPONIBLE = 'Ya disponible';

export const OPCIONES_BENEFICIO: { valor: TipoBeneficio; nombre: string; descripcion: string }[] = [
  {
    valor: 'ordinaria',
    nombre: 'Jubilación Ordinaria',
    descripcion: 'El beneficio completo, a partir de su fecha mínima.',
  },
  {
    valor: 'parcial',
    nombre: 'Jubilación Parcial',
    descripcion: 'Combina actividad reducida con un haber proporcional.',
  },
];
