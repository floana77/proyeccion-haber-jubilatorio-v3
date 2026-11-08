# Quickstart: validación de la proyección

Guía para comprobar la feature una vez implementada. Las reglas están en
[data-model.md](./data-model.md) y los textos en
[contracts/pantalla-proyeccion.md](./contracts/pantalla-proyeccion.md).

## Requisitos

- Node ^18.19.1, ^20.11.1 o ^22.
- Chrome instalado, necesario para `npm test`.

## Comandos

```bash
npm install
npm test
npm start                # http://localhost:4200 con el gateway en memoria
npm run build            # producción, salida en ./build_package
npm run build -- -c qa
```

**Resultado esperado**: `npm test` pasa y los dos builds terminan sin errores.

## Escenarios en desarrollo y QA

Con `npm start` o `npm start -- -c qa`, el gateway en memoria elige los datos con el parámetro
`?escenario=` de la URL.

| Escenario | Datos | Se comprueba |
|-----------|-------|--------------|
| `futuras` | Estado activa, las dos fechas posteriores a hoy | AC-05, AC-21 |
| `futuras-iguales` | Las dos fechas iguales y posteriores a hoy | AC-07 |
| `parcial-menor` | Parcial anterior a Ordinaria | AC-06, AC-09, AC-10, AC-11, AC-12 |
| `parcial-vencida` | Parcial anterior a hoy, Ordinaria posterior | AC-08 |
| `una-hoy` | Parcial igual a hoy, Ordinaria mañana | AC-04, AC-26 |
| `ambas-hoy` | Las dos iguales a hoy | AC-02 |
| `ambas-vencidas` | Las dos anteriores a hoy | AC-03 |
| `fallecido` | Estado fallecido, fechas anteriores a hoy | AC-13 |
| `cancelado`, `suspendido` | Estado indicado, fechas posteriores a hoy | AC-14 |
| `error-carga` | Falla al obtener los datos | AC-25 |
| `lento` | El reporte tarda 3 s | AC-17 |
| `error-reporte` | El reporte falla | AC-18 |
| `sin-respuesta` | El reporte nunca responde | AC-19 |

## Verificación de producción sin mocks

Correr `npm run build` justo antes, porque el build de QA escribe en la misma carpeta y sí incluye
los mocks.

```bash
grep -iE "postman|EnMemoria" src/environments/environment.prod.ts
grep -rl "ProyeccionEnMemoria\|escenario" build_package
```

**Resultado esperado**: ninguno de los dos comandos encuentra coincidencias. La primera versión
muestra el mensaje de RF-13 en este build, porque todavía no está conectada a los servicios reales.

## Verificación manual

| Comprobación | Cómo | Criterio |
|--------------|------|----------|
| Responsive | Pantalla en 360×640, 768×1024, 1024×768 y 1920×1080 | AC-22 |
| Accesibilidad | Auditoría con axe y medición de texto y áreas táctiles | AC-23 |
| Navegadores | AC-01 a AC-19, AC-25 y AC-26 en los 5 navegadores | AC-24 |
| PDF en celular | Chrome en Android y Safari en iOS, con dispositivos reales | AC-16 |
| Usabilidad | Prueba con afiliados de 60 años o más | SC-007 |

## Requieren los servicios reales

Bloqueadas hasta resolver B1 a B3 de [plan.md](./plan.md):

| Comprobación | Criterio |
|--------------|----------|
| Datos reales del afiliado y fechas mínimas | AC-01 |
| PDF con los mismos datos que el sitio actual | AC-15, SC-005 |
| Sesión vencida al ingresar y al proyectar | AC-25, RF-10 |
| Tiempo con al menos 20 pruebas manuales en producción | AC-20, SC-003 |
