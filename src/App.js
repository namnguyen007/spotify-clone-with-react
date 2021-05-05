import './App.css';
import Login from './Login';
import { useEffect, useState } from 'react';
import { getTokenFromUrl } from './spotify';
import SpotifyWebApi from 'spotify-web-api-js';
import Player from './Player';
import { useDataLayerValue } from './DataLayer';

const s = new SpotifyWebApi();

function App() {
  const [{token, playlists }, dispatch] = useDataLayerValue();
  console.log(playlists);
  console.log(token);

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = '';
    const _token = hash.access_token;
    if (_token) {
      s.setAccessToken(_token);

      dispatch({
        type: 'SET_TOKEN',
        token: _token,
      });

      s.getPlaylist('37i9dQZF1DX9dX3aBjsxqd').then(response =>
        dispatch({
          type: 'SET_DISCOVER_WEEKLY',
          discover_weekly: response,
        })
      );

      s.getMyTopArtists().then(response =>
        dispatch({
          type: 'SET_TOP_ARTISTS',
          top_artists: response,
        })
      );

      dispatch({
        type: 'SET_SPOTIFY',
        spotify: s,
      });

      s.getMe().then(user => {
        dispatch({
          type: 'SET_USER',
          user,
        });
      });

      s.getUserPlaylists().then(playlists => {
        dispatch({
          type: 'SET_PLAYLISTS',
          playlists,
        });
      });
    }
  }, [token, dispatch]);

  return (
    <div className="app">{token ? <Player spotify={s} /> : <Login />}</div>
  );
}

export default App;
