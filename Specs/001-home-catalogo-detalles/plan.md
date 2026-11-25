# Plan de implementación

## 1. Fuentes, alcance y prioridades

Implementar [la especificación vigente](spec.md) tomando [el contexto](../context.md) como referencia de objetivo, usuario, arquitectura y lenguaje visual.

- Tres rutas: Home `/`, catálogo `/search` y detalle `/property/[id]`.
- Stack obligatorio: Next.js 16, App Router, React, TypeScript y Tailwind CSS.
- Ante diferencias, prevalece `spec.md`: placeholders de fotos y avatar, cuadrícula de una columna móvil en Home, mapa placeholder obligatorio y ordenación por precio.
- Conservar campos básicos de fechas sin dependencias, disponibilidad local y reserva simulada. Librería de date picker y cálculo total son una ampliación opcional.
- Toda navegación entre páginas utiliza `<Link>` de Next.js; filtros, galería y contador utilizan botones o controles de formulario.
- Sin backend, autenticación, pagos, reservas reales, bibliotecas de componentes ni dependencias adicionales para el alcance obligatorio.
- Mantener identidad propia; las capturas orientan jerarquía y distribución, no autorizan copiar la marca o añadir funciones fuera del alcance.

Estado de partida documentado: repositorio con documentación y referencias PNG, sin aplicación ni configuración de dependencias. Antes de implementar, comprobar si este estado ha cambiado; conservar los archivos y cambios del usuario.

## 2. Forma de trabajo

1. Trabajar una fase a la vez, con cambios pequeños y componentes enfocados.
2. Antes de cada edición, identificar el requisito, el componente responsable y la comprobación más barata que pueda detectar un fallo.
3. Separar implementación y verificación en pasos acotados; no encadenar todas las fases en una ejecución autónoma.
4. Validar únicamente la parte afectada y registrar el resultado antes de avanzar. No escribir archivos de test salvo petición explícita.
5. Si una comprobación falla, realizar como máximo dos intentos de corrección; si sigue fallando, informar del error y detener esa fase.
6. No repetir suites o builds completos para cada componente. Reservar la compilación de producción para el cierre de integración.

Las tareas siguientes están pendientes. Crear este plan no inicia su implementación ni instala paquetes.

## 3. Arquitectura prevista

| Área | Responsabilidad y límites |
| --- | --- |
| `app/layout.tsx` y estilos globales | Estructura común, idioma español y base visual; mantener el layout como Server Component cuando sea posible. |
| `app/page.tsx` | Componer Home y su superficie cliente de carga, búsqueda y categorías. |
| `app/search/page.tsx` | Recibir criterios de URL y componer catálogo con filtros, ordenación y resultados. |
| `app/property/[id]/page.tsx` | Resolver el id de ruta y componer detalle con carga simulada cliente. |
| `/components` | `Navbar`, `SearchBar`, `CategoryFilter`, `PropertyCard`, `PropertyGrid`, `FilterBar`, `ResultsHeader`, mapa placeholder y piezas del detalle. |
| Datos y tipos compartidos | Alojamientos, anfitriones, categorías, comodidades, disponibilidad, búsqueda, filtros y orden. Elegir una ubicación simple al implementar. |
| Reglas compartidas | Normalización de texto, validación de fechas y huéspedes, filtrado, disponibilidad y serialización segura de criterios. |

Mantener fronteras cliente solo donde sean necesarias. Las superficies interactivas poseen el estado; las piezas de presentación reciben props tipadas. No añadir un gestor global de estado ni convertir el layout completo en Client Component.

## 4. Fases obligatorias

### Fase 1. Preparar el proyecto

**Dependencia:** ninguna. **Cobertura:** RNF-01, RNF-03.

- [ ] Comprobar estructura actual, versión de Node compatible con Next.js 16 y gestor de paquetes disponible.
- [ ] Inicializar Next.js 16 con App Router, React, TypeScript y Tailwind CSS, sin sobrescribir documentación ni capturas. Evitar opciones del generador que añadan dependencias fuera del alcance.
- [ ] Preparar layout y las tres rutas mínimas; resolver `params` y `searchParams` según las APIs de Next.js 16, evitando patrones síncronos obsoletos.
- [ ] Definir comandos de desarrollo y comprobación acordes con las herramientas realmente instaladas; no asumir que existe `next lint` ni instalar herramientas auxiliares sin necesidad.

