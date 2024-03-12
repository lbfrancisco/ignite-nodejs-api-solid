import { it, expect, describe } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { EmailAlreadyInUseError } from './errors/email-already-in-use-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.run({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.run({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    })

    const isPasswordCorrectlyHashed = await compare(
      'password',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'john.doe@example.com'

    await registerUseCase.run({
      name: 'John Doe',
      email,
      password: 'password',
    })

    await expect(() =>
      registerUseCase.run({
        name: 'John Doe',
        email,
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError)
  })
})
