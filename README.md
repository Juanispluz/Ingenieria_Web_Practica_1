# La Libreta — Papelería académica

Primera versión de una tienda web (práctica integradora del 20 % de Ingeniería Web). El usuario consulta útiles escolares, organiza un carrito y registra un pedido simulado, sin cobro. Se aplica OOHDM, una API HTTP con JSON, persistencia en SQLite y MVC organizado en capas.

- **Integrante:** Juan Ramírez Herrera
- **Asignatura:** Ingeniería Web · Universidad Cooperativa de Colombia
- **Docente:** Luis Miguel Gómez Meneses

## Requisitos y ejecución

- Node.js **24.11.0 o superior** (usa los módulos nativos `node:http` y `node:sqlite`). No hay dependencias externas ni se necesita `npm install`.

```bash
node --version
npm start          # o: node server_rutas.js
```

Abrir **http://localhost:3000**. Detener con `Ctrl + C`.

**Datos iniciales:** al arrancar se crea `data/tienda.db` desde `data/esquema.sql` y se insertan los seis productos de `data/datos_iniciales.js` (`INSERT OR IGNORE`, así que reiniciar no los duplica). Para empezar desde cero basta con borrar `data/tienda.db`. La variable `TIENDA_DB_PATH` permite usar otra base (por ejemplo, para pruebas).

## Estructura (MVC en capas)

```text
server_rutas.js            Arranque: crea el servidor y delega en routes/
routes/rutas.js            Método + ruta → página, recurso o acción
controllers/               HTTP: tipo de contenido, lectura JSON, códigos de estado
  productoController.js
  pedidoController.js
  leerJson.js
models/                    Reglas de negocio (sin HTTP ni SQL)
  productoModel.js
  pedidoModel.js
data/                      Acceso a datos (solo SQL parametrizado)
  conexion.js              Conexión, esquema, siembra y enTransaccion
  productoRepository.js
  pedidoRepository.js
  esquema.sql · datos_iniciales.js
views/                     index.html · carrito.html · pedidos.html · respuestas.js
public/                    styles.css · carrito-storage.js · catalogo.js · carrito.js · pedidos.js
docs/                      OOHDM, arquitectura, pruebas, aportes y diagramas
```

Dependencias: **controlador → modelo → repositorio**. El repositorio devuelve datos y nunca escribe respuestas HTTP. Detalle en [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md).

## Endpoints

| Método | Ruta | Entrada | Salida | Estados |
|---|---|---|---|---|
| GET | `/api/productos` | — | Arreglo de productos | 200 |
| GET | `/api/productos/:id` | `id` en la ruta | Un producto | 200 · 404 |
| POST | `/api/pedidos` | JSON `{nombre, correo, items:[{producto_id, cantidad}]}` | Pedido creado con ítems, subtotales y total | 201 · 400 · 415 · 500 |
| GET | `/api/pedidos` | — | Arreglo de pedidos con sus ítems (`[]` si no hay) | 200 |
| GET | `/`, `/carrito`, `/pedidos` | — | Páginas HTML | 200 |
| * | otra ruta | — | `{"error":"Ruta no encontrada."}` | 404 |

Todos los errores de la API se responden en JSON con la forma `{"error": "explicación"}`. JSON mal formado → 400; tipo de contenido distinto de `application/json` → 415; fallo de base de datos → 500.

**Solicitud de ejemplo**

```json
{"nombre":"Ana Ejemplo","correo":"ana@example.com",
 "items":[{"producto_id":1,"cantidad":2},{"producto_id":2,"cantidad":1}]}
```

**Respuesta 201**

```json
{"id":1,"nombre":"Ana Ejemplo","correo":"ana@example.com","fecha":"2026-10-19T14:36:47.778Z","total":26500,
 "items":[{"producto_id":1,"nombre":"Cuaderno","cantidad":2,"precio_unitario":12000,"subtotal":24000},
          {"producto_id":2,"nombre":"Bolígrafo","cantidad":1,"precio_unitario":2500,"subtotal":2500}]}
```

**Respuesta 400**: `{"error":"El producto 99 no existe."}`

### ¿Por qué una API HTTP orientada a recursos?

La tienda maneja pocos recursos claros (*productos* y *pedidos*) y operaciones simples de consulta y creación, que encajan directamente con los métodos HTTP (`GET` para leer, `POST` para crear) y sus códigos de estado (200, 201, 400, 404). El navegador la consume con `fetch` y JSON sin librerías adicionales. **REST** organiza el servicio en recursos identificados por URL y usa la semántica de HTTP. **SOAP** es un protocolo basado en mensajes XML con un contrato formal **WSDL**; aporta rigor y estándares empresariales, pero es pesado para este caso. **GraphQL** expone un único endpoint donde el cliente pide exactamente los campos que necesita; es útil con datos muy relacionados y clientes variados, pero añade un esquema y un servidor de consultas que esta primera versión no necesita.

## Reglas de negocio y decisiones

- Nombre y correo obligatorios después de `trim()`. El formulario usa `type="email"` y el servidor rechaza el correo vacío (y sin `@`).
- El pedido tiene al menos un ítem; cada `producto_id` existe y cada `cantidad` es un **entero positivo** (`Number.isInteger`).
- **Productos repetidos:** si llegan dos ítems con el mismo producto, **se agrupan sumando las cantidades**.
- El servidor toma los precios de SQLite y calcula subtotales y total. Cualquier `precio` o `total` enviado por el navegador se ignora.
- Si una validación falla → 400 y no se guarda nada. Pedido y detalles se insertan en **una sola transacción** (`enTransaccion`).
- La fecha (ISO 8601, UTC) la asigna el servidor; el `id` lo asigna SQLite (`AUTOINCREMENT`).
- Precios en **pesos colombianos enteros** y positivos.
- El carrito se guarda en **localStorage** (clave `la-libreta.carrito`) y solo contiene `producto_id` y `cantidad`. Se vacía únicamente tras un registro exitoso.
- Las tres vistas son **páginas separadas**; la confirmación se muestra dentro de la página del carrito.
- Información ficticia y ejecución local.

## Documentación

- [docs/OOHDM.md](docs/OOHDM.md) — diseño conceptual, navegacional, interfaz abstracta e implementación.
- [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) — capas, recorrido de GET y POST.
- [docs/PRUEBAS.md](docs/PRUEBAS.md) — casos de aceptación con evidencia.
- [docs/APORTES.md](docs/APORTES.md) — aportes del integrante.
- [docs/CONTRATO_API.md](docs/CONTRATO_API.md) — contrato entregado por el docente.

El primer commit del repositorio corresponde a la base suministrada (`Base_Ecommerce_Practica20`); los siguientes contienen el desarrollo propio.
