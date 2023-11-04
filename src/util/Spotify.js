// const BASE_URL = 'https://accounts.spotify.com/authorize';
// const RESPONSE_TYPE = '?response_type=token';
// const CLIENT_ID = `&client_id=${process.env.REACT_APP_SPOTIFY}`;
// const REDIRECT_URL = `&redirect_uri=${process.env.NODE_ENV === 'development'
//     ? 'http://localhost:3000/'
//     : 'https://qapush-jammming.netlify.app/'}`;
// const SCOPE = '&scope=playlist-modify-private user-read-private';
// let TOKEN = null;

// const getToken = () => {
   
//     if (TOKEN) {
//         return TOKEN;
//     } else if (window.location.hash.length > 1) {

//         const hashParameters = {}
//         // window.location.hash.split('&').forEach(i => hashParameters[i] = i);
//         window.location.hash
//             .slice(1) // to remove # sign
//             .split('&') // to split to paramater/value groups))
//             .forEach(item => {
//                 const parameter = item.split('=')
//                 hashParameters[parameter[0]] = parameter[1];
//             });

//         TOKEN = hashParameters.access_token;
//         window.history.pushState('Access Token', '', '/');
//         return TOKEN;
        
//     } else if (!TOKEN) {
//         const URL = BASE_URL + RESPONSE_TYPE + CLIENT_ID + SCOPE + REDIRECT_URL;
//         window.location = URL;
//     }
    
    
// }

// const getSongs = async (query) => {
    
    
//     const token = getToken();
//     if (!token) return [];

//     const urlEncodedQuery = encodeURIComponent(query);
//     const url = 'https://api.spotify.com/v1/search?q=' + urlEncodedQuery + '&type=track';

//     const response = await fetch(url, {
//         headers: {'Authorization': 'Bearer ' + token }
//     });
//     const data = await response.json();
//     sessionStorage.removeItem("searchTerm");
//     return  !data.tracks ? [] : data.tracks.items.map( ({name, id, album, artists, uri}) => ({
//         name, 
//         id,
//         uri,
//         artist: artists[0].name,
//         album: album.name,
//         image: album.images[2].url
//     }));
// }

// const createPlaylist = async (listObject) => {

//     const token = getToken();
//     const urlEncodedListName = encodeURIComponent(listObject.name);
//     const headers = {'Authorization': 'Bearer ' + token};

//     const userResponse = await fetch('https://api.spotify.com/v1/me', {headers});
    
//     const {id: userId} = await userResponse.json();

//     const createPlaylistResponse = await fetch('https://api.spotify.com/v1/users/' + userId + '/playlists', {
//         headers,
//         method: 'POST',
//         body: JSON.stringify({name: urlEncodedListName, public: false})
//     });
    
//     const { id } = await createPlaylistResponse.json();

//     fetch('https://api.spotify.com/v1/playlists/' + id + '/tracks', {
//         headers,
//         method: 'POST',
//         body: JSON.stringify({uris: listObject.tracks })
//     });

// }

// export { getSongs, createPlaylist }; 


const clientId = '5e87b43398bd45ba89f41503f4fae962'; // Insert client ID here.
const redirectUri = 'http://localhost:3000/'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackUris})
        });
      });
    });
  }
};

export default Spotify;
