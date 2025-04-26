import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db'; 
import Recipe, { IRecipe } from '../models/Recipe'; 

dotenv.config({ path: '../../.env' }); 

const sampleRecipes: Omit<
  IRecipe,
  keyof mongoose.Document | 'createdAt' | 'updatedAt'
>[] = [
  {
    name: 'Spaghetti Carbonara',
    ingredients: [
      '200g Spaghetti',
      '100g Pancetta or Guanciale',
      '2 large Eggs',
      '50g Pecorino Romano cheese, grated',
      'Black Pepper',
      'Salt',
    ],
    instructions: `1. Cook spaghetti according to package directions. Reserve some pasta water.
       2. While pasta cooks, fry pancetta/guanciale until crisp. Remove from heat.
       3. In a bowl, whisk eggs, grated cheese, and plenty of black pepper.
       4. Drain pasta and add it to the pan with the pancetta. Toss to coat.
       5. Remove pan from heat and quickly mix in the egg/cheese mixture. Toss rapidly. If too dry, add a splash of reserved pasta water.
       6. Serve immediately with more grated cheese and pepper.`,
    imageUrl: 'https://placehold.co/300x160/FF0000/FFFFFF/png?text=Carbonara', 
  },
  {
    name: 'Classic Tomato Soup',
    ingredients: [
      '1 tbsp Olive Oil',
      '1 Onion, chopped',
      '2 cloves Garlic, minced',
      '800g Canned crushed tomatoes',
      '500ml Vegetable Broth',
      '100ml Heavy Cream (optional)',
      'Salt & Pepper to taste',
      'Fresh Basil for garnish',
    ],
    instructions: `1. Heat olive oil in a large pot over medium heat.
       2. Add chopped onion and cook until softened (5-7 min).
       3. Add minced garlic and cook for 1 more minute until fragrant.
       4. Pour in crushed tomatoes and vegetable broth. Bring to a simmer.
       5. Reduce heat and let simmer for 15-20 minutes.
       6. Use an immersion blender to blend the soup until smooth (or carefully transfer to a standard blender).
       7. Stir in heavy cream (if using). Season with salt and pepper.
       8. Serve hot, garnished with fresh basil.`,
    imageUrl: 'https://placehold.co/300x160/0000FF/FFFFFF/png?text=Tomato+Soup',  
  },
  {
    name: 'Simple Lemon Herb Roasted Chicken',
    ingredients: [
      '1 whole Chicken (about 1.5kg)',
      '1 Lemon, halved',
      '4 sprigs fresh Rosemary',
      '4 sprigs fresh Thyme',
      '4 cloves Garlic, smashed',
      '2 tbsp Olive Oil',
      'Salt',
      'Black Pepper',
    ],
    instructions: `1. Preheat oven to 200°C (400°F).
       2. Pat the chicken dry with paper towels. Place in a roasting pan.
       3. Squeeze juice from one lemon half over the chicken. Place both lemon halves, rosemary, thyme, and smashed garlic cloves inside the cavity of the chicken.
       4. Drizzle the chicken with olive oil. Season generously with salt and pepper.
       5. Roast for 1 hour to 1 hour 15 minutes, or until the juices run clear when pierced with a fork or a thermometer inserted into the thickest part of the thigh reads 75°C (165°F).
       6. Let the chicken rest for 10-15 minutes before carving.
       7. Serve with roasted vegetables or your favorite side dish.`,
    imageUrl:
      'https://placehold.co/300x160/FFFF00/000000/png?text=Roast+Chicken', 
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Recipe.deleteMany({});
    console.log('Existing recipes cleared.');

    await Recipe.insertMany(sampleRecipes);
    console.log('Sample recipes inserted successfully.');

    process.exit(0); 
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1); 
  }
};

seedDatabase();
