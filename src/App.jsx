import { useEffect, useState } from 'react'
import { guideSections } from './content'

const gallery = [
  {
    src: './assets/entrada-parque.png',
    alt: 'Aviso de entrada al Parque Jardín Botánico Armando Dugand Gnecco',
    className: 'gallery-tall',
  },
  {
    src: './assets/sendero.png',
    alt: 'Sendero rodeado de vegetación en el jardín',
    className: 'gallery-tall',
  },
  {
    src: './assets/arroyo.png',
    alt: 'Arroyo entre la vegetación del Ecoparque',
    className: 'gallery-wide',
  },
  {
    src: './assets/laguna-patos.png',
    alt: 'Patos en la laguna del jardín',
    caption: 'Con frecuencia vemos nadando a los patos, a las iguanas y a las tortugas tomando el sol en la laguna del Jardín. FOTOS: JULIO CÉSAR HERRERA.',
    className: 'gallery-wide',
  },
  {
    src: './assets/ave.png',
    alt: 'Ave de plumaje rojo posada en una rama',
    caption: 'El avistamiento de aves se ha convertido en una de las riquezas naturales con las que cuenta el Jardín Botánico. FOTOS: JULIO CÉSAR HERRERA.',
    className: 'gallery-tall',
  },
  {
    src: './assets/mariposa.png',
    alt: 'Mariposa sobre una flor violeta',
    caption: 'El avistamiento de aves se ha convertido en una de las riquezas naturales con las que cuenta el Jardín Botánico. FOTOS: JULIO CÉSAR HERRERA.',
    className: 'gallery-tall',
  },
  { src: './assets/ardilla.png', alt: 'Ardilla junto al tronco de un árbol', className: 'gallery-small' },
  { src: './assets/tortugas.png', alt: 'Tortugas en el agua', className: 'gallery-small' },
  { src: './assets/hibisco.png', alt: 'Flor de hibisco rojo', className: 'gallery-small' },
]

