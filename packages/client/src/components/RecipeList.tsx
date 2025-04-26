import React from 'react';
import { RecipeCard } from './RecipeCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

interface Recipe {
  _id: string;
  name: string;
  imageUrl?: string;
}

interface RecipeListProps {
  recipes: Recipe[];
  isLoading: boolean;
  error: Error | null;
  onRecipeClick: (id: string) => void;
  isFavorite: (id: string) => boolean;
  onFavoriteToggle: (id: string) => void;
}

export const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  isLoading,
  error,
  onRecipeClick,
  isFavorite,
  onFavoriteToggle,
}) => {
  if (isLoading) {
    return (
      <div data-testid="recipe-list-loading" className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="rounded-md w-full h-40" />
            <div className="space-y-2 p-4">
              <Skeleton className="rounded w-3/4 h-6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-8">
        <AlertTriangle className="w-4 h-4" />
        <AlertTitle>Error Loading Recipes</AlertTitle>
        <AlertDescription>
          {error.message || "An unknown error occurred. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  if (!isLoading && recipes.length === 0) {
    return (
      <div className="mt-8 text-muted-foreground text-center">
        No recipes found matching your criteria.
      </div>
    );
  }

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe._id}
          recipe={recipe}
          onCardClick={onRecipeClick}
          isFavorite={isFavorite(recipe._id)}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
};
