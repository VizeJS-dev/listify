interface TrackItem {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: { name: string };
}

interface TracksResponse {
    tracks: {
        items: TrackItem[];
    };
}

export const searchTracks = async (query: string): Promise<TrackItem[]> => {
    const accessToken = localStorage.getItem('spotify_access_token');

    if (!accessToken) {
        console.error('Error in searchTracks function: No access token found');
        return [];
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
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