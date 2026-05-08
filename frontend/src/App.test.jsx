import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import AddTodo from './components/AddTodo'

function renderTodoDetailRoute() {
  return render(
    <MemoryRouter initialEntries={['/todos/1']}>
      <App />
    </MemoryRouter>,
  )
}

async function finishSimulatedDelay() {
  await act(async () => {
    vi.advanceTimersByTime(1200)
  })
}

describe('TodoDetail', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders loading state on mount', () => {
    globalThis.fetch.mockReturnValue(new Promise(() => {}))

    renderTodoDetailRoute()

    expect(screen.getByText('Loading todo...')).toBeInTheDocument()
  })

  it('renders todo data after a successful fetch', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          id: 1,
          title: 'Write tests',
          description: 'Cover the todo detail route',
          completed: false,
          createdAt: '2026-05-08T00:00:00.000Z',
        },
      }),
    })

    renderTodoDetailRoute()
    await finishSimulatedDelay()

    expect(screen.getByText('Write tests')).toBeInTheDocument()
    expect(screen.getByText('Cover the todo detail route')).toBeInTheDocument()
    expect(screen.getByText('Not completed')).toBeInTheDocument()
    expect(screen.getByText('5/8/2026')).toBeInTheDocument()
  })

  it('renders an error message on a 404 response', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({
        success: false,
        message: 'Todo not found',
      }),
    })

    renderTodoDetailRoute()
    await finishSimulatedDelay()

    expect(
      screen.getByText("This todo doesn't exist or was deleted"),
    ).toBeInTheDocument()
  })
})

describe('AddTodo', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('prevents duplicate rapid submits while creating a todo', () => {
    const onTodoCreated = vi.fn()
    globalThis.fetch.mockReturnValue(new Promise(() => {}))

    render(<AddTodo onTodoCreated={onTodoCreated} />)

    const input = screen.getByLabelText('Todo title')
    const button = screen.getByRole('button', { name: 'Add Todo' })
    const form = input.closest('form')

    fireEvent.change(input, { target: { value: 'Buy milk' } })
    fireEvent.submit(form)
    fireEvent.submit(form)
    fireEvent.submit(form)

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    expect(globalThis.fetch).toHaveBeenCalledWith('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Buy milk',
      }),
    })
    expect(button).toBeDisabled()
    expect(input).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Adding...' })).toBeInTheDocument()
    expect(onTodoCreated).not.toHaveBeenCalled()
  })

  it('creates a todo successfully and resets the form', async () => {
    const onTodoCreated = vi.fn()
    const createdTodo = {
      id: 3,
      title: 'Buy milk',
      completed: false,
    }

    globalThis.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        success: true,
        data: createdTodo,
      }),
    })

    render(<AddTodo onTodoCreated={onTodoCreated} />)

    const input = screen.getByLabelText('Todo title')
    const form = input.closest('form')

    await act(async () => {
      fireEvent.change(input, { target: { value: '  Buy milk  ' } })
    })

    await act(async () => {
      fireEvent.submit(form)
    })

    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
    expect(globalThis.fetch).toHaveBeenCalledWith('/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Buy milk',
      }),
    })
    expect(onTodoCreated).toHaveBeenCalledTimes(1)
    expect(onTodoCreated).toHaveBeenCalledWith(createdTodo)
    expect(input).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Add Todo' })).toBeDisabled()
  })
})
