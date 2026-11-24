# Tareas de implementación

Fuentes: [plan de implementación](plan.md), [especificación vigente](spec.md) y [contexto del proyecto](../context.md). Ante diferencias, aplicar las prioridades de la especificación: placeholders, Home de una columna móvil, mapa placeholder obligatorio y ordenación por precio.

## Estado y uso de las casillas

**Estado inicial de todas las tareas: pendiente de ejecución. No se ha implementado ni verificado la aplicación.**

Se utiliza `[ ]` para las tareas pendientes. Marcar `[x]` únicamente cuando la tarea esté implementada y verificada. Al ejecutar una tarea, registrar su id, estado real, comprobación y resultado en la sección de seguimiento.

Ejecutar una fase a la vez y respetar dependencias. Cada tarea incluye una acción y un criterio observable de verificación. No avanzar una fase con bloqueos, no crear tests sin petición explícita y realizar como máximo dos intentos de corrección por fallo. No repetir suites o builds completos para cada componente.

## Fase 1. Preparar el proyecto

**Dependencias:** ninguna. **Cobertura:** RNF-01, RNF-03.

- [ ] **T01.1 — Revisar entorno y archivos existentes.** Comprobar Node compatible con Next.js 16, gestor de paquetes y estado del repositorio. **Verificar:** registrar versiones y archivos que deben conservarse; no sobrescribir cambios del usuario.
- [ ] **T01.2 — Inicializar la base requerida.** Configurar Next.js 16, React, TypeScript, App Router y Tailwind CSS sin bibliotecas adicionales. **Verificar:** manifiesto y configuración contienen la base necesaria y mantienen documentación y PNG intactos.
- [ ] **T01.3 — Crear layout y rutas mínimas.** Preparar `/`, `/search` y `/property/[id]`, idioma español y resolución de parámetros compatible con Next.js 16. **Verificar:** las tres rutas responden sin errores de parámetros síncronos obsoletos.
- [ ] **T01.4 — Definir comandos disponibles e iniciar desarrollo.** Preparar comandos de servidor, tipado y producción según herramientas instaladas. **Verificar:** servidor inicia sin errores de configuración y se comunica su URL; no asumir que existe `next lint`.

## Fase 2. Definir datos y reglas compartidas

**Dependencias:** fase 1. **Cobertura:** contrato de datos, RF-03 a RF-10, RNF-04.

- [ ] **T02.1 — Definir interfaces y types.** Tipar alojamiento, anfitrión, fotos placeholder, categorías, comodidades, disponibilidad, búsqueda, filtros, orden y carga. **Verificar:** datos y props respetan los contratos sin eludir el tipado.
- [ ] **T02.2 — Crear una fuente única de mock data.** Incluir ids, títulos, ubicación, descripciones, moneda única, precios, estrellas, reseñas, capacidad, anfitrión con años y avatar y comodidades con icono. **Verificar:** ids únicos, importes válidos y campos obligatorios presentes.
- [ ] **T02.3 — Preparar ejemplos discriminantes.** Incluir Playa, Mansiones y Tendencias, precios empatados, capacidad uno, varias fotos, una sola y disponibilidad parcial. **Verificar:** cada escenario permite observar un resultado distinto sin inventar datos en la UI.
- [ ] **T02.4 — Implementar normalización y filtrado.** Buscar en título y ubicación en Home y ubicación en catálogo; combinar criterios según AND, tipos según OR y comodidades según AND. **Verificar:** mayúsculas, acentos y espacios no impiden coincidencias; cero coincidencias devuelve lista vacía.
- [ ] **T02.5 — Implementar validación compartida.** Validar fechas de calendario, entrada/salida, huéspedes y precios inclusivos, y disponibilidad de todas las noches. **Verificar:** rechazar fecha inexistente, intervalo invertido, huéspedes fraccionarios y rango de precio invertido; excluir una estancia con una noche no disponible.

## Fase 3. Construir piezas visuales compartidas

**Dependencias:** fases 1 y 2. **Cobertura:** CA-01.1 a CA-01.3, CA-05.1, CA-05.3, CV-04.

