import React, {useRef, useEffect, useState, useCallback} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CirclePlus, CircleMinus, CirclePlay, CirclePause } from "lucide-react";
import Image from 'next/image';

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

interface ExpandableCardProps {
    card: Track;
    delay?: number;
    onCardClick: (track: Track) => void;
    isPlaying: boolean;
    isAdded: boolean;
    onPlayPause: (trackId: string, audio: HTMLAudioElement) => void;
    onAudioEnded: () => void;
}

const TrackCard: React.FC<ExpandableCardProps> = ({ card, delay, onCardClick, isPlaying, isAdded, onPlayPause, onAudioEnded}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying && audioRef.current.paused) {
                audioRef.current.play();
            } else if (!isPlaying && !audioRef.current.paused) {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    const togglePlayPause = useCallback(() => {
        if (audioRef.current) {
            onPlayPause(card.id, audioRef.current);
        }
    }, [onPlayPause, card.id]);

    const renderAddRemoveIcon = isAdded
        ? <CircleMinus className="dark:text-white cursor-pointer" onClick={() => onCardClick(card)} />
        : <CirclePlus className="dark:text-white cursor-pointer" onClick={() => onCardClick(card)} />;

    return (
        <div
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <AnimatePresence>
                {hovered && (
                    <motion.span
                        className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                        layoutId="hoverBackground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.15 } }}
                        exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                    />
                )}
            </AnimatePresence>
            <motion.div
                className="flex flex-row items-center justify-between relative z-10 rounded-lg p-2"
                initial={{ opacity: 0.0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    delay,
                    duration: 0.8,
                    ease: 'easeInOut',
                }}
            >
                <div className="flex items-center">
                    {card.album?.images?.[0] && (
                        <Image
                            src={card.album.images[0].url}
                            alt={card.name}
                            width={50}
                            height={50}
                            className="mr-4 rounded-lg"
                        />
                    )}
                    <div>
                        <motion.h3
                            className="font-bold text-neutral-700 text-left truncate dark:text-neutral-200"
                        >
                            {card.name}
                        </motion.h3>
                        <motion.p className="text-neutral-600 text-left dark:text-neutral-400">
                            {card.artists.map((artist) => artist.name).join(', ')}
                        </motion.p>
                    </div>
                </div>
                <div className="flex items-center">
                    {card.preview_url && (
                        <div
                            onClick={togglePlayPause}
                            className="cursor-pointer mr-2"
                            aria-label="Toggle play/pause"
                        >
                            {isPlaying ? (
                                <CirclePause className="dark:text-white" />
                            ) : (
                                <CirclePlay className="dark:text-white" />
                            )}
                        </div>
                    )}
                    {renderAddRemoveIcon}
                    <audio ref={audioRef} src={card.preview_url} onEnded={onAudioEnded} />
                </div>
            </motion.div>
        </div>
    );
};

export default TrackCard;