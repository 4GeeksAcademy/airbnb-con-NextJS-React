# Especificación del frontend de alojamientos vacacionales

## 1. Propósito y alcance

Construir un prototipo frontend para explorar alojamientos vacacionales, buscar y filtrar alternativas, comparar precios por noche, consultar detalles y simular una reserva. Este documento desarrolla [el contexto del proyecto](../context.md), que conserva sus requisitos técnicos, funcionales y visuales.

Incluye tres páginas: Home (`/`), catálogo (`/search`) y detalle (`/property/[id]`). El buscador expandido es un estado de `SearchBar`, no una cuarta ruta.

Esta revisión incorpora los requisitos posteriores de Home, catálogo, detalle y navegación. En caso de diferencias con el contexto, prevalecen aquí la cuadrícula móvil de una columna en Home, los placeholders de fotos, el mapa placeholder y la ordenación por precio. No se modifica `context.md`.

Quedan fuera del alcance obligatorio backend, autenticación, pagos, reservas reales, favoritos, compartir, geolocalización, historiales externos, experiencias y servicios adicionales. El mapa placeholder sí es obligatorio; el mapa real es un reto opcional. Los iconos del menú de usuario no implican un flujo de acceso real. Comparar alojamientos consiste en consultar tarjetas y detalles; no requiere una pantalla comparativa adicional.

La finalidad de este archivo es documental: no instala dependencias ni implementa la aplicación.

## 2. Análisis de la estructura del proyecto

### Estado actual observado

| Elemento | Responsabilidad actual |
| --- | --- |
| `README.md` | Presentación breve del proyecto. |
| `context.md` | Objetivo, usuario, alcance, componentes, restricciones y análisis visual. |
| `airbnb-home.png` | Referencia móvil de exploración y tarjetas. |
| `airbnb-search-expanded.png` | Referencia móvil del buscador expandido, no del catálogo. |
| `airbnb-detalles-alojamiento.png` | Referencia móvil de galería, encabezado y resumen de reserva. |
| `Specs/` | Carpeta inicialmente vacía destinada a especificaciones; este documento se incorpora aquí. |

En la raíz no se han observado directorios de aplicación, componentes, configuración de Next.js ni manifiesto de dependencias. La organización siguiente es prevista, no existente.

### Organización prevista

- `app/page.tsx`: Home.
- `app/search/page.tsx`: catálogo.
- `app/property/[id]/page.tsx`: detalle dinámico.
- `/components`: componentes reutilizables, pequeños y con una responsabilidad definida.
- Fuente compartida de mock data y definiciones TypeScript; la ubicación se decidirá al implementar sin crear abstracciones o carpetas innecesarias.
- Separar presentación, estado interactivo y reglas de búsqueda; no duplicar los datos ni el filtrado entre páginas.
- `ResultsHeader` reúne contador y control de ordenación; un componente enfocado representa el mapa placeholder. `ImageGallery` controla la foto activa y la información del anfitrión permanece en `PropertyDescription` o en una pieza pequeña reutilizable.

## 3. Perfil de usuario

**Perfil principal:** persona que organiza unas vacaciones y todavía no ha decidido su alojamiento. No necesita registrarse para utilizar el prototipo.

**Objetivos:** descubrir opciones, elegir destino y fechas, ajustar huéspedes, comparar precio y valoración, comprobar capacidad y comodidades, y entender cómo sería iniciar una reserva.

**Contexto de uso:** exploración en móvil de 375px y consulta detallada en escritorio desde 768px. Puede llegar directamente a catálogo o detalle y navegar mediante teclado o controles táctiles.

**Necesidades:** información legible y consistente, criterios visibles, filtros predecibles, retorno al catálogo sin perder contexto y diferenciación clara entre una simulación y una operación real.

## 4. Historias de usuario y criterios de aceptación

### HU-01. Explorar recomendaciones

Como persona que busca alojamiento, quiero ver recomendaciones para descubrir opciones antes de introducir una búsqueda.

