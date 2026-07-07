import { useEffect } from 'react'
import type { Tables } from '~/integrations/supabase/types'

export function MediaLightbox({
  item,
  onClose,
}: {
  item: Tables<'galleries'> | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {item.media_type === 'video' ? (
          <video src={item.media_url} controls className="max-h-[80vh] w-full rounded-xl" />
        ) : (
          <img
            src={item.media_url}
            alt={item.title}
            className="max-h-[80vh] w-full rounded-xl object-contain"
          />
        )}
        <p className="mt-3 text-center text-white">{item.title}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 block w-full text-center text-sm text-white/70 hover:text-white"
        >
          Tutup (Esc)
        </button>
      </div>
    </div>
  )
}
