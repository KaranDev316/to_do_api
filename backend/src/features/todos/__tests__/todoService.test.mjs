import { describe, expect, it } from 'vitest';
import todoService from '../services/todoService.js';

describe('todoService', () => {
  it('creates a todo with description, created date, and a default incomplete status', async () => {
    const todo = await todoService.createTodo({
      title: 'Service test todo',
      description: 'Created through the service layer'
    });

    expect(todo).toMatchObject({
      title: 'Service test todo',
      description: 'Created through the service layer',
      completed: false
    });
    expect(todo.id).toEqual(expect.any(Number));
    expect(todo.createdAt).toEqual(expect.any(String));
    expect(new Date(todo.createdAt).toString()).not.toBe('Invalid Date');
  });

  it('toggles a todo complete status', async () => {
    const todo = await todoService.createTodo({ title: 'Toggle me' });
    const updatedTodo = await todoService.toggleTodoComplete(todo.id);

    expect(updatedTodo).toMatchObject({
      id: todo.id,
      title: 'Toggle me',
      description: '',
      completed: true
    });
    expect(updatedTodo.createdAt).toBe(todo.createdAt);
  });

  it('updates a todo complete status directly', async () => {
    const todo = await todoService.createTodo({ title: 'Update me' });
    const updatedTodo = await todoService.updateTodo(todo.id, {
      completed: true
    });

    expect(updatedTodo).toMatchObject({
      id: todo.id,
      title: 'Update me',
      completed: true
    });
    expect(updatedTodo.createdAt).toBe(todo.createdAt);
  });
});
