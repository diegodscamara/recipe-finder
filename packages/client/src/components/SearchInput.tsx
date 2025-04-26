import React, { useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearchChange,
  placeholder = 'Enter ingredients (e.g., garlic, chicken)...',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    onSearchChange(newSearchTerm);
  };

  return (
    <div className="mb-4 w-full max-w-lg">
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        aria-label="Search recipes by ingredients"
        className="w-full"
      />
    </div>
  );
};
