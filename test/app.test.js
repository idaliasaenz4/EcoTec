const request = require('supertest');
const app = require('../app');

describe('Pruebas de la API', () => {
  it('debería devolver el código de estado 200 al hacer una solicitud GET a /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  it('debería devolver el código de estado 404 al hacer una solicitud GET a una ruta no encontrada', async () => {
    const response = await request(app).get('/ruta-no-existente');
    expect(response.statusCode).toBe(404);
  });

  it('debería devolver el código de estado 401 al hacer una solicitud GET a /users sin token', async () => {
    // Simulamos una solicitud sin token
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(401);
  });

  it('debería devolver el código de estado 401 al hacer una solicitud GET a /users con token inválido', async () => {
    // Simulamos una solicitud con un token inválido
    const invalidToken = 'token_invalido';
    const response = await request(app)
      .get('/users')
      .set('Authorization', invalidToken);
    expect(response.statusCode).toBe(401);
  });

  it('debería devolver el código de estado 401 al hacer una solicitud POST a /users sin token', async () => {
    // Simulamos una solicitud sin token
    const userData = { nombre: 'NombreUsuario', contrasea: 'contraseña123' };
    const response = await request(app)
      .post('/users')
      .send(userData);
    expect(response.statusCode).toBe(401);
  });

  it('debería devolver el código de estado 401 al hacer una solicitud POST a /users con token inválido', async () => {
    // Simulamos una solicitud con un token inválido
    const invalidToken = 'token_invalido';
    const userData = { nombre: 'NombreUsuario', contrasea: 'contraseña123' };
    const response = await request(app)
      .post('/users')
      .set('Authorization', invalidToken)
      .send(userData);
    expect(response.statusCode).toBe(401);
  });



  it('debería devolver el código de estado 401 al hacer una solicitud PUT a /users/:id sin token', async () => {
    // Simulamos una solicitud sin token
    const userId = '1';
    const userData = { nombre: 'NombreModificado', contrasea: 'nueva_contraseña123' };
    const response = await request(app)
      .put(`/users/${userId}`)
      .send(userData);
    expect(response.statusCode).toBe(401);
  });

  it('debería devolver el código de estado 401 al hacer una solicitud PUT a /users/:id con token inválido', async () => {
    // Simulamos una solicitud con un token inválido
    const invalidToken = 'token_invalido';
    const userId = '1';
    const userData = { nombre: 'NombreModificado', contrasea: 'nueva_contraseña123' };
    const response = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', invalidToken)
      .send(userData);
    expect(response.statusCode).toBe(401);
  });



  it('debería devolver el código de estado 401 al hacer una solicitud DELETE a /users/:id sin token', async () => {
    // Simulamos una solicitud sin token
    const userId = '1';
    const response = await request(app).delete(`/users/${userId}`);
    expect(response.statusCode).toBe(401);
  });

  it('debería devolver el código de estado 401 al hacer una solicitud DELETE a /users/:id con token inválido', async () => {
    // Simulamos una solicitud con un token inválido
    const invalidToken = 'token_invalido';
    const userId = '1';
    const response = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', invalidToken);
    expect(response.statusCode).toBe(401);
  });



  it('debería devolver el código de estado 401 al hacer una solicitud POST a /users/confirm-password/:id sin token', async () => {
    // Simulamos una solicitud sin token
    const userId = '1';
    const response = await request(app)
      .post(`/users/confirm-password/${userId}`)
      .send({ password: 'contraseña123' });
    expect(response.statusCode).toBe(401);
  });

  it('debería devolver el código de estado 401 al hacer una solicitud POST a /users/confirm-password/:id con token inválido', async () => {
    // Simulamos una solicitud con un token inválido
    const invalidToken = 'token_invalido';
    const userId = '1';
    const response = await request(app)
      .post(`/users/confirm-password/${userId}`)
      .set('Authorization', invalidToken)
      .send({ password: 'contraseña123' });
    expect(response.statusCode).toBe(401);
  });


  it('debería devolver el código de estado 401 al hacer una solicitud POST a /users/confirm-password/:id con token válido y contraseña incorrecta', async () => {
    // Simulamos una solicitud con un token válido y contraseña incorrecta
    const validToken = 'token_valido';
    const userId = '1';
    const response = await request(app)
      .post(`/users/confirm-password/${userId}`)
      .set('Authorization', validToken)
      .send({ password: 'contraseña_incorrecta' });
    expect(response.statusCode).toBe(401);
  });

});
