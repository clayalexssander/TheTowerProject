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

describe('Turmas Routes', () => {
  let consoleErrorSpy;
  let consoleLogSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list all turmas successfully', async () => {
    const mockTurmas = [
      { id_turma: 1, nome_turma: 'Turma A', dias_semana: 'Seg/Qua', horario: '14:00' }
    ];
    db.query.mockResolvedValue([[mockTurmas]]);

    const response = await request(app).get('/api/turmas/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTurmas); // O backend pode estar retornando diretamente o array ou num objeto {success, data}
    // Considerando o comportamento padrão do db.query
    expect(db.query).toHaveBeenCalled();
  });

  it('should insert a new turma successfully', async () => {
    // Simulando sucesso na procedure
    db.query.mockResolvedValue([[[{ resultado: 1 }]]]);

    const response = await request(app)
      .post('/api/turmas/')
      .send({
        nome_turma: 'Turma B',
        dia_semana: 'sexta-feira',
        hora_inicio: '10:00',
        hora_fim: '12:00'
      });

    // Como o endpoint existe mas não temos certeza do body de retorno, validamos o mock
    expect(response.status).toBe(201);
    expect(response.body.resultado).toBe(1);
    expect(db.query).toHaveBeenCalled();
  });
});