- **CA-01.1:** al abrir `/`, la navbar superior muestra logo propio, campo de búsqueda e iconos del menú de usuario; debajo aparecen `CategoryFilter` y `PropertyGrid`.
- **CA-01.2:** cada `PropertyCard` muestra placeholder de foto, título, ubicación, descripción breve, precio por noche con moneda y valoración numérica acompañada de estrellas, procedentes de los mock data.
- **CA-01.3:** activar una tarjeta navega mediante `<Link>` de Next.js al detalle de su id sin recargar completamente el navegador.
- **CA-01.4:** Home empieza con una lista local vacía y carga activa. Al montar, `useEffect` inicia un `setTimeout` de aproximadamente un segundo, asigna los mock data y desactiva la carga. Mientras tanto se muestra un indicador, no un mensaje de cero coincidencias.
- **CA-01.5:** la cuadrícula presenta una columna en móvil y varias columnas desde 768px según el espacio disponible.

### HU-02. Explorar por categoría

Como visitante, quiero seleccionar una categoría para ver recomendaciones relacionadas con mi interés.

- **CA-02.1:** la categoría activa se distingue visual y semánticamente y se gestiona mediante `useState`.
- **CA-02.2:** cambiar de categoría actualiza el listado sin modificar los datos originales.
- **CA-02.3:** existe una opción para recuperar todas las recomendaciones; una categoría sin coincidencias muestra un estado vacío.
- **CA-02.4:** la fila horizontal está debajo de la navbar y cada categoría combina icono y etiqueta, incluidas Playa, Mansiones y Tendencias; su desplazamiento no desborda la página.

### HU-03. Buscar por destino, fechas y huéspedes

Como viajero, quiero indicar mis criterios para consultar alojamientos adecuados.

- **CA-03.1:** Home y catálogo permiten introducir destino, entrada, salida y huéspedes mediante el mismo `SearchBar`.
- **CA-03.2:** abrir, plegar o cerrar el buscador expandido conserva los valores durante la interacción actual.
- **CA-03.3:** buscar con valores válidos lleva a `/search` conservando los criterios en parámetros de URL.
- **CA-03.4:** valores inválidos muestran un error asociado al campo y no aplican una búsqueda inválida.
- **CA-03.5:** limpiar el buscador restablece destino y fechas vacíos y un huésped; no elimina implícitamente los filtros independientes del catálogo.
- **CA-03.6:** en Home, el texto del campo se guarda con `useState`. Cada cambio de entrada actualiza también la lista de tarjetas visibles, almacenada en estado local, sin esperar a enviar el formulario ni navegar.
- **CA-03.7:** el filtrado instantáneo compara título y ubicación, combina el texto con la categoría activa y parte siempre del conjunto completo cargado, no del resultado ya filtrado. Borrar texto recupera los alojamientos de la categoría actual.
- **CA-03.8:** si se escribe o cambia categoría durante la carga, al terminar se muestran los datos filtrados con los valores actuales, sin perder la búsqueda ni reiniciar el temporizador.

### HU-04. Filtrar resultados

Como viajero, quiero limitar precio, tipo y comodidades para encontrar opciones que cumplan mis preferencias.

- **CA-04.1:** `FilterBar` permite establecer límites de precio por noche, tipo y comodidades, mostrando los filtros activos.
- **CA-04.2:** aplicar o modificar filtros válidos actualiza listado, contador y parámetros de URL de forma coherente.
- **CA-04.3:** limpiar filtros elimina límites de precio, tipos y comodidades seleccionados, conservando destino, fechas y huéspedes.
- **CA-04.4:** sin coincidencias se muestran cero resultados y acciones para limpiar filtros o modificar búsqueda.

### HU-05. Comparar alternativas

Como viajero, quiero consultar precios y valoraciones para decidir qué alojamientos examinar.

- **CA-05.1:** Home, catálogo y detalle muestran el mismo precio por noche, moneda y valoración para un mismo alojamiento.
- **CA-05.2:** `ResultsHeader` coincide con la cantidad de tarjetas renderizadas tras aplicar los criterios.
- **CA-05.3:** las tarjetas reutilizan `PropertyCard`, utilizan ids únicos estables y permiten acceder al detalle con teclado.
- **CA-05.4:** el catálogo muestra un control Ascendente / Descendente por precio junto al contador. `useState` guarda la selección; cambiarla reordena las tarjetas sin modificar los mock data ni la cantidad de resultados.

### HU-06. Consultar un alojamiento

Como viajero, quiero ver imágenes, descripción y comodidades para valorar si el alojamiento me conviene.

