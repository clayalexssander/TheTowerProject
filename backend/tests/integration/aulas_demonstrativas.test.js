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

describe('Aulas Demonstrativas Routes', () => {
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

  it('should list active demo classes', async () => {
    const mockAulas = [{ id: 1, nome: 'John Doe', data: '2026-06-10', horario: '15:00:00' }];
    db.query.mockResolvedValue([mockAulas]);

    const response = await request(app).get('/api/aula-demonstrativas/listar');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAulas);
    expect(db.query).toHaveBeenCalledWith('select * from vw_aulas_demonstrativas_marcadas;');
  });

  it('should schedule a demo class successfully', async () => {
    db.query.mockResolvedValue([[[{ resultado: 1 }]]]);

    const response = await request(app)
      .post('/api/aula-demonstrativas/marcar')
      .send({ nome: 'John', email: 'john@example.com', data: '2026-06-10', horario: '15:00' });

    expect(response.status).toBe(200);
    expect(db.query).toHaveBeenCalled();
  });

  it('should cancel a demo class', async () => {
    db.query.mockResolvedValue([[[{ resultado: 1 }]]]);

    const response = await request(app).put('/api/aula-demonstrativas/cancelar/1');

    expect(response.status).toBe(200);
    expect(db.query).toHaveBeenCalledWith('CALL sp_cancela_aula_demostrativa(?);', ['1']);
  });

  it('should confirm enrollment for a demo class', async () => {
    db.query.mockResolvedValue([[[{ resultado: 1 }]]]);

    const response = await request(app).put('/api/aula-demonstrativas/confirmar/1');

    expect(response.status).toBe(200);
    expect(db.query).toHaveBeenCalledWith('CALL sp_cofirma_matricula(?);', ['1']);
  });
});
