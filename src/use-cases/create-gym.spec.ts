import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a new gym', async () => {
    const { gym } = await sut.execute({
      title: 'TypeScript Gym',
      description: 'A TypeScript Academy',
      phone: '0 0000-0000',
      latitude: -21.8338547,
      longitude: -45.9342111,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
