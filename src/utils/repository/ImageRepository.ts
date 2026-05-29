import { Media, Photo } from '@/payload-types'
import payloadConfig from '@/payload.config'
import { getPayload, Payload } from 'payload'

export interface ImageRepository {
  findById(id: string): Promise<Photo>
  findAll(): Promise<Photo[]>
  findByFilter(filter: string): Promise<Photo[]>
}

export class PayloadImageRepository implements ImageRepository {
  private payload

  constructor(payload: Payload) {
    this.payload = payload
  }

  async findById(id: string): Promise<Photo> {
    const res = await this.payload.findByID({
      collection: 'photos',
      id: id,
    })

    return res
  }

  async findAll(): Promise<Photo[]> {
    const res = await this.payload.find({
      collection: 'photos',
    })

    return res.docs || []
  }

  async findByFilter(filter: string): Promise<Photo[]> {
    const res = await this.payload.find({
      collection: 'photos',
      limit: 0,
      where: {
        or: [{ projet: { equals: filter } }, { exposition: { equals: filter } }],
      },
    })

    return res.docs || []
  }
}
