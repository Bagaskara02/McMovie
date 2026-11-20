import React from 'react';
import { Tv, Play } from 'lucide-react';

export default function EpisodeList({
  seasons = [],
  currentSeason = 1,
  currentEpisode = 1,
  episodes = [],
  loading = false,
  onSeasonChange,
  onEpisodeChange,
}) {
  const validSeasons = seasons && seasons.length > 0 
    ? seasons.filter(s => s.season_number > 0)
    : [{ id: 1, season_number: 1, name: 'Season 1' }];

  return (
    <div className="w-full rounded-2xl bg-[#121318] border border-white/5 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
      {/* Header Row: TV Icon + "Daftar Episode" + Season Pills (Exact match to user reference image) */}
      <div className="flex items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Tv className="w-4 h-4 text-white" />
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Daftar Episode
          </h3>
        </div>

        {/* Season Selector Pills (S1, S2, S3, S4) */}
        {validSeasons.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {validSeasons.map((s) => {
              const isActive = s.season_number === currentSeason;
              return (
                <button
                  key={s.id || s.season_number}
                  onClick={() => onSeasonChange && onSeasonChange(s.season_number)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex-none ${
                    isActive
                      ? 'bg-white text-black shadow-sm'
                      : 'bg-[#1e1f26] hover:bg-[#282a34] text-zinc-300 hover:text-white'
                  }`}
                >
                  S{s.season_number}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Episode Cards List (Exact match to user reference image) */}
      {loading ? (
        <div className="py-16 text-center text-xs text-zinc-400 animate-pulse flex flex-col items-center justify-center gap-2.5">
          <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <span>Memuat episode Season {currentSeason}...</span>
        </div>
      ) : episodes.length === 0 ? (
        <div className="py-10 text-center text-xs text-zinc-400 bg-black/20 rounded-xl border border-white/5 p-4">
          Daftar episode tidak tersedia untuk season ini di database.
        </div>
      ) : (
        <div className="space-y-2 max-h-[580px] overflow-y-auto custom-scrollbar pr-1">
          {episodes.map((ep) => {
            const epNum = ep.episode_number || ep.episode || 1;
            const epTitle = ep.name || ep.title || `Episode ${epNum}`;
            const epOverview = ep.overview || 'Tonton episode ini sekarang dalam kualitas Full HD.';
            const isActive = epNum === currentEpisode;

            if (isActive) {
              // Active Episode Card: Solid White Card, Black number badge, Black text, Play icon
              return (
                <div
                  key={ep.id || epNum}
                  onClick={() => onEpisodeChange && onEpisodeChange(epNum)}
                  className="w-full bg-white text-black rounded-xl p-3 sm:p-3.5 shadow-lg flex items-center justify-between cursor-pointer transition-all hover:scale-[1.005]"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black text-white font-extrabold text-xs sm:text-sm flex items-center justify-center flex-none">
                      {epNum}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-xs sm:text-sm text-black line-clamp-1 leading-snug">
                        {epTitle}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-zinc-600 line-clamp-1 mt-0.5 font-normal">
                        {epOverview}
                      </p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 fill-black text-black flex-none ml-2" />
                </div>
              );
            }

            // Inactive Episode Card: Sleek Dark Card, Grey number box, White text
            return (
              <div
                key={ep.id || epNum}
                onClick={() => onEpisodeChange && onEpisodeChange(epNum)}
                className="w-full bg-[#181920]/80 hover:bg-[#20222b] border border-white/[0.04] text-white rounded-xl p-3 sm:p-3.5 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-800 text-zinc-300 group-hover:bg-zinc-700 font-bold text-xs flex items-center justify-center flex-none transition-colors">
                    {epNum}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-zinc-200 group-hover:text-white line-clamp-1 transition-colors leading-snug">
                      {epTitle}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-zinc-400 line-clamp-1 mt-0.5 font-normal">
                      {epOverview}
                    </p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-3.5 h-3.5 fill-white text-white flex-none ml-2" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
