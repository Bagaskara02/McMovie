import React, { useState, useEffect } from 'react';
import { X, Settings, Server, Key, Database, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { STREAM_SERVERS } from '../services/embedService';
import { StorageService } from '../services/storageService';

export default function SettingsModal({ isOpen, onClose, onSettingsUpdated }) {
  const [preferredServer, setPreferredServer] = useState('vidlink');
  const [tmdbApiKey, setTmdbApiKey] = useState('');
  const [movieBoxUrl, setMovieBoxUrl] = useState('https://api.sansekai.my.id/api');
  const [testStatus, setTestStatus] = useState(null); // testing, success, error
  const [testMessage, setTestMessage] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const current = StorageService.getSettings();
    setPreferredServer(current.preferredServer || 'vidlink');
    setTmdbApiKey(current.tmdbApiKey || '');
    setMovieBoxUrl(current.movieBoxApiUrl || 'https://api.sansekai.my.id/api');
    setTestStatus(null);
    setTestMessage('');
    setSavedSuccess(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestMovieBox = async () => {
    setTestStatus('testing');
    setTestMessage('Mencoba menghubungi MovieBox API...');
    try {
      const cleanUrl = movieBoxUrl.replace(/\/+$/, '');
      const res = await fetch(`${cleanUrl}/moviebox/homepage`, {
        headers: { 'Accept': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        setTestStatus('success');
        setTestMessage(`Berhasil terhubung! Respons diterima.`);
      } else {
        setTestStatus('error');
        setTestMessage(`HTTP ${res.status}: ${data.message || data.error || 'Akses ditolak / Rate limit'}`);
      }
    } catch (err) {
      setTestStatus('error');
      setTestMessage(`Koneksi gagal: ${err.message}. Pastikan URL API aktif atau gunakan proxy CORS.`);
    }
  };

  const handleSave = () => {
    const updated = StorageService.saveSettings({
      preferredServer,
      tmdbApiKey: tmdbApiKey.trim(),
      movieBoxApiUrl: movieBoxUrl.trim(),
    });
    setSavedSuccess(true);
    if (onSettingsUpdated) onSettingsUpdated(updated);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleClearAllStorage = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua Watchlist dan Riwayat Nonton?')) {
      localStorage.clear();
      alert('Data lokal berhasil dibersihkan.');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-cinema-surface border border-cinema-border flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-cinema-border/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cinema-cyan/15 text-cinema-cyan">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Pengaturan Streaming & API
              </h2>
              <p className="text-xs text-slate-400">
                Kustomisasi server pemutar, API key, dan endpoint MovieBox.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-cinema-card hover:bg-cinema-card-hover border border-cinema-border text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {/* Preferred Server */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-cinema-cyan" />
              <span>Server Streaming Utama</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STREAM_SERVERS.map((server) => (
                <button
                  key={server.id}
                  type="button"
                  onClick={() => setPreferredServer(server.id)}
                  className={`flex flex-col text-left p-2.5 rounded-xl border transition-all ${
                    preferredServer === server.id
                      ? 'bg-cinema-cyan/15 border-cinema-cyan text-white shadow-md shadow-cinema-cyan/10'
                      : 'bg-cinema-card/70 border-cinema-border/50 text-slate-300 hover:bg-cinema-card'
                  }`}
                >
                  <span className="text-xs font-bold">{server.name}</span>
                  <span className="text-[10px] text-slate-400">{server.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* MovieBox API Host (Sansekai API) */}
          <div className="border-t border-cinema-border/50 pt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-cinema-purple" />
              <span>MovieBox API URL (Sansekai API)</span>
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Endpoint Sansekai MovieBox API. Jika terkena rate limit/blacklist dari host demo, Anda dapat memasukkan proxy URL atau server mirror Anda di sini.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={movieBoxUrl}
                onChange={(e) => setMovieBoxUrl(e.target.value)}
                placeholder="https://api.sansekai.my.id/api"
                className="flex-1 bg-cinema-card border border-cinema-border rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cinema-cyan"
              />
              <button
                type="button"
                onClick={handleTestMovieBox}
                className="px-3 py-2 rounded-xl bg-cinema-card hover:bg-cinema-card-hover border border-cinema-border text-slate-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
                <span>Tes</span>
              </button>
            </div>

            {testMessage && (
              <div
                className={`mt-2 p-2 rounded-lg text-xs flex items-center gap-2 ${
                  testStatus === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : testStatus === 'error'
                    ? 'bg-red-500/10 border border-red-500/30 text-red-300'
                    : 'bg-blue-500/10 border border-blue-500/30 text-blue-300'
                }`}
              >
                <AlertCircle className="w-4 h-4 flex-none" />
                <span>{testMessage}</span>
              </div>
            )}
          </div>

          {/* TMDB API Key */}
          <div className="border-t border-cinema-border/50 pt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-1">
              <Key className="w-4 h-4 text-cinema-gold" />
              <span>Kustom TMDB API Key (Opsional)</span>
            </label>
            <p className="text-[11px] text-slate-400 mb-2">
              Sudah terintegrasi otomatis dengan Multi-Key bawaan aktif. Isi hanya jika Anda ingin memakai API Key pribadi Anda sendiri.
            </p>
            <input
              type="text"
              value={tmdbApiKey}
              onChange={(e) => setTmdbApiKey(e.target.value)}
              placeholder="Kosongkan untuk memakai built-in public key"
              className="w-full bg-cinema-card border border-cinema-border rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cinema-cyan"
            />
          </div>

          {/* Data Reset */}
          <div className="border-t border-cinema-border/50 pt-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-300">Pembersihan Cache Lokal</p>
              <p className="text-[11px] text-slate-500">Hapus riwayat dan watchlist dari memori browser.</p>
            </div>
            <button
              type="button"
              onClick={handleClearAllStorage}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold"
            >
              Reset Data
            </button>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 sm:p-5 border-t border-cinema-border/70 flex items-center justify-end gap-2.5 bg-cinema-surface/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cinema-card hover:bg-cinema-card-hover border border-cinema-border text-slate-300 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cinema-cyan hover:bg-cyan-400 text-cinema-bg text-xs font-bold shadow-lg shadow-cinema-cyan/20 active:scale-95 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <span>Simpan Pengaturan</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
