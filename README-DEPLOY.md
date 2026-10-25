# King Barbershop: Panduan Deploy

Situs statis siap deploy ke Netlify (drag & drop folder ke app.netlify.com/drop) atau GitHub Pages.

## Sebelum publish
1. Domain: ganti `https://kingbarbershop.netlify.app` di semua HTML, `sitemap.xml`, dan `robots.txt` jika domain final berbeda.
2. Nomor WhatsApp checkout produk: `cart.js` (`WA_NUMBER`).
3. Email admin@kingbarbershop.id dan info@kingbarbershop-surabaya.com. Pastikan aktif.
4. Nomor cabang Sememi, Babat Jerawat, dan Manukan Kulon di Google Maps sama (0831-7456-9866). Pastikan benar.
5. Alamat Manukan Kulon belum lengkap. Lengkapi di `cabang.html` dan `lokasi.html`.
6. Harga King Grooming Series belum ada. Isi `harga` dan `gambar` di `products.js`.
7. Kebijakan privasi belum dibuat. Tambahkan sebelum go-live.

## Struktur halaman
- index.html (beranda, dengan teaser 4 produk), produk.html (katalog lengkap), tentang-kami.html, layanan.html, layanan-*.html, lokasi.html, karir.html, kemitraan.html, berita.html, cabang.html, 404.html
