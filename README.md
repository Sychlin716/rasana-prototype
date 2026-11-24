# Rasana · prototipe aplikasi

Prototipe antarmuka Rasana, asisten operasional untuk usaha roti skala mikro dan kecil.
39 layar, bisa diklik, dengan transisi dan interaksi yang berjalan sungguhan.

Situs statis tanpa dependensi, tanpa proses build. Buka `index.html` dan jalan.

## Cara menjalankan

### Paling cepat: klik ganda

Ekstrak foldernya, lalu klik dua kali `index.html`. Terbuka di browser dan langsung jalan.
Font ikut tertanam di dalam berkas, jadi tampilannya tetap benar walau dibuka tanpa server.

### Kalau mau lewat server lokal

Berguna kalau ingin membukanya dari HP di jaringan WiFi yang sama.

```bash
cd rasana-proto
python3 -m http.server 8000
```

Buka `http://localhost:8000` di komputer. Dari HP, buka `http://ALAMAT-IP-KOMPUTER:8000`.
Cek alamat IP dengan `ipconfig getifaddr en0` di macOS atau `ipconfig` di Windows.

Kalau `python3` tidak ada, pakai `npx serve` bila Node.js terpasang, atau ekstensi
Live Server di VS Code.

### Langsung online tanpa GitHub

Buka vercel.com, masuk, lalu seret foldernya ke halaman **Add New, Project**. Vercel
memberi tautan publik dalam hitungan detik. Cara ini cocok untuk sekadar membagikan
prototipe. Untuk pembaruan otomatis tiap kali ada perubahan, pakai cara GitHub di bawah.

## Isi

| Berkas | Isi |
|---|---|
| `index.html` | Kerangka halaman, bingkai perangkat, panel daftar layar |
| `app.css` | Bingkai, transisi, animasi, state interaksi |
| `fonts.css` | Poppins dan DM Sans tertanam sebagai data URI |
| `app.js` | Router hash, transisi layar, chip, stepper, input, toast |
| `screens.js` | 39 layar hasil render dari sistem desain (dihasilkan otomatis) |
| `assets/` | Logo dan ikon aplikasi |
| `manifest.webmanifest` | Metadata PWA, bisa dipasang ke layar utama HP |

`screens.js` dihasilkan dari sumber desain, jadi jangan disunting manual.

## Cara memakai

- Klik elemen di layar: tombol, kartu, tab, chip, stepper, kolom isian.
- Tab dan Enter berfungsi, Escape untuk kembali.
- Layar memuat lanjut otomatis setelah 2,4 detik.
- Alamat memakai hash, misalnya `#/takar`, jadi tiap layar bisa dibagikan lewat tautan.
- Di desktop tampil sebagai bingkai ponsel dengan daftar layar di samping.
- Di HP memenuhi layar dan bisa dipasang ke layar utama.

## Deploy ke Vercel lewat GitHub

1. Buat repo baru di GitHub, misalnya `rasana-proto`.
2. Dari folder ini:

   ```bash
   git init
   git add .
   git commit -m "Prototipe UI Rasana"
   git branch -M main
   git remote add origin https://github.com/USERNAME/rasana-proto.git
   git push -u origin main
   ```

3. Buka vercel.com, pilih **Add New, Project**, lalu **Import** repo tadi.
4. Biarkan semua setelan kosong. Framework Preset: **Other**. Build Command dan Output
   Directory dikosongkan saja, karena ini situs statis.
5. Tekan **Deploy**.

Setiap `git push` ke `main` otomatis memperbarui situsnya.

## Catatan soal Google Apps Script

Google Apps Script tidak dipakai di sini, dan sebaiknya memang tidak. Alasannya ada di
catatan terpisah yang diberikan bersama berkas ini. Ringkasnya: GAS menyajikan halaman di
dalam iframe sandbox, yang merusak routing hash dan membuat prototipe terasa lambat.

GAS baru masuk akal nanti, kalau prototipe ini perlu membaca atau menulis data penjualan
asli dari Google Sheets. Untuk itu GAS dipakai sebagai API JSON kecil, bukan sebagai
tempat menaruh halamannya.

## Status

Angka, nama, dan teks di dalamnya semuanya data contoh, ditandai dengan label
"Data contoh" di kartu yang menampilkan angka. Belum ada backend dan belum ada data asli.
