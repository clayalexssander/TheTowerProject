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

describe('Alunos Routes', () => {
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

  it('should search students by name', async () => {
    const mockAlunos = [{ id: 1, nome: 'Alice' }];
    db.query.mockResolvedValue([[mockAlunos]]);

    const response = await request(app).get('/api/alunos/pesquisar/Alice');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockAlunos);
  });

  it('should enroll a student successfully', async () => {
    db.query.mockResolvedValue([[[{ resultado: 1 }]]]);

    const response = await request(app)
      .post('/api/alunos/matricular')
      .send({
        nome: 'Alice',
        email: 'alice@example.com',
        cidade: 'Natal',
        bolsista: 'Não',
        nivel: 'Básico',
        telefone: '123456789',
        tipo_bancaria: 'PIX',
        id_turma: 1
      });

    expect(response.status).toBe(201);
    expect(response.body.resultado).toBe(1);
  });

  it('should fail to enroll with missing fields', async () => {
    const response = await request(app)
      .post('/api/alunos/matricular')
      .send({ nome: 'Alice' });

    expect(response.status).toBe(400);
  });
});
