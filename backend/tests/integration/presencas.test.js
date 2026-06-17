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

describe('Presencas Routes', () => {
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

  it('should list attendances for a class', async () => {
    const mockAttendances = [{ id_aluno: 1, presente: 1 }];
    db.query.mockResolvedValue([[mockAttendances]]);

    const response = await request(app).get('/api/presencas/1');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockAttendances);
  });

  it('should register attendance successfully', async () => {
    db.query.mockResolvedValue([[[{ resultado: 1 }]]]);

    const response = await request(app)
      .post('/api/presencas/registrar')
      .send({ idAluno: 1, idAula: 1, presente: 1 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should conclude conversation class successfully', async () => {
    db.query.mockResolvedValue([[[{ resultado: 1, id_aula: 5 }]]]);

    const response = await request(app).post('/api/presencas/concluir/conversacao/1');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.id_aula).toBe(5);
  });
});
