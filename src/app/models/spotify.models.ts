// src/app/models/spotify.models.ts
export interface SpotifyImage {
    url: string;
    height: number;
    width: number;
  }
  
  export interface SpotifyPlaylist {
    id: string;
    name: string;
    description: string;
    images: SpotifyImage[];
  }
  
  export interface SpotifyPlaylistsResponse {
    items: SpotifyPlaylist[];
  }
  
  export interface SpotifyCurrentlyPlaying {
    item: {
      album: {
        images: SpotifyImage[];
      };
      name: string;
      artists: { name: string }[];
    };
    is_playing: boolean;
  }
  