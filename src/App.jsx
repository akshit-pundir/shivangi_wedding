import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import Lenis from 'lenis'

const ease = [0.22, 1, 0.36, 1]
const MAP = 'https://www.google.com/maps/place/The+Krishna+Banquet+16/@28.5028426,77.3554819,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce758fc463e35:0x7f4daa537204c4e1!8m2!3d28.5028426!4d77.3554819!16s%2Fg%2F11zj0849z5?hl=en-IN'
const PHOTOS = [1, 2, 3, 4, 5, 6].map((n) => `/photos/${n}.jpeg`)
const EVENTS = [
  { n: 'Mehndi', d: '26 November', t: '12:00 pm – 4:30 pm', c: 'Pink · Yellow · Green · Orange · Turquoise · Purple' },
  { n: 'Cocktail', d: '26 November', t: '8:00 pm onwards', c: 'Black · Midnight blue · Wine · Emerald · Metallic' },
  { n: 'Haldi', d: '27 November', t: '9:00 am onwards', c: 'Yellow · Marigold · Orange · Coral · Multicolour' },
  { n: 'Wedding', d: '27 November', t: '7:30 pm onwards', c: 'Ivory · Gold · Maroon' },
]
const STORY = 'Two families, one celebration. Their story began with a quiet hello, grew through long conversations and shared laughter, and now arrives at the most beautiful chapter. '

const Reveal = ({ children, delay = 0, y = 60, className }) => (
  <motion.div className={className} initial={{ opacity: 0, y, filter: 'blur(8px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-12% 0px' }} transition={{ duration: 1.5, ease, delay }}>
    {children}
  </motion.div>
)

const Letters = ({ t, delay = 0 }) => (
  <span className="mask">
    {t.split('').map((c, i) => (
      <motion.span key={i} style={{ display: 'inline-block' }} initial={{ y: '110%' }} animate={{ y: 0 }}
        transition={{ duration: 1.6, ease, delay: delay + i * 0.08 }}>{c}</motion.span>
    ))}
  </span>
)

const Word = ({ children, p, r }) => {
  const o = useTransform(p, r, [0.15, 1])
  return <motion.span style={{ opacity: o }}>{children} </motion.span>
}
function Words({ text, className }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const w = text.split(' ')
  return <p ref={ref} className={className}>{w.map((x, i) => <Word key={i} p={scrollYProgress} r={[i / w.length, (i + 1) / w.length]}>{x}</Word>)}</p>
}

const Divider = () => (
  <svg width="120" height="24" viewBox="0 0 120 24" className="gold" fill="none" stroke="currentColor">
    <path d="M0 12H46M74 12H120" /><path d="M60 2l10 10-10 10-10-10z" /><circle cx="60" cy="12" r="2" fill="currentColor" />
  </svg>
)

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5])
  const o = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const arches = ['M30 600V270Q30 110 200 12Q370 110 370 270V600', 'M62 600V280Q62 140 200 56Q338 140 338 280V600', 'M94 600V290Q94 170 200 100Q306 170 306 290V600']
  return (
    <section ref={ref} className="hero indigo">
      <motion.svg className="arch" viewBox="0 0 400 600" style={{ scale, transformOrigin: '50% 100%' }} fill="none" stroke="currentColor">
        {arches.map((d, i) => (
          <motion.path key={i} d={d} strokeWidth="1.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease, delay: 0.3 + i * 0.4 }} />
        ))}
      </motion.svg>
      <motion.div className="hero-in" style={{ opacity: o, y }}>
        <motion.p className="cin gold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 1.2 }}>
          Together with their families
        </motion.p>
        <h1><Letters t="Shivangi" delay={0.6} /><motion.span className="amp gold" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease, delay: 1.6 }}>&amp;</motion.span><Letters t="Skand" delay={1.8} /></h1>
        <motion.p className="cin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 2.8 }}>
          <span>27 · 11 · 2026</span><i className="sep"> | </i><span>Krishna Farms, Noida</span>
        </motion.p>
      </motion.div>
      <motion.div className="scroll-hint cin gold" animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>Scroll</motion.div>
    </section>
  )
}

