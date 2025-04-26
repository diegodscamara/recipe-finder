import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecipeCard } from '../RecipeCard';

// --- Mocks ---
jest.mock('lucide-react', () => ({
    __esModule: true,
    Star: () => <span data-testid="star-icon" />,
}));

const mockRecipe = {
    _id: 'recipe-123',
    name: 'Test Recipe Name',
    imageUrl: 'https://placehold.co/300x160',
};

const mockRecipeNoImage = {
    _id: 'recipe-456',
    name: 'Another Recipe',
};

describe('RecipeCard Component', () => {
    let mockOnCardClick: jest.Mock;
    let mockOnFavoriteToggle: jest.Mock;

    beforeEach(() => {
        mockOnCardClick = jest.fn();
        mockOnFavoriteToggle = jest.fn();
    });

    test('renders recipe name and image when imageUrl is provided', () => {
        render(
            <RecipeCard
                recipe={mockRecipe}
                isFavorite={false}
                onCardClick={mockOnCardClick}
                onFavoriteToggle={mockOnFavoriteToggle}
            />,
        );

        expect(screen.getByText(mockRecipe.name)).toBeInTheDocument();
        const image = screen.getByRole('img', { name: mockRecipe.name });
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', mockRecipe.imageUrl);
    });

    test('renders recipe name and placeholder when imageUrl is missing', () => {
        render(
            <RecipeCard
                recipe={mockRecipeNoImage}
                isFavorite={false}
                onCardClick={mockOnCardClick}
                onFavoriteToggle={mockOnFavoriteToggle}
            />,
        );

        expect(screen.getByText(mockRecipeNoImage.name)).toBeInTheDocument();
        expect(screen.getByText('No Image')).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    test('renders favorite button correctly (not favorited)', () => {
        render(
            <RecipeCard
                recipe={mockRecipe}
                isFavorite={false}
                onCardClick={mockOnCardClick}
                onFavoriteToggle={mockOnFavoriteToggle}
            />,
        );

        const favoriteButton = screen.getByRole('button', { name: /add .* to favorites/i });
        expect(favoriteButton).toBeInTheDocument();
        expect(favoriteButton).toHaveAttribute('aria-label', `Add ${mockRecipe.name} to favorites`);
    });

    test('renders favorite button correctly (favorited)', () => {
        render(
            <RecipeCard
                recipe={mockRecipe}
                isFavorite={true}
                onCardClick={mockOnCardClick}
                onFavoriteToggle={mockOnFavoriteToggle}
            />,
        );

        const favoriteButton = screen.getByRole('button', { name: /remove .* from favorites/i });
        expect(favoriteButton).toBeInTheDocument();
        expect(favoriteButton).toHaveAttribute('aria-label', `Remove ${mockRecipe.name} from favorites`);
    });

    test('calls onCardClick with recipe ID when card is clicked', () => {
        render(
            <RecipeCard
                recipe={mockRecipe}
                isFavorite={false}
                onCardClick={mockOnCardClick}
                onFavoriteToggle={mockOnFavoriteToggle}
            />,
        );

        const cardElement = screen.getByRole('button', { name: `View details for ${mockRecipe.name}` });
        fireEvent.click(cardElement);

        expect(mockOnCardClick).toHaveBeenCalledTimes(1);
        expect(mockOnCardClick).toHaveBeenCalledWith(mockRecipe._id);
        expect(mockOnFavoriteToggle).not.toHaveBeenCalled();
    });

    test('calls onFavoriteToggle with recipe ID when favorite button is clicked', () => {
        render(
            <RecipeCard
                recipe={mockRecipe}
                isFavorite={false}
                onCardClick={mockOnCardClick}
                onFavoriteToggle={mockOnFavoriteToggle}
            />,
        );

        const favoriteButton = screen.getByRole('button', { name: /add .* to favorites/i });
        fireEvent.click(favoriteButton);

        expect(mockOnFavoriteToggle).toHaveBeenCalledTimes(1);
        expect(mockOnFavoriteToggle).toHaveBeenCalledWith(mockRecipe._id);
        expect(mockOnCardClick).not.toHaveBeenCalled();
    });

    test('calls onCardClick when Enter key is pressed on the card', () => {
        render(
            <RecipeCard
                recipe={mockRecipe}
                isFavorite={false}
                onCardClick={mockOnCardClick}
                onFavoriteToggle={mockOnFavoriteToggle}
            />,
        );

        const cardElement = screen.getByRole('button', { name: `View details for ${mockRecipe.name}` });
        fireEvent.keyDown(cardElement, { key: 'Enter', code: 'Enter' });

        expect(mockOnCardClick).toHaveBeenCalledTimes(1);
        expect(mockOnCardClick).toHaveBeenCalledWith(mockRecipe._id);
    });
});
