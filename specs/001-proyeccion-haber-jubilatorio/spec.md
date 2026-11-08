# Feature Specification: Proyección de haber jubilatorio

**Feature Branch**: `main` (sin rama de feature)

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "proyección de haber jubilatorio según el PRD-001"

**PRD de origen**: `docs/PRD-001-proyeccion-haber-jubilatorio.md`. Cada requerimiento y escenario
cita el ID del PRD que implementa.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generar la proyección con los valores propuestos (Priority: P1)

Un afiliado con sesión iniciada en el sitio actual entra al módulo, ve en una sola pantalla el
beneficio y la fecha propuestos y, con un clic en **Proyectar**, obtiene el PDF con la proyección
de su haber.

**Why this priority**: es el objetivo principal del proyecto: pasar de 2 pantallas y 2 clics a 1
pantalla y 1 clic.

**Independent Test**: con un afiliado en estado "activa" y las dos fechas mínimas posteriores a
hoy, entrar al módulo, hacer un clic en **Proyectar** sin cambiar ningún valor y verificar que se
abre el PDF.

**Acceptance Scenarios**:

1. (AC-01) **Dado** un afiliado con sesión iniciada en el sitio actual, **Cuando** ingresa al
   módulo, **Entonces** la pantalla muestra las fechas mínimas de Jubilación Ordinaria y Jubilación
   Parcial que corresponden a ese afiliado.
2. (AC-06) **Dado** un afiliado cuya fecha mínima de Jubilación Parcial es anterior a la de
   Ordinaria, **Cuando** ingresa al módulo, **Entonces** está preseleccionada Jubilación Parcial con
   su fecha mínima.
3. (AC-07) **Dado** un afiliado con las dos fechas mínimas iguales y posteriores a hoy, **Cuando**
   ingresa al módulo, **Entonces** está preseleccionada Jubilación Ordinaria con esa fecha.
4. (AC-08) **Dado** un afiliado con la fecha mínima de Jubilación Parcial anterior a hoy y la de
   Ordinaria posterior a hoy, **Cuando** ingresa al módulo, **Entonces** está preseleccionada
   Jubilación Parcial con su fecha mínima, aunque sea anterior a hoy.
5. (AC-21) **Dado** un afiliado con estado "activa" y las dos fechas mínimas posteriores a hoy,
   **Cuando** ingresa al módulo y, sin cambiar ningún valor, hace 1 clic en **Proyectar**,
   **Entonces** se genera el PDF.
6. (AC-15) **Dado** un afiliado con estado "activa" que eligió el beneficio B y la fecha D,
   **Cuando** hace clic en **Proyectar** en un navegador de escritorio, **Entonces** el PDF se abre
   en una nueva pestaña, muestra el beneficio B y la fecha D, y contiene los mismos datos que el PDF
   que genera el sitio actual para el mismo afiliado, beneficio y fecha.
7. (AC-16) **Dado** el mismo afiliado, **Cuando** hace clic en **Proyectar** en Chrome en Android o
   en Safari en iOS, **Entonces** el PDF se abre en una nueva pestaña o en el visor de PDF del
   dispositivo, y no queda solo como descarga.
8. (AC-17) **Dado** un servicio de proyección que tarda en responder, **Cuando** el afiliado hace
   clic en **Proyectar**, **Entonces** mientras espera se ve el indicador de carga, el botón
   **Proyectar** está deshabilitado y un segundo clic no envía otra solicitud.
9. (AC-18) **Dado** un servicio de proyección que devuelve un error, **Cuando** el afiliado hace
   clic en **Proyectar**, **Entonces** se muestra "No pudimos generar su proyección. Intente
   nuevamente." y el botón **Proyectar** vuelve a estar habilitado.
10. (AC-19) **Dado** un servicio de proyección que no responde, **Cuando** el afiliado hace clic en
    **Proyectar**, **Entonces** a los 10 s se muestra "No pudimos generar su proyección. Intente
    nuevamente." y el botón **Proyectar** vuelve a estar habilitado.
