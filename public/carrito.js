// Carrito: muestra ítems, cantidades, subtotales y total provisional; envía el pedido.
const estado = document.getElementById('estado');
const vista = document.getElementById('vista-carrito');
const filas = document.getElementById('filas');
const totalCelda = document.getElementById('total');
const formulario = document.getElementById('formulario');
const mensajeError = document.getElementById('error');
const botonEnviar = document.getElementById('enviar');
const confirmacion = document.getElementById('confirmacion');
const volver = document.getElementById('volver');

let catalogo = new Map(); // id → producto, solo para mostrar nombre y precio.

function mostrarCarrito() {
    // Se descartan ítems cuyo producto ya no existe en el catálogo.
    const items = leerCarrito().filter(i => catalogo.has(i.producto_id));
    if (items.length === 0) {
        vista.hidden = true;
        volver.hidden = false;
        estado.textContent = 'Tu carrito está vacío. Agrega productos desde el catálogo.';
        return;
    }
    vista.hidden = false;
    volver.hidden = true;
    estado.textContent = `${items.length} producto(s) en el carrito.`;
    filas.replaceChildren();
    let total = 0;
    for (const item of items) {
        const producto = catalogo.get(item.producto_id);
        const subtotal = producto.precio * item.cantidad;
        total += subtotal;

        const fila = document.createElement('tr');
        const celdaNombre = document.createElement('td'); celdaNombre.textContent = producto.nombre;
        const celdaPrecio = document.createElement('td'); celdaPrecio.textContent = moneda.format(producto.precio);
        const celdaCantidad = document.createElement('td');
        const entrada = document.createElement('input');
        entrada.type = 'number'; entrada.min = '1'; entrada.step = '1'; entrada.value = item.cantidad;
        entrada.setAttribute('aria-label', `Cantidad de ${producto.nombre}`);
        entrada.addEventListener('change', () => {
            const cantidad = Number(entrada.value);
            if (Number.isInteger(cantidad) && cantidad > 0) cambiarCantidad(producto.id, cantidad);
            mostrarCarrito();
        });
        celdaCantidad.append(entrada);
        const celdaSubtotal = document.createElement('td'); celdaSubtotal.textContent = moneda.format(subtotal);
        const celdaQuitar = document.createElement('td');
        const quitar = document.createElement('button');
        quitar.type = 'button'; quitar.className = 'secundario'; quitar.textContent = 'Quitar';
        quitar.addEventListener('click', () => { quitarDelCarrito(producto.id); mostrarCarrito(); });
        celdaQuitar.append(quitar);
        fila.append(celdaNombre, celdaPrecio, celdaCantidad, celdaSubtotal, celdaQuitar);
        filas.append(fila);
    }
    totalCelda.textContent = moneda.format(total);
}

function mostrarError(texto) {
    mensajeError.textContent = texto;
    mensajeError.hidden = false;
}

formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    mensajeError.hidden = true;
    const nombre = formulario.elements.nombre.value.trim();
    const correo = formulario.elements.correo.value.trim();
    if (!nombre || !correo) return mostrarError('Escribe tu nombre y tu correo.');
    if (!formulario.elements.correo.checkValidity()) return mostrarError('Escribe un correo válido.');

    // Solo se envían identificadores y cantidades; el total lo calcula el servidor.
    const items = leerCarrito().map(({ producto_id, cantidad }) => ({ producto_id, cantidad }));
    botonEnviar.disabled = true;
    botonEnviar.textContent = 'Registrando…';
    try {
        const respuesta = await fetch('/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, items })
        });
        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.error || 'No fue posible registrar el pedido.');

        vaciarCarrito(); // Solo después de un registro exitoso.
        vista.hidden = true;
        estado.textContent = '';
        document.getElementById('conf-titulo').textContent = `Pedido #${datos.id} a nombre de ${datos.nombre}`;
        const lista = document.getElementById('conf-items');
        lista.replaceChildren(...datos.items.map(i => {
            const li = document.createElement('li');
            li.textContent = `${i.cantidad} × ${i.nombre} — ${moneda.format(i.subtotal)}`;
            return li;
        }));
        document.getElementById('conf-total').textContent = `Total: ${moneda.format(datos.total)}`;
        confirmacion.hidden = false;
    } catch (error) {
        mostrarError(error.message === 'Failed to fetch'
            ? 'No hay conexión con el servidor. Intenta de nuevo.' : error.message);
    } finally {
        botonEnviar.disabled = false;
        botonEnviar.textContent = 'Registrar pedido';
    }
});

async function iniciar() {
    try {
        const respuesta = await fetch('/api/productos');
        if (!respuesta.ok) throw new Error('No fue posible consultar los productos.');
        catalogo = new Map((await respuesta.json()).map(p => [p.id, p]));
        mostrarCarrito();
    } catch (error) {
        estado.textContent = error.message;
        estado.classList.add('error');
    }
}

iniciar();
