---

description: "Lista de tareas para implementar la proyección de haber jubilatorio"
---

# Tasks: Proyección de haber jubilatorio

**Input**: Documentos de diseño en `specs/001-proyeccion-haber-jubilatorio/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: obligatorios para las reglas de decisión, por el principio II de la constitución. Cada test MUST escribirse y fallar antes de implementar. El layout y el estilo sin lógica quedan exceptuados.

**Organization**: Las tareas se agrupan por historia de usuario. La primera versión (fases 1 a 8) corre con mocks internos en desarrollo y QA y no sale a producción. La fase 9 conecta los servicios reales y está bloqueada.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: historia de usuario a la que pertenece (US1 a US5)

## Path Conventions

Proyecto Angular único en la raíz. La feature vive en `src/app/proyeccion/` y cada `*.spec.ts` va junto a su archivo. Textos literales: `contracts/pantalla-proyeccion.md`. Reglas y transiciones: `data-model.md`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Crear el proyecto Angular, que todavía no existe en el repositorio

- [ ] T001 Crear package.json con Angular 18.2, TypeScript ~5.5, RxJS ~7.8, zone.js ~0.14, PrimeNG ^17.18, PrimeFlex ^3.3, PrimeIcons ^7, Chart.js ^4.4, Karma ~6.4, Jasmine ~5.2 y @angular-builders/custom-webpack compatible con Angular 18, con los scripts `start`, `test` y `build`
- [ ] T002 Crear angular.json con `@angular-builders/custom-webpack:browser`, dev-server y karma; salida `./build_package`; `customWebpackConfig` en `config/webpack.custom.js`; configuraciones `production` (por defecto en build, reemplaza `environment.ts` por `environment.prod.ts`), `qa` (reemplaza por `environment.qa.ts`, también en serve) y `development` (por defecto en serve)
- [ ] T003 [P] Crear tsconfig.json, tsconfig.app.json y tsconfig.spec.json en modo estricto en la raíz del repositorio
- [ ] T004 [P] Crear config/webpack.custom.js con una configuración adicional vacía que exporte un objeto válido
- [ ] T005 [P] Crear karma.conf.js con Jasmine y el navegador ChromeHeadless, tomando la ruta de Chrome de la variable `CHROME_BIN`
- [ ] T006 Crear src/index.html, src/main.ts, src/app/app.config.ts y src/app/app.component.ts como aplicación standalone mínima, sin router (research R9), y src/app/app.component.spec.ts con un test que compruebe que el componente se crea
- [ ] T007 [P] Crear src/styles.scss con el tema de PrimeNG, PrimeFlex, PrimeIcons y texto base de 18 px (RNF-04)
- [ ] T008 Instalar dependencias generando package-lock.json y comprobar que `npm test` y `npm run build` terminan sin errores; requiere Chrome instalado en la máquina

**Checkpoint**: el proyecto compila y Karma corre

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tipos, reloj, puerto de servicios y configuración por ambiente

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta completar esta fase

- [ ] T009 Crear src/app/proyeccion/domain/tipos.ts con `FechaIso` ("Texto `YYYY-MM-DD`", "Fecha calendario, sin hora"), `TipoBeneficio` (`ordinaria` o `parcial`, "Solo estos dos"), `EstadoMatricula` (`activa`, `cancelado`, `suspendido` o `fallecido`; "Solo `fallecido` impide proyectar"), `FechasMinimas` (`ordinaria` y `parcial`, "Las dos son obligatorias"), `SeleccionProyeccion` ("`fecha` ≥ fecha mínima del beneficio (RF-04); sin máximo") y `ReportePdf` (Blob, "No se persiste")
- [ ] T010 [P] Escribir tests que fallen en src/app/proyeccion/platform/reloj-argentina.service.spec.ts: devuelve `YYYY-MM-DD` en zona `America/Argentina/Buenos_Aires` e incluye un instante en que la fecha UTC ya cambió y la de Argentina no
- [ ] T011 Implementar `RelojArgentina.hoy()` con `Intl.DateTimeFormat` en src/app/proyeccion/platform/reloj-argentina.service.ts (research R3)
- [ ] T012 [P] Crear la clase abstracta `ProyeccionGateway` con `obtenerEstadoMatricula()`, `obtenerFechasMinimas()` y `generarReporte(seleccion)`, cada una con un `Observable` de resultado único, en src/app/proyeccion/data/proyeccion.gateway.ts (contracts/proyeccion-gateway.md)
- [ ] T013 Crear `ProyeccionEnMemoriaGateway`, su función de providers y los escenarios de quickstart.md elegidos por `?escenario=` (por defecto `futuras`), con fechas relativas a `RelojArgentina` y un PDF de prueba, en src/app/proyeccion/data/en-memoria/proyeccion-en-memoria.gateway.ts; la palabra `escenario` MUST NOT aparecer fuera de esta carpeta
- [ ] T014 [P] Escribir tests que fallen en src/app/proyeccion/data/proyeccion-http.gateway.spec.ts: las tres operaciones informan error y no hacen llamadas HTTP
- [ ] T015 Implementar `ProyeccionHttpGateway` temporal que informa error en todas las operaciones, y su función de providers, en src/app/proyeccion/data/proyeccion-http.gateway.ts (research R2)
- [ ] T016 Crear src/environments/environment.ts con `production: false`, los providers del gateway en memoria y `solicitudJubilacionUrl` igual a `http://calidadonline2/apps/Main#/BeneficiosPrecarga/SolicitudJubilacion/Index`
- [ ] T017 [P] Crear src/environments/environment.qa.ts con `production: false`, los providers del gateway en memoria y `solicitudJubilacionUrl` igual a `http://calidadonline2/apps/Main#/BeneficiosPrecarga/SolicitudJubilacion/Index`
- [ ] T018 [P] Crear src/environments/environment.prod.ts con `production: true`, los providers de `ProyeccionHttpGateway` y `solicitudJubilacionUrl` igual a `https://www.cpbaonline.com.ar/apps/Main#/BeneficiosPrecarga/SolicitudJubilacion/Index`; MUST NOT importar mocks ni contener URLs de Postman
- [ ] T019 Registrar `environment.gatewayProviders` en src/app/app.config.ts

