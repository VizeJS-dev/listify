'use client';

import React, {useEffect, useRef, useState} from 'react';
import SearchBar from '@/components/ui/search-bar';
import {createSpotifyPlaylist, addTracksToPlaylist} from '@/services/spotifyService';
import {AuroraBackground} from '@/components/ui/aurora-background';
import {ModeToggle} from '@/components/ui/theme-toggle';
import {useRouter} from 'next/navigation';
import Track from '@/types/track';
import TrackList from '@/components/ui/tracklist';
import Footer from '@/components/ui/footer';
import {Button} from "@/components/ui/button";
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import {AnimatePresence, motion} from 'framer-motion';

export default function Dashboard() {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [playlistName, setPlaylistName] = useState<string>('');
    const [tracks, setTracks] = useState<Track[]>([]);
    const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [step, setStep] = useState<'setup' | 'finalize'>('setup');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const baseVolume = 0.03;

    const fetchAccessToken = async (router: AppRouterInstance) => {
        try {
            const token = localStorage.getItem('spotify_access_token');
            const expiresAt = localStorage.getItem('spotify_expires_at');
            if (!token || !expiresAt || Date.now() > Number(expiresAt)) {
                router.replace('/login');
                return null;
            }
            return token;
        } catch (error) {
            console.error('Error fetching access token:', error);
            return null;
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const token = await fetchAccessToken(router);
                if (token) {
                    setAccessToken(token);
                }
            } catch (error) {
                console.error('Error initializing access token:', error);
            }
        };
        init();
    }, [router]);

    if (!accessToken) {
        return <p>Loading...</p>;
    }

    const handleSearch = (trackResults: Track[]) => {
        const filteredTracks = trackResults.filter(
            track => !selectedTracks.some(selectedTrack => selectedTrack.id === track.id)
        ).slice(0, 20);
        setTracks(filteredTracks);
    };

    const handlePlaylistName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaylistName(e.target.value);
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

    const handleCreatePlaylist = async (name: string, isPublic: boolean) => {
        try {
            const playlistId = await createSpotifyPlaylist(name, isPublic);
            if (playlistId) {
                await addTracksToPlaylist(playlistId, selectedTracks);
                console.log('Playlist created successfully and tracks added');
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

    const handleNextStep = () => {
        setStep('finalize');
    };

    const handleBackStep = () => {
        setStep('setup');
    };

    return (
        <main className="text-center h-screen overflow-x-hidden">
            <AuroraBackground>
                <div className="absolute top-2 right-2 z-10">
                    <ModeToggle />
                </div>
                <AnimatePresence mode="wait">
                    {step === 'setup' && (
                        <motion.div
                            key="setup"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5 }}
                            className="relative flex flex-col items-center justify-between h-full w-full gap-4 px-4 py-2"
                        >
                            <SearchBar onSearch={handleSearch} />
                            <div className="relative flex w-full flex-1 flex-row items-start justify-center gap-4 px-4 py-2 h-[50%] overflow-hidden">
                                <TrackList
                                    tracks={tracks}
                                    handleCardClick={handleCardClick}
                                    playingTrackId={playingTrackId}
                                    isPlaying={isPlaying}
                                    handlePlayPause={handlePlayPause}
                                    handleAudioEnded={handleAudioEnded}
                                    isAdded={() => false}
                                />
                                <TrackList
                                    tracks={selectedTracks}
                                    handleCardClick={handleCardClick}
                                    playingTrackId={playingTrackId}
                                    isPlaying={isPlaying}
                                    handlePlayPause={handlePlayPause}
                                    handleAudioEnded={handleAudioEnded}
                                    isAdded={() => true}
                                />
                            </div>
                            {selectedTracks.length > 0 && (
                                <div className="z-10">
                                    <Button onClick={handleNextStep}>Next step</Button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {step === 'finalize' && (
                        <motion.div
                            key="finalize"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5 }}
                            className="relative flex h-full w-full items-center justify-center gap-4 px-4 py-2"
                        >
                            <div className="relative flex w-full flex-1 flex-row items-start justify-center gap-4 px-4 py-2 h-[50%] overflow-hidden">
                                <TrackList
                                    tracks={selectedTracks}
                                    handleCardClick={handleCardClick}
                                    playingTrackId={playingTrackId}
                                    isPlaying={isPlaying}
                                    handlePlayPause={handlePlayPause}
                                    handleAudioEnded={handleAudioEnded}
                                    isAdded={() => true}
                                />
                                <div className="mt-4 flex flex-col items-center">
                                    <input
                                        type="text"
                                        value={playlistName}
                                        onChange={handlePlaylistName}
                                        className="mb-2 p-2 border border-gray-300 rounded dark:text-white dark:bg-gray-800 dark:border-gray-600"
                                        placeholder="Give your playlist a name"
                                    />
                                    <Button onClick={() => handleCreatePlaylist(playlistName, true)}>Create Playlist</Button>
                                    <Button variant="secondary" onClick={handleBackStep} className="mt-2">Back</Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <Footer />
            </AuroraBackground>
        </main>
    );
}