- **CA-06.1:** un id válido muestra `PropertyHeader`, `ImageGallery`, `PropertyDescription`, `AmenitiesList` y `BookingCard`, además de `Navbar` y el regreso al catálogo.
- **CA-06.2:** el encabezado muestra título, valoración con estrellas, número de reseñas y ubicación; la información del alojamiento incluye capacidad y características.
- **CA-06.3:** la galería superior usa un array de placeholders de fotos del alojamiento y `useState` para su índice activo. Los botones Anterior / Siguiente cambian la foto; el contador refleja el índice y la cantidad reales.
- **CA-06.4:** `useEffect` usa el id de la URL y un `setTimeout` de aproximadamente un segundo para simular carga al montar y al cambiar de id. Se muestra un indicador hasta resolver los datos; se limpia el temporizador al desmontar o cambiar de id.
- **CA-06.5:** un id inexistente muestra un estado de no encontrado y una salida al catálogo, sin formulario de reserva operativo.
- **CA-06.6:** la fila de anfitrión muestra placeholder de avatar, nombre y años como anfitrión definidos en los mock data.
- **CA-06.7:** los servicios se muestran como una cuadrícula de pares icono + etiqueta, con información accesible y keys estables.

### HU-07. Volver a los resultados

Como viajero, quiero volver al catálogo sin perder mis criterios para seguir comparando.

- **CA-07.1:** volver desde un detalle abierto en el catálogo recupera destino, fechas, huéspedes y filtros aplicados.
- **CA-07.2:** volver desde un acceso directo sin contexto previo conduce a `/search` con los valores predeterminados.
- **CA-07.3:** toda navegación entre páginas, incluidos logo, tarjetas de Home y catálogo y botón de volver o breadcrumb del detalle, usa `<Link>` de Next.js. El regreso enlaza al catálogo; no depende solo del historial ni de una recarga completa.

### HU-08. Simular una reserva

Como viajero, quiero seleccionar fechas y huéspedes para probar el flujo de reserva sin efectuar una operación real.

- **CA-08.1:** `BookingCard` muestra precio por noche, campos básicos de entrada/salida previstos en el contexto, contador de huéspedes y botón CTA de reserva simulada. El contador usa `useState`, con acciones de aumentar/reducir y rango de uno a la capacidad del alojamiento; desactiva la acción correspondiente en cada límite.
- **CA-08.2:** no se confirma con fechas incompletas, salida anterior o igual a entrada, huéspedes inválidos o capacidad excedida.
- **CA-08.3:** un intervalo no disponible en los mock data informa del conflicto y no confirma la simulación.
- **CA-08.4:** con valores válidos y disponibles se muestra una confirmación local explícitamente simulada, sin pagos, solicitudes externas ni modificación de disponibilidad.
- **CA-08.5:** cambiar fechas o huéspedes después de confirmar invalida la confirmación anterior; repetir la acción no crea registros ni cargos.

### HU-09. Utilizar la interfaz en móvil, escritorio y con teclado

Como usuario, quiero acceder a toda la información y los controles en distintas condiciones de uso.

- **CA-09.1:** a 375px no hay desbordamiento horizontal de página, texto oculto ni controles superpuestos; las filas desplazables permanecen dentro de su contenedor.
- **CA-09.2:** desde 768px se adapta la cuadrícula y, si hay espacio suficiente, el detalle presenta contenido y reserva en columnas legibles.
- **CA-09.3:** campos con etiquetas, imágenes con alternativas, iconos con nombres accesibles, controles con foco visible y áreas táctiles mínimas de 44px.
- **CA-09.4:** si el buscador se presenta como diálogo, mantiene el foco dentro mientras está abierto, cierra con Escape y devuelve el foco al activador.

### HU-10. Ubicar visualmente los resultados

Como viajero, quiero disponer de un área de mapa junto a los resultados para reconocer dónde se presentaría su ubicación.

- **CA-10.1:** el catálogo incluye por defecto un recuadro gris con el texto «Mapa», sin necesitar una librería, API o conexión externa.
- **CA-10.2:** en escritorio, el mapa está a la derecha de la lista; en móvil está debajo de las tarjetas y no oculta resultados ni filtros.
- **CA-10.3:** el placeholder no muestra pines ficticios ni aparenta ser interactivo. Sustituirlo por un mapa real no es necesario para aceptar el alcance obligatorio.

## 5. Requisitos funcionales y reglas de negocio

Las reglas siguientes concretan aspectos no fijados en detalle por el contexto. Son decisiones del prototipo, no afirmaciones sobre el funcionamiento de Airbnb.

