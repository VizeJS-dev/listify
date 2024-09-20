'use client'

import Image from "next/image";
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
    active: Track | null;
    card: Track;
    setActive: (track: Track | null) => void;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({ active, card, setActive}) => {
    const id = card.id;

    return (
        <>
            <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 h-full w-full z-10"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active ? (
                    <div className="fixed inset-0 grid place-items-center z-[100]">
                        <motion.button
                            key={`button-${active.name}-${id}`}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.05 } }}
                            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                            onClick={() => setActive(null)}
                        >
                            <CloseIcon />
                        </motion.button>
                        <motion.div
                            layoutId={`card-${active.name}-${id}`}
                            className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
                        >
                            <motion.div layoutId={`image-${active.name}-${id}`}>
                                <Image
                                    priority
                                    width={200}
                                    height={200}
                                    src={active.album.images[0].url}
                                    alt={active.name}
                                    className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                                />
                            </motion.div>
                            <div>
                                <div className="flex justify-between items-start p-4">
                                    <div>
                                        <motion.h3
                                            layoutId={`title-${active.name}-${id}`}
                                            className="font-bold text-neutral-700 dark:text-neutral-200"
                                        >
                                            {active.name}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${active.name}-${id}`}
                                            className="text-neutral-600 dark:text-neutral-400"
                                        >
                                            {active.artists.map(artist => artist.name).join(', ')}
                                        </motion.p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
            <div className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer">
                <motion.div
                    key={card.name}
                    layoutId={`card-${card.name}-${id}`}
                    className="cursor-pointer"
                    onClick={() => setActive(card)}
                >
                    <motion.h3
                        layoutId={`title-${card.name}-${id}`}
                        className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                        {card.name}
                    </motion.h3>
                    <motion.p
                        layoutId={`description-${card.name}-${id}`}
                        className="text-neutral-600 dark:text-neutral-400"
                    >
                        {card.artists.map(artist => artist.name).join(', ')}
                    </motion.p>
                </motion.div>
            </div>
        </>
    );
};

const CloseIcon: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-gray-900 dark:text-neutral-200"
        viewBox="0 0 20 20"
        fill="currentColor"
    >
        <path
            fillRule="evenodd"
            d="M10 8.707l5.646-5.647a.5.5 0 0 1 .708.708L10.707 9.414l5.646 5.647a.5.5 0 0 1-.708.707L10 10.121l-5.646 5.647a.5.5 0 0 1-.708-.707L9.293 9.414 3.646 3.767a.5.5 0 0 1 .708-.708L10 8.707z"
            clipRule="evenodd"
        />
    </svg>
);

export default ExpandableCard;