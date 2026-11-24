# Contexto del proyecto

## Objetivo

Reconstruir el frontend de una plataforma de alquiler vacacional que replica la interfaz de Airbnb mediante componentes reutilizables de React. La aplicación utilizará Next.js 16 con App Router, TypeScript y Tailwind CSS, y tendrá tres vistas principales: Home, catálogo de alojamientos y detalle de alojamiento.

El alcance es exclusivamente visual e interactivo: datos simulados, sin backend, pagos ni reservas reales. Este documento define la especificación; no implica implementar código.

## Usuario

Una persona que busca alojamiento vacacional y necesita explorar alternativas, modificar criterios de búsqueda, filtrar resultados, comparar precios y consultar las características de un alojamiento antes de decidir.

## Páginas y componentes principales

### 1. Home: `/`

Presenta la navegación, el buscador, las categorías y los alojamientos recomendados.

| Componente | Responsabilidad y comportamiento esperado |
| --- | --- |
| `Navbar` | Mostrar logo, navegación principal e icono de usuario. El logo permite volver a la Home. |
| `SearchBar` | Recoger destino, fechas de entrada y salida y número de huéspedes. Al buscar, navegar a `/search` conservando los criterios seleccionados. |
| `CategoryFilter` | Mostrar categorías de alojamientos y gestionar la selección activa mediante `useState`. La selección debe ser visible y actualizar los alojamientos mostrados. |
| `PropertyCard` | Mostrar imagen, ubicación, descripción breve, precio por noche y valoración. Permitir navegar al detalle del alojamiento. |
| `PropertyGrid` | Renderizar alojamientos recomendados mediante componentes `PropertyCard` reutilizables. Adaptar las columnas al espacio disponible. |

### 2. Catálogo de alojamientos: `/search`

Permite consultar y refinar los resultados de búsqueda.

| Componente | Responsabilidad y comportamiento esperado |
| --- | --- |
| `Navbar` | Reutilizar la navegación principal de la Home. |
| `SearchBar` | Mostrar los criterios actuales y permitir modificar destino, fechas y número de huéspedes. |
| `FilterBar` | Filtrar por precio, tipo de alojamiento y características disponibles. Mantener visibles los filtros activos. |
| `ResultsHeader` | Mostrar el número de alojamientos que cumplen los criterios y actualizarlo cuando cambien los resultados. |
| `PropertyGrid` | Renderizar el listado dinámico de alojamientos que cumplen los criterios de búsqueda y los filtros. |
| `PropertyCard` | Reutilizar el componente de la Home y enlazar cada alojamiento con `/property/[id]`. |

Comportamiento esperado:

- Combinar los criterios del buscador y los filtros sobre los datos simulados.
- Conservar los criterios en parámetros de URL para permitir volver al catálogo con la misma búsqueda.
- Interpretar el filtro de precio como precio por noche y el de huéspedes como capacidad mínima necesaria.
- Simular la disponibilidad para las fechas elegidas mediante datos locales, sin consultas externas ni garantías de disponibilidad real.
- Permitir limpiar los filtros y mostrar un estado vacío claro cuando no haya coincidencias.
- Mantener coherentes el contador de resultados y el listado visible.

### 3. Detalle de alojamiento: `/property/[id]`

Permite examinar un alojamiento concreto y simular una reserva.

| Componente | Responsabilidad y comportamiento esperado |
| --- | --- |
| `Navbar` | Reutilizar la navegación principal. |
| `PropertyHeader` | Mostrar título, ubicación y valoración del alojamiento. |
| `ImageGallery` | Mostrar las imágenes del alojamiento con una distribución adaptada a móvil y escritorio. |
| `PropertyDescription` | Mostrar descripción, información del anfitrión y características principales. |
| `AmenitiesList` | Listar los servicios y comodidades disponibles. |
| `BookingCard` | Mostrar precio por noche, selección de fechas, número de huéspedes y botón de reserva simulada. |

Comportamiento esperado:

