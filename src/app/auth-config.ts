// src/app/auth-config.ts
export const authConfig = {
  clientId: '1812b257f72847eaa72dca441bfb784e',
  clientSecret: '0c7c11abe8a24a129d7fcfd77cc81593',
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  redirectUris: {
      local: 'http://localhost:8100/tabs/tab1',
      netlify: 'https://master--musify-up.netlify.app/'
  },
  scopes: ['user-read-private', 'user-read-email'],
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

  