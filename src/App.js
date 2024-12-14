import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MovieList from './components/MovieList';
import Footer from './components/Footer';
import MovieModal from './components/MovieModal';
import './App.css';

const API_KEY = '844dba0bfd8f3a4f3799f6130ef9e335';
const API_URL = 'https://api.themoviedb.org/3/';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const fetchMovies = useCallback(async (page = 1) => {
    setError(null);
    const url = query.trim()
      ? `${API_URL}search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
      : `${API_URL}movie/popular?api_key=${API_KEY}&page=${page}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMovies(data.results);
      
      // Save movies to localStorage for offline access
      localStorage.setItem('movies', JSON.stringify(data.results));
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setError("Failed to fetch movies. Loading from cache...");
      
      // Load movies from localStorage if available
      const cachedMovies = JSON.parse(localStorage.getItem('movies'));
      if (cachedMovies) {
        setMovies(cachedMovies);
      }
    }
  }, [query]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchMovies();
  };

  const onMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="app">
      <Header />
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>
      {error && <div className="error">{error}</div>}
      <MovieList movies={movies} onMovieClick={onMovieClick} />
      <Footer />
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
    </div>
  );
};

export default App;
