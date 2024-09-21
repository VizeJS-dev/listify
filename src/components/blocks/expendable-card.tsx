'use client'

import React, { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CirclePlus, CirclePlay, CirclePause } from "lucide-react";

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

interface ExpandableCardProps {
    card: Track;
    delay?: number;
    onCardClick: (track: Track) => void;
    isPlaying: boolean;
    onPlay: (trackId: string, audio: HTMLAudioElement) => void;
    onAudioEnded: () => void;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({ card, delay, onCardClick, isPlaying, onPlay, onAudioEnded }) => {
    const id = card.id;
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play();
        } else if (audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    const togglePlay = () => {
        if (audioRef.current) {
            onPlay(id, audioRef.current);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="flex flex-row items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay }}
            >
                <motion.div key={card.name} layoutId={`card-${card.name}-${id}`}>
                    <motion.h3
                        layoutId={`title-${card.name}-${id}`}
                        className="font-bold text-neutral-700 text-left text-wrap dark:text-neutral-200"
                    >
                        {card.name}
                    </motion.h3>
                    <motion.p className="text-neutral-600 text-left text-wrap dark:text-neutral-400">
                        {card.artists.map(artist => artist.name).join(", ")}
                    </motion.p>
                </motion.div>
                <motion.div className="flex justify-center items-center">
                    {card.preview_url && (
                        <div onClick={togglePlay} className="cursor-pointer mr-2">
                            {isPlaying ? (
                                <CirclePause className="dark:text-white" />
                            ) : (
                                <CirclePlay className="dark:text-white" />
                            )}
                        </div>
                    )}
                    <CirclePlus
                        className="dark:text-white cursor-pointer"
                        onClick={() => onCardClick(card)}
                    />
                    <audio ref={audioRef} src={card.preview_url} onEnded={onAudioEnded} />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ExpandableCard;