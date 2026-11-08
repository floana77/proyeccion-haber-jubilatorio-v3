# Proyección de Haber Jubilatorio Constitution

## Core Principles

### I. Alcance limitado al PRD vigente

El PRD vigente es `docs/PRD-001-proyeccion-haber-jubilatorio.md`.

- Toda funcionalidad MUST trazarse a un RF, RNF u OBJ del PRD vigente.
- Lo listado en la sección "Fuera de Alcance" del PRD MUST NOT implementarse.
- Una funcionalidad que el PRD no contempla MUST incorporarse primero al PRD; recién después
  puede especificarse o construirse.

**Razón**: el proyecto tiene fecha de release y objetivos medibles; lo que no está en el PRD no
tiene criterio de aceptación contra el cual comprobarse.

### II. Test-First para las reglas de la proyección (NON-NEGOTIABLE)

Las reglas de decisión del frontend se desarrollan test-first:

- Preselección del beneficio y de la fecha (RF-07).
- Alertas y botón de trámite según estado y fechas mínimas (RF-02, RF-05, RF-11).
- Cambio de beneficio y límite de la fecha elegible (RF-03, RF-04).
- Estados del botón **Proyectar**, manejo de error y timeout (RF-09, RF-10).

Para estas reglas, el test unitario MUST escribirse y fallar antes de la implementación, y
MUST derivarse de los criterios de aceptación que aplican. El layout y el estilo sin lógica de
decisión quedan exceptuados.

**Razón**: un error en estas reglas le muestra a un afiliado una opción o una fecha incorrecta
sobre su jubilación.

### III. Sin secretos en el código ni en el bundle

- Credenciales, tokens y claves MUST NOT estar en el repositorio, ni siquiera en los archivos
  de `src/environments/`.
- Los archivos de `src/environments/` MUST contener solo configuración no secreta, como URLs.
- Las credenciales de herramientas de build o CI MUST leerse de variables de entorno de ese
  proceso y MUST NOT incorporarse al bundle del navegador.

**Razón**: todo lo que entra en el bundle de una aplicación Angular es legible por cualquiera
que abra el sitio, por lo que una variable de entorno inyectada en el build no protege un secreto.

### IV. Solo se consumen los servicios y la sesión actuales

- El proyecto MUST NOT crear ni modificar endpoints o servicios backend.
- El proyecto MUST NOT cambiar el cálculo del haber ni el contenido o diseño del PDF.
- El proyecto MUST NOT implementar login ni manejo de sesión propio: MUST usar la sesión del
  sitio actual.

**Razón**: el backend, el cálculo y el PDF se actualizan en una segunda etapa, y el PDF debe
contener los mismos datos que genera el sitio actual (AC-15).

### V. Mockups fuera de producción

- Los mockups y datos de prueba MUST usarse solo en desarrollo y QA.
- Las URLs de los servidores mock de Postman MUST estar solo en `environment.ts` o
  `environment.qa.ts`.
- `environment.prod.ts` MUST NOT apuntar a un servidor mock.

**Razón**: un afiliado que reciba datos de prueba en producción obtendría una proyección falsa
de su haber.

## Restricciones técnicas

- Frontend en Angular 18.2, TypeScript ~5.5, RxJS ~7.8 y zone.js ~0.14.
- UI con PrimeNG ^17.18, PrimeFlex ^3.3, PrimeIcons ^7 y Chart.js ^4.4.
- Build con `@angular-builders/custom-webpack:browser`, con configuración adicional en
  `config/webpack.custom.js` y salida en `./build_package`.
- Tests unitarios con Karma ~6.4 y Jasmine ~5.2 en Chrome.
- Cada ambiente MUST configurarse por `fileReplacements` con `environment.ts`,
  `environment.qa.ts` o `environment.prod.ts`.

Un cambio de stack MUST reflejarse en `AGENTS.md` y en esta sección.

## Flujo de desarrollo

- Cada spec MUST citar los IDs del PRD que implementa.
- Cada plan MUST verificar el cumplimiento de los principios de esta constitución antes de
  pasar a tareas.
- `npm test` MUST pasar antes de integrar un cambio a `main`.
- Los archivos `.feature` (Gherkin) no se ejecutan por ahora y MUST NOT usarse como única
  evidencia de que una regla funciona.

## Governance

Esta constitución prevalece sobre cualquier otra práctica del proyecto. `AGENTS.md` conserva la
guía operativa de ejecución y MUST mantenerse coherente con ella.

**Enmiendas**: toda enmienda MUST hacerse con `/speckit-constitution`, registrar su motivo en el
mensaje de commit y actualizar la versión y la fecha de esta constitución.

**Versionado**: se aplica versionado semántico.

- MAJOR: eliminación o redefinición incompatible de un principio.
- MINOR: principio o sección nuevos, o guía ampliada de forma material.
- PATCH: aclaraciones y correcciones de redacción sin cambio semántico.

**Cumplimiento**: toda revisión de un cambio MUST verificar que respete estos principios. Los
principios no admiten excepciones: si uno no puede cumplirse, MUST enmendarse esta constitución
antes de avanzar.

**Version**: 1.0.0 | **Ratified**: 2026-11-08 | **Last Amended**: 2026-11-08
