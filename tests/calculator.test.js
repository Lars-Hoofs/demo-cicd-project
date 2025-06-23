const request = require('supertest');
const app = require('../src/app');

describe('Calculator API', () => {
  describe('POST /api/calculator/add', () => {
    it('should add two numbers correctly', async () => {
      const response = await request(app)
        .post('/api/calculator/add')
        .send({ a: 5, b: 3 })
        .expect(200);

      expect(response.body).toHaveProperty('operation', 'addition');
      expect(response.body).toHaveProperty('result', 8);
      expect(response.body).toHaveProperty('operands', { a: 5, b: 3 });
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should handle negative numbers', async () => {
      const response = await request(app)
        .post('/api/calculator/add')
        .send({ a: -5, b: 3 })
        .expect(200);

      expect(response.body.result).toBe(-2);
    });

    it('should handle decimal numbers', async () => {
      const response = await request(app)
        .post('/api/calculator/add')
        .send({ a: 2.5, b: 1.3 })
        .expect(200);

      expect(response.body.result).toBeCloseTo(3.8);
    });

    it('should validate input types', async () => {
      const response = await request(app)
        .post('/api/calculator/add')
        .send({ a: '5', b: 3 })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Both a and b must be numbers');
    });

    it('should require both parameters', async () => {
      const response = await request(app)
        .post('/api/calculator/add')
        .send({ a: 5 })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Both a and b must be numbers');
    });
  });

  describe('POST /api/calculator/subtract', () => {
    it('should subtract two numbers correctly', async () => {
      const response = await request(app)
        .post('/api/calculator/subtract')
        .send({ a: 10, b: 4 })
        .expect(200);

      expect(response.body).toHaveProperty('operation', 'subtraction');
      expect(response.body).toHaveProperty('result', 6);
    });

    it('should handle negative results', async () => {
      const response = await request(app)
        .post('/api/calculator/subtract')
        .send({ a: 3, b: 8 })
        .expect(200);

      expect(response.body.result).toBe(-5);
    });
  });

  describe('POST /api/calculator/multiply', () => {
    it('should multiply two numbers correctly', async () => {
      const response = await request(app)
        .post('/api/calculator/multiply')
        .send({ a: 6, b: 7 })
        .expect(200);

      expect(response.body).toHaveProperty('operation', 'multiplication');
      expect(response.body).toHaveProperty('result', 42);
    });

    it('should handle multiplication by zero', async () => {
      const response = await request(app)
        .post('/api/calculator/multiply')
        .send({ a: 5, b: 0 })
        .expect(200);

      expect(response.body.result).toBe(0);
    });

    it('should handle multiplication with decimals', async () => {
      const response = await request(app)
        .post('/api/calculator/multiply')
        .send({ a: 2.5, b: 4 })
        .expect(200);

      expect(response.body.result).toBe(10);
    });
  });

  describe('POST /api/calculator/divide', () => {
    it('should divide two numbers correctly', async () => {
      const response = await request(app)
        .post('/api/calculator/divide')
        .send({ a: 15, b: 3 })
        .expect(200);

      expect(response.body).toHaveProperty('operation', 'division');
      expect(response.body).toHaveProperty('result', 5);
    });

    it('should handle decimal division', async () => {
      const response = await request(app)
        .post('/api/calculator/divide')
        .send({ a: 7, b: 2 })
        .expect(200);

      expect(response.body.result).toBe(3.5);
    });

    it('should prevent division by zero', async () => {
      const response = await request(app)
        .post('/api/calculator/divide')
        .send({ a: 10, b: 0 })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Division by zero is not allowed');
    });

    it('should validate input types for division', async () => {
      const response = await request(app)
        .post('/api/calculator/divide')
        .send({ a: 10, b: 'two' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Both a and b must be numbers');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', async () => {
      const response = await request(app)
        .post('/api/calculator/add')
        .send({ a: 999999999, b: 1 })
        .expect(200);

      expect(response.body.result).toBe(1000000000);
    });

    it('should handle very small decimal numbers', async () => {
      const response = await request(app)
        .post('/api/calculator/multiply')
        .send({ a: 0.1, b: 0.2 })
        .expect(200);

      expect(response.body.result).toBeCloseTo(0.02);
    });
  });
});
