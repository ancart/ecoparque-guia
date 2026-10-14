import { useEffect, useMemo, useRef, useState } from 'react'
import { guideSections } from './content'
import { galleryItems, media } from './media'
import AnimatedList from './components/reactbits/AnimatedList'
import AccordionGallery from './components/reactbits/AccordionGallery'
import Masonry from './components/reactbits/Masonry'
import ScrollExpand from './components/reactbits/ScrollExpand'
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

function useCompact() {
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 767px)').matches)
  useEffect(() => { const query = window.matchMedia('(max-width: 767px)'); const update = () => setCompact(query.matches); query.addEventListener('change', update); return () => query.removeEventListener('change', update) }, [])
  return compact
}

function LeafMark() { return <svg className="leaf-mark" viewBox="0 0 54 54" aria-hidden="true"><path d="M45 8C23 9 10 21 10 39c14 3 29-8 35-31Z" fill="currentColor" /><path d="M10 43c8-13 17-20 30-28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> }

function WordTitle({ text, as: Tag = 'h1', className = '', id }) { return <SplitText key={text} text={text} tag={Tag} id={id} splitType="words" delay={42} duration={0.56} ease="power3.out" from={{ opacity: 0, y: 14 }} to={{ opacity: 1, y: 0 }} threshold={0.05} rootMargin="-18px" textAlign="left" className={className} /> }

function ChapterControls({ index, navigate }) {
  const previous = index > 0 ? guideSections[index - 1] : null
  const next = index < guideSections.length - 1 ? guideSections[index + 1] : null
  return <nav className="chapter-controls" aria-label="Navegación entre capítulos"><button type="button" disabled={!previous} onClick={() => previous && navigate(previous.id)}>← <span>Anterior</span></button><button type="button" disabled={!next} onClick={() => next && navigate(next.id)}><span>Siguiente</span> →</button></nav>
}

function ChapterView({ section, index, navigate, openPhoto }) {
  const chapterMedia = [media.butterfly, media.path, media.lagoon, media.iguana, media.woodpecker, media.stream, media.flycatcher, media.stream, media.lagoon][index]
  return <article className={`chapter chapter--${section.id} ${section.id === 'situaciones' ? 'chapter--dark' : ''}`} aria-labelledby="chapter-title">
    <div className="chapter__eyebrow"><span>{String(index + 1).padStart(2, '0')} / 09</span><i />{section.eyebrow.replace(/^\d+ · /, '')}</div>
    <div className="chapter__layout"><div className="chapter__heading"><WordTitle text={section.title} as="h1" id="chapter-title" className="chapter__title" />{section.intro && <p className="chapter__intro">{section.intro}</p>}</div><button className="chapter__image" type="button" onClick={() => openPhoto(chapterMedia)} aria-label={`Ampliar fotografía: ${chapterMedia.alt}`}><img src={chapterMedia.src} alt={chapterMedia.alt} /><span>Ver fotografía ↗</span></button></div>
    {section.cards ? <div className="services-list">{section.cards.map(([title, description], serviceIndex) => <details key={title} open={serviceIndex === 0}><summary><span>{String(serviceIndex + 1).padStart(2, '0')}</span>{title}<b aria-hidden="true">+</b></summary><p>{description}</p></details>)}</div> : <div className="chapter__text">{section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>}
    <ChapterControls index={index} navigate={navigate} />
  </article>
}

function GalleryView({ openPhoto, onBack }) {
  const masonryItems = galleryItems.map((item, index) => ({ id: item.id, img: item.src, alt: item.alt, height: index % 3 === 0 ? 620 : index % 2 ? 420 : 520 }))
  return <section className="resource-view gallery-view" aria-labelledby="gallery-title"><div className="resource-heading"><p>Archivo botánico</p><WordTitle text="Explorar fotografías" as="h1" id="gallery-title" className="resource-title" /><button type="button" className="text-button" onClick={onBack}>← Volver al capítulo</button></div><p className="resource-intro">Fotografías originales suministradas para esta guía. Selecciona una imagen para ampliarla.</p><div className="masonry-shell"><Masonry items={masonryItems} duration={0.55} stagger={0.045} animateFrom="bottom" scaleOnHover hoverScale={0.97} blurToFocus onItemSelect={(item) => openPhoto(galleryItems.find((photo) => photo.id === item.id))} /></div></section>
}

function MapView({ onBack }) {
  const [zoom, setZoom] = useState(1)
  return <section className="resource-view map-view" aria-labelledby="map-title"><div className="resource-heading"><p>Plano original</p><WordTitle text="Orientarse sin inventar rutas" as="h1" id="map-title" className="resource-title" /><button type="button" className="text-button" onClick={onBack}>← Volver al capítulo</button></div><p className="resource-intro">Plano original del Ecoparque Jardín Botánico Armando Dugand Gnecco. Usa los controles o el gesto táctil para revisar el esquema.</p><div className="map-controls" aria-label="Controles de ampliación del plano"><button type="button" onClick={() => setZoom((value) => Math.max(1, value - .25))} aria-label="Alejar plano">−</button><output aria-live="polite">{Math.round(zoom * 100)}%</output><button type="button" onClick={() => setZoom((value) => Math.min(2.5, value + .25))} aria-label="Acercar plano">+</button></div><div className="map-viewport"><img src={media.map.src} alt={media.map.alt} style={{ width: `${zoom * 100}%` }} /></div></section>
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
  return <div className="dialog-backdrop" role="presentation" onMouseDown={close}><section className="photo-dialog" role="dialog" aria-modal="true" aria-label="Fotografía ampliada" onMouseDown={(event) => event.stopPropagation()}><button ref={closeButton} type="button" className="dialog-close" onClick={close} aria-label="Cerrar fotografía">×</button><img src={photo.src} alt={photo.alt} /><footer><span>{photo.origin}</span></footer></section></div>
}

function App() {
  const [view, navigate] = useHashView()
  const compact = useCompact()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [lastChapter, setLastChapter] = useState('proposito')
  const activeIndex = guideSections.findIndex((section) => section.id === view)
  const activeSection = activeIndex >= 0 ? guideSections[activeIndex] : null
  const chapters = useMemo(() => guideSections.map((section, index) => ({ id: section.id, title: `${String(index + 1).padStart(2, '0')} · ${section.title}`, description: section.eyebrow.replace(/^\d+ · /, '') })), [])
  useEffect(() => { if (activeSection) setLastChapter(activeSection.id); window.scrollTo({ top: 0, behavior: 'auto' }); document.title = activeSection ? `${activeSection.title} · Ecoparque` : 'Ecoparque Jardín Botánico Armando Dugand Gnecco' }, [view, activeSection])
  const selectView = (id) => { setDrawerOpen(false); navigate(id) }
  const mobileItems = [{ label: 'Inicio', link: '#inicio' }, ...guideSections.map((section, index) => ({ label: `${String(index + 1).padStart(2, '0')} ${section.title}`, link: `#${section.id}` })), { label: 'Galería', link: '#galeria' }, { label: 'Plano original', link: '#plano' }]

  return <><a className="skip-link" href="#main-content">Saltar al contenido</a><header className="site-header"><a className="brand" href="#inicio" aria-label="Ir al inicio"><LeafMark /><span>Ecoparque<br /><b>Armando Dugand Gnecco</b></span></a><div className="header-actions"><span className="chapter-progress">{activeIndex >= 0 ? `${String(activeIndex + 1).padStart(2, '0')} / 09` : 'Atlas'}</span><button type="button" className="index-button desktop-index" aria-expanded={drawerOpen} onClick={() => setDrawerOpen((open) => !open)}>Índice <span>+</span></button></div></header><div className="mobile-menu"><StaggeredMenu position="right" colors={['#d7e1b5', '#235946', '#153a2e']} items={mobileItems} displaySocials={false} displayItemNumbering={false} menuButtonColor="#153a2e" openMenuButtonColor="#fffdf8" accentColor="#d7e1b5" isFixed closeOnClickAway onItemSelect={(item) => selectView(item.link.replace('#', ''))} /></div>{drawerOpen && <aside className="chapter-drawer" aria-label="Índice de capítulos"><div className="drawer-top"><p>Índice de capítulos</p><button type="button" onClick={() => setDrawerOpen(false)} aria-label="Cerrar índice">×</button></div><AnimatedList key={view} items={chapters} animation="slide" theme="light" accentColor="#235946" radius={12} gap={8} stagger={.04} animateOnce selectOnHover={false} enableArrowNavigation loop={false} width="100%" maxHeight={480} showGradients displayScrollbar frame initialSelectedIndex={Math.max(0, activeIndex)} onItemSelect={(item) => selectView(item.id)} renderItem={(item, _index, selected) => <div className={`index-row ${selected ? 'is-selected' : ''}`}><b>{item.title}</b><span>{item.description}</span></div>} /><div className="drawer-resources"><button type="button" onClick={() => selectView('galeria')}>Explorar fotografías ↗</button><button type="button" onClick={() => selectView('plano')}>Abrir plano original ↗</button></div></aside>}<main id="main-content">{view === 'inicio' && <section className="home-view" aria-labelledby="home-title"><ScrollExpand src={media.lagoon.src} alt={media.lagoon.alt} title="" startWidth={82} startHeight={62} startRadius={24} endRadius={0} mediaZoom={1.08} scrollDistance={compact ? 0 : .42} holdDistance={0} smoothing={.08} overlayScrim={.45} useWindowScroll enabled={!compact}><div className="home-overlay"><p>Guía digital · Barranquilla</p><WordTitle text="Ecoparque Jardín Botánico" as="h1" id="home-title" className="home-title" /><span>Armando Dugand Gnecco</span><button type="button" className="primary-button" onClick={() => navigate('proposito')}>Iniciar recorrido <b>→</b></button></div></ScrollExpand><div className="home-links"><button type="button" onClick={() => setDrawerOpen(true)}>Ver índice</button><button type="button" onClick={() => navigate('galeria')}>Explorar fotografías</button><button type="button" onClick={() => navigate('plano')}>Consultar plano</button></div><section className="accordion-feature" aria-labelledby="accordion-title"><p>Detalles del Ecoparque</p><h2 id="accordion-title">Fauna y paisaje, <em>para explorar de cerca.</em></h2><AccordionGallery items={[{ image: media.butterfly.src, label: 'Polinizadores', alt: media.butterfly.alt }, { image: media.woodpecker.src, label: 'Aves', alt: media.woodpecker.alt }, { image: media.iguana.src, label: 'Laguna', alt: media.iguana.alt }]} defaultIndex={1} accentColor="#d7e1b5" overlayColor="#153a2e" textColor="#fffdf8" height={420} gap={10} radius={18} expandRatio={.55} trigger="hover" grayscale /></section></section>}{activeSection && <ChapterView section={activeSection} index={activeIndex} navigate={navigate} openPhoto={setPhoto} />}{view === 'galeria' && <GalleryView openPhoto={setPhoto} onBack={() => navigate(lastChapter)} />}{view === 'plano' && <MapView onBack={() => navigate(lastChapter)} />}</main><footer className="site-footer"><LeafMark /><span>Guía digital del Ecoparque Jardín Botánico Armando Dugand Gnecco</span><a href="#inicio">Volver a portada ↑</a></footer><PhotoDialog photo={photo} close={() => setPhoto(null)} /></>
}

export default App
