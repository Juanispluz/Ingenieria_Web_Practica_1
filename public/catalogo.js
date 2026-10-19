// Catálogo: obtiene los productos con fetch y permite agregarlos al carrito.
const estado = document.getElementById('estado');
const contenedor = document.getElementById('catalogo');

async function cargarCatalogo() {
    try {
        const respuesta = await fetch('/api/productos');
        if (!respuesta.ok) throw new Error('No fue posible consultar el catálogo.');
        const productos = await respuesta.json();
        contenedor.replaceChildren();
        for (const producto of productos) {
            const tarjeta = document.createElement('article'); tarjeta.className = 'producto';
            const nombre = document.createElement('h2'); nombre.textContent = producto.nombre;
            const descripcion = document.createElement('p'); descripcion.textContent = producto.descripcion;
            const precio = document.createElement('p'); precio.className = 'precio'; precio.textContent = moneda.format(producto.precio);
            const boton = document.createElement('button'); boton.type = 'button'; boton.textContent = 'Agregar al carrito';
            boton.addEventListener('click', () => {
                agregarAlCarrito(producto.id);
                estado.textContent = `${producto.nombre} agregado al carrito.`;
            });
            tarjeta.append(nombre, descripcion, precio, boton);
            contenedor.append(tarjeta);
        }
        estado.textContent = productos.length ? `${productos.length} productos disponibles.` : 'No hay productos disponibles.';
    } catch (error) {
        estado.textContent = error.message;
        estado.classList.add('error');
    }
}

cargarCatalogo();
