'use client'

import Link from "next/link";

export default function Home() {

    return (
        <main className="my-24 text-center">
            <h1 className="text-2xl">Listify</h1>
            <div className="flex gap-2 justify-center mt-12">
                <Link
                    className="inline-block py-3 px-6 rounded-md font-bold text-black bg-green-400"
                    href="/login"
                >
                    Connect your Spotify
                </Link>
                <Link
                    className="text-black inline-block py-3 px-6 rounded-md font-bold bg-gradient-to-tr from-teal-400 to-cyan-400"
                    href="/dashboard"
                >
                    Go to Dashboard
                </Link>
            </div>
        </main>
    );
}