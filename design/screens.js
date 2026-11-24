'use strict';
const L = require('./lib');
const A = require('./art');
const {
  I, C, F, V, H, txt, icon, flat,
  display, title, section, rowTitle, body, small, caption, label, num, TitleBlock,
  Card, Panel, Btn, LinkBtn, Field, Chip, IconTile, Row, ListGroup, Choice, Tag, Meter,
  TopBar, NavBar, Screen, GUTTER,
} = L;

// ---------- local building blocks ----------
const LOGO = (w = 124) => I('logo', { w, h: Math.round(w * 268 / 900), alt: 'Rasana', n: 'Logo Rasana' });
const Pad = (...c) => V({ w: 'fill', pad: [0, GUTTER], gap: 24 }, ...flat(c));
const Dot = (c) => F({ w: 8, h: 8, r: 999, bg: c });
const Divider = () => F({ w: 'fill', h: 1.5, bg: 'line' });

// Mascot speech: used once per setup step to explain why we ask, never as decoration.
const Coach = (text, mood = 'happy') =>
  H({ n: 'Maskot + pesan', w: 'fill', ax: 'center', gap: 0 },
    A.rotiN(56, mood), A.tail,
    H({ w: 'fill', bg: 'white', r: 16, pad: [12, 16] }, txt(text, 14, 'bodyM', 'ink', { lh: 20, w: 'fill' })));

const Seg = (items, active) =>
  H({ n: 'Segmented', w: 'fill', h: 52, bg: 'cream', r: 16, pad: 4, gap: 4 },
    ...items.map(([lab, go]) => H({ n: 'Seg / ' + lab, w: 'fill', h: 44, r: 12, bg: lab === active ? 'white' : null, ax: 'center', jx: 'center', go: lab === active ? null : go, role: 'button' },
      txt(lab, 14, lab === active ? 'bodyB' : 'bodyM', lab === active ? 'ink' : 'ink2', { lh: 20 }))));

const Stepper = (val, { id, step = 1, min = 0, fmt = 'n' } = {}) =>
  H({ n: 'Stepper', gap: 8, ax: 'center', attrs: { 'data-stepper': id || 'x', 'data-fmt': fmt, 'data-min': min } },
    H({ n: 'Kurangi', w: 44, h: 44, r: 12, bg: 'oliveL', ax: 'center', jx: 'center', role: 'button', act: 1, attrs: { 'data-act': 'step', 'data-d': -step, 'aria-label': 'Kurangi', tabindex: 0 } }, icon('minus', 'olive', 20)),
    num(val, 20, { w: 64, align: 'center', attrs: { 'data-val': 1, 'data-num': String(val).replace(/\D/g, ''), 'aria-live': 'polite' } }),
    H({ n: 'Tambah', w: 44, h: 44, r: 12, bg: 'olive', ax: 'center', jx: 'center', role: 'button', act: 1, attrs: { 'data-act': 'step', 'data-d': step, 'aria-label': 'Tambah', tabindex: 0 } }, icon('plus', 'white', 20)));

const Avatar = (t, tone = 'gold', size = 44, r = 12) =>
  H({ n: 'Avatar ' + t, w: size, h: size, r, bg: tone, ax: 'center', jx: 'center' }, txt(t, size >= 56 ? 20 : 14, 'disp', 'ink', { lh: size >= 56 ? 26 : 20 }));

const out = [];
const add = (s) => out.push(s);

// ========================= 1. MASUK DAN DAFTAR =========================
const SEC1 = 'Masuk dan daftar';

add(Screen('welcome', '01 Welcome', {
  section: SEC1, pad: 0, gap: 24,
  body: [
    V({ w: 'fill', pad: [16, GUTTER, 0, GUTTER] }, LOGO(112)),
    A.welcome(390, 300),
    V({ w: 'fill', pad: [0, GUTTER], gap: 8 },
      display('Produksi pas,\nsisa berkurang.'),
      body('Rasana menghitungnya dari data penjualan usahamu.')),
  ],
  footer: [Btn('Buat akun usaha', { go: 'daftar' }), LinkBtn('Saya sudah punya akun', 'login')],
}));

add(Screen('daftar', '02 Daftar', {
  section: SEC1,
  body: [
    TopBar('welcome'),
    TitleBlock('Buat akun Rasana', 'Satu akun untuk semua usahamu.'),
    V({ w: 'fill', gap: 16 },
      Field('Nama lengkap', 'Rina Maharani', { ic: 'user' }),
      Field('Email atau nomor HP', 'rina@tokorotirina.id', { ic: 'mail' }),
      Field('Kata sandi', '••••••••', { ic: 'lock', state: 'focus', helper: 'Minimal 8 karakter' })),
  ],
  footer: [Btn('Buat akun', { go: 'verify' }), LinkBtn('Sudah punya akun? Masuk', 'login')],
}));

const otp = (digits, state) => H({ n: 'Kode OTP', w: 'fill', gap: 8 }, ...Array.from({ length: 6 }, (_, i) => {
  const d = digits[i];
  const focus = state === 'idle' && i === digits.length;
  return H({
    n: 'Digit ' + (i + 1), w: 'fill', h: 60, r: 12, bg: 'white', ax: 'center', jx: 'center',
    stroke: state === 'error' ? { c: 'err', w: 2 } : focus ? { c: 'olive', w: 2 } : { c: 'lineD', w: 1.5 },
    edit: 'Digit kode ' + (i + 1), attrs: { 'data-otp': '1' },
  }, d ? num(d, 20, { color: state === 'error' ? 'err' : 'ink' }) : null);
}));

add(Screen('verify', '03 Verifikasi', {
  section: SEC1,
  body: [
    TopBar('daftar'),
    A.envelope(342, 180),
    TitleBlock('Cek email kamu', 'Kami kirim kode 6 digit ke rina@tokorotirina.id.'),
    V({ w: 'fill', gap: 16 },
      otp(['4', '8', '2'], 'idle'),
      H({ w: 'fill', jx: 'between', ax: 'center' },
        small('Kirim ulang kode dalam 0:42'),
        H({ go: 'daftar', h: 44, ax: 'center', role: 'button', n: 'Ganti email' }, txt('Ganti email', 14, 'bodyB', 'olive', { lh: 20 })))),
  ],
  footer: [Btn('Verifikasi', { go: 'setup1' })],
}));

