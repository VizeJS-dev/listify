'use client'

import { motion } from 'framer-motion'
import React from "react";
import SearchBar from "@/components/ui/search-bar";
import {AuroraBackground} from "@/components/ui/aurora-background";

export default function Dashboard() {
    const handleSearch = (tracks: any[]) => {
        console.log(tracks);
    };


    return (
        <main className="text-center">
            <AuroraBackground className="bg-black">
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
                </motion.div>
            </AuroraBackground>
        </main>
    );
}