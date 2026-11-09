import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { environment } from '../../../../environments/environment';
import { Navegacion } from '../../platform/navegacion.service';
import { ProyeccionStore } from '../../state/proyeccion.store';
import { dateAFecha, fechaADate, fechaParaMostrar } from '../fecha-calendario';
import {
  ALERTAS,
  ERROR_GENERACION,
  ETIQUETA_DISPONIBLE,
  OPCIONES_BENEFICIO,
  SUBTITULO,
  TEXTO_TRAMITE,
  TITULO,
  VARIANTE_ALERTA,
} from './textos';

@Component({
  selector: 'app-proyeccion-page',
  standalone: true,
  imports: [NgTemplateOutlet, FormsModule, ButtonModule, CalendarModule, ProgressSpinnerModule],
  providers: [ProyeccionStore],
  templateUrl: './proyeccion-page.component.html',
  styleUrl: './proyeccion-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyeccionPageComponent implements OnInit {
  protected readonly store = inject(ProyeccionStore);
  private readonly navegacion = inject(Navegacion);
  protected readonly vista = this.store.vista;

  protected readonly alertas = ALERTAS;
  protected readonly variantes = VARIANTE_ALERTA;
  protected readonly errorGeneracion = ERROR_GENERACION;
  protected readonly textoTramite = TEXTO_TRAMITE;
  protected readonly titulo = TITULO;
  protected readonly subtitulo = SUBTITULO;
  protected readonly etiquetaDisponible = ETIQUETA_DISPONIBLE;
  protected readonly opciones = OPCIONES_BENEFICIO;
  protected readonly mostrarFecha = fechaParaMostrar;

  protected readonly controlesDeshabilitados = computed(() => this.store.seleccion() === null);

  protected readonly fechaCalendario = computed(() => {
    const seleccion = this.store.seleccion();

    return seleccion ? fechaADate(seleccion.fecha) : null;
  });

  protected readonly fechaMinimaCalendario = computed(() => {
    const fecha = this.store.fechaMinimaElegida();

    return fecha ? fechaADate(fecha) : undefined;
  });

  ngOnInit(): void {
    this.store.cargar();
  }

  protected iniciarTramite(): void {
    this.navegacion.ir(environment.solicitudJubilacionUrl);
  }

  protected elegirFecha(date: Date): void {
    this.store.elegirFecha(dateAFecha(date));
  }
}
