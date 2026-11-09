import { inject, Injectable } from '@angular/core';

import { ReportePdf } from '../domain/tipos';
import { VENTANA } from './ventana.token';

const TEXTO_ESPERA = 'Generando su proyección…';
const LIBERAR_ENLACE_MS = 60_000;

export interface PestanaAbierta {
  mostrarPdf(pdf: ReportePdf): void;
  cerrar(): void;
}

/** Abre la pestaña del PDF. Debe llamarse dentro del clic para que el navegador no la bloquee. */
@Injectable({ providedIn: 'root' })
export class PestanaReporte {
  private readonly ventana = inject(VENTANA);

  abrir(): PestanaAbierta | null {
    // Sin noopener: esa opción haría que open() devuelva null y no se podría controlar la pestaña.
    const pestana = this.ventana.open('', '_blank');

    if (!pestana) {
      return null;
    }

    pestana.document.title = TEXTO_ESPERA;
    pestana.document.body.textContent = TEXTO_ESPERA;

    return {
      mostrarPdf: (pdf) => {
        const enlace = this.ventana.URL.createObjectURL(pdf);
        pestana.location.href = enlace;
        setTimeout(() => this.ventana.URL.revokeObjectURL(enlace), LIBERAR_ENLACE_MS);
      },
      cerrar: () => pestana.close(),
    };
  }
}