11. (AC-25) **Dado** un afiliado para el que no se puede obtener el estado de la matrícula o las
    fechas mínimas, incluso por una sesión vencida, **Cuando** ingresa al módulo, **Entonces** se
    muestra "No pudimos cargar sus datos. Vuelva a ingresar al módulo.", el botón **Proyectar** está
    deshabilitado, no se muestran las alertas de fallecido y de condiciones de jubilarse ni el botón
    de trámite, y no hay un control para reintentar la carga.

---

### User Story 2 - Elegir otro beneficio u otra fecha (Priority: P2)

El afiliado cambia el tipo de beneficio o elige una fecha de jubilación distinta de la propuesta
para comparar escenarios antes de proyectar.

**Why this priority**: amplía la utilidad de la proyección, pero el flujo principal funciona con
los valores propuestos.

**Independent Test**: con un afiliado habilitado para proyectar, cambiar el beneficio y la fecha, y
verificar la fecha resultante y los días disponibles en el selector.

**Acceptance Scenarios**:

1. (AC-09) **Dado** un afiliado con Jubilación Parcial preseleccionada y una fecha elegida distinta
   de la mínima, **Cuando** cambia a Jubilación Ordinaria, **Entonces** la fecha elegida pasa a ser
   la fecha mínima de Jubilación Ordinaria.
2. (AC-10) **Dado** un afiliado con la fecha mínima F preseleccionada, **Cuando** elige en el
   selector la fecha F + 1 año, **Entonces** la fecha elegida es F + 1 año.
3. (AC-11) **Dado** un beneficio elegido con fecha mínima F, **Cuando** el afiliado abre el selector
   de fecha, **Entonces** el día F está habilitado y el día F − 1 está deshabilitado.
4. (AC-12) **Dado** el selector de fecha, **Cuando** el afiliado intenta escribir una fecha con el
   teclado, **Entonces** la fecha elegida no cambia.

---

### User Story 3 - Afiliado en condiciones de jubilarse (Priority: P2)

Un afiliado que ya alcanzó al menos una de las fechas mínimas ve el acceso para iniciar su trámite
y, si alcanzó las dos, un aviso de que ya está en condiciones de jubilarse en lugar de poder
proyectar.

**Why this priority**: orienta al afiliado próximo a jubilarse hacia el trámite, pero no afecta a
quienes todavía no alcanzaron las fechas.

**Independent Test**: combinar fechas mínimas respecto de hoy y verificar la alerta, el botón de
trámite y el estado de **Proyectar** en cada combinación.

**Acceptance Scenarios**:

1. (AC-02) **Dado** un afiliado con las dos fechas mínimas iguales a hoy, **Cuando** ingresa al
   módulo, **Entonces** se muestra la alerta "Ud. se encuentra en condiciones de jubilarse", el
   botón **Proyectar** está deshabilitado y se muestra el botón "Inicie su trámite de jubilación
   aquí".
2. (AC-03) **Dado** un afiliado con las dos fechas mínimas anteriores a hoy, **Cuando** ingresa al
   módulo, **Entonces** se ve lo mismo que en el escenario anterior.
3. (AC-04) **Dado** un afiliado con la fecha mínima de Jubilación Parcial igual a hoy y la de
   Jubilación Ordinaria igual a mañana, **Cuando** ingresa al módulo, **Entonces** se muestra el
   botón "Inicie su trámite de jubilación aquí", no se muestra la alerta "Ud. se encuentra en
   condiciones de jubilarse" y el botón **Proyectar** está habilitado.
4. (AC-05) **Dado** un afiliado con las dos fechas mínimas iguales a mañana, **Cuando** ingresa al
   módulo, **Entonces** no se muestran el botón de trámite ni la alerta, y el botón **Proyectar**
   está habilitado.
5. (AC-26) **Dado** un afiliado que ve el botón "Inicie su trámite de jubilación aquí", **Cuando**
   hace clic en él, **Entonces** en la misma pestaña se abre la página de Solicitud de Jubilación del
   sitio actual que corresponde al ambiente.

---

### User Story 4 - Afiliado con estado matricular fallecido (Priority: P2)

