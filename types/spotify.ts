export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
  duration_ms: number;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: { total: number };
  external_urls: { spotify: string };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  external_urls: {
    spotify: string;
  };
  genres: string[];
}

export interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  item: SpotifyTrack | null;
}

export interface SpotifyRecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
}

export interface SpotifyRecentlyPlayed {
  items: SpotifyRecentlyPlayedItem[];
}
