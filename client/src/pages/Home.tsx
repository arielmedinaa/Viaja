import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bus,
  Clock3,
  Compass,
  HeartHandshake,
  MapPin,
  Menu,
  Plane,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

type Destination = {
  number: string;
  name: string;
  region: string;
  description: string;
  image: string;
  alt: string;
  className: string;
};

const destinations: Destination[] = [
  {
    number: "01",
    name: "Saltos del Monday",
    region: "Presidente Franco · Alto Paraná",
    description:
      "Agua que cae con toda la fuerza del bosque. Una escapada para escuchar, mirar y quedarse un rato más.",
    image: "/media/saltos-del-monday.jpg",
    alt: "El Salto del Monday rodeado por el verde intenso del bosque paraguayo.",
    className: "destination-card--monday",
  },
  {
    number: "02",
    name: "Cerro Akati",
    region: "Colonia Independencia · Guairá",
    description:
      "Subí sin apuro. Arriba, el paisaje se abre entre sierras, nubes y el rojo profundo de la tierra.",
    image: "/media/cerro-akati.jpg",
    alt: "Mirador natural desde el Cerro Akati hacia las sierras verdes de Guairá.",
    className: "destination-card--akati",
  },
  {
    number: "03",
    name: "Misiones Jesuíticas",
    region: "Trinidad · Itapúa",
    description:
      "Piedra, luz y memoria en un recorrido para descubrir la historia a tu propio ritmo.",
    image: "/media/misiones-jesuiticas.jpg",
    alt: "Ruinas de ladrillo rojizo de las Misiones Jesuíticas en Paraguay, bajo un cielo azul.",
    className: "destination-card--missions",
  },
];

const values = [
  {
    number: "01",
    title: "Rutas con sentido",
    text: "Itinerarios a medida para familias, aventureros y viajeros culturales.",
  },
  {
    number: "02",
    title: "Mirada local",
    text: "Experiencias que conectan con quienes conocen y viven cada lugar.",
  },
  {
    number: "03",
    title: "A tu ritmo",
    text: "Escapadas pensadas para disfrutar el camino, no solo llegar.",
  },
];