- [ ] **T03.1 — Definir base visual propia.** Aplicar paleta del contexto, acento `#087F6F`, tipografía no propietaria y espaciados consistentes. **Verificar:** ausencia de marca copiada y consistencia de colores y jerarquía.
- [ ] **T03.2 — Crear Navbar reutilizable.** Incluir logo, campo de búsqueda e iconos del menú de usuario. **Verificar:** orden legible a 375px, nombres accesibles y ninguna acción que prometa autenticación real.
- [ ] **T03.3 — Crear PropertyCard.** Mostrar placeholder, título, ubicación, descripción breve, precio por noche con moneda y valoración numérica con estrellas. **Verificar:** información coincide con mock data y el enlace `<Link>` abre el id correcto.
- [ ] **T03.4 — Crear PropertyGrid.** Renderizar con `.map()` y keys por id; una columna móvil y varias desde 768px según espacio. **Verificar:** sin keys duplicadas, desbordamientos ni controles interactivos anidados en el enlace de tarjeta.
- [ ] **T03.5 — Crear estados visuales comunes.** Diferenciar carga, vacío y placeholder de dimensiones estables. **Verificar:** cada estado se distingue y no provoca saltos incoherentes de tamaño ni requiere bibliotecas de iconos.

## Fase 4. Implementar Home interactiva

**Dependencias:** fases 2 y 3. **Cobertura:** HU-01, HU-02, CA-03.6 a CA-03.8, RF-13, RF-17.

- [ ] **T04.1 — Definir estado local de Home.** Usar `useState` para texto, categoría, carga, datos cargados y lista visible; iniciar lista vacía y carga activa. **Verificar:** el primer estado muestra indicador y no un falso mensaje de cero resultados.
- [ ] **T04.2 — Simular carga al montar.** Utilizar `useEffect` y `setTimeout` de aproximadamente un segundo para asignar datos y terminar carga; limpiar temporizador al desmontar. **Verificar:** los datos aparecen después de la espera y no hay actualizaciones de una carga cancelada.
- [ ] **T04.3 — Filtrar en cada cambio de entrada.** Guardar texto y actualizar mediante setter la lista visible desde todos los datos cargados. **Verificar:** escribir reduce coincidencias sin navegar; borrar o ampliar el texto recupera resultados descartados previamente.
- [ ] **T04.4 — Crear categorías horizontales.** Mostrar icono y etiqueta, incluida opción de todas, Playa, Mansiones y Tendencias; guardar activa con `useState`. **Verificar:** selección resaltada y accesible, texto y categoría se combinan y la fila no desborda la página.
- [ ] **T04.5 — Resolver interacción durante carga.** Aplicar texto y categoría actuales al recibir datos sin reiniciar la espera en cada pulsación. **Verificar:** escribir y seleccionar antes del fin de carga produce el mismo resultado que hacerlo después.
- [ ] **T04.6 — Completar estados y acceso al detalle.** Mostrar vacío accionable solo tras cargar y reutilizar tarjetas enlazadas. **Verificar:** una búsqueda sin coincidencias es recuperable y una tarjeta visible abre su detalle con `<Link>`.

## Fase 5. Completar buscador y criterios de URL

**Dependencias:** fases 2 a 4. **Cobertura:** HU-03, RF-11, RF-12, CA-09.4, CV-02.

- [ ] **T05.1 — Completar SearchBar reutilizable.** Añadir destino, fechas básicas nativas y huéspedes, con secciones expandibles gestionadas por estado. **Verificar:** plegar y cerrar conserva valores y no crea una cuarta ruta.
- [ ] **T05.2 — Validar búsqueda antes de navegar.** Permitir exploración sin destino o fechas y exigir fechas completas si se informa una. **Verificar:** errores junto al campo bloquean el enlace de búsqueda inválida; criterios válidos enlazan a `/search`.
- [ ] **T05.3 — Serializar criterios mediante APIs estructuradas.** Construir enlaces `<Link>` y leer búsqueda, filtros y orden de la URL. **Verificar:** acceso directo restaura criterios; teclear en Home no modifica su URL ni navega.
- [ ] **T05.4 — Normalizar parámetros inválidos.** Ignorar claves desconocidas, duplicados y valores no reconocidos según la spec. **Verificar:** URL malformada no provoca excepciones y recupera valores predeterminados seguros.
- [ ] **T05.5 — Separar acciones de limpieza.** Limpiar buscador restablece sus campos sin borrar filtros; limpiar filtros conserva búsqueda. **Verificar:** ambas acciones mantienen los valores independientes y no dejan resultados obsoletos.
- [ ] **T05.6 — Hacer accesible el buscador expandido.** Si es diálogo, gestionar foco, Escape y retorno al activador. **Verificar:** navegación por teclado y cierre funcionan y el teclado móvil no hace inaccesibles los campos o acciones.

