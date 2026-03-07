import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    isLoading?: boolean;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    onSearch,
    isLoading = false,
    placeholder = "Search academic papers..."
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400">
                    <Search className="h-5 w-5" />
                </div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-32 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 top-1.5 bottom-1.5 px-6 bg-[#0052cc] text-white rounded-md font-medium hover:bg-[#0747a6] transition-colors disabled:bg-slate-300"
                >
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