add(Screen('verifyErr', '03b Verifikasi, kode salah', {
  section: SEC1, note: 'State error',
  body: [
    TopBar('daftar'),
    A.envelope(342, 180),
    TitleBlock('Cek email kamu', 'Kami kirim kode 6 digit ke rina@tokorotirina.id.'),
    V({ w: 'fill', gap: 12 },
      otp(['4', '8', '2', '1', '9', '0'], 'error'),
      H({ w: 'fill', gap: 8, ax: 'center' }, icon('warn', 'err', 16), txt('Kode tidak cocok. Periksa lagi atau minta kode baru.', 12, 'bodyB', 'err', { lh: 16, w: 'fill' }))),
  ],
  footer: [Btn('Kirim kode baru', { go: 'verify' }), LinkBtn('Ganti email', 'daftar')],
}));

add(Screen('login', '04 Masuk', {
  section: SEC1,
  body: [
    TopBar('welcome'),
    TitleBlock('Masuk ke Rasana', 'Usahamu sudah menunggu.'),
    V({ w: 'fill', gap: 16 },
      Field('Email atau nomor HP', 'rina@tokorotirina.id', { ic: 'mail' }),
      Field('Kata sandi', '••••••••', { ic: 'lock' })),
  ],
  footer: [Btn('Masuk', { go: 'pilih' }), LinkBtn('Belum punya akun? Buat akun', 'daftar')],
}));

add(Screen('pilih', '05 Pilih usaha', {
  section: SEC1, note: 'Muncul hanya jika akun punya lebih dari satu usaha',
  body: [
    TopBar('login'),
    TitleBlock('Kelola usaha yang mana?', 'Akunmu punya lebih dari satu usaha.'),
    V({ w: 'fill', gap: 12 },
      Choice('Toko Roti Rina', 'Roti dan kue · Bogor', { ic: 'store', tone: 'goldL', iconColor: 'goldD', go: 'home', selected: true }),
      Choice('Katering Rina', 'Katering · Bogor', { ic: 'store', tone: 'sageL', iconColor: 'sageD', go: 'home' }),
      Choice('Tambah usaha baru', 'Isi profil dari awal', { ic: 'plus', tone: 'oliveL', go: 'setup1' })),
  ],
}));

// ========================= 2. SETUP USAHA =========================
const SEC2 = 'Setup usaha (4 langkah)';
const ChipRow = (...chips) => H({ w: 'fill', gap: 8 }, ...flat(chips));
const FieldGroup = (...f) => V({ w: 'fill', gap: 16 }, ...flat(f));
const stepScreen = (key, name, step, back, bodyNodes, footer) =>
  Screen(key, name, { section: SEC2, body: [V({ w: 'fill', gap: 12 }, TopBar(back, step), Meter(step)), ...bodyNodes], footer });

add(stepScreen('setup1', '06 Setup 1 Usaha', 1, 'verify', [
  Coach('Kenalan dulu sama usahamu, supaya rekomendasi nanti pas.', 'happy'),
  TitleBlock('Usahamu namanya apa?'),
  FieldGroup(
    Field('Nama usaha', 'Toko Roti Rina', { ic: 'store', state: 'focus' }),
    V({ w: 'fill', gap: 8 }, label('Jenis usaha'), ChipRow(Chip('Rumahan', true), Chip('Kios', false), Chip('Toko', false), Chip('Kafe', false))),
    V({ w: 'fill', gap: 8 }, label('Kategori'),
      ChipRow(Chip('Roti dan kue', true), Chip('Kafe dan minuman', false)),
      ChipRow(Chip('Warung makan', false), Chip('Katering', false), Chip('Lainnya', false)))),
], [Btn('Lanjut', { go: 'setup2' })]));

const dayChip = (d, on) => H({ w: 'fill', h: 44, r: 12, bg: on ? 'olive' : 'white', stroke: { c: on ? 'oliveD' : 'lineD', w: 1.5 }, ax: 'center', jx: 'center', role: 'button', chip: 'multi', sel: on, n: 'Hari ' + d }, txt(d, 12, on ? 'bodyB' : 'bodyM', on ? 'white' : 'ink', { lh: 16 }));

