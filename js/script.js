// Data Menu Kelayu Coffee
const PRODUCTS = [
  {
    id: 1,
    name: 'Kopi Susu Kelayu',
    category: 'signature',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
    rating: '4.9',
    badge: 'Best Seller',
    desc: 'Espresso blend khas Kelayu dengan susu segar, gula aren organik, dan hint aroma pandan yang creamy.'
  },
  {
    id: 2,
    name: 'Kelayu Cold Brew',
    category: 'signature',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    rating: '4.8',
    badge: 'Favorit',
    desc: 'Ekstraksi dingin biji arabika lokal selama 16 jam. Rasa ringan, fruity, dan menyegarkan.'
  },
  {
    id: 3,
    name: 'Espresso Solo',
    category: 'coffee',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    rating: '4.7',
    badge: 'Classic',
    desc: 'Single shot espresso murni dengan krema tebal, aroma karamel cokelat pekat.'
  },
  {
    id: 4,
    name: 'Americano Ice/Hot',
    category: 'coffee',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=600&q=80',
    rating: '4.8',
    badge: '',
    desc: 'Espresso dipadu air mineral segar, menonjolkan notes acidity seimbang dan aftertaste bersih.'
  },
  {
    id: 5,
    name: 'Caramel Macchiato',
    category: 'coffee',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
    rating: '4.9',
    badge: 'Populer',
    desc: 'Steamed milk berpadu shot espresso dilapisi saus karamel homemade yang gurih manis.'
  },
  {
    id: 6,
    name: 'Creamy Matcha Latte',
    category: 'non-coffee',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    rating: '4.8',
    badge: '',
    desc: 'Matcha Uji Jepang grade premium berpadu susu segar lembut, manis pas tanpa pahit menusuk.'
  },
  {
    id: 7,
    name: 'Artisan Chocolate',
    category: 'non-coffee',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80',
    rating: '4.7',
    badge: '',
    desc: 'Cokelat hitam Nusantara 65% cair hangat atau dingin, kaya rasa dan kental lembut.'
  },
  {
    id: 8,
    name: 'Butter Croissant',
    category: 'snack',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    rating: '4.9',
    badge: 'Fresh Bake',
    desc: 'Pastry Prancis renyah berlapis dengan mentega impor wangi. Pas teman ngopi pagi atau sore.'
  },
  {
    id: 9,
    name: 'Roti Bakar Kelayu',
    category: 'snack',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=600&q=80',
    rating: '4.8',
    badge: '',
    desc: 'Roti brioche tebal panggang krispi dengan isian cokelat lumer dan taburan keju cheddar parut.'
  }
];

// Nomor WhatsApp Kedai (Format Internasional tanpa tanda +)
const WHATSAPP_PHONE = '6281234567890';

// Format Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

// State Keranjang (dari localStorage)
let cart = JSON.parse(localStorage.getItem('kelayu_cart')) || [];
let activeCategory = 'all';
let searchQuery = '';

