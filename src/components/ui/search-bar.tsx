'use client'

import React, {useState} from "react";
import {searchTracks as clientSearchTracks} from "../../services/spotifyService";
import {PlaceholdersAndVanishInput} from "@/components/ui/placeholders-and-vanish-input";

interface SearchBarProps {
    onSearch: (tracks: any[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({onSearch}) => {
    const placeholders = ['Enter a Song, Album or Artist']
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
        <PlaceholdersAndVanishInput placeholders={placeholders} onSubmit={handleSubmit} onChange={handleChange}/>
    );
};

export default SearchBar;