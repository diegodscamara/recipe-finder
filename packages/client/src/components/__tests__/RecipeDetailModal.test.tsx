import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecipeDetailModal } from '../RecipeDetailModal';
import { useQuery } from '@tanstack/react-query';

jest.mock('@tanstack/react-query');

const mockDialogState: { onOpenChange?: (open: boolean) => void } = {};
jest.mock('@/components/ui/dialog', () => ({
    __esModule: true,
    Dialog: ({ children, open, onOpenChange }:
        { children: React.ReactNode; open: boolean; onOpenChange?: (open: boolean) => void }
    ) => {
        mockDialogState.onOpenChange = onOpenChange;
        return open ? <div data-testid="dialog-mock">{children}</div> : null;
    },
    DialogContent: ({ children }: { children: React.ReactNode }) =>
        <div data-testid="dialog-content-mock">{children}</div>,
    DialogHeader: ({ children }: { children: React.ReactNode }) =>
        <div data-testid="dialog-header-mock">{children}</div>,
    DialogTitle: ({ children }: { children: React.ReactNode }) =>
        <h2 data-testid="dialog-title-mock">{children}</h2>,
    DialogDescription: ({ children }: { children: React.ReactNode }) =>
        <div data-testid="dialog-description-mock">{children}</div>,
    DialogFooter: ({ children }: { children: React.ReactNode }) =>
        <div data-testid="dialog-footer-mock">{children}</div>,
    DialogClose: ({ children }: { children: React.ReactNode }) => (
        <button
            data-testid="dialog-close-mock"
            onClick={() => {
                if (typeof mockDialogState.onOpenChange === 'function') {
                    mockDialogState.onOpenChange(false);
                }
            }}
        >
            {children}
        </button>
    ),
}));

const mockRecipeData = {
    _id: 'recipe1',
    name: 'Mock Recipe Title',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    instructions: 'Step 1. Do this.\nStep 2. Do that.',
    imageUrl: 'https://via.placeholder.com/150',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

describe('RecipeDetailModal Component', () => {
    const mockUseQuery = useQuery as jest.Mock;
    const mockOnClose = jest.fn();

    beforeEach(() => {
        mockUseQuery.mockReset();
        mockOnClose.mockClear();
        mockDialogState.onOpenChange = undefined;
    });

    test('does not render when isOpen is false', () => {
        mockUseQuery.mockReturnValue({ isLoading: false, error: null, data: null });
        render(
            <RecipeDetailModal recipeId="1" isOpen={false} onClose={mockOnClose} />,
        );
        expect(screen.queryByTestId('dialog-mock')).not.toBeInTheDocument();
    });

    test('renders loading state when isOpen and isLoading', () => {
        mockUseQuery.mockReturnValue({ isLoading: true, error: null, data: null });
        render(
            <RecipeDetailModal recipeId="1" isOpen={true} onClose={mockOnClose} />,
        );
        expect(screen.getByTestId('dialog-mock')).toBeInTheDocument();
        expect(screen.getByTestId('dialog-title-mock')).toBeInTheDocument();
        const descriptionContainer = screen.getByTestId('dialog-description-mock');
        const skeletons = descriptionContainer.querySelectorAll('[data-slot="skeleton"]');
        expect(skeletons.length).toBeGreaterThan(1);
        expect(screen.queryByText(/error loading/i)).not.toBeInTheDocument();
    });

    test('renders error state when isOpen and error occurs', () => {
        const errorMessage = 'Failed to fetch details';
        mockUseQuery.mockReturnValue({ isLoading: false, error: new Error(errorMessage), data: null });
        render(
            <RecipeDetailModal recipeId="1" isOpen={true} onClose={mockOnClose} />,
        );
        expect(screen.getByTestId('dialog-mock')).toBeInTheDocument();
        expect(screen.getByTestId('dialog-title-mock')).toBeInTheDocument();
        expect(screen.getByText(/error loading recipe details/i)).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.queryByText(/Ingredients:/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Instructions:/i)).not.toBeInTheDocument();
        expect(screen.queryByTestId('skeleton')).toBeNull();
    });

    test('renders recipe details when data is loaded successfully', () => {
        mockUseQuery.mockReturnValue({ isLoading: false, error: null, data: mockRecipeData });
        render(
            <RecipeDetailModal recipeId="recipe1" isOpen={true} onClose={mockOnClose} />,
        );
        expect(screen.getByTestId('dialog-mock')).toBeInTheDocument();
        expect(screen.getByTestId('dialog-title-mock')).toHaveTextContent(mockRecipeData.name);
        expect(screen.getByRole('img', { name: mockRecipeData.name })).toHaveAttribute('src', mockRecipeData.imageUrl);
        expect(screen.getByText(mockRecipeData.ingredients[0])).toBeInTheDocument();
        expect(screen.getByText(mockRecipeData.ingredients[1])).toBeInTheDocument();
        const instructionsParagraph = screen.getByText((_content, element) => {
            return element?.tagName.toLowerCase() === 'p' && element.textContent === mockRecipeData.instructions;
        });
        expect(instructionsParagraph).toBeInTheDocument();
        expect(screen.queryByText(/error loading/i)).not.toBeInTheDocument();
        expect(screen.queryByTestId('skeleton')).toBeNull();
    });

    test('calls onClose when close button is clicked', () => {
        mockUseQuery.mockReturnValue({ isLoading: false, error: null, data: mockRecipeData });
        render(
            <RecipeDetailModal recipeId="recipe1" isOpen={true} onClose={mockOnClose} />,
        );
        const closeButton = screen.getByTestId('dialog-close-mock');
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
}); 