add(stepScreen('setup2', '07 Setup 2 Lokasi dan jam', 2, 'setup1', [
  Coach('Jam buka dipakai untuk menentukan kapan produksi mulai.', 'think'),
  TitleBlock('Lokasi dan jam buka'),
  FieldGroup(
    Field('Kota atau kecamatan', 'Bogor Tengah, Bogor', { ic: 'pin' }),
    V({ w: 'fill', gap: 8 }, label('Hari buka'), H({ w: 'fill', gap: 4 }, ...['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => dayChip(d, true)), dayChip('Min', false))),
    H({ w: 'fill', gap: 12 }, V({ w: 'fill' }, Field('Jam buka', '07.00', { ic: 'clock' })), V({ w: 'fill' }, Field('Jam tutup', '17.00', { ic: 'clock' })))),
], [Btn('Lanjut', { go: 'setup3' }), LinkBtn('Isi nanti', 'setup3')]));

const productFields = (filled = true) => [
  Field('Nama produk', filled ? 'Roti cokelat' : '', { ic: 'bun', ph: 'Contoh: roti cokelat', state: 'focus' }),
  Field('Harga jual', filled ? 'Rp 8.000' : '', { ic: 'coin', ph: 'Rp 0', helper: 'Harga satu satuan, bukan per batch' }),
  V({ w: 'fill', gap: 8 }, label('Satuan'), ChipRow(Chip('Pcs', true), Chip('Box', false), Chip('Loyang', false), Chip('Kg', false))),
];

add(stepScreen('setup3', '08 Setup 3 Produk pertama', 3, 'setup2', [
  Coach('Satu produk dulu cukup. Sisanya bisa ditambah kapan saja.', 'happy'),
  TitleBlock('Produk andalanmu'),
  FieldGroup(...productFields()),
], [Btn('Simpan produk', { go: 'source' })]));

// ========================= 3. DATA PENJUALAN =========================
const SEC3 = 'Data penjualan (4 jalur)';
const dataScreen = (key, name, back, bodyNodes, footer, o = {}) =>
  Screen(key, name, { section: SEC3, body: [V({ w: 'fill', gap: 12 }, TopBar(back, 4), Meter(4)), ...bodyNodes], footer, ...o });

add(dataScreen('source', '09 Sumber data', 'setup3', [
  TitleBlock('Data penjualan dari mana?', 'Pilih cara yang paling gampang buatmu.'),
  V({ w: 'fill', gap: 12 },
    Choice('Aplikasi kasir (POS)', 'Sambungkan, data masuk otomatis', { ic: 'pos', tone: 'goldL', iconColor: 'goldD', go: 'pos' }),
    Choice('Laporan Excel atau CSV', 'Unggah file dari kasir atau catatanmu', { ic: 'upload', tone: 'sageL', iconColor: 'sageD', go: 'upload' }),
    Choice('Catat manual', 'Ketik penjualan hari ini', { ic: 'pencil', tone: 'orangeL', iconColor: 'orangeD', go: 'manual' }),
    Choice('Belum punya data', 'Mulai dari perkiraan, bisa diganti nanti', { ic: 'chart', tone: 'oliveL', go: 'estimate' })),
]));

add(dataScreen('pos', '10a Sambungkan kasir', 'source', [
  TitleBlock('Sambungkan aplikasi kasir', 'Rasana hanya membaca data penjualan: tanggal, produk, jumlah, dan harga.'),
  Field('Nama aplikasi kasir', '', { ic: 'pos', ph: 'Ketik nama aplikasi yang kamu pakai' }),
  H({ n: 'Catatan izin', w: 'fill', pad: 16, gap: 12, bg: 'oliveL', r: 16, ax: 'center' },
    icon('lock', 'olive', 24), caption('Kamu bisa memutus sambungan kapan saja dari Akun, menu Sumber data penjualan.', { w: 'fill' })),
], [Btn('Sambungkan', { go: 'posLoading' }), LinkBtn('Kasirmu tidak ada di daftar? Unggah file', 'upload')]));

add(Screen('posLoading', '10b Menyambungkan (loading)', {
  section: SEC3, note: 'State loading, lanjut otomatis', after: { go: 'check', ms: 2400 },
  body: [TopBar(null),
    V({ w: 'fill', h: 'fill', gap: 24, ax: 'center', jx: 'center' },
      A.stateScene('loading', 342, 230),
      V({ w: 'fill', gap: 8, ax: 'center' },
        title('Menyambungkan ke kasir', { align: 'center' }),
        body('Mengambil data penjualan 30 hari terakhir. Jangan tutup aplikasi dulu.', { align: 'center' })))],
  footer: [LinkBtn('Batalkan', 'pos')],
}));

add(dataScreen('posErr', '10c Gagal tersambung (error)', 'source', [
  A.stateScene('error', 342, 220),
  TitleBlock('Data belum masuk', 'Rasana belum bisa membaca data dari aplikasi kasir. Cek koneksi internetmu, lalu coba lagi.'),
], [Btn('Coba lagi', { go: 'posLoading' }), Btn('Unggah file Excel atau CSV', { go: 'upload', kind: 'secondary' }), LinkBtn('Lewati dulu, pakai perkiraan', 'estimate')], { note: 'State error' }));

add(dataScreen('upload', '11a Unggah laporan', 'source', [
  TitleBlock('Unggah laporan penjualan', 'Pakai file CSV atau Excel dari kasir atau catatanmu.'),
  V({ n: 'Area unggah', w: 'fill', h: 180, r: 20, bg: 'white', stroke: { c: 'lineD', w: 2, dash: [8, 6] }, ax: 'center', jx: 'center', gap: 12, go: 'check', role: 'button' },
    IconTile('upload', 'oliveL', 'olive', 56),
    V({ gap: 4, ax: 'center' }, rowTitle('Pilih file dari HP'), caption('Maksimal 10 MB'))),
  V({ w: 'fill', gap: 8 }, label('Kolom yang Rasana baca'),
    H({ w: 'fill', gap: 8 }, Tag('Tanggal', 'cream'), Tag('Nama produk', 'cream'), Tag('Jumlah', 'cream'), Tag('Harga', 'cream'))),
], [Btn('Pilih file', { go: 'check' }), LinkBtn('Catat manual saja', 'manual')]));

add(dataScreen('uploadErr', '11b File tidak terbaca (error)', 'source', [
  TitleBlock('Unggah laporan penjualan'),
  H({ n: 'File bermasalah', w: 'fill', pad: 16, gap: 12, bg: 'errL', r: 16, ax: 'center', stroke: { c: 'err', w: 1.5 } },
    IconTile('file', 'white', 'err'),
    V({ w: 'fill', gap: 4 }, rowTitle('penjualan_november.pdf', { w: 'fill' }), txt('Format belum didukung. Pakai file .csv atau .xlsx.', 12, 'bodyM', 'err', { lh: 16, w: 'fill' }))),
  V({ w: 'fill', gap: 8 }, label('Cara cepat memperbaiki'),
    body('Buka file di aplikasi kasirmu atau Excel, lalu simpan ulang sebagai CSV atau XLSX.')),
], [Btn('Pilih file lain', { go: 'check' }), LinkBtn('Catat manual saja', 'manual')], { note: 'State error' }));

add(dataScreen('manual', '12 Catat penjualan', 'source', [
  TitleBlock('Catat penjualan', 'Isi penjualan hari ini. Hari lain bisa ditambah nanti.'),
  V({ w: 'fill', gap: 12 },
    Field('Tanggal', 'Selasa, 24 November 2026', { ic: 'calendar' }),
    H({ n: 'Baris produk', w: 'fill', pad: 16, gap: 12, bg: 'white', r: 16, ax: 'center' },
      V({ w: 'fill', gap: 4 }, rowTitle('Roti cokelat'), caption('Rp 8.000 per pcs')),
      Stepper('24', { id: 'man' })),
    Row('Tambah produk lain', 'Dari daftar produkmu', { ic: 'plus', tone: 'oliveL', go: 'produk' })),
  Panel('olive', { gap: 4 },
    txt('Total hari ini', 14, 'bodyM', 'cream', { lh: 20 }),
    num('Rp 192.000', 20, { color: 'white', attrs: { 'data-id': 'man-total' } })),
], [Btn('Lanjut', { go: 'check' })]));

add(dataScreen('estimate', '13 Perkiraan awal', 'source', [
  TitleBlock('Mulai dari perkiraan', 'Isi kira-kira saja. Rasana menandai angka ini sebagai perkiraan sampai ada data asli.'),
  V({ w: 'fill', gap: 16 },
    Field('Produksi per hari', '30 pcs', { ic: 'bun' }),
    Field('Terjual per hari', '24 pcs', { ic: 'chart', helper: 'Sisa 6 pcs per hari akan dihitung otomatis' })),
  H({ n: 'Catatan perkiraan', w: 'fill', pad: 16, gap: 12, bg: 'goldL', r: 16, ax: 'center' },
    icon('info', 'goldD', 24), caption('Rekomendasi TAKAR akan lebih tepat setelah ada data penjualan asli.', { w: 'fill' })),
], [Btn('Simpan perkiraan', { go: 'saving' })]));

add(dataScreen('check', '14 Periksa data', 'source', [
  TitleBlock('Periksa dulu datanya', 'Rasana mencocokkan produk di data dengan produk di akunmu.'),
  V({ w: 'fill', gap: 12 },
    H({ w: 'fill', pad: 16, gap: 12, bg: 'white', r: 16, ax: 'center' },
      IconTile('check', 'oliveL', 'olive'),
      V({ w: 'fill', gap: 4 }, rowTitle('Roti cokelat', { w: 'fill' }), caption('24 pcs · Rp 192.000', { w: 'fill' })),
      Tag('Cocok', 'sageL')),
    V({ w: 'fill', pad: 16, gap: 12, bg: 'white', r: 16, stroke: { c: 'orange', w: 2 } },
      H({ w: 'fill', gap: 12, ax: 'center' },
        IconTile('warn', 'orangeL', 'orangeD'),
        V({ w: 'fill', gap: 4 }, rowTitle('Roti keju', { w: 'fill' }), caption('18 pcs · belum ada di daftar produk', { w: 'fill' }))),
      H({ w: 'fill', gap: 8 }, Chip('Tambah sebagai produk', true), Chip('Abaikan', false)))),
  caption('Total data yang dibaca: 2 produk, 42 pcs, Rp 354.000.', { w: 'fill' }),
], [Btn('Simpan data', { go: 'saving' }), LinkBtn('Kembali pilih sumber data', 'source')]));

add(Screen('saving', '15 Menyimpan (loading)', {
  section: SEC3, note: 'State loading, lanjut otomatis', after: { go: 'ready', ms: 2400 },
  body: [V({ w: 'fill', h: 'fill', gap: 24, ax: 'center', jx: 'center' },
    A.stateScene('loading', 342, 230),
    V({ w: 'fill', gap: 8, ax: 'center' }, title('Menyiapkan dashboard', { align: 'center' }), body('Menyimpan data usahamu. Sebentar saja.', { align: 'center' })))],
}));

add(Screen('ready', '16 Usahamu siap', {
  section: SEC3, bg: 'oliveD', status: 'white', homeFg: 'white', pad: 0, gap: 0,
  body: [
    A.readyFull(390, 620),
    V({ w: 'fill', h: 'fill', pad: [24, GUTTER, 0, GUTTER], jx: 'start' },
      txt('Usahamu sudah siap', 28, 'disp', 'white', { lh: 36, w: 'fill', ls: -0.5 })),
  ],
  footer: [Btn('Buka beranda', { go: 'home', kind: 'accent' })],
}));

// ========================= 4. BERANDA =========================
const SEC4 = 'Beranda dan kondisi';
const HomeHead = () => H({ n: 'Header beranda', w: 'fill', h: 44, ax: 'center', jx: 'between' }, LOGO(120), H({ n: 'Buka akun', go: 'akun', role: 'button', w: 44, h: 44, ax: 'center', jx: 'center' }, Avatar('TR')));
const Greet = () => V({ w: 'fill', gap: 4 }, title('Halo, Rina'), small('Toko Roti Rina · Bogor'));

// Focal point of the whole app: tomorrow's production number. The whole panel opens TAKAR,
// so it needs no button of its own and stays one compact block.
const TomorrowPanel = () => V({ n: 'Rencana besok', w: 'fill', bg: 'gold', r: 20, pad: 16, gap: 8, go: 'takar', role: 'button' },
  H({ w: 'fill', jx: 'between', ax: 'center' }, txt('Besok, Rabu 25 November', 12, 'bodyB', 'ink', { lh: 16 }), Tag('Data contoh', 'white')),
  num('Siapkan 50 roti', 28, { w: 'fill' }),
  H({ w: 'fill', ax: 'center', gap: 8 },
    txt('30 cokelat, 20 keju', 14, 'bodyM', 'ink', { lh: 20, w: 'fill' }),
    txt('Lihat rencana', 14, 'bodyB', 'ink', { lh: 20 }), icon('right', 'ink', 20)));

const Stat = (lab, val, w = 'fill') => V({ w, gap: 4 }, txt(lab, 12, 'bodyM', 'cream', { lh: 16 }), num(val, 20, { color: 'white' }));
const TodayPanel = () => Panel('olive', { gap: 16 },
  H({ w: 'fill', jx: 'between', ax: 'center' }, txt('Hari ini', 14, 'bodyB', 'white', { lh: 20 }), Tag('Data contoh', 'oliveD', 'white')),
  H({ w: 'fill', gap: 8 }, Stat('Penjualan', 'Rp 354rb', 132), Stat('Terjual', '42 pcs'), Stat('Sisa', '6 pcs')));

const ServiceCard = (kind, name, desc, go) => V({ n: 'Layanan / ' + name, w: 'fill', bg: 'white', r: 20, clip: true, go, role: 'button' },
  A.serviceArt(kind, 165, 76),
  V({ w: 'fill', pad: 12, gap: 4 }, rowTitle(name), caption(desc, { w: 'fill' })));

const ChecklistRow = () => H({ n: 'Lengkapi usaha', w: 'fill', pad: 16, gap: 12, bg: 'oliveL', r: 16, ax: 'center', go: 'lengkapi', role: 'button' },
  V({ w: 'fill', gap: 8 }, rowTitle('Lengkapi usahamu'), Meter(3, 4, 'olive', 'white'), caption('Berikutnya: resep dan bahan', { w: 'fill' })),
  icon('right', 'olive', 20));

add(Screen('home', '17 Beranda', {
  section: SEC4, nav: NavBar('Beranda'),
  body: [V({ w: 'fill', gap: 16 }, HomeHead(), Greet()), TomorrowPanel(), TodayPanel(),
    V({ w: 'fill', gap: 12 },
      H({ w: 'fill', gap: 12 }, ServiceCard('timbang', 'TIMBANG', 'HPP dan laba', 'timbang'), ServiceCard('tumbuh', 'TUMBUH', 'Rasana Academy', 'tumbuh')),
      ChecklistRow())],
}));

add(Screen('homeEmpty', '17b Beranda, belum ada data (empty)', {
  section: SEC4, nav: NavBar('Beranda'), note: 'State empty',
  body: [V({ w: 'fill', gap: 16 }, HomeHead(), Greet()),
    Card({ gap: 16, ax: 'center', pad: 16 },
      A.stateScene('empty', 310, 170),
      V({ w: 'fill', gap: 8, ax: 'center' }, section('Belum ada data penjualan', { align: 'center', w: 'fill' }),
        txt('Tambahkan data supaya TAKAR bisa menyarankan jumlah produksi.', 14, 'body', 'ink2', { lh: 20, w: 'fill', align: 'center' })),
      Btn('Tambah data penjualan', { go: 'source' })),
    ListGroup(
      Row('TIMBANG', 'Hitung HPP tanpa data penjualan', { ic: 'timbang', tone: 'orangeL', iconColor: 'orangeD', go: 'timbang', bare: true }),
      Row('TUMBUH', 'Belajar mengelola usaha roti', { ic: 'tumbuh', tone: 'sageL', iconColor: 'sageD', go: 'tumbuh', bare: true }))],
}));

add(Screen('homeLoading', '17c Beranda, memuat (loading)', {
  section: SEC4, nav: NavBar('Beranda'), note: 'State loading', gap: 16,
  body: [V({ w: 'fill', gap: 16 }, HomeHead(), Greet()),
    F({ w: 'fill', h: 196, bg: 'cream', r: 20 }),
    F({ w: 'fill', h: 104, bg: 'cream', r: 20 }),
    H({ w: 'fill', gap: 12 }, F({ w: 'fill', h: 160, bg: 'cream', r: 20 }), F({ w: 'fill', h: 160, bg: 'cream', r: 20 })),
    caption('Memuat data usahamu', { w: 'fill', align: 'center' })],
}));

add(Screen('homeError', '17d Beranda, gagal memuat (error)', {
  section: SEC4, nav: NavBar('Beranda'), note: 'State error',
  body: [V({ w: 'fill', gap: 16 }, HomeHead(), Greet()),
    Card({ gap: 16, ax: 'center', pad: 16 },
      A.stateScene('error', 310, 200),
      V({ w: 'fill', gap: 8, ax: 'center' }, section('Data belum bisa dimuat', { align: 'center', w: 'fill' }),
        txt('Sepertinya koneksi internetmu terputus. Datamu aman, coba muat lagi.', 14, 'body', 'ink2', { lh: 20, w: 'fill', align: 'center' })),
      Btn('Muat ulang', { go: 'home', ic: 'refresh' }))],
}));

const doneRow = (t, d) => Row(t, d, { ic: 'check', tone: 'oliveL', tag: Tag('Selesai', 'sageL'), bare: true });
add(Screen('lengkapi', '18 Lengkapi usaha', {
  section: SEC4,
  body: [
    TopBar('home'),
    TitleBlock('Lengkapi usahamu', 'Makin lengkap datamu, makin tepat rekomendasi TAKAR dan hitungan TIMBANG.'),
    V({ w: 'fill', gap: 8 }, Meter(3), label('3 dari 4 langkah selesai')),
    ListGroup(
      doneRow('Profil usaha', 'Nama, lokasi, dan jam buka'),
      doneRow('Produk pertama', 'Roti cokelat · Rp 8.000'),
      doneRow('Data penjualan', 'Perkiraan awal tersimpan'),
      Row('Resep dan bahan', 'Dipakai untuk menghitung HPP', { ic: 'bun', tone: 'orangeL', iconColor: 'orangeD', go: 'resep', bare: true })),
  ],
}));

const ing = (n, q, p) => H({ w: 'fill', h: 56, ax: 'center', gap: 12 },
  V({ w: 'fill', gap: 4 }, txt(n, 14, 'bodyB', 'ink', { lh: 20 }), caption(q)), txt(p, 14, 'bodyB', 'ink', { lh: 20 }));
add(Screen('resep', '19 Resep dan bahan', {
  section: SEC4,
  body: [
    TopBar('lengkapi'),
    TitleBlock('Resep roti cokelat'),
    Field('Hasil per batch', '24 pcs', { ic: 'bun' }),
    V({ w: 'fill', bg: 'white', r: 20, pad: [4, 16], clip: true },
      H({ w: 'fill', h: 56, ax: 'center', jx: 'between' }, rowTitle('Bahan per batch'), Tag('Data contoh')),
      F({ w: 'fill', h: 1.5, bg: 'line' }),
      ing('Tepung terigu', '1,5 kg · Rp 12.000/kg', 'Rp 18.000'), F({ w: 'fill', h: 1.5, bg: 'line' }),
      ing('Cokelat batang', '0,4 kg · Rp 90.000/kg', 'Rp 36.000'), F({ w: 'fill', h: 1.5, bg: 'line' }),
      ing('Mentega', '0,3 kg · Rp 60.000/kg', 'Rp 18.000'), F({ w: 'fill', h: 1.5, bg: 'line' }),
      ing('Ragi, gula, lainnya', 'Perkiraan', 'Rp 4.800')),
    H({ w: 'fill', pad: 16, bg: 'goldL', r: 16, ax: 'center', jx: 'between' },
      V({ gap: 4 }, caption('Biaya bahan per batch'), num('Rp 76.800', 20)),
      V({ gap: 4, ax: 'end' }, caption('Per roti'), num('Rp 3.200', 20))),
  ],
  footer: [Btn('Simpan resep', { go: 'lengkapi' })],
}));

// ========================= 5. TAKAR =========================
const SEC5 = 'TAKAR (produksi)';
const ServiceHead = (name, desc, kind) => H({ w: 'fill', ax: 'center', gap: 12 },
  V({ w: 'fill', gap: 4 }, title(name), small(desc, { w: 'fill' })), A.serviceBadge(kind, 44));
const TakarSeg = (a) => Seg([['Rencana', 'takar'], ['Evaluasi', 'evaluasi']], a);

add(Screen('takar', '20 TAKAR Rencana', {
  section: SEC5, nav: NavBar('Takar'), gap: 16,
  body: [ServiceHead('TAKAR', 'Rencana dan evaluasi produksi', 'takar'), TakarSeg('Rencana'),
    V({ n: 'Rekomendasi besok', w: 'fill', bg: 'gold', r: 20, pad: 16, gap: 8 },
      H({ w: 'fill', jx: 'between', ax: 'center' }, txt('Besok, Rabu 25 November', 12, 'bodyB', 'ink', { lh: 16 }), Tag('Data contoh', 'white')),
      num('Siapkan 50 roti', 28, { w: 'fill' }),
      txt('30 roti cokelat dan 20 roti keju, dihitung dari penjualan beberapa minggu terakhir.', 14, 'bodyM', 'ink', { lh: 20, w: 'fill' })),
    ListGroup(
      Row('Perkiraan permintaan', 'Sedikit di atas rata-rata', { ic: 'chart', tone: 'goldL', iconColor: 'goldD', bare: true }),
      Row('Bahan belum cukup', 'Cokelat kurang 0,3 kg', { ic: 'warn', tone: 'orangeL', iconColor: 'orangeD', tag: Tag('Beli dulu', 'orangeL'), bare: true }),
      Row('Mulai produksi 05.00', 'Agar siap sebelum buka', { ic: 'clock', tone: 'sageL', iconColor: 'sageD', bare: true })),
  ],
  footer: [Btn('Atur rencana', { go: 'rencana' })],
}));

add(Screen('takarEmpty', '20b TAKAR, belum ada data (empty)', {
  section: SEC5, nav: NavBar('Takar'), note: 'State empty', gap: 16,
  body: [ServiceHead('TAKAR', 'Rencana dan evaluasi produksi', 'takar'), TakarSeg('Rencana'),
    Card({ gap: 16, ax: 'center' },
      A.stateScene('empty', 310, 200),
      V({ w: 'fill', gap: 8, ax: 'center' }, section('Belum ada data untuk direncanakan', { align: 'center', w: 'fill' }),
        txt('TAKAR butuh data penjualan beberapa hari. Tambahkan datanya, atau mulai dari perkiraan.', 14, 'body', 'ink2', { lh: 20, w: 'fill', align: 'center' })),
      Btn('Tambah data penjualan', { go: 'source' }))],
}));

add(Screen('rencana', '21 Atur rencana', {
  section: SEC5,
  body: [
    TopBar('takar'),
    TitleBlock('Atur rencana besok', 'Ubah jumlah kalau kamu tahu ada pesanan atau libur.'),
    V({ w: 'fill', gap: 12 },
      H({ w: 'fill', pad: 16, gap: 12, bg: 'white', r: 16, ax: 'center' },
        V({ w: 'fill', gap: 4 }, rowTitle('Roti cokelat'), caption('Disarankan 30')), Stepper('30', { id: 'rc' })),
      H({ w: 'fill', pad: 16, gap: 12, bg: 'white', r: 16, ax: 'center' },
        V({ w: 'fill', gap: 4 }, rowTitle('Roti keju'), caption('Disarankan 20')), Stepper('20', { id: 'rk' }))),
    V({ n: 'Ringkasan rencana', w: 'fill', pad: 16, gap: 12, bg: 'oliveL', r: 16 },
      H({ w: 'fill', jx: 'between', ax: 'center' }, small('Total produksi', { color: 'ink' }), num('50 roti', 20, { attrs: { 'data-id': 'rc-total' } })),
      H({ w: 'fill', jx: 'between', ax: 'center' }, small('Perkiraan biaya bahan', { color: 'ink' }), num('Rp 160.000', 20, { attrs: { 'data-id': 'rc-cost' } })),
      caption('Dari HPP bahan Rp 3.200 per roti.', { w: 'fill' })),
    H({ w: 'fill', gap: 12, pad: 16, bg: 'orangeL', r: 16, ax: 'center' },
      icon('warn', 'orangeD', 20), txt('Cokelat batang kurang 0,3 kg untuk jumlah ini.', 12, 'bodyB', 'ink', { lh: 16, w: 'fill' })),
  ],
  footer: [Btn('Simpan rencana', { go: 'takar' })],
}));

const bar = (sold, left, total = 310) => H({ w: 'fill', h: 12, r: 8, clip: true, bg: 'line' },
  F({ w: Math.round(sold / (sold + left) * total), h: 12, bg: 'olive', cls: 'r-grow' }), F({ w: Math.round(left / (sold + left) * total), h: 12, bg: 'orange', cls: 'r-grow' }));
const evalItem = (n, sold, left) => V({ w: 'fill', gap: 8 },
  H({ w: 'fill', jx: 'between', ax: 'center' }, rowTitle(n), caption(`${sold} dari ${sold + left} terjual`)), bar(sold, left));

add(Screen('evaluasi', '22 TAKAR Evaluasi', {
  section: SEC5, nav: NavBar('Takar'), gap: 16,
  body: [ServiceHead('TAKAR', 'Rencana dan evaluasi produksi', 'takar'), TakarSeg('Evaluasi'),
    Card({ gap: 16 },
      H({ w: 'fill', jx: 'between', ax: 'center' }, rowTitle('Hari ini, 24 November'), Tag('Data contoh')),
      evalItem('Roti cokelat', 24, 4), evalItem('Roti keju', 18, 2),
      H({ w: 'fill', gap: 16 },
        H({ gap: 8, ax: 'center' }, Dot('olive'), caption('Terjual')),
        H({ gap: 8, ax: 'center' }, Dot('orange'), caption('Sisa')))),
    H({ w: 'fill', gap: 16, pad: 16, bg: 'orangeL', r: 20, ax: 'center' },
      V({ gap: 4 }, num('6', 28), caption('roti sisa')),
      txt('Dari 48 roti yang dibuat. Roti cokelat paling sering sisa, coba kurangi 2 pcs besok.', 14, 'bodyM', 'ink', { lh: 20, w: 'fill' })),
  ],
  footer: [Btn('Terapkan ke rencana besok', { go: 'rencana' })],
}));

// ========================= 6. TIMBANG =========================
const SEC6 = 'TIMBANG (HPP dan laba)';
const TimSeg = (a) => Seg([['HPP', 'timbang'], ['Simulasi', 'simulasi']], a);
const legendRow = (c, n, v) => H({ w: 'fill', gap: 12, ax: 'center' }, Dot(c), small(n, { w: 'fill', color: 'ink' }), txt(v, 14, 'bodyB', 'ink', { lh: 20 }));

add(Screen('timbang', '23 TIMBANG HPP', {
  section: SEC6, nav: NavBar('Timbang'), gap: 16,
  body: [ServiceHead('TIMBANG', 'HPP dan simulasi keuntungan', 'timbang'), TimSeg('HPP'),
    V({ w: 'fill', gap: 8 }, label('Produk'), H({ w: 'fill', gap: 8 }, Chip('Roti cokelat', true), Chip('Roti keju', false))),
    Card({ gap: 16 },
      H({ w: 'fill', jx: 'between', ax: 'center' }, small('HPP per roti'), Tag('Data contoh')),
      num('Rp 4.500', 28),
      H({ w: 'fill', h: 12, r: 8, clip: true }, F({ w: 220, h: 12, bg: 'olive', cls: 'r-grow' }), F({ w: 28, h: 12, bg: 'gold', cls: 'r-grow' }), F({ w: 62, h: 12, bg: 'orange', cls: 'r-grow' })),
      V({ w: 'fill', gap: 8 }, legendRow('olive', 'Bahan', 'Rp 3.200'), legendRow('gold', 'Kemasan', 'Rp 400'), legendRow('orange', 'Tenaga dan lainnya', 'Rp 900'))),
    H({ w: 'fill', pad: 16, bg: 'oliveL', r: 20, ax: 'center', jx: 'between' },
      V({ gap: 4 }, caption('Laba per roti'), num('Rp 3.500', 20)),
      V({ ax: 'end', gap: 4 }, caption('Harga jual Rp 8.000'), txt('44% dari harga', 14, 'bodyB', 'ink', { lh: 20 }))),
  ],
  footer: [Btn('Coba simulasi harga', { go: 'simulasi' })],
}));

add(Screen('timbangEmpty', '23b TIMBANG, resep belum diisi (empty)', {
  section: SEC6, nav: NavBar('Timbang'), note: 'State empty', gap: 16,
  body: [ServiceHead('TIMBANG', 'HPP dan simulasi keuntungan', 'timbang'), TimSeg('HPP'),
    Card({ gap: 16, ax: 'center' },
      A.stateScene('empty', 310, 200),
      V({ w: 'fill', gap: 8, ax: 'center' }, section('Resep belum diisi', { align: 'center', w: 'fill' }),
        txt('TIMBANG menghitung HPP dari resep dan harga bahan. Isi satu resep dulu.', 14, 'body', 'ink2', { lh: 20, w: 'fill', align: 'center' })),
      Btn('Isi resep roti cokelat', { go: 'resep' }))],
}));

add(Screen('simulasi', '24 TIMBANG Simulasi', {
  section: SEC6, nav: NavBar('Timbang'), gap: 16,
  body: [ServiceHead('TIMBANG', 'HPP dan simulasi keuntungan', 'timbang'), TimSeg('Simulasi'),
    Card({ gap: 12 },
      small('Harga jual roti cokelat'),
      H({ w: 'fill', ax: 'center', gap: 8, attrs: { 'data-stepper': 'price', 'data-fmt': 'rp', 'data-min': 4500 } },
        H({ w: 48, h: 48, r: 12, bg: 'oliveL', ax: 'center', jx: 'center', role: 'button', act: 1, attrs: { 'data-act': 'step', 'data-d': -500, 'aria-label': 'Turunkan harga Rp 500', tabindex: 0 } }, icon('minus', 'olive', 22)),
        num('Rp 8.500', 20, { w: 'fill', align: 'center', attrs: { 'data-val': 1, 'data-num': '8500', 'aria-live': 'polite' } }),
        H({ w: 48, h: 48, r: 12, bg: 'olive', ax: 'center', jx: 'center', role: 'button', act: 1, attrs: { 'data-act': 'step', 'data-d': 500, 'aria-label': 'Naikkan harga Rp 500', tabindex: 0 } }, icon('plus', 'white', 22))),
      caption('Naik Rp 500 dari harga sekarang Rp 8.000', { w: 'fill', align: 'center', attrs: { 'data-id': 'sim-note' } })),
    Panel('olive', { gap: 12 },
      H({ w: 'fill', jx: 'between', ax: 'center' }, txt('Perkiraan laba sebulan', 14, 'bodyM', 'cream', { lh: 20 }), Tag('Data contoh', 'oliveD', 'white')),
      num('Rp 2.496.000', 28, { color: 'white', attrs: { 'data-id': 'sim-month' } }),
      H({ w: 'fill', gap: 8, ax: 'center' }, { ...Tag('+ Rp 312.000', 'gold'), attrs: { 'data-id': 'sim-diff' } }, txt('dari Rp 2.184.000 sekarang', 12, 'bodyM', 'cream', { lh: 16, w: 'fill' }))),
    V({ w: 'fill', gap: 8 }, label('Dasar hitungan'),
      txt('24 roti per hari, 26 hari buka, HPP Rp 4.500. Perkiraan ini mengasumsikan jumlah terjual tetap. Harga naik bisa menurunkan penjualan, jadi pantau dulu seminggu.', 12, 'bodyM', 'ink2', { lh: 16, w: 'fill' })),
  ],
  footer: [Btn('Simpan harga baru', { go: 'produk' })],
}));

// ========================= 7. TUMBUH =========================
const SEC7 = 'TUMBUH (Rasana Academy)';
add(Screen('tumbuh', '25 TUMBUH Academy', {
  section: SEC7, nav: NavBar('Tumbuh'), gap: 16,
  body: [ServiceHead('TUMBUH', 'Rasana Academy', 'tumbuh'),
    V({ n: 'Lanjutkan belajar', w: 'fill', bg: 'white', r: 20, clip: true, go: 'modul', role: 'button' },
      A.books(342, 132),
      V({ w: 'fill', pad: 16, gap: 8 },
        txt('Lanjutkan belajar', 12, 'bodyB', 'olive', { lh: 16 }),
        section('Mengurangi sisa roti'),
        Meter(1),
        caption('Pelajaran 2 dari 4 · sekitar 12 menit'))),
    V({ w: 'fill', gap: 12 }, section('Semua modul'),
      ListGroup(
        Row('Menghitung HPP', '4 pelajaran · 8 menit', { ic: 'coin', tone: 'goldL', iconColor: 'goldD', go: 'modul', bare: true }),
        Row('Merencanakan produksi', '3 pelajaran · 5 menit', { ic: 'chart', tone: 'orangeL', iconColor: 'orangeD', go: 'modul', bare: true }),
        Row('Mengurangi sisa roti', '4 pelajaran · 12 menit', { ic: 'book', tone: 'sageL', iconColor: 'sageD', go: 'modul', bare: true }))),
  ],
}));

const lesson = (n, t, state, go) => H({ w: 'fill', pad: 16, gap: 12, bg: 'white', r: 16, ax: 'center', stroke: state === 'now' ? { c: 'olive', w: 2 } : null, go, role: go ? 'button' : undefined },
  H({ w: 40, h: 40, r: 999, bg: state === 'done' ? 'olive' : state === 'now' ? 'gold' : 'cream', ax: 'center', jx: 'center' },
    state === 'done' ? icon('check', 'white', 20) : txt(String(n), 14, 'disp', 'ink', { lh: 20 })),
  txt(t, 14, 'bodyB', 'ink', { lh: 20, w: 'fill' }),
  state === 'done' ? Tag('Selesai', 'sageL') : null);

add(Screen('modul', '26 Modul', {
  section: SEC7,
  body: [TopBar('tumbuh'), TitleBlock('Mengurangi sisa roti', '4 pelajaran · sekitar 12 menit'),
    V({ w: 'fill', gap: 12 },
      lesson(1, 'Kenali pola sisa harian', 'done'),
      lesson(2, 'Hitung jumlah yang sebaiknya dibuat', 'now', 'pelajaran'),
      lesson(3, 'Olah ulang roti yang tersisa', 'todo'),
      lesson(4, 'Catat dan evaluasi tiap minggu', 'todo'))],
  footer: [Btn('Lanjut pelajaran 2', { go: 'pelajaran' })],
}));

add(Screen('pelajaran', '27 Pelajaran', {
  section: SEC7, gap: 16,
  body: [TopBar('modul'),
    V({ w: 'fill', gap: 8 }, txt('Pelajaran 2 dari 4', 12, 'bodyB', 'olive', { lh: 16 }), title('Hitung jumlah yang sebaiknya dibuat')),
    body('Mulai dari rata-rata terjual per hari, lalu tambah sedikit penyangga untuk hari ramai. Jangan menambah terlalu banyak, karena roti yang sisa adalah modal yang tidak kembali.'),
    V({ w: 'fill', pad: 16, gap: 8, bg: 'goldL', r: 16 }, txt('Contoh', 12, 'bodyB', 'ink', { lh: 16 }),
      txt('Rata-rata terjual 24 roti. Buat 28 roti. Penyangga 4 roti cukup untuk hari ramai tanpa banyak sisa.', 14, 'bodyM', 'ink', { lh: 20, w: 'fill' })),
    H({ w: 'fill', gap: 12, pad: 16, bg: 'white', r: 16, ax: 'center' }, icon('takar', 'olive', 24), caption('TAKAR menghitung ini otomatis dari data penjualanmu.', { w: 'fill' }))],
  footer: [Btn('Selesai, lanjut pelajaran 3', { go: 'modul' })],
}));

// ========================= 8. AKUN =========================
const SEC8 = 'Akun dan produk';
add(Screen('akun', '28 Akun', {
  section: SEC8, nav: NavBar('Akun'),
  body: [
    V({ w: 'fill', h: 44, jx: 'center' }, title('Akun')),
    H({ w: 'fill', pad: 16, gap: 16, bg: 'white', r: 20, ax: 'center' }, Avatar('RM', 'gold', 56, 16),
      V({ w: 'fill', gap: 4 }, rowTitle('Rina Maharani', { w: 'fill' }), caption('Toko Roti Rina · Bogor', { w: 'fill' }))),
    ListGroup(
      Row('Produk dan harga', 'Daftar produk usahamu', { ic: 'bun', tone: 'goldL', iconColor: 'goldD', go: 'produk', bare: true }),
      Row('Sumber data penjualan', 'Kasir, file, atau catatan manual', { ic: 'pos', tone: 'sageL', iconColor: 'sageD', go: 'source', bare: true }),
      Row('Ganti usaha', 'Pindah ke usaha lain', { ic: 'swap', tone: 'oliveL', go: 'pilih', bare: true })),
    Row('Keluar', 'Keluar dari akun ini', { ic: 'logout', tone: 'orangeL', iconColor: 'orangeD', go: 'welcome' }),
  ],
}));

add(Screen('produk', '29 Produk dan harga', {
  section: SEC8,
  body: [TopBar('akun'), TitleBlock('Produk dan harga', 'Harga dipakai TIMBANG untuk menghitung laba.'),
    ListGroup(
      Row('Roti cokelat', 'Rp 8.000 · per pcs', { ic: 'bun', tone: 'goldL', iconColor: 'goldD', go: 'produkBaru', bare: true }),
      Row('Roti keju', 'Rp 9.000 · per pcs', { ic: 'bun', tone: 'orangeL', iconColor: 'orangeD', go: 'produkBaru', bare: true }))],
  footer: [Btn('Tambah produk', { go: 'produkBaru', ic: 'plus' })],
}));

add(Screen('produkBaru', '30 Tambah produk', {
  section: SEC8,
  body: [TopBar('produk'), TitleBlock('Tambah produk'), V({ w: 'fill', gap: 16 }, ...productFields(false))],
  footer: [Btn('Simpan produk', { go: 'produk' })],
}));

module.exports = { screens: out };
