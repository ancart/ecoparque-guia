import { useEffect, useMemo, useRef, useState } from 'react'
import { guideSections } from './content'
import { galleryItems, media } from './media'
import AnimatedList from './components/reactbits/AnimatedList'
import AccordionGallery from './components/reactbits/AccordionGallery'
import Masonry from './components/reactbits/Masonry'
import SplitText from './components/reactbits/SplitText'
import StaggeredMenu from './components/reactbits/StaggeredMenu'

const validViews = new Set(['inicio', ...guideSections.map((section) => section.id), 'galeria', 'plano'])

function useHashView() {
  const read = () => {
    const hash = decodeURIComponent(window.location.hash.replace('#', '')) || 'inicio'
    return validViews.has(hash) ? hash : 'inicio'
  }
  const [view, setView] = useState(read)
  useEffect(() => {
    const update = () => setView(read())
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  const navigate = (next) => { const target = validViews.has(next) ? next : 'inicio'; if (window.location.hash !== `#${target}`) window.location.hash = target; else setView(target) }
  return [view, navigate]
}

function LeafMark() { return <svg className="leaf-mark" viewBox="0 0 54 54" aria-hidden="true"><path d="M45 8C23 9 10 21 10 39c14 3 29-8 35-31Z" fill="currentColor" /><path d="M10 43c8-13 17-20 30-28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> }

function WordTitle({ text, as: Tag = 'h1', className = '', id }) { return <SplitText key={text} text={text} tag={Tag} id={id} splitType="words" delay={42} duration={0.56} ease="power3.out" from={{ opacity: 0, y: 14 }} to={{ opacity: 1, y: 0 }} threshold={0.05} rootMargin="-18px" textAlign="left" className={className} /> }

function ChapterControls({ index, navigate }) {
  const previous = index > 0 ? guideSections[index - 1] : null
  const next = index < guideSections.length - 1 ? guideSections[index + 1] : null
  return <nav className="chapter-controls" aria-label="Navegación entre capítulos"><button type="button" disabled={!previous} onClick={() => previous && navigate(previous.id)}>← <span>Anterior</span></button><button type="button" onClick={() => navigate(next?.id || 'galeria')}><span>{next ? 'Siguiente' : 'Explorar fotografías'}</span> →</button></nav>
}

function ServiceCard({ title, description, number, initiallyOpen }) {
  const [open, setOpen] = useState(initiallyOpen)
  return <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)}><summary aria-expanded={open}><span>{String(number).padStart(2, '0')}</span>{title}<b aria-hidden="true">+</b></summary><p>{description}</p></details>
}

function ChapterView({ section, index, navigate, openPhoto }) {
  const chapterMedia = [media.butterfly, media.path, media.lagoon, media.iguana, media.woodpecker, media.stream, media.flycatcher, media.stream, media.lagoon][index]
  return <article className={`chapter chapter--${section.id} ${section.id === 'situaciones' ? 'chapter--dark' : ''}`} aria-labelledby="chapter-title">
    <div className="chapter__eyebrow"><span>{String(index + 1).padStart(2, '0')} / 09</span><i />{section.eyebrow.replace(/^\d+ · /, '')}</div>
    <div className="chapter__layout"><div className="chapter__heading"><WordTitle text={section.title} as="h1" id="chapter-title" className="chapter__title" />{section.intro && <p className="chapter__intro">{section.intro}</p>}</div><button className="chapter__image" type="button" onClick={() => openPhoto(chapterMedia)} aria-label={`Ampliar fotografía: ${chapterMedia.alt}`}><img src={chapterMedia.src} alt={chapterMedia.alt} /><span>Ver fotografía ↗</span></button></div>
    {section.cards ? <div className="services-list">{[section.cards.slice(0, Math.ceil(section.cards.length / 2)), section.cards.slice(Math.ceil(section.cards.length / 2))].map((column, columnIndex) => <div className="services-column" key={columnIndex}>{column.map(([title, description], cardIndex) => <ServiceCard key={title} title={title} description={description} number={columnIndex * Math.ceil(section.cards.length / 2) + cardIndex + 1} initiallyOpen={columnIndex === 0 && cardIndex === 0} />)}</div>)}</div> : <div className="chapter__text">{section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>}
    <ChapterControls index={index} navigate={navigate} />
  </article>
}

function GalleryView({ openPhoto, onBack, onMaps = () => { window.location.hash = 'plano' } }) {
  const masonryItems = galleryItems.map((item, index) => ({ id: item.id, img: item.src, alt: item.alt, height: index % 3 === 0 ? 620 : index % 2 ? 420 : 520 }))
  return <section className="resource-view gallery-view" aria-labelledby="gallery-title"><div className="resource-heading"><p>Archivo botánico</p><WordTitle text="Explorar fotografías" as="h1" id="gallery-title" className="resource-title" /><div className="resource-actions"><button type="button" className="text-button" onClick={onBack}>← Volver al capítulo</button><button type="button" className="text-button" onClick={onMaps}>Ver los planos originales →</button></div></div><p className="resource-intro">Fotografías originales suministradas para esta guía. Selecciona una imagen para ampliarla.</p><div className="masonry-shell"><Masonry items={masonryItems} duration={0.55} stagger={0.045} animateFrom="bottom" scaleOnHover hoverScale={0.97} blurToFocus onItemSelect={(item) => openPhoto(galleryItems.find((photo) => photo.id === item.id))} /></div></section>
}

function MapView({ onBack }) {
  const [zoom, setZoom] = useState(1)
  const [mapIndex, setMapIndex] = useState(0)
  const viewport = useRef(null)
  const touchStart = useRef(null)
  const pinchStart = useRef(null)
  useEffect(() => {
    const node = viewport.current
    if (!node) return undefined
    const distance = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY)
    const onStart = (event) => {
      if (event.touches.length === 2) {
        pinchStart.current = { distance: distance(event.touches), zoom }
        touchStart.current = null
      }
    }
    const onMove = (event) => {
      if (!pinchStart.current || event.touches.length !== 2) return
      event.preventDefault()
      const scaled = pinchStart.current.zoom * distance(event.touches) / pinchStart.current.distance
      setZoom(Math.max(1, Math.min(3, Math.round(scaled * 4) / 4)))
    }
    const onEnd = (event) => { if (event.touches.length < 2) pinchStart.current = null }
    node.addEventListener('touchstart', onStart, { passive: true })
    node.addEventListener('touchmove', onMove, { passive: false })
    node.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      node.removeEventListener('touchstart', onStart)
      node.removeEventListener('touchmove', onMove)
      node.removeEventListener('touchend', onEnd)
    }
  }, [zoom])
  const maps = [media.map, media.map2007]
  const currentMap = maps[mapIndex]
  const changeMap = (nextIndex) => {
    setMapIndex((nextIndex + maps.length) % maps.length)
    setZoom(1)
    viewport.current?.scrollTo({ left: 0, top: 0, behavior: 'instant' })
  }
  const handleMapKey = (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); changeMap(mapIndex - 1) }
    if (event.key === 'ArrowRight') { event.preventDefault(); changeMap(mapIndex + 1) }
  }
  const handleTouchEnd = (event) => {
    if (!touchStart.current || zoom !== 1) return
    const delta = event.changedTouches[0].clientX - touchStart.current.x
    if (Math.abs(delta) > 70 && Math.abs(event.changedTouches[0].clientY - touchStart.current.y) < 80) changeMap(mapIndex + (delta < 0 ? 1 : -1))
    touchStart.current = null
  }
  return <section className="resource-view map-view" aria-labelledby="map-title"><div className="resource-heading"><p>Planos originales</p><WordTitle text="Orientarse sin inventar rutas" as="h1" id="map-title" className="resource-title" /><button type="button" className="text-button" onClick={onBack}>← Volver al capítulo</button></div><p className="resource-intro">Consulta los planos originales del Ecoparque Jardín Botánico Armando Dugand Gnecco.</p><div className="map-switcher" aria-label="Seleccionar plano"><button type="button" onClick={() => changeMap(mapIndex - 1)} aria-label="Plano anterior">← Anterior</button><span aria-live="polite">Plano de {currentMap.year} · {mapIndex + 1} / 2</span><button type="button" onClick={() => changeMap(mapIndex + 1)} aria-label="Plano siguiente">Siguiente →</button></div><div className="map-controls" aria-label="Controles de ampliación del plano"><button type="button" disabled={zoom === 1} onClick={() => setZoom((value) => Math.max(1, value - .25))} aria-label="Alejar plano">−</button><output aria-live="polite">{Math.round(zoom * 100)}%</output><button type="button" disabled={zoom === 3} onClick={() => setZoom((value) => Math.min(3, value + .25))} aria-label="Acercar plano">+</button><button type="button" className="map-reset" onClick={() => { setZoom(1); viewport.current?.scrollTo({ left: 0, top: 0 }) }}>Restablecer 100 %</button></div><div className="map-viewport" ref={viewport} tabIndex={0} aria-label={`Visor del plano de ${currentMap.year}. Usa las flechas izquierda y derecha para cambiar de plano.`} onKeyDown={handleMapKey} onTouchStart={(event) => { if (event.touches.length === 1) touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }} onTouchEnd={handleTouchEnd}><img src={currentMap.src} alt={currentMap.alt} style={{ width: `${zoom * 100}%` }} draggable={false} /></div><p className="map-caption">Plano original del Ecoparque Jardín Botánico Armando Dugand Gnecco — {currentMap.year}{mapIndex === 1 && <small>Ferrer y González (2007)</small>}</p><div className="map-indicators" aria-label="Plano activo">{maps.map((item, index) => <button key={item.year} type="button" aria-label={`Mostrar plano de ${item.year}`} aria-current={mapIndex === index ? 'true' : undefined} onClick={() => changeMap(index)} />)}</div></section>
}

