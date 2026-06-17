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

describe('Biblioteca Routes', () => {
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

  it('should list active loans', async () => {
    const mockLoans = [{ id_emprestimo: 1, nome_livro: 'Book A' }];
    db.query.mockResolvedValue([mockLoans]);

    const response = await request(app).get('/api/biblioteca/emprestimos-ativos');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockLoans);
  });

  it('should list available books', async () => {
    const mockBooks = [{ id_livro: 1, nome_livro: 'Book B' }];
    db.query.mockResolvedValue([mockBooks]);

    const response = await request(app).get('/api/biblioteca/livros-disponiveis');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should insert a new book successfully', async () => {
    db.query.mockResolvedValue([[[{ resultado: 1 }]]]);

    const response = await request(app)
      .post('/api/biblioteca/inserir-livro')
      .send({ nome_livro: 'Book C', genero: 'Drama', autor: 'John', nicho: 'A', numero_livro: 123 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should register a loan successfully', async () => {
    db.query.mockResolvedValue([[[{ resultado: 1 }]]]);

    const response = await request(app)
      .post('/api/biblioteca/registrar-emprestimo')
      .send({ email_aluno: 'student@example.com', id_livro: 1 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should register a return successfully', async () => {
    db.query.mockResolvedValue([[[{ resultado: 1 }]]]);

    const response = await request(app)
      .post('/api/biblioteca/registrar-devolucao')
      .send({ id_emprestimo: 1 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
