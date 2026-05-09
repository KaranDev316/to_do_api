import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AddTodo from '../components/AddTodo'
import { useCreateTodo } from '../hooks/useCreateTodo'

function AddTodoHarness({ onTodoCreated }) {
  const form = useCreateTodo(onTodoCreated)

  return (
    <AddTodo
      title={form.title}
      description={form.description}
      isSubmitting={form.isSubmitting}
      apiError={form.apiError}
      maxTitleLength={form.maxTitleLength}
      maxDescriptionLength={form.maxDescriptionLength}
      isSubmitDisabled={form.isSubmitDisabled}
      showValidationError={form.showValidationError}
      validationError={form.validationError}
      onChange={form.handleChange}
      onDescriptionChange={form.handleDescriptionChange}
      onSubmit={form.handleSubmit}
      onBlur={form.handleBlur}
    />
  )
}

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

    render(<AddTodoHarness onTodoCreated={onTodoCreated} />)

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
        description: '',
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
      description: 'Remember oat milk',
      createdAt: '2026-05-09T10:00:00.000Z',
    }

    globalThis.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        success: true,
        data: createdTodo,
      }),
    })

    render(<AddTodoHarness onTodoCreated={onTodoCreated} />)

    const input = screen.getByLabelText('Todo title')
    const description = screen.getByLabelText('Description')
    const form = input.closest('form')

    await act(async () => {
      fireEvent.change(input, { target: { value: '  Buy milk  ' } })
      fireEvent.change(description, { target: { value: '  Remember oat milk  ' } })
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
        description: 'Remember oat milk',
      }),
    })
    expect(onTodoCreated).toHaveBeenCalledTimes(1)
    expect(onTodoCreated).toHaveBeenCalledWith(createdTodo)
    expect(input).toHaveValue('')
    expect(description).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Add Todo' })).toBeDisabled()
  })
})