## Fase 6. Implementar catálogo, filtros, orden y mapa

**Dependencias:** fases 2, 3 y 5. **Cobertura:** HU-04, HU-05, HU-10, RF-18, RF-19, CV-07.

- [ ] **T06.1 — Componer catálogo con piezas compartidas.** Reutilizar Navbar, SearchBar, PropertyGrid y PropertyCard. **Verificar:** un mismo alojamiento mantiene precio, moneda y valoración en Home y catálogo.
- [ ] **T06.2 — Crear FilterBar.** Controlar límites de precio, tipos y comodidades, mostrar selección y permitir limpieza. **Verificar:** límites inclusivos y combinaciones siguen la spec; valores inválidos conservan los últimos filtros válidos.
- [ ] **T06.3 — Crear ResultsHeader.** Mostrar contador y selección Ascendente / Descendente por precio en `useState`, inicialmente ascendente. **Verificar:** contador coincide con tarjetas y cambiar orden no cambia su cantidad.
- [ ] **T06.4 — Ordenar sin mutaciones.** Ordenar una copia de resultados filtrados y desempatar por id. **Verificar:** ascendente y descendente son correctos, empates estables y mock data conserva su orden original.
- [ ] **T06.5 — Sincronizar catálogo y URL.** Mantener búsqueda, filtros y orden al aplicar cambios y navegar atrás/adelante. **Verificar:** una URL compartida reconstruye el mismo listado y orden.
- [ ] **T06.6 — Crear mapa placeholder responsive.** Añadir recuadro gris «Mapa» a la derecha en escritorio y debajo de tarjetas en móvil. **Verificar:** posición correcta y espacio de tarjetas legible, sin pines, interacción falsa ni dependencias cartográficas.
- [ ] **T06.7 — Resolver catálogo vacío.** Mantener contador cero y acciones de recuperación. **Verificar:** filtros sin coincidencias y ordenación de lista vacía no fallan ni ocultan la posibilidad de modificar criterios.

## Fase 7. Implementar carga y contenido del detalle

**Dependencias:** fases 2, 3 y 5. **Cobertura:** HU-06, RF-13, RF-14, CV-03.

- [ ] **T07.1 — Cargar alojamiento por id.** Recibir el id de ruta y simular lectura local con `useEffect` y temporizador de aproximadamente un segundo. **Verificar:** carga precede al contenido y el id válido selecciona el registro correcto.
- [ ] **T07.2 — Controlar cancelación y no encontrado.** Limpiar temporizador al cambiar id o desmontar y retirar datos antiguos durante carga. **Verificar:** cambio rápido no muestra resultados obsoletos; id inexistente permite volver al catálogo sin reserva operativa.
- [ ] **T07.3 — Crear ImageGallery interactiva.** Mantener índice con `useState`, array de placeholders y botones Anterior / Siguiente. **Verificar:** navegación muestra la foto e índice correctos; acciones se desactivan en extremos.
- [ ] **T07.4 — Resolver límites de galería.** Reiniciar índice al cambiar alojamiento y contemplar cero o una foto. **Verificar:** nunca se accede fuera del array; una foto desactiva ambas acciones y cero fotos muestra sustituto accesible sin contador engañoso.
- [ ] **T07.5 — Crear PropertyHeader.** Mostrar título, valoración numérica con estrellas, número de reseñas y ubicación. **Verificar:** cifras corresponden al registro y cero reseñas se muestra sin inventar información.
- [ ] **T07.6 — Completar descripción y anfitrión.** Mostrar características, capacidad, avatar placeholder, nombre y años como anfitrión. **Verificar:** contenido coincide con mock data y títulos largos no se recortan.
- [ ] **T07.7 — Crear AmenitiesList.** Renderizar cuadrícula de icono y etiqueta con keys estables. **Verificar:** comodidades correctas, nombres accesibles y estado descriptivo si la lista está vacía.

