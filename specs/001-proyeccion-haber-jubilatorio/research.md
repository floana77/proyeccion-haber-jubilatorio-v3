# Research: Proyección de haber jubilatorio

## R1. Avanzar sin los contratos de los servicios

- **Decision**: definir un puerto `ProyeccionGateway` con lo que la pantalla necesita. La
  implementación HTTP real queda bloqueada hasta tener B1 y B2.
- **Rationale**: la lógica y los tests no dependen de la forma de las respuestas, y un cambio de
  contrato queda confinado a una clase.
- **Alternatives considered**: suponer endpoints, descartado porque serían inventados; esperar los
  contratos, descartado por decisión de seguir con un plan provisional.

## R2. Ejecutar en desarrollo y QA sin servicios ni mocks de Postman

- **Decision**: en la primera versión, un gateway en memoria que solo se importa desde
  `environment.ts` y `environment.qa.ts`. Cada ambiente elige su implementación a través de su
  archivo `environment*.ts`. Hasta resolver B1 y B2, `environment.prod.ts` usa un
  `ProyeccionHttpGateway` que informa error en todas sus operaciones, para que el build de producción
  compile sin datos simulados. Cuando lleguen los contratos, QA pasa a los servicios reales o a
  Postman.
- **Rationale**: como `environment.prod.ts` no lo importa, el gateway en memoria no entra al bundle
  de producción (principio V), sin agregar reemplazos de archivos fuera de los tres ambientes.
- **Alternatives considered**: un flag booleano, descartado porque dejaría el código de prueba
  importado también en producción; usar solo Postman, descartado porque todavía no existe y necesita
  B1.

## R3. Representación de fechas y de "hoy"

- **Decision**: las fechas de dominio son textos `YYYY-MM-DD` y se comparan como texto. "Hoy" sale de
  un servicio inyectable que convierte el reloj del dispositivo a la zona
  `America/Argentina/Buenos_Aires` con `Intl.DateTimeFormat`. Solo el selector usa `Date`.
- **Rationale**: evita los corrimientos de un día propios de `Date` y permite fijar "hoy" en los
  tests de AC-02 a AC-05.
- **Alternatives considered**: `Date` en todo el dominio, descartado por esos corrimientos; una
  librería de fechas, descartada porque agrega una dependencia sin necesidad.

## R4. Apertura del PDF sin bloqueo del navegador

- **Decision**: `window.open` se llama de forma sincrónica dentro del clic en **Proyectar**, antes de
  pedir el reporte. La pestaña muestra el texto "Generando su proyección…" y, al recibir el PDF,
  navega a él. Si hay error o se vence el plazo, se cierra. Si `window.open` devuelve `null`, no se
  pide el reporte y se muestra el mensaje de RF-10. No se usa `noopener`, porque impediría controlar
  la pestaña.
- **Rationale**: es la solución definida en la clarificación. El texto de espera hace falta porque la
  pestaña nueva queda en primer plano y tapa el indicador de carga de RF-09.
- **Alternatives considered**: abrir al recibir la respuesta, descartado porque los navegadores la
  bloquean; dejar la pestaña en blanco, descartado porque parece una falla. El comportamiento real en
  Safari iOS y Chrome Android se confirma con AC-16 en dispositivos.

## R5. Plazo de 10 s, respuestas tardías y doble clic

- **Decision**: flujo RxJS con `timeout(10_000)` sobre la generación, y una sola generación activa
  controlada por `ProyeccionStore`. Al vencer el plazo se cancela la suscripción.
- **Rationale**: la cancelación descarta la respuesta tardía y el estado `generando` impide una
  segunda solicitud (AC-17, AC-19).
- **Alternatives considered**: `setTimeout` manual, descartado por exigir sincronización y limpieza
  propias.

## R6. Manejo del estado

- **Decision**: `ProyeccionStore` con signals de Angular, provisto a nivel de la pantalla.
- **Rationale**: una sola pantalla con estado acotado; se prueba sin renderizar.
- **Alternatives considered**: NgRx, descartado porque agrega una dependencia fuera del stack.

## R7. Componentes de PrimeNG

- **Decision**: `p-calendar` con `readonlyInput` y `minDate` y sin `maxDate` (RF-04); `p-selectButton`
  para el beneficio; `p-message` para alertas y errores. Los tamaños de RNF-04 se aplican con estilos
  propios sobre los de PrimeNG.
- **Rationale**: `readonlyInput` impide escribir la fecha (AC-12) y los componentes están en el stack.
- **Alternatives considered**: `p-dropdown` para el beneficio, descartado porque exige un clic más
  para ver las dos opciones y aleja el flujo de RNF-02.

## R8. Sesión del sitio actual

- **Decision**: pendiente por B2. El módulo no implementa login ni guarda credenciales. La sesión se
  aplicará solo dentro de `ProyeccionHttpGateway`.
- **Rationale**: principios III y IV. Una sesión vencida se comporta como cualquier error de servicio
  (RF-13 al ingresar, RF-10 al proyectar).

## R9. Publicación y navegación

- **Decision**: sin router, porque hay una sola pantalla. El botón de trámite navega en la misma
  pestaña a una URL definida por ambiente. La URL del módulo está pendiente por B3.
- **Rationale**: RF-02 no requiere rutas internas, y `environment*.ts` admite URLs no secretas.

## Pendientes

| ID | Pendiente | Efecto si la respuesta no es la esperada |
|----|-----------|------------------------------------------|
| B1 | Contratos de los servicios | Si el PDF llega como enlace y no como archivo, `ProyeccionHttpGateway` debe obtener el archivo o se ajusta el puerto |
| B2 | Mecanismo de sesión | Si usa un token guardado por el sitio, hay que confirmar que el módulo pueda leerlo |
| B3 | URL de publicación | Si queda en otro dominio, la sesión podría no viajar y el backend no se puede cambiar |
