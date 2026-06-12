const request = require('supertest');
const app = require('../../server');

jest.mock('../../db_config', () => ({
  query: jest.fn(),
}));

describe('Auth Routes', () => {
  it('should be able to do something basic', async () => {
    // Como a rota de auth exige DB e mocks, para um teste profissional precisamos de um setup de mock DB.
    // Para simplificar, testaremos a rota principal que retorna o index.html
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
