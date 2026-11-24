# Sumber desain

`screens.js` di akar repo dihasilkan dari folder ini. Jangan sunting `screens.js` langsung.

| Berkas | Isi |
|---|---|
| `lib.js` | Token desain, komponen, dan validator skala |
| `art.js` | Ilustrasi flat sebagai SVG |
| `screens.js` | Susunan 39 layar |
| `render_html.js` | Mengubah pohon desain menjadi HTML dan memeriksa kontras |
| `build.js` | Menulis ulang `../screens.js` |

```bash
node design/build.js
```

Build akan berhenti dan gagal kalau ada ukuran teks, gap, padding, atau radius di luar skala,
kalau ada teks yang kontrasnya di bawah WCAG AA, atau kalau ada tautan yang menunjuk layar
yang tidak ada. Jadi tiga hal itu tidak bisa lolos diam-diam.

Pohon desain yang sama juga dipakai untuk menghasilkan berkas plugin Figma, supaya prototipe
web dan berkas Figma tidak pernah berbeda.