Cuando el estado de la matrícula es "fallecido", el módulo informa que no es posible proyectar;
los demás estados permiten proyectar con normalidad.

**Why this priority**: evita generar una proyección que no corresponde, en una situación poco
frecuente.

**Independent Test**: ingresar con un afiliado de cada estado de matrícula y verificar la alerta y
el estado de **Proyectar**.

**Acceptance Scenarios**:

1. (AC-13) **Dado** un afiliado con estado de matrícula "fallecido", **Cuando** ingresa al módulo,
   **Entonces** se muestra la alerta "No es posible realizar proyección para afiliados con estado
   matricular fallecido", el botón **Proyectar** está deshabilitado y, aunque sus dos fechas mínimas
   sean anteriores a hoy, no se muestran la alerta "Ud. se encuentra en condiciones de jubilarse" ni
   el botón "Inicie su trámite de jubilación aquí".
2. (AC-14) **Dado** un afiliado con estado "activa", "cancelado" o "suspendido" (una prueba por
   estado) y las dos fechas mínimas posteriores a hoy, **Cuando** ingresa al módulo, **Entonces** no
   se muestra la alerta de fallecido y el botón **Proyectar** está habilitado.

---

### User Story 5 - Uso cómodo en cualquier dispositivo y a cualquier edad (Priority: P2)

Afiliados de 26 a 65 años usan el módulo desde la computadora o el celular, con texto legible y
controles fáciles de tocar.

**Why this priority**: parte de los afiliados son adultos mayores y deben poder completar el flujo
sin errores táctiles, aunque esto no cambia la lógica del flujo principal.

**Independent Test**: revisar la pantalla en los tamaños y navegadores indicados y medir contraste,
tamaño de texto y áreas táctiles.

**Acceptance Scenarios**:

1. (AC-22) **Dada** la pantalla con los valores por defecto, **Cuando** se ve en 360×640, 768×1024,
   1024×768 y 1920×1080 px, **Entonces** no hay scroll horizontal, elementos superpuestos ni textos
   cortados, el botón **Proyectar** se ve sin scroll vertical, y el PDF se abre y se puede ver con el
   visor del navegador o del dispositivo.
2. (AC-23) **Dada** la pantalla de proyección, **Cuando** se audita su accesibilidad y se miden los
   elementos, **Entonces** el contraste es ≥ 4,5:1 en el texto normal y ≥ 3:1 en el texto grande, el
   texto base mide ≥ 18 px, las áreas táctiles miden ≥ 44×44 px y están separadas por ≥ 8 px.
3. (AC-24) **Dados** los 5 navegadores requeridos, **Cuando** se ejecutan los criterios AC-01 a
   AC-19, AC-25 y AC-26, **Entonces** todos pasan en los 5.
4. (AC-20) **Dado** el período de medición en producción, **Cuando** se calcula el tiempo de
   generación del reporte, **Entonces** el p95 es menor a 2 s.

---

### Edge Cases

- **Las dos fechas mínimas son iguales y ya pasaron**: se preselecciona Jubilación Ordinaria (RF-07)
  y aplican la alerta y el bloqueo de RF-11.
- **Una fecha mínima ya pasó y la otra no**: **Proyectar** sigue habilitado y puede quedar elegida
  una fecha anterior a hoy (AC-08). En el selector, los días desde esa fecha mínima están
  habilitados aunque sean anteriores a hoy.
- **Fallecido con fechas ya cumplidas**: prevalece la alerta de fallecido (AC-13).
- **Doble clic en Proyectar**: no se envía una segunda solicitud (AC-17).
- **La respuesta llega después de los 10 s**: se descarta, para que no se abra un PDF después de
  haber mostrado el error.
- **El servicio rechaza una fecha lejana**: se aplica el mensaje de error de RF-10; el PRD no fija
  una fecha máxima en el selector.
- **El navegador bloquea la apertura del PDF**: se aplica el mensaje de error de RF-10 y **Proyectar**
  vuelve a estar habilitado.
