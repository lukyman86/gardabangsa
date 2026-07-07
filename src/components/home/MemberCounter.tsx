import { useEffect, useRef, useState } from 'react'

export function MemberCounter({ target }: { target: number }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const duration = 1400
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(Math.round(eased * target))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return (
    <section ref={ref} className="bg-forest-800 text-forest-50">
      <div className="container-gb flex flex-col items-center gap-2 py-14 text-center">
        <div className="font-display text-5xl font-bold text-cendrawasih-300">
          {value.toLocaleString('id-ID')}
        </div>
        <p className="text-forest-100">Anggota aktif di seluruh Papua Barat</p>
      </div>
    </section>
  )
}
