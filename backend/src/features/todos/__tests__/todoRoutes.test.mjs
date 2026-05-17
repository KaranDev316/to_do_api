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
        description: 'Practice routing, middleware, and controllers.',
        completed: false,
        createdAt: '2026-05-08T09:00:00.000Z'
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

describe('POST /todos', () => {
  it('creates a todo with description and created date', async () => {
    const response = await request(app).post('/todos').send({
      title: 'Document todo fields',
      description: 'Show description and created date in todo responses.'
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        title: 'Document todo fields',
        description: 'Show description and created date in todo responses.',
        completed: false
      }
    });
    expect(response.body.data.id).toEqual(expect.any(Number));
    expect(response.body.data.createdAt).toEqual(expect.any(String));
    expect(new Date(response.body.data.createdAt).toString()).not.toBe('Invalid Date');
  });
});

describe('PUT /todos/:id', () => {
  it('updates a todo completion status', async () => {
    const createResponse = await request(app).post('/todos').send({
      title: 'Update through PUT'
    });

    const response = await request(app)
      .put(`/todos/${createResponse.body.data.id}`)
      .send({ completed: true });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: {
        id: createResponse.body.data.id,
        title: 'Update through PUT',
        completed: true
      }
    });
  });

  it('rejects a non-boolean completed value', async () => {
    const response = await request(app).put('/todos/1').send({
      completed: 'yes'
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'Completed must be true or false'
    });
  });
});
