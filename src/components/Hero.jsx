import { useEffect, useRef, useState } from 'react'
import { MagneticButton } from './ui.jsx'

const VIDEO_URL = '/video/hero-scrub.mp4'
const POSTER = '/img/room-end.webp'
const SCRUB_POSTER = '/img/room-start.webp'

const BANDS = [
  { a: 0.0, b: 0.2, kicker: 'TrueCraft Renovations', title: 'Built true.', sub: 'Interior finishing and bathroom renovations across Niagara.' },
  { a: 0.2, b: 0.38, kicker: 'Step one', title: 'Every home starts bare.', sub: 'Studs, subfloor and a plan, measured twice.' },
  { a: 0.46, b: 0.68, kicker: 'Step two', title: 'Then it gets built.', sub: 'Clean work, on schedule, in your home.' },
  { a: 0.76, b: 1.01, kicker: 'The result', title: 'Square. Level. Plumb.', sub: 'Crafted to last.', cta: true },
]

const ramp = 0.035
const bandOpacity = (p, a, b) => {
  if (p < a - ramp || p > b + ramp) return 0
  if (p < a) return (p - (a - ramp)) / ramp
  if (p > b) return 1 - (p - b) / ramp
  return 1
}

const FRAME_COUNT = 144
const frameSrc = (i) => `/frames/f${String(i + 1).padStart(3, '0')}.webp`

/* still: reduced motion. frames: upright phones and tablets. video: everything else. */
const MODE_QUERIES = ['(prefers-reduced-motion: reduce)', '(max-aspect-ratio: 1/1) and (max-width: 1100px)']
const getMode = () => {
  if (window.matchMedia(MODE_QUERIES[0]).matches) return 'still'
  return window.matchMedia(MODE_QUERIES[1]).matches ? 'frames' : 'video'
}

function useHeroMode() {
  const [mode, setMode] = useState(getMode)
  useEffect(() => {
    const mqs = MODE_QUERIES.map((s) => window.matchMedia(s))
    const h = () => setMode(getMode())
    mqs.forEach((m) => m.addEventListener('change', h))
    return () => mqs.forEach((m) => m.removeEventListener('change', h))
  }, [])
  return mode
}

function StaticHero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden">
      <img src={POSTER} alt="A finished open-plan home glowing at golden hour" className="kenburns absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/55 to-canvas/10" />
      <div className="relative z-10 pad-x pb-20 pt-40">
        <p className="label mb-4">TrueCraft Renovations</p>
        <h1 className="glow-text font-display text-6xl font-extrabold leading-[0.95] md:text-8xl">Built true.<br />Crafted to last.</h1>
        <p className="mt-6 max-w-md text-lg text-ink-2">Interior finishing and bathroom renovations across the Niagara Region.</p>
        <div className="mt-8"><MagneticButton href="#contact">Book Now</MagneticButton></div>
      </div>
    </section>
  )
}