function Blessing() {
  return (
    <section className="sand center">
      <Reveal><Divider /></Reveal>
      <Words className="big" text="With the blessings of our elders, we joyfully invite you to celebrate the wedding of" />
      <Reveal className="couple"><h2>Shivangi</h2><span className="amp gold">&amp;</span><h2>Skand</h2></Reveal>
      <div className="parents">
        <Reveal delay={0.1} className="family"><small className="cin gold">Daughter of</small><p>Virender Singh</p><span className="and gold">&amp;</span><p>Geeta Pundir</p></Reveal>
        <span className="vline" />
        <Reveal delay={0.3} className="family"><small className="cin gold">Son of</small><p>Kabindra Chauhan</p><span className="and gold">&amp;</span><p>Hemlata Chauhan</p></Reveal>
      </div>
    </section>
  )
}

function Countdown() {
  const target = new Date('2026-11-27T19:30:00+05:30').getTime()
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])
  const s = Math.max(0, Math.floor((target - now) / 1000))
  const u = [['Days', Math.floor(s / 86400)], ['Hours', Math.floor((s % 86400) / 3600)], ['Minutes', Math.floor((s % 3600) / 60)], ['Seconds', s % 60]]
  return (
    <section className="sand center tight">
      <Reveal><p className="cin gold">Counting down to the pheras</p></Reveal>
      <Reveal delay={0.2} className="units">
        {u.map(([l, v]) => <div className="unit" key={l}><span className="num">{String(v).padStart(2, '0')}</span><small className="cin">{l}</small></div>)}
      </Reveal>
    </section>
  )
}

function Events() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0.05, 0.95], ['0%', `-${((EVENTS.length - 1) / EVENTS.length) * 100}%`])
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])
  return (
    <section ref={ref} className="hscroll indigo">
      <div className="sticky">
        <h2 className="cin">The Celebrations</h2>
        <motion.div className="track" style={{ x }}>
          {EVENTS.map((e, i) => (
            <div className="slot" key={e.n}>
              <div className="card">
                <small className="cin gold">0{i + 1}</small>
                <h3>{e.n}</h3>
                <p>{e.d}<br />{e.t}</p>
                <p className="dress"><span className="gold">Dress inspiration</span><br />{e.c}<br /><em>Wear whatever you’re comfortable in.</em></p>
              </div>
            </div>
          ))}
        </motion.div>
        <motion.div className="progress" style={{ scaleX: bar }} />
      </div>
    </section>
  )
}

function Story() {
  return (
    <section className="sand center">
      <Reveal><p className="cin gold">Our story</p></Reveal>
      <Words className="big story" text={STORY} />
    </section>
  )
}

function Photo({ src, i }) {
  const ref = useRef(null)
  const rx = useSpring(0, { stiffness: 90, damping: 20 })
  const ry = useSpring(0, { stiffness: 90, damping: 20 })
  const move = (e) => {
    const b = ref.current.getBoundingClientRect()
    ry.set(((e.clientX - b.left) / b.width - 0.5) * 16)
    rx.set(-((e.clientY - b.top) / b.height - 0.5) * 16)
  }
  return (
    <Reveal delay={(i % 3) * 0.2}>
      <motion.div ref={ref} className="photo" style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
        whileHover={{ scale: 1.04 }} transition={{ duration: 0.8, ease }}
        onMouseMove={move} onMouseLeave={() => { rx.set(0); ry.set(0) }}>
        <img src={src} alt="Shivangi and Skand" onError={(e) => (e.currentTarget.style.display = 'none')} />
      </motion.div>
    </Reveal>
  )
}

const Gallery = () => (
  <section className="sand center">
    <Reveal><p className="cin gold">Moments</p></Reveal>
    <div className="grid">{PHOTOS.map((p, i) => <Photo key={p} src={p} i={i} />)}</div>
  </section>
)

const Venue = () => (
  <section className="indigo center">
    <Reveal><Divider /></Reveal>
    <Reveal delay={0.2}><h2 className="cin">Krishna Farms, Noida</h2></Reveal>
    <Reveal delay={0.4}><p className="big">All celebrations take place at one venue.</p></Reveal>
    <Reveal delay={0.6}><a className="btn cin" href={MAP} target="_blank" rel="noreferrer">View location</a></Reveal>
  </section>
)