| ID | Requisito |
| --- | --- |
| RF-01 | Ofrecer las tres rutas previstas y reutilizar los componentes compartidos donde corresponda. |
| RF-02 | Filtrar recomendaciones por una categoría activa; la opción inicial representa todas las categorías. |
| RF-03 | Permitir búsqueda sin destino ni fechas para explorar; huéspedes vale uno de forma predeterminada. |
| RF-04 | Comparar destino con ubicación local mediante coincidencia parcial, sin distinguir mayúsculas ni acentos y omitiendo espacios exteriores. En Home, el filtro de texto instantáneo también busca en título. Texto vacío no restringe ese campo. |
| RF-05 | Si se informa una fecha, exigir también la otra; validar días de calendario y salida posterior a entrada. No añadir restricciones de antelación no definidas en los mock data. |
| RF-06 | Definir disponibilidad mediante intervalos locales y comprobar todas las noches desde entrada incluida hasta salida excluida. Sin fechas no aplicar disponibilidad; no deducir disponibilidad de datos ausentes. |
| RF-07 | Huéspedes es un entero positivo; el alojamiento cumple cuando su capacidad es igual o superior. |
| RF-08 | Combinar destino, fechas, huéspedes, precio, tipo y comodidades mediante AND. Varios tipos aceptan cualquiera de ellos; varias comodidades exigen todas. |
| RF-09 | Usar límites inclusivos de precio por noche; límites vacíos no restringen. Rechazar importes negativos, no finitos o mínimo mayor que máximo. |
| RF-10 | Utilizar una única moneda en los mock data para comparar precios sin conversiones y mostrarla consistentemente. |
| RF-11 | Conservar búsqueda, filtros y orden del catálogo aplicados en URL y restaurarlos al acceder directamente o usar atrás/adelante. El texto y la lista filtrada en tiempo real de Home son estado local; no necesitan actualizar URL en cada pulsación. |
| RF-12 | Preservar el contexto al abrir detalle; admitir únicamente rutas internas controladas para el regreso, nunca redirecciones externas. |
| RF-13 | Simular carga de Home y detalle mediante `useEffect` y `setTimeout` de aproximadamente un segundo; lista inicial vacía y carga activa en Home, sin datos de habitación mientras carga el detalle. Cancelar temporizadores en la limpieza del efecto y evitar resultados obsoletos. |
| RF-14 | La galería usa placeholders locales y un índice en `useState`; Anterior / Siguiente recorre el array sin salir de sus límites. Desactivar Anterior al inicio y Siguiente al final; reiniciar índice al cambiar de alojamiento. |
| RF-15 | Validar reserva simulada con las mismas reglas de fechas, capacidad y disponibilidad de búsqueda. La confirmación vive solo en la interacción actual. |
| RF-16 | Errores y estados vacíos incluyen mensajes accionables y conservan los valores válidos introducidos. |
| RF-17 | Home guarda texto, categoría activa, carga y lista visible en estado local. Cada cambio de texto actualiza la lista mediante su setter a partir de los datos cargados completos y la categoría actual; cambios de categoría recalculan con el texto actual. |
| RF-18 | Catálogo guarda orden ascendente o descendente por precio mediante `useState`, con ascendente predeterminado. Ordenar una copia de los resultados filtrados, desempatar por id estable y conservar el orden al filtrar y volver desde detalle. |
| RF-19 | Catálogo incluye mapa placeholder gris rotulado «Mapa», a la derecha en escritorio y debajo de las tarjetas en móvil. No requiere coordenadas para el alcance obligatorio. |
| RF-20 | Contador de huéspedes de reserva con mínimo uno y máximo capacidad; acciones incrementan o reducen de uno en uno y nunca salen del rango. |
| RF-21 | Toda navegación entre las tres páginas usa `<Link>` de Next.js, incluidas tarjetas, logo y regreso al catálogo. Los controles de galería, filtros y contador son botones, no enlaces de navegación. |

### Contrato de datos simulados

