# Data Model: Proyección de haber jubilatorio

Modelo de dominio del frontend. No describe el formato de los servicios actuales, que está pendiente
(B1 en [plan.md](./plan.md)).

## Entidades

| Entidad | Campos | Reglas |
|---------|--------|--------|
| `FechaIso` | Texto `YYYY-MM-DD` | Fecha calendario, sin hora |
| `TipoBeneficio` | `ordinaria` o `parcial` | Solo estos dos (fuera de alcance otros) |
| `EstadoMatricula` | `activa`, `cancelado`, `suspendido` o `fallecido` | Solo `fallecido` impide proyectar (RF-05) |
| `FechasMinimas` | `ordinaria: FechaIso`, `parcial: FechaIso` | Las dos son obligatorias |
| `SeleccionProyeccion` | `beneficio: TipoBeneficio`, `fecha: FechaIso` | `fecha` ≥ fecha mínima del beneficio (RF-04); sin máximo |
| `ReportePdf` | Archivo PDF | No se persiste |

Un estado de matrícula desconocido o una fecha mínima ausente se tratan como carga fallida (RF-13),
porque el módulo no puede decidir qué mostrar.

## Reglas de decisión

### Secuencia de carga (RF-01, RF-05, RF-13)

1. Se obtiene el estado de la matrícula.
2. Si es `fallecido`, no se piden las fechas mínimas.
3. En otro caso, se piden las fechas mínimas.
4. Una falla en cualquiera de los pasos lleva a `errorCarga`, igual que si la secuencia completa tarda
   más de 10 s.

### Qué muestra la pantalla

`hoy` es la fecha calendario de Argentina. "Cumplida" significa fecha mínima ≤ `hoy`.

| Situación | Alerta | Botón de trámite | Proyectar |
|-----------|--------|------------------|-----------|
| Cargando | Ninguna | No | Deshabilitado |
| Falla de carga | Mensaje de RF-13 | No | Deshabilitado |
| `fallecido`, con cualquier fecha | Alerta de RF-05 | No | No se muestra, igual que los selectores |
| Las dos fechas cumplidas | Alerta de RF-11 | Sí | Habilitado |
| Solo una fecha cumplida | Ninguna | Sí | Habilitado |
| Ninguna fecha cumplida | Ninguna | No | Habilitado |

La etiqueta "Ya disponible" (RF-14) aparece en el beneficio cumplido solo en la fila "Solo una fecha
cumplida".

Durante `cargando` se ve el indicador de carga (RF-13). Durante `generando`, **Proyectar** está siempre
deshabilitado (RF-09).

### Preselección (RF-07)

- Se elige el beneficio con la menor fecha mínima, aunque sea anterior a `hoy`.
- Si son iguales, se elige `ordinaria`.
- La fecha elegida es la mínima de ese beneficio.

### Cambio de selección

- Al cambiar el beneficio, la fecha pasa a ser la mínima del nuevo beneficio (RF-03).
- Al elegir una fecha, se acepta si es ≥ a la mínima del beneficio elegido (RF-04, RF-12).

## Transiciones de estado

### Carga de la pantalla

```text
cargando ──> lista        datos válidos
cargando ──> fallecido    estado de matrícula fallecido
cargando ──> errorCarga   falla, sesión vencida, datos inválidos o 10 s sin respuesta
```

`fallecido` y `errorCarga` son finales: no hay reintento dentro del módulo (RF-13).

### Generación del reporte (solo desde `lista`)

```text
inactiva ──> generando    clic en Proyectar, pestaña abierta
inactiva ──> error        el navegador no abrió la pestaña
generando ──> inactiva    PDF recibido; se carga en la pestaña
generando ──> error       error del servicio o 10 s sin respuesta; se cierra la pestaña
error ──> generando       nuevo clic en Proyectar
```

`error` muestra el mensaje de RF-10 y deja **Proyectar** habilitado.
