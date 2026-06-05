'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

type ReorderItem = {
  id: string
  title?: string | null
  caption?: string | null
  order?: number | null
  fileURL?: string | null
}

type ReorderPhotosFieldProps = {
  relationField: 'projet' | 'exposition'
  orderField: 'orderProjet' | 'orderExposition'
  endpointBase: 'projets' | 'expositions'
  label: string
}

const getDocIDFromPath = (): string | null => {
  const pathname = usePathname()

  //if (typeof window === 'undefined') return null

  const parts = pathname.split('/').filter(Boolean)
  const index = parts.findIndex((part) => part === 'collections')
  if (index < 0 || !parts[index + 2]) return null

  const id = parts[index + 2]
  return id === 'create' ? null : id
}

export default function ReorderPhotosField(props: ReorderPhotosFieldProps) {
  const { relationField, orderField, endpointBase, label } = props
  const [items, setItems] = useState<ReorderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const docID = useMemo(() => getDocIDFromPath(), [])

  const sortItems = (a: ReorderItem, b: ReorderItem): number => {
    const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER
    const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER
    return orderA - orderB
  }

  const loadItems = async () => {
    if (!docID) {
      setLoading(false)
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const query = `/api/photos?limit=0&depth=1&where[${relationField}][equals]=${docID}`
      const response = await fetch(query, { credentials: 'include' })
      if (!response.ok) throw new Error('fetch-failed')

      const data = await response.json()
      const nextItems: ReorderItem[] = (data?.docs || []).map((photo: any) => ({
        id: photo.id,
        title: photo.title,
        caption: photo.caption,
        order: typeof photo?.[orderField] === 'number' ? photo[orderField] : null,
        fileURL: typeof photo?.file === 'object' ? photo.file?.url : null,
      }))

      nextItems.sort(sortItems)
      setItems(nextItems)
    } catch {
      setMessage('Impossible de charger les photos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadItems()
  }, [docID])

  const moveItem = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return

    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setItems(next)
  }

  const handleSave = async () => {
    if (!docID) return
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/${endpointBase}/${docID}/reorder-photos`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item, index) => ({
            id: item.id,
            order: index,
          })),
        }),
      })

      if (!response.ok) throw new Error('save-failed')
      setMessage('Ordre sauvegarde.')
    } catch {
      setMessage('Echec de sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  if (!docID) {
    return (
      <div
        style={{
          margin: '1rem 0',
          padding: '0.875rem 1rem',
          borderRadius: 8,
          border: '1px solid var(--theme-elevation-150, #d9d9df)',
          background: 'var(--theme-elevation-50, #f5f5f7)',
          color: 'var(--theme-text, #111827)',
          fontSize: '0.95rem',
        }}
      >
        Enregistre d&apos;abord ce document puis reviens ici pour trier les photos.
      </div>
    )
  }

  if (loading) {
    return (
      <div
        style={{
          margin: '1rem 0',
          color: 'var(--theme-text, #111827)',
          opacity: 0.85,
        }}
      >
        Chargement des photos...
      </div>
    )
  }

  return (
    <div
      style={{
        margin: '1.5rem 0',
        border: '1px solid var(--theme-elevation-150, #d9d9df)',
        borderRadius: 10,
        background: 'var(--theme-elevation-0, #fff)',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          padding: '1rem',
          borderBottom: '1px solid var(--theme-elevation-100, #ececf0)',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <strong style={{ color: 'var(--theme-text, #111827)' }}>{label}</strong>
          <p
            style={{
              margin: '0.35rem 0 0',
              opacity: 0.75,
              color: 'var(--theme-text, #111827)',
              fontSize: '0.9rem',
            }}
          >
            Glisse-depose une photo pour la reordonner.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '0.5rem 0.9rem',
            borderRadius: 6,
            border: '1px solid var(--theme-elevation-250, #c9cad4)',
            background: saving
              ? 'var(--theme-elevation-100, #ececf0)'
              : 'var(--theme-success-500, #2f855a)',
            color: saving ? 'var(--theme-text, #111827)' : '#fff',
            fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.8 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {saving ? 'Sauvegarde...' : "Sauvegarder l'ordre"}
        </button>
      </div>

      <div style={{ display: 'grid', gap: 8, padding: '0.875rem 1rem 1rem' }}>
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragIndex === null) return
              moveItem(dragIndex, index)
              setDragIndex(null)
            }}
            onDragEnd={() => setDragIndex(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              border: '1px solid var(--theme-elevation-100, #ececf0)',
              borderRadius: 6,
              padding: 8,
              background:
                dragIndex === index
                  ? 'var(--theme-elevation-50, #f5f5f7)'
                  : 'var(--theme-elevation-50',
              color: 'var(--theme-text, #111827)',
              cursor: 'grab',
            }}
          >
            <span
              style={{
                minWidth: 26,
                fontWeight: 700,
                color: 'var(--theme-text, #111827)',
                opacity: 0.75,
                textAlign: 'right',
              }}
            >
              {index + 1}
            </span>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 4,
                overflow: 'hidden',
                background: 'var(--theme-elevation-50, #f5f5f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--theme-elevation-100, #ececf0)',
                flexShrink: 0,
              }}
            >
              {item.fileURL ? (
                <img
                  src={item.fileURL}
                  alt={item.title || 'photo'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>No Img</span>
              )}
            </div>
            <div style={{ minWidth: 0, flexGrow: 1 }}>
              <div style={{ fontWeight: 600 }}>{item.title || 'Sans titre'}</div>
              {item.caption ? (
                <div
                  style={{
                    opacity: 0.75,
                    fontSize: '0.85rem',
                    marginTop: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.caption}
                </div>
              ) : null}
            </div>
            <span style={{ opacity: 0.45, fontSize: '1rem', userSelect: 'none' }}>::</span>
          </div>
        ))}
      </div>

      {message ? (
        <p
          style={{
            margin: '0 1rem 1rem',
            padding: '0.65rem 0.75rem',
            borderRadius: 6,
            border: '1px solid var(--theme-elevation-150, #d9d9df)',
            background: message.includes('Echec')
              ? 'var(--theme-error-100, #fff1f1)'
              : 'var(--theme-success-100, #e8f8ef)',
            color: 'var(--theme-text, #111827)',
          }}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}
