// Acceso a datos: conexión única a SQLite, esquema, datos iniciales y transacciones.
const { DatabaseSync } = require('node:sqlite');
const fs = require('node:fs');
const path = require('node:path');
const { productosIniciales } = require('./datos_iniciales');

const archivoDb = process.env.TIENDA_DB_PATH
    ? path.resolve(process.env.TIENDA_DB_PATH)
    : path.join(__dirname, 'tienda.db');
fs.mkdirSync(path.dirname(archivoDb), { recursive: true });

const db = new DatabaseSync(archivoDb);
// esquema.sql activa las claves foráneas y crea las tres tablas si no existen.
db.exec(fs.readFileSync(path.join(__dirname, 'esquema.sql'), 'utf8'));

// INSERT OR IGNORE: reiniciar no duplica los productos sembrados.
const sembrar = db.prepare(
    'INSERT OR IGNORE INTO productos (id, nombre, descripcion, precio) VALUES (?, ?, ?, ?)');
for (const p of productosIniciales) sembrar.run(p.id, p.nombre, p.descripcion, p.precio);

// Ejecuta varias operaciones como una sola: si una falla, no queda nada guardado.
function enTransaccion(operacion) {
    db.exec('BEGIN TRANSACTION');
    try {
        const resultado = operacion();
        db.exec('COMMIT');
        return resultado;
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
}

function cerrarBase() { db.close(); }

module.exports = { db, enTransaccion, cerrarBase };
