// src/app/auth-config.ts
export const authConfig = {
    clientId: '1812b257f72847eaa72dca441bfb784e',
    clientSecret: '0c7c11abe8a24a129d7fcfd77cc81593',
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
    redirectUri: 'http://localhost:8100/tabs/tab1',
    scopes: ['user-read-private', 'user-read-email'],
    requireHttps: false
  };
  