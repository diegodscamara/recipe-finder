import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import './App.css';
import { SearchInput } from './components/SearchInput';
import { RecipeList } from './components/RecipeList';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { useFavorites } from './hooks/useFavorites';
import { Button } from './components/ui/button';
import { Star, List } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Recipe {
  _id: string;
  name: string;
  imageUrl?: string;
  ingredients: string[];
  instructions: string;
}

type SortOption = 'createdAt_desc' | 'name_asc' | 'name_desc';

const fetchRecipes = async (
  searchTerm: string = '',
  sortBy: string = 'createdAt',
  sortOrder: string = 'desc'
): Promise<Recipe[]> => {
  const params = new URLSearchParams();
  if (searchTerm.trim()) {
    params.set('ingredients', searchTerm.trim());
  }
  params.set('sortBy', sortBy);
  params.set('sortOrder', sortOrder);

  const url = `http://localhost:3001/api/recipes?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    let errorMessage = `Network response was not ok fetching recipes. Status: ${response.status}`;
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

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('createdAt_desc');

  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();

  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const {
    data: recipes,
    error,
    isLoading,
  } = useQuery<Recipe[], Error>({
    queryKey: ['recipes', debouncedSearchTerm, sortOption],
    queryFn: () => {
      const [sortBy, sortOrder] = sortOption.split('_');
      return fetchRecipes(debouncedSearchTerm, sortBy, sortOrder);
    },
  });

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handleRecipeClick = (id: string) => {
    setSelectedRecipeId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipeId(null);
  };

  const displayedRecipes = showOnlyFavorites
    ? recipes?.filter((recipe) => favoriteIds.has(recipe._id))
    : recipes;

  return (
    <div className="bg-background min-h-screen text-foreground">
      <header className="flex justify-between items-center mx-auto p-4 container">
        <div></div>
        <ThemeToggle />
      </header>

      <main className="mx-auto p-4 pt-0 container">
        <h1 className="mb-6 font-bold text-3xl text-center">Recipe Finder</h1>

        <div className="flex flex-col justify-center items-center gap-4 mb-8">
          <SearchInput onSearchChange={handleSearchChange} />
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              title={showOnlyFavorites ? "Show All Recipes" : "Show Favorite Recipes"}
            >
              {showOnlyFavorites ? (
                <List className="mr-2 w-4 h-4" />
              ) : (
                <Star className="mr-2 w-4 h-4" />
              )}
              {showOnlyFavorites ? 'Show All' : 'Favorites'}
            </Button>

            <Select value={sortOption} onValueChange={(value: string) => setSortOption(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt_desc">Newest</SelectItem>
                <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8">
          <RecipeList
            recipes={displayedRecipes || []}
            isLoading={isLoading}
            error={error}
            onRecipeClick={handleRecipeClick}
            isFavorite={isFavorite}
            onFavoriteToggle={toggleFavorite}
          />
        </div>
      </main>

      <RecipeDetailModal
        recipeId={selectedRecipeId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