- Identificar el alojamiento mediante el parámetro `id` de la ruta dinámica.
- Simular la carga de sus datos locales mediante `useEffect` en un Client Component, mostrando un estado de carga.
- Mostrar un estado de alojamiento no encontrado si el identificador no existe en los datos simulados.
- Gestionar fechas, huéspedes y confirmación simulada mediante `useState`.
- Validar que la salida sea posterior a la entrada y que los huéspedes no superen la capacidad del alojamiento.
- El botón de reserva debe mostrar una confirmación exclusivamente local, sin procesar pagos ni crear reservas reales.
- Incluir un botón para volver al catálogo, conservando los criterios de búsqueda cuando proceda. Si se accede directamente al detalle, volver a `/search`.

## Flujo de navegación

1. El usuario explora la Home y selecciona una categoría o introduce criterios de búsqueda.
2. Accede al catálogo y ajusta la búsqueda y los filtros.
3. Compara precios por noche, ubicaciones y valoraciones en las tarjetas.
4. Abre el detalle de un alojamiento para consultar imágenes, descripción y comodidades.
5. Selecciona fechas y huéspedes para simular una reserva, o vuelve al catálogo.

La navegación interna debe utilizar las capacidades de Next.js App Router, como `Link` y el router, sin recargar completamente el navegador.

## Datos simulados y tipado

- Utilizar una fuente compartida de mock data para mantener coherentes tarjetas, resultados y detalles.
- Definir interfaces y types de TypeScript para alojamientos, anfitriones, categorías, comodidades, criterios de búsqueda y filtros.
- Cada alojamiento debe tener un identificador único y estable, título, ubicación, descripción breve y completa, imágenes, precio por noche, moneda, valoración, categoría, tipo, capacidad, anfitrión y comodidades.
- Incluir información local suficiente para simular disponibilidad y aplicar los criterios de búsqueda.
- Utilizar los identificadores de los datos como keys al renderizar listados mediante `.map()`; no emplear índices ni valores aleatorios.

## Requisitos técnicos y arquitectura

- Next.js 16 con App Router, React, TypeScript y Tailwind CSS.
- Rutas de página en `app/page.tsx`, `app/search/page.tsx` y `app/property/[id]/page.tsx`.
- Organizar los componentes reutilizables en `/components`.
- Mantener componentes pequeños, enfocados y con una única responsabilidad. Compartir `Navbar`, `SearchBar`, `PropertyGrid` y `PropertyCard` entre las vistas correspondientes.
- Utilizar `useState` para los estados interactivos y `useEffect` para la carga simulada del detalle.
- Mantener como Server Components las partes que no necesitan estado ni APIs del navegador.
- Marcar con `"use client"` los componentes que requieren hooks, eventos o interactividad. Un componente estático no necesita convertirse en Client Component por estar dentro de uno interactivo.
- Pasar datos y acciones mediante props correctamente tipadas y mantener los filtros y resultados sincronizados.
- Usar datos simulados únicamente: no implementar backend, autenticación, pagos ni reservas reales.
- No utilizar bibliotecas de componentes ni añadir dependencias adicionales a la base requerida. Resolver la interfaz con React y Tailwind CSS.

## Diseño responsive y accesibilidad

- Aplicar un enfoque mobile-first, diseñando inicialmente para un viewport de 375px.
- Adaptar el diseño al escritorio a partir de 768px, sin perder funcionalidad en tamaños intermedios.
- Evitar desbordamientos horizontales, solapamientos y textos recortados.
- Adaptar buscador, filtros, cuadrícula, galería y panel de reserva al ancho disponible.
- Mantener consistencia de tipografía, colores, espaciados, imágenes, bordes y estados interactivos entre las tres páginas.
- Utilizar controles semánticos, etiquetas para los campos, textos alternativos para las imágenes y nombres accesibles para los botones de icono.
- Permitir navegación por teclado y mostrar estados de foco, selección, carga, validación y ausencia de resultados.

## Diseño visual de referencia

### Alcance del análisis e identidad propia

