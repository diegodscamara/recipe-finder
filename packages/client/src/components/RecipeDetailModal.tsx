import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

interface DetailedRecipe {
  _id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const fetchRecipeById = async (id: string): Promise<DetailedRecipe> => {
  const response = await fetch(`http://localhost:3001/api/recipes/${id}`);
  if (!response.ok) {
    let errorMessage = `Network response was not ok fetching recipe ${id}. Status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (jsonError) {
      console.error('Failed to parse error response JSON:', jsonError);
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

interface RecipeDetailModalProps {
  recipeId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipeId,
  isOpen,
  onClose,
}) => {
  const {
    data: recipe,
    error,
    isLoading,
    isFetching,
  } = useQuery<DetailedRecipe, Error>({
    queryKey: ['recipe', recipeId],
    queryFn: () => fetchRecipeById(recipeId!),
    enabled: isOpen && !!recipeId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            {isLoading || isFetching ? (
              <Skeleton className="inline-block w-3/4 h-8" />
            ) : recipe ? (
              recipe.name
            ) : (
              'Recipe Details'
            )}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="space-y-4 mt-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="w-full h-48" />
                <Skeleton className="w-1/4 h-6" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-1/4 h-6" />
                <Skeleton className="w-full h-40" />
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center bg-red-50 p-6 rounded-md text-red-600 text-center">
                <AlertTriangle className="mb-4 w-12 h-12" />
                <p className="font-semibold">Error loading recipe details:</p>
                <p className="text-sm">{error.message}</p>
              </div>
            ) : recipe ? (
              <>
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="mb-4 rounded-md w-full h-48 object-cover"
                    width={550}
                    height={192}
                    loading="lazy"
                  />
                )}
                <div>
                  <h3 className="mb-2 font-semibold text-lg">Ingredients:</h3>
                  <ul className="space-y-1 pl-4 text-sm list-disc list-inside">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-lg">Instructions:</h3>
                  <p className="text-sm whitespace-pre-wrap">
                    {recipe.instructions}
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </DialogDescription>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
