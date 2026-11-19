import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText, ScrollReveal, CountUp, MagneticButton, SpotlightCard } from './ui.jsx'

gsap.registerPlugin(ScrollTrigger)

const PHONE = '905 359 7583'
const PHONE_HREF = 'tel:9053597583'
const CONTACT_EMAIL = 'info@truecraftrenovations.ca' // confirm the real inbox before launch


/* ---------- ICONS ---------- */
const Icon = ({ children }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-accent" aria-hidden="true">{children}</svg>
)
const IconStraight = () => (<Icon><path d="M6 36 L42 12" /><path d="M6 36 V30 M42 12 V18" /><circle cx="24" cy="24" r="2" /></Icon>)
const IconLevel = () => (<Icon><rect x="5" y="17" width="38" height="14" rx="3" /><path d="M5 24 H43" strokeDasharray="2 4" /><circle cx="24" cy="24" r="3.5" /><path d="M16 17 V31 M32 17 V31" /></Icon>)
const IconSquare = () => (<Icon><path d="M10 6 V40 H44" /><path d="M10 28 H22 V40" /><path d="M10 16 H15 M10 22 H17 M26 40 V35 M32 40 V37 M38 40 V35" /></Icon>)
const IconLicence = () => (<Icon><rect x="9" y="6" width="30" height="36" rx="3" /><path d="M16 16 H32 M16 23 H32 M16 30 H24" /><circle cx="33" cy="34" r="5" /><path d="M31 34 l1.6 1.6 L35.4 32" /></Icon>)
const IconShield = () => (<Icon><path d="M24 5 L39 11 V23 C39 33 32 40 24 43 C16 40 9 33 9 23 V11 Z" /><path d="M17 24 l5 5 L31 19" /></Icon>)
const IconHelmet = () => (<Icon><path d="M8 32 C8 20 15 12 24 12 C33 12 40 20 40 32 Z" /><path d="M4 32 H44 V37 H4 Z" /><path d="M24 12 V22 M17 14 V22 M31 14 V22" /></Icon>)