const services = [
  { icon: Compass, label: "Escapadas por Paraguay" },
  { icon: Plane, label: "Destinos internacionales" },
  { icon: Bus, label: "Pasajes de avión y bus" },
  { icon: ShieldCheck, label: "Seguro y asistencia en viaje" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [canScrubVideo, setCanScrubVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  const syncHeroVideo = () => {
    const section = heroRef.current;
    const video = videoRef.current;
    if (!section || !video || !Number.isFinite(video.duration) || video.duration <= 0) return;

    const availableScroll = section.offsetHeight - window.innerHeight;
    if (availableScroll <= 0) return;
    const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / availableScroll));
    const targetTime = progress * Math.max(0, video.duration - 0.04);
    if (!video.seeking && Math.abs(video.currentTime - targetTime) > 0.035) {
      try {
        video.currentTime = targetTime;
      } catch {
        // Keep the still image as a graceful fallback on browsers that cannot seek this file.
      }
    }
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
    setCanScrubVideo(media.matches);
    const onMediaChange = (event: MediaQueryListEvent) => setCanScrubVideo(event.matches);
    media.addEventListener?.("change", onMediaChange);

    const revealNodes = document.querySelectorAll<HTMLElement>(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );
    revealNodes.forEach((node) => revealObserver.observe(node));

    let raf = 0;
    const updateOnScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setIsScrolled((current) => (current !== (y > 36) ? y > 36 : current));
        const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${pageHeight > 0 ? y / pageHeight : 0})`;
        }

        if (canScrubVideo) syncHeroVideo();
        document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((node) => {
          const rect = node.getBoundingClientRect();
          const speed = Number(node.dataset.parallax ?? 0.07);
          const distance = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
          node.style.setProperty("--parallax-y", `${-distance.toFixed(1)}px`);
        });
      });
    };

    updateOnScroll();
    window.addEventListener("scroll", updateOnScroll, { passive: true });
    window.addEventListener("resize", updateOnScroll);
    return () => {
      media.removeEventListener?.("change", onMediaChange);
      revealObserver.disconnect();
      window.removeEventListener("scroll", updateOnScroll);
      window.removeEventListener("resize", updateOnScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [canScrubVideo]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <span className="reading-progress" ref={progressRef} aria-hidden="true" />

      <header className={`site-header${isScrolled ? " site-header--scrolled" : ""}`}>
        <a className="wordmark" href="#inicio" aria-label="Viajá+, inicio" onClick={closeMenu}>
          <img src={isScrolled ? "/media/viaja-logo-1.png" : "/media/viaja-logo-2.png"} alt="Viajá+" />
        </a>
        <nav className={`main-nav${menuOpen ? " main-nav--open" : ""}`} aria-label="Navegación principal">
          <a href="#destinos" onClick={closeMenu}>Destinos</a>
          <a href="#experiencia" onClick={closeMenu}>Nuestra esencia</a>
          <a href="#servicios" onClick={closeMenu}>Qué hacemos</a>
          <a className="nav-cta" href="#contacto" onClick={closeMenu}>
            Planificá tu viaje <ArrowUpRight size={15} strokeWidth={1.8} />
          </a>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main>
        <section className="hero-story" id="inicio" ref={heroRef} aria-label="Paraguay se siente">
          <div className="hero-stage">
            <img
              className={`hero-poster${videoReady ? " hero-poster--dim" : ""}`}
              src="/media/saltos-del-monday.jpg"
              alt=""
              aria-hidden="true"
              fetchPriority="high"
            />
            {canScrubVideo && (
              <video
                ref={videoRef}
                className={`hero-video${videoReady ? " hero-video--ready" : ""}`}
                src="/media/paraguay-scroll-hero.mp4"
                poster="/media/saltos-del-monday.jpg"
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
                onLoadedMetadata={() => {
                  setVideoReady(true);
                  syncHeroVideo();
                }}
                onCanPlay={() => setVideoReady(true)}
                onSeeked={syncHeroVideo}
                onError={() => setVideoReady(false)}
              />
            )}
            <div className="hero-shade" aria-hidden="true" />
            <div className="hero-copy wrap">
              <p className="eyebrow hero-eyebrow"><span /> TURISMO CON RAÍZ PARAGUAYA</p>
              <h1>Paraguay <em>se siente.</em></h1>
              <p className="hero-lead">Escapadas auténticas, paisajes que sorprenden y el tiempo para disfrutarlos.</p>
              <a className="button button--light" href="#destinos">
                Explorá el país <ArrowUpRight size={17} strokeWidth={1.8} />
              </a>
            </div>
            <div className="hero-bottom wrap">
              <span>ALTO PARANÁ · PARAGUAY</span>
              <a href="#destinos" className="scroll-cue" aria-label="Descubrir destinos">
                <span>SEGUÍ EL CAMINO</span><ArrowDown size={16} strokeWidth={1.7} />
              </a>
              <span className="hero-frame-number">01 / 03</span>
            </div>
            <span className="hero-scroll-hint">El paisaje avanza con vos</span>
          </div>
        </section>

        <div className="ribbon" aria-label="Paraguay, naturaleza, cultura, encuentro">
          <div className="ribbon-track">
            <span>TIERRA GUARANÍ</span><i>✳</i><span>NATURALEZA VIVA</span><i>✳</i><span>HISTORIAS QUE NOS UNEN</span><i>✳</i><span>TIERRA GUARANÍ</span><i>✳</i><span>NATURALEZA VIVA</span><i>✳</i>
          </div>
        </div>

        <section className="intro-section section-pad" id="experiencia">
          <div className="wrap intro-layout">
            <p className="eyebrow reveal"><span /> UNA FORMA DISTINTA DE VIAJAR</p>
            <div className="intro-copy reveal">
              <h2>Hay lugares que no se explican. <em>Se viven.</em></h2>
              <p>
                Diseñamos viajes a tu medida para descubrir el Paraguay más auténtico: su naturaleza,
                su cultura y las personas que hacen único cada camino. Elegimos experiencias locales,
                cuidadosas con la comunidad y el entorno.
              </p>
              <a className="text-link" href="#servicios">Conocé cómo viajamos <ArrowRight size={16} /></a>
              <div className="values-line" aria-label="Valores de Viajá+">
                <span>Calidad</span><span>Autenticidad</span><span>Sostenibilidad</span>
                <span>Transparencia</span><span>Innovación</span>
              </div>
            </div>
            <div className="intro-seal" data-parallax="0.12" aria-hidden="true">
              <Sparkles size={20} strokeWidth={1.3} />
              <span>HECHO<br />A TU<br />MEDIDA</span>
            </div>
          </div>
        </section>

        <section className="destinations-section section-pad" id="destinos">
          <div className="wrap">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow"><span /> LUGARES PARA SENTIR</p>
                <h2>Paraguay, <em>de cerca.</em></h2>
              </div>
              <p className="section-note">Tres maneras de empezar. Y muchos caminos para seguir.</p>
            </div>
            <div className="destination-grid">
              {destinations.map((destination) => (
                <article className={`destination-card ${destination.className} reveal`} key={destination.number}>
                  <a className="destination-image" href="#contacto" aria-label={`Consultar por ${destination.name}`}>
                    <img src={destination.image} alt={destination.alt} loading="lazy" />
                    <span className="destination-number">{destination.number}</span>
                    <span className="image-arrow"><ArrowUpRight size={18} /></span>
                  </a>
                  <div className="destination-caption">
                    <div>
                      <p className="destination-region">{destination.region}</p>
                      <h3>{destination.name}</h3>
                    </div>
                    <p className="destination-description">{destination.description}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="photo-note">Imágenes de referencia: Atlas Obscura, TripAdvisor y Wandering Wagars.</p>
          </div>
        </section>

        <section className="quote-section" aria-label="Viajar al ritmo de Paraguay">
          <div className="quote-backdrop" aria-hidden="true">
            <span className="quote-orbit quote-orbit--one" data-parallax="0.05" />
            <span className="quote-orbit quote-orbit--two" data-parallax="-0.04" />
          </div>
          <div className="wrap quote-inner reveal">
            <p className="eyebrow eyebrow--light"><span /> EL LUJO DE IR SIN APURO</p>
            <p className="quote-text">No se trata de llegar lejos.<br /><em>Se trata de volver distinto.</em></p>
            <span className="quote-signature">Viajá+ · Paraguay</span>
          </div>
        </section>

        <section className="essence-section section-pad">
          <div className="wrap essence-layout">
            <div className="essence-heading reveal">
              <p className="eyebrow"><span /> CERCANÍA QUE SE NOTA</p>
              <h2>Un buen viaje empieza <em>con alguien que te escucha.</em></h2>
              <p className="essence-lead">
                Acompañamos cada paso con atención cercana, conocimiento local y respeto por la cultura y el entorno.
              </p>
              <a className="text-link" href="#contacto">Hablemos de tu próximo viaje <ArrowRight size={16} /></a>
            </div>
            <div className="value-list">
              {values.map((value) => (
                <article className="value-item reveal" key={value.number}>
                  <span className="value-number">{value.number}</span>
                  <div><h3>{value.title}</h3><p>{value.text}</p></div>
                  <ArrowUpRight className="value-arrow" size={18} strokeWidth={1.5} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="services-section section-pad" id="servicios">
          <div className="wrap services-layout">
            <div className="services-heading reveal">
              <p className="eyebrow"><span /> TODO EL VIAJE, CON VOS</p>
              <h2>De la primera idea <em>al último paisaje.</em></h2>
              <p>Una agencia paraguaya para viajar con confianza, por acá y por el mundo. Armamos escapadas con traslado, alojamiento, guía local y experiencias culturales.</p>
            </div>
            <div className="service-list">
              {services.map(({ icon: Icon, label }, index) => (
                <div className="service-row reveal" key={label}>
                  <span className="service-index">0{index + 1}</span>
                  <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
                  <span>{label}</span>
                  <ArrowUpRight size={16} className="service-arrow" aria-hidden="true" />
                </div>
              ))}
              <div className="loyalty-note reveal">
                <HeartHandshake size={20} strokeWidth={1.5} />
                <p><strong>Programa de lealtad.</strong> 10 % de descuento en tu segundo viaje. <span>Consultá vigencia.</span></p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contacto">
          <div className="wrap contact-panel reveal">
            <div className="contact-main">
              <p className="eyebrow eyebrow--light"><span /> TU PRÓXIMO RECUERDO EMPIEZA ACÁ</p>
              <h2>¿Y si el próximo viaje <em>es por Paraguay?</em></h2>
              <p>Contanos qué te gustaría vivir. Te ayudamos a imaginar el camino.</p>
              <a className="button button--light" href="https://www.instagram.com/viajamas.py/" target="_blank" rel="noreferrer">
                Escribinos por Instagram <ArrowUpRight size={17} strokeWidth={1.8} />
              </a>
            </div>
            <div className="contact-details">
              <div className="contact-detail">
                <MapPin size={18} strokeWidth={1.5} />
                <div><span>VISITANOS</span><p>Villa Morra, Asunción<br />Paraguay</p>
                  <a href="https://www.google.com/maps/search/?api=1&query=Villa+Morra+Asunci%C3%B3n+Paraguay" target="_blank" rel="noreferrer">Ver ubicación <ArrowUpRight size={13} /></a>
                </div>
              </div>
              <div className="contact-detail">
                <Clock3 size={18} strokeWidth={1.5} />
                <div><span>HORARIO DE ATENCIÓN</span><p>Lun. a vie. · 8:00 a 18:00<br />Sáb. · 8:00 a 12:00</p></div>
              </div>
              <div className="social-handle">
                <span>SEGUINOS</span>
                <a href="https://www.instagram.com/viajamas.py/" target="_blank" rel="noreferrer">@viajamas.py <ArrowUpRight size={14} /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <a href="#inicio" className="footer-logo" aria-label="Viajá+, volver al inicio">
            <img src="/media/viaja-logo-2.png" alt="Viajá+" loading="lazy" />
          </a>
          <p>Descubrí el mundo. Viví Paraguay.</p>
          <a className="back-to-top" href="#inicio">VOLVER ARRIBA <ArrowUpRight size={14} /></a>
          <span className="footer-copy">© Viajá+ · Asunción, Paraguay</span>
        </div>
      </footer>
    </div>
  );
}
