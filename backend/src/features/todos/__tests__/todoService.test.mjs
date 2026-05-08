import { describe, expect, it } from 'vitest';
import todoService from '../services/todoService.js';

describe('todoService', () => {
  it('creates a todo with a default incomplete status', async () => {
    const todo = await todoService.createTodo({ title: 'Service test todo' });

    expect(todo).toMatchObject({
      title: 'Service test todo',
      completed: false
    });
    expect(todo.id).toEqual(expect.any(Number));
  });

  it('toggles a todo complete status', async () => {
    const todo = await todoService.createTodo({ title: 'Toggle me' });
    const updatedTodo = await todoService.toggleTodoComplete(todo.id);

    expect(updatedTodo).toMatchObject({
      id: todo.id,
      title: 'Toggle me',
      completed: true
    });
  });
});
