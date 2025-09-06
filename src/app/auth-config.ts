// src/app/auth-config.ts
export const authConfig = {
  clientId: 'b8bf9a5fa68b496b9e9e77830e756028',
  clientSecret: '2794ce90ad66490283d128e9f6f5f72f',
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  redirectUris: {
      local: 'http://localhost:8100/',
      netlify: 'https://master--musify-up.netlify.app/'
  },
  scopes: [
    'user-read-private', 
    'user-read-email', 
    'user-read-playback-state', 
    'user-modify-playback-state', 
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private'
  ],
  requireHttps: false
};

// Función para obtener la URI de redirección correcta según el entorno
export function getRedirectUri() {
  if (window.location.hostname === 'localhost') {
      return authConfig.redirectUris.local;
  } else {
      return authConfig.redirectUris.netlify;
  }
}

  