**Checkpoint**: la base está lista y las historias pueden empezar

---

## Phase 3: User Story 1 - Generar la proyección con los valores propuestos (Priority: P1) 🎯 MVP

**Goal**: Con una sola pantalla y un clic, el afiliado obtiene el PDF con los valores propuestos

**Independent Test**: con `?escenario=futuras`, hacer un clic en **Proyectar** sin cambiar valores y verificar que se abre el PDF

### Tests for User Story 1 ⚠️

> **NOTE: Escribir estos tests PRIMERO y comprobar que FALLEN antes de implementar**

- [ ] T020 [P] [US1] Escribir tests de preselección en src/app/proyeccion/domain/preseleccion.spec.ts: AC-06 (Parcial menor), AC-07 (iguales, Ordinaria) y AC-08 (Parcial anterior a hoy se preselecciona igual)
- [ ] T021 [P] [US1] Escribir tests en src/app/proyeccion/domain/vista-pantalla.spec.ts para las filas "Cargando" (sin alerta, sin botón de trámite, Proyectar deshabilitado), "Falla de carga" (mensaje RF-13, sin botón de trámite, Proyectar deshabilitado) y "Ninguna fecha cumplida" (sin alerta, sin botón, Proyectar habilitado), incluido Proyectar deshabilitado durante `generando`
- [ ] T022 [P] [US1] Escribir tests en src/app/proyeccion/platform/pestana-reporte.service.spec.ts con `window` simulado: abre con `window.open` sin `noopener`, escribe "Generando su proyección…", muestra el PDF navegando a él, cierra la pestaña, devuelve nulo si el navegador la bloquea y libera el enlace temporal 60 s después de cargar el PDF
- [ ] T023 [US1] Escribir tests en src/app/proyeccion/state/proyeccion.store.spec.ts con gateway simulado: carga exitosa (AC-01), `errorCarga` ante falla, sesión vencida o 10 s sin respuesta con `fakeAsync` (AC-25), preselección, generación con la selección (AC-15, AC-21), segundo clic sin nueva solicitud (AC-17), error con cierre de pestaña y reintento (AC-18), plazo de 10 s con `fakeAsync` y respuesta tardía descartada (AC-19) y pestaña bloqueada sin pedir el reporte (AC-27)
- [ ] T024 [P] [US1] Escribir tests en src/app/proyeccion/ui/proyeccion-page/proyeccion-page.component.spec.ts: muestra las dos fechas mínimas (AC-01), beneficio y fecha propuestos, indicador de carga durante la generación (AC-17) y durante la carga inicial (AC-28), mensajes literales de RF-10 y RF-13 y sin control de reintento de carga (AC-25)

