import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

jest.mock('../../config/db', () => ({
  __esModule: true, 
  default: jest.fn(), 
}));

import app from '../../server'; 
import Recipe, { IRecipe } from '../../models/Recipe'; 

let mongoServer: MongoMemoryServer;

const sampleRecipe1 = { 
    name: 'Pasta Test', 
    ingredients: ['pasta', 'tomato'], 
    instructions: 'Boil pasta, add sauce' 
};
const sampleRecipe2 = { 
    name: 'Salad Test', 
    ingredients: ['lettuce', 'tomato', 'cucumber'], 
    instructions: 'Chop veggies, mix' 
};

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Recipe.deleteMany({});
    await Recipe.create([sampleRecipe1, sampleRecipe2]);
});

describe('Recipe API Routes', () => {

    describe('GET /api/recipes', () => {
        it('should return all recipes when no query parameters are provided', async () => {
            const response = await request(app).get('/api/recipes');

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(2);
            
            const names = response.body.map((r: Partial<IRecipe>) => r.name);
            expect(names).toContain(sampleRecipe1.name);
            expect(names).toContain(sampleRecipe2.name);

            expect(response.body[0]).toMatchObject({
                name: expect.any(String),
                ingredients: expect.any(Array),
                instructions: expect.any(String),
            });
        });

        it('should filter recipes by a single ingredient (case-insensitive)', async () => {
            const response = await request(app).get('/api/recipes?ingredients=Pasta'); 

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(1);
            expect(response.body[0].name).toBe(sampleRecipe1.name); 
        });

        it('should filter recipes by multiple ingredients (case-insensitive)', async () => {
            const response = await request(app).get('/api/recipes?ingredients=Lettuce,Tomato'); 

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(1);
            expect(response.body[0].name).toBe(sampleRecipe2.name);
        });

        it('should return an empty array if no recipes match the ingredients filter', async () => {
            const response = await request(app).get('/api/recipes?ingredients=nonexistent');

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(0);
        });

        it('should sort recipes by name ascending', async () => {
            const response = await request(app).get('/api/recipes?sortBy=name&sortOrder=asc');
            
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body[0].name).toBe(sampleRecipe1.name); 
            expect(response.body[1].name).toBe(sampleRecipe2.name);
        });

        it('should sort recipes by name descending', async () => {
            const response = await request(app).get('/api/recipes?sortBy=name&sortOrder=desc');

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body[0].name).toBe(sampleRecipe2.name);
            expect(response.body[1].name).toBe(sampleRecipe1.name);
        });

        it('should default to sorting by createdAt descending if no sort params provided (implicitly tested by first test, but good to be explicit)', async () => {
             await Recipe.deleteMany({});
             const r1 = await Recipe.create(sampleRecipe1); 
             await new Promise(resolve => setTimeout(resolve, 10)); 
             const r2 = await Recipe.create(sampleRecipe2);

             const response = await request(app).get('/api/recipes');

             expect(response.status).toBe(200);
             expect(response.body.length).toBe(2);
             expect(response.body[0].name).toBe(r2.name); 
             expect(response.body[1].name).toBe(r1.name); 
        });
    });

    describe('GET /api/recipes/:id', () => {
        let seededRecipe1Id: string;

        beforeEach(async () => {
            const recipe1 = await Recipe.findOne({ name: sampleRecipe1.name });
            if (recipe1) {
                seededRecipe1Id = recipe1.id;
            } else {
                throw new Error('Could not find seeded recipe 1 in beforeEach');
            }
        });

        it('should return a single recipe when a valid ID is provided', async () => {
            const response = await request(app).get(`/api/recipes/${seededRecipe1Id}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body._id).toBe(seededRecipe1Id);
            expect(response.body.name).toBe(sampleRecipe1.name);
            expect(response.body.ingredients).toEqual(sampleRecipe1.ingredients);
            expect(response.body.instructions).toBe(sampleRecipe1.instructions);
        });

        it('should return 404 Not Found when the ID is valid format but does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toString();
            const response = await request(app).get(`/api/recipes/${nonExistentId}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ msg: 'Recipe not found' });
        });

        it('should return 400 Bad Request when the ID format is invalid', async () => {
            const invalidId = 'invalid-id-format';
            const response = await request(app).get(`/api/recipes/${invalidId}`);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ msg: 'Invalid Recipe ID format' });
        });
    });

    describe('PATCH /api/recipes/:id/favorite', () => {
        let seededRecipe1Id: string;

        beforeEach(async () => {
            const recipe1 = await Recipe.findOne({ name: sampleRecipe1.name });
            if (recipe1) {
                seededRecipe1Id = recipe1.id;
            } else {
                const created = await Recipe.create(sampleRecipe1);
                seededRecipe1Id = created.id;
            }
        });

        it('should return 200 and placeholder message for a valid ID', async () => {
            const response = await request(app).patch(`/api/recipes/${seededRecipe1Id}/favorite`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('msg');
            expect(response.body.msg).toContain('Placeholder: Favorite status toggled');
            expect(response.body.recipeId).toBe(seededRecipe1Id);
        });

        it('should return 404 Not Found when the ID is valid format but does not exist', async () => {
            const nonExistentId = new mongoose.Types.ObjectId().toString();
            const response = await request(app).patch(`/api/recipes/${nonExistentId}/favorite`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ msg: 'Recipe not found' });
        });

        it('should return 400 Bad Request when the ID format is invalid', async () => {
            const invalidId = 'invalid-id-format';
            const response = await request(app).patch(`/api/recipes/${invalidId}/favorite`);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ msg: 'Invalid Recipe ID format' });
        });
    });

}); 