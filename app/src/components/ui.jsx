import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* React Bits style: SplitText. Words rise out of a mask when scrolled into view. */
export function SplitText({ text, className = '', as: Tag = 'h2', delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const words = el.querySelectorAll('[data-w]')
    const tween = gsap.fromTo(
      words,
      { yPercent: 110, rotate: 4 },
      {
        yPercent: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.045, delay,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    )
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [delay])
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]" aria-hidden="true">
          <span data-w className="inline-block will-change-transform">{w}&nbsp;</span>
        </span>
      ))}
    </Tag>
  )
}

/* React Bits style: ScrollReveal. Words go from dim to bright as you scroll. */
export function ScrollReveal({ text, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const words = ref.current.querySelectorAll('[data-w]')
    const tween = gsap.fromTo(
      words,
      { opacity: 0.14 },
      {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
      }
    )
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [])
  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} data-w className="inline-block">{w}&nbsp;</span>
      ))}
    </p>
  )
}

/* React Bits style: CountUp */
export function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const obj = { v: 0 }
    const tween = gsap.to(obj, {
      v: to, duration: 2.2, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
      onUpdate: () => { if (ref.current) ref.current.textContent = Math.round(obj.v) + suffix },
    })
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [to, suffix])
  return <span ref={ref}>0{suffix}</span>
}

/* Magnetic button */
export function MagneticButton({ href, children, className = '', onClick, type }) {
  const ref = useRef(null)
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    gsap.to(ref.current, { x: x * 0.25, y: y * 0.35, duration: 0.4, ease: 'power3.out' })
  }
  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' })
  const cls = `inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 font-semibold text-canvas transition-colors hover:bg-accent-hover ${className}`
  return href ? (
    <a ref={ref} href={href} onMouseMove={move} onMouseLeave={leave} className={cls}>{children}</a>
  ) : (
    <button ref={ref} type={type} onClick={onClick} onMouseMove={move} onMouseLeave={leave} className={cls}>{children}</button>
  )
}

/* Spotlight card: a warm glow follows the cursor */
export function SpotlightCard({ children, className = '' }) {
  const ref = useRef(null)
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div
      ref={ref}
      onMouseMove={move}
      className={`relative overflow-hidden rounded-2xl border border-line bg-panel ${className}`}
      style={{ backgroundImage: 'radial-gradient(420px circle at var(--mx,50%) var(--my,-20%), rgba(249,150,42,0.14), transparent 60%)' }}
    >
      {children}
    </div>
  )
}
