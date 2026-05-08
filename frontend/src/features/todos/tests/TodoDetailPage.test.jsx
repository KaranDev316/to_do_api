import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../../App'

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

describe('TodoDetailPage', () => {
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
