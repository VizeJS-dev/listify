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

export default Track;