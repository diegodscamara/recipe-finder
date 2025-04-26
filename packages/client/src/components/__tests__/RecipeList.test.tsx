import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecipeList } from '../RecipeList';
import { RecipeCard } from '../RecipeCard';

jest.mock('../RecipeCard', () => ({
    RecipeCard: jest.fn(({ recipe, isFavorite, onCardClick, onFavoriteToggle }) => (
        <div data-testid={`recipe-card-${recipe._id}`}>
            <span>{recipe.name}</span>
            <button onClick={() => onCardClick(recipe._id)}>View</button>
            <button onClick={() => onFavoriteToggle(recipe._id)}>
                {isFavorite ? 'Unfavorite' : 'Favorite'}
            </button>
        </div>
    )),
}));

const mockRecipes = [
    { _id: '1', name: 'Recipe 1', imageUrl: 'url1' },
    { _id: '2', name: 'Recipe 2' },
    { _id: '3', name: 'Recipe 3', imageUrl: 'url3' },
];

const mockOnRecipeClick = jest.fn();
const mockIsFavorite = jest.fn((id) => id === '2');
const mockOnFavoriteToggle = jest.fn();

describe('RecipeList Component', () => {
    beforeEach(() => {
        mockOnRecipeClick.mockClear();
        mockIsFavorite.mockClear();
        mockOnFavoriteToggle.mockClear();
        (RecipeCard as jest.Mock).mockClear();
    });

    test('renders loading skeletons when isLoading is true', () => {
        render(
            <RecipeList
                recipes={[]}
                isLoading={true}
                error={null}
                onRecipeClick={mockOnRecipeClick}
                isFavorite={mockIsFavorite}
                onFavoriteToggle={mockOnFavoriteToggle}
            />,
        );

        const loadingContainer = screen.getByTestId('recipe-list-loading');
        const skeletons = loadingContainer.querySelectorAll('[data-slot="skeleton"]');
        expect(skeletons.length).toBeGreaterThan(1);
        expect(screen.queryByText(/error loading recipes/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/no recipes found/i)).not.toBeInTheDocument();
    });

    test('renders error message when error is present', () => {
        const errorMessage = 'Failed to fetch';
        render(
            <RecipeList
                recipes={[]}
                isLoading={false}
                error={new Error(errorMessage)}
                onRecipeClick={mockOnRecipeClick}
                isFavorite={mockIsFavorite}
                onFavoriteToggle={mockOnFavoriteToggle}
            />,
        );

        expect(screen.getByText(/error loading recipes/i)).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.queryByText(/no recipes found/i)).not.toBeInTheDocument();
    });

    test('renders "no recipes found" message when recipes array is empty and not loading', () => {
        render(
            <RecipeList
                recipes={[]}
                isLoading={false}
                error={null}
                onRecipeClick={mockOnRecipeClick}
                isFavorite={mockIsFavorite}
                onFavoriteToggle={mockOnFavoriteToggle}
            />,
        );

        expect(screen.getByText(/no recipes found/i)).toBeInTheDocument();
        expect(screen.queryByText(/error loading recipes/i)).not.toBeInTheDocument();
    });

    test('renders recipe cards with correct props when recipes are provided', () => {
        render(
            <RecipeList
                recipes={mockRecipes}
                isLoading={false}
                error={null}
                onRecipeClick={mockOnRecipeClick}
                isFavorite={mockIsFavorite}
                onFavoriteToggle={mockOnFavoriteToggle}
            />,
        );

        expect(RecipeCard).toHaveBeenCalledTimes(mockRecipes.length);

        expect(RecipeCard).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                recipe: mockRecipes[0],
                isFavorite: false,
                onCardClick: mockOnRecipeClick,
                onFavoriteToggle: mockOnFavoriteToggle,
            }),
            undefined
        );

        expect(RecipeCard).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                recipe: mockRecipes[1],
                isFavorite: true,
                onCardClick: mockOnRecipeClick,
                onFavoriteToggle: mockOnFavoriteToggle,
            }),
            undefined
        );

        expect(RecipeCard).toHaveBeenNthCalledWith(
            3,
            expect.objectContaining({
                recipe: mockRecipes[2],
                isFavorite: false,
                onCardClick: mockOnRecipeClick,
                onFavoriteToggle: mockOnFavoriteToggle,
            }),
            undefined
        );
    });
});
