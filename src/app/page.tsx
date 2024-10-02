'use client'

import Link from "next/link";
import {AuroraBackground} from "@/components/ui/aurora-background";
import React from "react";
import {ModeToggle} from "@/components/ui/theme-toggle";
import Image from "next/image";
import Footer from "@/components/ui/footer";
import {TextGenerateEffect} from "@/components/ui/text-generate-effect";

const steps = [
    {
        step: "Step 1",
        description: "Log in to your Spotify account to begin.",
    },
    {
        step: "Step 2",
        description: "Browse and discover music by your favorite artists.",
    },
    {
        step: "Step 3",
        description: "Create and organize a playlist with your selected songs.",
    },
    {
        step: "Step 4",
        description: "Share your playlists with friends and enjoy the music together.",
    },
];

const StepList = () => (
    <ul className="flex flex-col justify-center gap-4 mt-12 md:flex-row md:gap-8 md:text-white md:font-bold max-w-screen-lg">
        {steps.map((stepItem, index) => (
            <li className="text-left flex-1 max-w-sm" key={index}>
                <hr className="mx-auto w-full shrink-0 rounded border-0 bg-gray-100 dark:bg-gray-700 h-[2px] dark:md:mb-1 md:mb-1"/>
                <span className="text-gray-600 dark:text-gray-300">{stepItem.step}</span>
                <p className="break-words text-gray-700 dark:text-gray-300">{stepItem.description}</p>
            </li>
        ))}
    </ul>
);

export default function Home() {

    return (
        <main className="h-screen overflow-x-hidden text-center">
            <div
                className="absolute top-2 left-2 z-10 hidden flex-col items-center justify-center md:top-4 md:left-4 md:flex md:flex-row">
                <span className="text-black dark:text-white">made for</span>
                <Image className="ml-2 invert dark:white-filter dark:invert-0" src="/spotify.svg" alt="spotify logo"
                       width={24} height={24}></Image>
            </div>
            <div className="absolute top-2 right-2 z-10">
                <ModeToggle/>
            </div>
            <AuroraBackground>
                <TextGenerateEffect words={`Welcome to\n Listify!`}/>
                <StepList />
                <div className="mt-12 flex justify-center gap-2 z-10">
                    <Link
                        className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200"
                        href="/login"
                    >
                        Connect your Spotify
                    </Link>
                </div>
                <Footer/>
            </AuroraBackground>
        </main>
    )
        ;
}