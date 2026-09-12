import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TaskInput } from './TaskInput'

describe('TaskInput', () => {
  it('llama a onAddTask con el texto escrito por el usuario', async () => {
    // Arrange
    const onAddTask = vi.fn()
    render(<TaskInput onAddTask={onAddTask} />)
    const usuario = userEvent.setup()

    // Act
    const input = screen.getByPlaceholderText('What needs to be done?')
    await usuario.type(input, 'Comprar pan')
    await usuario.click(screen.getByText('Add Task'))

    // Assert
    expect(onAddTask).toHaveBeenCalledWith('Comprar pan')
  })

  it('no llama a onAddTask si el campo está vacío', async () => {
    const onAddTask = vi.fn()
    render(<TaskInput onAddTask={onAddTask} />)
    const usuario = userEvent.setup()

    await usuario.click(screen.getByText('Add Task'))

    expect(onAddTask).not.toHaveBeenCalled()
  })
})
