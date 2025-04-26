import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SearchInput } from '../SearchInput';

describe('SearchInput Component', () => {
    let mockOnSearchChange: jest.Mock;

    beforeEach(() => {
        mockOnSearchChange = jest.fn();
    });

    test('renders the input element with default placeholder', () => {
        render(<SearchInput onSearchChange={mockOnSearchChange} />);

        const inputElement = screen.getByRole('textbox', { name: /search recipes by ingredients/i });
        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveAttribute(
            'placeholder',
            'Enter ingredients (e.g., garlic, chicken)...',
        );
    });

    test('renders the input element with custom placeholder', () => {
        const customPlaceholder = 'Find your recipe...';
        render(
            <SearchInput
                onSearchChange={mockOnSearchChange}
                placeholder={customPlaceholder}
            />,
        );

        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toHaveAttribute('placeholder', customPlaceholder);
    });

    test('calls onSearchChange with the correct value when input changes', () => {
        render(<SearchInput onSearchChange={mockOnSearchChange} />);

        const inputElement = screen.getByRole('textbox');
        const testValue = 'chicken, tomatoes';

        fireEvent.change(inputElement, { target: { value: testValue } });

        expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
        expect(mockOnSearchChange).toHaveBeenCalledWith(testValue);
        expect(inputElement).toHaveValue(testValue);
    });

    test('has the correct aria-label', () => {
        render(<SearchInput onSearchChange={mockOnSearchChange} />);
        const inputElement = screen.getByRole('textbox');
        expect(screen.getByLabelText(/Search recipes by ingredients/i)).toBe(inputElement);
    });
});
