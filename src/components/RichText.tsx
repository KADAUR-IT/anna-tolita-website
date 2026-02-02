import React, { ReactElement } from 'react'
import {
  RichText as RichTextConverter,
  LinkJSXConverter,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { DefaultNodeTypes, SerializedLinkNode } from '@payloadcms/richtext-lexical'

type RichTextProps = {
  data: SerializedEditorState
  className?: string
}

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { relationTo, value } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug

  switch (relationTo) {
    case 'magazines':
      return `/news`
    case 'projets':
    case 'expositions':
    case 'photos':
    case 'media':
      return `/galerie`
    default:
      return `/${slug}`
  }
}

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
})

export default function RichText({ data, className }: RichTextProps): ReactElement {
  return (
    <RichTextConverter
      data={data}
      converters={jsxConverters}
      className={`payload-richtext ${className}`}
    />
  )
}
