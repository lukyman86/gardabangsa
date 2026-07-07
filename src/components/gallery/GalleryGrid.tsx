import { useState } from 'react'
import { MediaLightbox } from './MediaLightbox'
import type { Tables } from '~/integrations/supabase/types'

export function GalleryGrid({ items }: { items: Tables<'galleries'>[] }) {
  const [active, setActive] = useState<Tables<'galleries'> | null>(null)

  if (items.length === 0) {
    return (
      <p className="text-sand-600">Belum ada dokumentasi kegiatan.</p>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item)}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-sand-100"
          >
            {item.media_type === 'video' ? (
              <video
                src={item.media_url}
                className="h-full w-full object-cover"
                muted
                playsInline
              />
            ) : (
              <img
                src={item.media_url}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            )}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              {item.title}
            </span>
          </button>
        ))}
      </div>
      <MediaLightbox item={active} onClose={() => setActive(null)} />
    </>
  )
}