function PhotoDialog({ photo, close }) {
  const closeButton = useRef(null)
  useEffect(() => { if (photo) closeButton.current?.focus() }, [photo])
  useEffect(() => {
    if (!photo) return undefined
    const handler = (event) => event.key === 'Escape' && close()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [photo, close])
  if (!photo) return null
  return <div className="dialog-backdrop" role="presentation" onMouseDown={close}><section className="photo-dialog" role="dialog" aria-modal="true" aria-label="Fotografía ampliada" onMouseDown={(event) => event.stopPropagation()}><button ref={closeButton} type="button" className="dialog-close" onClick={close} aria-label="Cerrar fotografía">×</button><img src={photo.src} alt={photo.alt} /></section></div>
}

function HomeView({ navigate, openIndex }) {
  return <section className="home-view" aria-labelledby="home-title">
    <div className="home-hero-band"><div className="home-hero">
      <img className="home-hero__image" src={media.lagoon.src} alt={media.lagoon.alt} />
      <div className="home-hero__shade" aria-hidden="true" />
      <div className="home-hero__content home-overlay"><p>Guía digital · Barranquilla</p><WordTitle text="Ecoparque Jardín Botánico" as="h1" id="home-title" className="home-title" /><span>Armando Dugand Gnecco</span><button type="button" className="primary-button" onClick={() => navigate('proposito')}>Iniciar recorrido <b>→</b></button></div>
    </div></div>
    <nav className="home-links" aria-label="Accesos rápidos"><button type="button" onClick={openIndex}>Ver índice</button><button type="button" onClick={() => navigate('galeria')}>Explorar fotografías</button><button type="button" onClick={() => navigate('plano')}>Consultar plano</button></nav>
    <section className="accordion-feature" aria-labelledby="accordion-title"><p>Detalles del Ecoparque</p><h2 id="accordion-title">Fauna y paisaje, <em>para explorar de cerca.</em></h2><AccordionGallery items={[{ image: media.butterfly.src, label: 'Polinizadores', alt: media.butterfly.alt }, { image: media.woodpecker.src, label: 'Aves', alt: media.woodpecker.alt }, { image: media.iguana.src, label: 'Laguna', alt: media.iguana.alt }]} defaultIndex={1} accentColor="#d7e1b5" overlayColor="#153a2e" textColor="#fffdf8" height={420} gap={10} radius={18} expandRatio={.55} trigger="hover" grayscale /></section>
  </section>
}

function App() {
  const [view, navigate] = useHashView()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [lastChapter, setLastChapter] = useState('proposito')
  const activeIndex = guideSections.findIndex((section) => section.id === view)
  const activeSection = activeIndex >= 0 ? guideSections[activeIndex] : null
  const chapters = useMemo(() => guideSections.map((section, index) => ({ id: section.id, title: `${String(index + 1).padStart(2, '0')} · ${section.title}`, description: section.eyebrow.replace(/^\d+ · /, '') })), [])
  useEffect(() => { if (activeSection) setLastChapter(activeSection.id); window.scrollTo({ top: 0, behavior: 'auto' }); document.title = activeSection ? `${activeSection.title} · Ecoparque` : 'Ecoparque Jardín Botánico Armando Dugand Gnecco' }, [view, activeSection])
  const selectView = (id) => { setDrawerOpen(false); navigate(id) }
  const mobileItems = [{ label: 'Inicio', link: '#inicio' }, ...guideSections.map((section, index) => ({ label: `${String(index + 1).padStart(2, '0')} ${section.title}`, link: `#${section.id}` })), { label: 'Galería', link: '#galeria' }, { label: 'Plano original', link: '#plano' }]

  return <><a className="skip-link" href="#main-content">Saltar al contenido</a><header className="site-header"><a className="brand" href="#inicio" aria-label="Ir al inicio"><LeafMark /><span>Ecoparque<br /><b>Armando Dugand Gnecco</b></span></a><div className="header-actions"><span className="chapter-progress">{activeIndex >= 0 ? `${String(activeIndex + 1).padStart(2, '0')} / 09` : 'Atlas'}</span><button type="button" className="index-button desktop-index" aria-expanded={drawerOpen} onClick={() => setDrawerOpen((open) => !open)}>Índice <span>+</span></button></div></header><div className="mobile-menu"><StaggeredMenu position="right" colors={['#d7e1b5', '#235946', '#153a2e']} items={mobileItems} displaySocials={false} displayItemNumbering={false} menuButtonColor="#153a2e" openMenuButtonColor="#fffdf8" accentColor="#d7e1b5" isFixed closeOnClickAway onItemSelect={(item) => selectView(item.link.replace('#', ''))} /></div>{drawerOpen && <aside className="chapter-drawer" aria-label="Índice de capítulos"><div className="drawer-top"><p>Índice de capítulos</p><button type="button" onClick={() => setDrawerOpen(false)} aria-label="Cerrar índice">×</button></div><AnimatedList key={view} items={chapters} animation="slide" theme="light" accentColor="#235946" radius={12} gap={8} stagger={.04} animateOnce selectOnHover={false} enableArrowNavigation loop={false} width="100%" maxHeight={480} showGradients displayScrollbar frame initialSelectedIndex={Math.max(0, activeIndex)} onItemSelect={(item) => selectView(item.id)} renderItem={(item, _index, selected) => <div className={`index-row ${selected ? 'is-selected' : ''}`}><b>{item.title}</b><span>{item.description}</span></div>} /><div className="drawer-resources"><button type="button" onClick={() => selectView('galeria')}>Explorar fotografías ↗</button><button type="button" onClick={() => selectView('plano')}>Abrir plano original ↗</button></div></aside>}<main id="main-content">{view === 'inicio' && <HomeView navigate={navigate} openIndex={() => setDrawerOpen(true)} />}{activeSection && <ChapterView section={activeSection} index={activeIndex} navigate={navigate} openPhoto={setPhoto} />}{view === 'galeria' && <GalleryView openPhoto={setPhoto} onBack={() => navigate(lastChapter)} />}{view === 'plano' && <MapView onBack={() => navigate(lastChapter)} />}</main><footer className="site-footer"><LeafMark /><span>Guía digital del Ecoparque Jardín Botánico Armando Dugand Gnecco</span><a href="#inicio">Volver a portada ↑</a></footer><PhotoDialog photo={photo} close={() => setPhoto(null)} /></>
}

export default App
