import express, { Request, Response, Router, NextFunction } from 'express';
import Recipe from '../models/Recipe'; 
import mongoose from 'mongoose';

const router: Router = express.Router();

/**
 * @route   GET /api/recipes
 * @desc    Get recipes, optionally filtered by ingredients and sorted
 * @access  Public
 * @query   ingredients (optional): Comma-separated string of ingredients to match (case-insensitive)
 * @query   sortBy (optional): Field to sort by (e.g., 'name', 'createdAt'). Default 'createdAt'.
 * @query   sortOrder (optional): Sort order ('asc' or 'desc'). Default 'desc'.
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ingredients, sortBy, sortOrder } = req.query;
    let filterQuery = {};
    let sortQuery: { [key: string]: 1 | -1 } = { createdAt: -1 }; 

    if (typeof ingredients === 'string' && ingredients.trim() !== '') {
      const ingredientsArray = ingredients
        .split(',')
        .map((ing) => ing.trim())
        .filter((ing) => ing !== '');

      if (ingredientsArray.length > 0) {
        const ingredientsQuery = {
          ingredients: {
            $all: ingredientsArray.map(
              (ing) => new RegExp(ing, 'i'), 
            ),
          },
        };
        filterQuery = ingredientsQuery; 
      }
    }

    if (typeof sortBy === 'string' && sortBy.trim() !== '') {
      const validSortFields = ['name', 'createdAt']; 
      if (validSortFields.includes(sortBy)) {
        const order = sortOrder === 'asc' ? 1 : -1; 
        sortQuery = { [sortBy]: order };
      }
    }

    const recipes = await Recipe.find(filterQuery).sort(sortQuery);
    res.json(recipes);
  } catch (err: unknown) {
    next(err); 
  }
});

/**
 * @route   GET /api/recipes/:id
 * @desc    Get a single recipe by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next: NextFunction) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid Recipe ID format' });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    return res.json(recipe);
  } catch (err: unknown) {
    next(err); 
  }
});

/**
 * @route   PATCH /api/recipes/:id/favorite
 * @desc    Toggle the favorite status of a recipe (Placeholder)
 * @access  Private (presumably - requires user context later)
 */
router.patch('/:id/favorite', async (req, res, next: NextFunction) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'Invalid Recipe ID format' });
  }

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    console.log(`Placeholder: Toggling favorite for recipe ID: ${id}`);

    res.json({
      msg: `Placeholder: Favorite status toggled for recipe ${id}. (Implementation Pending)`,
      recipeId: id,
    });
  } catch (err) {
    next(err); 
  }
});

export default router;
