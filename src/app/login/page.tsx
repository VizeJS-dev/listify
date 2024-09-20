'use client'

import { useEffect } from "react";
import generateRandomString from "@/services/generateRandomString";

const Login = () => {
    const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string;
    const redirect_uri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI as string;
    const response_type = "token";
    const scope = "user-read-private user-read-email";
    const state = generateRandomString(16);

    useEffect(() => {
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${encodeURIComponent(client_id)}&response_type=${encodeURIComponent(response_type)}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${encodeURIComponent(state)}&scope=${encodeURIComponent(scope)}`;

        // Save state to local storage to check it later in the callback
        localStorage.setItem('spotify_auth_state', state);

        window.location.href = authUrl;
    }, [client_id, redirect_uri, response_type, state, scope]);

    return null;
};

export default Login;