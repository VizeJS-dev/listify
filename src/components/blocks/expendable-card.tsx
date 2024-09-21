'use client'

import React from "react";
import {AnimatePresence, motion} from "framer-motion";

interface Track {
    id: string;
    name: string;
    album: {
        name: string;
        images: { url: string }[];
    };
    artists: { name: string }[];
}

interface ExpandableCardProps {
    card: Track;
    delay?: number;
    onCardClick: (track: Track) => void;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({card, delay, onCardClick}) => {
    const id = card.id;

    return (
        <>
            <div
                className="p-2 flex flex-row md:flex-row items-center cursor-pointer"
                onClick={() => onCardClick(card)}
            >
                <AnimatePresence>
                    <motion.div
                        key={card.name}
                        layoutId={`card-${card.name}-${id}`}
                        className="cursor-pointer"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 50, opacity: 1 }} // Define exit animation
                        transition={{ duration: 0.5, ease: "easeOut", delay }}
                    >
                        <motion.h3
                            layoutId={`title-${card.name}-${id}`}
                            className="font-bold text-neutral-700 text-left text-wrap dark:text-neutral-200"
                        >
                            {card.name}
                        </motion.h3>
                        <motion.p
                            className="text-neutral-600 text-left text-wrap dark:text-neutral-400"
                        >
                            {card.artists.map(artist => artist.name).join(', ')}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    );
};


export default ExpandableCard;