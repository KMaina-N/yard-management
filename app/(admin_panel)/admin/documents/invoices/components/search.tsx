'use client'
import React from "react";

type SearchProps = {
  onSearch: (searchTerm: string) => void;
};

const Search = ({ onSearch }: SearchProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap flex-grow">
      <input
        type="text"
        placeholder="Search by booking ID"
        className="flex-grow rounded-full border border-gray-100 px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch((e.target as HTMLInputElement).value);
          }
        }}
      />
    </div>
  );
};

export default Search;
