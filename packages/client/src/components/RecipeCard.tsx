import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: {
    _id: string;
    name: string;
    imageUrl?: string;
  };
  isFavorite: boolean;
  onCardClick: (id: string) => void;
  onFavoriteToggle: (id: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onCardClick,
  onFavoriteToggle,
}) => {
  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onFavoriteToggle(recipe._id);
  };

  const handleCardClick = () => {
    onCardClick(recipe._id);
  };

  return (
    <Card
      className="relative hover:shadow-md overflow-hidden transition-shadow duration-200 cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === 'Enter' || e.key === ' ' ? handleCardClick() : undefined
      }
      aria-label={`View details for ${recipe.name}`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="top-2 right-2 z-10 absolute bg-background/70 hover:bg-background/90 p-1 rounded-full w-8 h-8"
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? `Remove ${recipe.name} from favorites` : `Add ${recipe.name} to favorites`}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star
          className={cn(
            'h-5 w-5 transition-colors',
            isFavorite ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground',
          )}
        />
      </Button>

      <CardHeader className="p-0">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-40 object-cover"
            width={300}
            height={160}
            loading="lazy"
          />
        ) : (
          <div className="flex justify-center items-center bg-secondary w-full h-40">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle
          className="font-semibold text-lg truncate"
          title={recipe.name}
        >
          {recipe.name}
        </CardTitle>
      </CardContent>
    </Card>
  );
};
