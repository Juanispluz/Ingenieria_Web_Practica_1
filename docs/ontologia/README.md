# Ontología de La Libreta — Seguimiento 10 %

Representación ontológica del dominio de la tienda **La Libreta** (papelería académica), elaborada para el seguimiento del 10 % de Ingeniería Web. Describe el catálogo, el comprador, el pedido y las líneas de pedido, y explica su correspondencia con la aplicación de la práctica anterior.

## Contenido de la carpeta

| Archivo | Qué es |
|---|---|
| `ontologia_tienda.drawio` | Diagrama editable de diagrams.net, con dos páginas: **1. Esquema** (TBox) y **2. Individuos** (ABox). |
| `1_esquema_ontologia.png` | Exportación legible de la página 1 (clases, jerarquía y propiedades). |
| `2_individuos_ontologia.png` | Exportación legible de la página 2 (individuos y hechos). |
| `1_esquema_ontologia.svg` / `2_individuos_ontologia.svg` | Exportaciones vectoriales de respaldo. |
| `Ficha_Ontologia_La_Libreta.pdf` | Ficha del modelo, máximo tres páginas: propósito, preguntas, diccionario, ejemplos y justificación. |
| `Ficha_Ontologia_La_Libreta.md` | Fuente editable de la ficha, con el mismo contenido y los diagramas incrustados. |
| `ontologia_la_libreta.owl` | Ontología OWL 2 en RDF/XML, lista para abrir en Protégé y ejecutar con HermiT. |
| `ontologia_la_libreta.ttl` | La misma ontología en Turtle, para revisión o conversión. |
| `COMO_ABRIR_EN_PROTEGE.md` | Guía de instalación, apertura y verificación de la inferencia en Protégé. |

## Cómo abrir y editar el diagrama

1. Entrar a <https://app.diagrams.net> (o abrir diagrams.net Desktop).
2. Elegir **Abrir existente** y seleccionar `ontologia_tienda.drawio`.
3. En la parte inferior aparecen las dos páginas: **1. Esquema** y **2. Individuos**.
4. Para exportar de nuevo: **Archivo → Exportar como → PNG** (o PDF), seleccionando la página actual.

El archivo conserva el formato editable original; las imágenes PNG son solo la exportación para revisión.

## Resumen del modelo

- **Clases:** `Producto`, `ProductoDeEscritura`, `ProductoDeOrganizacion`, `Comprador`, `Pedido`, `DetallePedido`.
- **Jerarquía:** `ProductoDeEscritura` y `ProductoDeOrganizacion` son subclases de `Producto`. Se justifican con los seis productos del catálogo; no se crea una subclase por producto y no se declaran disjuntas.
- **Propiedades de objeto:** `realizaPedido` (Comprador → Pedido), `tieneDetalle` (Pedido → DetallePedido), `correspondeA` (DetallePedido → Producto).
- **Propiedades de datos:** `nombreComprador`, `correoComprador`, `fechaPedido`, `totalPedido`, `cantidad`, `precioUnitarioCompra`, `subtotalLinea`, `nombreProducto`, `descripcionProducto`, `precioActual`.
- **Individuos:** `ana`, `pedido001`, `detalle001`, `detalle002`, `cuaderno001`, `boligrafo001`, `carpeta001`.
- **Consecuencia por subclases:** `ProductoDeEscritura` es subclase de `Producto` + `cuaderno001` es individuo de `ProductoDeEscritura` ⇒ `cuaderno001` es individuo de `Producto`.

## Correspondencia con la aplicación

| Ontología | Aplicación |
|---|---|
| `Producto` | Tabla `productos`; `precioActual` corresponde a `productos.precio`. |
| `Comprador` | No hay tabla: `pedidos.nombre` y `pedidos.correo` se reifican como la clase `Comprador`. |
| `Pedido` | Tabla `pedidos` (`fecha`, `total`). |
| `DetallePedido` | Tabla `detalle_pedido` (`pedido_id`, `producto_id`, `cantidad`, `precio_unitario`). |
| `precioUnitarioCompra` | Columna `detalle_pedido.precio_unitario`; es el precio congelado de la línea. |
| `precioActual` | Columna `productos.precio`; es el precio vigente del catálogo. |
| `subtotalLinea` | Se calcula como `cantidad × precio_unitario`; no es una columna. |

**Simplificaciones:** no hay cuentas ni identidad estable de cliente; el correo repetido no se interpreta como la misma persona. Pagos, envíos, inventario, descuentos y reseñas están fuera de alcance. Las subclases no se declaran disjuntas. Los `id` numéricos de SQLite no se modelan como propiedades ontológicas; los individuos se identifican por su etiqueta local.

La justificación completa, las preguntas de competencia y la explicación de la inferencia están en `Ficha_Ontologia_La_Libreta.pdf`.

## Abrir y ejecutar en Protégé

Protégé Desktop 5.6.9 quedó instalado y la ontología formalizada en `ontologia_la_libreta.owl`. Para abrirla, ejecutar el razonador HermiT y comprobar la inferencia de `cuaderno001` como `Producto`, seguir `COMO_ABRIR_EN_PROTEGE.md`.
