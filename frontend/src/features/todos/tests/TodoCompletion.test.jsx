import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../../App'

const todos = [
  {
    id: 1,
    title: 'Optimistic todo',
    description: 'Updates before the server answers',
    completed: false,
  },
]

function okJson(data) {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      success: true,
      data,
    }),
  }
}

function renderTodoListRoute() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

describe('Todo completion updates', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('updates optimistically and replaces the todo with the server response', async () => {
    let resolveUpdate
    globalThis.fetch
      .mockResolvedValueOnce(okJson(todos))
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveUpdate = resolve
        }),
      )

    renderTodoListRoute()
    await screen.findByText('Optimistic todo')

    fireEvent.click(screen.getByRole('button', { name: 'Mark complete: Optimistic todo' }))

    expect(screen.getByText('Optimistic todo')).toHaveClass('line-through')
    expect(globalThis.fetch).toHaveBeenLastCalledWith('/todos/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: true }),
    })

    await act(async () => {
      resolveUpdate(
        okJson({
          ...todos[0],
          title: 'Server-confirmed todo',
          completed: true,
        }),
      )
    })

    expect(screen.getByText('Server-confirmed todo')).toHaveClass('line-through')
  })

  it('rolls back the optimistic update when the request fails', async () => {
    let rejectUpdate
    globalThis.fetch
      .mockResolvedValueOnce(okJson(todos))
      .mockReturnValueOnce(
        new Promise((_, reject) => {
          rejectUpdate = reject
        }),
      )

    renderTodoListRoute()
    await screen.findByText('Optimistic todo')

    fireEvent.click(screen.getByRole('button', { name: 'Mark complete: Optimistic todo' }))

    expect(screen.getByText('Optimistic todo')).toHaveClass('line-through')

    await act(async () => {
      rejectUpdate(new Error('Network error'))
    })

    expect(console.error).toHaveBeenCalledWith(
      'Failed to update todo completion:',
      expect.any(Error),
    )
    expect(screen.getByText('Optimistic todo')).not.toHaveClass('line-through')
  })

  it('disables the toggle and avoids duplicate requests while an update is pending', async () => {
    let resolveUpdate
    globalThis.fetch
      .mockResolvedValueOnce(okJson(todos))
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveUpdate = resolve
        }),
      )

    renderTodoListRoute()
    await screen.findByText('Optimistic todo')

    fireEvent.click(screen.getByRole('button', { name: 'Mark complete: Optimistic todo' }))
    fireEvent.click(screen.getByRole('button', { name: 'Updating Optimistic todo' }))

    expect(screen.getByRole('button', { name: 'Updating Optimistic todo' })).toBeDisabled()
    expect(globalThis.fetch).toHaveBeenCalledTimes(2)
    expect(globalThis.fetch).toHaveBeenLastCalledWith('/todos/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: true }),
    })

    await act(async () => {
      resolveUpdate(
        okJson({
          ...todos[0],
          completed: true,
        }),
      )
    })

    expect(
      screen.getByRole('button', { name: 'Mark incomplete: Optimistic todo' }),
    ).not.toBeDisabled()
    expect(screen.getByText('Optimistic todo')).toHaveClass('line-through')
  })
})
