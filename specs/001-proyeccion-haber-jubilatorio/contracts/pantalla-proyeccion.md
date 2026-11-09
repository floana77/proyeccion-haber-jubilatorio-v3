# Contrato: pantalla de proyección

Lo que el afiliado ve y puede hacer. Qué elementos aparecen en cada situación está en
[data-model.md](../data-model.md).

## Elementos

| Elemento | Comportamiento | Requerimiento |
|----------|----------------|---------------|
| Selector de beneficio | Jubilación Ordinaria o Jubilación Parcial, como dos opciones apiladas | RF-03 |
| Etiqueta "Ya disponible" | En el beneficio cumplido, si solo se cumplió uno | RF-14, AC-29, AC-30 |
| Selector de fecha | Sin ingreso por teclado; días anteriores a la mínima deshabilitados; sin máximo | RF-04, RF-12 |
| Fechas mínimas | Se muestran las dos, cada una en la opción de su beneficio | RF-01, AC-01 |
| Botón **Proyectar** | Genera el reporte con la selección | RF-06 |
| Indicador de carga | Visible mientras se cargan los datos y mientras se genera | RF-09, RF-13 |
| Botón de trámite | Navega en la misma pestaña a la URL del ambiente | RF-02, AC-26 |

## Textos literales

| Uso | Texto |
|-----|-------|
| Botón de trámite | Inicie su trámite de jubilación aquí |
| Alerta RF-05 | No es posible realizar proyección para afiliados con estado matricular fallecido |
| Alerta RF-11 | Ud. se encuentra en condiciones de jubilarse |
| Error RF-10 | No pudimos generar su proyección. Intente nuevamente. |
| Error RF-13 | No pudimos cargar sus datos. Vuelva a ingresar al módulo. |
| Pestaña en espera | Generando su proyección… |
| Etiqueta RF-14 | Ya disponible |
| Título | Su proyección de haber jubilatorio |
| Subtítulo | Elija el beneficio y la fecha para proyectar su haber jubilatorio. |
| Descripción de Ordinaria | El beneficio completo, a partir de su fecha mínima. |
| Descripción de Parcial | Combina actividad reducida con un haber proporcional. |

## URLs del botón de trámite

| Ambiente | URL |
|----------|-----|
| Producción | `https://www.cpbaonline.com.ar/apps/Main#/BeneficiosPrecarga/SolicitudJubilacion/Index` |
| Desarrollo y QA | `http://calidadonline2/apps/Main#/BeneficiosPrecarga/SolicitudJubilacion/Index` |

## Apertura del PDF

- La pestaña se abre en el mismo momento del clic en **Proyectar**.
- Si el PDF llega, se muestra en esa pestaña.
- Si hay error o pasan 10 s, la pestaña se cierra y el módulo muestra el error de RF-10.
- Si el navegador no abre la pestaña, no se pide el reporte y se muestra el error de RF-10.

## Requisitos visuales

Los umbrales de RNF-03 y RNF-04 aplican a toda la pantalla, y la composición sigue el diseño aprobado
"Opción A — Tarjeta única guiada". En celulares se omiten el subtítulo y las descripciones de los
beneficios, para que **Proyectar** se vea sin scroll vertical.