### Implementation for User Story 1

- [ ] T025 [P] [US1] Implementar la preselección en src/app/proyeccion/domain/preseleccion.ts (RF-07): "Si son iguales, se elige `ordinaria`"
- [ ] T026 [P] [US1] Implementar `calcularVista` para las filas de T021, incluida "Cargando", en src/app/proyeccion/domain/vista-pantalla.ts
- [ ] T027 [P] [US1] Implementar `PestanaReporte` en src/app/proyeccion/platform/pestana-reporte.service.ts (research R4), liberando el enlace temporal del PDF 60 s después de cargarlo
- [ ] T028 [US1] Implementar `ProyeccionStore` con signals y estados `cargando`, `lista`, `errorCarga` e `inactiva`, `generando`, `error` en src/app/proyeccion/state/proyeccion.store.ts, con la secuencia de carga de data-model.md (primero el estado y luego las fechas) y `timeout(10_000)` sobre toda la secuencia; `window.open` MUST ejecutarse de forma sincrónica en el clic y el plazo de la generación con `timeout(10_000)` (research R5)
- [ ] T029 [US1] Implementar la pantalla con beneficio y fecha como texto, botón **Proyectar**, indicador y `p-message` en src/app/proyeccion/ui/proyeccion-page/proyeccion-page.component.ts y proyeccion-page.component.html, sin reglas de decisión en la plantilla
- [ ] T030 [US1] Mostrar la pantalla desde src/app/app.component.ts y proveer `ProyeccionStore` a nivel de la pantalla
- [ ] T031 [US1] Comprobar con `npm start` los escenarios `futuras`, `futuras-iguales`, `parcial-menor`, `parcial-vencida`, `error-carga`, `lento`, `error-reporte`, `sin-respuesta`, `carga-lenta` y `carga-sin-respuesta` de specs/001-proyeccion-haber-jubilatorio/quickstart.md

**Checkpoint**: la Historia 1 funciona de punta a punta con mocks

---

## Phase 4: User Story 2 - Elegir otro beneficio u otra fecha (Priority: P2)

**Goal**: El afiliado cambia beneficio o fecha antes de proyectar

**Independent Test**: con `?escenario=parcial-menor`, cambiar beneficio y fecha, y verificar la fecha resultante y los días disponibles

### Tests for User Story 2 ⚠️

- [ ] T032 [P] [US2] Escribir tests en src/app/proyeccion/domain/seleccion.spec.ts: el cambio de beneficio reemplaza la fecha por la mínima (AC-09), acepta F + 1 año (AC-10), acepta F y rechaza F − 1 (AC-11), sin fecha máxima
- [ ] T033 [P] [US2] Escribir tests en src/app/proyeccion/ui/fecha-calendario.spec.ts: conversión de `FechaIso` a `Date` local y viceversa sin corrimiento de un día
- [ ] T034 [US2] Agregar a src/app/proyeccion/state/proyeccion.store.spec.ts tests de cambio de beneficio y de fecha, y de que el reporte usa la selección vigente
- [ ] T035 [US2] Agregar a src/app/proyeccion/ui/proyeccion-page/proyeccion-page.component.spec.ts tests del selector: entrada de solo lectura (AC-12), fecha mínima aplicada (AC-11) y sin máximo

### Implementation for User Story 2

- [ ] T036 [P] [US2] Implementar `cambiarBeneficio` y `elegirFecha` en src/app/proyeccion/domain/seleccion.ts (RF-03, RF-04, RF-12)
- [ ] T037 [P] [US2] Implementar la conversión de fechas en src/app/proyeccion/ui/fecha-calendario.ts (research R3)
- [ ] T038 [US2] Agregar las acciones de cambio a src/app/proyeccion/state/proyeccion.store.ts
- [ ] T039 [US2] Reemplazar el texto por `p-selectButton` y `p-calendar` con `readonlyInput`, `minDate` y sin `maxDate` en src/app/proyeccion/ui/proyeccion-page/proyeccion-page.component.html y proyeccion-page.component.ts (research R7)

**Checkpoint**: las Historias 1 y 2 funcionan

---

