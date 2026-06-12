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

describe('Dashboard Routes', () => {
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

  it('should get class ranking by frequency', async () => {
    const mockRanking = [{ nome_turma: 'Turma A', freq_media: 95 }];
    db.query.mockResolvedValue([mockRanking]);

    const response = await request(app).get('/api/dashboard/ranking-turmas');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockRanking);
  });

  it('should get temporal progress', async () => {
    const mockProgress = [{ ano: 2026, mes: 6, progresso: 80 }];
    db.query.mockResolvedValue([mockProgress]);

    const response = await request(app).get('/api/dashboard/progresso-temporal');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockProgress);
  });

  it('should get retention rate', async () => {
    db.query.mockResolvedValue([[]]);
    const response = await request(app).get('/api/dashboard/taxa-retencao');
    expect(response.status).toBe(200);
  });

  it('should get turmas needing attention', async () => {
    db.query.mockResolvedValue([[]]);
    const response = await request(app).get('/api/dashboard/turmas-atencao');
    expect(response.status).toBe(200);
  });

  it('should get evasion prediction', async () => {
    db.query.mockResolvedValue([[]]);
    const response = await request(app).get('/api/dashboard/previsao-evasao');
    expect(response.status).toBe(200);
  });

  it('should get exit timeline', async () => {
    db.query.mockResolvedValue([[]]);
    const response = await request(app).get('/api/dashboard/linha-tempo-saidas');
    expect(response.status).toBe(200);
  });
});
