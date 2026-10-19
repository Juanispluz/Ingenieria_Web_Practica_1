// Consulta de pedidos: GET /api/pedidos y muestra cada pedido con sus productos.
const estado = document.getElementById('estado');
const contenedor = document.getElementById('pedidos');
const formatoFecha = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' });

async function cargarPedidos() {
    try {
        const respuesta = await fetch('/api/pedidos');
        if (!respuesta.ok) throw new Error('No fue posible consultar los pedidos.');
        const pedidos = await respuesta.json();
        contenedor.replaceChildren();
        if (pedidos.length === 0) {
            estado.textContent = 'Todavía no hay pedidos registrados.';
            return;
        }
        for (const pedido of pedidos) {
            const tarjeta = document.createElement('article'); tarjeta.className = 'panel';
            const titulo = document.createElement('h2'); titulo.textContent = `Pedido #${pedido.id}`;
            const datos = document.createElement('p');
            datos.textContent = `${pedido.nombre} · ${pedido.correo} · ${formatoFecha.format(new Date(pedido.fecha))}`;
            const lista = document.createElement('ul');
            for (const item of pedido.items) {
                const li = document.createElement('li');
                li.textContent = `${item.cantidad} × ${item.nombre} (${moneda.format(item.precio_unitario)} c/u) — ${moneda.format(item.subtotal)}`;
                lista.append(li);
            }
            const total = document.createElement('p'); total.className = 'precio';
            total.textContent = `Total: ${moneda.format(pedido.total)}`;
            tarjeta.append(titulo, datos, lista, total);
            contenedor.append(tarjeta);
        }
        estado.textContent = `${pedidos.length} pedido(s) registrados.`;
    } catch (error) {
        estado.textContent = error.message;
        estado.classList.add('error');
    }
}

cargarPedidos();
