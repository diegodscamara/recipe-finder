import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../useFavorites';
import { useMutation } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useMutation: jest.fn(),
}));

let store: Record<string, string> = {};
const localStorageMock = (() => {
    return {
        getItem(key: string) {
            return store[key] || null;
        },
        setItem(key: string, value: string) {
            store[key] = value.toString();
        },
        removeItem(key: string) {
            delete store[key];
        },
        clear() {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('useFavorites Hook', () => {
    const mockMutate = jest.fn();

    beforeEach(() => {
        store = {};
        mockMutate.mockClear();
        (useMutation as jest.Mock).mockReturnValue({
            mutate: mockMutate,
            isLoading: false,
            isError: false,
            error: null,
            isSuccess: false,
        });
    });

    test('should initialize with empty Set if localStorage is empty', () => {
        const { result } = renderHook(() => useFavorites());

        expect(result.current.favoriteIds).toEqual(new Set());
    });

    test('should initialize with favorites from localStorage', () => {
        const initialFavorites = ['id1', 'id2'];
        localStorage.setItem('recipeFavorites', JSON.stringify(initialFavorites));

        const { result } = renderHook(() => useFavorites());

        expect(result.current.favoriteIds).toEqual(new Set(initialFavorites));
    });

    test('isFavorite should return true for a favorited ID', () => {
        const initialFavorites = ['id1'];
        localStorage.setItem('recipeFavorites', JSON.stringify(initialFavorites));
        const { result } = renderHook(() => useFavorites());

        expect(result.current.isFavorite('id1')).toBe(true);
    });

    test('isFavorite should return false for a non-favorited ID', () => {
        const { result } = renderHook(() => useFavorites());

        expect(result.current.isFavorite('idNonExistent')).toBe(false);
    });

    test('toggleFavorite should add an ID to favorites and localStorage', () => {
        const { result } = renderHook(() => useFavorites());
        const testId = 'newId';

        act(() => {
            result.current.toggleFavorite(testId);
        });

        expect(result.current.favoriteIds).toContain(testId);
        expect(localStorage.getItem('recipeFavorites')).toBe(JSON.stringify([testId]));
        expect(mockMutate).toHaveBeenCalledWith(testId);
    });

    test('toggleFavorite should remove an ID from favorites and localStorage', () => {
        const testId = 'existingId';
        localStorage.setItem('recipeFavorites', JSON.stringify([testId]));
        const { result } = renderHook(() => useFavorites());

        expect(result.current.favoriteIds).toContain(testId);

        act(() => {
            result.current.toggleFavorite(testId);
        });

        expect(result.current.favoriteIds).not.toContain(testId);
        expect(localStorage.getItem('recipeFavorites')).toBe(JSON.stringify([]));
        expect(mockMutate).toHaveBeenCalledWith(testId);
    });

    test('toggleFavorite should call mutate function from useMutation', () => {
        const { result } = renderHook(() => useFavorites());
        const testId = 'anotherId';

        act(() => {
            result.current.toggleFavorite(testId);
        });

        expect(mockMutate).toHaveBeenCalledTimes(1);
        expect(mockMutate).toHaveBeenCalledWith(testId);
    });
}); 