- **La sesión vence antes de proyectar**: el servicio responde con error y se aplica RF-10.
- **Falla la carga inicial de los datos o la sesión ya venció al ingresar**: se muestra el mensaje que
  pide volver a ingresar y **Proyectar** queda deshabilitado (FR-018).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001** (RF-01): El sistema MUST obtener de los servicios actuales las fechas mínimas de
  Jubilación Ordinaria y Jubilación Parcial del afiliado al ingresar al módulo, salvo que el afiliado
  sea fallecido.
- **FR-002** (RF-02): El sistema MUST mostrar un botón con el texto "Inicie su trámite de jubilación
  aquí" si al menos una de las dos fechas mínimas es menor o igual a hoy. Al activarlo, el afiliado
  MUST ir, en la misma pestaña, a la página de Solicitud de Jubilación del sitio actual que
  corresponde al ambiente.
- **FR-003** (RF-03): Los afiliados MUST poder cambiar el tipo de beneficio entre Jubilación Ordinaria
  y Jubilación Parcial; al cambiarlo, la fecha elegida MUST reemplazarse por la fecha mínima del nuevo
  beneficio.
- **FR-004** (RF-04): El sistema MUST permitir elegir la fecha de jubilación solo desde un selector de
  fecha, sin ingreso manual, con los días anteriores a la fecha mínima del beneficio elegido
  deshabilitados.
- **FR-005** (RF-05): Si el estado de la matrícula es "fallecido", el sistema MUST mostrar la alerta
  "No es posible realizar proyección para afiliados con estado matricular fallecido", deshabilitar
  **Proyectar**, no consultar ni evaluar las fechas mínimas y no mostrar la alerta de FR-011 ni el
  botón de FR-002. Los estados "activa", "cancelado" y "suspendido" MUST permitir proyectar.
- **FR-006** (RF-06): El sistema MUST mostrar el botón **Proyectar**, que genera el reporte con el
  tipo de beneficio y la fecha elegidos.
- **FR-007** (RF-07): El sistema MUST preseleccionar el beneficio con la menor fecha mínima, junto con
  esa fecha, aunque sea anterior a hoy. Si las dos fechas mínimas son iguales, MUST preseleccionar
  Jubilación Ordinaria.
- **FR-008** (RF-08): El sistema MUST mostrar el reporte en PDF: en una nueva pestaña en navegadores
  de escritorio, y en una nueva pestaña o en el visor de PDF del dispositivo en móviles.
- **FR-009** (RF-09): El sistema MUST mostrar un indicador de carga y deshabilitar **Proyectar**
  mientras espera la respuesta del servicio de proyección.
- **FR-010** (RF-10): Si el servicio de proyección devuelve un error o no responde en 10 s, el sistema
  MUST mostrar "No pudimos generar su proyección. Intente nuevamente." y volver a habilitar
  **Proyectar** para reintentar.
- **FR-011** (RF-11): Si las dos fechas mínimas son menores o iguales a hoy, el sistema MUST mostrar
  la alerta "Ud. se encuentra en condiciones de jubilarse" y deshabilitar **Proyectar**.
- **FR-012** (RF-12): Los afiliados MUST poder elegir una fecha de jubilación distinta de la propuesta.
- **FR-013** (RNF-01): El tiempo de generación del reporte MUST ser menor a 2 s (p95), medido en
  producción desde que se solicita el reporte hasta que se recibe completo.
- **FR-014** (RNF-02): Generar el reporte con los valores propuestos MUST requerir 1 clic.
- **FR-015** (RNF-03): En anchos de 360 px a 1920 px, la pantalla MUST mostrarse sin scroll horizontal,
  sin elementos superpuestos ni textos cortados, y desde 360×640 px el botón **Proyectar** MUST verse
  sin scroll vertical con los valores propuestos. El PDF MUST poder verse en ese rango, sin cambios en
  su diseño.
- **FR-016** (RNF-04): La pantalla MUST cumplir contraste ≥ 4,5:1 para texto normal y ≥ 3:1 para texto
  grande (WCAG 2.1 AA), texto base ≥ 18 px y áreas táctiles de botones y selectores ≥ 44×44 px,
  separadas por ≥ 8 px.
