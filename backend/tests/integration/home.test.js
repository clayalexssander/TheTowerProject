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

describe('Home Routes', () => {
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

  it('should get schedule successfully', async () => {
    const mockSchedule = [{ id_aula: 1, nome_turma: 'Turma A' }];
    db.query.mockResolvedValue([mockSchedule]);

    const response = await request(app).get('/api/home/agenda');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockSchedule);
  });
});
