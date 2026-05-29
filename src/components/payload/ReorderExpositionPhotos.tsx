'use client'

import React from 'react'
import ReorderPhotosField from './ReorderPhotosField'

export default function ReorderExpositionPhotos() {
  return (
    <ReorderPhotosField
      relationField="exposition"
      orderField="orderExposition"
      endpointBase="expositions"
      label="Ordre des photos de l'exposition"
    />
  )
}
