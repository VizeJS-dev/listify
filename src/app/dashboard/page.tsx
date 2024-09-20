'use client'

import { motion } from 'framer-motion'
import React, {useEffect, useState} from "react";
import SearchBar from "@/components/ui/search-bar";
import {AuroraBackground} from "@/components/ui/aurora-background";
import {ModeToggle} from "@/components/ui/theme-toggle";
import { useRouter } from "next/navigation";


export default function Dashboard() {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);

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

    const handleSearch = (tracks: any[]) => {
        console.log(tracks);
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
                </motion.div>
            </AuroraBackground>
        </main>
    );
}