## Phase 5: User Story 3 - Afiliado en condiciones de jubilarse (Priority: P2)

**Goal**: El afiliado ve el acceso al trámite y, con las dos fechas cumplidas, el aviso, y puede proyectar en todos los casos

**Independent Test**: con los escenarios `ambas-hoy`, `ambas-vencidas`, `una-hoy` y `futuras`, verificar alerta, botón de trámite y **Proyectar**

### Tests for User Story 3 ⚠️

- [ ] T040 [P] [US3] Agregar a src/app/proyeccion/domain/vista-pantalla.spec.ts las filas "Las dos fechas cumplidas" (alerta RF-11, trámite, Proyectar habilitado; AC-02, AC-03) y "Solo una fecha cumplida" (sin alerta, trámite, Proyectar habilitado; AC-04), y el caso de ninguna cumplida con las dos en mañana (AC-05)
- [ ] T041 [P] [US3] Escribir tests en src/app/proyeccion/platform/navegacion.service.spec.ts: navega en la misma pestaña a la URL recibida
- [ ] T042 [US3] Agregar a src/app/proyeccion/ui/proyeccion-page/proyeccion-page.component.spec.ts tests de textos literales de alerta y botón, y de que el clic navega a `environment.solicitudJubilacionUrl` (AC-26)

### Implementation for User Story 3

- [ ] T043 [P] [US3] Completar `calcularVista` con las filas de T040 en src/app/proyeccion/domain/vista-pantalla.ts ("Cumplida" significa fecha mínima ≤ `hoy`)
- [ ] T044 [P] [US3] Implementar `Navegacion` con `window.location.assign` en src/app/proyeccion/platform/navegacion.service.ts
- [ ] T045 [US3] Agregar la alerta y el botón de trámite en src/app/proyeccion/ui/proyeccion-page/proyeccion-page.component.html y proyeccion-page.component.ts

**Checkpoint**: la Historia 3 funciona con los escenarios indicados

---

## Phase 6: User Story 4 - Afiliado con estado matricular fallecido (Priority: P2)

**Goal**: Con estado "fallecido" se informa que no es posible proyectar; los demás estados proyectan con normalidad

**Independent Test**: con los escenarios `fallecido`, `cancelado` y `suspendido`, verificar alerta y **Proyectar**

### Tests for User Story 4 ⚠️

- [ ] T046 [P] [US4] Agregar a src/app/proyeccion/domain/vista-pantalla.spec.ts la fila "`fallecido`, con cualquier fecha" (alerta RF-05, sin alerta RF-11, sin trámite, Proyectar deshabilitado; AC-13) y `activa`, `cancelado` y `suspendido` habilitados (AC-14)
- [ ] T047 [P] [US4] Agregar a src/app/proyeccion/state/proyeccion.store.spec.ts tests de que con `fallecido` se pasa al estado `fallecido` y no se llama a `obtenerFechasMinimas()` (RF-05)
- [ ] T048 [US4] Agregar a src/app/proyeccion/ui/proyeccion-page/proyeccion-page.component.spec.ts tests del texto literal de RF-05 y de que beneficio y fecha quedan sin valores y no se pueden operar

### Implementation for User Story 4

- [ ] T049 [P] [US4] Completar `calcularVista` con la fila de fallecido en src/app/proyeccion/domain/vista-pantalla.ts
- [ ] T050 [P] [US4] Agregar el estado `fallecido` a src/app/proyeccion/state/proyeccion.store.ts: con ese estado no se piden las fechas mínimas
- [ ] T051 [US4] Agregar la alerta de fallecido y deshabilitar los controles en src/app/proyeccion/ui/proyeccion-page/proyeccion-page.component.html

**Checkpoint**: las cuatro historias funcionales están completas

---

## Phase 7: User Story 5 - Uso cómodo en cualquier dispositivo y a cualquier edad (Priority: P2)

**Goal**: La pantalla cumple los umbrales de RNF-03, RNF-04 y RNF-05

**Independent Test**: revisar la pantalla en los tamaños y navegadores indicados, y medir contraste, texto y áreas táctiles

Sin tests unitarios: es layout y estilo, exceptuados por el principio II.