- Referencias analizadas: `airbnb-home.png`, `airbnb-search-expanded.png` y `airbnb-detalles-alojamiento.png`.
- Las tres imágenes muestran composiciones móviles de 750px de ancho. Las medidas siguientes son aproximaciones para un viewport de 375px, tomando como hipótesis una escala de captura de 2:1; no son mediciones del CSS original.
- No hay una captura independiente del catálogo ni una referencia de escritorio. Su composición se propone a partir de los patrones compartidos y de los requisitos existentes, no como una observación directa.
- Tomar como referencia la jerarquía, distribución y legibilidad, sin copiar el nombre, logotipo, tipografía propietaria, ilustraciones, textos promocionales ni distintivos de marca. Utilizar nombre, logo sencillo, textos y fotografías de uso autorizado propios.
- Las experiencias, hoteles, servicios, favoritos, compartir, inicio de sesión y promociones visibles son referencias de composición, no nuevas funcionalidades obligatorias. Mantener el alcance de alojamientos y reserva simulada.

### Lenguaje visual compartido

| Elemento | Observación en las capturas | Especificación para la aplicación |
| --- | --- | --- |
| Superficies | Fondo blanco, paneles blancos y gris muy claro en el buscador expandido. | Blanco `#FFFFFF` como base; `#F5F5F5` para superficies secundarias. Secciones sin cajas decorativas; paneles solo cuando cumplen una función. |
| Texto y bordes | Texto principal casi negro, información secundaria gris y separadores discretos. | Texto principal `#222222`, secundario `#6A6A6A`, bordes `#DDDDDD`; comprobar contraste en controles y estados. |
| Acento | Rosa intenso aproximado entre `#FF385C` y `#E00060` en búsqueda, reserva y navegación activa. | Sustituirlo por un acento propio verde profundo `#087F6F`, con texto blanco en acciones principales y estados activos también identificables por forma o subrayado. |
| Tipografía | Sans serif, títulos y acciones seminegritas; descripciones de menor contraste. | Sans serif no propietaria disponible, sin dependencias añadidas. Texto base de 16px, metadatos de 14px, títulos de sección de 20px y título de detalle de 26px. Ajustar mediante saltos de línea, no escalando con el ancho del viewport. |
| Formas | Buscador y acciones en píldora; imágenes y paneles con esquinas amplias. | Buscador y acción principal con extremos redondeados; imágenes con radio aproximado de 16px y panel de búsqueda de 24px. No convertir todas las secciones en tarjetas. |
| Sombras | Sombras suaves alrededor del buscador y de los paneles elevados. | Reservar una sombra discreta para el buscador expandido y superficies flotantes; evitar sombras en cada elemento del listado. |
| Iconos | Trazos simples para buscar, volver, cerrar, usuario y valoración; ilustraciones en categorías. | Iconos de estilo consistente, sin reutilizar ilustraciones de marca ni instalar bibliotecas. Tamaño visual de 20–24px y área táctil mínima de 44px; nombre accesible y tooltip cuando sea necesario. |

### Home: estructura y correspondencia con componentes

- **Cabecera / `Navbar` y `SearchBar`:** la captura comienza con un buscador compacto ancho, de unos 56px de alto, margen lateral de 24px, borde fino y sombra suave. El icono y el texto están centrados. Mantener también el logo propio y acceso de usuario exigidos, aunque no aparezcan en este recorte.
- **`CategoryFilter`:** fila horizontal de opciones con icono y etiqueta; la activa tiene contraste y relieve distintos. A 375px, permitir desplazamiento horizontal dentro de la fila, sin desbordar toda la página. Usar categorías de alojamientos, no copiar las familias de productos de la captura.
- **Secciones de contenido:** título seminegrita alineado a la izquierda y acción circular a la derecha. Separación vertical aproximada de 28–32px entre bloques y de 16–20px entre título e imágenes. Las fotografías, no el texto promocional, dominan el contenido.
- **`PropertyGrid` y `PropertyCard`:** la referencia muestra filas horizontales con la siguiente tarjeta parcialmente visible. Las fotos de alojamiento son casi cuadradas, de unos 158px por lado a la escala propuesta, con separación de unos 12px. Debajo aparecen título en una o dos líneas y metadatos grises. Mantener ubicación, descripción breve, precio por noche y valoración, conforme a los requisitos.
- Las insignias y corazones superpuestos muestran un patrón de información sobre la imagen; no añadir favoritos ni copiar el distintivo de marca. Evitar que cualquier etiqueta propia oculte partes relevantes de la fotografía.
- La barra inferior de la captura es blanca, con separador superior y una opción activa. Puede inspirar una navegación móvil limitada a las rutas existentes; no crear pantallas de favoritos o autenticación. Si se fija, reservar su altura en el contenido y respetar el área segura del dispositivo.

