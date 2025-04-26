import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';

afterAll(async () => {
    await mongoose.connection.close();
});

describe('GET / - Server Root Route', () => {
    it('should return 200 OK and the API running message', async () => {
        const response = await request(app).get('/');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Recipe Finder API is running!');
    });
}); 