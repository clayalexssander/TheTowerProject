const request = require('supertest');
const app = require('../../server');
const db = require('../../db_config');

jest.mock('../../middlewares/auth', () => ({
  getSession: jest.fn(() => true),
  requireAuth: jest.fn((req, res, next) => next()),
}));

jest.mock('../../db_config', () => ({
  query: jest.fn(),
}));

describe('Financas Routes', () => {
  let consoleErrorSpy;
  let consoleLogSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list monthly fees successfully', async () => {
    const mockFees = [{ id_mensalidade: 1, tipo: 'Mensal', valor: 150 }];
    db.query.mockResolvedValue([mockFees]);

    const response = await request(app).get('/api/financas/mensalidades');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockFees);
  });

  it('should register payment successfully', async () => {
    db.query.mockResolvedValue([[[{ resultado: 1 }]]]);

    const response = await request(app)
      .post('/api/financas/pagamento')
      .send({ email_aluno: 'student@example.com', id_mensalidade: 1 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.code).toBe(1);
  });

  it('should return error for missing payment fields', async () => {
    const response = await request(app)
      .post('/api/financas/pagamento')
      .send({ email_aluno: 'student@example.com' });

    expect(response.status).toBe(400);
  });

  it('should get revenue projection', async () => {
    db.query.mockResolvedValue([[]]);
    const response = await request(app).get('/api/financas/projecao');
    expect(response.status).toBe(200);
  });

  it('should get seasonal trend', async () => {
    db.query.mockResolvedValue([[]]);
    const response = await request(app).get('/api/financas/tendencia');
    expect(response.status).toBe(200);
  });

  it('should get students LTV', async () => {
    db.query.mockResolvedValue([[]]);
    const response = await request(app).get('/api/financas/ltv');
    expect(response.status).toBe(200);
  });

  it('should get 3-month forecast', async () => {
    db.query.mockResolvedValue([[]]);
    const response = await request(app).get('/api/financas/prev3');
    expect(response.status).toBe(200);
  });

  it('should get scholarship impact', async () => {
    db.query.mockResolvedValue([[]]);
    const response = await request(app).get('/api/financas/impacto_bolsistas');
    expect(response.status).toBe(200);
  });

  it('should get defaulters', async () => {
    db.query.mockResolvedValue([[]]);
    const response = await request(app).get('/api/financas/inadimplentes');
    expect(response.status).toBe(200);
  });

  it('should get enrollment seasonality', async () => {
    db.query.mockResolvedValue([[]]);
    const response = await request(app).get('/api/financas/sazonalidade');
    expect(response.status).toBe(200);
  });

  it('should get who did not pay current month', async () => {
    db.query.mockResolvedValue([[]]);
    const response = await request(app).get('/api/financas/nao_pagaram_mes_atual');
    expect(response.status).toBe(200);
  });
});