function ScrubHero({ frames }) {
  const wrap = useRef(null)
  const stage = useRef(null)
  const canvas = useRef(null)
  const video = useRef(null)
  const ring = useRef(null)
  const bandEls = useRef([])
  const scrim = useRef(null)
  const hint = useRef(null)
  const barTop = useRef(null)
  const barBot = useRef(null)
  const flare = useRef(null)
  const hud = useRef(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const v = video.current
    const cv = canvas.current
    const imgs = []
    let drawn = -1, want = 0
    let target = 0, shown = 0, raf = null, last = 0, onScreen = true
    let seeking = false, pending = null, lastSet = -1, dead = false
    const bandLast = BANDS.map(() => -1)

    const progress = () => {
      if (!wrap.current) return 0
      const r = wrap.current.getBoundingClientRect()
      const total = r.height - stage.current.offsetHeight
      return Math.min(1, Math.max(0, -r.top / total))
    }

    // nearest frame that has arrived, drawn to cover the screen
    const draw = (p) => {
      want = Math.round(p * (FRAME_COUNT - 1))
      let k = -1
      for (let d = 0; d < FRAME_COUNT && k < 0; d++) {
        if (imgs[want - d]?.ready) k = want - d
        else if (imgs[want + d]?.ready) k = want + d
      }
      if (k < 0 || k === drawn) return
      const img = imgs[k]
      const ctx = cv.getContext('2d')
      const scale = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight)
      const w = img.naturalWidth * scale, h = img.naturalHeight * scale
      ctx.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h)
      drawn = k
    }
    const sizeCanvas = () => {
      if (!cv) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(cv.clientWidth * dpr), h = Math.round(cv.clientHeight * dpr)
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; drawn = -1; draw(shown) }
    }

    const requestSeek = (t) => {
      if (!v.duration) return
      t = Math.min(v.duration - 0.04, Math.max(0, t))
      if (Math.abs(t - lastSet) < 0.008) return
      if (seeking) { pending = t; return }
      seeking = true; lastSet = t; v.currentTime = t
    }
    const onSeeked = () => {
      seeking = false
      if (pending != null) { const t = pending; pending = null; requestSeek(t) }
    }
    v?.addEventListener('seeked', onSeeked)

    const paintBands = (p) => {
      BANDS.forEach((b, i) => {
        const o = bandOpacity(p, b.a, b.b)
        const key = Math.round(o * 100)
        if (key === bandLast[i]) return
        bandLast[i] = key
        const el = bandEls.current[i]
        if (!el) return
        el.style.opacity = o
        el.style.transform = `translate3d(0, ${(1 - o) * 28}px, 0)`
        el.style.pointerEvents = o > 0.5 ? 'auto' : 'none'
      })
      if (scrim.current) scrim.current.style.opacity = Math.min(1, 0.55 + (p < 0.9 ? 0.45 : 0.2))
      if (hint.current) hint.current.style.opacity = p < 0.04 ? 1 : 0
      const bar = p < 0.88 ? 1 : Math.max(0, 1 - (p - 0.88) / 0.1)
      const bh = (bar * (frames ? 3 : 7)).toFixed(2) + 'vh'
      if (barTop.current && barTop.current.style.height !== bh) { barTop.current.style.height = bh; barBot.current.style.height = bh }
      if (flare.current) flare.current.style.opacity = Math.max(0, 1 - Math.abs(p - 0.5) / 0.14).toFixed(2)
      if (hud.current) {
        const sec = p * 10.0
        const f = Math.floor((sec % 1) * 24)
        hud.current.textContent = `00:00:${String(Math.floor(sec)).padStart(2, '0')}:${String(f).padStart(2, '0')}`
      }
    }

    const tick = (now) => {
      const dt = Math.min(100, now - (last || now)); last = now
      shown += (target - shown) * (1 - Math.pow(1 - (frames ? 0.14 : 0.075), dt / 16.667))
      if (Math.abs(target - shown) < 0.0004) { shown = target; raf = null; last = 0 } else raf = requestAnimationFrame(tick)
      if (frames) draw(shown)
      else requestSeek(shown * v.duration)
      paintBands(shown)
    }
    const kick = () => { target = progress(); if (raf === null && onScreen) raf = requestAnimationFrame(tick) }

    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) kick() }, { threshold: 0 })
    io.observe(wrap.current)
    window.addEventListener('scroll', kick, { passive: true })
    const onResize = () => { if (frames) sizeCanvas(); kick() }
    window.addEventListener('resize', onResize)
    paintBands(0)

    const loadFrames = () => {
      sizeCanvas()
      let got = 0, ok = 0, next = 0
      const one = () => {
        if (dead || next >= FRAME_COUNT) return
        const i = next++
        const img = new Image()
        const done = (loaded) => {
          if (dead) return
          got++
          if (loaded) { img.ready = true; ok++ }
          ring.current?.style.setProperty('--ld', Math.round(126 * (1 - got / FRAME_COUNT)))
          if (loaded && Math.abs(i - want) < 4) { drawn = -1; draw(shown) }
          if (loaded && ok === 1) { setReady(true); drawn = -1; draw(shown); kick() }
          if (got === FRAME_COUNT) { if (ok) setReady(true); else setFailed(true); setLoaded(true) }
          one()
        }
        img.onload = () => done(true)
        img.onerror = () => done(false)
        imgs[i] = img
        img.src = frameSrc(i)
      }
      for (let n = 0; n < 6; n++) one()
    }

    // Streamed blob load with an honest progress ring
    const loadVideo = async () => {
      const ctrl = new AbortController()
      let wd = setTimeout(() => ctrl.abort(), 20000)
      try {
        const res = await fetch(VIDEO_URL, { signal: ctrl.signal })
        if (!res.ok) throw new Error('bad')
        const total = Number(res.headers.get('Content-Length')) || 11_720_000
        const reader = res.body.getReader()
        const chunks = []; let got = 0, lastRing = 0
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          clearTimeout(wd); wd = setTimeout(() => ctrl.abort(), 20000)
          chunks.push(value); got += value.length
          const now = performance.now()
          if (now - lastRing > 100) { lastRing = now; ring.current?.style.setProperty('--ld', Math.round(126 * (1 - Math.min(1, got / total)))) }
        }
        clearTimeout(wd)
        if (dead) return
        v.src = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }))
        v.load()
        v.addEventListener('loadeddata', () => {
          // touch tablets only paint seeked frames after the video has been played once
          v.play().then(() => v.pause()).catch(() => {})
          setReady(true); setLoaded(true); lastSet = -1; kick()
        }, { once: true })
      } catch {
        clearTimeout(wd)
        if (!dead) setFailed(true)
      }
    }

    if (frames) loadFrames()
    else loadVideo()

    return () => {
      dead = true
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', onResize)
      v?.removeEventListener('seeked', onSeeked)
    }
  }, [frames])

  return (
    <section id="top" ref={wrap} className="relative" style={{ height: frames ? '520vh' : '620vh' }}>
      <div ref={stage} className="sticky top-0 h-[100svh] w-full overflow-hidden bg-canvas">
        <img
          src={SCRUB_POSTER}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          style={{ opacity: ready ? 0 : 1 }}
        />
        {frames ? (
          <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full transition-opacity duration-700" style={{ opacity: ready ? 1 : 0 }} />
        ) : (
          <video
            ref={video}
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
            style={{ opacity: ready ? 1 : 0 }}
          />
        )}
        {/* legibility: left scrim sits behind every caption */}
        <div ref={scrim} className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/45 to-canvas/10 md:bg-gradient-to-r md:from-canvas/90 md:via-canvas/50 md:to-canvas/5" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent" />
        {/* anamorphic lens streak, peaks while the blueprint dissolves into the room */}
        <div ref={flare} className="pointer-events-none absolute left-0 right-0 top-1/2 h-px opacity-0 mix-blend-screen" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,181,82,0.9) 50%, transparent)', boxShadow: '0 0 40px 12px rgba(249,150,42,0.35)' }} />
        {/* letterbox bars, they open as the film resolves */}
        <div ref={barTop} className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-canvas" style={{ height: '7vh' }} />
        <div ref={barBot} className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-canvas" style={{ height: '7vh' }} />
        {/* viewfinder HUD */}
        <div className="pointer-events-none absolute top-[11vh] z-20 hidden items-center gap-3 font-mono text-[0.7rem] tracking-[0.2em] text-ink-2 md:flex" style={{ right: 'var(--gx)' }}>
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent-deep" /> REC <span ref={hud} className="text-ink">00:00:00:00</span>
        </div>

        {BANDS.map((b, i) => (
          <div
            key={i}
            ref={(el) => (bandEls.current[i] = el)}
            className="absolute inset-y-0 left-gx right-0 flex max-w-3xl flex-col justify-end pb-28 pr-6 opacity-0 will-change-transform md:justify-center md:pb-0 md:pr-0"
          >
            <p className="label caption-shadow mb-3 md:mb-5">{b.kicker}</p>
            <h1 className="glow-text caption-shadow font-display text-5xl font-extrabold leading-[0.98] sm:text-6xl md:text-8xl">{b.title}</h1>
            <p className="caption-shadow mt-4 max-w-md text-base text-ink md:mt-6 md:text-lg">{b.sub}</p>
            {b.cta && (
              <div className="mt-6 flex flex-wrap items-center gap-5 md:mt-9">
                <MagneticButton href="#contact">Book Now</MagneticButton>
                <a href="tel:9053597583" className="font-mono text-sm tracking-widest text-ink hover:text-accent">905 359 7583</a>
              </div>
            )}
          </div>
        ))}

        {!loaded && !failed && (
          <svg ref={ring} viewBox="0 0 48 48" className="absolute bottom-8 right-6 h-8 w-8 md:right-8 md:h-10 md:w-10 -rotate-90 text-accent" aria-hidden="true" style={{ '--ld': 126 }}>
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="126" style={{ strokeDashoffset: 'var(--ld)' }} />
          </svg>
        )}
        <div ref={hint} className="absolute bottom-6 left-gx flex items-center gap-3 transition-opacity duration-500 md:bottom-8">
          <span className="block h-10 w-px animate-pulse bg-accent" />
          <span className="label">Scroll</span>
        </div>
      </div>
    </section>
  )
}

export default function Hero() {
  const mode = useHeroMode()
  if (mode === 'still') return <StaticHero />
  return <ScrubHero key={mode} frames={mode === 'frames'} />
}
