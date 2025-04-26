import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ThemeProvider } from '../src/components/ThemeProvider';
import { RecipeList } from '../src/components/RecipeList';
import { RecipeDetailModal } from '../src/components/RecipeDetailModal';

interface Recipe {
  _id: string;
  name: string;
  imageUrl?: string;
  ingredients: string[];
  instructions: string;
}

let store: Record<string, string> = {};
const localStorageMock = (() => {
  return {
    getItem(key: string) { return store[key] || null; },
    setItem(key: string, value: string) { store[key] = value.toString(); },
    removeItem(key: string) { delete store[key]; },
    clear() { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  }),
) as jest.Mock;

jest.mock('../src/components/RecipeList', () => ({
  RecipeList: jest.fn(({ isLoading, error, recipes, onRecipeClick, isFavorite, onFavoriteToggle }) => {
    if (isLoading) return <div data-testid="mock-recipe-list-loading">Loading...</div>;
    if (error) return <div data-testid="mock-recipe-list-error">Error: {error.message}</div>;
    if (!recipes || recipes.length === 0) return <div data-testid="mock-recipe-list-empty">No Recipes</div>;

    return (
      <div data-testid="mock-recipe-list-items">
        {recipes.map((recipe: Recipe) => (
          <div key={recipe._id} data-testid={`recipe-item-${recipe._id}`}>
            <button
              onClick={() => onRecipeClick(recipe._id)}
              aria-label={`View details for ${recipe.name}`}
            >
              {recipe.name}
            </button>
            <button
              onClick={() => onFavoriteToggle(recipe._id)}
              aria-label={isFavorite(recipe._id) ? `Remove ${recipe.name} from favorites` : `Add ${recipe.name} to favorites`}
              data-testid={`favorite-toggle-${recipe._id}`}
            >
              {isFavorite(recipe._id) ? 'Unfavorite' : 'Favorite'}
            </button>
          </div>
        ))}
      </div>
    );
  }),
}));

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

jest.mock('use-debounce', () => ({
  useDebounce: (value: string) => [value],
}));

jest.mock('../src/components/RecipeDetailModal', () => ({
  RecipeDetailModal: jest.fn(({ recipeId, isOpen }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-recipe-detail-modal">
        Modal Open for Recipe ID: {recipeId}
      </div>
    );
  }),
}));

let mockSelectOnValueChange: ((value: string) => void) | undefined;

jest.mock('../src/components/ui/select', () => ({
  __esModule: true,
  Select: jest.fn(({ children, value, onValueChange }) => {
    mockSelectOnValueChange = onValueChange;
    return (
      <div data-testid="mock-select" data-value={value}>
        {children}
      </div>
    );
  }),
  SelectTrigger: jest.fn(({ children }) => (
    <button data-testid="mock-select-trigger">{children}</button>
  )),
  SelectValue: jest.fn(({ placeholder }) => (
    <span data-testid="mock-select-value">{placeholder}</span>
  )),
  SelectContent: jest.fn(({ children }) => (
    <div data-testid="mock-select-content">{children}</div>
  )),
  SelectItem: jest.fn(({ children, value }) => (
    <button
      data-testid={`mock-select-item-${value}`}
      onClick={() => {
        if (typeof mockSelectOnValueChange === 'function') {
          mockSelectOnValueChange(value);
        }
      }}
    >
      {children}
    </button>
  )),
}));

const mockFavoriteIds = new Set<string>();
const mockToggleFavorite = jest.fn((id: string) => {
  if (mockFavoriteIds.has(id)) {
    mockFavoriteIds.delete(id);
  } else {
    mockFavoriteIds.add(id);
  }
  store['recipeFavorites'] = JSON.stringify(Array.from(mockFavoriteIds));
});
const mockIsFavorite = jest.fn((id: string) => mockFavoriteIds.has(id));

jest.mock('../src/hooks/useFavorites', () => ({
  useFavorites: () => ({
    favoriteIds: mockFavoriteIds,
    isFavorite: mockIsFavorite,
    toggleFavorite: mockToggleFavorite,
  }),
}));

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

