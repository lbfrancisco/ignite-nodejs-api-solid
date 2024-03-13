import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'A Nearby Academy',
      phone: '0 0000-0000',
      latitude: -21.8338547,
      longitude: -45.9342111,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'A Far Academy',
      phone: '0 0000-0000',
      latitude: -21.6738547,
      longitude: -45.9342111,
    })

    const { gyms } = await sut.execute({
      userLatitude: -21.8338547,
      userLongitude: -45.9342111,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
