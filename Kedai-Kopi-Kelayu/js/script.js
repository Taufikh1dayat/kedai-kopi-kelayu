// Toggle class active
const navbarNav = document.querySelector('.navbar-nav');
// ketika hamburger menu di klik
document.querySelector('#hamburger-menu').onclick = () => {
    navbarNav.classList.toggle('active');
};

// Klik diluar side bar untuk menghlangkan nav
const hamburger = document.querySelector('#hamburger-menu');

document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('active');
    }
});

// Render menu from data.js
function renderMenu(items) {
    const container = document.getElementById('menu-row');
    container.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="menu-card-img">
            <h3 class="menu-card-title">- ${item.name} -</h3>
            <p class="menu-card-category">${item.category}</p>
            <p class="menu-card-price">${formatPrice(item.price)}</p>
            <button class="add-cart-btn" data-id="${item.id}">Tambah ke Keranjang</button>
        `;
        container.appendChild(card);
    });

    // Add to cart button listeners
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.onclick = () => {
            const id = parseInt(btn.dataset.id);
            addToCart(id);
            showNotification(`${getItem(id).name} ditambahkan ke keranjang!`);
        };
    });
}

// Format price
function formatPrice(price) {
    return 'Rp ' + price.toLocaleString('id-ID');
}

// Get item by id
function getItem(id) {
    return menuData.find(item => item.id === id);
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;
        if (filter === 'all') {
            renderMenu(menuData);
        } else {
            renderMenu(menuData.filter(item => item.category === filter));
        }
    });
});

// Cart toggle
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
document.querySelector('#shopping-cart').onclick = (e) => {
    e.preventDefault();
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    renderCartItems();
};

document.getElementById('cart-close').onclick = () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
};

cartOverlay.onclick = () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
};

// Notification modal
function showNotification(msg) {
    const modal = document.getElementById('notification-modal');
    document.getElementById('modal-message').textContent = msg;
    modal.style.display = 'flex';
    document.getElementById('modal-ok').onclick = () => {
        modal.style.display = 'none';
    };
}

// Render awal
renderMenu(menuData);
