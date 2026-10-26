(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA = '6283846080209';

  // ---------- Menu mobile ----------
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.add('hidden'); toggle.setAttribute('aria-expanded', 'false'); });
    });
  }

  // ---------- Status buka live (WIB) ----------
  var live = document.getElementById('live-status');
  if (live) {
    var h = parseInt(new Date().toLocaleString('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', hour12: false }), 10);
    var open = h >= 10 && h < 21;
    live.innerHTML = '<span class="blink-dot w-2 h-2 rounded-full ' + (open ? 'bg-emerald-400' : 'bg-red-500') + '"></span> ' +
      (open ? 'Buka Hari Ini (10.00 - 21.00 WIB)' : 'Tutup sekarang · Buka 10.00 WIB');
  }

  // ---------- Toast ----------
  var toastEl = document.getElementById('toast');
  var toastTimer;
  window.showToast = function (msg) {
    if (!toastEl) return;
    toastEl.querySelector('span').textContent = msg;
    toastEl.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    }, 2200);
  };

  // ---------- Modal booking ----------
  var modal = document.getElementById('booking-modal');
  var tanggal = document.getElementById('bm-tanggal');
  function openBooking() {
    if (!modal) return;
    if (tanggal) {
      var t = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
      tanggal.min = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
    }
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    var first = modal.querySelector('input, select'); if (first) first.focus();
  }
  function closeBooking() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-open-booking]')) { e.preventDefault(); openBooking(); return; }
    if (e.target.closest('[data-close-booking]')) closeBooking();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeBooking();
  });

  // ---------- Form WhatsApp generik (booking, kemitraan) ----------
  document.querySelectorAll('form[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var lines = [form.dataset.waTitle || 'Pesan dari website', ''];
      form.querySelectorAll('[data-label]').forEach(function (el) {
        var v = el.tagName === 'SELECT' ? el.options[el.selectedIndex].text : (el.value || '').trim();
        lines.push(el.dataset.label + ': ' + (v || '-'));
      });
      var target = form.querySelector('[data-wa-target]');
      var number = target ? target.value : (form.dataset.waNumber || WA);
      window.open('https://wa.me/' + number + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
      if (form.closest('#booking-modal')) closeBooking();
      form.reset();
      if (window.showToast) window.showToast('Membuka WhatsApp...');
    });
  });

  // ---------- Reveal on scroll ----------
  var revealEls = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('show'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('show'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // ---------- Count-up ----------
  function countUp(el) {
    var target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '';
    var decimals = (el.dataset.count.split('.')[1] || '').length;
    var fmt = function (v) { return v.toFixed(decimals).replace('.', ',') + suffix; };
    if (reduce) { el.textContent = fmt(target); return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { el.textContent = '0'; cio.observe(el); });
  }

  // ---------- Katalog produk ----------
  function rp(n) { return 'Rp' + Number(n).toLocaleString('id-ID'); }
  var WA_PRODUK = 'https://wa.me/6283846080209?text=';
  function cardHtml(p) {
    var kat = { pomade: 'Pomade', perawatan: 'Perawatan Rambut', styling: 'Styling' }[p.kategori] || '';
    var media = p.gambar
      ? '<img src="' + p.gambar + '" alt="Produk ' + p.nama + '" width="640" height="800" loading="lazy" class="w-full h-full object-cover transition duration-500 group-hover:scale-105">'
      : '<div class="w-full h-full grid place-items-center gold-gradient text-ink"><span class="font-display text-3xl px-4 text-center">KING</span></div>';
    var aksi = p.harga
      ? '<span class="text-base sm:text-lg font-bold text-gold">' + rp(p.harga) + '</span>' +
        '<button type="button" data-add="' + p.id + '" class="rounded-full gold-gradient px-4 py-2 text-xs sm:text-sm font-extrabold text-ink hover:brightness-110">Tambah ke keranjang</button>'
      : '<span class="text-sm font-bold text-gold">Harga: tanya</span>' +
        '<a href="' + WA_PRODUK + encodeURIComponent('Halo King Barbershop, saya ingin tanya harga ' + p.nama + '.') + '" target="_blank" rel="noopener" class="rounded-full border border-gold/50 px-4 py-2 text-xs sm:text-sm font-bold text-gold hover:bg-gold hover:text-ink transition">Tanya via WhatsApp</a>';
    return '<article class="group bg-night rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-lg transition duration-300 hover:-translate-y-1">' +
      '<div class="aspect-[4/5] bg-ink overflow-hidden">' + media + '</div>' +
      '<div class="p-4 sm:p-5">' +
        '<p class="text-[11px] sm:text-xs uppercase tracking-widest text-gold">' + kat + ' · ' + p.ukuran + '</p>' +
        '<h3 class="mt-1 font-display text-lg sm:text-2xl text-cream">' + p.nama + '</h3>' +
        '<p class="mt-2 text-xs sm:text-sm text-cream/70 min-h-[2.5rem]">' + p.deskripsi + '</p>' +
        '<div class="mt-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3">' + aksi + '</div>' +
      '</div></article>';
  }
  function renderGrid(container, filter, limit) {
    var items = (typeof PRODUCTS !== 'undefined' ? PRODUCTS : [])
      .filter(function (p) { return filter === 'semua' || p.kategori === filter; });
    if (limit) items = items.slice(0, limit);
    container.innerHTML = items.map(cardHtml).join('');
    if (window.KBCart) window.KBCart.render();
  }
  var grid = document.getElementById('product-grid');
  var homeGrid = document.getElementById('home-products');
  if (grid) renderGrid(grid, 'semua');
  if (homeGrid) renderGrid(homeGrid, 'semua', 4);
  document.querySelectorAll('[data-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('bg-gold', active); b.classList.toggle('text-ink', active);
        b.classList.toggle('text-cream', !active); b.classList.toggle('ring-1', !active);
        b.setAttribute('aria-pressed', String(active));
      });
      if (grid) renderGrid(grid, f);
    });
  });
})();
