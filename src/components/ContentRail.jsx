import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function ContentRail({
  title,
  subtitle,
  items = [],
  loading = false,
  onMovieClick,
  onPlayClick,
  watchlistIds = new Set(),
  onToggleWatchlist,
  onExploreMore,
}) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.75;
    scrollRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!loading && (!items || items.length === 0)) return null;

  return (
    <section className="relative my-7 sm:my-9 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onExploreMore && (
            <button
              onClick={onExploreMore}
              className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors mr-2"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all active:scale-95"
              aria-label="Geser ke kiri"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all active:scale-95"
              aria-label="Geser ke kanan"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {loading ? (
          // Shimmer loading skeletons
          Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex-none w-[150px] sm:w-[185px] md:w-[205px]"
            >
              <div className="aspect-[2/3] w-full rounded-2xl animate-shimmer bg-zinc-900 border border-white/5" />
              <div className="mt-2.5 space-y-1.5">
                <div className="h-3 w-3/4 bg-zinc-800 rounded animate-shimmer" />
                <div className="h-2 w-1/2 bg-zinc-800/60 rounded animate-shimmer" />
              </div>
            </div>
          ))
        ) : (
          items.map((item) => (
            <MovieCard
              key={`${item.id}-${item.isDubIndo ? 'dub' : 'tmdb'}`}
              item={item}
              onClick={onMovieClick}
              onPlay={onPlayClick}
              isWatchlisted={watchlistIds.has(String(item.id))}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))
        )}
      </div>
    </section>
  );
}
