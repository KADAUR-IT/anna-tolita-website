// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { CV } from './globals/CV'
import { Expositions } from './collections/Expositions'
import { Projets } from './collections/Projets'
import { News } from './collections/News'
import { Magazine } from './collections/Magazine'
import { Photos } from './collections/Photos'
import { Logo } from './components/constants/Logo'
import { Icon } from './components/constants/Icon'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta:
    {
      icons: {
        icon: '/assets/icon/favicon.ico',
        apple: '/assets/icon/apple-touch-icon.png',
      },
    },
    components:
    {
      graphics:
      {
        // @ts-ignore: Type '() => React.JSX.Element' is not assignable to type 'CustomComponent<Record<string, any>> | undefined'.
        Logo,
        // @ts-ignore: Type '() => React.JSX.Element' is not assignable to type 'CustomComponent<Record<string, any>> | undefined'.
        Icon
      }
    }
  },
  collections: [Users, Media, Expositions, Projets, News, Magazine, Photos],
  globals: [CV],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || ''
    }),
    // storage-adapter-placeholder
  ],
  email: nodemailerAdapter({
    defaultFromAddress: "hello@kadaur.com",
    defaultFromName: "KADAUR",
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    }
  }),
})
