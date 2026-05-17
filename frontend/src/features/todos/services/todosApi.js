import { apiFetch } from '../../../api/client'

export async function getTodos() {
  const response = await apiFetch('/todos')

  if (!response.ok) {
    throw new Error('Failed to load todos')
  }

  const result = await response.json()
  return result.data ?? result
}

export async function getTodoById(id) {
  const response = await apiFetch(`/todos/${id}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Could not connect')
  }

  const result = await response.json()
  return result.data ?? result
}

export async function createTodo(title, description = '') {
  const response = await apiFetch('/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  })

  if (!response.ok) {
    const errorResult = await response.json().catch(() => null)
    throw new Error(errorResult?.message || 'Failed to create todo')
  }

  const result = await response.json()
  const createdTodo = result.data ?? result

  if (!createdTodo?.id || !createdTodo?.title) {
    throw new Error('Invalid todo response')
  }

  return createdTodo
}

export async function updateTodo(id, updates) {
  const response = await apiFetch(`/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const errorResult = await response.json().catch(() => null)
    throw new Error(errorResult?.message || 'Failed to update todo')
  }

  const result = await response.json()
  const updatedTodo = result.data ?? result

  if (!updatedTodo?.id || !updatedTodo?.title) {
    throw new Error('Invalid todo response')
  }

  return updatedTodo
}

export async function deleteTodo(id) {
  const response = await apiFetch(`/todos/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorResult = await response.json().catch(() => null)
    throw new Error(errorResult?.message || 'Failed to delete todo')
  }
}
