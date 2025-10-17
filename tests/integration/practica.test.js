const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const Tarea = require('../../src/models/tarea.model');
jest.setTimeout(60000); // 60 segundos de espera

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

describe('Gimnasio de pruebas adicionales', () => {

    test('POST /api/tareas valor completed por defecto en false', async () => {
        const tarea = { title: 'Tarea sin completar' };
        const res = await request(app)
        .post('/api/tareas')
        .send(tarea);

        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe(tarea.title);
        expect(res.body.completed).toBe(false);
    });

    test('ENCUENTRA EL ERROR: GET /api/tareas/:id debe devolver una tarea', async () => {
    // Arrange
    const tarea = await Tarea.create({ title: 'Buscar esta tarea' });
    // Act
    const res = await request(app).get(`/api/tareas/${tarea._id}`);

    // Assert
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Buscar esta tarea');
    });

    test('DIAGNÓSTICO: PUT /api/tareas/:id debe actualizar TODOS los campos', async () => {
    // Arrange: Creamos una tarea inicial
    const tarea = await Tarea.create({ title: 'Título original', completed: false });
        console.log("👨🏻‍💻 Tarea inicial creada en la prueba:", tarea);
    // Act: Intentamos actualizar ambos campos
    const res = await request(app)
        .put(`/api/tareas/${tarea._id}`)
        .send({ title: 'Título actualizado', completed: true });

        console.log("👨🏻‍💻 Respuesta de la actualización:", res.body);

    // Assert
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Título actualizado');
    expect(res.body.completed).toBe(true);
    });

});