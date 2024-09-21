'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import SearchBar from '@/components/ui/search-bar';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { ModeToggle } from '@/components/ui/theme-toggle';
import { useRouter } from 'next/navigation';
import ExpandableCard from '@/components/blocks/expendable-card';

interface Artist {
    name: string;
}

interface Album {
    images: { url: string }[];
}

interface Track {
    id: string;
    name: string;
    preview_url?: string;
    artists: Artist[];
    album: Album;
}

export default function Dashboard() {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Check for access token and its expiry
    useEffect(() => {
        const token = localStorage.getItem('spotify_access_token');
        const expiresAt = localStorage.getItem('spotify_expires_at');

        if (!token || !expiresAt || Date.now() > Number(expiresAt)) {
            router.replace('/login');
        }
        setAccessToken(token);
    }, [router]);

    // Render loading state if no access token
    if (!accessToken) {
        return <p>Loading...</p>;
    }

    // Handle search results
    const handleSearch = (trackResults: Track[]) => {
        const filteredTracks = trackResults.filter(
            track => !selectedTracks.some(selectedTrack => selectedTrack.id === track.id)
        ).slice(0, 14); // Limit to the next 10 tracks that are not already in the selected tracks list
        setTracks(filteredTracks);
    };

    // Handle card click (toggle selection)
    const handleCardClick = (track: Track) => {
        setSelectedTracks(prevSelectedTracks =>
            prevSelectedTracks.some(t => t.id === track.id)
                ? prevSelectedTracks.filter(t => t.id !== track.id)
                : [...prevSelectedTracks, track]
        );
        setTracks(prevTracks =>
            prevTracks.filter(t => t.id !== track.id)
        );
    };

    // Handle play/pause actions
    const handlePlayPause = (trackId: string, audio: HTMLAudioElement) => {
        if (playingTrackId === trackId) {
            setIsPlaying(!isPlaying);
        } else {
            if (audioRef.current) audioRef.current.pause();
            setPlayingTrackId(trackId);
            setIsPlaying(true);
        }
        audioRef.current = audio;
    };

    // Handle audio end event
    const handleAudioEnded = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setPlayingTrackId(null);
    };

    return (
        <main className="text-center">
            <AuroraBackground>
                <motion.div
                    initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: 'easeInOut',
                    }}
                    className="relative flex flex-col gap-4 items-center justify-center px-4"
                >
                </motion.div>
                <SearchBar onSearch={handleSearch} />
                <div className="absolute top-2 right-2">
                    <ModeToggle />
                </div>
                <div className="relative w-3/4 flex flex-row gap-4 items-start justify-center px-4 py-2">
                    <div className="p-2 w-1/2 flex flex-col bg-transparent rounded-md overflow-y-auto overflow-x-hidden min-h-[36rem] max-h-[36rem] custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {tracks.map((track, index) => (
                                <motion.div
                                    key={track.id}
                                    layout
                                    initial={{ opacity: 0, x: -40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 40 }}
                                    transition={{ type: 'tween', duration: 0.2 }}
                                >
                                    <ExpandableCard
                                        card={track}
                                        delay={0.15 * index}
                                        onCardClick={handleCardClick}
                                        isPlaying={playingTrackId === track.id && isPlaying}
                                        isAdded={false}
                                        onPlayPause={handlePlayPause}
                                        onAudioEnded={handleAudioEnded}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className="p-2 w-1/2 flex flex-col bg-transparent rounded-md overflow-y-auto overflow-x-hidden min-h-[36rem] max-h-[36rem] custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {selectedTracks.map((track) => (
                                <motion.div
                                    key={track.id}
                                    layout
                                    initial={{ opacity: 0, x: -40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -40 }}
                                    transition={{ type: 'tween', duration: 0.2 }}
                                >
                                    <ExpandableCard
                                        card={track}
                                        delay={0.1}
                                        onCardClick={handleCardClick}
                                        isPlaying={playingTrackId === track.id && isPlaying}
                                        isAdded={true}
                                        onPlayPause={handlePlayPause}
                                        onAudioEnded={handleAudioEnded}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </AuroraBackground>
        </main>
    );
}