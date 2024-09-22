import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TrackCard from '@/components/blocks/track';
import Track from '@/types/track'

interface TrackListProps {
    tracks: Track[];
    handleCardClick: (track: Track) => void;
    playingTrackId: string | null;
    isPlaying: boolean;
    handlePlayPause: (trackId: string, audio: HTMLAudioElement) => void;
    handleAudioEnded: () => void;
    isAdded: (track: Track) => boolean; // A function to check if a track is added
}

const TrackList: React.FC<TrackListProps> = ({
                                                 tracks,
                                                 handleCardClick,
                                                 playingTrackId,
                                                 isPlaying,
                                                 handlePlayPause,
                                                 handleAudioEnded,
                                                 isAdded,
                                             }) => {
    return (
        <div className="flex w-1/2 flex-col overflow-y-auto overflow-x-hidden rounded-md bg-transparent p-2 min-h-[36rem] max-h-[36rem] custom-scrollbar">
            <AnimatePresence initial={false}>
                {tracks.map((track, index) => (
                    <motion.div
                        key={track.id}
                        layout
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ type: 'tween', duration: 0.2 }}
                    >
                        <TrackCard
                            card={track}
                            delay={0.15 * index}
                            onCardClick={handleCardClick}
                            isPlaying={playingTrackId === track.id && isPlaying}
                            isAdded={isAdded(track)}
                            onPlayPause={handlePlayPause}
                            onAudioEnded={handleAudioEnded}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default TrackList;