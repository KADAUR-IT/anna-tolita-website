'use client'

import React from 'react'
import ReorderPhotosField from './ReorderPhotosField'

export default function ReorderProjetPhotos() {
  return (
    <ReorderPhotosField
      relationField="projet"
      orderField="orderProjet"
      endpointBase="projets"
      label="Ordre des photos du projet"
    />
  )
}
