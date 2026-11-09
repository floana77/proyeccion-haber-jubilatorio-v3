import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

import { ProyeccionPageComponent } from './proyeccion/ui/proyeccion-page/proyeccion-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProyeccionPageComponent],
  template: '<app-proyeccion-page />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly primeng = inject(PrimeNGConfig);

  ngOnInit(): void {
    this.primeng.setTranslation({
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      monthNames: [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre',
        'octubre', 'noviembre', 'diciembre',
      ],
      monthNamesShort: [
        'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
      ],
    });
  }
}