- [ ] T052 [US5] Aplicar el diseño "Opción A — Tarjeta única guiada" y el responsive de 360 a 1920 px, con **Proyectar** visible sin scroll desde 360×640, en src/app/proyeccion/ui/proyeccion-page/proyeccion-page.component.scss
- [ ] T053 [US5] Ajustar en src/app/proyeccion/ui/proyeccion-page/proyeccion-page.component.scss los componentes de PrimeNG: contraste ≥ 4,5:1 (texto normal) y ≥ 3:1 (texto grande), texto ≥ 18 px, áreas táctiles ≥ 44×44 px y separación ≥ 8 px
- [ ] T054 [US5] Agregar etiquetas accesibles a selectores, indicador y alertas en src/app/proyeccion/ui/proyeccion-page/proyeccion-page.component.html
- [ ] T055 [US5] (manual: la realiza una persona) Crear specs/001-proyeccion-haber-jubilatorio/checklists/verificacion-manual.md y registrar ahí la verificación de AC-22 en 360×640, 768×1024, 1024×768 y 1920×1080
- [ ] T056 [US5] (manual: la realiza una persona) Auditar con axe y medir los elementos (AC-23), registrando el resultado en specs/001-proyeccion-haber-jubilatorio/checklists/verificacion-manual.md
- [ ] T057 [US5] (manual: la realiza una persona) Ejecutar en los 5 navegadores AC-02 a AC-14, AC-17 a AC-19, AC-21 y AC-25 a AC-28 con mocks, en los navegadores a los que aplican (AC-24), registrando el resultado en specs/001-proyeccion-haber-jubilatorio/checklists/verificacion-manual.md
- [ ] T058 [US5] (manual: la realiza una persona) Comprobar en Chrome Android y Safari iOS con dispositivos reales que el PDF se abre y no queda solo como descarga (AC-16), registrando el resultado en specs/001-proyeccion-haber-jubilatorio/checklists/verificacion-manual.md
- [ ] T059 [US5] (manual: la realiza una persona) Realizar la prueba de usabilidad con afiliados de 60 años o más (SC-007), registrando el resultado en specs/001-proyeccion-haber-jubilatorio/checklists/verificacion-manual.md

**Checkpoint**: la pantalla cumple los requisitos visuales

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Cierre de la primera versión

- [ ] T060 Correr `npm test` y corregir fallas en src/app/proyeccion/
- [ ] T061 Comprobar que `npm run build -- -c qa` termina sin errores y genera build_package/
- [ ] T062 Correr `npm run build` después del build de QA y ejecutar los dos `grep` de "Verificación de producción sin mocks" de specs/001-proyeccion-haber-jubilatorio/quickstart.md, sin coincidencias
- [ ] T063 Revisar src/ para confirmar que no hay credenciales ni tokens (principio III), que los `environment*.ts` solo tienen configuración no secreta y que `src/app/proyeccion/domain/` no importa código de `ui/`, `data/` ni `platform/`
- [ ] T064 Recorrer los escenarios de specs/001-proyeccion-haber-jubilatorio/quickstart.md en QA con `npm start -- -c qa`

**Checkpoint**: primera versión completa. **No sale a producción**

---

## Phase 9: Integración con los servicios reales (BLOQUEADA)

**Purpose**: Conectar la primera versión a los servicios actuales. Es requisito para salir a producción

**⚠️ BLOQUEADA**: cada tarea indica qué dato de `plan.md` necesita (B1 contratos, B2 sesión, B3 publicación). No empezar sin ese dato ni suponer formatos.

