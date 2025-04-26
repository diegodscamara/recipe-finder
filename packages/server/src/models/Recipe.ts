import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface representing a Recipe document in MongoDB.
 */
export interface IRecipe extends Document {
  name: string;
  ingredients: string[]; 
  instructions: string; 
  imageUrl?: string; 
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema: Schema<IRecipe> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
    },
    ingredients: {
      type: [String], 
      required: [true, 'Ingredients list cannot be empty'],
      validate: [
        (arr: string[]) => arr.length > 0,
        'Ingredients list must contain at least one ingredient',
      ],
    },
    instructions: {
      type: String,
      required: [true, 'Cooking instructions are required'],
    },
    imageUrl: {
      type: String,
      required: false, 
      match: [/^https?:\/\/.+/, 'Please provide a valid image URL'],
    },
  },
  {
    timestamps: true, 
  },
);

const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema);

export default Recipe;
