# Contrato: ProyeccionGateway

**Estado**: provisional. Describe lo que la pantalla necesita de los servicios actuales. No define
endpoints ni formatos reales, que están pendientes (B1 y B2 en [plan.md](../plan.md)). Los tipos
están en [data-model.md](../data-model.md).

## Operaciones

| Operación | Entrada | Resultado | Uso |
|-----------|---------|-----------|-----|
| `obtenerEstadoMatricula()` | Ninguna; el afiliado sale de la sesión | `EstadoMatricula` | Siempre, al ingresar (RF-05) |
| `obtenerFechasMinimas()` | Ninguna; el afiliado sale de la sesión | `FechasMinimas` | Al ingresar, salvo fallecido (RF-01) |
| `generarReporte(seleccion)` | `SeleccionProyeccion` | `ReportePdf` | Al hacer clic en **Proyectar** (RF-06) |

Cada operación devuelve un resultado único de forma asincrónica y admite cancelación.

## Comportamiento exigido a toda implementación

- Una falla, incluida una sesión vencida, se informa como error, sin distinguir su causa.
- Un dato que no cumpla el modelo se informa como error.
- El plazo de 10 s lo aplica `ProyeccionStore`, no el gateway.
- Ninguna implementación guarda credenciales ni datos del afiliado.

## Implementaciones

| Implementación | Ambiente | Estado |
|----------------|----------|--------|
| `ProyeccionEnMemoriaGateway` | Desarrollo y QA, en la primera versión | A construir; solo importada desde `environment.ts` y `environment.qa.ts` |
| `ProyeccionHttpGateway` | Producción; QA cuando reemplace a los mocks | **Bloqueada por B1 y B2**. Hasta entonces informa error en todas las operaciones |

## Datos pendientes para `ProyeccionHttpGateway`

Por cada operación: URL por ambiente, método, parámetros, ejemplo de respuesta y errores. Para
`generarReporte`, además, si el servicio devuelve el archivo o un enlace.
