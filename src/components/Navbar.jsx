import React, { useState, useEffect } from 'react';
import {
  Film,
  Search,
  Bookmark,
  History,
  Settings,
  Menu,
  X,
  Sparkles,
  Tv,
  Clapperboard,
  Flame,
  Globe
} from 'lucide-react';

export default function Navbar({
  activeTab = 'home',
  onTabChange,
  onOpenSearch,
  onOpenWatchlist,
  onOpenHistory,
  onOpenSettings,
  watchlistCount = 0,
  historyCount = 0,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'movies', label: 'Movies' },
    { id: 'series', label: 'TV Shows' },
    { id: 'anime', label: 'Anime' },
    { id: 'kdrama', label: 'Asian Drama' },
    { id: 'dubindo', label: 'Dub Indo', badge: 'Top Videos' },
    { id: 'moviebox', label: 'MovieBox' },
  ];

  const handleNavClick = (tabId) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#060709]/85 backdrop-blur-2xl border-b border-white/[0.08] py-3 shadow-2xl'
          : 'bg-gradient-to-b from-[#060709]/90 via-[#060709]/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black text-sm tracking-tighter">
              MC
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                McMovies
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-zinc-900/60 border border-white/[0.08] rounded-full p-1 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive ? 'bg-black/10 text-black' : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search Trigger Pill */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-zinc-400 hover:text-white transition-all text-xs font-normal"
            title="Cari Film, Series, Dub Indo... (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Cari film / series...</span>
            <kbd className="hidden lg:inline px-1.5 py-0.5 text-[9px] bg-zinc-800 text-zinc-400 rounded-md">
              Ctrl K
            </kbd>
          </button>

          {/* Watchlist Button */}
          <button
            onClick={onOpenWatchlist}
            className="relative w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white transition-all flex items-center justify-center"
            title="Watchlist Saya"
          >
            <Bookmark className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black text-[9px] font-bold flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Continue Watching / History Button */}
          <button
            onClick={onOpenHistory}
            className="relative w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white transition-all flex items-center justify-center"
            title="Riwayat Nonton"
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-700 text-white text-[9px] font-bold flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white transition-all flex items-center justify-center"
            title="Pengaturan Streaming"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-8 h-8 rounded-full bg-zinc-900/80 border border-white/[0.08] text-zinc-300 hover:text-white flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 px-4 pb-4 bg-[#060709]/95 border-b border-white/[0.08] backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-black font-semibold'
                      : 'bg-zinc-900/70 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        isActive ? 'bg-black/10 text-black' : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
