const request = require('supertest');
const app = require('../src/app');

describe('Demo CI/CD Project API', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.message).toBe('Demo CI/CD Project API');
    });
  });

  describe('Health Endpoints', () => {
    describe('GET /api/health', () => {
      it('should return health status', async () => {
        const response = await request(app)
          .get('/api/health')
          .expect(200);

        expect(response.body).toHaveProperty('status', 'OK');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('uptime');
        expect(response.body).toHaveProperty('environment');
        expect(response.body).toHaveProperty('memory');
        expect(response.body).toHaveProperty('system');
      });
    });

    describe('GET /api/health/detailed', () => {
      it('should return detailed health status', async () => {
        const response = await request(app)
          .get('/api/health/detailed')
          .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('checks');
        expect(response.body.checks).toHaveProperty('server');
        expect(response.body.checks).toHaveProperty('memory');
        expect(response.body.checks).toHaveProperty('environment');
      });
    });
  });

  describe('User Endpoints', () => {
    describe('GET /api/users', () => {
      it('should return all users', async () => {
        const response = await request(app)
          .get('/api/users')
          .expect(200);

        expect(response.body).toHaveProperty('users');
        expect(response.body).toHaveProperty('total');
        expect(Array.isArray(response.body.users)).toBe(true);
        expect(response.body.total).toBeGreaterThan(0);
      });
    });

    describe('GET /api/users/:id', () => {
      it('should return specific user', async () => {
        const response = await request(app)
          .get('/api/users/1')
          .expect(200);

        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('created');
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app)
          .get('/api/users/999')
          .expect(404);

        expect(response.body).toHaveProperty('error', 'User not found');
      });
    });

    describe('POST /api/users', () => {
      it('should create new user', async () => {
        const newUser = {
          name: 'Test Gebruiker',
          email: 'test@example.com',
        };

        const response = await request(app)
          .post('/api/users')
          .send(newUser)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name', newUser.name);
        expect(response.body).toHaveProperty('email', newUser.email);
        expect(response.body).toHaveProperty('created');
      });

      it('should validate required fields', async () => {
        const response = await request(app)
          .post('/api/users')
          .send({ name: 'Test' })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Name and email are required');
      });

      it('should validate email format', async () => {
        const response = await request(app)
          .post('/api/users')
          .send({ name: 'Test', email: 'invalid-email' })
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Invalid email format');
      });

      it('should prevent duplicate emails', async () => {
        const response = await request(app)
          .post('/api/users')
          .send({ name: 'Test', email: 'jan@example.com' })
          .expect(409);

        expect(response.body).toHaveProperty('error', 'Email already exists');
      });
    });

    describe('PUT /api/users/:id', () => {
      it('should update existing user', async () => {
        const updatedUser = {
          name: 'Updated Name',
          email: 'updated@example.com',
        };

        const response = await request(app)
          .put('/api/users/1')
          .send(updatedUser)
          .expect(200);

        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('name', updatedUser.name);
        expect(response.body).toHaveProperty('email', updatedUser.email);
        expect(response.body).toHaveProperty('updated');
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app)
          .put('/api/users/999')
          .send({ name: 'Test', email: 'test@example.com' })
          .expect(404);

        expect(response.body).toHaveProperty('error', 'User not found');
      });
    });

    describe('DELETE /api/users/:id', () => {
      it('should delete existing user', async () => {
        const response = await request(app)
          .delete('/api/users/2')
          .expect(200);

        expect(response.body).toHaveProperty('message', 'User deleted successfully');
        expect(response.body).toHaveProperty('user');
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app)
          .delete('/api/users/999')
          .expect(404);

        expect(response.body).toHaveProperty('error', 'User not found');
      });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
      expect(response.body).toHaveProperty('path', '/api/unknown');
    });
  });
});