/* ---------- NAV ---------- */
export function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const h = () => setSolid(window.scrollY > 80)
    h(); window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => { document.documentElement.style.overflow = '' }
  }, [open])
  const links = [['#services', 'Services'], ['#process', 'Process'], ['#faq', 'Questions'], ['#contact', 'Contact']]
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between pad-x py-3 transition-all duration-500 md:py-4 ${solid || open ? 'bg-canvas/85 backdrop-blur-md' : ''}`}>
        <a href="#top" onClick={() => setOpen(false)} aria-label="TrueCraft Renovations, home"><img src="/img/logo-light.png" alt="TrueCraft Renovations" className="h-11 w-auto md:h-14" /></a>
        <nav className="hidden items-center gap-9 text-sm font-medium text-ink-2 md:flex">
          <a href="#services" className="transition-colors hover:text-accent">Services</a>
          <a href="#process" className="transition-colors hover:text-accent">Process</a>
          <a href="#faq" className="transition-colors hover:text-accent">Questions</a>
          <a href={PHONE_HREF} className="font-mono tracking-widest text-ink transition-colors hover:text-accent">{PHONE}</a>
        </nav>
        <a href="#contact" className="hidden rounded-full border border-accent px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-canvas md:inline-block">Get a quote</a>
        <button onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[6px] md:hidden">
          <span className={`h-px w-6 bg-ink transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-6 bg-ink transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </header>
      <div className={`fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-canvas pad-x pt-20 transition-all duration-500 md:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        {links.map(([h, t], i) => (
          <a key={h} href={h} onClick={() => setOpen(false)} className="border-b border-line py-5 font-display text-4xl transition-all duration-500" style={{ transitionDelay: open ? `${i * 70}ms` : '0ms', transform: open ? 'none' : 'translateY(20px)' }}>{t}</a>
        ))}
        <a href={PHONE_HREF} className="mt-8 font-mono text-xl tracking-widest text-accent">{PHONE}</a>
      </div>
    </>
  )
}

/* ---------- BANNER / MARQUEE ---------- */
export function Marquee() {
  const items = ['Interior finishing', 'Bathroom renovations', 'Zero threshold showers', 'Basement finishing', 'Repairs and maintenance', 'General construction']
  const row = [...items, ...items]
  return (
    <div className="relative z-10 overflow-hidden border-y border-line bg-canvas py-5">
      <div className="marquee flex w-max gap-12 whitespace-nowrap">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center gap-12 font-display text-2xl italic text-ink-2 md:text-3xl">
            {t}<span className="inline-block h-2 w-2 rotate-45 bg-accent" />
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------- PREMISE: the word "true" ---------- */
export function Premise() {
  const cols = [
    [IconStraight, 'Straight', 'Lines you can sight down. No waves, no gaps.'],
    [IconLevel, 'Level', 'Floors, counters and tile that sit flat and stay flat.'],
    [IconSquare, 'Square', 'Corners that close clean, so trim and cabinets fit first time.'],
  ]
  return (
    <section className="relative z-10 bg-canvas pad-x py-32 text-center md:py-48">
      <p className="label mb-8">Chapter I &middot; The word we build on</p>
      <ScrollReveal
        className="mx-auto max-w-5xl font-display text-4xl font-semibold leading-[1.12] md:text-7xl"
        text="In the trade, a wall is true when it is straight, level and square. Everything after it rests on that. We build every room that way."
      />
      <div className="mx-auto mt-20 grid max-w-5xl gap-12 md:grid-cols-3 md:gap-0">
        {cols.map(([Ico, t, d], i) => (
          <div key={t} className={`flex flex-col items-center px-8 ${i > 0 ? 'md:border-l md:border-line' : ''}`}>
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-line bg-panel shadow-[0_0_50px_-10px_rgba(249,150,42,0.35)]"><Ico /></div>
            <h3 className="font-display text-3xl text-ink">{t}</h3>
            <p className="mt-3 max-w-[16rem] leading-relaxed text-ink-2">{d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- SERVICES: pinned horizontal gallery ---------- */
const SERVICES = [
  { n: '01', t: 'Bathroom renovations', d: 'Full gut and rebuild. Vanities, tile, tubs, lighting, finished clean.', img: '/img/bathroom.webp' },
  { n: '02', t: 'Zero threshold showers', d: 'Step-free, easy to enter, easy to clean, built to be waterproof.', img: '/img/shower.webp' },
  { n: '03', t: 'Interior finishing', d: 'Trim, drywall finish, built-ins and paint. The details that make a room feel done.', img: '/img/interior.webp' },
  { n: '04', t: 'Basement finishing', d: 'From bare concrete to a room your family actually uses.', img: '/img/basement.webp' },
  { n: '05', t: 'Repairs and maintenance', d: 'Smaller upgrades and fixes handled with the same care as a full renovation.', img: '/img/craft.webp' },
]

export function Services() {
  const sec = useRef(null)
  const track = useRef(null)
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const dist = () => track.current.scrollWidth - window.innerWidth
      gsap.to(track.current, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: sec.current, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true },
      })
    })
    return () => mm.revert()
  }, [])
  return (
    <section id="services" ref={sec} className="relative z-10 overflow-hidden bg-panel md:h-screen">
      <div className="services-head pad-x pt-24 md:absolute md:top-24 md:z-10 md:pt-0">
        <p className="label mb-4">Chapter II &middot; What we build</p>
        <SplitText text="Rooms that feel finished." className="font-display text-5xl font-extrabold leading-none md:text-7xl" />
      </div>
      <div ref={track} className="services-track flex flex-col gap-10 py-16 md:h-full md:w-max md:flex-row md:items-end md:gap-8 md:pb-14 md:pt-0">
        {SERVICES.map((s) => (
          <article key={s.n} className="group relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-2xl md:h-[60vh] md:w-auto">
            <img src={s.img} alt={s.t} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <span className="label">{s.n}</span>
              <h3 className="mt-2 font-display text-3xl font-semibold">{s.t}</h3>
              <p className="mt-2 max-w-sm text-ink-2">{s.d}</p>
            </div>
          </article>
        ))}
        <div className="flex shrink-0 items-center md:w-[30vw]">
          <MagneticButton href="#contact">Plan your project</MagneticButton>
        </div>
      </div>
    </section>
  )
}

/* ---------- PROCESS: pinned, image changes with each step ---------- */
const STEPS = [
  ['Consultation', 'We walk the space with you, listen, and measure. No pressure, no pitch.', '/img/blueprint.webp'],
  ['Plan and schedule', 'You get a clear scope and a calendar. You know what happens and when.', '/img/interior.webp'],
  ['The build', 'Careful project management, tidy work, and updates you do not have to chase.', '/img/craft.webp'],
  ['Final walk-through', 'We go room by room together. It is done when you say it is done.', '/img/bathroom.webp'],
]

export function Process() {
  const wrap = useRef(null)
  const bar = useRef(null)
  const [active, setActive] = useState(0)
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: wrap.current, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => {
        setActive(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length)))
        if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`
      },
    })
    return () => st.kill()
  }, [])
  return (
    <section id="process" ref={wrap} className="relative z-10 bg-canvas" style={{ height: '420vh' }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-6 overflow-hidden pad-x pt-24 md:grid md:grid-cols-[1.05fr_1fr] md:items-center md:gap-20 md:pt-0">
        <div className="relative mx-auto aspect-[16/11] w-full max-w-xl overflow-hidden rounded-2xl border border-line md:aspect-[4/5] md:max-h-[78vh] md:max-w-none">
          {STEPS.map(([t, , img], i) => (
            <img
              key={t}
              src={img}
              alt={t}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-[1100ms] ease-[cubic-bezier(.7,0,.2,1)]"
              style={{
                opacity: active === i ? 1 : 0,
                transform: active === i ? 'scale(1)' : active > i ? 'scale(1.12)' : 'scale(1.2)',
                clipPath: active >= i ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-canvas/70 via-transparent to-transparent" />
          <span className="label absolute bottom-5 left-5">Step 0{active + 1} / 04</span>
        </div>

        <div className="relative md:pl-10">
          <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-line md:block">
            <div ref={bar} className="h-full origin-top bg-accent" style={{ transform: 'scaleY(0)', boxShadow: '0 0 10px rgba(249,150,42,.8)' }} />
          </div>
          <p className="label mb-4">Chapter III &middot; How a project runs</p>
          <h2 className="mb-8 font-display text-4xl font-extrabold leading-[1.02] md:mb-12 md:text-6xl">Clear from the first call to the last tile.</h2>
          <ol className="space-y-5 md:space-y-8">
            {STEPS.map(([t, d], i) => (
              <li key={t} className={`transition-all duration-700 ${active === i ? 'opacity-100' : 'hidden opacity-30 md:block'}`}>
                <div className="flex items-baseline gap-4">
                  <span className={`font-mono text-sm transition-colors ${active === i ? 'text-accent' : 'text-ink-2'}`}>0{i + 1}</span>
                  <h3 className="font-display text-2xl font-semibold md:text-4xl">{t}</h3>
                </div>
                <div className="grid transition-all duration-700" style={{ gridTemplateRows: active === i ? '1fr' : '0fr' }}>
                  <p className="overflow-hidden pl-9 pt-1 text-lg text-ink-2 md:pl-11">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ---------- TRUST / CREDENTIALS ---------- */
export function Trust() {
  const creds = [
    [IconLicence, 'Licensed', 'Work done properly and to code, start to finish.'],
    [IconShield, 'Insured', 'Your home is protected on every single job.'],
    [IconHelmet, 'WSIB covered', 'Our crew is covered, so you carry no risk.'],
  ]
  return (
    <section className="relative z-10 overflow-hidden bg-panel pad-x py-28 md:py-40">
      <img src="/img/interior.webp" alt="" loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.1] grayscale" />
      <div className="absolute inset-0 bg-gradient-to-b from-panel via-transparent to-panel" />
      <div className="relative">
        <p className="label mb-4">Chapter IV &middot; Why homeowners trust us</p>
        <SplitText text="Seventeen years of getting it right." className="max-w-4xl font-display text-5xl font-extrabold leading-[1.02] md:text-7xl" />

        <div className="mt-16 grid border-y border-line md:grid-cols-4">
          <div className="flex flex-col justify-between gap-10 border-b border-line py-10 md:border-b-0 md:py-14 md:pr-10">
            <p className="label">Experience</p>
            <div>
              <div className="font-display text-8xl font-extrabold leading-none text-accent md:text-[9rem]"><CountUp to={17} /></div>
              <p className="mt-3 text-lg text-ink">years renovating homes across Niagara</p>
            </div>
          </div>
          {creds.map(([Ico, t, d]) => (
            <div key={t} className="group flex flex-col justify-between gap-6 border-b border-line py-8 transition-colors duration-500 last:border-b-0 hover:bg-accent/[0.04] md:gap-10 md:border-b-0 md:border-l md:px-8 md:py-14">
              <Ico />
              <div>
                <h3 className="font-display text-3xl">{t}</h3>
                <p className="mt-2 text-ink-2">{d}</p>
                <span className="mt-6 block h-px w-10 bg-accent transition-all duration-500 group-hover:w-24" />
              </div>
            </div>
          ))}
        </div>

        <ul className="mt-10 grid gap-3 text-ink-2 md:grid-cols-3">
          {['Quality workmanship', 'Clear communication', 'Professional project management'].map((t) => (
            <li key={t} className="flex items-center gap-3"><span className="inline-block h-2 w-2 rotate-45 bg-accent" />{t}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- LOCAL / VAN ---------- */
export function Local() {
  const frame = useRef(null)
  useEffect(() => {
    const img = frame.current.querySelector('img')
    const a = gsap.fromTo(frame.current, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: frame.current, start: 'top 80%', once: true } })
    const b = gsap.fromTo(img, { scale: 1.35 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: frame.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    return () => { [a, b].forEach((t) => { t.scrollTrigger?.kill(); t.kill() }) }
  }, [])
  return (
    <section className="relative z-10 grid items-center gap-12 bg-canvas pad-x py-32 md:grid-cols-2">
      <div ref={frame} className="overflow-hidden rounded-2xl border border-line">
        <img src="/img/van.webp" alt="The TrueCraft Renovations work van" loading="lazy" className="w-full object-cover" />
      </div>
      <div>
        <p className="label mb-4">Chapter V &middot; Local to Niagara</p>
        <SplitText text="Your neighbours in the Niagara Region." className="font-display text-5xl font-extrabold leading-[1.02] md:text-6xl" />
        <p className="mt-6 max-w-lg text-lg text-ink-2">
          When a job needs a licensed or specialty trade, we bring in people we trust and manage the schedule so you deal with one team. We respect your home and keep the site clean.
        </p>
        <a href={PHONE_HREF} className="mt-8 inline-block font-mono text-2xl tracking-widest text-accent hover:text-accent-hover">{PHONE}</a>
      </div>
    </section>
  )
}

/* ---------- FAQ ---------- */
const FAQ = [
  ['Are you licensed and insured?', 'Yes. We are licensed, insured and WSIB covered.'],
  ['Who handles plumbing and electrical?', 'When a job needs a licensed or specialty trade, we coordinate trusted professionals and manage the schedule for you.'],
  ['Where do you work?', 'Across the Niagara Region.'],
  ['Are you booking for 2027?', 'Yes. We are booking upcoming projects now. Reach out early to get a spot on the calendar.'],
  ['How does a project start?', 'With a consultation. We look at the space, talk through what you want, and follow up with a clear plan.'],
]

export function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="relative z-10 bg-panel pad-x py-28">
      <div className="mx-auto max-w-4xl">
        <p className="label mb-4">Chapter VI &middot; Good questions</p>
        <SplitText text="Straight answers." className="mb-12 font-display text-5xl font-extrabold md:text-7xl" />
        {FAQ.map(([q, a], i) => (
          <div key={q} className="border-t border-line">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={open === i}>
              <span className="font-display text-2xl md:text-3xl">{q}</span>
              <span className={`text-3xl text-accent transition-transform duration-500 ${open === i ? 'rotate-45' : ''}`}>+</span>
            </button>
            <div className="grid transition-all duration-500" style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}>
              <p className="overflow-hidden pb-6 text-lg text-ink-2">{a}</p>
            </div>
          </div>
        ))}
        <div className="border-t border-line" />
      </div>
    </section>
  )
}

/* ---------- CONTACT ---------- */
export function Contact() {
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    const f = new FormData(e.target)
    const body = `Name: ${f.get('name')}\nPhone: ${f.get('phone')}\n\nProject:\n${f.get('msg')}`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Renovation quote request')}&body=${encodeURIComponent(body)}`
    setSent(true)
  }
  const field = 'w-full border-b border-line bg-transparent py-4 text-lg outline-none transition-colors placeholder:text-ink-2/60 focus:border-accent'
  return (
    <section id="contact" className="relative z-10 overflow-hidden bg-canvas pad-x py-32 md:py-44">
      <img src="/img/blueprint.webp" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12]" />
      <div className="relative mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
        <div>
          <p className="label mb-4">Final chapter &middot; Now booking 2027</p>
          <SplitText text="Let's build it true." className="font-display text-6xl font-extrabold leading-[0.98] md:text-8xl" />
          <p className="mt-8 max-w-md text-lg text-ink-2">Tell us about the room. We will call you back to set up a consultation.</p>
          <a href={PHONE_HREF} className="mt-8 inline-block font-mono text-3xl tracking-widest text-accent hover:text-accent-hover">{PHONE}</a>
        </div>
        {sent ? (
          <div className="self-center rounded-2xl border border-line bg-panel p-10">
            <h3 className="font-display text-4xl">Your email app should be open.</h3>
            <p className="mt-4 text-ink-2">Send the message from there and we will get back to you. Prefer to talk? Call {PHONE}.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6 self-center">
            <input name="name" required placeholder="Your name" className={field} />
            <input name="phone" type="tel" placeholder="Phone number" className={field} />
            <textarea name="msg" required rows={4} placeholder="What are we building?" className={field + ' resize-none'} />
            <MagneticButton type="submit">Start the conversation <span aria-hidden="true">→</span></MagneticButton>
          </form>
        )}
      </div>
    </section>
  )
}

/* ---------- FOOTER ---------- */
export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-canvas pad-x py-14">
      <div className="flex flex-col justify-between gap-10 md:flex-row">
        <div>
          <img src="/img/logo-light.png" alt="TrueCraft Renovations" className="h-16 w-auto" />
          <p className="mt-4 font-display text-xl italic text-ink-2">Built true. Crafted to last.</p>
        </div>
        <div className="space-y-2 text-ink-2">
          <p className="label">Reach us</p>
          <a href={PHONE_HREF} className="block hover:text-accent">{PHONE}</a>
          <p>Niagara Region</p>
          <p>Licensed &bull; Insured &bull; WSIB Covered</p>
        </div>
        <div className="space-y-2 text-ink-2">
          <p className="label">Follow</p>
          <a href="https://www.instagram.com/truecraft.niagara" target="_blank" rel="noreferrer" className="block hover:text-accent">Instagram</a>
          <a href="https://www.facebook.com/TrueCraftRenovations.Niagara" target="_blank" rel="noreferrer" className="block hover:text-accent">Facebook</a>
          <a href="https://www.yelp.com/biz/vYDxreulpi8fw9ni8j5a6Q" target="_blank" rel="noreferrer" className="block hover:text-accent">Yelp</a>
        </div>
      </div>
      <p className="mt-12 text-sm text-ink-2/70">
        &copy; {new Date().getFullYear()} TrueCraft Renovations. Hero film and room imagery are AI generated, based on real TrueCraft work.
      </p>
    </footer>
  )
}
