# ITX Store — Front-End Test

Mini-aplicación SPA para comprar dispositivos móviles: listado de productos con búsqueda en tiempo real y detalle de producto con selección de color/almacenamiento y añadido a la cesta.

## Stack

- **React 19 + Vite** — SPA, sin SSR ni TypeScript (siguiendo lo pedido en el enunciado).
- **@tanstack/react-router** — enrutado de cliente, en modo *code-based* (sin generación de archivos) definido en `src/router.jsx`.
- **@tanstack/react-query** — fetching y cacheo de datos del API.
- **axios** — cliente HTTP.
- **antd** — componentes de UI.
- **vitest + @testing-library/react + msw** — testing.

La estructura del proyecto (carpetas `apis/`, `apis/hooks/`, `components/`, carpeta `tests/` separada que espeja `src/`, patrón Api + queryKeys + hook por dominio) sigue las convenciones usadas en `fe-movements`, adaptadas a JavaScript puro.

## Cómo correr el proyecto

```bash
npm install
npm start       # modo desarrollo (http://localhost:5173)
npm run build   # build de producción en dist/
npm run test    # corre la suite de tests
npm run lint    # linting
```

La URL del API ya viene configurada en `.env` (`VITE_API_BASE_URL`), apuntando al servicio público de la prueba. El API está desplegado en Render (capa gratuita) y puede tardar unos segundos en responder la primera petición si estaba "dormido".

## Estructura

```
src/
  apis/
    axios.js               instancia de axios
    ProductApi.js           llamadas a /api/product
    CartApi.js               llamada a /api/cart
    cart/
      CartContext.jsx        contexto + hook useCart
      CartProvider.jsx        componente proveedor (persiste el contador en localStorage)
    hooks/
      productQueryKeys.js
      useProducts.js          useProducts() / useProduct(id)
      useAddToCart.js
  components/                componentes de UI, uno por carpeta
  pages/
    ProductListPage/          PLP
    ProductDetailPage/        PDP
  router.jsx                  definición de rutas
  App.jsx                     providers raíz (antd, react-query, carrito, router)
tests/                        espeja la estructura de src/
```

## Decisiones y notas

- **Cacheo de 1 hora**: se resuelve con `staleTime: 1h` en el `QueryClient` (`src/App.jsx`). Mientras los datos no estén obsoletos, react-query los sirve desde memoria sin volver a pegarle al API; pasada la hora, la siguiente consulta revalida. Es la opción "en memoria" que habilita el propio enunciado.
- **Persistencia del contador del carrito**: no hay endpoint para leer la cesta, solo `POST /api/cart` devuelve el total. Ese valor se guarda en `localStorage` (`CartProvider`) para que sobreviva recargas de página y se muestre en el header en cualquier vista.
- **Routing code-based**: `@tanstack/react-router` soporta generación de rutas por archivos (como en `fe-movements`), pero esa vía usa un plugin orientado a TypeScript. Para una app de 2 rutas y sin TS, se usó la API de rutas por código (`createRootRoute` / `createRoute` / `createRouter`), que es igual de completa para este alcance.
- **Selectores de color/almacenamiento**: siempre muestran la opción por defecto seleccionada (la primera que devuelve el API), incluso cuando solo hay una, tal como pide el enunciado.
- **Precio vacío**: el API a veces devuelve `price: ""` para algunos productos; se muestra "Precio no disponible" en vez de un precio vacío o `$`.
- **Paginación**: el API devuelve los ~100 productos en un solo `GET /api/product`, sin parámetros de paginación en el servidor. Se pagina del lado del cliente (50 por página) sobre la lista ya filtrada por el buscador, reseteando a la página 1 cuando cambia el término de búsqueda.
- **Tests**: siguiendo el patrón de `fe-movements`, los tests viven en `tests/` (no co-ubicados con el código) y mockean a nivel HTTP con `msw` en vez de mockear los módulos de la API — se prueba la integración real entre el hook y axios.
