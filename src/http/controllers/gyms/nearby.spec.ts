import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Nearby Gym',
        description: 'Some description.',
        phone: '11999999999',
        latitude: -21.8338547,
        longitude: -45.9342111,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Far Gym',
        description: 'Some description.',
        phone: '11999999999',
        latitude: -21.6738547,
        longitude: -45.9342111,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({
        latitude: -21.8338547,
        longitude: -45.9342111,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Nearby Gym',
      }),
    ])
  })
})
