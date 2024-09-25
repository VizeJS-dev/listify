import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const socialMedia = [
    {
        id: 1,
        img: "/git.svg",
        link: "https://github.com/VizeJS-dev"
    },
    {
        id: 2,
        img: "/link.svg",
        link: "https://www.linkedin.com/in/garik-sandrosyan-5b010a2b3/"
    },
    {
        id: 3,
        img: "/insta.svg",
        link: "https://www.instagram.com/garik.sandros/"
    }
];

const Footer = () => {
    return (
        <footer className="absolute bottom-4 left-4 md:bottom-4 md:left-4 md:right-auto w-full md:w-auto" id="contact">
            <div className="flex items-center gap-6 md:gap-3 justify-center md:justify-start">
                {socialMedia.map((profile) => (
                    <Button
                        key={profile.id}
                        variant="ghost"
                        size="icon"
                        className="rounded-lg bg-opacity-75 backdrop-blur-lg backdrop-filter saturate-180 bg-black-200 dark:bg-white-200"
                    >
                        <a href={profile.link} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full h-full">
                            <Image
                                src={profile.img}
                                alt="icons"
                                width={20}
                                height={20}
                                className="w-auto h-auto dark:white-filter dark:invert-0 invert"
                            />
                            <span className="sr-only">{`Social media profile ${profile.id}`}</span>
                        </a>
                    </Button>
                ))}
            </div>
        </footer>
    );
};

export default Footer;