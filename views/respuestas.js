// Presentación: formato de las respuestas JSON y entrega de archivos de interfaz.
const fs = require('node:fs');
const path = require('node:path');

function responderJson(res, codigo, datos) {
    res.writeHead(codigo, { 'Content-Type': 'application/json; charset=UTF-8' });
    res.end(JSON.stringify(datos));
}

function enviarArchivo(res, rutaRelativa, tipo) {
    const contenido = fs.readFileSync(path.join(__dirname, '..', rutaRelativa));
    res.writeHead(200, { 'Content-Type': tipo });
    res.end(contenido);
}

module.exports = { responderJson, enviarArchivo };
