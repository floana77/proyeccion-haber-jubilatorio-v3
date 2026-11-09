import { inject, Injectable } from '@angular/core';

import { VENTANA } from './ventana.token';

@Injectable({ providedIn: 'root' })
export class Navegacion {
  private readonly ventana = inject(VENTANA);

  /** Navega en la misma pestaña. */
  ir(url: string): void {
    this.ventana.location.assign(url);
  }
}
