import { describe, it, expect } from 'vitest'
import { maxId } from './TaskUtil'
import type { Task } from './TaskUtil'

describe('maxId', () => {
  it('devuelve el id más alto de una lista de tareas', () => {
    // Arrange
    const tareas: Task[] = [
      { id: 1, text: 'a', completed: false },
      { id: 5, text: 'b', completed: true },
      { id: 3, text: 'c', completed: false },
    ]
    // Act
    const resultado = maxId(tareas)
    // Assert
    expect(resultado).toBe(5)
  })

  it('devuelve 0 cuando la lista está vacía', () => {
    const tareas: Task[] = []
    const resultado = maxId(tareas)
    expect(resultado).toBe(0)
  })
})