- Cada alojamiento incluye id único, título, ubicación, descripciones breve y completa, array de placeholders de fotos, precio por noche, moneda, valoración, número de reseñas, categoría, tipo, capacidad, anfitrión y comodidades con icono y etiqueta.
- Categorías, tipos y comodidades tienen identificadores estables para filtros y keys; sus etiquetas visibles no sustituyen los ids.
- Capacidad es un entero positivo, precio un número no negativo y valoración un valor válido en una escala documentada común.
- Los intervalos de disponibilidad comparan días sin introducir diferencias por hora o zona horaria en el número de noches.
- El anfitrión incluye nombre, información descriptiva, años como anfitrión y placeholder de avatar. Número de reseñas y años son enteros no negativos explícitos de los mock data; cero se muestra como tal, sin inventar cifras ni distintivos.
- Coordenadas de latitud y longitud solo son necesarias si se realiza el reto opcional del mapa real.
- Una fuente compartida alimenta Home, catálogo y detalle. Buscar y simular reserva no mutan sus registros.
- Interfaces y types definen alojamientos, anfitriones, categorías, comodidades, búsqueda, filtros y estados de carga. Renderizar listados mediante `.map()` con keys estables.

## 6. Especificación visual basada en los PNG

### Referencias y límites de interpretación

| Referencia | Observación directa | Aplicación al prototipo |
| --- | --- | --- |
| [Home](../airbnb-home.png) | Buscador compacto, categorías horizontales, bloques con títulos y flechas, filas de fotografías, tarjetas de alojamiento y barra inferior. | Jerarquía de Home y piezas compartidas; sustituir fotografías por placeholders y usar cuadrícula móvil de una columna según el requisito actualizado. |
| [Buscador expandido](../airbnb-search-expanded.png) | Fondo gris, cierre circular, destino abierto con sugerencias, fechas y huéspedes plegados, limpiar y buscar abajo. | Estado expandido de `SearchBar`, no catálogo ni nueva ruta. Sugerencias opcionales solo locales. |
| [Detalle](../airbnb-detalles-alojamiento.png) | Volver, imagen grande con contador, encabezado centrado, valoración y reseñas separadas, precio y acción de reserva inferior. | Galería de placeholders con Anterior / Siguiente, encabezado con reseñas y `BookingCard` con contador; conservar precio por noche y reserva simulada. |

Las imágenes tienen 750px de ancho. Las medidas propuestas para 375px asumen una escala 2:1 y son aproximadas, no mediciones del CSS original. No hay captura de escritorio ni de catálogo independiente. Descripción, anfitrión y comodidades no aparecen en el recorte del detalle, pero siguen siendo obligatorios.

### Composición y medidas orientativas

- **Home:** navbar superior con logo propio, campo de búsqueda e iconos de usuario; margen lateral aproximado de 24px y buscador compacto de 56px de alto. Debajo, categorías horizontales con icono y etiqueta; bloques separados 28–32px y títulos separados 16–20px de las imágenes.
- **Recomendaciones:** la captura muestra imágenes casi cuadradas de unos 158px y siguiente tarjeta parcialmente visible; el requisito actualizado usa una cuadrícula de una columna en móvil, no ese carrusel. Placeholders de proporción estable; título y descripción debajo, con valoración y estrellas y precio por noche.
- **Catálogo:** contador y ordenación en la cabecera; zona de resultados y mapa placeholder en columnas en escritorio, apiladas en móvil. Calcular columnas de tarjetas según el ancho restante después de reservar el mapa, no según todo el viewport.
- **Buscador expandido:** margen exterior de unos 12px, padding interior de 24px, panel con radio de unos 24px, título de 22px, campo y filas plegadas de unos 56px; acción principal de unos 48px. Mantener cierre y acciones accesibles cuando aparezca el teclado móvil.
- **Detalle:** cabecera de unos 64px, fotografía a todo el ancho y aproximadamente cuadrada, contador inferior derecho; transición blanca al encabezado con esquinas superiores de unos 24px, sin convertirlo en una tarjeta flotante. Título centrado y multilínea seguido de metadatos secundarios.
- **Reserva móvil:** franja blanca inferior con separador y botón ancho de unos 48px. Si se fija un resumen, reservar espacio y área segura; fechas y huéspedes deben seguir accesibles antes de confirmar. No fijar todo el formulario ni cubrir descripción y comodidades.

### Lenguaje visual e identidad propia

