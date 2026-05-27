import type { Payload } from 'payload'
import { ImageCacheProxy } from '../proxy/ImageCache'
import { PayloadImageRepository } from '../repository/ImageRepository'

class ImageHandler {
  private static instance: ImageHandler | null = null
  private imageRepo: PayloadImageRepository
  private imageCache: ImageCacheProxy

  private constructor(payload: Payload) {
    this.imageRepo = new PayloadImageRepository(payload)
    this.imageCache = new ImageCacheProxy(this.imageRepo)
  }

  static getInstance(payload: Payload): ImageHandler {
    if (!ImageHandler.instance) {
      ImageHandler.instance = new ImageHandler(payload)
    }

    return ImageHandler.instance
  }

  getCache(): ImageCacheProxy {
    return this.imageCache
  }

  getRepository(): PayloadImageRepository {
    return this.imageRepo
  }
}

export default ImageHandler
