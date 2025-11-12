const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const Tarea = require('../../src/models/tarea.model');
jest.setTimeout(90000); // 90 segundos de espera

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

describe('EJEMPLOS PRACTICOS DE PRUEBAS DE INTEGRACION', () => {

  // EJERCICIO 1: Implementar la prueba para crear una tarea
  test('TODO: POST /api/tareas crea una tarea', async () => {
    // PISTA:
    // 1. Define el objeto `nuevaTarea` con el `title`.
    const newTask = {
        title: 'Tarea de prueba'
    };
    // 2. Haz una petición `POST` usando `supertest`.
    const res = await request(app)
    .post('/api/tareas')
    .send(newTask);
    // 3. Verifica el `statusCode` de la respuesta (debe ser 201).
    expect(res.statusCode).toBe(201);
    // 4. Asegúrate de que el cuerpo de la respuesta contenga el título y un `_id`.
    expect(res.body._id).toBeDefined();
    expect(res.body.title).toBe(newTask.title);
    expect(res.body.title).toBe('Tarea de prueba');

    const tareaInDB = await Tarea.find();
    console.log("👨🏻‍💻 Revisión de datos creados en la prueba",tareaInDB);
  });

  // EJERCICIO 2: Implementar la prueba para obtener todas las tareas
  test('TODO: GET /api/tareas devuelve todas las tareas', async () => {
    // PISTA:
    // 1. Crea varias tareas directamente en la base de datos usando `Tarea.create()`.
    await Tarea.create({ title: 'Tarea 1'});
    await Tarea.create({ title: 'Tarea finalizada', completed: true });
    
    // 2. Haz una petición `GET` a la API.
    const res = await request(app)
    .get('/api/tareas');
    // 3. Verifica el `statusCode` (200) y que el array devuelto tenga la longitud correcta.
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body).toHaveLength(2);
    // 4. Asegúrate de que los títulos de las tareas en la respuesta coincidan con los que creaste.
    expect(res.body[0].title).toBe('Tarea 1');
    expect(res.body[1].title).toBe('Tarea finalizada');

    const TareaInDB = await Tarea.find();
    console.log("👨🏻‍💻 GET - Revisión de datos en la BD antes de la prueba",TareaInDB);
  });

  // EJERCICIO 3: Implementar la prueba para obtener una tarea específica
  test('TODO: GET /api/tareas/:id devuelve una tarea específica', async () => {
    // PISTA:
    // 1. Crea una tarea en la base de datos para obtener su `_id`.
    const tarea = await Tarea.create({ title: 'Tarea específica' });
    // 2. Haz una petición `GET` a la ruta dinámica `/api/tareas/:id`.

    const res = await request(app).get(`/api/tareas/${tarea._id}`);
    // 3. Verifica el `statusCode` (200) y que el `title` de la respuesta coincida con el de la tarea que creaste.
    
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Tarea específica');

    // 4. Intenta obtener una tarea con un ID que no exista y verifica que devuelva un 404.
    const res1 = await request(app).get(`/api/tareas/2`);
    expect(res1.statusCode).toBe(500);
    
    
  });

  // ✅ EJERCICIO 4: Implementar la prueba para un ID inexistente
  test('TODO: GET /api/tareas/:id devuelve 404 para un ID inexistente', async () => {
    // PISTA:
    // 1. Crea un ID válido pero que no exista en la base de datos (por ejemplo, `new mongoose.Types.ObjectId()`).
    const idInexistente = new mongoose.Types.ObjectId();
    // 2. Haz una petición `GET` a la API con este ID.
    const res = await request(app).get(`/api/tareas/${idInexistente}`);
    // 3. Verifica que la respuesta tenga un `statusCode` de 404.
    
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Not found');
  });

  // EJERCICIO 5: Implementar la prueba para un campo requerido
  test('TODO: POST /api/tareas valida campos requeridos', async () => {
    // PISTA:
    // 1. Haz una petición `POST` con un objeto vacío o sin el campo `title`.
    const tarea = {};

    // 2. Verifica el `statusCode` de error y que el cuerpo de la respuesta contenga un mensaje de validación.
    const res = await request(app)
    .post('/api/tareas')
    .send(tarea);
    
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toMatch(/path `title` is required/i);
  });

  // EJERCICIO 6: Implementar la prueba para una lista vacía
  test('TODO: GET /api/tareas devuelve un array vacío cuando no hay tareas', async () => {
    // PISTA:
    // 1. Asegúrate de que no haya tareas en la base de datos (`afterEach` se encarga de esto).
    // 2. Haz una petición `GET`.
    const res = await request(app).get('/api/tareas');
    // 3. Verifica que la respuesta tenga un `statusCode` de 200 y que el cuerpo sea un array vacío.
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
