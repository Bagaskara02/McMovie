import React from 'react';
import { X, History, Play, Trash2 } from 'lucide-react';
import { TmdbService } from '../services/tmdbService';

export default function HistoryModal({
  isOpen,
  onClose,
  items = [],
  onPlay,
  onRemoveItem,
  onClearAll,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl bg-cinema-surface border border-cinema-border flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-cinema-border/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cinema-purple/20 text-cinema-purple">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Riwayat & Lanjutkan Nonton
              </h2>
              <p className="text-xs text-slate-400">
                Lanjutkan menonton dari menit terakhir Anda tanpa harus mencari lagi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && onClearAll && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Bersihkan</span>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {items.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <History className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-slate-300">Belum Ada Riwayat Nonton</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Film atau serial yang Anda tonton akan otomatis tersimpan di sini agar Anda bisa melanjutkannya kapan saja.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const title = item.title || item.name || 'Untitled';
                const posterUrl = item.isDubIndo
                  ? (item.backdrop_path || item.poster_path)
                  : TmdbService.getImageUrl(item.backdrop_path || item.poster_path, 'w500');

                const isSeries = item.media_type === 'tv' || item.season > 1 || item.episode > 1;

                return (
                  <div
                    key={item.id}
                    className="group relative flex items-center gap-3.5 p-3 rounded-xl bg-cinema-card/60 hover:bg-cinema-card border border-cinema-border/50 transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 sm:w-32 aspect-video rounded-lg overflow-hidden bg-cinema-surface flex-none">
                      <img
                        src={posterUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => onPlay(item)}
                        className="absolute inset-0 bg-black/40 group-hover:bg-black/10 flex items-center justify-center transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-cinema-cyan text-cinema-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </button>

                      {/* Progress line */}
                      {item.progress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                          <div
                            className="h-full bg-cinema-cyan"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-cinema-cyan transition-colors truncate">
                        {title}
                      </h4>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        {isSeries ? (
                          <span className="text-cinema-cyan font-semibold">
                            Season {item.season || 1} • Episode {item.episode || 1}
                          </span>
                        ) : (
                          <span>Film Bioskop</span>
                        )}
                        {item.progress > 0 && (
                          <span>• {item.progress}% ditonton</span>
                        )}
                        {item.isDubIndo && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            DUB INDO
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-none">
                      <button
                        onClick={() => onPlay(item)}
                        className="px-3 py-1.5 rounded-lg bg-cinema-cyan hover:bg-cyan-400 text-cinema-bg text-xs font-bold transition-all shadow-md active:scale-95 hidden sm:flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Lanjutkan</span>
                      </button>

                      {onRemoveItem && (
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                          title="Hapus dari Riwayat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
