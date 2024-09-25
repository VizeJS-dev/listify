const accessToken = localStorage.getItem('spotify_access_token');

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


export const searchTracks = async (query: string): Promise<Track[]> => {

    if (!accessToken) {
        console.error('Error in searchTracks function: No access token found');
        return [];
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=50`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            console.error(`Response error in searchTracks function: ${response.statusText}`);
            return [];
        }

        const data: TracksResponse = await response.json();
        return data.tracks.items;
    } catch (error) {
        throw error;
    }
};

export const getUser = async () => {
    if (!accessToken) {
        console.error('Error in getUser function: No access token found');
        return '';
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            console.error(`Response error in getUser function: ${response.statusText}`);
            return '';
        }

        const data: UserResponse = await response.json();

        if(!data.id) {
            console.error(`Error in getUser function: No ID found in response`);
            return '';
        }
        return data;
    } catch (err) {
        console.error("Error fetching user data:", err); // Logging the error
        throw err;
    }
}

export const createSpotifyPlaylist = async (name: string, isPublic: boolean): Promise<string | null> => {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) {
        console.error('Error in createPlaylist function: No access token found');
        return null;
    }

    try {
        const userResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!userResponse.ok) {
            console.error(`Error fetching user information: ${userResponse.statusText}`);
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
            console.error(`Error creating playlist: ${createResponse.statusText}`);
            return null;
        }

        const playlistData = await createResponse.json();
        return playlistData.id; // Return the ID of the created playlist
    } catch (err) {
        console.error('Error in createPlaylist function:', err);
        return null;
    }
};

export const addTracksToPlaylist = async (playlistId: string, tracks: Track[]): Promise<void> => {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) {
        console.error('Error in addTracksToPlaylist function: No access token found');
        return;
    }

    try {
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
            console.error(`Error adding tracks to playlist: ${addTracksResponse.statusText}`);
        }
    } catch (err) {
        console.error('Error in addTracksToPlaylist function:', err);
    }
};