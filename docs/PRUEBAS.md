# Casos de aceptación

Pruebas manuales con `curl` contra la API, el navegador (pestaña Red) y consultas a SQLite. La salida completa de las pruebas de API está en [evidencias/salida_pruebas_api.txt](evidencias/salida_pruebas_api.txt). El flujo de la interfaz (catálogo → carrito → formulario → confirmación → pedidos) se ejecutó con los scripts reales de `public/` y su salida está en [evidencias/salida_pruebas_interfaz.txt](evidencias/salida_pruebas_interfaz.txt). Las capturas del navegador se guardan en `docs/evidencias/`.

| # | Caso | Entrada o acción | Resultado esperado | Resultado observado | Evidencia |
|---|---|---|---|---|---|
| 1 | Catálogo | Abrir `/` · `GET /api/productos` | 6 productos, 200 JSON | 200, arreglo de 6 productos; la página muestra “6 productos disponibles.” | salida_pruebas_api.txt · salida_pruebas_interfaz.txt |
| 2 | Carrito | Agregar Cuaderno y Bolígrafo, cambiar Cuaderno a 3, quitar ambos | Subtotales y total se recalculan; mensaje al vaciar | Total pasa de $14.500 a $38.500; al quitar todo: “Tu carrito está vacío…” | salida_pruebas_interfaz.txt · captura `02-carrito.png` |
| 3 | Pedido válido | `POST` con Cuaderno ×2 y Bolígrafo ×1 | 201, total 26 500, 1 pedido + 2 detalles | 201, `total: 26500`, `id: 1`; en SQLite 1 fila en `pedidos` y 2 en `detalle_pedido` | salida_pruebas_api.txt (tablas al final) |
| 4 | Datos del comprador | `nombre: "   "` y luego `correo: ""` | 400 y sin registros nuevos | 400 “El nombre es obligatorio.” / 400 “El correo es obligatorio.”; no hay filas nuevas | salida_pruebas_api.txt |
| 5 | Carrito vacío | `items: []` | 400 y sin registros | 400 “El pedido debe contener al menos un producto.” | salida_pruebas_api.txt |
| 6 | Cantidad inválida | `cantidad` 0, −2, 1.5 y `"2"` | Rechazo en el servidor | 400 “La cantidad del producto 1 debe ser un entero positivo.” en los cuatro casos | salida_pruebas_api.txt |
| 7 | Producto inválido | Producto 1 (válido) + producto 99 | 400 sin pedido ni detalles parciales | 400 “El producto 99 no existe.”; `pedidos` y `detalle_pedido` sin filas nuevas | salida_pruebas_api.txt |
| 8 | Total alterado | `total: 1` y `precio_unitario: 1` falsos; Agenda repetida dos veces | El servidor usa precios de SQLite | 201 con `total: 36000` (2 × 18 000) y la Agenda agrupada en un solo detalle con cantidad 2 | salida_pruebas_api.txt |
| 9 | Persistencia y 404 | Reiniciar el servidor y `GET /api/pedidos`; `GET /api/productos/999` | Pedidos siguen con sus detalles; 404 | Tras reiniciar aparecen los pedidos 1 y 2 con sus ítems; `/api/productos/999` → 404 “Producto no encontrado.” | salida_pruebas_api.txt |

**Pruebas adicionales:** JSON mal formado → 400; cuerpo que no es objeto (`[]`) → 400; `Content-Type: text/plain` → 415; ruta inexistente → 404 JSON.

## Cómo repetirlas

```bash
# Terminal 1
npm start
# Terminal 2 — pedido válido
curl -i -H "Content-Type: application/json" \
  -d '{"nombre":"Ana Ejemplo","correo":"ana@example.com","items":[{"producto_id":1,"cantidad":2},{"producto_id":2,"cantidad":1}]}' \
  http://localhost:3000/api/pedidos
# Revisar la base
node -e "const {DatabaseSync}=require('node:sqlite');const d=new DatabaseSync('data/tienda.db');console.table(d.prepare('SELECT * FROM pedidos').all());console.table(d.prepare('SELECT * FROM detalle_pedido').all())"
```
