// Repositorio de pedidos: guarda y consulta pedidos con sus detalles en SQLite.
const { db, enTransaccion } = require('./conexion');

const insertarPedido = db.prepare(
    'INSERT INTO pedidos (nombre, correo, fecha, total) VALUES (?, ?, ?, ?)');
const insertarDetalle = db.prepare(`
    INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario)
    VALUES (?, ?, ?, ?)`);
const consultarPedidos = db.prepare(
    'SELECT id, nombre, correo, fecha, total FROM pedidos ORDER BY id DESC');
const consultarDetalles = db.prepare(`
    SELECT d.pedido_id, d.producto_id, p.nombre, d.cantidad, d.precio_unitario,
           d.cantidad * d.precio_unitario AS subtotal
    FROM detalle_pedido d
    JOIN productos p ON p.id = d.producto_id
    ORDER BY d.pedido_id, d.id`);

// Pedido y detalles en una sola transacción: o se guarda todo o nada.
function guardar({ nombre, correo, fecha, total, items }) {
    return enTransaccion(() => {
        const resultado = insertarPedido.run(nombre, correo, fecha, total);
        const pedidoId = Number(resultado.lastInsertRowid);
        for (const item of items) {
            insertarDetalle.run(pedidoId, item.producto_id, item.cantidad, item.precio_unitario);
        }
        return pedidoId;
    });
}

// Dos consultas (pedidos y detalles) y se agrupan en memoria por pedido_id.
function listarConDetalles() {
    const pedidos = consultarPedidos.all().map(p => ({ ...p, items: [] }));
    const porId = new Map(pedidos.map(p => [p.id, p]));
    for (const d of consultarDetalles.all()) {
        const { pedido_id, ...item } = d;
        porId.get(pedido_id)?.items.push(item);
    }
    return pedidos;
}

module.exports = { guardar, listarConDetalles };
