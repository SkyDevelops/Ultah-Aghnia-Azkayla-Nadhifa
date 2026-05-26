# Ultah Kay Web

Website undangan ulang tahun statis bertema Baby Shark / pesta bawah laut untuk Aghnia Azkayla Nadhifa.

## Ringkasan

Project ini dibuat sebagai static website tanpa framework build. Halaman utama mengarahkan tamu ke dashboard undangan, menampilkan animasi laut, album foto/video, musik, form ucapan, dan admin setting berbasis modal.

## Struktur Folder

```text
C:\Ultah Kay Web
|-- dashboard.html              # Halaman utama undangan dan admin modal
|-- index.html                  # Halaman awal / gate tamu
|-- css/
|   |-- dashboard.css           # Styling utama dashboard, album, animasi, admin
|-- js/
|   |-- config.js               # Konfigurasi Supabase URL dan anon key
|   |-- dashboard.js            # Logic dashboard, Supabase, admin CRUD, export ucapan
|   |-- guest.js                # Logic halaman awal tamu
|   |-- confetti.js             # Efek confetti jika tersedia
|   |-- scene-assets.js         # Konfigurasi aset scene
|   |-- reference-ocean-scene.js
|-- data/
|   |-- guests.js               # Data/fallback tamu
|-- public/
|   |-- audio/                  # Audio lokal
|   |-- scene-assets/           # Panduan aset GIF/visual laut
|-- scripts/
|   |-- serve-static.mjs        # Server lokal sederhana
|-- supabase_setup.sql          # Setup tabel, RLS, storage
|-- supabase_rls_fix.sql        # Patch khusus policy wishes
|-- supabase_security_fix.sql   # Patch final RLS/admin/storage
|-- netlify.toml                # Konfigurasi deploy Netlify
|-- vercel.json                 # Konfigurasi deploy Vercel
|-- package.json                # Script npm
```

## Library dan Teknologi

- HTML, CSS, JavaScript vanilla.
- Supabase JS v2 dari CDN untuk database dan storage.
- Supabase Postgres untuk `event_info`, `wishes`, `album`, `songs`, dan `visitors`.
- Supabase Storage bucket `album` untuk media foto/video.
- Canvas API untuk animasi lautan ucapan dan export video.
- MediaRecorder API untuk export video ucapan portrait/landscape jika browser mendukung.

Tidak ada React/Vue/Next.js. Tidak ada build step wajib.

## Jalankan Lokal

```bash
npm run dev
```

Buka:

```text
http://127.0.0.1:5173
```

## Setup Supabase

Urutan yang disarankan di Supabase SQL Editor:

1. Jalankan `supabase_setup.sql`
2. Jalankan `supabase_rls_fix.sql`
3. Jalankan `supabase_security_fix.sql`

Setelah itu cek `js/config.js` dan pastikan:

```js
url: "https://PROJECT.supabase.co",
anonKey: "ANON_KEY_PUBLIC"
```

Jangan menaruh service role key di frontend.

## Catatan Admin

Admin setting berjalan dari frontend memakai anon key dan PIN di UI. Karena itu policy Supabase mengizinkan insert/update/delete terbatas dengan validasi RLS. Untuk keamanan produksi penuh, operasi admin sebaiknya dipindah ke backend atau Supabase Edge Function dengan service role.

## Deploy

Project bisa di-deploy sebagai static site. Publish directory adalah root folder project ini, tanpa build command.
