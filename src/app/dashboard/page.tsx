'use client';

import React, { useEffect, useRef, useState } from 'react';
import SearchBar from '@/components/ui/search-bar';
import { createSpotifyPlaylist, addTracksToPlaylist } from '@/services/spotifyService';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { ModeToggle } from '@/components/ui/theme-toggle';
import { useRouter } from 'next/navigation';
import Track from '@/types/track'
import TrackList from '@/components/ui/tracklist'

export default function Dashboard() {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const baseVolume = 0.03;

    useEffect(() => {
        const token = localStorage.getItem('spotify_access_token');
        const expiresAt = localStorage.getItem('spotify_expires_at');

        if (!token || !expiresAt || Date.now() > Number(expiresAt)) {
            router.replace('/login');
        }
        setAccessToken(token);
    }, [router]);

    if (!accessToken) {
        return <p>Loading...</p>;
    }

    const handleSearch = (trackResults: Track[]) => {
        const filteredTracks = trackResults.filter(
            track => !selectedTracks.some(selectedTrack => selectedTrack.id === track.id)
        ).slice(0, 14);
        setTracks(filteredTracks);
    };

    const handleCardClick = (track: Track) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setPlayingTrackId(null);
            setIsPlaying(false);
        }

        setSelectedTracks(prevSelectedTracks =>
            prevSelectedTracks.some(t => t.id === track.id)
                ? prevSelectedTracks.filter(t => t.id !== track.id)
                : [...prevSelectedTracks, track]
        );
        setTracks(prevTracks =>
            prevTracks.filter(t => t.id !== track.id)
        );
    };

    const handlePlayPause = (trackId: string, audio: HTMLAudioElement) => {
        if (playingTrackId === trackId) {
            setIsPlaying(!isPlaying);
        } else {
            if (audioRef.current) audioRef.current.pause();
            setPlayingTrackId(trackId);
            setIsPlaying(true);
        }
        audioRef.current = audio;
        audioRef.current.volume = baseVolume;
    };

    const handleAudioEnded = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setPlayingTrackId(null);
    };

    const handleCreatePlaylist = async () => {
        try {
            const playlistId = await createSpotifyPlaylist('My Playlist', true);
            if (playlistId) {
                await addTracksToPlaylist(playlistId, selectedTracks);
                console.log('Playlist created successfully and tracks added');
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

    return (
        <main className="text-center">
            <AuroraBackground>
                <SearchBar onSearch={handleSearch}/>
                <div className="absolute top-2 right-2">
                    <ModeToggle/>
                </div>
                <div className="relative flex w-3/4 flex-row items-start justify-center gap-4 px-4 py-2">
                    <TrackList
                        tracks={tracks}
                        handleCardClick={handleCardClick}
                        playingTrackId={playingTrackId}
                        isPlaying={isPlaying}
                        handlePlayPause={handlePlayPause}
                        handleAudioEnded={handleAudioEnded}
                        isAdded={() => false} // Tracks in the search results are not added
                    />
                    <TrackList
                        tracks={selectedTracks}
                        handleCardClick={handleCardClick}
                        playingTrackId={playingTrackId}
                        isPlaying={isPlaying}
                        handlePlayPause={handlePlayPause}
                        handleAudioEnded={handleAudioEnded}
                        isAdded={() => true} // Tracks in the selected list are considered added
                    />
                </div>
                {selectedTracks.length > 0 && <button
                    onClick={handleCreatePlaylist}
                    className="shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
                    Save Playlist
                </button>}
            </AuroraBackground>
        </main>
    );
}