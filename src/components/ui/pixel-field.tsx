import { useEffect, useRef } from 'react'

export function PixelField() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const element = canvas.current
    const panel = element?.parentElement
    const ctx = element?.getContext('2d')
    if (!element || !panel || !ctx) return

    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let width = 0
    let height = 0
    let visible = false
    let pointer: { x: number; y: number } | undefined

    function render(time: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      const centerX = width * 0.5
      const centerY = height * 0.76
      const step = width < 740 ? 13 : 16
      const phase = preference.matches ? 0 : time / 1700

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const dx = x - centerX
          const dy = y - centerY
          const radius = Math.hypot(dx * 0.72, dy)
          const spread = Math.exp(-radius / (width < 740 ? 145 : 235))
          const wave = Math.pow((Math.cos(radius / 16 - phase) + 1) / 2, 4)
          const cursor = pointer ? Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 145) : 0
          const light = spread * (0.13 + wave * 0.4) + cursor * 0.27
          ctx.fillStyle = `rgba(96, 174, 169, ${Math.min(0.85, 0.055 + light)})`
          ctx.fillRect(x + 1, y + 1, step - 2, step - 2)
        }
      }
    }

    function tick(time: number) {
      render(time)
      frame = requestAnimationFrame(tick)
    }

    function updateMotion() {
      cancelAnimationFrame(frame)
      render(0)
      if (visible && !preference.matches) frame = requestAnimationFrame(tick)
    }

    const sizing = new ResizeObserver(([entry]) => {
      if (!element || !ctx) return
      ;({ width, height } = entry.contentRect)
      const scale = Math.min(devicePixelRatio, 2)
      element.width = Math.round(width * scale)
      element.height = Math.round(height * scale)
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      render(0)
    })
    const viewport = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      updateMotion()
    })
    const move = (event: PointerEvent) => {
      if (preference.matches || event.pointerType === 'touch') return
      const rect = element.getBoundingClientRect()
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    }
    const leave = () => { pointer = undefined }

    sizing.observe(element)
    viewport.observe(element)
    panel.addEventListener('pointermove', move)
    panel.addEventListener('pointerleave', leave)
    preference.addEventListener('change', updateMotion)
    return () => {
      cancelAnimationFrame(frame)
      sizing.disconnect()
      viewport.disconnect()
      panel.removeEventListener('pointermove', move)
      panel.removeEventListener('pointerleave', leave)
      preference.removeEventListener('change', updateMotion)
    }
  }, [])

  return <canvas ref={canvas} className="pixel-field" aria-hidden="true" />
}
