import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search gyms', async () => {
    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: 'A TypeScript Academy',
      phone: '0 0000-0000',
      latitude: -21.8338547,
      longitude: -45.9342111,
    })

    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: 'A JavaScript Academy',
      phone: '0 0000-0000',
      latitude: -21.8338547,
      longitude: -45.9342111,
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])
  })

  it('should be able to fetch paginated gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `TypeScript Gym ${i}`,
        description: 'A TypeScript Academy',
        phone: '0 0000-0000',
        latitude: -21.8338547,
        longitude: -45.9342111,
      })
    }

    const { gyms } = await sut.execute({
      query: 'script',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'TypeScript Gym 21' }),
      expect.objectContaining({ title: 'TypeScript Gym 22' }),
    ])
  })
})
