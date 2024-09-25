import React from "react";
import Image from "next/image";
import {Button} from "@/components/ui/button";

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
        <footer className="absolute bottom-2 left-2 md:bottom-4 md:left-4" id="contact">
            <div className="flex items-center justify-center gap-1 md:justify-start md:gap-3">
                {socialMedia.map((profile) => (
                    <Button
                        key={profile.id}
                        variant="ghost"
                        size="icon"
                        className="rounded-lg bg-opacity-75 backdrop-blur-lg backdrop-filter saturate-180 bg-black-200 dark:bg-white-200"
                    >
                        <a href={profile.link} target="_blank" rel="noreferrer"
                           className="flex h-full w-full items-center justify-center">
                            <Image
                                src={profile.img}
                                alt="icons"
                                width={20}
                                height={20}
                                className="h-auto w-auto invert dark:white-filter dark:invert-0"
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