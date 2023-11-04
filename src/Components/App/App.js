import { useState,useEffect } from 'react';
import styles from './App.module.css';
import Header from '../Header/Header';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResult';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';



function App() {
  const [songsList, setSongsList] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);


  useEffect(() => {

    // Perform search if there is a search query im memory

    if (sessionStorage.getItem("searchTerm")) {
      handleSearch(sessionStorage.getItem("searchTerm"));
    };

  }, [])

  




  const handleSearch = async query => {
    const searchResult = await Spotify.search(query);
    setSongsList(searchResult);
  }

  const handleSongButtonClick = (id) => {
    // Check if this song is already in the list
    const isSelected = selectedSongs.some(song => song.id === id);

    if (!isSelected) {
      const index = songsList.findIndex(song => song.id === id);
      setSelectedSongs(prev => [songsList[index], ...prev]);
      setSongsList(prev => [...prev.filter(song => song.id !== id)]);
    } else {
      const index = selectedSongs.findIndex(song => song.id === id);
      setSongsList(prev => [selectedSongs[index], ...prev]);
      setSelectedSongs(prev => [...prev.filter(song => song.id !== id)]);
    }


  }

  const saveToSpotify = (listObject) => {
    setSongsList(prev => [...selectedSongs, ...prev]);
    setSelectedSongs([]);
    Spotify.savePlaylist("MyNewList",listObject);
  }


  return (
    <div className={styles.app}>
      <Header>
        <SearchBar handleSearch={handleSearch} />
      </Header>
      <main>
        <SearchResults
          list={songsList}
          handleSongButtonClick={handleSongButtonClick} />
        <Playlist
          list={selectedSongs}
          handleSongButtonClick={handleSongButtonClick}
          handleSubmit={saveToSpotify} />
      </main>

    </div>
  );
}

export default App;
