import React from 'react';
import { X, Bookmark, Trash2, Play } from 'lucide-react';
import MovieCard from './MovieCard';

export default function WatchlistModal({
  isOpen,
  onClose,
  items = [],
  onMovieClick,
  onPlayClick,
  onToggleWatchlist,
  onClearAll,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl bg-cinema-surface border border-cinema-border flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-cinema-border/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cinema-cyan/15 text-cinema-cyan">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Daftar Watchlist Saya
              </h2>
              <p className="text-xs text-slate-400">
                {items.length} film dan serial tersimpan secara offline di browser Anda.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && onClearAll && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Semua</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-cinema-card hover:bg-cinema-card-hover border border-cinema-border text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {items.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <Bookmark className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-slate-300">Watchlist Masih Kosong</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Tekan tombol tanda tambah (+) atau "Simpan ke Watchlist" pada poster film untuk menyimpannya di sini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {items.map((item) => (
                <MovieCard
                  key={item.id}
                  item={item}
                  onClick={onMovieClick}
                  onPlay={onPlayClick}
                  isWatchlisted={true}
                  onToggleWatchlist={onToggleWatchlist}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
