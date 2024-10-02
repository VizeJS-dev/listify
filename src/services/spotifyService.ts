interface Artist {
    name: string;
}

interface Album {
    images: { url: string }[];
}

interface Track {
    id: string;
    name: string;
    preview_url?: string;
    artists: Artist[];
    album: Album;
    uri: string;
}

interface TracksResponse {
    tracks: {
        items: Track[];
    };
}

interface UserResponse {
    id: string;
    display_name: string;
}

const logResponseErrors = async (response: Response) => {
    try {
        const errorData = await response.json();
        console.error('Error details:', errorData);
    } catch (err) {
        console.error('Error parsing error response:', err);
    }
};

export const searchTracks = async (query: string): Promise<Track[]> => {
    let accessToken: string | null = null;
    if (typeof window !== "undefined") {
        accessToken = localStorage.getItem('spotify_access_token');
    }

    if (!accessToken) {
        console.error('Error in searchTracks function: No access token found');
        return [];
    }

    try {
        console.log(`Access Token: ${accessToken}`);
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=50`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            console.error(`Response error in searchTracks function: ${response.status} ${response.statusText}`);
            await logResponseErrors(response);  // Log detailed error
            return [];
        }

        const data: TracksResponse = await response.json();
        return data.tracks.items;
    } catch (error) {
        console.error('Error in searchTracks function:', error);
        return [];
    }
};

export const getUser = async (): Promise<UserResponse | null> => {
    let accessToken: string | null = null;
    if (typeof window !== "undefined") {
        accessToken = localStorage.getItem('spotify_access_token');
    }

    if (!accessToken) {
        console.error('Error in getUser function: No access token found');
        return null;
    }

    try {
        console.log(`Access Token: ${accessToken}`);
        const response = await fetch(`https://api.spotify.com/v1/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            console.error(`Response error in getUser function: ${response.status} ${response.statusText}`);
            await logResponseErrors(response);  // Log detailed error
            return null;
        }

        const data: UserResponse = await response.json();
        return data;
    } catch (err) {
        console.error("Error fetching user data:", err);
        return null;
    }
}

export const createSpotifyPlaylist = async (name: string, isPublic: boolean): Promise<string | null> => {
    let accessToken: string | null = null;
    if (typeof window !== "undefined") {
        accessToken = localStorage.getItem('spotify_access_token');
    }

    if (!accessToken) {
        console.error('Error in createPlaylist function: No access token found');
        return null;
    }

    try {
        console.log(`Access Token: ${accessToken}`);

        const userResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!userResponse.ok) {
            console.error(`Error fetching user information: ${userResponse.status} ${userResponse.statusText}`);
            await logResponseErrors(userResponse);  // Log detailed error
            return null;
        }

        const userData = await userResponse.json();
        const userId = userData.id;

        const createResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                public: isPublic
            })
        });

        if (!createResponse.ok) {
            console.error(`Error creating playlist: ${createResponse.status} ${createResponse.statusText}`);
            await logResponseErrors(createResponse);  // Log detailed error
            return null;
        }

        const playlistData = await createResponse.json();
        return playlistData.id;
    } catch (err) {
        console.error('Error in createPlaylist function:', err);
        return null;
    }
};

export const addTracksToPlaylist = async (playlistId: string, tracks: Track[]): Promise<void> => {
    let accessToken: string | null = null;
    if (typeof window !== "undefined") {
        accessToken = localStorage.getItem('spotify_access_token');
    }

    if (!accessToken) {
        console.error('Error in addTracksToPlaylist function: No access token found');
        return;
    }

    try {
        console.log(`Access Token: ${accessToken}`);
        const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: tracks.map(track => track.uri)
            })
        });

        if (!addTracksResponse.ok) {
            console.error(`Error adding tracks to playlist: ${addTracksResponse.status} ${addTracksResponse.statusText}`);
            await logResponseErrors(addTracksResponse);  // Log detailed error
        }
    } catch (err) {
        console.error('Error in addTracksToPlaylist function:', err);
    }
};