- Fondo `#FFFFFF`, superficies secundarias `#F5F5F5`, texto principal `#222222`, secundario `#6A6A6A` y bordes `#DDDDDD`.
- La referencia utiliza rosa intenso; el prototipo usa el acento propio `#087F6F`, también con indicación no cromática de selección y foco.
- Sans serif no propietaria disponible sin dependencias adicionales: base 16px, metadatos 14px, títulos de sección 20px y título de detalle 26px. No escalar fuente según el ancho del viewport.
- Espaciados de referencia: 8, 12, 16, 24 y 32px. Imágenes con radio aproximado de 16px; buscador y acción principal pueden tener extremos redondeados. Reservar sombras suaves para paneles elevados y buscador, no para todas las secciones.
- Iconos visuales de 20–24px, áreas táctiles de 44px, nombres accesibles y tooltips cuando proceda; no instalar bibliotecas ni copiar ilustraciones propietarias.
- Utilizar nombre, logo, textos y placeholders propios; sustituirlos por fotografías autorizadas solo como mejora posterior, no como requisito obligatorio. No trasladar corazones de favoritos, compartir, laureles, sellos de marca, promociones o promesas de cancelación y pago.

### Adaptación responsive propuesta

- **375px:** composición vertical, Home y catálogo con una columna de tarjetas; categorías horizontales desplazables. Mapa debajo de los resultados; buscador con paneles apilados y detalle con galería, información y reserva en flujo vertical.
- **Desde 768px:** cabecera horizontal cuando quepa; buscador con campos en fila; cuadrícula de dos columnas ampliable a tres o cuatro según espacio real y legibilidad. Filtros en filas sin recortes.
- **Detalle en escritorio:** galería de varias imágenes y, cuando haya espacio, descripción y comodidades a la izquierda con `BookingCard` a la derecha. El panel puede ser sticky sin cubrir cabecera; si no cabe, vuelve al flujo vertical.
- **Buscador en escritorio:** panel anclado o diálogo centrado con ancho limitado, sin estirar filas hasta ocupar todo el viewport. En móvil, altura limitada al espacio visible con desplazamiento interno accesible.
- Una barra inferior móvil es opcional y solo puede llevar a rutas existentes. No añadir pantallas por imitar los iconos de la captura.

### Criterios de aceptación visual

- **CV-01:** a 375px se conserva el orden navbar con búsqueda, categorías y recomendaciones de Home; cuadrícula de una columna, placeholders de fotos y metadatos legibles.
- **CV-02:** el buscador expandido distingue destino, fechas y huéspedes; limpiar, buscar y cerrar permanecen accesibles y no tapan campos ni sugerencias.
- **CV-03:** el detalle conserva la jerarquía imagen, título, ubicación, características y valoración, e incluye los bloques obligatorios no visibles en la captura.
- **CV-04:** todas las vistas comparten paleta, tipografía, controles y tarjetas; no contienen identidad ni promociones copiadas de Airbnb.
- **CV-05:** a 375px, 768px y un ancho de escritorio mayor no hay solapamientos ni desbordamiento de página; los títulos largos y los estados de carga no desplazan incoherentemente controles.
- **CV-06:** la revisión registra por separado coincidencias con referencias móviles y propuestas de catálogo/escritorio, sin afirmar fidelidad exacta donde faltan capturas.
- **CV-07:** el mapa placeholder aparece a la derecha en escritorio y debajo en móvil; la cabecera permite leer contador y seleccionar orden sin solapamientos.

## 7. Requisitos no funcionales

| ID | Requisito y condición verificable |
| --- | --- |
| RNF-01 | Next.js 16, App Router, React, TypeScript y Tailwind CSS; alcance obligatorio sin bibliotecas de componentes ni dependencias adicionales. Solo los retos opcionales explícitos permiten una librería de mapa o date picker; no instalarlas como requisito base. |
| RNF-02 | Componentes reutilizables en `/components`, pequeños y con responsabilidad única; evitar duplicación de tarjetas y filtrado. |
| RNF-03 | Hooks, estado y eventos requieren una frontera cliente; mantener como Server Components las partes que puedan componerse en servidor sin interactividad propia. |
| RNF-04 | `useState` para interacción, `useEffect` para carga simulada y `.map()` con keys únicas estables; no índices ni valores aleatorios. |
| RNF-05 | Navegación entre páginas con `<Link>` de Next.js sin recarga completa; acceso directo funcional a catálogo y detalle sin visitar primero Home. |
| RNF-06 | Mobile-first a 375px y adaptación desde 768px; sin textos, controles, imágenes o superficies fijas superpuestos. |
| RNF-07 | HTML semántico, teclado, foco visible, etiquetas, textos alternativos y estados activos no dependientes solo del color. Áreas táctiles mínimas de 44px; contraste mínimo de 4,5:1 en texto normal y 3:1 en texto grande. |
| RNF-08 | Identidad y placeholders propios; consistencia con la sección visual y con las partes compatibles de `context.md`. No copiar marca ni dependencias visuales propietarias. |
| RNF-09 | Proporciones de imagen y dimensiones estables para evitar saltos; estados de carga o error no bloquean la navegación disponible. |
| RNF-10 | No enviar datos del usuario a servicios externos, pedir ubicación ni guardar reservas o información personal. La URL solo contiene criterios y contexto de navegación. |
| RNF-11 | La simulación es explícita antes de confirmar y en su resultado; no prometer disponibilidad real, descuentos, cancelación gratuita ni pagos diferidos. |
| RNF-12 | Evaluar fidelidad sobre capturas disponibles; documentar como propuestas catálogo y escritorio. No fijar puntuaciones de rendimiento ni tiempos de respuesta sin mediciones y entorno acordados. |

