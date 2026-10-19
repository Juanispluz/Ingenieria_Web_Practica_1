// Repositorio de productos: solo SQL parametrizado. Devuelve datos, nunca respuestas HTTP.
const { db } = require('./conexion');

const consultarTodos = db.prepare(
    'SELECT id, nombre, descripcion, precio FROM productos ORDER BY id');
const consultarPorId = db.prepare(
    'SELECT id, nombre, descripcion, precio FROM productos WHERE id = ?');

function listar() { return consultarTodos.all(); }
function buscarPorId(id) { return consultarPorId.get(id); }

module.exports = { listar, buscarPorId };
