// Controlador de productos: interpreta HTTP y elige código y formato de respuesta.
const modelo = require('../models/productoModel');
const { responderJson } = require('../views/respuestas');

function listar(req, res) {
    return responderJson(res, 200, modelo.listarProductos());
}

function obtener(req, res, id) {
    const producto = modelo.obtenerProducto(id);
    return producto
        ? responderJson(res, 200, producto)
        : responderJson(res, 404, { error: 'Producto no encontrado.' });
}

module.exports = { listar, obtener };
