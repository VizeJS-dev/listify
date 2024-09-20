'use client'

import React from "react";
import {motion} from "framer-motion";

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
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({card}) => {
    const id = card.id;

    return (
        <>
            <div className="p-2 flex flex-row md:flex-row items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer">
                <motion.div
                    key={card.name}
                    layoutId={`card-${card.name}-${id}`}
                    className="cursor-pointer"
                >
                    <motion.h3
                        layoutId={`title-${card.name}-${id}`}
                        className="font-bold text-neutral-700 text-left dark:text-neutral-200"
                    >
                        {card.name}
                    </motion.h3>
                    <motion.p
                        className="text-neutral-600 text-left dark:text-neutral-400"
                    >
                        {card.artists.map(artist => artist.name).join(', ')}
                    </motion.p>
                </motion.div>
            </div>
        </>
    );
};


export default ExpandableCard;