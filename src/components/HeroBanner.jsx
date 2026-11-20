import React, { useState, useEffect } from 'react';
import { Play, Info, Plus, Check, Star } from 'lucide-react';
import { TmdbService } from '../services/tmdbService';

export default function HeroBanner({
  items = [],
  onPlayClick,
  onInfoClick,
  watchlistIds = new Set(),
  onToggleWatchlist,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate every 8 seconds
  useEffect(() => {
    if (!items || items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [items]);

  if (!items || items.length === 0) return null;

  const current = items[currentIndex] || items[0];
  const title = current.title || current.name || 'Untitled Feature';
  const rawBackdrop = current.backdrop_path || current.thumbnail;
  const backdropUrl = current.isDubIndo
    ? (current.thumbnail || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&auto=format&fit=crop&q=80')
    : TmdbService.getBackdropUrl(rawBackdrop, 'original');

  const releaseDate = current.release_date || current.first_air_date || '';
  const year = releaseDate ? releaseDate.slice(0, 4) : (current.year || '2024');
  const rating = current.vote_average ? current.vote_average.toFixed(1) : '8.6';
  const overview = current.overview || current.description || 'Saksikan tayangan streaming terbaik dengan kualitas Full HD & 4K di McMovies tanpa perlu registrasi akun.';
  const isSaved = watchlistIds.has(String(current.id));
  const isSeries = current.media_type === 'tv' || current.category === 'Film Series';

  return (
    <div className="relative w-full h-[65vh] sm:h-[75vh] md:h-[82vh] max-h-[820px] overflow-hidden bg-[#060709]">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0 z-0">
        <img
          key={backdropUrl}
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover object-center filter brightness-[0.8] transition-all duration-1000 transform scale-100"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&auto=format&fit=crop&q=80';
          }}
        />

        {/* Seamless Vignette Fades to Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-[#060709]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060709] via-[#060709]/80 to-transparent w-full md:w-2/3" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-2xl">
          {/* Subtle Metadata Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-3.5">
            {current.isDubIndo ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                🇮🇩 Audio Dub Indo
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-zinc-200 border border-white/10 backdrop-blur-md">
                {isSeries ? 'TV Series' : 'Premiere Movie'}
              </span>
            )}

            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-black/40 text-zinc-300 border border-white/10 backdrop-blur-md">
              4K Ultra HD
            </span>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-amber-400 border border-white/10 backdrop-blur-md text-xs font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{rating}</span>
            </div>

            {year && (
              <span className="text-xs font-medium text-zinc-400 ml-1">
                {year}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
            {title}
          </h1>

          {/* Synopsis Excerpt */}
          <p className="mt-3.5 text-xs sm:text-sm md:text-base text-zinc-300 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow max-w-xl font-normal">
            {overview}
          </p>

          {/* Action CTAs: Solid White Play + Frosted Info */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlayClick && onPlayClick(current)}
              className="flex items-center gap-2.5 px-7 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm sm:text-base shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Tonton Sekarang</span>
            </button>

            <button
              onClick={() => onInfoClick && onInfoClick(current)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-sm sm:text-base backdrop-blur-md transition-all active:scale-95"
            >
              <Info className="w-4 h-4 text-zinc-300" />
              <span>Detail Film</span>
            </button>

            <button
              onClick={() => onToggleWatchlist && onToggleWatchlist(current)}
              className={`p-3 rounded-xl border backdrop-blur-md transition-all active:scale-95 ${
                isSaved
                  ? 'bg-white text-black border-white shadow-xl'
                  : 'bg-white/10 border-white/10 text-white hover:bg-white/15'
              }`}
              title={isSaved ? 'Hapus dari Watchlist' : 'Tambah ke Watchlist'}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Thumbnail Slide Switcher (Right bottom) */}
        <div className="hidden lg:flex items-center gap-2.5 absolute bottom-12 right-8 z-20">
          {items.slice(0, 5).map((item, idx) => {
            const isActive = idx === currentIndex;
            const thumbUrl = item.isDubIndo
              ? (item.thumbnail || '')
              : TmdbService.getImageUrl(item.backdrop_path || item.poster_path, 'w500');

            return (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`group relative w-16 h-10 rounded-lg overflow-hidden border transition-all ${
                  isActive
                    ? 'border-white scale-110 shadow-xl shadow-black/80 ring-2 ring-white/30'
                    : 'border-white/10 opacity-40 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img
                  src={thumbUrl}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Slide Indicator Dots */}
      <div className="lg:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
        {items.slice(0, 5).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 rounded-full transition-all ${
              idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-zinc-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
