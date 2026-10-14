const supplied = './assets/v2/'
const original = './assets/'

export const media = {
  lagoon: {
    src: `${supplied}enhanced_5ddb177d-e802-4ffa-b679-fd79606150ca-imagen_2026-10-13_203459431.png`,
    alt: 'Laguna del Ecoparque con patos y árboles alrededor',
    orientation: 'horizontal',
    origin: 'Material fotográfico entregado por Sofi',
  },
  butterfly: {
    src: `${supplied}adopt-a-butterfly-at-the-connecticut-science-center_processed_41ba9ce3952434df8bf531b6e30666983f0a9ea317146170ef797de6d9a404ed_background_image.png`,
    alt: 'Mariposa de alas amarillas y negras sobre flores violetas',
    orientation: 'horizontal',
    origin: 'Material fotográfico entregado por Sofi',
  },
  woodpecker: {
    src: `${supplied}DSCN2676-Mejorado-NR-1-scaled.jpg.jpeg`,
    alt: 'Ave de cresta roja sobre una rama',
    orientation: 'horizontal',
    origin: 'Material fotográfico entregado por Sofi',
  },
  flycatcher: {
    src: `${supplied}VRestrepo_Vermilion-Flycatcher_01.jpg.jpeg`,
    alt: 'Ave de plumaje rojo posada sobre una baranda',
    orientation: 'horizontal',
    origin: 'Material fotográfico entregado por Sofi',
  },
  squirrel: {
    src: `${supplied}image_content_36367282_20200915095853.webp`,
    alt: 'Ardilla entre vegetación baja',
    orientation: 'horizontal',
    origin: 'Material fotográfico entregado por Sofi',
  },
  birdInFlight: {
    src: `${supplied}image_content_36367284_20200915095854.webp`,
    alt: 'Ave en vuelo frente a frutos de palma',
    orientation: 'horizontal',
    origin: 'Material fotográfico entregado por Sofi',
  },
  iguana: {
    src: `${supplied}image_content_36367290_20200915095855.webp`,
    alt: 'Iguana junto a la laguna del Ecoparque',
    orientation: 'horizontal',
    origin: 'Material fotográfico entregado por Sofi',
  },
  path: {
    src: `${original}sendero.png`,
    alt: 'Sendero rodeado de vegetación en el Jardín Botánico',
    orientation: 'vertical',
    origin: 'Archivo original del proyecto',
  },
  stream: {
    src: `${original}arroyo.png`,
    alt: 'Arroyo entre la vegetación del Ecoparque',
    orientation: 'horizontal',
    origin: 'Archivo original del proyecto',
  },
  map: {
    src: `${original}plano-original.png`,
    alt: 'Plano original del Ecoparque Jardín Botánico Armando Dugand Gnecco',
    orientation: 'mapa',
    origin: 'Plano original entregado con el proyecto',
    year: 2026,
  },
  map2007: {
    src: `${supplied}plano-2007.jpg`,
    alt: 'Plano original del Ecoparque Jardín Botánico Armando Dugand Gnecco de 2007',
    orientation: 'mapa',
    origin: 'Plano de Ferrer y González (2007)',
    year: 2007,
  },
}

export const galleryItems = [
  media.lagoon,
  media.butterfly,
  media.woodpecker,
  media.flycatcher,
  media.squirrel,
  media.birdInFlight,
  media.iguana,
  media.path,
  media.stream,
].map((item, index) => ({ id: `photo-${index + 1}`, ...item }))
