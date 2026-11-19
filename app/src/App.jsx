import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { lazy, Suspense } from 'react'
const Embers = lazy(() => import('./components/Embers.jsx'))
import Hero from './components/Hero.jsx'
import { Preloader, Cursor, Vignette } from './components/Cinema.jsx'
import { Nav, Marquee, Premise, Services, Process, Trust, Local, Faq, Contact, Footer } from './components/Sections.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [])

  return (
    <div className="grain">
      <Preloader />
      <Cursor />
      <Vignette />
      <Suspense fallback={null}><Embers /></Suspense>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Premise />
        <Services />
        <Process />
        <Trust />
        <Local />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
