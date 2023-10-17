interface SpotifyExternalUrls {
    [key: string]: string
}

interface SpotifyFollowers {
    href: string;
    total: number
}

interface SpotifyImage {
    url: string;
    height: number;
    width: number;
}

interface SpotifyAlbum {
    name: string;
}

interface SpotifyArtist {
    name: string;
}

export interface SpotifyTopResultItem {
    externalUrls: SpotifyExternalUrls;
    followers: SpotifyFollowers;
    genres: string[];
    href: string;
    id: string;
    images: SpotifyImage[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
    album?: SpotifyAlbum;
    artists?: SpotifyArtist[];
}

export interface SpotifyTopItemsRequestResult {
    items: SpotifyTopResultItem[];
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
}