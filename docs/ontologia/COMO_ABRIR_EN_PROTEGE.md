# Abrir la ontología en Protégé

La ontología del Seguimiento 10 % quedó formalizada en OWL 2 para que pueda abrirse, editarse y ejecutarse con el razonador **HermiT** en Protégé Desktop.

## Instalación

- **Programa:** Protégé Desktop 5.6.9.
- **Ubicación:** `C:\Users\LAB - ANALIT - 08\AppData\Local\Programs\Protege-5.6.9\Protege.exe`.
- **Acceso directo:** hay un acceso directo llamado **Protege 5.6.9** en el escritorio.
- **Acceso directo a la ontología:** hay un acceso directo llamado **Ontología La Libreta (Protege)** que abre directamente el archivo.

## Archivos de la ontología

| Archivo | Formato | Uso |
|---|---|---|
| `ontologia_la_libreta.owl` | RDF/XML (OWL 2) | Archivo principal para abrir en Protégé. |
| `ontologia_la_libreta.ttl` | Turtle | Misma ontología en formato legible; sirve para revisión o conversión. |

## Pasos para abrirla y ejecutarla

1. Abrir **Protege 5.6.9** desde el escritorio, o el acceso directo **Ontología La Libreta (Protege)**.
2. Si se abre Protégé sin la ontología: **File → Open…** y seleccionar `ontologia_la_libreta.owl`.
3. En el menú **Reasoner**, comprobar que esté seleccionado **HermiT 1.4.3.456**.
4. Elegir **Reasoner → Start reasoner** (atajo `Ctrl+R`).
5. Esperar unos segundos. Si la ontología es consistente, no aparece el diálogo rojo de inconsistencia.

## Cómo ver la inferencia

La inferencia que se explica en la ficha es:

> `ProductoDeEscritura` es subclase de `Producto` + `cuaderno001` es individuo de `ProductoDeEscritura` ⇒ `cuaderno001` es individuo de `Producto`.

Con el razonador activo se puede comprobar de tres formas:

1. **Entities → `cuaderno001`:** en el panel *Description*, dentro de *Types*, aparecen `ProductoDeEscritura` (afirmado) y `Producto` (inferido, resaltado en amarillo).
2. **Individuals by class → `Producto`:** en los miembros de la clase aparecen `cuaderno001`, `boligrafo001` y `carpeta001`, aunque en el archivo solo estén afirmados como subclases.
3. **DL Query:** escribir `Producto`, marcar *Instances* y ejecutar la consulta; la respuesta incluye los tres productos.

> En Protégé, lo inferido se muestra en amarillo. Lo afirmado en el archivo aparece en blanco.

## Etiquetas en español

Las clases, propiedades e individuos tienen `rdfs:label` en español. Para verlas en lugar de los IRI:

- **View → Render by label**, o
- **File → Preferences → Renderer → Render by label**.

## Verificación realizada

Se ejecutó HermiT 1.4.3.456 con el JRE incluido en Protégé:

- Consistencia: `owl:Thing is satisfiable`.
- Consecuencia: la premisa `ontologia_la_libreta.owl` implica la conclusión `cuaderno001 rdf:type Producto`; HermiT respondió `true`.

## Nota sobre el alcance

El archivo OWL es la formalización del mismo modelo que aparece en el diagrama y en la ficha. No se añadieron clases, propiedades ni individuos nuevos. Las subclases **no** se declaran disjuntas, y las cardinalidades se documentan en la ficha; el razonador se usa para comprobar la consecuencia por subclases.
