export interface Song {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl?: string;
  dateAdded?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  dateCreated: string;
  songs: Song[];
}
