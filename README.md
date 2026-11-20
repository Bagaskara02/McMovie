# 🎬 McMovies — All-in-One Global Cinema, TV Series, Anime & Dub Indo

Aplikasi streaming web modern yang menggabungkan seluruh katalog film bioskop Hollywood, serial TV global, Anime Jepang, Drama Korea/Asia, serta lebih dari **5.600+ film & serial Dubbing Indonesia** dari database McDubindoFlix, tanpa memerlukan registrasi akun (No Login Required).

---

## 🌟 Fitur Utama

1. **Koleksi Film & Serial Super Lengkap**:
   - **Hollywood & Global Box Office**: Film-film layar lebar terbaru dan terpopuler dengan resolusi hingga 4K UHD.
   - **Serial TV & Web Series**: Musim dan episode lengkap dari Netflix, HBO, Disney, Amazon Prime, dll.
   - **Anime Hits & Simulcast**: Serial anime Shounen, Isekai, Romance, serta Anime Movies beresolusi tinggi.
   - **Asian Drama**: K-Drama Korea dan Chinese Drama populer.
   - **Koleksi Spesial Dubbing Bahasa Indonesia (5,600+ Judul)**: Dilengkapi direct high-speed MP4 player tanpa iklan.
2. **Multi-Server Streaming Players (FMHY & MovieBox Integration)**:
   - **VidLink (Ultra HD)**: Cepat, subtitle multibahasa, auto-next episode.
   - **VidSrc v2**: Buffering instan.
   - **AutoEmbed**: Subtitle Indonesia & Inggris lengkap.
   - **Embed.su**: Kualitas 1080p & 4K.
   - **2Embed VIP**: Mirror cadangan handal.
   - **Direct MP4 Stream**: Pemutar bawaan untuk film dan serial Dub Indo.
   - **MovieBox API**: Terintegrasi dengan endpoint MovieBox Sansekai (`https://api.sansekai.my.id/#/MovieBox`).
3. **Desain UI/UX Modern & Sinematik (Terinspirasi CinemaOS)**:
   - Deep obsidian dark theme dengan aksen neon cyan & purple.
   - Hero banner dinamis dengan thumbnail switcher interaktif.
   - Modal detail film lengkap: Poster, sinopsis, rating IMDb/TMDB, durasi, pemeran utama (cast), dan daftar episode per season.
   - Trailer viewer YouTube interaktif.
4. **Tanpa Perlu Login Akun**:
   - **Watchlist**: Simpan film dan serial favorit langsung ke memori lokal browser.
   - **Lanjutkan Nonton (Continue Watching)**: Otomatis mengingat episode dan menit terakhir Anda menonton.
   - **Pencarian Cepat (Ctrl + K)**: Live search instan dengan filter kategori (*Semua*, *Movies*, *TV Shows*, *Dub Indo Saja*).
   - **Pengaturan Server**: Pilih server utama yang Anda sukai dan masukkan custom API key/proxy jika diinginkan.

---

## 🚀 Cara Menjalankan

```bash
# Masuk ke folder proyek
cd "d:\Code\Project1\Project Web\McMovies"

# Install dependencies (jika belum)
npm install

# Jalankan server pengembangan (Development)
npm run dev

# Atau jalankan versi produksi (Build & Preview)
npm run build
npm run preview
```

Buka browser Anda di:
`http://localhost:5174/`

---

## 📁 Struktur Direktori

```text
McMovies/
├── public/
│   ├── data/                 # 5,600+ Database Dub Indo JSON (all_content, movies, series, stream_sources)
│   └── favicon.svg           # Ikon sinematik SVG
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Header navigasi glassmorphic & tabs
│   │   ├── HeroBanner.jsx        # Carousel poster utama & CTA
│   │   ├── ContentRail.jsx       # Rel kategori film horizontal
│   │   ├── MovieCard.jsx         # Kartu poster film dengan badge & tombol putar
│   │   ├── MovieDetailModal.jsx  # Modal sinopsis, cast, dan pemilih episode
│   │   ├── VideoPlayerModal.jsx  # Pemutar streaming dengan multi-server switcher
│   │   ├── SearchModal.jsx       # Modal pencarian cepat & filter
│   │   ├── WatchlistModal.jsx    # Modal koleksi watchlist lokal
│   │   ├── HistoryModal.jsx      # Modal riwayat nonton & progress bar
│   │   └── SettingsModal.jsx     # Pengaturan server & API MovieBox
│   ├── services/
│   │   ├── tmdbService.js        # API katalog global, detail, dan episodes
│   │   ├── dubIndoService.js     # Data service 5,600+ Dubbing Indonesia
│   │   ├── movieBoxService.js    # Client Sansekai MovieBox API
│   │   ├── embedService.js       # Generator URL multi-server embed
│   │   └── storageService.js     # LocalStorage manager (Watchlist, History, Settings)
│   ├── App.jsx                   # Komponen utama aplikasi
│   ├── index.css                 # Konfigurasi Tailwind CSS v4 & custom scrollbars
│   └── main.jsx                  # Entry point React
├── index.html                    # Halaman HTML utama
├── package.json
└── vite.config.js
```
