const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../server');

const testPhotoPath = path.join(__dirname, 'daa7a739-b0b3-4ed7-b4f3-6f4f1f9e6256.png');
const basicAuth = 'Basic ' + Buffer.from('admin:admin123').toString('base64');

let createdId;

// Устанавливаем тестовое окружение
process.env.NODE_ENV = 'test';

describe('Colleagues API', () => {
  // Ждем инициализации БД
  beforeAll((done) => {
    setTimeout(done, 1000);
  });

  it('POST /api/colleagues — добавляет сотрудника с фото', async () => {
    const res = await request(app)
      .post('/api/colleagues')
      .set('Authorization', basicAuth)
      .field('name', 'Тестовый Сотрудник')
      .field('position', 'Тестировщик')
      .field('department', 'QA')
      .field('email', 'test@company.com')
      .field('phone', '+79001234567')
      .field('hire_date', '2023-01-15')
      .field('salary', '75000')
      .field('notes', 'Отличный тестировщик')
      .attach('photo', testPhotoPath);
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'Тестовый Сотрудник');
    expect(res.body).toHaveProperty('photo_url');
    expect(res.body.photo_url).toContain('/static/');
    createdId = res.body.id;
  }, 15000);

  it('GET /api/colleagues — возвращает список сотрудников', async () => {
    const res = await request(app).get('/api/colleagues');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/colleagues/:id — возвращает сотрудника по id', async () => {
    const res = await request(app).get(`/api/colleagues/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdId);
    expect(res.body).toHaveProperty('name', 'Тестовый Сотрудник');
    expect(res.body).toHaveProperty('photo_url');
  });

  it('PUT /api/colleagues/:id — обновляет сотрудника', async () => {
    const res = await request(app)
      .put(`/api/colleagues/${createdId}`)
      .set('Authorization', basicAuth)
      .field('name', 'Обновленный Сотрудник')
      .field('position', 'Старший Тестировщик')
      .field('salary', '85000');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Обновленный Сотрудник');
    expect(res.body).toHaveProperty('position', 'Старший Тестировщик');
  });

  it('DELETE /api/colleagues/:id — удаляет сотрудника', async () => {
    const res = await request(app)
      .delete(`/api/colleagues/${createdId}`)
      .set('Authorization', basicAuth);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Colleague deleted successfully');
  });

  it('GET /api/colleagues/:id — возвращает 404 для несуществующего id', async () => {
    const res = await request(app).get('/api/colleagues/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Colleague not found');
  });

  it('POST /api/colleagues — требует аутентификации', async () => {
    const res = await request(app)
      .post('/api/colleagues')
      .field('name', 'Без Аутентификации');
    expect(res.statusCode).toBe(401);
  });
}); 