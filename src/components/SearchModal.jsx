import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Film, Tv, Sparkles, Globe, Filter } from 'lucide-react';
import { TmdbService } from '../services/tmdbService';
import { DubIndoService } from '../services/dubIndoService';
import MovieCard from './MovieCard';

const QUICK_TAGS = [
  'Deadpool & Wolverine',
  'Solo Leveling',
  'Cars Dub Indo',
  'Squid Game',
  'Moana',
  'Demon Slayer',
  'Dune',
  'Avatar',
  'One Piece',
  'Spiderman'
];

export default function SearchModal({
  onClose,
  onMovieClick,
  onPlayClick,
  watchlistIds = new Set(),
  onToggleWatchlist,
}) {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, movie, tv, anime, dubindo
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        let combined = [];

        if (filterType === 'dubindo') {
          // Search only Dub Indo
          combined = await DubIndoService.searchDubIndo(query);
        } else {
          // Search both TMDB and Dub Indo
          const [tmdbRes, dubRes] = await Promise.all([
            TmdbService.searchMulti(query),
            DubIndoService.searchDubIndo(query),
          ]);

          let filteredTmdb = tmdbRes || [];
          if (filterType === 'movie') {
            filteredTmdb = filteredTmdb.filter(i => i.media_type === 'movie');
          } else if (filterType === 'tv') {
            filteredTmdb = filteredTmdb.filter(i => i.media_type === 'tv');
          }

          // Prioritize relevant dub indo titles if searched
          combined = [...dubRes.slice(0, 10), ...filteredTmdb];
        }

        setResults(combined);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, filterType]);

  const handleQuickTagClick = (tag) => {
    setQuery(tag);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-xl animate-fadeIn p-4 sm:p-6 md:p-8 overflow-hidden">
      <div className="max-w-6xl w-full mx-auto flex flex-col h-full">
        {/* Search Bar Header */}
        <div className="relative flex items-center gap-3 bg-cinema-surface/90 border border-cinema-border rounded-2xl p-2 sm:p-3 shadow-2xl backdrop-blur-md">
          <Search className="w-5 h-5 sm:w-6 sm:h-6 text-cinema-cyan ml-2 flex-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik judul film, serial, anime, atau dub indo..."
            className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm sm:text-base outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-lg hover:bg-cinema-card text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-cinema-card hover:bg-cinema-card-hover border border-cinema-border text-slate-300 hover:text-white text-xs font-semibold"
          >
            Tutup
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 my-4">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Kategori:</span>
          </span>
          {[
            { id: 'all', label: 'Semua Koleksi' },
            { id: 'movie', label: 'Movies' },
            { id: 'tv', label: 'TV Shows' },
            { id: 'dubindo', label: '🇮🇩 Dub Indo Saja' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === tab.id
                  ? 'bg-cinema-cyan text-cinema-bg font-bold shadow-md shadow-cinema-cyan/20'
                  : 'bg-cinema-surface/70 text-slate-300 hover:bg-cinema-card-hover border border-cinema-border/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 mb-2">Paling Sering Dicari:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleQuickTagClick(tag)}
                  className="px-3 py-1 rounded-lg text-xs bg-cinema-card/70 hover:bg-cinema-card-hover text-slate-300 hover:text-cinema-cyan border border-cinema-border/50 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-sm animate-pulse">
              Mencari katalog film dan series...
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 pb-8">
              {results.map((item) => (
                <MovieCard
                  key={`${item.id}-${item.isDubIndo ? 'dub' : 'tmdb'}`}
                  item={item}
                  onClick={onMovieClick}
                  onPlay={onPlayClick}
                  isWatchlisted={watchlistIds.has(String(item.id))}
                  onToggleWatchlist={onToggleWatchlist}
                />
              ))}
            </div>
          ) : query ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              Tidak ditemukan film dengan kata kunci "{query}". Coba kata kunci lain atau pilih filter "Semua Koleksi".
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-sm">
              Ketik nama film, serial tv, anime favorit, atau dubbing indonesia di kolom pencarian di atas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
