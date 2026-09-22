'use client'

import React, { useEffect, useState } from 'react'

type AddPhotoModalProps = {
  isOpen: boolean
  onClose: () => void
  docID: string
  relationField: 'projet' | 'exposition'
  orderField: 'orderProjet' | 'orderExposition'
  currentPhotoIds: string[]
  nextOrder: number
  onPhotoAdded: () => void
}

type ExistingPhoto = {
  id: string
  title?: string | null
  caption?: string | null
  fileURL?: string | null
  isAssignedToThis: boolean
}

export default function AddPhotoModal({
  isOpen,
  onClose,
  docID,
  relationField,
  orderField,
  currentPhotoIds,
  nextOrder,
  onPhotoAdded,
}: AddPhotoModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'existing'>('upload')

  // États pour l'upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)

  // États pour la sélection existante
  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>([])
  const [loadingExisting, setLoadingExisting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [linkingId, setLinkingId] = useState<string | null>(null)
  const [linkingError, setLinkingError] = useState<string | null>(null)

  // Gérer le changement de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
    setUploadError(null)

    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewURL(url)
      if (!title) {
        // Pré-remplir le titre avec le nom du fichier sans extension
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
        setTitle(nameWithoutExt)
      }
    } else {
      setPreviewURL(null)
    }
  }

  // Nettoyage de l'URL d'aperçu
  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL)
    }
  }, [previewURL])

  // Charger les photos existantes pour l'onglet bibliothèque
  const loadExistingPhotos = async () => {
    setLoadingExisting(true)
    setLinkingError(null)

    try {
      const res = await fetch('/api/photos?limit=50&depth=1&sort=-createdAt', {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Impossible de charger les photos')
      const data = await res.json()

      const list: ExistingPhoto[] = (data?.docs || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        caption: p.caption,
        fileURL: typeof p.file === 'object' ? p.file?.url : null,
        isAssignedToThis: currentPhotoIds.includes(p.id),
      }))

      setExistingPhotos(list)
    } catch (err: any) {
      setLinkingError(err?.message || 'Erreur de chargement')
    } finally {
      setLoadingExisting(false)
    }
  }

  useEffect(() => {
    if (isOpen && activeTab === 'existing') {
      void loadExistingPhotos()
    }
  }, [isOpen, activeTab])

  // Soumission de l'upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setUploadError('Veuillez sélectionner un fichier image.')
      return
    }
    if (!title.trim()) {
      setUploadError('Le titre est requis.')
      return
    }

    setUploading(true)
    setUploadError(null)
    setUploadSuccess(null)

    try {
      // 1. Upload vers /api/media
      const mediaFormData = new FormData()
      mediaFormData.append('file', selectedFile)
      mediaFormData.append('alt', title.trim())
      mediaFormData.append('_payload', JSON.stringify({ alt: title.trim() }))

      const mediaRes = await fetch('/api/media', {
        method: 'POST',
        credentials: 'include',
        body: mediaFormData,
      })

      if (!mediaRes.ok) {
        throw new Error("Échec du téléversement du média dans l'espace de stockage.")
      }

      const mediaData = await mediaRes.json()
      const mediaId = mediaData?.doc?.id || mediaData?.id
      if (!mediaId) {
        throw new Error('Identifiant de média non renvoyé.')
      }

      // 2. Création de la photo dans /api/photos
      const photoBody: Record<string, any> = {
        file: mediaId,
        title: title.trim(),
        caption: caption.trim() || undefined,
        [relationField]: docID,
        [orderField]: nextOrder,
      }

      const photoRes = await fetch('/api/photos', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(photoBody),
      })

      if (!photoRes.ok) {
        throw new Error('Média envoyé mais échec lors de la création de la photo.')
      }

      setUploadSuccess('Photo ajoutée avec succès !')
      setSelectedFile(null)
      setPreviewURL(null)
      setTitle('')
      setCaption('')

      onPhotoAdded()

      setTimeout(() => {
        setUploadSuccess(null)
        onClose()
      }, 800)
    } catch (err: any) {
      setUploadError(err?.message || "Une erreur est survenue lors de l'ajout.")
    } finally {
      setUploading(false)
    }
  }

  // Lier une photo existante
  const handleLinkExisting = async (photoId: string) => {
    setLinkingId(photoId)
    setLinkingError(null)

    try {
      const res = await fetch(`/api/photos/${photoId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [relationField]: docID,
          [orderField]: nextOrder,
        }),
      })

      if (!res.ok) throw new Error('Échec de la liaison de la photo.')

      setExistingPhotos((prev) =>
        prev.map((p) => (p.id === photoId ? { ...p, isAssignedToThis: true } : p)),
      )

      onPhotoAdded()
    } catch (err: any) {
      setLinkingError(err?.message || 'Erreur lors de la liaison.')
    } finally {
      setLinkingId(null)
    }
  }

  if (!isOpen) return null

  const filteredExisting = existingPhotos.filter((p) =>
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(3px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          background: 'var(--theme-elevation-0, #ffffff)',
          color: 'var(--theme-text, #111827)',
          borderRadius: 12,
          border: '1px solid var(--theme-elevation-200, #d9d9df)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--theme-elevation-100, #ececf0)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            Ajouter une photo à ce document
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--theme-text, #111827)',
              opacity: 0.6,
              padding: '0.2rem 0.5rem',
              borderRadius: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--theme-elevation-100, #ececf0)',
            background: 'var(--theme-elevation-50, #f8f9fa)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: 'none',
              borderBottom: activeTab === 'upload' ? '2px solid var(--theme-success-500, #2f855a)' : '2px solid transparent',
              background: activeTab === 'upload' ? 'var(--theme-elevation-0, #fff)' : 'transparent',
              color: activeTab === 'upload' ? 'var(--theme-text, #111827)' : 'var(--theme-text, #666)',
              fontWeight: activeTab === 'upload' ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            Téléverser une nouvelle photo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('existing')}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: 'none',
              borderBottom: activeTab === 'existing' ? '2px solid var(--theme-success-500, #2f855a)' : '2px solid transparent',
              background: activeTab === 'existing' ? 'var(--theme-elevation-0, #fff)' : 'transparent',
              color: activeTab === 'existing' ? 'var(--theme-text, #111827)' : 'var(--theme-text, #666)',
              fontWeight: activeTab === 'existing' ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            Choisir dans la bibliothèque
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'upload' ? (
            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* File Dropzone */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Fichier image *
                </label>
                <div
                  style={{
                    border: '2px dashed var(--theme-elevation-200, #c9cad4)',
                    borderRadius: 8,
                    padding: '1.25rem',
                    textAlign: 'center',
                    background: 'var(--theme-elevation-50, #f9fafb)',
                    cursor: 'pointer',
                  }}
                  onClick={() => document.getElementById('photo-modal-file-input')?.click()}
                >
                  <input
                    id="photo-modal-file-input"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  {previewURL ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <img
                        src={previewURL}
                        alt="Aperçu"
                        style={{
                          maxHeight: '140px',
                          maxWidth: '100%',
                          objectFit: 'contain',
                          borderRadius: 6,
                        }}
                      />
                      <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                        {selectedFile?.name} (cliquez pour remplacer)
                      </span>
                    </div>
                  ) : (
                    <div style={{ opacity: 0.75 }}>
                      <p style={{ margin: 0, fontWeight: 500 }}>Cliquez pour sélectionner une image</p>
                      <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>PNG, JPG, WEBP acceptés</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  Titre *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Reflets sur l'eau"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 6,
                    border: '1px solid var(--theme-elevation-200, #c9cad4)',
                    background: 'var(--theme-elevation-0, #fff)',
                    color: 'var(--theme-text, #111827)',
                    fontSize: '0.95rem',
                  }}
                  required
                />
              </div>

              {/* Caption */}
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                  Légende (facultatif)
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Description, technique ou détails..."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: 6,
                    border: '1px solid var(--theme-elevation-200, #c9cad4)',
                    background: 'var(--theme-elevation-0, #fff)',
                    color: 'var(--theme-text, #111827)',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>

              {uploadError && (
                <div
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 6,
                    background: 'var(--theme-error-100, #fee2e2)',
                    color: 'var(--theme-error-700, #991b1b)',
                    fontSize: '0.85rem',
                  }}
                >
                  {uploadError}
                </div>
              )}

              {uploadSuccess && (
                <div
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 6,
                    background: 'var(--theme-success-100, #dcfce7)',
                    color: 'var(--theme-success-700, #166534)',
                    fontSize: '0.85rem',
                  }}
                >
                  {uploadSuccess}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={uploading}
                  style={{
                    padding: '0.6rem 1.1rem',
                    borderRadius: 6,
                    border: '1px solid var(--theme-elevation-250, #c9cad4)',
                    background: 'transparent',
                    color: 'var(--theme-text, #111827)',
                    fontWeight: 500,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile || !title.trim()}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: 6,
                    border: 'none',
                    background: 'var(--theme-success-500, #2f855a)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: uploading || !selectedFile || !title.trim() ? 'not-allowed' : 'pointer',
                    opacity: uploading || !selectedFile || !title.trim() ? 0.7 : 1,
                  }}
                >
                  {uploading ? 'Téléversement en cours...' : 'Téléverser et ajouter'}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Rechercher par titre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 6,
                  border: '1px solid var(--theme-elevation-200, #c9cad4)',
                  background: 'var(--theme-elevation-0, #fff)',
                  color: 'var(--theme-text, #111827)',
                  fontSize: '0.95rem',
                }}
              />

              {linkingError && (
                <div
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 6,
                    background: 'var(--theme-error-100, #fee2e2)',
                    color: 'var(--theme-error-700, #991b1b)',
                    fontSize: '0.85rem',
                  }}
                >
                  {linkingError}
                </div>
              )}

              {loadingExisting ? (
                <p style={{ textAlign: 'center', opacity: 0.7, padding: '1rem' }}>Chargement de la bibliothèque...</p>
              ) : filteredExisting.length === 0 ? (
                <p style={{ textAlign: 'center', opacity: 0.7, padding: '1rem' }}>Aucune photo trouvée.</p>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gap: 8,
                    maxHeight: '340px',
                    overflowY: 'auto',
                    paddingRight: '4px',
                  }}
                >
                  {filteredExisting.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '0.6rem',
                        borderRadius: 6,
                        border: '1px solid var(--theme-elevation-100, #ececf0)',
                        background: p.isAssignedToThis ? 'var(--theme-elevation-50, #f8f9fa)' : 'transparent',
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 4,
                          overflow: 'hidden',
                          background: '#eee',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {p.fileURL ? (
                          <img src={p.fileURL} alt={p.title || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>Sans img</span>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title || 'Sans titre'}
                        </div>
                        {p.caption && (
                          <div style={{ fontSize: '0.8rem', opacity: 0.65, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.caption}
                          </div>
                        )}
                      </div>

                      {p.isAssignedToThis ? (
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            padding: '0.3rem 0.6rem',
                            borderRadius: 4,
                            background: 'var(--theme-elevation-100, #ececf0)',
                            color: 'var(--theme-text, #111827)',
                            opacity: 0.7,
                          }}
                        >
                          Déjà associée
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleLinkExisting(p.id)}
                          disabled={linkingId === p.id}
                          style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: 6,
                            border: '1px solid var(--theme-success-500, #2f855a)',
                            background: 'transparent',
                            color: 'var(--theme-success-600, #2f855a)',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: linkingId === p.id ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {linkingId === p.id ? 'Ajout...' : '+ Associer'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 6,
                    border: '1px solid var(--theme-elevation-250, #c9cad4)',
                    background: 'transparent',
                    color: 'var(--theme-text, #111827)',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