## Fase 8. Implementar reserva simulada

**Dependencias:** fases 2 y 7. **Cobertura:** HU-08, RF-15, RF-20, RNF-11.

- [ ] **T08.1 — Crear BookingCard básica.** Incluir precio por noche, fechas nativas, contador y CTA de simulación. **Verificar:** precio coherente con tarjeta y ausencia de dependencia de date picker obligatoria.
- [ ] **T08.2 — Controlar huéspedes con useState.** Incrementar/reducir de uno en uno entre uno y capacidad. **Verificar:** nunca sale del rango; con capacidad uno ambas acciones están desactivadas.
- [ ] **T08.3 — Validar estancia y capacidad.** Reutilizar reglas de búsqueda para fechas y disponibilidad. **Verificar:** fechas incompletas, invertidas y noches no disponibles no permiten confirmar y muestran explicación.
- [ ] **T08.4 — Confirmar solo localmente.** Mostrar mensaje explícito de reserva simulada sin persistir ni mutar datos. **Verificar:** no se crean pagos, reservas, solicitudes externas ni cambios de disponibilidad.
- [ ] **T08.5 — Invalidar confirmación obsoleta.** Restablecerla al cambiar huéspedes o fechas. **Verificar:** repetir la acción no genera registros y una recarga no recupera una reserva inexistente.
- [ ] **T08.6 — Adaptar panel de reserva.** En escritorio usar columna lateral si cabe; en móvil mantener controles accesibles. **Verificar:** cualquier franja fija reserva espacio y área segura sin tapar contenido o foco.

## Fase 9. Integrar navegación y retorno

**Dependencias:** fases 4 a 8. **Cobertura:** HU-07, RF-11, RF-12, RF-21.

- [ ] **T09.1 — Revisar enlaces entre páginas.** Usar `<Link>` en logo, búsqueda enviada, tarjetas y volver o breadcrumb. **Verificar:** navegación funcional sin recarga completa; galería, filtros y contador siguen siendo controles, no enlaces.
- [ ] **T09.2 — Preservar contexto del catálogo.** Pasar búsqueda, filtros y orden al detalle y reconstruir enlace interno de regreso. **Verificar:** catálogo → detalle → catálogo recupera exactamente criterios y orden aplicados.
- [ ] **T09.3 — Resolver acceso directo y retorno inseguro.** Volver a `/search` sin contexto y rechazar destinos externos o malformados. **Verificar:** detalle directo tiene salida y ningún parámetro provoca redirección externa.
- [ ] **T09.4 — Verificar historial y recargas.** Probar atrás/adelante y apertura directa de URLs. **Verificar:** no se exige visitar primero Home y solo se restauran criterios válidos, no una confirmación simulada anterior.

## Fase 10. Cerrar calidad visual y técnica

**Dependencias:** todas las fases obligatorias anteriores. **Cobertura:** HU-09, CV-01 a CV-07, RNF-01 a RNF-12.

