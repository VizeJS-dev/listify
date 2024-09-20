'use client'

import { motion } from 'framer-motion'
import React, {useEffect, useState} from "react";
import SearchBar from "@/components/ui/search-bar";
import {AuroraBackground} from "@/components/ui/aurora-background";
import {ModeToggle} from "@/components/ui/theme-toggle";
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
}

export default function Dashboard() {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);

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
        return <p>Loading...</p>
    }

    const handleSearch = (tracks: Track[]) => {
        console.log(tracks);
        setTracks(tracks);
    };

    return (
        <main className="text-center">
            <AuroraBackground>
                <motion.div
                    initial={{opacity: 0.0, y: 40}}
                    whileInView={{opacity: 1, y: 0}}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="relative flex flex-col gap-4 items-center justify-center px-4"
                >
                </motion.div>
                <SearchBar onSearch={handleSearch}/>
                <ModeToggle/>
                <div className="relative h-3/4 w-2/4 flex flex-row gap-4 items-center justify-center px-4 py-2">
                    <div
                        className="relative m-2 flex h-full w-1/2 flex-col rounded-md bg-transparent">
                        {tracks.map((track: Track) => (
                            <ExpandableCard
                                key={track.id}
                                card={track}
                            />
                        ))}
                    </div>
                    <div
                        className="relative m-2 flex h-full w-1/2 flex-col rounded-md bg-transparent">
                    </div>
                </div>
            </AuroraBackground>
        </main>
    );
}