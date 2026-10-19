// Apoyo HTTP del controlador: comprueba el tipo de contenido y lee un cuerpo JSON.
function errorHttp(status, mensaje) {
    const error = new Error(mensaje);
    error.status = status;
    return error;
}

function esJson(req) {
    const tipo = (req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    return tipo === 'application/json';
}

async function leerJson(req) {
    const partes = [];
    let bytes = 0;
    for await (const parte of req) {
        bytes += parte.length;
        if (bytes > 65536) throw errorHttp(413, 'La solicitud es demasiado grande.');
        partes.push(parte);
    }
    try {
        return JSON.parse(Buffer.concat(partes).toString('utf8'));
    } catch {
        throw errorHttp(400, 'El cuerpo debe ser JSON válido.');
    }
}

module.exports = { esJson, leerJson };
