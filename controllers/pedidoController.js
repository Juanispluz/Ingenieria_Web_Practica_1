// Controlador de pedidos: lee la solicitud, llama al modelo y traduce el resultado a HTTP.
const modelo = require('../models/pedidoModel');
const { responderJson } = require('../views/respuestas');
const { esJson, leerJson } = require('./leerJson');

function listar(req, res) {
    return responderJson(res, 200, modelo.listarPedidos());
}

async function crear(req, res) {
    if (!esJson(req)) {
        return responderJson(res, 415, { error: 'Envía Content-Type: application/json.' });
    }
    const datos = await leerJson(req);
    try {
        const pedido = modelo.crearPedido(datos);
        console.log('Pedido registrado con id:', pedido.id);
        return responderJson(res, 201, pedido);
    } catch (error) {
        if (error instanceof modelo.ErrorValidacion) {
            return responderJson(res, 400, { error: error.message });
        }
        throw error; // Error de base de datos: lo atiende server_rutas.js con 500.
    }
}

module.exports = { listar, crear };
