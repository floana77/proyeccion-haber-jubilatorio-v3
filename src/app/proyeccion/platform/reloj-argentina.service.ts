import { Injectable } from '@angular/core';

import { FechaIso } from '../domain/tipos';

const FORMATO_ARGENTINA = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Argentina/Buenos_Aires',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** "Hoy" es el reloj del dispositivo convertido a la fecha calendario de Argentina. */
@Injectable({ providedIn: 'root' })
export class RelojArgentina {
  hoy(instante: Date = new Date()): FechaIso {
    const partes = FORMATO_ARGENTINA.formatToParts(instante);
    const valor = (tipo: Intl.DateTimeFormatPartTypes): string =>
      partes.find((parte) => parte.type === tipo)?.value ?? '';

    return `${valor('year')}-${valor('month')}-${valor('day')}`;
  }
}
