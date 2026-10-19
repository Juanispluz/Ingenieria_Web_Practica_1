// Datos iniciales reproducibles: se insertan al arrancar si todavía no existen.
// Precios en pesos colombianos enteros. Información ficticia.
const productosIniciales = [
    { id: 1, nombre: 'Cuaderno', descripcion: 'Cuaderno de 100 hojas para tus clases.', precio: 12000 },
    { id: 2, nombre: 'Bolígrafo', descripcion: 'Bolígrafo de tinta azul.', precio: 2500 },
    { id: 3, nombre: 'Carpeta', descripcion: 'Carpeta para organizar documentos.', precio: 6000 },
    { id: 4, nombre: 'Resaltador', descripcion: 'Resaltador amarillo.', precio: 4000 },
    { id: 5, nombre: 'Agenda', descripcion: 'Agenda para planear tus actividades.', precio: 18000 },
    { id: 6, nombre: 'Estuche', descripcion: 'Estuche para tus útiles.', precio: 15000 }
];

module.exports = { productosIniciales };
