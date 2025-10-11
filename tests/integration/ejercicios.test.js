const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const Tarea = require('../../src/models/tarea.model');
jest.setTimeout(30000); // 30 segundos de espera

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Tarea.deleteMany();
});

describe('🎓 EJERCICIOS PARA ESTUDIANTES', () => {
  
  // EJERCICIO 1: Completar esta prueba
  test('TODO: Implementar PUT /api/tareas/:id - actualizar tarea', async () => {
    // PISTA: 
    // 1. Crear una tarea
    const tarea = await Tarea.create({ title: 'Tarea original' });
    // 2. Hacer PUT con datos actualizados
    const res = await request(app)
      .put(`/api/tareas/${tarea._id}`)
      .send({ title: 'Tarea actualizada', completed: true });
    // 3. Verificar respuesta y BD
    
    // const tarea = await Tarea.create({ title: 'Tarea original' });
    // const res = await request(app)
    //   .put(`/api/tareas/${tarea._id}`)
    //   .send({ title: 'Tarea actualizada', completed: true });
    
    // TODO: Agregar expects aquí
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Tarea actualizada');
    expect(res.body.completed).toBe(true);
  });

  // EJERCICIO 2: Completar esta prueba
  test('TODO: Implementar DELETE /api/tareas/:id - eliminar tarea', async () => {
    // PISTA:
    // 1. Crear una tarea
    const tarea = await Tarea.create({ title: 'Tarea a eliminar' });
    // 2. Hacer DELETE
    const res = await request(app).delete(`/api/tareas/${tarea._id}`);
    // 3. Verificar que se eliminó (404 en GET)
    expect(res.statusCode).toBe(204);
    const getRes = await request(app).get(`/api/tareas/${tarea._id}`);
    expect(getRes.statusCode).toBe(404);
  });

  // EJERCICIO 3: Prueba de validación
  test('TODO: POST /api/tareas con title vacío debe fallar', async () => {
    // PISTA: Enviar { title: "" } y verificar error
    const tarea = { title: '' };
    const res = await request(app)
      .post('/api/tareas')
      .send(tarea);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toMatch(/path `title` is required/i);
  });

  // EJERCICIO 4: Prueba con múltiples tareas
  test('TODO: GET /api/tareas debe devolver tareas ordenadas por fecha', async () => {
    // PISTA:
    // 1. Crear varias tareas con delays
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const tarea1 = await Tarea.create({ title: 'Tarea 1' });
    await sleep(10);
    const tarea2 = await Tarea.create({ title: 'Tarea 2' });
    await sleep(10);
    const tarea3 = await Tarea.create({ title: 'Tarea 3' });

    const res = await request(app).get('/api/tareas');
    // 2. Verificar orden en la respuesta
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body[0]._id).toBe(tarea1._id.toString());
    expect(res.body[1]._id).toBe(tarea2._id.toString());
    expect(res.body[2]._id).toBe(tarea3._id.toString());
  });

  // EJERCICIO 5: Prueba de edge case
  test('TODO: GET /api/tareas/:id con ID inválido debe devolver 500', async () => {
    // PISTA: Usar un ID que no sea ObjectId válido (ej: "123")
    const res = await request(app).get('/api/tareas/123');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