function Reveal({ children, className = '' }) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = document.querySelector(`[data-reveal-id="${className}"]`)
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true)
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [className])

  return (
    <div data-reveal-id={className} className={`reveal ${shown ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

function LeafMark() {
  return (
    <svg className="leaf-mark" viewBox="0 0 54 54" aria-hidden="true">
      <path d="M45 8C23 9 10 21 10 39c14 3 29-8 35-31Z" fill="currentColor" opacity=".94" />
      <path d="M10 43c8-13 17-20 30-28M23 29l-7-1M29 23l-2-7M19 35l-5 3" fill="none" stroke="#f7f1e3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(height > 0 ? (window.scrollY / height) * 100 : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />
}

function SectionText({ section, number }) {
  return (
    <section id={section.id} className={`guide-section section-${section.id}`} aria-labelledby={`${section.id}-title`}>
      <Reveal className={`reveal-${section.id}`}>
        <div className="section-label"><span>{section.eyebrow}</span><i /></div>
        <div className="section-layout">
          <div className="section-number" aria-hidden="true">{String(number).padStart(2, '0')}</div>
          <div className="section-copy">
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            {section.intro && <p className="section-intro">{section.intro}</p>}
            {section.cards ? (
              <div className="service-grid">
                {section.cards.map(([title, text], index) => (
                  <article className="service-card" key={title}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="paragraphs">
                {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePhoto, setActivePhoto] = useState(null)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActivePhoto(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <ScrollProgress />
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Ir al inicio"><LeafMark /><span>Ecoparque<br />Armando Dugand</span></a>
        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>
          <span>{menuOpen ? 'Cerrar' : 'Menú'}</span><b aria-hidden="true">{menuOpen ? '×' : '≡'}</b>
        </button>
        <nav id="main-nav" className={menuOpen ? 'is-open' : ''} aria-label="Secciones de la guía">
          {guideSections.map((section, index) => (
            <a href={`#${section.id}`} onClick={closeMenu} key={section.id}><small>{String(index + 1).padStart(2, '0')}</small>{section.title}</a>
          ))}
        </nav>
      </header>

      <main id="contenido">
        <section id="inicio" className="hero" aria-labelledby="hero-title">
          <img className="hero-photo" src="./assets/laguna-patos.png" alt="" />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="hero-kicker">Guía digital · Barranquilla</p>
            <h1 id="hero-title">Ecoparque Jardín Botánico <em>Armando Dugand Gnecco</em></h1>
            <div className="hero-rule"><span>09 apartados</span><i /><span>Una lectura para recorrer</span></div>
          </div>
          <a className="scroll-cue" href="#proposito"><span>Explorar guía</span><i aria-hidden="true">↓</i></a>
        </section>

        <section className="map-feature" aria-labelledby="map-title">
          <Reveal className="reveal-map">
            <div className="map-intro">
              <p className="section-label"><span>Ubicación visual</span><i /></p>
              <h2 id="map-title">El plano original, <em>como punto de partida.</em></h2>
              <p>Esquema actual del Ecoparque Jardín Botánico Armando Dugand Gnecco.</p>
            </div>
            <figure className="map-card">
              <img src="./assets/plano-original.png" alt="Plano original del Ecoparque Jardín Botánico Armando Dugand Gnecco" />
              <figcaption><span>Plano original</span><span>Av. Murillo · Norte · 50 mts.</span></figcaption>
            </figure>
          </Reveal>
        </section>

        <div className="guide-shell">
          {guideSections.slice(0, 3).map((section, index) => <SectionText section={section} number={index + 1} key={section.id} />)}
        </div>

        <section className="photo-feature" aria-labelledby="photo-feature-title">
          <img src="./assets/laguna-patos.png" alt="Patos y laguna en el Jardín Botánico" />
          <div>
            <p className="section-label"><span>Vida del jardín</span><i /></p>
            <h2 id="photo-feature-title">Un paisaje que también <em>es hogar.</em></h2>
            <p>Con frecuencia vemos nadando a los patos, a las iguanas y a las tortugas tomando el sol en la laguna del Jardín.</p>
            <small>FOTOS: JULIO CÉSAR HERRERA.</small>
          </div>
        </section>

        <div className="guide-shell guide-shell-deep">
          {guideSections.slice(3, 6).map((section, index) => <SectionText section={section} number={index + 4} key={section.id} />)}
        </div>

        <section className="gallery-section" aria-labelledby="gallery-title">
          <div className="gallery-heading">
            <p className="section-label"><span>Galería</span><i /></p>
            <h2 id="gallery-title">Detalles de un <em>ecosistema vivo.</em></h2>
            <p>Selecciona una fotografía para verla más de cerca.</p>
          </div>
          <div className="gallery-grid">
            {gallery.map((photo) => (
              <button type="button" className={`gallery-item ${photo.className}`} key={photo.src} onClick={() => setActivePhoto(photo)} aria-label={`Ampliar fotografía: ${photo.alt}`}>
                <img src={photo.src} alt={photo.alt} />
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </section>

        <div className="guide-shell guide-shell-last">
          {guideSections.slice(6).map((section, index) => <SectionText section={section} number={index + 7} key={section.id} />)}
        </div>
      </main>

      <footer>
        <LeafMark />
        <p>Guía digital del Ecoparque Jardín Botánico Armando Dugand Gnecco</p>
        <a href="#inicio">Volver arriba ↑</a>
      </footer>

      {activePhoto && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Fotografía ampliada" onMouseDown={() => setActivePhoto(null)}>
          <div className="lightbox-card" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="lightbox-close" onClick={() => setActivePhoto(null)} aria-label="Cerrar fotografía">×</button>
            <img src={activePhoto.src} alt={activePhoto.alt} />
            {activePhoto.caption && <p>{activePhoto.caption}</p>}
          </div>
        </div>
      )}
    </>
  )
}

export default App
