# Guía del Ecoparque Jardín Botánico Armando Dugand Gnecco

Primera versión web local de la guía universitaria de Sofi.

## Editar después del feedback

Todo el texto de los nueve apartados está centralizado en `src/content.js`. Para cambiar la redacción, reemplaza únicamente el contenido de ese archivo: la estructura visual se adapta automáticamente.

Las fotografías y el plano están en `public/assets/`. Los textos de crédito conservados aparecen en la galería y en el bloque de la laguna.

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Preparar para GitHub Pages

La configuración usa rutas relativas (`base: './'`), de modo que el resultado de `npm run build` en `dist/` puede alojarse como sitio estático en GitHub Pages. Esta versión no se ha publicado.
