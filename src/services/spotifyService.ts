export const searchTracks = async (query: string): Promise<any[]> => {
    const accessToken = localStorage.getItem('spotify_access_token');

    if (!accessToken) {
        throw new Error('No access token found');
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching tracks: ${response.statusText}`);
        }

        const data = await response.json();
        return data.tracks.items;
    } catch (error) {
        console.error('Error in searchTracks function:', error);
        throw error;
    }
};