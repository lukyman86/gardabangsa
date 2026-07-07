import type { Tables } from '~/integrations/supabase/types'

/**
 * Generate a digital KTA (kartu tanda anggota) as a PNG using the
 * browser Canvas API. Returns a data URL that can be downloaded or
 * previewed. Runs client-side only.
 */
export interface KtaInput {
  fullName: string
  memberId: string
  cabang?: string | null
  role?: string
  status?: string
  avatarUrl?: string | null
  issuedAt?: string
}

const W = 1010
const H = 640

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export async function generateKta(input: KtaInput): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas tidak didukung')

  // Background gradient (forest -> ocean)
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, '#1f6b46')
  grad.addColorStop(0.55, '#12564f')
  grad.addColorStop(1, '#0c3a6b')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // Decorative cendrawasih accent bars
  ctx.fillStyle = 'rgba(255, 209, 64, 0.85)'
  ctx.fillRect(0, 0, W, 14)
  ctx.fillRect(0, H - 14, W, 14)

  // Card panel
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  roundRect(ctx, 40, 40, W - 80, H - 80, 24)
  ctx.fill()

  // Header text
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 40px "Plus Jakarta Sans", system-ui, sans-serif'
  ctx.fillText('GARDA BANGSA', 80, 120)
  ctx.fillStyle = 'rgba(255,209,64,0.95)'
  ctx.font = '600 22px "Plus Jakarta Sans", system-ui, sans-serif'
  ctx.fillText('PAPUA BARAT', 80, 156)
  ctx.fillStyle = 'rgba(255,255,255,0.65)'
  ctx.font = '500 16px Inter, system-ui, sans-serif'
  ctx.fillText('KARTU TANDA ANGGOTA DIGITAL', 80, 188)

  // Photo
  const photoX = W - 300
  const photoY = 110
  const photoR = 100
  ctx.save()
  ctx.beginPath()
  ctx.arc(photoX + photoR, photoY + photoR, photoR, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.fillRect(photoX, photoY, photoR * 2, photoR * 2)
  if (input.avatarUrl) {
    try {
      const img = await loadImage(input.avatarUrl)
      ctx.drawImage(img, photoX, photoY, photoR * 2, photoR * 2)
    } catch {
      /* ignore — keep placeholder */
    }
  }
  ctx.restore()
  ctx.strokeStyle = 'rgba(255,209,64,0.9)'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(photoX + photoR, photoY + photoR, photoR, 0, Math.PI * 2)
  ctx.stroke()

  // Fields
  const fx = 80
  let fy = 270
  const line = 54
  const field = (label: string, value: string) => {
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = '500 15px Inter, system-ui, sans-serif'
    ctx.fillText(label.toUpperCase(), fx, fy)
    ctx.fillStyle = '#ffffff'
    ctx.font = '600 24px Inter, system-ui, sans-serif'
    ctx.fillText(value || '-', fx, fy + 30)
    fy += line + 18
  }
  field('Nama Lengkap', input.fullName)
  field('No. Anggota', input.memberId)
  field('Cabang', input.cabang ?? '-')
  field('Status', input.status ?? '-')
  field('Diterbitkan', input.issuedAt ?? new Date().toLocaleDateString('id-ID'))

  return canvas.toDataURL('image/png')
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function buildMemberId(profile: Tables<'profiles'>): string {
  const year = new Date(profile.created_at).getFullYear()
  const short = profile.id.replace(/-/g, '').slice(0, 8).toUpperCase()
  return `GB-PB/${year}/${short}`
}
