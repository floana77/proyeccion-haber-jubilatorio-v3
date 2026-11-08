# Implementation Plan: Proyección de haber jubilatorio

**Branch**: `main` (sin rama de feature) | **Date**: 2026-11-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-proyeccion-haber-jubilatorio/spec.md`

**Estado**: plan **provisional**. El diseño y la lógica quedan definidos; la integración con los
servicios actuales está bloqueada por los puntos B1 a B3 de abajo. La primera versión usa mocks
dentro de la app en desarrollo y QA, y no sale a producción hasta conectar los servicios reales.

## Summary

Pantalla única en Angular donde el afiliado ve el beneficio y la fecha propuestos y genera el PDF
con un clic (PRD-001, RF-01 a RF-13). Las reglas de decisión son funciones puras desarrolladas
test-first. Todo acceso a los servicios actuales pasa por un único puerto (`ProyeccionGateway`),
para poder avanzar sin conocer todavía sus contratos reales.

## Technical Context

**Language/Version**: TypeScript ~5.5 sobre Angular 18.2 (Node ^18.19.1, ^20.11.1 o ^22)

**Primary Dependencies**: RxJS ~7.8, zone.js ~0.14, PrimeNG ^17.18, PrimeFlex ^3.3, PrimeIcons ^7.
Chart.js ^4.4 es parte del stack declarado, pero esta feature no lo usa.

**Storage**: N/A. El módulo no persiste datos en el navegador.

**Testing**: Karma ~6.4 + Jasmine ~5.2 en Chrome. Verificación manual para navegadores, responsive,
accesibilidad y tiempos (ver [quickstart.md](./quickstart.md)).

**Target Platform**: última versión estable de Chrome, Edge y Firefox en escritorio; Chrome en
Android y Safari en iOS (RNF-05).

**Project Type**: aplicación web, solo frontend. El repositorio todavía no tiene proyecto Angular.

**Performance Goals**: generación del reporte < 2 s (p95), medida con al menos 20 pruebas manuales
(RNF-01, SC-003). Depende de servicios que este proyecto no modifica.

**Constraints**: plazo de 10 s por generación (RF-10); 1 clic con valores propuestos (RNF-02);
360–1920 px sin scroll horizontal (RNF-03); texto ≥ 18 px, contraste AA y áreas táctiles ≥ 44×44 px
(RNF-04); build con `@angular-builders/custom-webpack:browser`, salida en `./build_package`.

**Scale/Scope**: 1 pantalla, 2 beneficios, 4 estados de matrícula, alrededor de 11 proyecciones por
mes (OBJ-04).

### Bloqueos de integración

Autorizado seguir sin estos datos. Ninguna tarea que dependa de ellos puede cerrarse hasta tenerlos,
y sin ellos el módulo no puede salir a producción.

| ID | Dato faltante | Qué bloquea |
|----|---------------|-------------|
| B1 | Contratos de los servicios: datos del afiliado y estado de matrícula, fechas mínimas, generación del PDF | `ProyeccionHttpGateway`, mocks de Postman y salida a producción |
| B2 | Cómo se autentican hoy las llamadas (cookie o token) | Envío de la sesión desde `ProyeccionHttpGateway` |
| B3 | URL y dominio donde se publica el módulo | `base href`, viabilidad de la sesión y de las llamadas entre dominios |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Cómo se cumple | Inicial | Post-diseño |
|-----------|----------------|---------|-------------|
| I. Alcance limitado al PRD | Cada decisión se traza a un RF, RNF o AC. La pestaña con texto de espera (R4) implementa RF-08 y RF-09 | Pasa | Pasa |
| II. Test-First | `domain/` y `ProyeccionStore` concentran las reglas de RF-02, 03, 04, 05, 07, 09, 10, 11 y 13, con tests que fallan primero | Pasa | Pasa |
| III. Sin secretos | Sin credenciales en el repo ni en el bundle; los `environment*.ts` tienen solo configuración no secreta. La sesión es del sitio actual | Pasa | Pasa |
| IV. Solo servicios y sesión actuales | Sin endpoints nuevos, sin login y sin cambios en el cálculo o el PDF. El puerto solo describe consumo | Pasa | Pasa |
| V. Mockups fuera de producción | El gateway en memoria solo se importa desde `environment.ts` y `environment.qa.ts`; `environment.prod.ts` nunca lo referencia y `quickstart.md` lo verifica en el build | Pasa | Pasa |

**Resultado**: sin violaciones. Los bloqueos B1 a B3 son datos faltantes, no incumplimientos.

## Project Structure

### Documentation (this feature)

```text
specs/001-proyeccion-haber-jubilatorio/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── proyeccion-gateway.md
│   └── pantalla-proyeccion.md
└── tasks.md             # Lo genera /speckit-tasks
```

### Source Code (repository root)

```text
config/
└── webpack.custom.js
src/
├── environments/
│   ├── environment.ts        # dev: gateway en memoria
│   ├── environment.qa.ts     # QA: gateway en memoria en la primera versión
│   └── environment.prod.ts   # producción: nunca mocks
└── app/
    └── proyeccion/
        ├── domain/           # Tipos y reglas puras (test-first)
        ├── state/            # ProyeccionStore: estados de carga y de generación (test-first)
        ├── data/             # Puerto ProyeccionGateway y sus implementaciones
        ├── platform/         # Reloj de Argentina y apertura de la pestaña del PDF
        └── ui/               # Pantalla con PrimeNG, sin reglas de decisión
```

Los tests unitarios (`*.spec.ts`) van junto a cada archivo.

**Structure Decision**: proyecto Angular único en la raíz, con una sola feature. Las reglas quedan
separadas de la UI y de los servicios, para cumplir el principio II y aislar los bloqueos B1 a B3 en
`data/`.

## Complexity Tracking

Sin violaciones que justificar.
