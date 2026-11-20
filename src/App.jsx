import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Flame,
  Clapperboard,
  Tv,
  Sparkles,
  Globe,
  Film,
  Play,
  Bookmark,
  History,
  TrendingUp,
  Award,
  Layers,
  Heart,
  ChevronRight,
  Filter
} from 'lucide-react';

import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ContentRail from './components/ContentRail';
import MovieCard from './components/MovieCard';
import SearchModal from './components/SearchModal';
import WatchlistModal from './components/WatchlistModal';
import HistoryModal from './components/HistoryModal';
import SettingsModal from './components/SettingsModal';

import DetailPage from './pages/DetailPage';
import { MovieWatchRoute, TvWatchRoute, DubWatchRoute } from './pages/WatchRouteWrapper';

import { TmdbService } from './services/tmdbService';
import { DubIndoService } from './services/dubIndoService';
import { MovieBoxService } from './services/movieBoxService';
import { StorageService } from './services/storageService';

const GENRES = [
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '18', name: 'Drama' },
  { id: '14', name: 'Fantasy' },
  { id: '27', name: 'Horror' },
  { id: '878', name: 'Sci-Fi' },
  { id: '53', name: 'Thriller' },
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('home');

  // Catalogs
  const [heroItems, setHeroItems] = useState([]);
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [animeList, setAnimeList] = useState([]);
  const [animeMovies, setAnimeMovies] = useState([]);
  const [kdramaList, setKdramaList] = useState([]);
  const [cdramaList, setCdramaList] = useState([]);
  const [dubIndoMovies, setDubIndoMovies] = useState([]);
  const [dubIndoSeries, setDubIndoSeries] = useState([]);
  const [movieBoxData, setMovieBoxData] = useState([]);
  const [movieBoxLoading, setMovieBoxLoading] = useState(false);

  // Tab specific data
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreResults, setGenreResults] = useState([]);
  const [loadingGenre, setLoadingGenre] = useState(false);

  // Local storage state
  const [watchlist, setWatchlist] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const watchlistIds = new Set(watchlist.map(i => String(i.id)));

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    // 1. Load local saved state
    setWatchlist(StorageService.getWatchlist());
    setContinueWatching(StorageService.getContinueWatching());

    // 2. Fetch TMDB content
    TmdbService.getTrending('day')
      .then((items) => {
        setTrending(items);
        setHeroItems(items.slice(0, 6));
      })
      .catch((e) => console.error('Trending fetch err:', e));

    TmdbService.getPopularMovies()
      .then((items) => setPopularMovies(items))
      .catch((e) => console.error('Popular movies err:', e));

    TmdbService.getTopRatedMovies()
      .then((items) => setTopRatedMovies(items))
      .catch((e) => console.error('Top rated err:', e));

    TmdbService.getPopularTV()
      .then((items) => setPopularTV(items))
      .catch((e) => console.error('Popular TV err:', e));

    TmdbService.getAnime()
      .then((items) => setAnimeList(items))
      .catch((e) => console.error('Anime err:', e));

    TmdbService.getAnimeMovies()
      .then((items) => setAnimeMovies(items))
      .catch((e) => console.error('Anime movies err:', e));

    TmdbService.getKDrama()
      .then((items) => setKdramaList(items))
      .catch((e) => console.error('KDrama err:', e));

    TmdbService.getCDrama()
      .then((items) => setCdramaList(items))
      .catch((e) => console.error('CDrama err:', e));

    // 3. Fetch Curated Top Dub Indo Movies
    DubIndoService.getTopMovies(60)
      .then((items) => setDubIndoMovies(items))
      .catch((e) => console.error('Dub Indo movies err:', e));

    DubIndoService.getSeries()
      .then((items) => setDubIndoSeries(items))
      .catch((e) => console.error('Dub Indo series err:', e));

    // Global keyboard listener for search (Ctrl+K or Cmd+K)
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update continue watching on route change
  useEffect(() => {
    setContinueWatching(StorageService.getContinueWatching());
  }, [location.pathname]);

  // Fetch Genre results
  useEffect(() => {
    if (selectedGenre && activeTab === 'movies') {
      setLoadingGenre(true);
      TmdbService.getByGenre(selectedGenre.id, 'movie')
        .then((items) => setGenreResults(items))
        .catch((e) => console.error('Genre err:', e))
        .finally(() => setLoadingGenre(false));
    }
  }, [selectedGenre, activeTab]);

  // Load MovieBox
  useEffect(() => {
    if (activeTab === 'moviebox' && movieBoxData.length === 0) {
      setMovieBoxLoading(true);
      MovieBoxService.getHomepage()
        .then((res) => {
          setMovieBoxData(Array.isArray(res) ? res : (res.data || []));
        })
        .catch((err) => console.error('Moviebox tab load err:', err))
        .finally(() => setMovieBoxLoading(false));
    }
  }, [activeTab]);

  // Watchlist handlers
  const handleToggleWatchlist = (item) => {
    const res = StorageService.toggleWatchlist(item);
    setWatchlist(res.items);
  };

  const handleClearWatchlist = () => {
    if (window.confirm('Kosongkan semua daftar Watchlist?')) {
      localStorage.removeItem('mcmovies_watchlist');
      setWatchlist([]);
    }
  };

  // Continue Watching handlers
  const handleRemoveHistoryItem = (id) => {
    const updated = StorageService.removeContinueWatching(id);
    setContinueWatching(updated);
  };

  const handleClearHistory = () => {
    if (window.confirm('Kosongkan seluruh riwayat nonton?')) {
      localStorage.removeItem('mcmovies_continue_watching');
      setContinueWatching([]);
    }
  };

  // Navigates to CinemaOS-style Watch Page
  const handlePlayMovie = (item) => {
    if (!item) return;
    if (item.isDubIndo) {
      navigate(`/watch/dub/${item.id}`);
    } else if (item.media_type === 'tv' || item.category === 'Film Series' || (item.episodes && item.episodes.length > 0)) {
      const s = item.selectedSeason || item.season || 1;
      const e = item.selectedEpisode || item.episode || 1;
      navigate(`/watch/tv/${item.id}/${s}/${e}`);
    } else {
      navigate(`/watch/movie/${item.id}`);
    }
  };

  // Navigates to dedicated Detail Page (Full Page, no popup modal)
  const handleOpenDetail = (item) => {
    if (!item) return;
    if (item.isDubIndo || String(item.id).startsWith('dub_')) {
      navigate(`/dub/${item.id}`);
    } else if (item.media_type === 'tv' || item.category === 'Film Series' || item.first_air_date || (item.episodes && item.episodes.length > 0)) {
      navigate(`/tv/${item.id}`);
    } else {
      navigate(`/movie/${item.id}`);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#060709] text-zinc-100 flex flex-col selection:bg-white selection:text-black">
      {/* Navbar (Hidden on Watch and Detail Pages for pure immersive CinemaOS experience) */}
      {!location.pathname.startsWith('/watch') &&
       !location.pathname.startsWith('/movie') &&
       !location.pathname.startsWith('/tv') &&
       !location.pathname.startsWith('/dub') &&
       !location.pathname.startsWith('/detail') && (
        <Navbar
          activeTab={location.pathname === '/' ? activeTab : ''}
          onTabChange={handleTabChange}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenWatchlist={() => setIsWatchlistOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          watchlistCount={watchlist.length}
          historyCount={continueWatching.length}
        />
      )}

      {/* Main Routes */}
      <div className="flex-1">
        <Routes>
          {/* Dedicated Detail Pages (Full Page, CinemaOS standard) */}
          <Route path="/movie/:id" element={<DetailPage type="movie" />} />
          <Route path="/tv/:id" element={<DetailPage type="tv" />} />
          <Route path="/dub/:id" element={<DetailPage type="dub" />} />
          <Route path="/detail/:type/:id" element={<DetailPage />} />

          {/* CinemaOS Dedicated Watch Routes */}
          <Route path="/watch/movie/:id" element={<MovieWatchRoute />} />
          <Route path="/watch/tv/:id" element={<TvWatchRoute />} />
          <Route path="/watch/tv/:id/:season/:episode" element={<TvWatchRoute />} />
          <Route path="/watch/dub/:id" element={<DubWatchRoute />} />

          {/* Main Catalog / Home Routes */}
          <Route
            path="*"
            element={
              <main className="pb-20">
                {/* TAB 1: HOME VIEW */}
                {activeTab === 'home' && (
                  <>
                    <HeroBanner
                      items={heroItems}
                      onPlayClick={handlePlayMovie}
                      onInfoClick={handleOpenDetail}
                      watchlistIds={watchlistIds}
                      onToggleWatchlist={handleToggleWatchlist}
                    />

                    {continueWatching.length > 0 && (
                      <ContentRail
                        title="Lanjutkan Menonton"
                        subtitle="Lanjutkan dari menit terakhir Anda"
                        items={continueWatching}
                        onMovieClick={handleOpenDetail}
                        onPlayClick={handlePlayMovie}
                        watchlistIds={watchlistIds}
                        onToggleWatchlist={handleToggleWatchlist}
                        onExploreMore={() => setIsHistoryOpen(true)}
                      />
                    )}

                    <ContentRail
                      title="Trending Hari Ini"
                      subtitle="Paling banyak ditonton di seluruh dunia 24 jam terakhir"
                      items={trending}
                      onMovieClick={handleOpenDetail}
                      onPlayClick={handlePlayMovie}
                      watchlistIds={watchlistIds}
                      onToggleWatchlist={handleToggleWatchlist}
                    />

                    <ContentRail
                      title="Top Videos Dubbing Indonesia"
                      subtitle="Koleksi film bioskop terpopuler dubbing Bahasa Indonesia resmi (Full Duration)"
                      items={dubIndoMovies}
                      onMovieClick={handleOpenDetail}
                      onPlayClick={handlePlayMovie}
                      watchlistIds={watchlistIds}
                      onToggleWatchlist={handleToggleWatchlist}
                      onExploreMore={() => setActiveTab('dubindo')}
                    />

                    <ContentRail
                      title="Film Bioskop Terpopuler"
                      subtitle="Film layar lebar terlaris & rilis bioskop global minggu ini"
                      items={popularMovies}
                      onMovieClick={handleOpenDetail}
                      onPlayClick={handlePlayMovie}
                      watchlistIds={watchlistIds}
                      onToggleWatchlist={handleToggleWatchlist}
                      onExploreMore={() => setActiveTab('movies')}
                    />

                    <ContentRail
                      title="Serial TV & Web Series"
                      subtitle="Musim lengkap dari Netflix, HBO, Disney+, dan AMC"
                      items={popularTV}
                      onMovieClick={handleOpenDetail}
                      onPlayClick={handlePlayMovie}
                      watchlistIds={watchlistIds}
                      onToggleWatchlist={handleToggleWatchlist}
                      onExploreMore={() => setActiveTab('series')}
                    />

                    <ContentRail
                      title="Anime Hits & Simulcast Jepang"
                      subtitle="Serial anime terpopuler dan episode terbaru dengan Sub & Dub"
                      items={animeList}
                      onMovieClick={handleOpenDetail}
                      onPlayClick={handlePlayMovie}
                      watchlistIds={watchlistIds}
                      onToggleWatchlist={handleToggleWatchlist}
                      onExploreMore={() => setActiveTab('anime')}
                    />

                    <ContentRail
                      title="Drama Korea & Drama Asia"
                      subtitle="K-Drama romantis, thriller misteri, dan serial Mandarin terpopuler"
                      items={kdramaList}
                      onMovieClick={handleOpenDetail}
                      onPlayClick={handlePlayMovie}
                      watchlistIds={watchlistIds}
                      onToggleWatchlist={handleToggleWatchlist}
                      onExploreMore={() => setActiveTab('kdrama')}
                    />

                    <ContentRail
                      title="Film Rating Tertinggi"
                      subtitle="Karya sinema terbaik sepanjang masa pilihan penonton dunia"
                      items={topRatedMovies}
                      onMovieClick={handleOpenDetail}
                      onPlayClick={handlePlayMovie}
                      watchlistIds={watchlistIds}
                      onToggleWatchlist={handleToggleWatchlist}
                    />
                  </>
                )}

                {/* TAB 2: MOVIES VIEW */}
                {activeTab === 'movies' && (
                  <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="mb-6">
                      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Koleksi Film Layar Lebar
                      </h1>
                      <p className="text-sm text-zinc-400 mt-1">
                        Jelajahi ribuan film bioskop Hollywood, internasional, dan box office dengan multi-server stream HD & 4K.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
                      <button
                        onClick={() => setSelectedGenre(null)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                          selectedGenre === null
                            ? 'bg-white text-black font-semibold shadow-sm'
                            : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-white/[0.08]'
                        }`}
                      >
                        Semua Genre
                      </button>
                      {GENRES.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => setSelectedGenre(g)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                            selectedGenre?.id === g.id
                              ? 'bg-white text-black font-semibold shadow-sm'
                              : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-white/[0.08]'
                          }`}
                        >
                          {g.name}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                      {(selectedGenre ? genreResults : popularMovies).map((item) => (
                        <MovieCard
                          key={item.id}
                          item={item}
                          className="w-full"
                          onClick={handleOpenDetail}
                          onPlay={handlePlayMovie}
                          isWatchlisted={watchlistIds.has(String(item.id))}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: TV SERIES VIEW */}
                {activeTab === 'series' && (
                  <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="mb-6">
                      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Serial TV & Web Series
                      </h1>
                      <p className="text-sm text-zinc-400 mt-1">
                        Koleksi serial barat, serial populer, dan web series dengan musim dan episode lengkap.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                      {popularTV.map((item) => (
                        <MovieCard
                          key={item.id}
                          item={item}
                          className="w-full"
                          onClick={handleOpenDetail}
                          onPlay={handlePlayMovie}
                          isWatchlisted={watchlistIds.has(String(item.id))}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: ANIME VIEW */}
                {activeTab === 'anime' && (
                  <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="mb-6">
                      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Anime Hits & Movies
                      </h1>
                      <p className="text-sm text-zinc-400 mt-1">
                        Daftar anime series terkini, Shounen, Isekai, Romance, dan film anime movie kualitas Full HD.
                      </p>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-base font-bold text-zinc-200 mb-3">Serial Anime Terpopuler</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                        {animeList.map((item) => (
                          <MovieCard
                            key={item.id}
                            item={item}
                            className="w-full"
                            onClick={handleOpenDetail}
                            onPlay={handlePlayMovie}
                            isWatchlisted={watchlistIds.has(String(item.id))}
                            onToggleWatchlist={handleToggleWatchlist}
                          />
                        ))}
                      </div>
                    </div>

                    {animeMovies.length > 0 && (
                      <div>
                        <h2 className="text-base font-bold text-zinc-200 mb-3">Film Layar Lebar Anime (Anime Movies)</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                          {animeMovies.map((item) => (
                            <MovieCard
                              key={item.id}
                              item={item}
                              className="w-full"
                              onClick={handleOpenDetail}
                              onPlay={handlePlayMovie}
                              isWatchlisted={watchlistIds.has(String(item.id))}
                              onToggleWatchlist={handleToggleWatchlist}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: ASIAN DRAMA VIEW */}
                {activeTab === 'kdrama' && (
                  <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="mb-6">
                      <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Drama Korea & Drama Asia
                      </h1>
                      <p className="text-sm text-zinc-400 mt-1">
                        Koleksi K-Drama rating tertinggi, Chinese Drama sejarah & romantis, dan serial Asia lainnya.
                      </p>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-base font-bold text-zinc-200 mb-3">Korean Drama Terpopuler</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                        {kdramaList.map((item) => (
                          <MovieCard
                            key={item.id}
                            item={item}
                            className="w-full"
                            onClick={handleOpenDetail}
                            onPlay={handlePlayMovie}
                            isWatchlisted={watchlistIds.has(String(item.id))}
                            onToggleWatchlist={handleToggleWatchlist}
                          />
                        ))}
                      </div>
                    </div>

                    {cdramaList.length > 0 && (
                      <div>
                        <h2 className="text-base font-bold text-zinc-200 mb-3">Chinese Drama Pilihan</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                          {cdramaList.map((item) => (
                            <MovieCard
                              key={item.id}
                              item={item}
                              className="w-full"
                              onClick={handleOpenDetail}
                              onPlay={handlePlayMovie}
                              isWatchlisted={watchlistIds.has(String(item.id))}
                              onToggleWatchlist={handleToggleWatchlist}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 6: DUB INDO DEDICATED VIEW */}
                {activeTab === 'dubindo' && (
                  <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="mb-6">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Audio Dubbing Bahasa Indonesia
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2 tracking-tight">
                        Top Videos Dubbing Indonesia
                      </h1>
                      <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
                        Koleksi teratas dari Top Videos dubbindo.site: Film layar lebar animasi Disney, Pixar, Box Office, dan serial pilihan dengan audio bahasa Indonesia resmi (Durasi penuh tanpa AI shorts/meme).
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                      {dubIndoMovies.map((item) => (
                        <MovieCard
                          key={item.id}
                          item={item}
                          className="w-full"
                          onClick={handleOpenDetail}
                          onPlay={handlePlayMovie}
                          isWatchlisted={watchlistIds.has(String(item.id))}
                          onToggleWatchlist={handleToggleWatchlist}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 7: MOVIEBOX API VIEW */}
                {activeTab === 'moviebox' && (
                  <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-white/10">
                          Sansekai MovieBox API
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2 tracking-tight">
                          Integrasi MovieBox API
                        </h1>
                        <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
                          Endpoint resmi dari Sansekai API (https://api.sansekai.my.id/#/MovieBox). Jika IP demo dibatasi oleh host, gunakan Pengaturan untuk menghubungkan proxy API Anda.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-medium text-white self-start sm:self-auto"
                      >
                        Atur Host API
                      </button>
                    </div>

                    {movieBoxLoading ? (
                      <div className="py-24 text-center text-zinc-400 animate-pulse text-sm">
                        Menghubungkan ke Sansekai MovieBox API...
                      </div>
                    ) : movieBoxData.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                        {movieBoxData.map((item, idx) => (
                          <MovieCard
                            key={item.id || idx}
                            item={{
                              id: item.id || idx,
                              title: item.title || item.name || 'MovieBox Title',
                              poster_path: item.poster || item.thumbnail || item.cover,
                              vote_average: item.rating ? parseFloat(item.rating) : 8.0,
                              release_date: item.year || '',
                              media_type: item.type === 'series' ? 'tv' : 'movie',
                              overview: item.synopsis || item.description || '',
                            }}
                            className="w-full"
                            onClick={handleOpenDetail}
                            onPlay={handlePlayMovie}
                            isWatchlisted={watchlistIds.has(String(item.id || idx))}
                            onToggleWatchlist={handleToggleWatchlist}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center bg-zinc-950/60 rounded-2xl border border-white/10 p-8">
                        <Globe className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                        <h3 className="text-base font-semibold text-zinc-200">
                          MovieBox Demo API Rate-Limited
                        </h3>
                        <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto">
                          Server publik Sansekai membatasi IP demo. Anda tetap dapat mengakses ribuan film bioskop via <b>Katalog Utama TMDB</b> dan <b>Top Videos Dub Indo</b> di menu atas.
                        </p>
                        <div className="mt-5 flex justify-center gap-3">
                          <button
                            onClick={() => setActiveTab('home')}
                            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold"
                          >
                            Kembali ke Home
                          </button>
                          <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-200 text-xs font-medium"
                          >
                            Atur Custom Proxy API
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </main>
            }
          />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/[0.08] bg-[#060709] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black text-xs tracking-tighter">
              MC
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">
                McMovies
              </span>
              <p className="text-xs text-zinc-400">
                All-in-One Global Cinema & Top Videos Dubbing Indonesia
              </p>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 text-center sm:text-right">
            McMovies &copy; {new Date().getFullYear()}. All media stream embeds provided by third-party services.
          </p>
        </div>
      </footer>

      {/* GLOBAL MODALS (Dedicated Page replaces detail modal for fluid modern UX) */}
      {isSearchOpen && (
        <SearchModal
          onClose={() => setIsSearchOpen(false)}
          onMovieClick={(item) => {
            setIsSearchOpen(false);
            handleOpenDetail(item);
          }}
          onPlayClick={(item) => {
            setIsSearchOpen(false);
            handlePlayMovie(item);
          }}
          watchlistIds={watchlistIds}
          onToggleWatchlist={handleToggleWatchlist}
        />
      )}

      {isWatchlistOpen && (
        <WatchlistModal
          isOpen={isWatchlistOpen}
          onClose={() => setIsWatchlistOpen(false)}
          items={watchlist}
          onMovieClick={(item) => {
            setIsWatchlistOpen(false);
            handleOpenDetail(item);
          }}
          onPlayClick={(item) => {
            setIsWatchlistOpen(false);
            handlePlayMovie(item);
          }}
          onToggleWatchlist={handleToggleWatchlist}
          onClearAll={handleClearWatchlist}
        />
      )}

      {isHistoryOpen && (
        <HistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          items={continueWatching}
          onPlay={(item) => {
            setIsHistoryOpen(false);
            handlePlayMovie(item);
          }}
          onRemoveItem={handleRemoveHistoryItem}
          onClearAll={handleClearHistory}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSettingsUpdated={() => {}}
        />
      )}
    </div>
  );
}
