// Keranjang belanja sederhana (localStorage) + checkout via WhatsApp.
(function () {
  var KEY = 'kb_cart_v1';
  var WA_NUMBER = '6283846080209'; // Cabang Babatan Pantai (utama). Ganti jika perlu.
  var cart = load();

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {}
  }
  function rp(n) { return 'Rp' + Number(n).toLocaleString('id-ID'); }
  function find(id) { return PRODUCTS.find(function (p) { return p.id === id; }); }
  function count() { return Object.values(cart).reduce(function (s, q) { return s + q; }, 0); }
  function total() {
    return Object.keys(cart).reduce(function (s, id) {
      var p = find(id); return p ? s + p.harga * cart[id] : s;
    }, 0);
  }
  function buildMessage() {
    var lines = ['Halo King Barbershop, saya ingin memesan produk:', ''];
    Object.keys(cart).forEach(function (id, i) {
      var p = find(id); if (!p) return;
      lines.push((i + 1) + '. ' + p.nama + ' x' + cart[id] + ' = ' + rp(p.harga * cart[id]));
    });
    lines.push('', 'Total: ' + rp(total()), '', 'Nama:', 'Cabang pengambilan:');
    return lines.join('\n');
  }

  function render() {
    var n = count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = n; el.classList.toggle('hidden', n === 0);
    });
    var list = document.getElementById('cart-items');
    if (!list) return;
    var empty = document.getElementById('cart-empty');
    var checkout = document.getElementById('cart-checkout');
    var clearBtn = document.getElementById('cart-clear');
    list.innerHTML = '';
    Object.keys(cart).forEach(function (id) {
      var p = find(id); if (!p) return;
      var li = document.createElement('li');
      li.className = 'flex gap-3 py-4 border-b border-white/10';
      li.innerHTML =
        '<img src="' + p.gambar + '" alt="" width="56" height="72" class="w-14 h-18 object-cover rounded-lg">' +
        '<div class="flex-1 min-w-0">' +
          '<p class="font-semibold text-cream truncate">' + p.nama + '</p>' +
          '<p class="text-sm text-gold">' + rp(p.harga) + '</p>' +
          '<div class="mt-2 flex items-center gap-2">' +
            '<button type="button" data-dec="' + id + '" aria-label="Kurangi jumlah ' + p.nama + '" class="w-8 h-8 rounded-full bg-white/10 text-cream hover:bg-white/20">−</button>' +
            '<span class="w-6 text-center text-cream">' + cart[id] + '</span>' +
            '<button type="button" data-inc="' + id + '" aria-label="Tambah jumlah ' + p.nama + '" class="w-8 h-8 rounded-full bg-white/10 text-cream hover:bg-white/20">+</button>' +
            '<button type="button" data-remove="' + id + '" class="ml-auto text-xs text-red-400 hover:underline">Hapus</button>' +
          '</div>' +
        '</div>';
      list.appendChild(li);
    });
    var t = document.getElementById('cart-total');
    if (t) t.textContent = rp(total());
    if (empty) empty.classList.toggle('hidden', n > 0);
    if (checkout) {
      checkout.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(buildMessage());
      checkout.classList.toggle('pointer-events-none', n === 0);
      checkout.classList.toggle('opacity-50', n === 0);
    }
    if (clearBtn) clearBtn.classList.toggle('hidden', n === 0);
  }

  function setQty(id, q) {
    if (q <= 0) delete cart[id]; else cart[id] = q;
    save(); render();
  }

  function openCart() {
    var d = document.getElementById('cart-drawer'), b = document.getElementById('cart-backdrop');
    if (!d) return;
    d.classList.remove('translate-x-full'); d.setAttribute('aria-hidden', 'false');
    if (b) b.classList.remove('hidden');
    var close = d.querySelector('[data-close-cart]'); if (close) close.focus();
  }
  function closeCart() {
    var d = document.getElementById('cart-drawer'), b = document.getElementById('cart-backdrop');
    if (!d) return;
    d.classList.add('translate-x-full'); d.setAttribute('aria-hidden', 'true');
    if (b) b.classList.add('hidden');
  }

  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add) {
      var id = add.getAttribute('data-add');
      cart[id] = (cart[id] || 0) + 1; save(); render();
      var p = find(id);
      if (window.showToast && p) window.showToast(p.nama + ' ditambahkan ke keranjang');
      return;
    }
    if (e.target.closest('[data-open-cart]')) return openCart();
    if (e.target.closest('[data-close-cart]') || e.target.id === 'cart-backdrop') return closeCart();
    var inc = e.target.closest('[data-inc]'); if (inc) return setQty(inc.dataset.inc, (cart[inc.dataset.inc] || 0) + 1);
    var dec = e.target.closest('[data-dec]'); if (dec) return setQty(dec.dataset.dec, (cart[dec.dataset.dec] || 0) - 1);
    var rm = e.target.closest('[data-remove]'); if (rm) return setQty(rm.dataset.remove, 0);
    if (e.target.closest('#cart-clear')) { cart = {}; save(); render(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCart(); });

  window.KBCart = { render: render, openCart: openCart, closeCart: closeCart, rp: rp };
  document.addEventListener('DOMContentLoaded', render);
})();