// Simpan Cart ke localStorage
function saveCart() {
  localStorage.setItem('kelayu_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

// Update Badge Cart Navbar
function updateCartBadge() {
  const badge = document.querySelector('#cart-badge');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
  }
}

// Render Menu Cards
function renderMenu() {
  const menuContainer = document.querySelector('#menu-container');
  if (!menuContainer) return;

  const filtered = PRODUCTS.filter((item) => {
    const matchCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    menuContainer.innerHTML = `
      <div class="menu-empty">
        <i data-feather="coffee"></i>
        <p>Menu tidak ditemukan untuk kata kunci "${searchQuery}".</p>
      </div>
    `;
    if (window.feather) feather.replace();
    return;
  }

  menuContainer.innerHTML = filtered
    .map(
      (item) => `
    <div class="menu-card" data-id="${item.id}">
      <div class="menu-card-img-wrap">
        <img src="${item.image}" alt="${item.name}" class="menu-card-img" loading="lazy" onerror="this.onerror=null; this.src='img/menu/1.jpg';">
        ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ''}
        <button type="button" class="btn-quickview" title="Lihat Detail" onclick="openQuickView(${item.id})">
          <i data-feather="eye"></i>
        </button>
      </div>
      <div class="menu-card-body">
        <div class="menu-meta">
          <span class="menu-rating"><i data-feather="star"></i> ${item.rating}</span>
          <span class="menu-cat-tag">${item.category}</span>
        </div>
        <h3 class="menu-card-title">${item.name}</h3>
        <p class="menu-card-desc">${item.desc}</p>
        <div class="menu-card-footer">
          <span class="menu-card-price">${formatRupiah(item.price)}</span>
          <button type="button" class="btn-add-cart" onclick="addToCart(${item.id})" title="Tambah ke Keranjang">
            <i data-feather="plus"></i> Tambah
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  if (window.feather) feather.replace();
}

// Tambah Produk ke Cart
function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  showToast(`"${product.name}" masuk keranjang!`);
}

// Ubah Jumlah Item Cart
function changeCartQty(productId, delta) {
  const itemIndex = cart.findIndex((item) => item.id === productId);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity += delta;
  if (cart[itemIndex].quantity <= 0) {
    cart.splice(itemIndex, 1);
  }

  saveCart();
}

// Hapus Item dari Cart
function removeCartItem(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  showToast('Item dihapus dari keranjang.');
}

// Kosongkan Cart
function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  saveCart();
  showToast('Keranjang dikosongkan.');
}

// Render Cart Drawer
function renderCart() {
  const cartItemsList = document.querySelector('#cart-items-list');
  const cartTotalPrice = document.querySelector('#cart-total-price');
  const cartEmptyState = document.querySelector('#cart-empty-state');
  const cartFooter = document.querySelector('#cart-footer');

  if (!cartItemsList || !cartTotalPrice) return;

  if (cart.length === 0) {
    cartEmptyState.style.display = 'block';
    cartItemsList.innerHTML = '';
    cartFooter.style.display = 'none';
    cartTotalPrice.textContent = formatRupiah(0);
    return;
  }

  cartEmptyState.style.display = 'none';
  cartFooter.style.display = 'block';

  cartItemsList.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null; this.src='img/menu/1.jpg';">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <span class="cart-item-price">${formatRupiah(item.price)}</span>
        <div class="cart-item-controls">
          <button type="button" class="btn-qty" onclick="changeCartQty(${item.id}, -1)">-</button>
          <span class="cart-item-qty">${item.quantity}</span>
          <button type="button" class="btn-qty" onclick="changeCartQty(${item.id}, 1)">+</button>
          <button type="button" class="btn-remove" onclick="removeCartItem(${item.id})" title="Hapus">
            <i data-feather="trash-2"></i>
          </button>
        </div>
      </div>
      <div class="cart-item-subtotal">
        ${formatRupiah(item.price * item.quantity)}
      </div>
    </div>
  `
    )
    .join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalPrice.textContent = formatRupiah(total);

  if (window.feather) feather.replace();
}

// Modal Detail (Quick View)
function openQuickView(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const modal = document.querySelector('#product-modal');
  const content = document.querySelector('#modal-product-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="modal-product-grid">
      <div class="modal-product-img">
        <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='img/menu/1.jpg';">
      </div>
      <div class="modal-product-info">
        <span class="modal-cat-tag">${product.category.toUpperCase()}</span>
        <h3 class="modal-product-title">${product.name}</h3>
        <div class="modal-product-rating">
          <i data-feather="star"></i> ${product.rating} / 5.0 (Rating Pelanggan)
        </div>
        <p class="modal-product-desc">${product.desc}</p>
        <div class="modal-product-price">${formatRupiah(product.price)}</div>
        <div class="modal-product-actions">
          <button type="button" class="btn-add-cart-modal" onclick="addToCart(${product.id}); closeQuickView();">
            <i data-feather="shopping-cart"></i> Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  if (window.feather) feather.replace();
}

function closeQuickView() {
  const modal = document.querySelector('#product-modal');
  if (modal) modal.classList.remove('active');
}

// Toast Notification
let toastTimeout;
function showToast(message) {
  const toast = document.querySelector('#toast-notification');
  if (!toast) return;

  toast.querySelector('.toast-text').textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Checkout WhatsApp
function handleWhatsAppCheckout(e) {
  e.preventDefault();
  if (cart.length === 0) {
    showToast('Keranjang masih kosong!');
    return;
  }

  const name = document.querySelector('#order-name').value.trim() || 'Pelanggan';
  const orderType = document.querySelector('#order-type').value;
  const tableNote = document.querySelector('#order-note').value.trim() || '-';

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let message = `*HALO KELAYU COFFEE, SAYA INGIN MEMESAN:*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Nama:* ${name}\n`;
  message += `*Tipe:* ${orderType}\n`;
  message += `*Meja / Catatan:* ${tableNote}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*DETAIL PESANAN:*\n`;

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} (${item.quantity}x) = ${formatRupiah(item.price * item.quantity)}\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*TOTAL PEMBAYARAN:* ${formatRupiah(total)}\n\n`;
  message += `Mohon konfirmasi pesanan saya. Terima kasih! 🙏`;

  const encodedUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(encodedUrl, '_blank');
}

// Form Kontak WhatsApp
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.querySelector('#contact-name').value.trim();
  const email = document.querySelector('#contact-email').value.trim();
  const phone = document.querySelector('#contact-phone').value.trim();
  const messageText = document.querySelector('#contact-msg').value.trim();

  if (!name || !messageText) {
    showToast('Harap isi nama dan pesan!');
    return;
  }

  let text = `*PESAN DARI WEBSITE KELAYU COFFEE*\n`;
  text += `*Nama:* ${name}\n`;
  text += `*Email:* ${email || '-'}\n`;
  text += `*No HP:* ${phone || '-'}\n`;
  text += `*Pesan:* ${messageText}`;

  const encodedUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  window.open(encodedUrl, '_blank');
  showToast('Membuka WhatsApp untuk mengirim pesan...');
}

// Inisialisasi DOM & Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navbarNav = document.querySelector('.navbar-nav');
  const hamburger = document.querySelector('#hamburger-menu');
  const searchBtn = document.querySelector('#search-btn');
  const searchBar = document.querySelector('#search-bar');
  const searchInput = document.querySelector('#search-input');
  const searchClose = document.querySelector('#search-close');
  const cartBtn = document.querySelector('#shopping-cart-btn');
  const cartDrawer = document.querySelector('#cart-drawer');
  const cartClose = document.querySelector('#cart-close');
  const modalClose = document.querySelector('#modal-close');
  const productModal = document.querySelector('#product-modal');
  const filterBtns = document.querySelectorAll('.category-pill');
  const checkoutForm = document.querySelector('#checkout-form');
  const contactForm = document.querySelector('#contact-form');

  // Toggle Hamburger Menu
  if (hamburger && navbarNav) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      navbarNav.classList.toggle('active');
      cartDrawer.classList.remove('active');
      searchBar.classList.remove('active');
    });
  }

  // Toggle Search Bar
  if (searchBtn && searchBar && searchInput) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchBar.classList.toggle('active');
      cartDrawer.classList.remove('active');
      navbarNav.classList.remove('active');
      if (searchBar.classList.contains('active')) {
        searchInput.focus();
      }
    });

    if (searchClose) {
      searchClose.addEventListener('click', () => {
        searchBar.classList.remove('active');
        searchQuery = '';
        searchInput.value = '';
        renderMenu();
      });
    }

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderMenu();
    });
  }

  // Toggle Cart Drawer
  if (cartBtn && cartDrawer) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cartDrawer.classList.toggle('active');
      navbarNav.classList.remove('active');
      searchBar.classList.remove('active');
    });

    if (cartClose) {
      cartClose.addEventListener('click', () => {
        cartDrawer.classList.remove('active');
      });
    }
  }

  // Close QuickView Modal
  if (modalClose) {
    modalClose.addEventListener('click', closeQuickView);
  }

  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) {
        closeQuickView();
      }
    });
  }

  // Keyboard ESC listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
      if (cartDrawer) cartDrawer.classList.remove('active');
      if (searchBar) searchBar.classList.remove('active');
      if (navbarNav) navbarNav.classList.remove('active');
    }
  });

  // Filter Kategori
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderMenu();
    });
  });

  // Klik di luar menutup navigasi & drawer
  document.addEventListener('click', (e) => {
    if (
      hamburger &&
      navbarNav &&
      !hamburger.contains(e.target) &&
      !navbarNav.contains(e.target)
    ) {
      navbarNav.classList.remove('active');
    }
    if (
      cartBtn &&
      cartDrawer &&
      !cartBtn.contains(e.target) &&
      !cartDrawer.contains(e.target) &&
      !e.target.closest('.btn-add-cart') &&
      !e.target.closest('.btn-add-cart-modal') &&
      !e.target.closest('.btn-qty') &&
      !e.target.closest('.btn-remove')
    ) {
      cartDrawer.classList.remove('active');
    }
  });

  // Form Submissions
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleWhatsAppCheckout);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }

  // Render Awal
  renderMenu();
  renderCart();
  updateCartBadge();
  if (window.feather) feather.replace();
});