**Comprobación de salida:** servidor local inicia y las rutas mínimas responden sin errores de configuración. Comunicar su URL cuando exista una experiencia ejecutable.

### Fase 2. Definir datos y reglas compartidas

**Dependencia:** fase 1. **Cobertura:** contrato de datos, RF-03 a RF-10, RNF-04.

- [ ] Definir interfaces y types para propiedades, anfitrión, fotos placeholder, categorías, comodidades, criterios, filtros, orden y estados de carga.
- [ ] Crear mock data con ids estables, títulos, ubicación, descripciones, moneda única, precio por noche, valoración, reseñas, capacidad, anfitrión con años y avatar, comodidades e intervalos disponibles.
- [ ] Incluir datos que distingan Playa, Mansiones y Tendencias, precios iguales y diferentes, capacidad uno, varias fotos y una sola foto, y noches no disponibles.
- [ ] Definir normalización de texto y reglas de precio inclusivo, tipos alternativos y comodidades acumulativas. Home busca en título y ubicación; catálogo busca destino en ubicación.
- [ ] Compartir validación de días, intervalo de estancia y capacidad. Comprobar todas las noches desde entrada incluida hasta salida excluida sin errores por hora o zona horaria.

**Comprobación de salida:** tipado acotado y revisión de ejemplos que distingan coincidencia, ausencia de resultados, límite exacto de precio y disponibilidad parcial. No crear una suite nueva.

### Fase 3. Construir piezas visuales compartidas

**Dependencia:** fases 1 y 2. **Cobertura:** CA-01.1 a CA-01.3, CA-05.1, CA-05.3, CV-04.

- [ ] Definir paleta propia: blanco, gris claro, texto oscuro y acento `#087F6F`; aplicar tipografía y espaciados del contexto sin copiar marca.
- [ ] Crear `Navbar` con logo propio, búsqueda e iconos del menú de usuario, sin flujo de autenticación. No mostrar acciones que aparenten funcionar si no están implementadas.
- [ ] Crear `PropertyCard` con placeholder, título, ubicación, descripción breve, precio por noche, moneda y valoración con estrellas accesibles.
- [ ] Enlazar tarjeta y logo mediante `<Link>`; evitar botones interactivos anidados dentro de un enlace de tarjeta.
- [ ] Crear `PropertyGrid` con `.map()`, keys por id, una columna móvil y varias columnas desde 768px según ancho disponible.
- [ ] Crear estados de carga y vacío diferenciados y placeholders de dimensiones estables; usar iconos propios sin una biblioteca adicional.

**Comprobación de salida:** revisar una tarjeta, su enlace, teclado y cuadrícula a 375px y 768px. Mantener precio y valoración idénticos donde se reutilice.

### Fase 4. Implementar Home interactiva

**Dependencia:** fases 2 y 3. **Cobertura:** HU-01, HU-02, CA-03.6 a CA-03.8, RF-13, RF-17.

- [ ] Mantener con `useState` texto, categoría activa, carga, datos cargados y lista visible. La lista visible empieza vacía y carga empieza en `true`.
- [ ] Al montar, simular carga con `useEffect` y `setTimeout` de aproximadamente un segundo; asignar los datos y desactivar carga. Limpiar temporizador al desmontar.
- [ ] En cada cambio del campo, guardar el nuevo texto y actualizar la lista visible mediante su setter; calcular siempre desde el conjunto completo cargado y la categoría actual, no desde la lista reducida.
- [ ] Crear fila horizontal de categorías icono + etiqueta, incluida opción de todas, Playa, Mansiones y Tendencias; resaltar selección y recalcular usando el texto actual.
- [ ] Resolver escritura o selección durante carga: al terminar, aplicar valores actuales sin capturarlos de forma obsoleta ni reiniciar el temporizador en cada pulsación.
- [ ] Mostrar indicador mientras carga y mensaje de ausencia de coincidencias solo después de cargar; borrar texto restaura resultados de la categoría activa.

**Comprobación de salida:** escribir y cambiar categoría antes y después del segundo de carga, borrar texto y abrir una tarjeta. Verificar que no desaparezcan resultados por filtrar repetidamente la lista ya reducida.

### Fase 5. Completar buscador y criterios de URL

**Dependencia:** fases 2 a 4. **Cobertura:** HU-03, RF-11, RF-12, CA-09.4, CV-02.

