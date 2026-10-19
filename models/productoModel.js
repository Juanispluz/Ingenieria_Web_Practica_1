// Modelo de producto: consulta el catálogo a través del repositorio.
const repositorio = require('../data/productoRepository');

function listarProductos() {
    return repositorio.listar();
}

// Devuelve el producto o null si el identificador no es válido o no existe.
function obtenerProducto(id) {
    if (!Number.isInteger(id) || id <= 0) return null;
    return repositorio.buscarPorId(id) ?? null;
}

module.exports = { listarProductos, obtenerProducto };
