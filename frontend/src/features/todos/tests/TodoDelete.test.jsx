import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../../App'

const todos = [
  {
    id: 1,
    title: 'Write delete tests',
    completed: false,
  },
  {
    id: 2,
    title: 'Keep visible todo',
    completed: true,
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

async function renderLoadedList(list = todos) {
  globalThis.fetch.mockResolvedValueOnce(okJson(list))

  renderTodoListRoute()

  await screen.findByText(list[0].title)
}

describe('Todo delete', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn()
    vi.spyOn(window, 'confirm')
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('confirms deletion, removes the todo immediately, and shows no success error', async () => {
    let resolveDelete
    globalThis.fetch
      .mockResolvedValueOnce(okJson(todos))
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveDelete = resolve
        }),
      )
    window.confirm.mockReturnValue(true)

    renderTodoListRoute()
    await screen.findByText('Write delete tests')

    fireEvent.click(screen.getByRole('button', { name: 'Delete todo: Write delete tests' }))

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete "Write delete tests"?',
    )
    expect(globalThis.fetch).toHaveBeenCalledWith('/todos/1', {
      method: 'DELETE',
    })
    expect(screen.queryByText('Write delete tests')).not.toBeInTheDocument()

    await act(async () => {
      resolveDelete({ ok: true, status: 204, json: async () => ({}) })
    })

    expect(screen.queryByText(/Unable to delete/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Invalid todo/i)).not.toBeInTheDocument()
  })

  it('keeps the todo and sends no DELETE request when deletion is canceled', async () => {
    await renderLoadedList()
    window.confirm.mockReturnValue(false)

    fireEvent.click(screen.getByRole('button', { name: 'Delete todo: Write delete tests' }))

    expect(window.confirm).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Write delete tests')).toBeInTheDocument()
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })

  it('shows a friendly validation error and keeps the list unchanged for an invalid id', async () => {
    const invalidTodos = [
      {
        id: null,
        title: 'Invalid id todo',
        completed: false,
      },
    ]

    await renderLoadedList(invalidTodos)
    window.confirm.mockReturnValue(true)

    fireEvent.click(screen.getByRole('button', { name: 'Delete todo: Invalid id todo' }))

    expect(screen.getByText('Invalid todo selected for deletion.')).toBeInTheDocument()
    expect(screen.getByText('Invalid id todo')).toBeInTheDocument()
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })

  it('restores the todo, shows an error, and re-enables delete after a DELETE failure', async () => {
    let rejectDelete
    globalThis.fetch
      .mockResolvedValueOnce(okJson(todos))
      .mockReturnValueOnce(
        new Promise((_, reject) => {
          rejectDelete = reject
        }),
      )
    window.confirm.mockReturnValue(true)

    renderTodoListRoute()
    await screen.findByText('Write delete tests')

    fireEvent.click(screen.getByRole('button', { name: 'Delete todo: Write delete tests' }))

    expect(screen.queryByText('Write delete tests')).not.toBeInTheDocument()

    await act(async () => {
      rejectDelete(new Error('Network error'))
    })

    expect(
      screen.getByText('Unable to delete the todo. Please check your connection and try again.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Write delete tests')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Delete todo: Write delete tests' }),
    ).not.toBeDisabled()
  })

  it('blocks duplicate rapid delete requests for the same todo', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(okJson(todos))
      .mockReturnValueOnce(new Promise(() => {}))
    window.confirm.mockReturnValue(true)

    renderTodoListRoute()
    await screen.findByText('Write delete tests')

    const deleteButton = screen.getByRole('button', {
      name: 'Delete todo: Write delete tests',
    })

    fireEvent.click(deleteButton)
    fireEvent.click(deleteButton)

    expect(globalThis.fetch).toHaveBeenCalledTimes(2)
    expect(globalThis.fetch).toHaveBeenLastCalledWith('/todos/1', {
      method: 'DELETE',
    })
    expect(screen.queryByText('Write delete tests')).not.toBeInTheDocument()
    expect(screen.getByText('Keep visible todo')).toBeInTheDocument()
  })

  it('preserves navigation from the todo link while delete clicks stay on the list', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(okJson(todos))
      .mockResolvedValueOnce(okJson({ ...todos[0], description: 'Details' }))
    window.confirm.mockReturnValue(false)

    renderTodoListRoute()
    await screen.findByText('Write delete tests')

    fireEvent.click(screen.getByRole('button', { name: 'Delete todo: Write delete tests' }))

    expect(screen.getByText('Write delete tests')).toBeInTheDocument()
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByText('Write delete tests'))

    expect(screen.getByText('Loading todo...')).toBeInTheDocument()
  })
})
