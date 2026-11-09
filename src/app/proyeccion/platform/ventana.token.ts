import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

export type Ventana = Window & typeof globalThis;

/** `window` inyectable, para poder simularlo en los tests. */
export const VENTANA = new InjectionToken<Ventana>('VENTANA', {
  factory: () => inject(DOCUMENT).defaultView as Ventana,
});
