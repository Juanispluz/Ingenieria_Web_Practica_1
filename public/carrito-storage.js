// Carrito del navegador en localStorage: solo guarda producto_id y cantidad.
// Los precios no se guardan aquí; el servidor los toma de SQLite al registrar el pedido.
const CLAVE_CARRITO = 'la-libreta.carrito';
const moneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

function leerCarrito() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || '[]');
        return Array.isArray(datos) ? datos : [];
    } catch { return []; }
}

function guardarCarrito(items) {
    try { localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items)); } catch { /* sin almacenamiento */ }
    actualizarContador();
}

function agregarAlCarrito(productoId) {
    const items = leerCarrito();
    const existente = items.find(i => i.producto_id === productoId);
    if (existente) existente.cantidad += 1;
    else items.push({ producto_id: productoId, cantidad: 1 });
    guardarCarrito(items);
}

function cambiarCantidad(productoId, cantidad) {
    guardarCarrito(leerCarrito().map(i => i.producto_id === productoId ? { ...i, cantidad } : i));
}

function quitarDelCarrito(productoId) {
    guardarCarrito(leerCarrito().filter(i => i.producto_id !== productoId));
}

function vaciarCarrito() { guardarCarrito([]); }

function actualizarContador() {
    const contador = document.getElementById('contador');
    if (contador) contador.textContent = leerCarrito().reduce((s, i) => s + i.cantidad, 0);
}

actualizarContador();
