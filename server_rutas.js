// Arranque: inicia el servidor HTTP y delega cada solicitud al enrutador.
const http = require('node:http');
const { atenderRuta } = require('./routes/rutas');
const { responderJson } = require('./views/respuestas');
const { cerrarBase } = require('./data/conexion');

const puerto = Number(process.env.PORT || 3000);

const servidor = http.createServer(async (req, res) => {
    console.log(req.method, req.url);
    try {
        await atenderRuta(req, res);
    } catch (error) {
        // error.status viene de leerJson (400 / 413); cualquier otro es un error interno.
        if (!error.status) console.error('Error no esperado:', error.message);
        if (res.headersSent) return res.end();
        responderJson(res, error.status || 500,
            { error: error.status ? error.message : 'Error interno del servidor.' });
    }
});

servidor.on('error', error => {
    console.error(error.code === 'EADDRINUSE'
        ? `El puerto ${puerto} está ocupado. Detén el servidor anterior con Ctrl + C.`
        : error.message);
    cerrarBase();
    process.exitCode = 1;
});

servidor.listen(puerto, '127.0.0.1', () => {
    console.log(`La Libreta disponible en http://localhost:${servidor.address().port}`);
});

function finalizar() {
    servidor.close(() => { cerrarBase(); process.exit(0); });
}
process.on('SIGINT', finalizar);
process.on('SIGTERM', finalizar);
