import { Photo } from '@/payload-types'
import { ImageRepository } from '../repository/ImageRepository'

type ImageCacheEntry<T> = {
  value: T
  expiresAt: number
}

export class ImageCacheProxy implements ImageRepository {
  private cache = new Map<string, ImageCacheEntry<Photo>>()
  private filterCache = new Map<string, ImageCacheEntry<Photo[]>>()
  private allPhotosCache: ImageCacheEntry<Photo[]> | null = null

  constructor(
    private target: ImageRepository,
    private ttlMs = 5 * 60 * 1000,
  ) {}

  private isExpired<T>(entry: ImageCacheEntry<T> | null | undefined): boolean {
    return !entry || Date.now() > entry.expiresAt
  }
  private createEntry<T>(value: T): ImageCacheEntry<T> {
    return { value, expiresAt: Date.now() + this.ttlMs }
  }

  async findById(id: string): Promise<Photo> {
    const entry = this.cache.get(id)
    if (entry && !this.isExpired(entry)) return entry.value
    if (entry && this.isExpired(entry)) this.cache.delete(id)

    const photo = await this.target.findById(id)
    if (photo) this.cache.set(id, this.createEntry(photo))
    return photo
  }

  async findAll(): Promise<Photo[]> {
    const entry = this.allPhotosCache
    if (entry && !this.isExpired(entry)) return entry.value
    if (entry && this.isExpired(entry)) this.allPhotosCache = null

    const photos = await this.target.findAll()
    if (photos) this.allPhotosCache = this.createEntry(photos)
    return photos
  }

  async findByFilter(filter: string): Promise<Photo[]> {
    const entry = this.filterCache.get(filter)
    if (entry && !this.isExpired(entry)) return entry.value
    if (entry && this.isExpired(entry)) this.filterCache.delete(filter)

    const photos = await this.target.findByFilter(filter)
    if (photos) this.filterCache.set(filter, this.createEntry(photos))
    return photos
  }
}