describe('<App /> Integration Tests', () => {
  const mockUseQuery = useQuery as jest.Mock;

  beforeEach(() => {
    mockUseQuery.mockReset();
    store = {};
    if (jest.isMockFunction(RecipeList)) {
      (RecipeList as jest.Mock).mockClear();
    }
    if (jest.isMockFunction(RecipeDetailModal)) {
      (RecipeDetailModal as jest.Mock).mockClear();
    }
    mockSelectOnValueChange = undefined;
    (fetch as jest.Mock).mockClear();
    mockFavoriteIds.clear();
    mockToggleFavorite.mockClear();
    mockIsFavorite.mockClear();
  });

  it('renders the main application title and components', () => {
    mockUseQuery.mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
    });
    renderApp();

    expect(screen.getByRole('heading', { name: /recipe finder/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText(/Search recipes by ingredients/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /favorites/i })).toBeInTheDocument();
    expect(screen.getByTestId('mock-recipe-list-empty')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
    });
    renderApp();

    expect(screen.getByTestId('mock-recipe-list-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-recipe-list-error')).not.toBeInTheDocument();
  });

  it('displays error state when query fails', () => {
    const errorMessage = 'Failed to fetch recipes';
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: new Error(errorMessage),
      isLoading: false,
    });
    renderApp();

    expect(screen.getByTestId('mock-recipe-list-error')).toBeInTheDocument();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    expect(screen.queryByTestId('mock-recipe-list-loading')).not.toBeInTheDocument();
  });

  it('fetches recipes with search term when user types in search input', () => {
    const searchTerm = 'chicken';
    const mockInitialRecipes: Recipe[] = [
      { _id: 'r1', name: 'Recipe Fish', ingredients: ['fish'], instructions: 'cook fish' },
    ];
    const mockFilteredRecipes: Recipe[] = [
      { _id: 'c1', name: 'Chicken Recipe', ingredients: ['chicken'], instructions: 'cook chicken' }
    ];

    const mockQueryImplementation = (options: { queryKey: string[] }) => {
      const keySearchTerm = options.queryKey[1];
      if (keySearchTerm === searchTerm) {
        return { data: mockFilteredRecipes, error: null, isLoading: false };
      }
      return { data: mockInitialRecipes, error: null, isLoading: false };
    };
    mockUseQuery.mockImplementation(mockQueryImplementation);

    renderApp();

    const searchInput = screen.getByLabelText(/Search recipes by ingredients/i);
    fireEvent.change(searchInput, { target: { value: searchTerm } });

    const recipeListContainer = screen.getByTestId('mock-recipe-list-items');
    expect(recipeListContainer).toHaveTextContent('Chicken Recipe');
    expect(recipeListContainer).not.toHaveTextContent('Recipe Fish');

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['recipes', searchTerm, 'createdAt_desc'] })
    );
  });

  it('opens the detail modal when a recipe item is clicked', () => {
    const mockRecipesData: Recipe[] = [
      { _id: 'r1', name: 'Recipe One', ingredients: [], instructions: 'instr 1' },
      { _id: 'r2', name: 'Recipe Two', ingredients: [], instructions: 'instr 2' },
    ];
    mockUseQuery.mockReturnValue({
      data: mockRecipesData,
      error: null,
      isLoading: false,
    });

    renderApp();

    expect(screen.getByTestId('mock-recipe-list-items')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-recipe-detail-modal')).not.toBeInTheDocument();

    const firstRecipeButton = screen.getByRole('button', { name: /View details for Recipe One/i });
    fireEvent.click(firstRecipeButton);

    expect(RecipeDetailModal).toHaveBeenCalled();
    const modalContent = screen.getByTestId('mock-recipe-detail-modal');
    expect(modalContent).toBeInTheDocument();
    expect(modalContent).toHaveTextContent('Modal Open for Recipe ID: r1');
  });

  it('toggles favorite status and updates localStorage', () => {
    const mockRecipesData: Recipe[] = [
      { _id: 'r1', name: 'Recipe One', ingredients: [], instructions: 'instr 1' },
    ];
    mockUseQuery.mockReturnValue({ data: mockRecipesData, error: null, isLoading: false });
    renderApp();
    const favoriteButtonR1 = screen.getByTestId('favorite-toggle-r1');

    fireEvent.click(favoriteButtonR1);

    expect(JSON.parse(localStorageMock.getItem('recipeFavorites') || '[]')).toEqual(['r1']);

    fireEvent.click(favoriteButtonR1);

    expect(JSON.parse(localStorageMock.getItem('recipeFavorites') || '[]')).toEqual([]);
  });

  it('filters the list to show only favorites when "Favorites" button is clicked', async () => {
    const recipe1 = { _id: 'r1', name: 'Recipe One', ingredients: [], instructions: 'instr 1' };
    const recipe2 = { _id: 'r2', name: 'Recipe Two', ingredients: [], instructions: 'instr 2' };
    const recipe3 = { _id: 'r3', name: 'Recipe Three', ingredients: [], instructions: 'instr 3' };
    const mockRecipesData: Recipe[] = [recipe1, recipe2, recipe3];
    
    mockFavoriteIds.add('r2');

    mockUseQuery.mockReturnValue({ data: mockRecipesData, error: null, isLoading: false });

    renderApp();

    const listContainerInitial = screen.getByTestId('mock-recipe-list-items');
    expect(listContainerInitial).toHaveTextContent(recipe1.name);
    expect(listContainerInitial).toHaveTextContent(recipe2.name);
    expect(listContainerInitial).toHaveTextContent(recipe3.name);

    const favoritesFilterButton = screen.getByTitle(/show favorite recipes/i);
    fireEvent.click(favoritesFilterButton);

    await waitFor(() => {
      const listContainerFiltered = screen.getByTestId('mock-recipe-list-items');
      expect(listContainerFiltered).toHaveTextContent(recipe2.name);
      expect(listContainerFiltered).not.toHaveTextContent(recipe1.name);
      expect(listContainerFiltered).not.toHaveTextContent(recipe3.name);
    });

    const showAllButton = await screen.findByTitle(/show all recipes/i);
    expect(showAllButton).toBeInTheDocument();

    fireEvent.click(showAllButton);

    await waitFor(() => {
      const listContainerAll = screen.getByTestId('mock-recipe-list-items');
      expect(listContainerAll).toHaveTextContent(recipe1.name);
      expect(listContainerAll).toHaveTextContent(recipe2.name);
      expect(listContainerAll).toHaveTextContent(recipe3.name);
    });
  });

  it('refetches recipes with new sort order when sort option is changed', () => {
    const mockRecipesData: Recipe[] = [
      { _id: 'r1', name: 'B Recipe', ingredients: [], instructions: 'instr 1' },
      { _id: 'r2', name: 'A Recipe', ingredients: [], instructions: 'instr 2' },
    ];
    mockUseQuery.mockReturnValue({
      data: mockRecipesData,
      error: null,
      isLoading: false,
    });
    renderApp();

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['recipes', '', 'createdAt_desc'] })
    );

    const nameSortOption = screen.getByTestId('mock-select-item-name_asc');
    fireEvent.click(nameSortOption);

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['recipes', '', 'name_asc'],
      })
    );
  });
});
