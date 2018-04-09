import request from 'supertest';
import getApp from '..';

describe('requests', () => {
  let server;

  beforeAll(() => {
    server = getApp().listen();
  });

  test('GET 200', async () => {
    const res = await request(server).get('/');
    expect(res.statusCode).toBe(200);
  });

  afterAll(async () => {
    await server.close();
  });
});