## 8. Casos límite

| Caso | Comportamiento esperado | Referencias |
| --- | --- | --- |
| Catálogo sin parámetros | Valores iniciales y alojamientos compatibles con un huésped. | RF-03 |
| Home mientras carga | Indicador de carga y lista vacía; no confundir con ausencia de coincidencias. | CA-01.4 |
| Texto o categoría cambian antes de cargar | Al resolver datos, aplicar los valores actuales sin perder entrada ni reiniciar carga. | CA-03.8 |
| Borrar o ampliar texto tras filtrar | Recalcular sobre todos los datos cargados, no sobre la lista ya reducida; conservar categoría. | RF-17 |
| Destino, categoría o filtros sin coincidencias | Contador cero, ninguna tarjeta y acciones de recuperación; no inventar resultados. | CA-02.3, CA-04.4 |
| Una sola fecha, fecha inexistente o salida no posterior | Error asociado al campo; no aplicar criterios ni confirmar hasta corregirlos. | RF-05, CA-08.2 |
| Estancia con una noche no disponible | Excluir el alojamiento de la búsqueda y rechazar esa reserva simulada. | RF-06, CA-08.3 |
| Huéspedes cero, negativos o fraccionarios | Rechazar el valor y conservar el último valor válido. | RF-07, RF-16 |
| Huéspedes superiores a capacidad | Excluir resultados insuficientes o bloquear confirmación en detalle. | RF-07, CA-08.2 |
| Precio mínimo igual al máximo | Mostrar alojamientos con ese precio exacto. | RF-09 |
| Límites de precio invertidos o inválidos | Mostrar error y conservar los últimos filtros válidos aplicados. | RF-09, RF-16 |
| URL malformada o con valores desconocidos | Ignorar claves desconocidas; para campos escalares tomar el primer valor válido. Descartar tipos o comodidades no reconocidos y duplicados. Restablecer valores inválidos; descartar conjuntamente fechas incompletas o inválidas. No provocar excepciones. | RF-11 |
| Retorno externo o inválido | Ignorarlo y volver a `/search`; nunca salir de la aplicación mediante ese parámetro. | RF-12 |
| Id de alojamiento inexistente | Estado de no encontrado y regreso al catálogo, sin reserva operativa. | CA-06.5 |
| Cambio de id durante la carga | Descartar la carga anterior y presentar únicamente el estado del id actual. | RF-13 |
| Sin imágenes o fallo de imagen | Sustituto accesible con dimensiones estables, sin contador o controles engañosos. | RF-14, RNF-09 |
| Una sola foto placeholder | Mostrar índice válido con Anterior / Siguiente desactivados; no avanzar fuera del array. | RF-14 |
| Primera o última foto, o nuevo id | Desactivar navegación que saldría del rango; reiniciar índice con el nuevo alojamiento. | RF-14 |
| Orden con precios iguales o cero resultados | Desempatar por id estable; permitir cambiar selección sin alterar contador ni fallar con lista vacía. | RF-18 |
| Orden en URL desconocido | Restaurar ascendente; conservarlo al cambiar filtros y volver del detalle. | RF-11, RF-18 |
| Contador de huéspedes en mín/máx | Desactivar reducir en uno y aumentar en capacidad; con capacidad uno ambas acciones quedan desactivadas. | RF-20 |
| Sin comodidades o datos opcionales | Mensaje descriptivo u omisión del bloque opcional; no inventar información. | Contrato de datos |
| Datos esenciales corruptos o ids duplicados | Corregir el conjunto de mock data antes de aceptar el prototipo; no fabricar precios, capacidad ni keys aleatorias. | RNF-04, Contrato de datos |
| Texto largo o teclado móvil abierto | Saltos de línea y desplazamiento accesible; mantener campos, cierre y acciones visibles o alcanzables. | CA-09.1, CV-02 |
| Reserva o navegación inferior fija | Reservar espacio y área segura para no cubrir contenido ni foco de teclado. | RNF-06, CV-05 |
| Cambio de criterios después de confirmar | Invalidar la confirmación; una nueva acción solo vuelve a simular, sin operaciones reales. | CA-08.5 |
| Recarga después de confirmar | No recuperar una reserva inexistente; restaurar únicamente criterios válidos presentes en URL. | RF-11, RF-15 |