### Buscador expandido: estado de `SearchBar`

- **Estructura observada:** fondo gris claro; pestañas superiores y botón circular de cierre; panel de destino abierto; filas de fechas y huéspedes plegadas; acciones inferiores para limpiar y buscar.
- **Panel de destino:** márgenes exteriores aproximados de 12px y padding interior de 24px. Título de unos 22px, campo de búsqueda de 56px de alto con borde gris y lista de sugerencias con icono en una superficie de unos 56px por lado. Separación de 16–24px entre elementos relacionados.
- **Fechas y huéspedes:** filas blancas de unos 56px de alto, con etiqueta secundaria a la izquierda y valor o acción a la derecha; separación vertical aproximada de 12px.
- **Acciones:** limpiar como acción secundaria y buscar como botón principal con icono, de unos 48px de alto. Mantenerlas visibles sin tapar el formulario ni las sugerencias, también cuando aparezca el teclado móvil.
- **Adaptación funcional:** representar un estado expandido del buscador existente, no una cuarta ruta. Abrir o plegar destino, fechas y huéspedes mediante `useState`; conservar los valores al plegar y descartarlos únicamente al limpiar. Las sugerencias, si se muestran, serán datos locales; no solicitar geolocalización real ni mantener historiales externos.
- Utilizar una sola categoría funcional de búsqueda de alojamientos; no reproducir las pestañas de hoteles, experiencias y servicios. Si el buscador se presenta como diálogo, gestionar foco, cierre por teclado y retorno del foco al control que lo abrió.

### Catálogo: composición propuesta

- Reutilizar cabecera, buscador, tipografía, tarjetas y espaciados de la Home.
- Colocar `FilterBar` después del buscador y `ResultsHeader` antes de `PropertyGrid`. Mostrar filtros activos con controles claros; permitir que se distribuyan en varias filas en móvil.
- A 375px, utilizar una columna de resultados completos con imágenes de proporción estable, evitando que los títulos o precios dependan del ancho de un carrusel. Reservar las filas horizontales de la referencia para recomendaciones de la Home.
- Mantener el estado vacío y el contador dentro de la misma estructura, sin introducir mapas u otras vistas no solicitadas.

### Detalle: estructura y correspondencia con componentes

- **Cabecera:** barra blanca de unos 64px de alto; acción de volver a la izquierda y acciones secundarias a la derecha en la referencia. Mantener `Navbar` reutilizada y el regreso al catálogo, sin exigir compartir o favoritos.
- **`ImageGallery`:** imagen principal a todo el ancho, aproximadamente cuadrada, con contador discreto superpuesto en la esquina inferior derecha. Mostrar imágenes reales del alojamiento simulado; el contador debe reflejar su cantidad efectiva. El recorte debe preservar la información relevante.
- **`PropertyHeader`:** el bloque blanco comienza visualmente sobre el borde inferior de la imagen, con esquinas superiores redondeadas de unos 24px. Es una transición entre secciones, no una tarjeta flotante. El título está centrado, en dos líneas, seguido por ubicación, tipo y capacidad en gris; padding lateral aproximado de 24px y separación de 16–20px.
- **Valoración:** fila de indicadores con cifra destacada y separadores verticales. Utilizar valoración y número de reseñas únicamente si existen en los mock data, sin copiar laureles ni sellos de marca.
- **`PropertyDescription` y `AmenitiesList`:** no aparecen en el recorte. Ubicarlas después del encabezado con bloques sin marco, títulos de sección y separadores discretos; conservar toda la información exigida.
- **`BookingCard`:** la referencia presenta una franja inferior blanca con separador, precio destacado y botón de reserva ancho de unos 48px de alto. En la aplicación, mostrar precio por noche y controles de fechas y huéspedes. No sustituir el precio por noche por el total mostrado en la captura, ni prometer descuentos, cancelación gratuita o cobros diferidos.
- Si se fija un resumen de reserva en móvil, no fijar todo el formulario ni ocultar descripción y comodidades; reservar espacio inferior suficiente y abrir los controles necesarios antes de confirmar la simulación.

