import React, { useRef, useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CirclePlus, CircleMinus, CirclePlay, CirclePause } from "lucide-react";
import Image from 'next/image';
import Track from '@/types/track'
import type { TrackEnhanced } from '@/types/track'
import { isTrackEnhanced } from '@/types/track'

type TrackLike = Track | TrackEnhanced;

interface ExpandableCardProps {
    card: TrackLike;
    delay?: number;
    onCardClick: (track: TrackLike) => void;
    isPlaying: boolean;
    isAdded: boolean;
    onPlayPause: (trackId: string, audio: HTMLAudioElement) => void;
    onAudioEnded: () => void;
}

const TrackCard: React.FC<ExpandableCardProps> = ({
                                                      card,
                                                      delay,
                                                      onCardClick,
                                                      isPlaying,
                                                      isAdded,
                                                      onPlayPause,
                                                      onAudioEnded
                                                  }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            if (isPlaying && audioElement.paused) {
                audioElement.play();       
            } else if (!isPlaying && !audioElement.paused) {
                audioElement.pause();
            }
        }
    }, [isPlaying]);

    const togglePlayPause = useCallback(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            onPlayPause(card.id, audioElement);
        }
    }, [onPlayPause, card.id]);

    const renderAddRemoveIcon = isAdded
        ? <CircleMinus className="cursor-pointer dark:text-white" onClick={() => onCardClick(card)} />
        : <CirclePlus className="cursor-pointer dark:text-white" onClick={() => onCardClick(card)} />;

    const containerClasses = isTrackEnhanced(card)
        ? "relative z-10 flex flex-row items-center justify-between rounded-lg p-2 border border-neutral-200/60 shadow-sm dark:border-neutral-700/60"
        : "relative z-10 flex flex-row items-center justify-between rounded-lg p-2";

    const showPlayPause = card.preview_url && !(isTrackEnhanced(card) && card.isPlayableOverride === false);

    return (
        <div
            className="relative block h-full w-full p-2 group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <AnimatePresence>
                {hovered && (
                    <motion.span
                        className="absolute inset-0 block h-full w-full rounded-3xl bg-neutral-200 dark:bg-slate-800/[0.8]"
                        layoutId="hoverBackground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.15 } }}
                        exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                    />
                )}
            </AnimatePresence>
            <motion.div
                className={containerClasses}
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
                        <motion.h3 className="overflow-hidden text-ellipsis text-left font-bold text-neutral-700 dark:text-neutral-200">
                            {card.name}
                            {isTrackEnhanced(card) && card.badge && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                    {card.badge}
                                </span>
                            )}
                        </motion.h3>
                        <motion.p className="text-left text-neutral-600 dark:text-neutral-400">
                            {card.artists.map(artist => artist.name).join(', ')}
                        </motion.p>
                    </div>
                </div>
                <div className="flex items-center">
                    {showPlayPause && (
                        <div
                            onClick={togglePlayPause}
                            className="mr-2 cursor-pointer"
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