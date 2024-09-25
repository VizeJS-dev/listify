'use client';

import {useEffect, useRef} from "react";
import {useRouter} from "next/navigation";

const Callback = () => {
    const router = useRouter();
    const hasCheckedAccessToken = useRef(false);

    useEffect(() => {
        if (hasCheckedAccessToken.current) return;

        // Check if the access token is in the URL hash fragment
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1)); // remove the leading '#'
        const token = params.get('access_token');
        const expiresIn = params.get('expires_in');
        const tokenState = params.get('state');

        if (token && expiresIn) {
            const expectedState = localStorage.getItem('spotify_auth_state');
            if (tokenState !== expectedState) {
                console.error('State mismatch');
                return;
            }

            // Calculate the exact expiry time
            const expiresAt = Date.now() + Number(expiresIn) * 1000;

            // Store the access token and expiry time in local storage
            localStorage.setItem('spotify_access_token', token);
            localStorage.setItem('spotify_expires_at', expiresAt.toString());

            // Clean up the state
            localStorage.removeItem('spotify_auth_state');

            // Redirect to the dashboard or another page
            router.push("/dashboard");
        } else {
            // Handle the case where there is no token
            // Provide user feedback or redirect to an error page
            console.error('No access token found');
            router.push("/error"); // Redirect to an error page or show some error message
        }

        hasCheckedAccessToken.current = true;
    }, [router]);

    return null; // or you can provide some UI feedback like "Handling authentication..."
};

export default Callback;