- [ ] Reutilizar `SearchBar` con destino, fechas básicas y huéspedes, y estado expandido con secciones plegables que conserva valores al cerrar.
- [ ] Separar búsqueda instantánea local de Home de búsqueda enviada al catálogo; no navegar ni cambiar URL de Home en cada pulsación.
- [ ] Validar antes de navegar: permitir destino y fechas vacíos; exigir ambas fechas si se informa una y huéspedes enteros positivos.
- [ ] Construir el enlace de búsqueda a `/search` con parámetros mediante APIs estructuradas. Usar `<Link>` para la navegación y evitarla cuando el formulario sea inválido.
- [ ] Definir serialización y lectura segura de búsqueda, filtros y orden. Ignorar claves desconocidas, normalizar inválidos y mantener valores predeterminados de la spec.
- [ ] Distinguir limpiar buscador de limpiar filtros. Si se usa diálogo, gestionar foco, Escape y retorno al activador; comprobar teclado móvil.

**Comprobación de salida:** abrir un catálogo con criterios válidos y malformados, plegar campos sin perder valores y confirmar que una búsqueda inválida no navega.

### Fase 6. Implementar catálogo, filtros, orden y mapa

**Dependencia:** fases 2, 3 y 5. **Cobertura:** HU-04, HU-05, HU-10, RF-18, RF-19, CV-07.

- [ ] Reutilizar `Navbar`, `SearchBar`, `PropertyGrid` y `PropertyCard`.
- [ ] Crear `FilterBar` para límites de precio por noche, tipos y comodidades, con estados activos y limpieza independiente de búsqueda.
- [ ] Crear `ResultsHeader` con contador y control Ascendente / Descendente. Guardar orden con `useState`, inicialmente ascendente.
- [ ] Filtrar primero y ordenar una copia de resultados; desempatar por id estable y no mutar mock data. Derivar contador y tarjetas del mismo conjunto.
- [ ] Sincronizar criterios y orden aplicados con URL y atrás/adelante; conservar orden al filtrar y mostrar errores sin sustituir los últimos filtros válidos.
- [ ] Crear recuadro gris «Mapa», a la derecha de tarjetas en escritorio y debajo en móvil; ajustar columnas de tarjetas al ancho restante.
- [ ] Mantener mapa placeholder sin interacción ficticia; contemplar cero resultados y acciones para modificar criterios.

**Comprobación de salida:** comprobar precio ascendente/descendente, empate, contador, limpieza de filtros, resultados vacíos y posición del mapa a 375px y en escritorio.

### Fase 7. Implementar carga y contenido del detalle

**Dependencia:** fases 2, 3 y 5. **Cobertura:** HU-06, RF-13, RF-14, CV-03.

- [ ] Recibir id de URL en la ruta y cargar el alojamiento en una superficie cliente con `useEffect` y temporizador de aproximadamente un segundo.
- [ ] Mostrar carga, datos válidos o no encontrado. Cancelar carga anterior al cambiar de id o desmontar; no mostrar contenido obsoleto.
- [ ] Crear `ImageGallery` superior con array de placeholders e índice en `useState`; botones Anterior / Siguiente desactivados en los extremos y contador correcto.
- [ ] Reiniciar índice al cambiar de alojamiento; manejar ninguna foto o una sola sin acceso fuera del array.
- [ ] Crear `PropertyHeader` con título, estrellas, valoración numérica, reseñas y ubicación.
- [ ] Completar `PropertyDescription` con texto, capacidad y fila del anfitrión: avatar placeholder, nombre y años.
- [ ] Crear `AmenitiesList` como cuadrícula de icono + etiqueta, con keys estables y estado para lista vacía.

**Comprobación de salida:** id válido, inexistente y cambio rápido de id; navegar galería de varias fotos y una foto, y comprobar coherencia de contenido con la tarjeta.

### Fase 8. Implementar reserva simulada

**Dependencia:** fases 2 y 7. **Cobertura:** HU-08, RF-15, RF-20, RNF-11.

- [ ] Crear `BookingCard` con precio por noche, fechas básicas nativas, contador de huéspedes y CTA de reserva simulada.
- [ ] Gestionar huéspedes con `useState`, mínimo uno y máximo capacidad; aumentar/reducir de uno en uno con acciones desactivadas en límites.
- [ ] Compartir reglas de entrada/salida y disponibilidad con búsqueda; asociar errores a campos y no confirmar criterios inválidos.
- [ ] Mostrar confirmación únicamente local y explícitamente simulada; no crear pagos, peticiones ni registros ni modificar disponibilidad.
- [ ] Invalidar confirmación si cambian fechas o huéspedes; en móvil no cubrir contenido con una franja fija y en escritorio situar el panel a la derecha si cabe.

