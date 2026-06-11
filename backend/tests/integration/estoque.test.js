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

describe('Estoque Routes', () => {
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

  it('should list all books successfully', async () => {
    const mockBooks = [{ numero_book: 1, quantidade: 10 }, { numero_book: 2, quantidade: 5 }];
    db.query.mockResolvedValue([mockBooks]);

    const response = await request(app).get('/api/estoque/listar');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockBooks);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM tb_estoque ORDER BY numero_book');
  });

  it('should handle db error on listing books', async () => {
    db.query.mockRejectedValue(new Error('DB error'));

    const response = await request(app).get('/api/estoque/listar');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
  });

  it('should insert a new book successfully', async () => {
    db.query.mockResolvedValue([[[{ resultado: 1 }]]]);

    const response = await request(app)
      .post('/api/estoque/inserirBook')
      .send({ numero_book: 3 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.resultado).toBe(1);
    expect(db.query).toHaveBeenCalledWith('CALL sp_insere_book(?)', [3]);
  });

  it('should fail to insert a book with invalid number', async () => {
    const response = await request(app)
      .post('/api/estoque/inserirBook')
      .send({ numero_book: -1 });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(db.query).not.toHaveBeenCalled();
  });
});
