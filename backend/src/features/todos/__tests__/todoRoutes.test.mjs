import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../../app.js';

describe('GET /todos/:id', () => {
  it('returns a todo for an existing ID', async () => {
    const response = await request(app).get('/todos/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        id: 1,
        title: 'Learn Express',
        completed: false
      }
    });
  });

  it('returns 404 when the todo does not exist', async () => {
    const response = await request(app).get('/todos/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: 'Todo not found'
    });
  });
});
