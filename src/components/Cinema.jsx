import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/* Opening title card: logo, a thin loading line, then the curtains part. */
export function Preloader() {
  const root = useRef(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setGone(true); return }
    document.documentElement.style.overflow = 'hidden'
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => { document.documentElement.style.overflow = ''; setGone(true) },
      })
      tl.fromTo('[data-pl-logo]', { opacity: 0, y: 20, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out' })
        .fromTo('[data-pl-line]', { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, '-=0.5')
        .fromTo('[data-pl-tag]', { opacity: 0, letterSpacing: '0.6em' }, { opacity: 1, letterSpacing: '0.28em', duration: 1, ease: 'power2.out' }, '-=1.1')
        .to('[data-pl-content]', { opacity: 0, y: -16, duration: 0.5, ease: 'power2.in' }, '+=0.25')
        .to('[data-pl-top]', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, '-=0.1')
        .to('[data-pl-bot]', { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, '<')
    }, root)
    return () => { ctx.revert(); document.documentElement.style.overflow = '' }
  }, [])

  if (gone) return null
  return (
    <div ref={root} className="fixed inset-0 z-[100]" aria-hidden="true">
      <div data-pl-top className="absolute inset-x-0 top-0 h-1/2 bg-canvas" />
      <div data-pl-bot className="absolute inset-x-0 bottom-0 h-1/2 bg-canvas" />
      <div data-pl-content className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <img data-pl-logo src="/img/logo-light.png" alt="" className="h-24 w-auto md:h-32" />
        <div className="h-px w-48 origin-left bg-line md:w-72"><div data-pl-line className="h-full origin-left bg-accent" /></div>
        <p data-pl-tag className="label">Built true. Crafted to last.</p>
      </div>
    </div>
  )
}

/* Glowing cursor ring, desktop mouse only. */
export function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const xd = gsap.quickTo(dot.current, 'x', { duration: 0.1 })
    const yd = gsap.quickTo(dot.current, 'y', { duration: 0.1 })
    const xr = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3.out' })
    const yr = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3.out' })
    const move = (e) => { xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY) }
    const over = (e) => {
      const hot = e.target.closest('a, button, input, textarea, article')
      gsap.to(ring.current, { scale: hot ? 1.9 : 1, opacity: hot ? 0.9 : 0.6, duration: 0.35 })
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    gsap.set([dot.current, ring.current], { opacity: 1 })
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over) }
  }, [])
  return (
    <>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent opacity-0 mix-blend-screen [@media(pointer:fine)]:block" style={{ marginLeft: 0 }} />
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0 [@media(pointer:fine)]:block" />
    </>
  )
}

/* Soft vignette over the whole page, like a lens. */
export function Vignette() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[55]"
      aria-hidden="true"
      style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(8,5,3,0.55) 100%)' }}
    />
  )
}
