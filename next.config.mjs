import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    'pino', 
    'pino-pretty', 
    'lokijs', 
    'pino-elasticsearch', 
    'payload',           // <-- Indispensable
    '@payloadcms/db-mongodb', // <-- Mets ici ton adaptateur (mongodb ou postgres)
    'sharp'              // <-- Souvent la cause de problèmes d'images
  ],

  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      "pino-pretty": false,
      "lokijs": false,
      "desm": false,
      "fastbench": false,
      "pino-elasticsearch": false,
      "tap": false,
      "pino-std-serializers": false
    }

    return webpackConfig
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost"
      }
    ]
  },
  turbopack: {},
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
