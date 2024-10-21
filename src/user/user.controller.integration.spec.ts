import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.services';

describe('UserController (Integration)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule], // Use your AppModule to create a full app instance
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        prisma = app.get<PrismaService>(PrismaService); // Inject Prisma for database access
        await prisma.user.deleteMany(); // Cleanup the database
    });

    afterAll(async () => {
        await app.close();
    });

    it('/users (GET)', () => {
        return request(app.getHttpServer())
            .get('/users')
            .expect(200)
            .expect('Content-Type', /json/);
    });

    it('/users/:id (GET)', async () => {
        // Add a user to query
        const createdUser = await prisma.user.create({ data: { firstName: 'John ', lastName: "Doe", email: 'ab@example.com', passwordHash: "lorem" } });

        return request(app.getHttpServer())
            .get(`/users/${createdUser.id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.id).toEqual(createdUser.id);
            });
    });

    it('/users/assign-role (POST)', async () => {
        const user = await prisma.user.create({ data: { firstName: 'Jane ', lastName: "Doe", email: 'ac@example.com', passwordHash: "lorem" } });
        const role = await prisma.role.create({ data: { name: 'User' } });

        return request(app.getHttpServer())
            .post('/users/assign-role')
            .send({ userId: user.id, roleId: role.id })
            .expect(201);
    });

    it('/users/:id (DELETE)', async () => {
        const user = await prisma.user.create({ data: { firstName: 'Fola ', lastName: "Doe", email: 'ad@example.com', passwordHash: "lorem" } });

        return request(app.getHttpServer())
            .delete(`/users/${user.id}`)
            .expect(200)
            .expect('User deleted');
    });
});
