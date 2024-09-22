'use client'

import Link from "next/link";

export default function Home() {

    return (
        <main className="my-24 text-center">
            <h1 className="text-2xl">Listify</h1>
            <div className="mt-12 flex justify-center gap-2">
                <Link
                    className="inline-block rounded-md bg-green-400 px-6 py-3 font-bold text-black"
                    href="/login"
                >
                    Connect your Spotify
                </Link>
                <Link
                    className="inline-block rounded-md bg-gradient-to-tr from-teal-400 to-cyan-400 px-6 py-3 font-bold text-black"
                    href="/dashboard"
                >
                    Go to Dashboard
                </Link>
            </div>
        </main>
    );
}