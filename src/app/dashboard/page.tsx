'use client'

import { motion } from 'framer-motion'
import React, {useEffect, useState, useRef} from "react";
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
    const [active, setActive] = useState<Track | null>(null);

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
                    initial={{ opacity: 0.0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="relative flex flex-col gap-4 items-center justify-center px-4"
                >
                    <SearchBar onSearch={handleSearch}/>
                    <ModeToggle/>
                    {tracks.map((track: Track) => (
                        <ExpandableCard
                            key={track.id}
                            active={active}
                            card={track}
                            setActive={setActive}
                        />
                    ))}
                </motion.div>
            </AuroraBackground>
        </main>
    );
}