### Adaptación responsive propuesta y comprobación

- **375px:** disposición vertical, márgenes habituales de 24px y gaps de 8, 12, 16, 24 y 32px según jerarquía. Buscador expandido con paneles apilados, galería a todo el ancho y controles táctiles de al menos 44px.
- **Desde 768px:** cabecera horizontal con logo, navegación y usuario; buscador con campos en fila cuando quepan; categorías y filtros distribuidos sin recortes. Cuadrícula de dos columnas, ampliable a tres o cuatro según el espacio real y la legibilidad de las tarjetas.
- **Detalle en escritorio:** galería de varias imágenes y contenido en dos columnas cuando exista espacio suficiente: descripción y comodidades a la izquierda, `BookingCard` a la derecha. El panel puede ser sticky sin cubrir la cabecera; si no cabe, mantenerlo en el flujo debajo del contenido.
- **Buscador en escritorio:** panel anclado al buscador o diálogo centrado de ancho limitado, sin estirar las filas hasta ocupar todo el viewport. En móvil, limitar su altura al espacio visible y permitir desplazamiento interno accesible.
- Mantener dimensiones estables mediante proporciones de imagen y tamaños mínimos de controles. Permitir títulos multilínea y separar información secundaria en lugar de reducir excesivamente la fuente.
- Comparar a 375px y desde 768px: orden visual, proporción de fotografías, márgenes, jerarquía, estados activos y ausencia de solapamientos. La fidelidad se evalúa sobre estos patrones, no sobre una reproducción de la identidad de Airbnb; validar las propuestas de escritorio cuando haya referencias adicionales.

## Metodología de desarrollo

1. Utilizar capturas de pantalla de Airbnb como referencia visual para cada una de las tres vistas. Si aún no están disponibles, solicitarlas antes de evaluar fidelidad visual.
2. Aplicar prompts de visión para transformar las capturas en especificaciones de componentes: distribución, dimensiones, espaciado, tipografía, colores y estados visibles.
3. Desarrollar iterativamente, componente a componente, empezando por las piezas compartidas.
4. Reutilizar los componentes entre vistas y comprobar su comportamiento con datos simulados.
5. Comparar cada vista con sus referencias a 375px y en escritorio desde 768px, ajustando la interfaz de manera incremental.

## Criterios de calidad y aceptación

- **Fidelidad visual:** la estructura, jerarquía y apariencia de las tres vistas reproducen las capturas de referencia disponibles.
- **Responsive:** la aplicación es usable a 375px y se adapta al escritorio desde 768px sin desbordamientos ni solapamientos.
- **Consistencia visual:** los componentes compartidos mantienen el mismo aspecto y comportamiento en todas las vistas.
- **Navegación funcional:** Home, catálogo y detalle están conectados sin recargas completas; el regreso al catálogo funciona también desde un acceso directo al detalle.
- **Búsqueda y filtros:** los resultados reflejan los criterios activos y su contador coincide con los alojamientos visibles.
- **Detalle completo:** cada identificador válido muestra sus datos, galería y comodidades, con estados de carga y de identificador inexistente.
- **Reserva simulada:** fechas y huéspedes se validan y la confirmación es local, sin acciones reales.
- **Reutilización:** las piezas compartidas se implementan una sola vez y cada componente tiene una responsabilidad clara.
- **Mantenibilidad y tipado:** interfaces, types, props y keys son coherentes; los listados se renderizan con `.map()` e identificadores estables.
- **Alcance respetado:** solo frontend con mock data, sin backend ni bibliotecas de componentes o dependencias adicionales.