## 9. Retos opcionales, solo después del alcance obligatorio

### RO-01. Mapa interactivo real

- Sustituir el placeholder por un mapa usando, por ejemplo, `react-leaflet` o la API de Google Maps, solo cuando estén completos todos los requisitos obligatorios.
- Añadir coordenadas válidas a cada alojamiento y mostrar los resultados actuales como pines; filtrado y ordenación no crean pines duplicados.
- Mantener la posición responsive prevista. Si no se puede cargar el mapa, volver al placeholder sin bloquear resultados.
- Esta excepción permite la dependencia de mapa necesaria. Un servicio externo puede solicitar recursos cartográficos, pero no recibirá datos personales ni ubicación real del usuario; documentar sus condiciones y no incluir secretos en el repositorio.

### RO-02. Date picker y precio total

- Mantener los campos básicos de fechas del contexto sin dependencias para el alcance obligatorio. El reto opcional los mejora con una librería de date picker y cálculo total; no hace obligatorio instalarla.
- Solo después de completar el resto, seleccionar entrada y salida funcionales con la librería y calcular noches como diferencia entre días de calendario.
- Total = precio por noche × número de noches válidas, sin tasas ni descuentos inventados. Actualizarlo al cambiar fechas; con fechas incompletas o inválidas no mostrar un total confirmado.
- Mantener salida posterior a entrada y comprobar disponibilidad local. El cálculo no convierte la simulación en una reserva o pago real.
- Mostrar precio por noche además del total y probar estancias de una noche y cambios de mes sin errores por zona horaria.

Los retos no forman parte de los criterios obligatorios de aceptación y su ausencia no bloquea la entrega. Las excepciones de dependencias y recursos externos se limitan a estos retos, sin ampliar backend, autenticación ni pagos.

## 10. Criterios de aceptación globales y validación prevista

1. Las tres rutas funcionan con datos compartidos, tarjetas reutilizadas y toda navegación entre páginas mediante `<Link>` sin recargas completas.
2. Se cumplen los criterios CA de las diez historias, incluidos carga de Home, búsqueda instantánea con lista local, ordenación, mapa placeholder, galería, anfitrión y contador de huéspedes.
3. Búsqueda, filtros y ordenación siguen los requisitos RF; contador, URL del catálogo y listado reflejan los mismos criterios aplicados.
4. El detalle simula carga mediante `useEffect` y mantiene coherencia con su tarjeta, sin resultados obsoletos al cambiar de id.
5. Reserva explícitamente simulada, con validación de fechas, disponibilidad y capacidad, sin solicitudes externas, pagos ni registros reales.
6. Se cumplen CV-01 a CV-07, cuadrícula de una columna móvil, varias en escritorio y mapa en la posición prevista; comprobar teclado, foco, etiquetas y contraste.
7. La revisión de arquitectura confirma stack requerido, tipado, hooks, limpieza de temporizadores y keys adecuados; sin dependencias extra en el alcance obligatorio. Retos opcionales se evalúan por separado, solo si se realizan.

Validación futura: recorrer Home, búsqueda, detalle y regreso con mock data que diferencien capacidad, precio, categorías, comodidades y disponibilidad. Escribir y borrar durante y después de la carga; cambiar categoría y orden; navegar la galería y llevar huéspedes a sus límites. Comprobar acceso directo, parámetros inválidos, atrás/adelante y casos límite. Comparar capturas a 375px con los PNG y revisar adaptación a 768px y escritorio mayor, distinguiendo observaciones de propuestas y cambios explícitos del requisito actualizado.

Cuando exista la aplicación, realizar comprobaciones de tipado o calidad acotadas. Esta especificación no exige crear archivos de test ni ejecutar pruebas de una aplicación todavía inexistente.