- [ ] T065 Escribir tests que fallen en src/app/proyeccion/data/proyeccion-http.gateway.spec.ts con los contratos reales, incluyendo que un estado desconocido o una fecha ausente se informan como error (bloqueada por B1 y B2)
- [ ] T066 Reemplazar la versión temporal de `ProyeccionHttpGateway` por llamadas reales con la sesión del sitio actual, sin guardar credenciales, en src/app/proyeccion/data/proyeccion-http.gateway.ts (bloqueada por B1 y B2)
- [ ] T067 Configurar la publicación y el `base href` en angular.json y src/index.html (bloqueada por B3)
- [ ] T068 Pasar QA a los servicios reales o a servidores mock de Postman, quitando la importación del gateway en memoria de src/environments/environment.qa.ts (bloqueada por B1)
- [ ] T069 (manual: la realiza una persona) Verificar en QA AC-01 con datos reales y AC-25 y RF-10 con sesión vencida en los 5 navegadores, y AC-15 y SC-005 contra el sitio actual en los 3 de escritorio (AC-24), registrando el resultado en specs/001-proyeccion-haber-jubilatorio/checklists/verificacion-manual.md (bloqueada por B1, B2 y B3)
- [ ] T070 (manual: la realiza una persona) Medir en producción, del 01/03/2027 al 31/03/2027, SC-001, SC-002, AC-20 y SC-003 con al menos 20 pruebas manuales desde el navegador, con el p95 por rango más cercano, registrando el resultado en specs/001-proyeccion-haber-jubilatorio/checklists/verificacion-manual.md (bloqueada por T066 y T067; requiere la salida a producción)
- [ ] T071 (manual: la realiza una persona) Medir SC-004 del 01/03/2027 al 31/03/2027 con la misma fuente de la tabla del PRD, sin contar las pruebas manuales, registrando el resultado en specs/001-proyeccion-haber-jubilatorio/checklists/verificacion-manual.md (requiere la salida a producción)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Fase 1)**: sin dependencias; requiere Chrome instalado para T008
- **Foundational (Fase 2)**: depende de Setup y bloquea todas las historias
- **User Stories (Fases 3 a 7)**: dependen de Foundational
- **Polish (Fase 8)**: depende de las historias completas
- **Integración (Fase 9)**: depende de la Fase 8 y de los datos B1 a B3

### User Story Dependencies

- **US1 (P1)**: empieza después de Foundational y crea la pantalla y `ProyeccionStore`
- **US2 (P2)**: depende de T028 y T029
- **US3 (P2)**: depende de T026 y T029
- **US4 (P2)**: depende de T026, T028 y T029
- **US5 (P2)**: T052 a T054 dependen de T029; T055 a T059 necesitan US1 a US4 completas para verificar la pantalla final

### Within Each User Story

- Los tests se escriben y fallan antes de implementar
- Dominio, luego plataforma, estado y por último UI
- Las tareas que tocan el mismo archivo van en orden, sin [P]

### Parallel Opportunities

- Setup: T003, T004, T005 y T007
- Foundational: T010, T012 y T014; T017 y T018
- Tests de cada historia marcados [P], y la implementación de dominio y plataforma marcada [P]
- US2, US3 y US4 pueden repartirse una vez completa US1, coordinando las ediciones en `proyeccion-page.component.html`, `proyeccion.store.ts` y `vista-pantalla.ts`

---

## Parallel Example: User Story 1

```bash
# Tests que se escriben a la vez:
Task: "Tests de preselección en src/app/proyeccion/domain/preseleccion.spec.ts"
Task: "Tests de la vista en src/app/proyeccion/domain/vista-pantalla.spec.ts"
Task: "Tests de la pestaña en src/app/proyeccion/platform/pestana-reporte.service.spec.ts"
Task: "Tests de la pantalla en src/app/proyeccion/ui/proyeccion-page/proyeccion-page.component.spec.ts"

# Implementaciones de dominio y plataforma:
Task: "Preselección en src/app/proyeccion/domain/preseleccion.ts"
Task: "Vista en src/app/proyeccion/domain/vista-pantalla.ts"
Task: "Pestaña en src/app/proyeccion/platform/pestana-reporte.service.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar las fases 1 y 2
2. Completar la Fase 3 (US1)
3. **Detenerse y validar** con el escenario `futuras`
4. Demostrar con mocks en desarrollo o QA; no sale a producción

### Incremental Delivery

1. Setup + Foundational: base lista
2. US1: MVP demostrable con mocks
3. US2, US3 y US4: cada una se valida con sus escenarios
4. US5 y Polish: primera versión completa en QA
5. Fase 9, al tener B1 a B3: integración real y salida a producción

---

## Notes

- [P] = archivos distintos, sin dependencias pendientes
- Comprobar que los tests fallen antes de implementar
- `/speckit-implement` deja sin marcar las tareas manuales
- Cada commit incluye el test y su implementación, con `npm test` en verde
- La palabra `escenario` y la clase `ProyeccionEnMemoriaGateway` no pueden llegar al build de producción
- No inventar endpoints ni formatos: la Fase 9 espera los contratos reales
- Fuera de estas tareas: revisar el diseño aprobado si muestra **Proyectar** deshabilitado con las dos fechas cumplidas, y avisar del cambio de RF-11 a la Gerencia de Seguridad Social
