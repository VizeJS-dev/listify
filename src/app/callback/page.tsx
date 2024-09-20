'use client';
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import generateRandomString from "@/services/generateRandomString";

export default function Callback() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get('code');

    const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string;
    const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET as string;
    const redirect_uri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI as string;
    const response_type = "code";
    const scope = "user-read-private user-read-email";

    const hasFetchedAccessToken = useRef(false);

    useEffect(() => {
        if (hasFetchedAccessToken.current) return;

        const accessToken = localStorage.getItem('spotify_access_token');
        console.log(code);
        if (accessToken) {
            // Token already exists, redirect to the dashboard
            router.push("/dashboard");
        } else if (code) {
            // Handle the callback from Spotify
            const fetchAccessToken = async () => {
                try {
                    const response = await fetch('https://accounts.spotify.com/api/token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Basic ' + btoa(`${client_id}:${client_secret}`)
                        },
                        body: new URLSearchParams({
                            code: code,
                            redirect_uri: redirect_uri,
                            grant_type: 'authorization_code'
                        })
                    });
                    console.log('Response:', response);
                    if (response.ok) {
                        const data = await response.json();
                        const accessToken = data.access_token;
                        // Store the access token in local storage
                        localStorage.setItem('spotify_access_token', accessToken);
                        // Redirect to the dashboard or another page
                        router.push("/dashboard");
                    } else {
                        const errorData = await response.json();
                        console.error('Failed to fetch access token', errorData);
                    }
                } catch (error) {
                    console.error('Error fetching access token', error);
                }
            };

            fetchAccessToken();
            hasFetchedAccessToken.current = true;
        } else {
            // Redirect to Spotify for authorization
            const state = generateRandomString(16);
            window.location.href = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=${response_type}&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`;
        }
    }); // Empty dependency array to run only once

    return null;
}