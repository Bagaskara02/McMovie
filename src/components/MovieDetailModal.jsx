import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Star,
  Plus,
  Check,
  Calendar,
  Clock,
  Tv,
  Film,
  Sparkles,
  ChevronDown,
  Video,
  Share2
} from 'lucide-react';
import { TmdbService } from '../services/tmdbService';
import { DubIndoService } from '../services/dubIndoService';

export default function MovieDetailModal({
  item,
  onClose,
  onPlay,
  isWatchlisted,
  onToggleWatchlist,
}) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonData, setSeasonData] = useState(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!item) return;

    let isMounted = true;
    setLoading(true);
    setShowTrailer(false);

    if (item.isDubIndo) {
      // Dub Indo details
      setDetails(item);
      setLoading(false);
    } else {
      // Fetch TMDB rich metadata (credits, videos, similar)
      const mediaType = item.media_type || (item.name ? 'tv' : 'movie');
      TmdbService.getDetails(item.id, mediaType)
        .then((data) => {
          if (!isMounted) return;
          setDetails(data);
          setLoading(false);

          // If TV show, fetch Season 1 details
          if (mediaType === 'tv') {
            const initialSeason = data?.seasons?.find(s => s.season_number > 0)?.season_number || 1;
            setSelectedSeason(initialSeason);
            fetchSeason(item.id, initialSeason);
          }
        })
        .catch((err) => {
          console.error('Failed to load TMDB details:', err);
          if (isMounted) {
            setDetails(item);
            setLoading(false);
          }
        });
    }

    // Keyboard escape listener
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item]);

  const fetchSeason = async (tvId, seasonNum) => {
    setLoadingSeason(true);
    try {
      const data = await TmdbService.getSeasonDetails(tvId, seasonNum);
      setSeasonData(data);
    } catch (e) {
      console.error('Failed to fetch season:', e);
    } finally {
      setLoadingSeason(false);
    }
  };

  const handleSeasonChange = (sNum) => {
    setSelectedSeason(sNum);
    if (!item.isDubIndo) {
      fetchSeason(item.id, sNum);
    }
  };

  if (!item) return null;

  const data = details || item;
  const title = data.title || data.name || item.title || item.name || 'Untitled';
  const rawBackdrop = data.backdrop_path || item.backdrop_path || data.thumbnail;
  const backdropUrl = item.isDubIndo
    ? (rawBackdrop || '')
    : TmdbService.getBackdropUrl(rawBackdrop, 'original');

  const rawPoster = data.poster_path || item.poster_path || data.thumbnail;
  const posterUrl = item.isDubIndo
    ? (rawPoster || '')
    : TmdbService.getImageUrl(rawPoster, 'w500');

  const releaseDate = data.release_date || data.first_air_date || item.release_date || '';
  const year = releaseDate ? releaseDate.slice(0, 4) : '';
  const rating = (data.vote_average || item.vote_average || 8.0).toFixed(1);
  const runtime = data.runtime ? `${Math.floor(data.runtime / 60)}j ${data.runtime % 60}m` : null;
  const isSeries = data.media_type === 'tv' || item.media_type === 'tv' || (data.seasons && data.seasons.length > 0) || (item.episodes && item.episodes.length > 0);
  const genres = data.genres || [];

  // Trailer finding
  const trailer = data?.videos?.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  const cast = data?.credits?.cast?.slice(0, 8) || [];

  // Episodes for series
  const episodesList = item.isDubIndo
    ? (item.episodes || [])
    : (seasonData?.episodes || []);

  const handlePlayDirect = (season = 1, episode = 1, epData = null) => {
    if (onPlay) {
      onPlay({
        ...item,
        ...data,
        selectedSeason: season,
        selectedEpisode: episode,
        streamUrl: epData?.streamUrl || item.streamUrl || null,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-5xl rounded-2xl bg-cinema-surface border border-cinema-border/80 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all active:scale-95"
          aria-label="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto custom-scrollbar">
          {/* Header Backdrop Banner */}
          <div className="relative w-full h-[260px] sm:h-[340px] md:h-[400px] overflow-hidden bg-cinema-card">
            {showTrailer && trailer ? (
              <div className="w-full h-full">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                  title="Official Trailer"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <>
                <img
                  src={backdropUrl || posterUrl}
                  alt={title}
                  className="w-full h-full object-cover filter brightness-[0.75]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-surface via-cinema-surface/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-cinema-surface/80 via-transparent to-transparent hidden sm:block" />

                {/* Big Center Play / Trailer Button */}
                <div className="absolute inset-0 flex items-center justify-center gap-4">
                  <button
                    onClick={() => handlePlayDirect(1, 1)}
                    className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-cinema-cyan to-cinema-blue hover:from-cyan-400 hover:to-blue-500 text-cinema-bg font-bold shadow-2xl shadow-cinema-cyan/40 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>Nonton Sekarang</span>
                  </button>

                  {trailer && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="flex items-center gap-2 px-5 py-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white font-medium backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
                    >
                      <Video className="w-5 h-5 text-red-500" />
                      <span>Trailer</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Details Content */}
          <div className="p-4 sm:p-6 md:p-8 -mt-16 sm:-mt-20 relative z-20">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Poster on Desktop */}
              <div className="hidden sm:block flex-none w-44 md:w-52 rounded-xl overflow-hidden shadow-2xl border-2 border-cinema-border/70 bg-cinema-card">
                <img
                  src={posterUrl}
                  alt={title}
                  className="w-full aspect-[2/3] object-cover"
                />
              </div>

              {/* Main Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {item.isDubIndo ? (
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-500 text-white">
                      🇮🇩 DUBBING INDONESIA
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-cinema-cyan/20 text-cinema-cyan border border-cinema-cyan/40">
                      {isSeries ? 'TV SERIES' : 'MOVIE'}
                    </span>
                  )}

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 text-cinema-gold text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-cinema-gold text-cinema-gold" />
                    <span>{rating}</span>
                  </div>

                  {year && (
                    <div className="flex items-center gap-1 text-slate-300 text-xs font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{year}</span>
                    </div>
                  )}

                  {runtime && (
                    <div className="flex items-center gap-1 text-slate-300 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{runtime}</span>
                    </div>
                  )}

                  <span className="px-2 py-0.5 rounded text-[10px] bg-cinema-card text-slate-300 border border-cinema-border">
                    Full HD 1080p
                  </span>
                </div>

                <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                  {title}
                </h1>

                {data.tagline && (
                  <p className="mt-1 text-xs sm:text-sm text-cinema-cyan/90 italic font-medium">
                    "{data.tagline}"
                  </p>
                )}

                {/* Genres Pills */}
                {genres.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {genres.map((g) => (
                      <span
                        key={g.id || g.name}
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-cinema-card border border-cinema-border/60 text-slate-300"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Synopsis */}
                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Sinopsis
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {data.overview || data.description || 'Informasi sinopsis lengkap tidak tersedia saat ini. Silakan langsung tonton tayangan.'}
                  </p>
                </div>

                {/* Actions: Watch Now & Watchlist */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handlePlayDirect(1, 1)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cinema-cyan hover:bg-cyan-400 text-cinema-bg font-bold text-sm shadow-lg shadow-cinema-cyan/30 active:scale-95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Mulai Putar</span>
                  </button>

                  <button
                    onClick={() => onToggleWatchlist && onToggleWatchlist(item)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      isWatchlisted
                        ? 'bg-cinema-cyan/20 border-cinema-cyan/60 text-cinema-cyan'
                        : 'bg-cinema-card border-cinema-border/70 text-slate-200 hover:bg-cinema-card-hover'
                    }`}
                  >
                    {isWatchlisted ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Tersimpan di Watchlist</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Simpan ke Watchlist</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Cast & Crew Section */}
            {cast.length > 0 && (
              <div className="mt-8 border-t border-cinema-border/50 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                  Pemeran Utama
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {cast.map((actor) => (
                    <div key={actor.id} className="text-center group">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full overflow-hidden bg-cinema-card border border-cinema-border/70 shadow-md">
                        <img
                          src={TmdbService.getImageUrl(actor.profile_path, 'w185')}
                          alt={actor.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=185&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs font-semibold text-slate-200 line-clamp-1">
                        {actor.name}
                      </p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">
                        {actor.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TV Series / Episodes Section */}
            {isSeries && (
              <div className="mt-8 border-t border-cinema-border/50 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Tv className="w-4 h-4 text-cinema-cyan" />
                    <span>Daftar Episode</span>
                  </h3>

                  {/* Season Dropdown / Tabs */}
                  {data.seasons && data.seasons.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      {data.seasons
                        .filter((s) => s.season_number > 0)
                        .map((s) => (
                          <button
                            key={s.id}
                            onClick={() => handleSeasonChange(s.season_number)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              selectedSeason === s.season_number
                                ? 'bg-cinema-cyan text-cinema-bg'
                                : 'bg-cinema-card hover:bg-cinema-card-hover text-slate-300 border border-cinema-border/60'
                            }`}
                          >
                            Season {s.season_number}
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* Episodes Grid List */}
                {loadingSeason ? (
                  <div className="py-12 text-center text-sm text-slate-400 animate-pulse">
                    Memuat daftar episode Season {selectedSeason}...
                  </div>
                ) : episodesList.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-400 bg-cinema-card/40 rounded-xl border border-cinema-border/40">
                    Klik "Mulai Putar" di atas untuk menonton Season {selectedSeason}. Server akan otomatis memuat episode terbaru.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {episodesList.map((ep) => {
                      const epNum = ep.episode_number || ep.episode;
                      const epTitle = ep.name || ep.title || `Episode ${epNum}`;
                      const epThumb = ep.still_path
                        ? TmdbService.getImageUrl(ep.still_path, 'w500')
                        : (ep.thumbnail || posterUrl);

                      return (
                        <div
                          key={ep.id || epNum}
                          onClick={() => handlePlayDirect(selectedSeason, epNum, ep)}
                          className="group relative flex gap-3 p-2.5 rounded-xl bg-cinema-card/60 hover:bg-cinema-card-hover border border-cinema-border/50 hover:border-cinema-cyan/50 cursor-pointer transition-all"
                        >
                          {/* Thumbnail */}
                          <div className="relative w-28 h-18 rounded-lg overflow-hidden flex-none bg-cinema-surface">
                            <img
                              src={epThumb}
                              alt={epTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <div className="w-7 h-7 rounded-full bg-cinema-cyan text-cinema-bg flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-md">
                                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded text-[9px] font-bold bg-black/80 text-slate-200">
                              EP {epNum}
                            </span>
                          </div>

                          {/* Episode Text Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cinema-cyan transition-colors line-clamp-1">
                              {epNum}. {epTitle}
                            </h4>
                            <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                              {ep.overview || 'Tonton episode ini sekarang dalam kualitas HD.'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