const Rsvp = () => (
  <section className="sand center">
    <Reveal><p className="cin gold">Kindly RSVP</p></Reveal>
    <Reveal delay={0.2}><h2 className="cin">Akshit Pundir &amp; Pundir Family</h2></Reveal>
    <Reveal delay={0.5}><p className="big">We can’t wait to celebrate with you.</p></Reveal>
    <Reveal delay={0.7}><h1 className="sign">Shivangi <span className="gold" >&amp;</span> Skand</h1></Reveal>
  </section>
)

const Gate = ({ onOpen }) => (
  <motion.div key="gate" className="gate" exit={{ transition: { duration: 2.6 } }}>
    <motion.div className="door l" exit={{ x: '-101%', transition: { duration: 2.4, ease, delay: 0.6 } }} />
    <motion.div className="door r" exit={{ x: '101%', transition: { duration: 2.4, ease, delay: 0.6 } }} />
    <motion.div className="gate-in" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.8, ease }} exit={{ opacity: 0, scale: 0.7, transition: { duration: 1 } }}>
      <p className="cin">You are cordially invited</p>
      <motion.button className="seal" onClick={onOpen} aria-label="Open invitation"
        initial={{ scale: 0.7, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 2, ease, delay: 0.4 }}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}>
        <motion.span className="pulse" animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }} />
        <motion.svg className="ring" viewBox="0 0 220 220" animate={{ rotate: 360 }}
          transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}>
          <path id="ringpath" d="M110,110 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" fill="none" />
          <text className="ring-text"><textPath href="#ringpath" textLength="520" lengthAdjust="spacing">SHIVANGI • SKAND • 27 NOVEMBER 2026 •</textPath></text>
        </motion.svg>
        <span className="disc"><b>S</b><i>&amp;</i><b>S</b></span>
      </motion.button>
      <p className="cin tap">Tap the seal to open</p>
      <em>Best experienced with sound on</em>
    </motion.div>
  </motion.div>
)

const Music = ({ on, toggle }) => (
  <motion.button className="music" onClick={toggle} aria-label={on ? 'Pause music' : 'Play music'}
    initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 1.8, ease }}>
    {[0, 1, 2, 3].map((i) => (
      <motion.i key={i} animate={on ? { scaleY: [0.3, 1, 0.4, 0.9, 0.3] } : { scaleY: 0.3 }}
        transition={{ duration: 1.4 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }} />
    ))}
  </motion.button>
)

export default function App() {
  const [opened, setOpened] = useState(false)
  const [on, setOn] = useState(false)
  const audio = useRef(null)
  const { scrollYProgress } = useScroll()
  const sx = useSpring(scrollYProgress, { stiffness: 80, damping: 25 })

  const play = () => {
    const a = audio.current
    if (!a) return
    a.volume = 0
    a.play().then(() => {
      setOn(true)
      let v = 0
      const id = setInterval(() => { v = Math.min(0.6, v + 0.03); a.volume = v; if (v >= 0.6) clearInterval(id) }, 150)
    }).catch(() => setOn(false))
  }
  const toggle = () => { if (on) { audio.current?.pause(); setOn(false) } else play() }
  const open = () => { window.scrollTo(0, 0); setOpened(true); play() }

  useEffect(() => { document.body.style.overflow = opened ? '' : 'hidden' }, [opened])
  useEffect(() => {
    const h = () => { const a = audio.current; if (!a) return; if (document.hidden) a.pause(); else if (on) a.play().catch(() => {}) }
    document.addEventListener('visibilitychange', h)
    return () => document.removeEventListener('visibilitychange', h)
  }, [on])
  useEffect(() => {
    if (!opened) return
    const lenis = new Lenis({ lerp: 0.07 })
    let id
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [opened])

  return (
    <>
      <audio ref={audio} src="/audio/music.mp3" loop preload="auto" />
      <AnimatePresence>{!opened && <Gate onOpen={open} />}</AnimatePresence>
      {opened && (
        <>
          <motion.div className="bar" style={{ scaleX: sx }} />
          <Music on={on} toggle={toggle} />
          <Hero /><Blessing /><Countdown /><Events /><Story /><Gallery /><Venue /><Rsvp />
        </>
      )}
    </>
  )
}