**Comprobación de salida:** capacidad uno, extremos del contador, fechas incompletas o invertidas, noche no disponible, confirmación válida y cambios posteriores.

### Fase 9. Integrar navegación y retorno

**Dependencia:** fases 4 a 8. **Cobertura:** HU-07, RF-11, RF-12, RF-21.

- [ ] Revisar que logo, envío de búsqueda, tarjetas y volver o breadcrumb utilicen `<Link>`, sin reemplazarlos por recargas o navegación imperativa entre páginas.
- [ ] Pasar el contexto del catálogo al detalle y construir un enlace interno de regreso que conserve búsqueda, filtros y orden.
- [ ] Desde detalle abierto directamente, regresar a `/search`; ignorar parámetros de retorno externos o malformados.
- [ ] Comprobar acceso directo y atrás/adelante sin exigir visita previa a Home. Una recarga no debe restaurar una reserva inexistente.

**Comprobación de salida:** recorrido Home → catálogo → detalle → catálogo con criterios y orden conservados, acceso directo al detalle y rechazo de retorno externo.

### Fase 10. Cerrar calidad visual y técnica

**Dependencia:** todas las fases obligatorias anteriores. **Cobertura:** HU-09, CV-01 a CV-07, RNF-01 a RNF-12.

- [ ] Contrastar Home con [su PNG](../airbnb-home.png), buscador con [su PNG](../airbnb-search-expanded.png) y detalle con [su PNG](../airbnb-detalles-alojamiento.png).
- [ ] Respetar las diferencias solicitadas: placeholders y cuadrícula móvil, no carrusel de Home. Registrar catálogo y escritorio como adaptaciones propuestas, no como fidelidad verificada contra capturas inexistentes.
- [ ] Revisar 375px, 768px y escritorio mayor: títulos largos, varias columnas, mapa, panel de reserva, teclado móvil y superficies fijas sin solapamiento.
- [ ] Comprobar teclado, foco, etiquetas, alternativas, nombres de iconos, contraste y áreas táctiles de 44px.
- [ ] Recorrer los casos límite de la sección 8 de la spec, priorizando los no cubiertos en comprobaciones anteriores; no repetir verificaciones sin un cambio relevante.
- [ ] Ejecutar una comprobación de tipado y una compilación de producción con los comandos disponibles, revisando especialmente rutas y parámetros de App Router. No instalar dependencias de pruebas para este cierre.
- [ ] Registrar los criterios cumplidos y cualquier bloqueo. Entregar URL del servidor local y confirmar ausencia de backend, reservas reales y dependencias fuera de alcance.

**Comprobación de salida:** criterios globales de la sección 10 de la spec satisfechos y riesgos pendientes comunicados; no declarar validada una comprobación que no se pudo ejecutar.

## 5. Retos opcionales posteriores

No empezar hasta completar las diez fases obligatorias. No incluirlos en la definición mínima de terminado.

- [ ] **RO-01, mapa real:** seleccionar una única solución, añadir coordenadas a mocks y pines correspondientes a resultados actuales. Mantener posición responsive y volver al placeholder si falla. Limitar dependencias y recursos externos a esta excepción y no incluir secretos ni geolocalización del usuario.
- [ ] **RO-02, date picker y total:** sustituir controles nativos por una librería adecuada, conservar validaciones y calcular precio por noche × noches válidas. Mantener precio por noche visible y comprobar una noche, cambio de mes e intervalos inválidos, sin tasas inventadas.

Verificar cada reto por separado. Su ausencia no bloquea la entrega obligatoria.

## 6. Seguimiento y definición de terminado

- Mantener las casillas pendientes hasta implementar y comprobar su fase.
- Registrar por fase qué cambió, qué comprobación se hizo y qué falta, sin alterar silenciosamente requisitos de `spec.md` o `context.md`.
- La entrega mínima termina cuando las diez fases obligatorias cumplen sus criterios, las diez historias de usuario están cubiertas y los retos siguen claramente separados.
- Este plan no autoriza commits, nuevas ramas, cambios de alcance ni implementación en el momento de su creación.