- **FR-017** (RNF-05): El módulo MUST funcionar en la última versión estable de Chrome, Edge y Firefox
  en escritorio, y de Chrome en Android y Safari en iOS.
- **FR-018** (RF-13): Si no se pueden obtener al ingresar el estado de la matrícula o las fechas
  mínimas, incluso por una sesión vencida, el sistema MUST mostrar "No pudimos cargar sus datos. Vuelva
  a ingresar al módulo.", deshabilitar **Proyectar** y no mostrar las alertas de FR-005 y FR-011 ni el
  botón de FR-002. El sistema MUST NOT ofrecer un control propio para reintentar la carga.

### Key Entities *(include if feature involves data)*

- **Afiliado**: profesional de CPBA con sesión en el sitio actual. Tiene un estado de matrícula:
  "activa", "cancelado", "suspendido" o "fallecido".
- **Fecha mínima de jubilación**: primera fecha en la que el afiliado puede jubilarse, una por cada
  tipo de beneficio.
- **Tipo de beneficio**: Jubilación Ordinaria o Jubilación Parcial.
- **Selección de proyección**: tipo de beneficio y fecha de jubilación elegidos por el afiliado.
- **Reporte de proyección**: PDF con la proyección del haber para una selección; su contenido y diseño
  no cambian respecto del sitio actual.

## Success Criteria *(mandatory)*

### Measurable Outcomes

Salvo indicación, se miden en producción durante el período del 01/03/2027 al 31/03/2027.

- **SC-001** (OBJ-01): La proyección se genera desde 1 sola pantalla (hoy son 2).
- **SC-002** (OBJ-02): Con los valores propuestos, el reporte se genera con 1 clic (hoy son 2).
- **SC-003** (OBJ-03, RNF-01): El 95 % de los reportes se genera en menos de 2 s (hoy, unos 4 s
  medidos a mano).
- **SC-004** (OBJ-04): Se generan al menos 11 proyecciones por mes (hoy, mediana de 5,5).
- **SC-005** (AC-15): En el 100 % de los casos comparados antes del release, el PDF contiene los mismos
  datos que el del sitio actual para el mismo afiliado, beneficio y fecha.
- **SC-006** (AC-24): Antes del release, el 100 % de los criterios AC-01 a AC-19, AC-25 y AC-26
  pasa en los 5 navegadores.
- **SC-007** (riesgo del PRD): Antes del release se completa una prueba de usabilidad con afiliados de
  60 años o más.

## Assumptions

- La página de Solicitud de Jubilación es
  `https://www.cpbaonline.com.ar/apps/Main#/BeneficiosPrecarga/SolicitudJubilacion/Index` en producción
  y `http://calidadonline2/apps/Main#/BeneficiosPrecarga/SolicitudJubilacion/Index` en QA.
- **Hoy** es la fecha calendario en Argentina, aunque el dispositivo esté en otro huso horario.
- Los servicios actuales devuelven las dos fechas mínimas para todo afiliado no fallecido.
- El selector de fecha no tiene un máximo, porque el PRD no lo define.
- Con estado "fallecido" no hay fechas para mostrar, por lo que el beneficio y la fecha quedan sin
  valores y no se pueden operar.
- Los valores marcados en el PRD como propuestos y a validar se toman como vigentes: los 10 s de
  RF-10 y los umbrales de RNF-01, RNF-03, RNF-04 y RNF-05.
- La presentación sigue los diseños aprobados "Opción A — Tarjeta única guiada".
- **Dependencias**: login y sesión del sitio actual; servicios actuales de datos del afiliado, estado
  de matrícula, condición de jubilación, fechas mínimas y generación del PDF.
- El sitio actual no muestra el acceso al módulo a los afiliados jubilados, por lo que este caso no se
  contempla.
- **Fuera de alcance**: cambios en el cálculo del haber y en el contenido o diseño del PDF; desarrollo
  del login; beneficios distintos de Jubilación Ordinaria y Parcial; servicios o endpoints nuevos; uso
  de mockups o datos de prueba en producción.
