'use client'

import React, { useState } from "react";
import { searchTracks as clientSearchTracks } from "../../services/spotifyService";

interface SearchBarProps {
    onSearch: (tracks: any[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const tracks = await clientSearchTracks(query);
            onSearch(tracks);
        } catch (error) {
            console.error('Error searching tracks:', error);
        }
        setQuery(""); // reset the query for the next search
    };

    return (
        <div className="flex mb-2" id="searchbar">
            <form onSubmit={handleSubmit} className="flex items-center">
                <input
                    className="h-14 rounded-md bg-spotify-black border pl-2 text-spotify-1 font-jakarta"
                    name="search"
                    id="search"
                    onChange={handleChange}
                    value={query}
                    type="text"
                    placeholder="Enter a song name"
                    autoComplete="off"
                />
                <button type="submit"
                        className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200">
                    Spotify
                </button>
            </form>
        </div>
    );
};

export default SearchBar;