'use client'

import {AnimatePresence, motion} from 'framer-motion';
import React, {useEffect, useRef, useState} from "react";
import SearchBar from "@/components/ui/search-bar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { useRouter } from "next/navigation";
import ExpandableCard from "@/components/blocks/expendable-card";

interface Track {
    id: string;
    name: string;
    album: {
        name: string;
        images: { url: string }[];
    };
    artists: { name: string }[];
    preview_url?: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('spotify_access_token');
        const expiresAt = localStorage.getItem('spotify_expires_at');

        if (!token || !expiresAt || Date.now() > Number(expiresAt)) {
            router.replace('/login');
        } else {
            setAccessToken(token);
        }
    }, [router]);

    if (!accessToken) {
        return <p>Loading...</p>;
    }

    const handleSearch = (tracks: Track[]) => {
        setTracks(tracks);
    };

    const handleCardClick = (track: Track) => {
        if (selectedTracks.some(t => t.id === track.id)) {
            // Move from selectedTracks back to tracks
            setSelectedTracks(selectedTracks.filter(t => t.id !== track.id));
        } else {
            // Move from tracks to selectedTracks
            setTracks(tracks.filter(t => t.id !== track.id));
            setSelectedTracks([...selectedTracks, track]);
        }
    };

    const handlePlay = (trackId: string, audio: HTMLAudioElement) => {
        if (playingTrackId && playingTrackId !== trackId && audioRef.current) {
            audioRef.current.pause();
        }
        setPlayingTrackId(trackId);
        audioRef.current = audio;
    };

    const handleAudioEnded = () => {
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
                        ease: "easeInOut",
                    }}
                    className="relative flex flex-col gap-4 items-center justify-center px-4"
                >
                </motion.div>
                <SearchBar onSearch={handleSearch} />
                <div className="absolute top-2 right-2">
                    <ModeToggle />
                </div>
                <div className="relative h-3/4 w-2/4 flex flex-row gap-4 items-center justify-center px-4 py-2">
                    <div className="m-2 flex h-full w-1/2 flex-col rounded-md bg-transparent">
                        <AnimatePresence>
                            {tracks.map((track: Track, index) => (
                                <ExpandableCard
                                    key={track.id}
                                    card={track}
                                    delay={index * 0.15}
                                    onCardClick={handleCardClick}
                                    isPlaying={playingTrackId === track.id}
                                    onPlay={handlePlay}
                                    onAudioEnded={handleAudioEnded}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className="m-2 flex h-full w-1/2 flex-col rounded-md bg-transparent overflow-x-hidden">
                        <AnimatePresence>
                            {selectedTracks.map((track: Track) => (
                                <ExpandableCard
                                    key={track.id}
                                    card={track}
                                    onCardClick={handleCardClick}
                                    isPlaying={playingTrackId === track.id}
                                    onPlay={handlePlay}
                                    onAudioEnded={handleAudioEnded}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </AuroraBackground>
        </main>
    );
}