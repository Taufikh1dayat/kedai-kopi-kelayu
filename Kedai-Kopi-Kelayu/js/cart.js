// Cart state
let cart = JSON.parse(localStorage.getItem('kelayuCart')) || [];

function saveCart() {
    localStorage.setItem('kelayuCart', JSON.stringify(cart));
}

function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, qty: 1 });
    }
    saveCart();
    updateCartBadge();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartBadge();
    renderCartItems();
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(id);
        return;
    }
    saveCart();
    updateCartBadge();
    renderCartItems();
}

function getCartTotal() {
    return cart.reduce((sum, item) => {
        const menu = getItem(item.id);
        return sum + (menu ? menu.price * item.qty : 0);
    }, 0);
}

function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
    const count = getCartCount();
    const badge = document.querySelector('#shopping-cart .cart-badge');
    if (count > 0) {
        if (!badge) {
            const span = document.createElement('span');
            span.className = 'cart-badge';
            document.querySelector('#shopping-cart').appendChild(span);
        }
        document.querySelector('.cart-badge').textContent = count;
    } else {
        if (badge) badge.remove();
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total-price');
    if (cart.length === 0) {
        container.innerHTML = '<p class="cart-empty">Keranjang masih kosong</p>';
        totalEl.textContent = 'Rp 0';
        return;
    }

    container.innerHTML = '';
    cart.forEach(item => {
        const menu = getItem(item.id);
        if (!menu) return;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${menu.img}" alt="${menu.name}">
            <div class="cart-item-info">
                <h4>${menu.name}</h4>
                <p>${formatPrice(menu.price)}</p>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn minus" data-id="${item.id}">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn plus" data-id="${item.id}">+</button>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">
                <i data-feather="trash-2"></i>
            </button>
        `;
        container.appendChild(div);
    });

    feather.replace();

    container.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.onclick = () => updateQty(parseInt(btn.dataset.id), -1);
    });
    container.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.onclick = () => updateQty(parseInt(btn.dataset.id), 1);
    });
    container.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.onclick = () => removeFromCart(parseInt(btn.dataset.id));
    });

    totalEl.textContent = formatPrice(getCartTotal());
}

// ===== CHECKOUT MODAL =====
function openCheckoutModal() {
    if (cart.length === 0) {
        showNotification('Keranjang masih kosong!');
        return;
    }

    // populate order summary
    const list = document.getElementById('checkout-order-list');
    list.innerHTML = '';
    cart.forEach(item => {
        const menu = getItem(item.id);
        if (!menu) return;
        const div = document.createElement('div');
        div.className = 'checkout-item';
        div.innerHTML = `
            <span>${menu.name} x${item.qty}</span>
            <span>${formatPrice(menu.price * item.qty)}</span>
        `;
        list.appendChild(div);
    });
    document.getElementById('checkout-grand-total').textContent = formatPrice(getCartTotal());

    // set QRIS image
    document.getElementById('checkout-qr').src = CONFIG.QRIS_IMAGE;

    document.getElementById('checkout-modal').style.display = 'flex';
    feather.replace();
}

document.getElementById('checkout-btn').onclick = openCheckoutModal;

document.getElementById('checkout-close').onclick = () => {
    document.getElementById('checkout-modal').style.display = 'none';
};

// Click outside checkout modal content → close
document.getElementById('checkout-modal').onclick = (e) => {
    if (e.target === e.currentTarget) {
        document.getElementById('checkout-modal').style.display = 'none';
    }
};

// ===== SEND TO WHATSAPP =====
document.getElementById('wa-send-btn').onclick = function () {
    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();

    if (!name || !phone) {
        showNotification('Isi nama dan nomor HP dulu!');
        return;
    }

    // Build message
    let msg = 'Halo Kakak, saya ingin pesan:\n\n';
    cart.forEach(item => {
        const menu = getItem(item.id);
        if (!menu) return;
        msg += `- ${menu.name} x${item.qty} = ${formatPrice(menu.price * item.qty)}\n`;
    });
    msg += `\nTotal: ${formatPrice(getCartTotal())}`;
    msg += `\n\n*Nama*: ${name}`;
    msg += `\n*No HP*: ${phone}`;

    const notes = document.getElementById('cust-notes').value.trim();
    if (notes) msg += `\n*Catatan*: ${notes}`;

    msg += '\n\nSaya sudah transfer. Mohon diproses 🙏';

    const waUrl = `https://wa.me/${CONFIG.WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    showNotification('Pesanan dikirim ke WhatsApp! Silakan kirim bukti transfer setelah bayar.');
    document.getElementById('checkout-modal').style.display = 'none';
};

// Init
updateCartBadge();
