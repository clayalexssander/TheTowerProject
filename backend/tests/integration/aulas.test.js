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

describe('Aulas Routes', () => {
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

  it('should list classes for a specific turma and type', async () => {
    const mockAulas = [{ id_aula: 1, tipo_aula: 'Lesson' }];
    db.query.mockResolvedValue([mockAulas]);

    const response = await request(app).get('/api/aulas/1/Lesson');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockAulas);
  });

  it('should conclude a class successfully', async () => {
    db.query.mockResolvedValue([[[{ resultado: 1 }]]]);

    const response = await request(app).put('/api/aulas/concluir/1');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Aula concluída com sucesso!');
  });
});
