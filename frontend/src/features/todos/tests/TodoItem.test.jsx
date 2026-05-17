import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import TodoItem from '../components/TodoItem'

describe('TodoItem', () => {
  it('toggles completed state immediately and emits the next value', () => {
    const onToggle = vi.fn()

    render(
      <TodoItem
        todo={{
          id: 7,
          title: 'Toggle me',
          description: 'Check the local UI state',
          completed: false,
        }}
        onDelete={vi.fn()}
        onToggle={onToggle}
        isDeleting={false}
      />,
    )

    const toggleButton = screen.getByRole('button', {
      name: 'Mark complete: Toggle me',
    })
    const title = screen.getByText('Toggle me')

    fireEvent.click(toggleButton)

    expect(onToggle).toHaveBeenCalledWith(7, true)
    expect(title).toHaveClass('line-through')
    expect(
      screen.getByRole('button', { name: 'Mark incomplete: Toggle me' }),
    ).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Mark incomplete: Toggle me' }))

    expect(onToggle).toHaveBeenLastCalledWith(7, false)
    expect(title).not.toHaveClass('line-through')
  })
})
