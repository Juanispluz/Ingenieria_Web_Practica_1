// Enrutador: asocia método + ruta con una página, un recurso estático o una acción.
const productos = require('../controllers/productoController');
const pedidos = require('../controllers/pedidoController');
const { responderJson, enviarArchivo } = require('../views/respuestas');

const HTML = 'text/html; charset=UTF-8';
const JS = 'text/javascript; charset=UTF-8';
const archivos = {
    '/': ['views/index.html', HTML],
    '/carrito': ['views/carrito.html', HTML],
    '/pedidos': ['views/pedidos.html', HTML],
    '/styles.css': ['public/styles.css', 'text/css; charset=UTF-8'],
    '/carrito-storage.js': ['public/carrito-storage.js', JS],
    '/catalogo.js': ['public/catalogo.js', JS],
    '/carrito.js': ['public/carrito.js', JS],
    '/pedidos.js': ['public/pedidos.js', JS]
};

async function atenderRuta(req, res) {
    const ruta = new URL(req.url, 'http://localhost').pathname;

    if (req.method === 'GET' && Object.hasOwn(archivos, ruta)) {
        const [archivo, tipo] = archivos[ruta];
        return enviarArchivo(res, archivo, tipo);
    }
    if (req.method === 'GET' && ruta === '/api/productos') return productos.listar(req, res);

    const coincidencia = ruta.match(/^\/api\/productos\/(\d+)$/);
    if (req.method === 'GET' && coincidencia) return productos.obtener(req, res, Number(coincidencia[1]));

    if (req.method === 'GET' && ruta === '/api/pedidos') return pedidos.listar(req, res);
    if (req.method === 'POST' && ruta === '/api/pedidos') return pedidos.crear(req, res);

    return responderJson(res, 404, { error: 'Ruta no encontrada.' });
}

module.exports = { atenderRuta };
