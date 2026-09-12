/// <reference types="vitest/globals" />
import request from 'supertest'
import app from '../src/app'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const EMAIL_VALIDO = 'test-bug3-supertest-valido@example.invalid'
const EMAIL_LIMITE = 'test-bug3-supertest-limite@example.invalid'

describe('POST /register', () => {
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [EMAIL_VALIDO, EMAIL_LIMITE] } },
    })
    await prisma.$disconnect()
  })

  it('registra un usuario cuando el nombre es válido', async () => {
    // Arrange / Act
    const res = await request(app)
      .post('/register')
      .send({ name: 'Ana', email: EMAIL_VALIDO, password: 'secreta123' })

    // Assert
    expect(res.status).toBe(201)
  })

  it('rechaza el registro si el nombre está vacío o solo tiene espacios', async () => {
    // Arrange / Act
    const res = await request(app)
      .post('/register')
      .send({ name: '   ', email: EMAIL_LIMITE, password: 'secreta123' })

    // Assert
    expect(res.status).toBe(400)
  })
})
