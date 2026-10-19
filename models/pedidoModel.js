// Modelo de pedido: reglas de negocio y cálculo del total con precios de SQLite.
// No conoce HTTP: lanza ErrorValidacion y el controlador lo traduce a 400.
const productos = require('../data/productoRepository');
const pedidos = require('../data/pedidoRepository');

class ErrorValidacion extends Error {}

function listarPedidos() {
    return pedidos.listarConDetalles();
}

function crearPedido(datos) {
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
        throw new ErrorValidacion('El cuerpo debe ser un objeto JSON con nombre, correo e items.');
    }
    const nombre = String(datos.nombre ?? '').trim();
    const correo = String(datos.correo ?? '').trim();
    if (!nombre) throw new ErrorValidacion('El nombre es obligatorio.');
    if (!correo) throw new ErrorValidacion('El correo es obligatorio.');
    if (!correo.includes('@')) throw new ErrorValidacion('El correo no tiene un formato válido.');

    if (!Array.isArray(datos.items) || datos.items.length === 0) {
        throw new ErrorValidacion('El pedido debe contener al menos un producto.');
    }

    // Decisión: los productos repetidos se agrupan sumando sus cantidades.
    const cantidades = new Map();
    for (const item of datos.items) {
        const productoId = item?.producto_id;
        const cantidad = item?.cantidad;
        if (!Number.isInteger(productoId) || productoId <= 0) {
            throw new ErrorValidacion('Cada ítem debe tener un producto_id entero positivo.');
        }
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            throw new ErrorValidacion(`La cantidad del producto ${productoId} debe ser un entero positivo.`);
        }
        cantidades.set(productoId, (cantidades.get(productoId) ?? 0) + cantidad);
    }

    // El precio sale de SQLite; cualquier precio o total enviado por el navegador se ignora.
    const items = [];
    for (const [productoId, cantidad] of cantidades) {
        const producto = productos.buscarPorId(productoId);
        if (!producto) throw new ErrorValidacion(`El producto ${productoId} no existe.`);
        items.push({
            producto_id: producto.id,
            nombre: producto.nombre,
            cantidad,
            precio_unitario: producto.precio,
            subtotal: producto.precio * cantidad
        });
    }
    const total = items.reduce((suma, item) => suma + item.subtotal, 0);
    const fecha = new Date().toISOString();

    // Solo se llega aquí si todo es válido: no quedan pedidos parciales.
    const id = pedidos.guardar({ nombre, correo, fecha, total, items });
    return { id, nombre, correo, fecha, total, items };
}

module.exports = { listarPedidos, crearPedido, ErrorValidacion };
