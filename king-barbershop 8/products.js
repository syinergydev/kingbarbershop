// Data produk King Barbershop. Ubah harga/deskripsi di sini saja.
const PRODUCTS = [
  {
    id: 'sari-ulin',
    nama: 'Sari Ulin',
    kategori: 'perawatan',
    harga: 150000,
    ukuran: '100 ml',
    gambar: 'assets/produk/sari-ulin.webp',
    deskripsi: 'Produk perawatan rambut kemasan 100 ml untuk rutinitas harian.'
  },
  {
    id: 'pomade-oil-based',
    nama: 'Pomade Oil Based',
    kategori: 'pomade',
    harga: 50000,
    ukuran: 'Oil based',
    gambar: 'assets/produk/pomade-oil-based.webp',
    deskripsi: 'Pomade berbahan dasar oil untuk styling rambut yang rapi.'
  },
  {
    id: 'pomade-matte-clay',
    nama: 'Pomade Matte Clay',
    kategori: 'pomade',
    harga: 60000,
    ukuran: 'Matte clay',
    gambar: 'assets/produk/pomade-matte-clay.webp',
    deskripsi: 'Pomade dengan hasil akhir matte, tanpa kilap berlebihan.'
  },
  {
    id: 'pomade-water-based',
    nama: 'Pomade Water Based',
    kategori: 'pomade',
    harga: 55000,
    ukuran: 'Water based',
    gambar: 'assets/produk/pomade-water-based.webp',
    deskripsi: 'Pomade berbasis air, praktis untuk styling harian.'
  }
];

// King Grooming Series (belum ada harga): ditampilkan dengan tombol tanya harga.
PRODUCTS.push(
  { id: 'king-styling-hair-pomade', nama: 'King Styling Hair Pomade', kategori: 'pomade', harga: null, ukuran: 'Strong hold & shine', gambar: null, deskripsi: 'Pomade dengan hold kuat dan kilap, untuk styling rambut yang tegas.' },
  { id: 'king-styling-hair-clay', nama: 'King Styling Hair Clay', kategori: 'pomade', harga: null, ukuran: 'Matte finish', gambar: null, deskripsi: 'Clay dengan hasil matte dan tekstur tinggi untuk tampilan natural.' },
  { id: 'king-styling-powder', nama: 'King Styling Powder', kategori: 'styling', harga: null, ukuran: 'Volumizing', gambar: null, deskripsi: 'Powder untuk menambah volume dan tekstur rambut.' },
  { id: 'king-hair-tonic', nama: 'King Hair Tonic', kategori: 'perawatan', harga: null, ukuran: 'Penumbuh & nutrisi', gambar: null, deskripsi: 'Tonik untuk nutrisi akar rambut dan kulit kepala.' },
  { id: 'king-power-hair-gel', nama: 'King Power Hair Gel', kategori: 'styling', harga: null, ukuran: 'Extreme hold', gambar: null, deskripsi: 'Gel dengan hold kuat sepanjang hari.' }
);