- [ ] **T10.1 — Comparar referencias visuales.** Revisar [Home](../airbnb-home.png), [buscador](../airbnb-search-expanded.png) y [detalle](../airbnb-detalles-alojamiento.png). **Verificar:** jerarquía y espaciados coherentes, identidad propia y diferencias solicitadas registradas; no declarar fidelidad exacta de catálogo/escritorio sin captura equivalente.
- [ ] **T10.2 — Comprobar responsive.** Revisar 375px, 768px y escritorio mayor con textos largos y teclado móvil. **Verificar:** una columna móvil, varias donde quepan, mapa en posición prevista y ausencia de solapamientos o desbordamiento de página.
- [ ] **T10.3 — Comprobar accesibilidad.** Recorrer teclado, foco, etiquetas, alternativas, nombres de iconos y estados activos. **Verificar:** controles alcanzables, áreas táctiles de 44px y contraste mínimo de 4,5:1 en texto normal y 3:1 en grande.
- [ ] **T10.4 — Revisar casos límite pendientes.** Recorrer la sección 8 de la spec sin repetir comprobaciones ya válidas salvo cambios relevantes. **Verificar:** registrar resultado de cada escenario, incluidos parámetros inválidos, datos corruptos y cargas canceladas; no usar keys aleatorias como reparación.
- [ ] **T10.5 — Revisar arquitectura y tipado.** Comprobar responsabilidades, fronteras servidor/cliente, hooks, `.map()` y keys; ejecutar tipado disponible. **Verificar:** sin errores relevantes ni duplicación de datos o reglas; layout no se convierte innecesariamente en cliente.
- [ ] **T10.6 — Compilar producción al cierre.** Ejecutar el comando de build configurado una vez tras integración y registrar resultado. **Verificar:** rutas y parámetros de App Router compilan; no declarar éxito si el comando no pudo ejecutarse ni iniciar ciclos de build repetidos.
- [ ] **T10.7 — Revisar alcance y comunicar entrega.** Confirmar requisitos obligatorios y entregar URL del servidor local. **Verificar:** sin backend, pagos, reservas reales ni dependencias fuera de alcance; bloqueos y verificaciones no ejecutadas quedan explícitos.

## Retos opcionales posteriores

**Dependencias:** las diez fases obligatorias aceptadas. No necesarios para aprobar la entrega mínima; no iniciar ni instalar sus dependencias antes de completar el resto.

### RO-01. Mapa interactivo real

- [ ] **TO1.1 — Seleccionar una solución cartográfica.** Elegir una librería o API y documentar condiciones y dependencias de esta excepción. **Verificar:** sin secretos en repositorio ni solicitud de geolocalización real del usuario.
- [ ] **TO1.2 — Añadir coordenadas y pines.** Representar resultados actuales mediante coordenadas válidas de mock data. **Verificar:** cada resultado tiene su pin, sin duplicados al filtrar u ordenar.
- [ ] **TO1.3 — Mantener adaptación y alternativa.** Conservar posición responsive y volver al placeholder si falla el mapa. **Verificar:** tarjetas y búsqueda siguen disponibles sin recursos cartográficos.

### RO-02. Date picker y precio total

- [ ] **TO2.1 — Integrar selector de fechas opcional.** Mejorar los campos nativos con una librería sin retirar las validaciones compartidas. **Verificar:** rango seleccionado es funcional, accesible y respeta disponibilidad.
- [ ] **TO2.2 — Calcular total de estancia.** Multiplicar precio por noche por noches válidas y mantener ambos importes visibles. **Verificar:** una noche y cambio de mes correctos; fechas inválidas no muestran total confirmado, sin tasas ni descuentos inventados.
- [ ] **TO2.3 — Verificar actualización y simulación.** Recalcular al cambiar fechas y conservar confirmación exclusivamente local. **Verificar:** sin errores por zona horaria, cobros o reservas reales.

## Seguimiento de ejecución

Registrar aquí resultados reales al implementar. Estados admitidos: pendiente, en curso, bloqueada e implementada y verificada. Los retos también pueden figurar como no realizados, sin bloquear entrega.

| ID | Estado real | Comprobación y resultado | Bloqueo o siguiente acción |
| --- | --- | --- | --- |
| Todas las tareas obligatorias | Pendiente | No ejecutadas; solo documentadas. | Comenzar por T01.1 cuando se solicite implementación. |
| Todos los retos opcionales | Pendiente | No ejecutados; solo documentados. | Esperar a completar alcance obligatorio. |

La entrega mínima se acepta únicamente cuando todas las tareas obligatorias tienen evidencia de ejecución y verificación y cumplen los criterios globales de `spec.md`. Crear este archivo no autoriza implementación, instalación de paquetes, commits ni nuevas ramas.