# Proyección de haber jubilatorio (CPBA)

Frontend nuevo del módulo de proyección de haber jubilatorio de [cpbaonline.com.ar](https://www.cpbaonline.com.ar). El afiliado ve el beneficio y la fecha propuestos y genera el PDF de su proyección en una sola pantalla y con un clic.

**Estado:** primera versión con datos simulados, para desarrollo y QA. No sale a producción hasta conectar los servicios reales: faltan los contratos de los servicios, el mecanismo de sesión y la URL de publicación. Mientras tanto, el build de producción compila sin datos simulados y muestra "No pudimos cargar sus datos. Vuelva a ingresar al módulo."

## Requisitos

- Node `^18.19.1`, `^20.11.1` o `^22`.
- Chrome, para los tests. Si no está en la ruta habitual, indicá dónde está con la variable `CHROME_BIN`.

## Cómo correrlo

```bash
npm install             # instalar dependencias
npm start               # desarrollo en http://localhost:4200
npm start -- -c qa      # configuración de QA
npm test                # tests unitarios
npm run build           # build de producción, en ./build_package
npm run build -- -c qa  # build de QA, en la misma carpeta
```

## Probar cada caso

En desarrollo y QA, el parámetro `?escenario=` de la URL elige los datos simulados. Por ejemplo:

```text
http://localhost:4200/?escenario=ambas-vencidas
```

Los 16 casos, con sus links y un guion para presentarlos, están en [docs/demo.md](docs/demo.md).

## Stack

Angular 18.2, TypeScript 5.5, RxJS 7.8, PrimeNG 17, PrimeFlex 3 y PrimeIcons 7. Tests con Karma y Jasmine en Chrome. Build con `@angular-builders/custom-webpack`.

Cada ambiente se configura con su archivo en `src/environments/`, que también elige la implementación del acceso a los servicios.

## Estructura

```text
src/app/proyeccion/
├── domain/    # Tipos y reglas de decisión, como funciones puras
├── state/     # ProyeccionStore: estados de carga y de generación del reporte
├── data/      # Puerto ProyeccionGateway y sus implementaciones
│   └── en-memoria/  # Datos simulados, solo para desarrollo y QA
├── platform/  # Fecha de Argentina, pestaña del PDF y navegación
└── ui/        # Pantalla, sin reglas de decisión
```

## Reglas del proyecto

- Las reglas de decisión se desarrollan test-first.
- `environment.prod.ts` nunca importa datos simulados ni apunta a servidores mock.
- No se crean endpoints ni se modifica el cálculo del haber o el contenido del PDF.
- No hay login propio: se usa la sesión del sitio actual.
- No se guardan secretos en el código ni en el bundle.
- Lo que el PRD no contempla se agrega primero al PRD.

El detalle está en la [constitución](.specify/memory/constitution.md) y en [AGENTS.md](AGENTS.md).

## Documentación

| Documento | Contenido |
| --- | --- |
| [PRD-001](docs/PRD-001-proyeccion-haber-jubilatorio.md) | Requerimientos y criterios de aceptación |
| [Especificación](specs/001-proyeccion-haber-jubilatorio/spec.md) | Historias de usuario y requisitos |
| [Plan](specs/001-proyeccion-haber-jubilatorio/plan.md) | Diseño técnico y bloqueos de integración |
| [Tareas](specs/001-proyeccion-haber-jubilatorio/tasks.md) | Avance de la implementación |
| [Validación](specs/001-proyeccion-haber-jubilatorio/quickstart.md) | Cómo comprobar la funcionalidad |
| [Demo](docs/demo.md) | Guion y casos para presentar |
| [Diseños](docs/disenos/) | Pantallas del diseño aprobado |
