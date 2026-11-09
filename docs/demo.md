# Demo — Proyección de haber jubilatorio

2026-11-09 · Florencia Caballero

En unos 10 minutos, la demo muestra que el afiliado obtiene su proyección en una sola pantalla y con un clic. La primera versión corre con datos simulados y todavía no sale a producción.

## Preparación

Los links funcionan solo en la máquina donde corre la app, con `npm start` en `http://localhost:4200/`.

- [ ] Levantar la app con `npm start` y abrir un caso para confirmar que carga.
- [ ] Permitir las ventanas emergentes para `localhost`; si no, Proyectar muestra un error.
- [ ] Dejar abierta la pantalla del paso 1 del guion.
- [ ] Para mostrar el botón de trámite funcionando, estar en la red de CPBA: navega a QA (`calidadonline2`).

## Guion

Seis pasos, del caso más común a los menos frecuentes. El paso 6 es opcional si falta tiempo.

1. **El caso principal.** Abrir [futuras](http://localhost:4200/?escenario=futuras) y hacer un clic en **Proyectar**, sin cambiar nada. Se abre el PDF en otra pestaña. Mensaje: hoy son 2 pantallas y 2 clics; ahora, 1 y 1.
2. **Comparar opciones.** Abrir [parcial-menor](http://localhost:4200/?escenario=parcial-menor). Viene propuesta la Parcial, por tener la menor fecha. Cambiar a Ordinaria: la fecha pasa a su mínima. Abrir el calendario: los días anteriores están deshabilitados y la fecha no se puede escribir.
3. **Una fecha ya cumplida.** Abrir [una-hoy](http://localhost:4200/?escenario=una-hoy). Aparecen la etiqueta "Ya disponible" en Parcial y el enlace para iniciar el trámite.
4. **Las dos fechas cumplidas.** Abrir [ambas-vencidas](http://localhost:4200/?escenario=ambas-vencidas). Aparece "Ud. se encuentra en condiciones de jubilarse", y el afiliado puede seguir proyectando.
5. **Afiliado fallecido.** Abrir [fallecido](http://localhost:4200/?escenario=fallecido). Solo se ven el título y el aviso.
6. **Cuando algo falla.** Abrir [lento](http://localhost:4200/?escenario=lento) para mostrar la espera, [error-reporte](http://localhost:4200/?escenario=error-reporte) para mostrar el reintento y [error-carga](http://localhost:4200/?escenario=error-carga) para mostrar la falla al ingresar.

## Todos los casos

Las fechas se calculan a partir del día de la demo, así que cada caso muestra siempre lo mismo.

| Caso | Qué se ve | Criterio | Link |
| --- | --- | --- | --- |
| Fechas futuras | Sin alerta ni trámite; PDF con un clic | AC-21 | [futuras](http://localhost:4200/?escenario=futuras) |
| Las dos fechas en mañana | Ordinaria propuesta; sin alerta ni trámite | AC-05, AC-07, AC-30 | [futuras-iguales](http://localhost:4200/?escenario=futuras-iguales) |
| Parcial anterior a Ordinaria | Parcial propuesta; se puede cambiar beneficio y fecha | AC-06, AC-09 a AC-12 | [parcial-menor](http://localhost:4200/?escenario=parcial-menor) |
| Parcial vencida, Ordinaria futura | Parcial con fecha pasada, "Ya disponible" y trámite | AC-08 | [parcial-vencida](http://localhost:4200/?escenario=parcial-vencida) |
| Parcial hoy, Ordinaria mañana | "Ya disponible" en Parcial y trámite, sin alerta | AC-04, AC-26, AC-29 | [una-hoy](http://localhost:4200/?escenario=una-hoy) |
| Las dos fechas hoy | Alerta, trámite y Proyectar habilitado | AC-02, AC-30 | [ambas-hoy](http://localhost:4200/?escenario=ambas-hoy) |
| Las dos fechas vencidas | Alerta, trámite y Proyectar habilitado | AC-03 | [ambas-vencidas](http://localhost:4200/?escenario=ambas-vencidas) |
| Fallecido | Solo el título y el aviso rojo | AC-13 | [fallecido](http://localhost:4200/?escenario=fallecido) |
| Matrícula cancelada | Pantalla normal; se puede proyectar | AC-14 | [cancelado](http://localhost:4200/?escenario=cancelado) |
| Matrícula suspendida | Pantalla normal; se puede proyectar | AC-14 | [suspendido](http://localhost:4200/?escenario=suspendido) |
| Error al cargar los datos | Aviso "No pudimos cargar…"; Proyectar deshabilitado | AC-25 | [error-carga](http://localhost:4200/?escenario=error-carga) |
| Carga lenta (3 s) | Indicador y Proyectar deshabilitado; después, pantalla normal | AC-28 | [carga-lenta](http://localhost:4200/?escenario=carga-lenta) |
| Carga sin respuesta | Indicador durante 10 s; después, aviso "No pudimos cargar…" | AC-25 | [carga-sin-respuesta](http://localhost:4200/?escenario=carga-sin-respuesta) |
| Reporte lento (3 s) | Pestaña "Generando su proyección…", indicador y luego el PDF | AC-17 | [lento](http://localhost:4200/?escenario=lento) |
| Error al generar el reporte | Se cierra la pestaña; aviso "No pudimos generar…" y reintento | AC-18 | [error-reporte](http://localhost:4200/?escenario=error-reporte) |
| Reporte sin respuesta | A los 10 s se cierra la pestaña y aparece el aviso | AC-19 | [sin-respuesta](http://localhost:4200/?escenario=sin-respuesta) |

## Qué aclarar

Esta versión sirve para validar la pantalla: los datos y el PDF son de prueba.

- **Servicios reales:** para conectarlos faltan los contratos de los servicios, el mecanismo de sesión y la URL de publicación.
- **PDF:** el de la demo muestra solo el beneficio y la fecha elegidos. El real no cambia respecto del sitio actual.
- **Tiempo de generación:** el objetivo de menos de 2 s solo se puede medir con los servicios reales, en producción.
- **Pruebas pendientes:** los 5 navegadores, celulares reales y la prueba de usabilidad con afiliados de 60 años o más.
- **Cambio a confirmar con la Gerencia de Seguridad Social:** con las dos fechas cumplidas, el afiliado puede seguir proyectando (RF-11).
