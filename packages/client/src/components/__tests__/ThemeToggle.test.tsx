import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeToggle } from '../ThemeToggle';
import { useThemeStore } from '@/store/themeStore';

jest.mock('lucide-react', () => ({
    Sun: () => <span data-testid="icon-sun">Sun Icon</span>,
    Moon: () => <span data-testid="icon-moon">Moon Icon</span>,
    __esModule: true,
}));

jest.mock('@/store/themeStore');

describe('ThemeToggle Component', () => {
    const mockSetTheme = jest.fn();
    const mockUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>;

    beforeEach(() => {
        mockSetTheme.mockClear();
        mockUseThemeStore.mockReturnValue({
            theme: 'light',
            setTheme: mockSetTheme,
        } as unknown as ReturnType<typeof useThemeStore>);
    });

    test('renders Sun icon and correct title/aria when theme is light', () => {
        render(<ThemeToggle />);

        expect(screen.getByTitle('Switch to Dark Theme')).toBeInTheDocument();
        expect(screen.getByLabelText(/Current theme: light. Switch to Dark Theme/i)).toBeInTheDocument();
        expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
        expect(screen.queryByTestId('icon-moon')).not.toBeInTheDocument();
    });

    test('renders Moon icon and correct title/aria when theme is dark', () => {
        mockUseThemeStore.mockReturnValue({
            theme: 'dark',
            setTheme: mockSetTheme,
        } as unknown as ReturnType<typeof useThemeStore>);
        render(<ThemeToggle />);

        expect(screen.getByTitle('Switch to Light Theme')).toBeInTheDocument();
        expect(screen.getByLabelText(/Current theme: dark. Switch to Light Theme/i)).toBeInTheDocument();
        expect(screen.getByTestId('icon-moon')).toBeInTheDocument();
        expect(screen.queryByTestId('icon-sun')).not.toBeInTheDocument();
    });

    test('calls setTheme with "dark" when clicked and current theme is light', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button');

        fireEvent.click(button);

        expect(mockSetTheme).toHaveBeenCalledTimes(1);
        expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    test('calls setTheme with "light" when clicked and current theme is dark', () => {
        mockUseThemeStore.mockReturnValue({
            theme: 'dark',
            setTheme: mockSetTheme,
        } as unknown as ReturnType<typeof useThemeStore>);
        render(<ThemeToggle />);
        const button = screen.getByRole('button');

        fireEvent.click(button);

        expect(mockSetTheme).toHaveBeenCalledTimes(1);
        expect(mockSetTheme).toHaveBeenCalledWith('light');
    });
}); 