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

export interface TrackEnhanced extends Track {
    kind: 'enhanced';
    variant?: 'compact' | 'detailed';
    badge?: 'new' | 'hot' | 'saved';
    isPlayableOverride?: boolean;
}

export function isTrackEnhanced(t: Track | TrackEnhanced): t is TrackEnhanced {
    return (t as TrackEnhanced).kind === 'enhanced';
}

export function enhanceTracks(tracks: Track[]): TrackEnhanced[] {
    const badges: Array<TrackEnhanced['badge']> = ['new', 'hot', 'saved'];
    return tracks.map((t, idx) => ({
        ...t,
        kind: 'enhanced',
        variant: 'compact',
        badge: badges[idx % badges.length],
        isPlayableOverride: !!t.preview_url,
    }));
}

export default Track;