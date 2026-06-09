/* ==========================================================================
   APPLICATION LOGIC - SOTO POS (WARUNG SOTO PAK ASYARI)
   ========================================================================== */

// 1. Core State Definition
const DEFAULT_SETTINGS = {
    name: 'Soto Pak Asyari',
    tagline: 'Rasa Autentik Sejak 2026',
    logoIcon: '🍲',
    logoUrl: 'logo.png',
    address: 'Jl. Merpati No. 45, Sleman, Yogyakarta',
    phone: '0812-3456-7890',
    defaultDiscount: 0,
    defaultTax: 0
};

const DEFAULT_INGREDIENTS = [
    { id: 'ing-1', name: 'Ayam Suwir (Porsi)', qty: 50, unit: 'porsi', minQty: 10 },
    { id: 'ing-2', name: 'Daging Sapi (Porsi)', qty: 40, unit: 'porsi', minQty: 8 },
    { id: 'ing-3', name: 'Babat & Paru (Porsi)', qty: 30, unit: 'porsi', minQty: 6 },
    { id: 'ing-4', name: 'Sate Paru (Tusuk)', qty: 25, unit: 'tusuk', minQty: 5 },
    { id: 'ing-5', name: 'Sate Usus (Tusuk)', qty: 35, unit: 'tusuk', minQty: 5 },
    { id: 'ing-6', name: 'Sate Telur Puyuh (Tusuk)', qty: 30, unit: 'tusuk', minQty: 5 },
    { id: 'ing-7', name: 'Tempe Mendoan (Biji)', qty: 100, unit: 'biji', minQty: 15 },
    { id: 'ing-8', name: 'Perkedel Kentang (Biji)', qty: 40, unit: 'biji', minQty: 8 },
    { id: 'ing-9', name: 'Es Batu (Porsi)', qty: 80, unit: 'porsi', minQty: 10 },
    { id: 'ing-10', name: 'Beras/Nasi (Porsi)', qty: 100, unit: 'porsi', minQty: 15 }
];

const DEFAULT_EXPENSES = [
    { id: 'exp-1', title: 'Belanja Daging Sapi 5kg', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), amount: 450000, category: 'Bahan Baku', notes: 'Beli di pasar induk pasar pagi' },
    { id: 'exp-2', title: 'Belanja Beras Pulen 15kg', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), amount: 210000, category: 'Bahan Baku', notes: 'Beras cap Mawar pulen premium' },
    { id: 'exp-3', title: 'Beli Tabung Gas Elpiji 3kg', date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), amount: 22000, category: 'Operasional', notes: 'Gas melon 1 tabung untuk kompor utama' },
    { id: 'exp-4', title: 'Belanja Ayam Potong Segar 10kg', date: new Date().toISOString(), amount: 350000, category: 'Bahan Baku', notes: 'Beli di suplier langganan Pak Asyari' }
];

// Recipe mapper linking menu items to ingredients
const RECIPE_MAP = {
    'item-1': [{ name: 'Ayam Suwir (Porsi)', qty: 1 }, { name: 'Beras/Nasi (Porsi)', qty: 1 }],
    'item-2': [{ name: 'Ayam Suwir (Porsi)', qty: 1 }, { name: 'Beras/Nasi (Porsi)', qty: 1 }],
    'item-3': [{ name: 'Daging Sapi (Porsi)', qty: 1 }],
    'item-4': [{ name: 'Babat & Paru (Porsi)', qty: 1 }],
    'item-5': [{ name: 'Sate Paru (Tusuk)', qty: 1 }],
    'item-6': [{ name: 'Sate Usus (Tusuk)', qty: 1 }],
    'item-7': [{ name: 'Sate Telur Puyuh (Tusuk)', qty: 1 }],
    'item-8': [{ name: 'Tempe Mendoan (Biji)', qty: 1 }],
    'item-9': [{ name: 'Perkedel Kentang (Biji)', qty: 1 }],
    'item-10': [{ name: 'Es Batu (Porsi)', qty: 1 }],
    'item-11': [{ name: 'Es Batu (Porsi)', qty: 1 }],
    'item-14': [{ name: 'Beras/Nasi (Porsi)', qty: 1 }]
};

let state = {
    menuItems: [],
    cart: [],
    transactions: [],
    expenses: [],
    ingredients: [],
    activeTab: 'dashboard',
    selectedPaymentMethod: 'Tunai',
    settings: {}
};

// 2. Pre-populated Default Indonesian Menu Items
const DEFAULT_MENU_ITEMS = [
    { id: 'item-1', name: 'Soto Ayam Campur', category: 'Soto', price: 15000, status: 'Tersedia', image: '🍲', description: 'Soto ayam khas Lamongan campur nasi, koya gurih, kol, seledri, kuah kuning hangat.' },
    { id: 'item-2', name: 'Soto Ayam Pisah (Soto + Nasi)', category: 'Soto', price: 17000, status: 'Tersedia', image: '🍲', description: 'Nasi terpisah dengan mangkuk soto ayam porsi melimpah.' },
    { id: 'item-3', name: 'Soto Daging Sapi Madura', category: 'Soto', price: 19000, status: 'Tersedia', image: '🥣', description: 'Soto daging sapi empuk dengan kuah rempah bening gurih khas Madura.' },
    { id: 'item-4', name: 'Soto Babat & Paru Sapi', category: 'Soto', price: 18000, status: 'Tersedia', image: '🍲', description: 'Soto babat dan paru sapi rebus empuk bumbu kuning melimpah.' },
    { id: 'item-5', name: 'Sate Paru Goreng', category: 'Topping', price: 4000, status: 'Tersedia', image: '🍢', description: 'Sate paru sapi ungkep bumbu manis gurih kemudian digoreng.' },
    { id: 'item-6', name: 'Sate Usus Goreng Garing', category: 'Topping', price: 3000, status: 'Tersedia', image: '🍢', description: 'Sate usus ayam garing gurih asin cocok untuk pendamping soto.' },
    { id: 'item-7', name: 'Sate Telur Puyuh Kecap', category: 'Topping', price: 4000, status: 'Tersedia', image: '🍢', description: 'Sate telur puyuh manis gurih bumbu kecap meresap.' },
    { id: 'item-8', name: 'Tempe Mendoan Hangat', category: 'Topping', price: 2000, status: 'Tersedia', image: '🍘', description: 'Tempe mendoan khas Banyumas digoreng setengah matang dengan daun bawang.' },
    { id: 'item-9', name: 'Perkedel Kentang Pedas', category: 'Topping', price: 2000, status: 'Tersedia', image: '🥟', description: 'Perkedel kentang tumbuk telur goreng gurih.' },
    { id: 'item-10', name: 'Es Teh Manis Segar', category: 'Minuman', price: 4000, status: 'Tersedia', image: '🍹', description: 'Es teh manis dingin pelepas dahaga.' },
    { id: 'item-11', name: 'Es Jeruk Peras Murni', category: 'Minuman', price: 5000, status: 'Tersedia', image: '🍹', description: 'Es jeruk peras dari jeruk peras segar asli.' },
    { id: 'item-12', name: 'Teh Manis Hangat', category: 'Minuman', price: 3000, status: 'Tersedia', image: '☕', description: 'Teh manis hangat dengan gula pasir asli.' },
    { id: 'item-13', name: 'Jeruk Hangat Murni', category: 'Minuman', price: 5000, status: 'Tersedia', image: '☕', description: 'Jeruk peras hangat segar kaya vitamin C.' },
    { id: 'item-14', name: 'Nasi Putih Extra', category: 'Ekstra', price: 5000, status: 'Tersedia', image: '🍚', description: 'Nasi putih pulen hangat satu porsi.' },
    { id: 'item-15', name: 'Kerupuk Putih Kaleng', category: 'Ekstra', price: 1000, status: 'Tersedia', image: '🍪', description: 'Kerupuk putih gurih renyah dalam kaleng legendaris.' },
    { id: 'item-16', name: 'Emping Melinjo Asin', category: 'Ekstra', price: 3000, status: 'Tersedia', image: '🍘', description: 'Keripik emping melinjo goreng asin gurih renyah.' }
];

// Helper: Format Rupiah Currency
function formatCurrency(value) {
    return 'Rp ' + Number(value).toLocaleString('id-ID');
}

// Helper: Format Date & Time for UI
function formatDateTime(date) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options).replace('pukul ', '| ');
}

// 3. LocalStorage Services
const storage = {
    load() {
        const storedMenu = localStorage.getItem('soto_pos_menu');
        const storedTransactions = localStorage.getItem('soto_pos_transactions');
        const storedSettings = localStorage.getItem('soto_pos_settings');
        const storedExpenses = localStorage.getItem('soto_pos_expenses');
        const storedIngredients = localStorage.getItem('soto_pos_ingredients');

        if (storedMenu) {
            state.menuItems = JSON.parse(storedMenu);
            // Migrate old category 'Sate & Gorengan' to 'Topping' dynamically
            let migrated = false;
            state.menuItems.forEach(item => {
                if (item.category === 'Sate & Gorengan') {
                    item.category = 'Topping';
                    migrated = true;
                }
            });
            if (migrated) {
                this.saveMenu();
            }
        } else {
            state.menuItems = [...DEFAULT_MENU_ITEMS];
            this.saveMenu();
        }

        if (storedTransactions) {
            state.transactions = JSON.parse(storedTransactions);
        } else {
            state.transactions = [];
            this.saveTransactions();
        }

        if (storedSettings) {
            state.settings = JSON.parse(storedSettings);
        } else {
            state.settings = { ...DEFAULT_SETTINGS };
            this.saveSettings();
        }

        if (storedExpenses) {
            state.expenses = JSON.parse(storedExpenses);
        } else {
            state.expenses = [...DEFAULT_EXPENSES];
            this.saveExpenses();
        }

        if (storedIngredients) {
            state.ingredients = JSON.parse(storedIngredients);
        } else {
            state.ingredients = [...DEFAULT_INGREDIENTS];
            this.saveIngredients();
        }
    },
    saveMenu() {
        localStorage.setItem('soto_pos_menu', JSON.stringify(state.menuItems));
    },
    saveTransactions() {
        localStorage.setItem('soto_pos_transactions', JSON.stringify(state.transactions));
    },
    saveSettings() {
        localStorage.setItem('soto_pos_settings', JSON.stringify(state.settings));
    },
    saveExpenses() {
        localStorage.setItem('soto_pos_expenses', JSON.stringify(state.expenses));
    },
    saveIngredients() {
        localStorage.setItem('soto_pos_ingredients', JSON.stringify(state.ingredients));
    }
};

// Mock Transaction Generator to pre-populate charts
function generateMockTransactions() {
    if (state.transactions.length > 0) return;

    const mockTrxs = [];
    const customerNames = ['Budi', 'Siti', 'Joko', 'Rian', 'Dewi', 'Andi', 'Lisa', 'Hendra', 'Bu Wahyu', 'Slamet', 'Agus', 'Tono'];
    const paymentMethods = ['Tunai', 'QRIS', 'Transfer'];

    // Generate transactions for the last 30 days
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Random number of transactions per day (3 to 8)
        const trxsCount = Math.floor(Math.random() * 6) + 3;

        for (let j = 0; j < trxsCount; j++) {
            // Set random hour between 8 and 21
            const hour = Math.floor(Math.random() * 13) + 8;
            const minutes = Math.floor(Math.random() * 60);
            const trxDate = new Date(date);
            trxDate.setHours(hour, minutes, 0, 0);

            // Random customer & table
            const customer = customerNames[Math.floor(Math.random() * customerNames.length)];
            const table = Math.random() > 0.4 ? String(Math.floor(Math.random() * 10) + 1) : '-';
            const payment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

            // Select random menu items (1 to 3 items)
            const itemCount = Math.floor(Math.random() * 3) + 1;
            const items = [];
            let subtotal = 0;

            for (let k = 0; k < itemCount; k++) {
                const menuItem = state.menuItems[Math.floor(Math.random() * state.menuItems.length)];
                const qty = Math.floor(Math.random() * 2) + 1;
                const itemSubtotal = menuItem.price * qty;
                subtotal += itemSubtotal;

                items.push({
                    id: menuItem.id,
                    name: menuItem.name,
                    price: menuItem.price,
                    quantity: qty,
                    notes: '',
                    subtotal: itemSubtotal
                });
            }

            const discountPercent = Math.random() > 0.85 ? 10 : 0;
            const taxPercent = 0;

            const discountAmount = (subtotal * discountPercent) / 100;
            const total = subtotal - discountAmount;

            const cashReceived = payment === 'Tunai' ? Math.ceil(total / 10000) * 10000 : total;
            const change = cashReceived - total;

            const id = `TRX-${trxDate.getFullYear()}${String(trxDate.getMonth() + 1).padStart(2, '0')}${String(trxDate.getDate()).padStart(2, '0')}-${String(mockTrxs.length + 1).padStart(4, '0')}`;

            mockTrxs.unshift({
                id: id,
                timestamp: trxDate.toISOString(),
                customerName: customer,
                tableNumber: table,
                items: items,
                subtotal: subtotal,
                discountPercent: discountPercent,
                taxPercent: taxPercent,
                total: total,
                paymentMethod: payment,
                cashReceived: cashReceived,
                cashChange: change
            });
        }
    }

    state.transactions = mockTrxs;
    storage.saveTransactions();
}

// 4. Initialisation on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    storage.load();
    generateMockTransactions();
    applySettingsToUI();
    initClock();
    initNavigation();
    initCashierCartEvents();
    initMenuMgmtEvents();
    initMenuMgmtSubtabs();
    initHistoryEvents();
    initExpensesEvents();
    initSettingsEvents();
    initChartEvents();
    initMobileSidebar();

    // Initial UI render
    renderCashierMenu();
    renderMenuManagementTable();
    renderStockTable();
    renderExpensesTable();
    renderTransactionsHistory();
    updateDashboard();

    // Lucide Icons Initialization
    lucide.createIcons();
});

// Live Clock
function initClock() {
    const clockEl = document.getElementById('live-time');
    const updateTime = () => {
        const now = new Date();
        clockEl.textContent = formatDateTime(now);
    };
    updateTime();
    setInterval(updateTime, 60000);
}

// Mobile Sidebar Toggle
function initMobileSidebar() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const sidebar = document.querySelector('.sidebar');

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
}

// 5. Sidebar Navigation Controller
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const screens = document.querySelectorAll('.app-screen');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = item.getAttribute('data-tab');

            // Update Active State on Links
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Switch Active Screen
            screens.forEach(screen => screen.classList.remove('active'));
            const targetScreen = document.getElementById(`screen-${tabName}`);
            if (targetScreen) targetScreen.classList.add('active');

            // Close mobile sidebar if open
            document.querySelector('.sidebar').classList.remove('open');

            // Update Page Header Title
            state.activeTab = tabName;
            switch (tabName) {
                case 'dashboard':
                    pageTitle.textContent = 'Dashboard Utama';
                    updateDashboard();
                    break;
                case 'cashier':
                    pageTitle.textContent = 'Mesin Kasir (POS)';
                    renderCashierMenu();
                    break;
                case 'menu-management':
                    pageTitle.textContent = 'Kelola Menu & Stok';
                    // Automatically trigger active subtab render
                    const activeSubtab = document.querySelector('.sub-nav-btn.active');
                    if (activeSubtab) {
                        const subtab = activeSubtab.getAttribute('data-subtab');
                        if (subtab === 'menu-list') renderMenuManagementTable();
                        else renderStockTable();
                    } else {
                        document.querySelector('.sub-nav-btn[data-subtab="menu-list"]').click();
                    }
                    break;
                case 'history':
                    pageTitle.textContent = 'Riwayat Transaksi';
                    renderTransactionsHistory();
                    break;
                case 'expenses':
                    pageTitle.textContent = 'Pengeluaran Kas Warung';
                    renderExpensesTable();
                    break;
                case 'settings':
                    pageTitle.textContent = 'Pengaturan Warung';
                    loadSettingsForm();
                    break;
            }
            lucide.createIcons();
        });
    });

    // Dashboard "Lihat Semua" button redirection
    document.getElementById('dashboard-view-all-btn').addEventListener('click', () => {
        document.getElementById('nav-history').click();
    });
}

// 6. CASHIER - POS SYSTEM LOGIC
let activeMenuCategoryFilter = 'all';
let cashierMenuSearchQuery = '';

function renderCashierMenu() {
    const grid = document.getElementById('cashier-menu-grid');
    grid.innerHTML = '';

    // Filter and search menu items
    const filteredItems = state.menuItems.filter(item => {
        const matchesCategory = activeMenuCategoryFilter === 'all' || item.category === activeMenuCategoryFilter;
        const matchesSearch = item.name.toLowerCase().includes(cashierMenuSearchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(cashierMenuSearchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filteredItems.length === 0) {
        grid.innerHTML = `
            <div class="empty-grid text-muted">
                <i data-lucide="info" style="width: 48px; height: 48px;"></i>
                <p>Tidak ada menu yang sesuai dengan pencarian.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    filteredItems.forEach(item => {
        const isSoldOut = item.status === 'Habis';
        const card = document.createElement('div');
        card.className = `menu-card ${isSoldOut ? 'sold-out' : ''}`;

        // Check if image is URL or Emoji symbol
        const isUrl = item.image.startsWith('http://') || item.image.startsWith('https://') || item.image.includes('/') || item.image.includes('.png');
        const imageHtml = isUrl
            ? `<img src="${item.image}" alt="${item.name}" class="menu-card-image" onerror="this.outerHTML='🍲'">`
            : `<div class="menu-card-image-box">${item.image || '🍲'}</div>`;

        card.innerHTML = `
            ${imageHtml}
            <span class="menu-card-category-badge">${item.category}</span>
            <div class="menu-card-info">
                <h4 class="menu-card-title">${item.name}</h4>
                <p class="menu-card-desc">${item.description || 'Tidak ada deskripsi.'}</p>
                <div class="menu-card-footer">
                    <span class="menu-card-price">${formatCurrency(item.price)}</span>
                    <button class="btn-add-to-cart" data-id="${item.id}" title="Tambah ke keranjang">
                        <i data-lucide="plus"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Bind Add to Cart Buttons
    grid.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = btn.getAttribute('data-id');
            addToCart(itemId);
        });
    });

    lucide.createIcons();
}

function initCashierCartEvents() {
    // Menu Category Tabs
    const tabs = document.querySelectorAll('#menu-category-tabs .category-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeMenuCategoryFilter = tab.getAttribute('data-category');
            renderCashierMenu();
        });
    });

    // Menu Search Input
    const searchInput = document.getElementById('menu-search-input');
    searchInput.addEventListener('input', (e) => {
        cashierMenuSearchQuery = e.target.value;
        renderCashierMenu();
    });

    // Cart Discount & Tax Inputs
    const discountInput = document.getElementById('cart-discount');
    const taxInput = document.getElementById('cart-tax');
    discountInput.addEventListener('input', calculateCartTotals);
    taxInput.addEventListener('input', calculateCartTotals);

    // Payment Method Selection
    const paymentBtns = document.querySelectorAll('.payment-method-btn');
    const cashCalc = document.getElementById('cash-payment-calc');
    paymentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            paymentBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.selectedPaymentMethod = btn.getAttribute('data-method');

            // Toggle cash calculator UI
            if (state.selectedPaymentMethod === 'Tunai') {
                cashCalc.style.display = 'flex';
                document.getElementById('cash-received').focus();
            } else {
                cashCalc.style.display = 'none';
                // Automatically set cash received to cart total
                const total = getCartTotalValue();
                document.getElementById('cash-received').value = total;
            }
            calculateCartTotals();
        });
    });

    // Cash Received Input & Quick Cash
    const cashInput = document.getElementById('cash-received');
    cashInput.addEventListener('input', calculateCartTotals);

    const quickCashBtns = document.querySelectorAll('.quick-cash-btn');
    quickCashBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const amountType = btn.getAttribute('data-amount');
            const total = getCartTotalValue();

            if (amountType === 'exact') {
                cashInput.value = total;
            } else {
                cashInput.value = Number(amountType);
            }
            calculateCartTotals();
        });
    });

    // Clear Cart Button
    document.getElementById('btn-clear-cart').addEventListener('click', () => {
        if (state.cart.length === 0) return;
        if (confirm('Apakah Anda yakin ingin mengosongkan keranjang belanja?')) {
            clearCart();
            showToast('Keranjang berhasil dikosongkan', 'warning');
        }
    });

    // Checkout Button
    document.getElementById('btn-checkout').addEventListener('click', processCheckout);
}

// Cart Core Operations
function addToCart(itemId) {
    const item = state.menuItems.find(i => i.id === itemId);
    if (!item || item.status === 'Habis') return;

    const cartItem = state.cart.find(c => c.item.id === itemId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        state.cart.push({
            item: item,
            quantity: 1,
            notes: ''
        });
    }

    renderCart();
    showToast(`${item.name} ditambahkan ke keranjang`, 'success');
}

function updateCartQuantity(itemId, change) {
    const cartItem = state.cart.find(c => c.item.id === itemId);
    if (!cartItem) return;

    cartItem.quantity += change;

    if (cartItem.quantity <= 0) {
        state.cart = state.cart.filter(c => c.item.id !== itemId);
        showToast(`${cartItem.item.name} dihapus dari keranjang`, 'warning');
    }

    renderCart();
}

function removeCartItem(itemId) {
    const cartItem = state.cart.find(c => c.item.id === itemId);
    if (!cartItem) return;

    state.cart = state.cart.filter(c => c.item.id !== itemId);
    renderCart();
    showToast(`${cartItem.item.name} dihapus dari keranjang`, 'warning');
}

function updateCartNotes(itemId, notes) {
    const cartItem = state.cart.find(c => c.item.id === itemId);
    if (cartItem) {
        cartItem.notes = notes;
        const trigger = document.getElementById(`notes-trigger-${itemId}`);
        if (notes.trim() !== '') {
            trigger.classList.add('has-notes');
            trigger.innerHTML = `<i data-lucide="message-square-text"></i> Edit Catatan`;
        } else {
            trigger.classList.remove('has-notes');
            trigger.innerHTML = `<i data-lucide="message-square"></i> Tambah Catatan`;
        }
        lucide.createIcons();
    }
}

function clearCart() {
    state.cart = [];
    document.getElementById('cart-customer-name').value = 'Pelanggan Umum';
    document.getElementById('cart-table-number').value = '';
    document.getElementById('cart-discount').value = state.settings.defaultDiscount || 0;
    document.getElementById('cart-tax').value = state.settings.defaultTax || 0;
    document.getElementById('cash-received').value = '';
    renderCart();
}

// Render Cart HTML
function renderCart() {
    const cartWrapper = document.getElementById('cart-items-list');
    cartWrapper.innerHTML = '';

    // Update Badge
    const totalItemsCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-item-count').textContent = `${totalItemsCount} item`;

    if (state.cart.length === 0) {
        cartWrapper.innerHTML = `
            <div class="empty-cart-state">
                <i data-lucide="shopping-basket"></i>
                <p>Keranjang kosong. Pilih menu di sebelah kiri untuk menambahkan pesanan.</p>
            </div>
        `;
        calculateCartTotals();
        lucide.createIcons();
        return;
    }

    state.cart.forEach(cartItem => {
        const item = cartItem.item;
        const itemSubtotal = item.price * cartItem.quantity;
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="cart-item-header">
                <div>
                    <h5 class="cart-item-title">${item.name}</h5>
                    <span class="cart-item-price-calc">${cartItem.quantity} x ${formatCurrency(item.price)}</span>
                </div>
                <span class="cart-item-subtotal">${formatCurrency(itemSubtotal)}</span>
            </div>
            <div class="cart-item-controls">
                <button class="item-notes-trigger ${cartItem.notes ? 'has-notes' : ''}" id="notes-trigger-${item.id}" onclick="toggleNotesDrawer('${item.id}')">
                    <i data-lucide="${cartItem.notes ? 'message-square-text' : 'message-square'}"></i> 
                    ${cartItem.notes ? 'Edit Catatan' : 'Tambah Catatan'}
                </button>
                <div class="qty-counter">
                    <button class="qty-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                    <span class="qty-val">${cartItem.quantity}</span>
                    <button class="qty-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                </div>
                <button class="btn-remove-item" onclick="removeCartItem('${item.id}')" title="Hapus item">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
            <div class="cart-item-notes-input ${cartItem.notes ? 'open' : ''}" id="notes-drawer-${item.id}">
                <input type="text" placeholder="Contoh: Tanpa tauge, kuah dipisah..." value="${cartItem.notes}" oninput="updateCartNotes('${item.id}', this.value)">
            </div>
        `;
        cartWrapper.appendChild(row);
    });

    calculateCartTotals();
    lucide.createIcons();
}

// Inline trigger helpers exposed to window for ease of HTML click binding
window.toggleNotesDrawer = function (itemId) {
    const drawer = document.getElementById(`notes-drawer-${itemId}`);
    drawer.classList.toggle('open');
};
window.updateCartQuantity = updateCartQuantity;
window.removeCartItem = removeCartItem;
window.updateCartNotes = updateCartNotes;

// Calculate Cart Totals (Subtotal, Discount, Tax, Change Return)
function getCartSubtotal() {
    return state.cart.reduce((sum, entry) => sum + (entry.item.price * entry.quantity), 0);
}

function getCartTotalValue() {
    const subtotal = getCartSubtotal();
    const discountPercent = Number(document.getElementById('cart-discount').value) || 0;
    const taxPercent = Number(document.getElementById('cart-tax').value) || 0;

    const discountAmount = (subtotal * discountPercent) / 100;
    const subAfterDiscount = subtotal - discountAmount;
    const taxAmount = (subAfterDiscount * taxPercent) / 100;

    return subAfterDiscount + taxAmount;
}

function calculateCartTotals() {
    const subtotal = getCartSubtotal();
    const discountPercent = Number(document.getElementById('cart-discount').value) || 0;
    const taxPercent = Number(document.getElementById('cart-tax').value) || 0;

    const discountAmount = (subtotal * discountPercent) / 100;
    const subAfterDiscount = subtotal - discountAmount;
    const taxAmount = (subAfterDiscount * taxPercent) / 100;
    const grandTotal = subAfterDiscount + taxAmount;

    // Set DOM elements
    document.getElementById('cart-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('cart-total').textContent = formatCurrency(grandTotal);

    // If QRIS or Transfer, automatically match the cash received input value
    const cashInput = document.getElementById('cash-received');
    if (state.selectedPaymentMethod !== 'Tunai') {
        cashInput.value = grandTotal;
    }

    const cashReceived = Number(cashInput.value) || 0;
    const change = Math.max(0, cashReceived - grandTotal);

    document.getElementById('cash-change').textContent = formatCurrency(change);
}

// Process Order Checkout
function processCheckout() {
    if (state.cart.length === 0) {
        showToast('Gagal! Keranjang belanja masih kosong.', 'error');
        return;
    }

    const customerName = document.getElementById('cart-customer-name').value.trim() || 'Pelanggan Umum';
    const tableNumber = document.getElementById('cart-table-number').value.trim() || '-';
    const subtotal = getCartSubtotal();
    const discountPercent = Number(document.getElementById('cart-discount').value) || 0;
    const taxPercent = Number(document.getElementById('cart-tax').value) || 0;
    const grandTotal = getCartTotalValue();
    const cashReceived = Number(document.getElementById('cash-received').value) || 0;

    if (state.selectedPaymentMethod === 'Tunai' && cashReceived < grandTotal) {
        showToast(`Gagal! Pembayaran kurang ${formatCurrency(grandTotal - cashReceived)}`, 'error');
        return;
    }

    const change = Math.max(0, cashReceived - grandTotal);

    // Generate Transaction Record
    const now = new Date();
    const formattedDateString = now.toISOString(); // Keep ISO string for serialization
    const transactionId = `TRX-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(state.transactions.length + 1).padStart(4, '0')}`;

    const items = state.cart.map(c => ({
        id: c.item.id,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity,
        notes: c.notes,
        subtotal: c.item.price * c.quantity
    }));

    const transaction = {
        id: transactionId,
        timestamp: formattedDateString,
        customerName: customerName,
        tableNumber: tableNumber,
        items: items,
        subtotal: subtotal,
        discountPercent: discountPercent,
        taxPercent: taxPercent,
        total: grandTotal,
        paymentMethod: state.selectedPaymentMethod,
        cashReceived: cashReceived,
        cashChange: change
    };

    // Deduct raw stock ingredients based on cart contents
    state.cart.forEach(c => {
        const ingredientsUsed = RECIPE_MAP[c.item.id];
        if (ingredientsUsed) {
            ingredientsUsed.forEach(ing => {
                const dbIng = state.ingredients.find(i => i.name.toLowerCase() === ing.name.toLowerCase());
                if (dbIng) {
                    dbIng.qty = Math.max(0, dbIng.qty - (ing.qty * c.quantity));
                    if (dbIng.qty <= dbIng.minQty) {
                        // Triggers warning toast for low stock
                        setTimeout(() => {
                            showToast(`Peringatan! Stok ${dbIng.name} menipis: sisa ${dbIng.qty} ${dbIng.unit}`, 'warning');
                        }, 500);
                    }
                }
            });
        }
    });
    storage.saveIngredients();
    renderStockTable();

    // Save state
    state.transactions.unshift(transaction); // add to top
    storage.saveTransactions();

    // Trigger Print Receipt Overlay Modal
    showReceiptModal(transaction);

    // Reset State
    clearCart();

    // Live update Header metrics
    updateDashboardMiniHeader();

    showToast('Transaksi berhasil diproses!', 'success');
}

// 7. RECEIPT MODAL & PRINTING ENGINE
function showReceiptModal(transaction) {
    const paper = document.getElementById('receipt-paper-content');

    const itemsHtml = transaction.items.map(item => `
        <div class="receipt-item-row">
            <div class="receipt-item-info">
                <span>${item.name}</span>
                <span>${formatCurrency(item.subtotal)}</span>
            </div>
            <div class="receipt-item-details">
                <span>${item.quantity} x ${formatCurrency(item.price)}</span>
            </div>
            ${item.notes ? `<div class="receipt-item-notes">* ${item.notes}</div>` : ''}
        </div>
    `).join('');

    const discountAmount = (transaction.subtotal * transaction.discountPercent) / 100;
    const taxAmount = ((transaction.subtotal - discountAmount) * transaction.taxPercent) / 100;

    const isUrl = state.settings.logoUrl.startsWith('http') || state.settings.logoUrl.includes('/') || state.settings.logoUrl.includes('.png');
    const receiptLogoHtml = isUrl
        ? `<img src="${state.settings.logoUrl}" alt="${state.settings.name}" class="receipt-logo-img" onerror="this.outerHTML='${state.settings.logoIcon}'">`
        : `<div class="receipt-logo-emoji" style="font-size: 2.2rem; margin-bottom: 4px;">${state.settings.logoIcon}</div>`;

    const receiptHtml = `
        <div class="receipt-header">
            <div class="receipt-logo-circle" style="background-color: white; border: none; overflow: hidden; display: flex; align-items: center; justify-content: center;">${receiptLogoHtml}</div>
            <div class="receipt-shop-name">${state.settings.name}</div>
            <div class="receipt-shop-address">${state.settings.address}<br>Telp: ${state.settings.phone}</div>
        </div>
        <div class="receipt-meta">
            <div class="receipt-meta-row">
                <span>No Struk:</span>
                <span>${transaction.id}</span>
            </div>
            <div class="receipt-meta-row">
                <span>Waktu:</span>
                <span>${new Date(transaction.timestamp).toLocaleString('id-ID')}</span>
            </div>
            <div class="receipt-meta-row">
                <span>Pelanggan:</span>
                <span>${transaction.customerName}</span>
            </div>
            <div class="receipt-meta-row">
                <span>Meja:</span>
                <span>${transaction.tableNumber}</span>
            </div>
        </div>
        <div class="receipt-items-list">
            ${itemsHtml}
        </div>
        <div class="receipt-totals">
            <div class="receipt-total-row">
                <span>Subtotal:</span>
                <span>${formatCurrency(transaction.subtotal)}</span>
            </div>
            ${transaction.discountPercent > 0 ? `
            <div class="receipt-total-row text-danger">
                <span>Diskon (${transaction.discountPercent}%):</span>
                <span>-${formatCurrency(discountAmount)}</span>
            </div>` : ''}
            ${transaction.taxPercent > 0 ? `
            <div class="receipt-total-row">
                <span>Pajak (${transaction.taxPercent}%):</span>
                <span>${formatCurrency(taxAmount)}</span>
            </div>` : ''}
            <div class="receipt-total-row grand-total">
                <span>TOTAL AKHIR:</span>
                <span>${formatCurrency(transaction.total)}</span>
            </div>
            <div class="receipt-total-row" style="margin-top: 6px;">
                <span>Metode Bayar:</span>
                <span>${transaction.paymentMethod}</span>
            </div>
            <div class="receipt-total-row">
                <span>Bayar:</span>
                <span>${formatCurrency(transaction.cashReceived)}</span>
            </div>
            <div class="receipt-total-row">
                <span>Kembali:</span>
                <span>${formatCurrency(transaction.cashChange)}</span>
            </div>
        </div>
        <div class="receipt-footer">
            <div class="receipt-thankyou">Terima Kasih Atas Kunjungan Anda</div>
            <div>Soto Pak Asyari: Segar, Lezat & Mantap!</div>
        </div>
    `;

    paper.innerHTML = receiptHtml;

    // Sync to Hidden Print Area
    const printArea = document.getElementById('print-receipt-area');
    printArea.innerHTML = receiptHtml;

    // Show Modal
    const modal = document.getElementById('receipt-modal');
    modal.classList.add('open');

    // Bind printing trigger
    const printBtn = document.getElementById('btn-print-receipt-action');

    // Remove old listeners to avoid multiple binding
    const newPrintBtn = printBtn.cloneNode(true);
    printBtn.parentNode.replaceChild(newPrintBtn, printBtn);

    newPrintBtn.addEventListener('click', () => {
        window.print();
    });
}

// Close Modals Binding
document.getElementById('receipt-modal-close').addEventListener('click', () => {
    document.getElementById('receipt-modal').classList.remove('open');
});
document.getElementById('btn-print-receipt-close').addEventListener('click', () => {
    document.getElementById('receipt-modal').classList.remove('open');
});

// 8. MENU CRUD (PRODUCT MANAGEMENT)
let menuSearchQuery = '';
let menuCategoryFilter = 'all';

function renderMenuManagementTable() {
    const tbody = document.getElementById('menu-mgmt-tbody');
    tbody.innerHTML = '';

    const filtered = state.menuItems.filter(item => {
        const matchesCategory = menuCategoryFilter === 'all' || item.category === menuCategoryFilter;
        const matchesSearch = item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(menuSearchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">Tidak ada data menu yang cocok.</td>
            </tr>
        `;
        return;
    }

    filtered.forEach(item => {
        const isUrl = item.image.startsWith('http://') || item.image.startsWith('https://') || item.image.includes('/') || item.image.includes('.png');
        const imgHtml = isUrl
            ? `<img src="${item.image}" alt="${item.name}" class="item-thumb-img" onerror="this.outerHTML='<span class=\'item-thumb-emoji\'>🍲</span>'">`
            : `<span class="item-thumb-emoji">${item.image || '🍲'}</span>`;

        const isAvailable = item.status === 'Tersedia';
        const badgeClass = isAvailable ? 'badge-success' : 'badge-danger';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${imgHtml}</td>
            <td><strong>${item.name}</strong><br><small class="text-muted">${item.description || '-'}</small></td>
            <td><span class="badge badge-info">${item.category}</span></td>
            <td><strong>${formatCurrency(item.price)}</strong></td>
            <td><span class="badge ${badgeClass}">${item.status}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon edit-action" title="Ubah Menu" onclick="openEditMenuModal('${item.id}')">
                        <i data-lucide="edit-3"></i>
                    </button>
                    <button class="btn-icon delete-action" title="Hapus Menu" onclick="deleteMenuItem('${item.id}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function initMenuMgmtEvents() {
    // CRUD filters
    document.getElementById('menu-mgmt-search').addEventListener('input', (e) => {
        menuSearchQuery = e.target.value;
        renderMenuManagementTable();
    });

    document.getElementById('menu-mgmt-filter-category').addEventListener('change', (e) => {
        menuCategoryFilter = e.target.value;
        renderMenuManagementTable();
    });

    // Add Menu Trigger
    document.getElementById('btn-add-menu-item').addEventListener('click', () => {
        openAddMenuModal();
    });

    // Modal Close buttons
    const closeModal = () => {
        document.getElementById('menu-item-modal').classList.remove('open');
    };
    document.getElementById('menu-modal-close').addEventListener('click', closeModal);
    document.getElementById('menu-modal-cancel').addEventListener('click', closeModal);

    // Form Submit
    document.getElementById('menu-item-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveMenuItem();
    });
}

function openAddMenuModal() {
    document.getElementById('menu-modal-title').textContent = 'Tambah Menu Baru';
    document.getElementById('menu-form-id').value = '';
    document.getElementById('menu-form-name').value = '';
    document.getElementById('menu-form-category').value = 'Soto';
    document.getElementById('menu-form-price').value = '';
    document.getElementById('menu-form-status').value = 'Tersedia';
    document.getElementById('menu-form-image-emoji').value = '🍲';
    document.getElementById('menu-form-description').value = '';

    document.getElementById('menu-item-modal').classList.add('open');
    document.getElementById('menu-form-name').focus();
}

window.openEditMenuModal = function (id) {
    const item = state.menuItems.find(i => i.id === id);
    if (!item) return;

    document.getElementById('menu-modal-title').textContent = 'Ubah Detail Menu';
    document.getElementById('menu-form-id').value = item.id;
    document.getElementById('menu-form-name').value = item.name;
    document.getElementById('menu-form-category').value = item.category;
    document.getElementById('menu-form-price').value = item.price;
    document.getElementById('menu-form-status').value = item.status;
    document.getElementById('menu-form-image-emoji').value = item.image;
    document.getElementById('menu-form-description').value = item.description || '';

    document.getElementById('menu-item-modal').classList.add('open');
    document.getElementById('menu-form-name').focus();
};

function saveMenuItem() {
    const id = document.getElementById('menu-form-id').value;
    const name = document.getElementById('menu-form-name').value.trim();
    const category = document.getElementById('menu-form-category').value;
    const price = Number(document.getElementById('menu-form-price').value) || 0;
    const status = document.getElementById('menu-form-status').value;
    const image = document.getElementById('menu-form-image-emoji').value.trim() || '🍲';
    const description = document.getElementById('menu-form-description').value.trim();

    if (!name || price <= 0) {
        showToast('Form tidak valid! Lengkapi semua kolom wajib.', 'error');
        return;
    }

    if (id) {
        // Edit Mode
        const index = state.menuItems.findIndex(i => i.id === id);
        if (index !== -1) {
            state.menuItems[index] = { id, name, category, price, status, image, description };
            showToast(`Menu ${name} berhasil diperbarui!`, 'success');
        }
    } else {
        // Add Mode
        const newId = `item-${Date.now()}`;
        state.menuItems.push({ id: newId, name, category, price, status, image, description });
        showToast(`Menu ${name} berhasil ditambahkan!`, 'success');
    }

    storage.saveMenu();
    document.getElementById('menu-item-modal').classList.remove('open');

    // Refresh table and grids
    renderMenuManagementTable();
    renderCashierMenu();
}

window.deleteMenuItem = function (id) {
    const item = state.menuItems.find(i => i.id === id);
    if (!item) return;

    if (confirm(`Apakah Anda yakin ingin menghapus "${item.name}" dari daftar menu?`)) {
        state.menuItems = state.menuItems.filter(i => i.id !== id);
        storage.saveMenu();

        // Remove from cart if active
        state.cart = state.cart.filter(c => c.item.id !== id);
        renderCart();

        renderMenuManagementTable();
        renderCashierMenu();
        showToast(`Menu ${item.name} telah dihapus.`, 'warning');
    }
};

// 9. TRANSACTION HISTORY MANAGEMENT
let historySearchQuery = '';
let historyDateFilter = '';
let historyPaymentFilter = 'all';

function renderTransactionsHistory() {
    const tbody = document.getElementById('history-tbody');
    tbody.innerHTML = '';

    const filtered = state.transactions.filter(trx => {
        const matchesPayment = historyPaymentFilter === 'all' || trx.paymentMethod === historyPaymentFilter;

        // Date match (format ISO string date YYYY-MM-DD vs filter)
        let matchesDate = true;
        if (historyDateFilter) {
            const trxDate = trx.timestamp.split('T')[0]; // Get YYYY-MM-DD
            matchesDate = trxDate === historyDateFilter;
        }

        // Search match (ID or Customer Name)
        const matchesSearch = trx.id.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
            trx.customerName.toLowerCase().includes(historySearchQuery.toLowerCase());

        return matchesPayment && matchesDate && matchesSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted">Tidak ada riwayat transaksi yang cocok.</td>
            </tr>
        `;
        return;
    }

    filtered.forEach(trx => {
        // Construct visual item summaries
        const itemsSummary = trx.items.map(i => `${i.name} (${i.quantity}x)`).join(', ');
        const timeFormatted = new Date(trx.timestamp).toLocaleString('id-ID', {
            month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
        });

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${trx.id}</strong></td>
            <td>${timeFormatted}</td>
            <td><strong>${trx.customerName}</strong></td>
            <td><span class="badge badge-warning">${trx.tableNumber}</span></td>
            <td><div style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${itemsSummary}">${itemsSummary}</div></td>
            <td><strong>${formatCurrency(trx.total)}</strong></td>
            <td><span class="badge ${trx.paymentMethod === 'Tunai' ? 'badge-success' : 'badge-info'}">${trx.paymentMethod}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon print-action" title="Cetak Ulang Struk" onclick="reprintReceipt('${trx.id}')">
                        <i data-lucide="printer"></i>
                    </button>
                    <button class="btn-icon delete-action" title="Hapus Transaksi" onclick="deleteTransaction('${trx.id}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function initHistoryEvents() {
    // Search input
    document.getElementById('history-search').addEventListener('input', (e) => {
        historySearchQuery = e.target.value;
        renderTransactionsHistory();
    });

    // Date filter
    document.getElementById('history-filter-date').addEventListener('change', (e) => {
        historyDateFilter = e.target.value;
        renderTransactionsHistory();
    });

    // Payment method filter
    document.getElementById('history-filter-payment').addEventListener('change', (e) => {
        historyPaymentFilter = e.target.value;
        renderTransactionsHistory();
    });

    // Export CSV
    document.getElementById('btn-export-csv').addEventListener('click', exportTransactionsToCSV);

    // Z-Report Print Trigger
    document.getElementById('btn-z-report').addEventListener('click', printZReport);
}

window.reprintReceipt = function (trxId) {
    const trx = state.transactions.find(t => t.id === trxId);
    if (!trx) return;
    showReceiptModal(trx);
};

window.deleteTransaction = function (trxId) {
    if (confirm(`Apakah Anda yakin ingin menghapus transaksi "${trxId}"? Tindakan ini akan mengubah laporan keuangan.`)) {
        state.transactions = state.transactions.filter(t => t.id !== trxId);
        storage.saveTransactions();
        renderTransactionsHistory();
        updateDashboard();
        updateDashboardMiniHeader();
        showToast(`Transaksi ${trxId} telah dihapus dari riwayat.`, 'warning');
    }
};

// Export to CSV Function
function exportTransactionsToCSV() {
    if (state.transactions.length === 0) {
        showToast('Tidak ada transaksi untuk diekspor!', 'error');
        return;
    }

    let csvContent = 'ID Transaksi,Waktu,Pelanggan,Meja,Subtotal,Diskon(%),Pajak(%),Total Akhir,Pembayaran\n';

    state.transactions.forEach(t => {
        const row = [
            t.id,
            new Date(t.timestamp).toLocaleString('id-ID'),
            `"${t.customerName.replace(/"/g, '""')}"`,
            t.tableNumber,
            t.subtotal,
            t.discountPercent,
            t.taxPercent,
            t.total,
            t.paymentMethod
        ].join(',');
        csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Riwayat_Transaksi_Soto_Pak_Wahyu_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Laporan penjualan CSV berhasil diunduh!', 'success');
}

// 10. DASHBOARD & STATISTICS ENGINE
function updateDashboardMiniHeader() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayTransactions = state.transactions.filter(t => t.timestamp.split('T')[0] === todayStr);
    const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0);
    document.getElementById('mini-today-revenue').textContent = formatCurrency(todayRevenue);
}

function updateDashboard() {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Filter transactions
    const todayTrx = state.transactions.filter(t => t.timestamp.split('T')[0] === todayStr);
    const yesterdayTrx = state.transactions.filter(t => t.timestamp.split('T')[0] === yesterdayStr);

    // Filter expenses
    const todayExpenses = state.expenses.filter(e => e.date.split('T')[0] === todayStr).reduce((sum, e) => sum + e.amount, 0);
    const yesterdayExpenses = state.expenses.filter(e => e.date.split('T')[0] === yesterdayStr).reduce((sum, e) => sum + e.amount, 0);

    // Revenue calculations (Gross)
    const todayRevenue = todayTrx.reduce((sum, t) => sum + t.total, 0);
    const yesterdayRevenue = yesterdayTrx.reduce((sum, t) => sum + t.total, 0);

    // Net Profit calculations
    const todayNetProfit = todayRevenue - todayExpenses;
    const yesterdayNetProfit = yesterdayRevenue - yesterdayExpenses;

    // Set Revenue Card
    document.getElementById('stat-revenue').textContent = formatCurrency(todayRevenue);

    // Set Expenses Card
    document.getElementById('stat-expenses').textContent = formatCurrency(todayExpenses);

    // Set Net Profit Card
    const profitEl = document.getElementById('stat-net-profit');
    profitEl.textContent = formatCurrency(todayNetProfit);
    if (todayNetProfit < 0) {
        profitEl.className = 'stat-value text-danger';
    } else {
        profitEl.className = 'stat-value text-success';
    }

    // Mini header sync
    document.getElementById('mini-today-revenue').textContent = formatCurrency(todayRevenue);

    // Trend calculation for Revenue
    const trendEl = document.getElementById('trend-revenue');
    if (yesterdayRevenue === 0) {
        trendEl.className = 'stat-trend';
        trendEl.innerHTML = `<i data-lucide="trending-up"></i> Baru Terbuka`;
    } else {
        const percentDiff = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
        const formattedPercent = Math.abs(percentDiff).toFixed(1);
        if (percentDiff >= 0) {
            trendEl.className = 'stat-trend trend-up';
            trendEl.innerHTML = `<i data-lucide="trending-up"></i> +${formattedPercent}% vs Kemarin`;
        } else {
            trendEl.className = 'stat-trend trend-down';
            trendEl.innerHTML = `<i data-lucide="trending-down"></i> -${formattedPercent}% vs Kemarin`;
        }
    }

    // Trend calculation for Expenses
    const expTrendEl = document.getElementById('trend-expenses');
    if (yesterdayExpenses === 0) {
        expTrendEl.innerHTML = `Kemarin: Rp 0`;
    } else {
        const diff = todayExpenses - yesterdayExpenses;
        if (diff > 0) {
            expTrendEl.innerHTML = `<span class="text-danger"><i data-lucide="arrow-up"></i> Naik ${formatCurrency(Math.abs(diff))}</span>`;
        } else if (diff < 0) {
            expTrendEl.innerHTML = `<span class="text-success"><i data-lucide="arrow-down"></i> Turun ${formatCurrency(Math.abs(diff))}</span>`;
        } else {
            expTrendEl.innerHTML = `Sama dengan kemarin`;
        }
    }

    // Trend calculation for Net Profit
    const profitTrendEl = document.getElementById('trend-net-profit');
    if (yesterdayNetProfit === 0) {
        profitTrendEl.innerHTML = `Bersih hari ini`;
    } else {
        const diff = todayNetProfit - yesterdayNetProfit;
        if (diff > 0) {
            profitTrendEl.className = 'stat-trend trend-up';
            profitTrendEl.innerHTML = `<i data-lucide="trending-up"></i> Naik ${formatCurrency(Math.abs(diff))}`;
        } else if (diff < 0) {
            profitTrendEl.className = 'stat-trend trend-down';
            profitTrendEl.innerHTML = `<i data-lucide="trending-down"></i> Turun ${formatCurrency(Math.abs(diff))}`;
        } else {
            profitTrendEl.className = 'stat-trend';
            profitTrendEl.innerHTML = `Stabil vs kemarin`;
        }
    }

    // Set Transaction Count Card
    document.getElementById('stat-orders').textContent = todayTrx.length;

    // Set Average Ticket Card
    const avgSale = todayTrx.length > 0 ? todayRevenue / todayTrx.length : 0;
    document.getElementById('stat-avg-sale').textContent = formatCurrency(avgSale);

    // Set Best Seller Card
    calculateBestSeller(todayTrx);

    // Draw Chart (takes currentChartPeriod into account)
    renderDashboardSalesChart();

    // Render Recent 5 Transactions in Dashboard Card
    renderDashboardRecentTable();
}

function calculateBestSeller(todayTransactions) {
    const itemSales = {};

    // Sum quantities per item sold today
    todayTransactions.forEach(t => {
        t.items.forEach(item => {
            if (itemSales[item.name]) {
                itemSales[item.name] += item.quantity;
            } else {
                itemSales[item.name] = item.quantity;
            }
        });
    });

    let bestSellerName = '-';
    let bestSellerQty = 0;

    for (const [name, qty] of Object.entries(itemSales)) {
        if (qty > bestSellerQty) {
            bestSellerQty = qty;
            bestSellerName = name;
        }
    }

    document.getElementById('stat-best-seller').textContent = bestSellerName;
    document.getElementById('stat-best-seller-qty').textContent = `Terjual ${bestSellerQty} porsi hari ini`;
}

function renderDashboardRecentTable() {
    const tbody = document.getElementById('recent-transactions-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Slice recent 5
    const recent5 = state.transactions.slice(0, 5);

    if (recent5.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">Belum ada transaksi hari ini.</td>
            </tr>
        `;
        return;
    }

    recent5.forEach(trx => {
        const time = new Date(trx.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${time}</td>
            <td><strong>${trx.customerName}</strong></td>
            <td><strong>${formatCurrency(trx.total)}</strong></td>
            <td><span class="badge badge-info">${trx.paymentMethod}</span></td>
            <td>
                <button class="btn-link" onclick="reprintReceipt('${trx.id}')" style="font-size: 0.8rem;">Struk</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

let currentChartPeriod = 'today';

function renderDashboardSalesChart() {
    const container = document.getElementById('sales-chart-container');
    if (!container) return;
    container.innerHTML = '';

    let slots = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (currentChartPeriod === 'today') {
        slots = [
            { label: '08-10', start: 8, end: 10, total: 0 },
            { label: '10-12', start: 10, end: 12, total: 0 },
            { label: '12-14', start: 12, end: 14, total: 0 },
            { label: '14-16', start: 14, end: 16, total: 0 },
            { label: '16-18', start: 16, end: 18, total: 0 },
            { label: '18-20', start: 18, end: 20, total: 0 },
            { label: '20-22', start: 20, end: 22, total: 0 }
        ];

        const todayStr = today.toISOString().split('T')[0];
        const todayTransactions = state.transactions.filter(t => t.timestamp.split('T')[0] === todayStr);

        todayTransactions.forEach(t => {
            const hour = new Date(t.timestamp).getHours();
            const slot = slots.find(s => hour >= s.start && hour < s.end);
            if (slot) slot.total += t.total;
        });

    } else if (currentChartPeriod === 'week') {
        // Last 7 days slots
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            slots.push({
                dateStr: d.toISOString().split('T')[0],
                label: days[d.getDay()],
                total: 0
            });
        }

        state.transactions.forEach(t => {
            const tDateStr = t.timestamp.split('T')[0];
            const slot = slots.find(s => s.dateStr === tDateStr);
            if (slot) slot.total += t.total;
        });

    } else if (currentChartPeriod === 'month') {
        // Last 4 weeks slots
        slots = [
            { label: 'Mng 1', startDays: 0, endDays: 7, total: 0 },
            { label: 'Mng 2', startDays: 7, endDays: 14, total: 0 },
            { label: 'Mng 3', startDays: 14, endDays: 21, total: 0 },
            { label: 'Mng 4', startDays: 21, endDays: 30, total: 0 }
        ];

        const nowMs = Date.now();
        state.transactions.forEach(t => {
            const tMs = new Date(t.timestamp).getTime();
            const daysAgo = (nowMs - tMs) / (24 * 60 * 60 * 1000);
            const slot = slots.find(s => daysAgo >= s.startDays && daysAgo < s.endDays);
            if (slot) slot.total += t.total;
        });
    }

    const maxSales = Math.max(...slots.map(s => s.total), 50000); // minimum scale

    slots.forEach(slot => {
        const heightPercent = Math.min(100, Math.max(5, (slot.total / maxSales) * 85));
        const barWrapper = document.createElement('div');
        barWrapper.className = 'chart-bar-wrapper';

        barWrapper.innerHTML = `
            <div class="chart-bar" style="height: ${heightPercent}%;" data-tooltip="${formatCurrency(slot.total)}"></div>
            <span class="chart-label">${slot.label}</span>
        `;
        container.appendChild(barWrapper);
    });

    lucide.createIcons();
}

// 11. TOAST NOTIFICATION SERVICE
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'check-circle';
    if (type === 'error') icon = 'alert-circle';
    if (type === 'warning') icon = 'alert-triangle';

    toast.innerHTML = `
        <i data-lucide="${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    // Auto dismiss after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-in-out forwards';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

// 12. RESTAURANT SETTINGS CONTROLLER & PERSISTENCE
function applySettingsToUI() {
    // Update Brand Details in Sidebar
    const logoImg = document.getElementById('brand-logo-img');
    if (logoImg) {
        logoImg.src = state.settings.logoUrl || 'logo.png';
        logoImg.onerror = () => {
            logoImg.src = 'logo.png'; // fallback if custom fail
        };
    }

    document.querySelector('.brand-name').textContent = state.settings.name;
    document.querySelector('.brand-tagline').textContent = state.settings.tagline;

    // Update Avatar Initials (First letter of first two words of shop name)
    const words = state.settings.name.split(' ');
    const initials = (words[0] ? words[0][0] : '') + (words[1] ? words[1][0] : '');
    const avatar = document.querySelector('.profile-avatar');
    if (avatar) avatar.textContent = initials.toUpperCase() || 'PW';

    // Update Cashier defaults if cart is empty
    if (state.cart.length === 0) {
        const discEl = document.getElementById('cart-discount');
        const taxEl = document.getElementById('cart-tax');
        if (discEl) discEl.value = state.settings.defaultDiscount || 0;
        if (taxEl) taxEl.value = state.settings.defaultTax || 0;
    }
}

function loadSettingsForm() {
    document.getElementById('set-shop-name').value = state.settings.name;
    document.getElementById('set-shop-tagline').value = state.settings.tagline;
    document.getElementById('set-shop-logo-emoji').value = state.settings.logoIcon;
    document.getElementById('set-shop-logo-url').value = state.settings.logoUrl;
    document.getElementById('set-shop-address').value = state.settings.address;
    document.getElementById('set-shop-phone').value = state.settings.phone;
    document.getElementById('set-default-discount').value = state.settings.defaultDiscount;
    document.getElementById('set-default-tax').value = state.settings.defaultTax;
}

function initSettingsEvents() {
    const form = document.getElementById('settings-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        state.settings = {
            name: document.getElementById('set-shop-name').value.trim(),
            tagline: document.getElementById('set-shop-tagline').value.trim(),
            logoIcon: document.getElementById('set-shop-logo-emoji').value.trim() || '🍲',
            logoUrl: document.getElementById('set-shop-logo-url').value.trim() || 'logo.png',
            address: document.getElementById('set-shop-address').value.trim(),
            phone: document.getElementById('set-shop-phone').value.trim(),
            defaultDiscount: Number(document.getElementById('set-default-discount').value) || 0,
            defaultTax: Number(document.getElementById('set-default-tax').value) || 0
        };

        storage.saveSettings();
        applySettingsToUI();
        showToast('Pengaturan warung berhasil disimpan!', 'success');
    });

    const resetBtn = document.getElementById('btn-reset-settings');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin mengembalikan pengaturan warung ke bawaan awal?')) {
                state.settings = { ...DEFAULT_SETTINGS };
                storage.saveSettings();
                loadSettingsForm();
                applySettingsToUI();
                showToast('Pengaturan telah di-reset ke bawaan.', 'warning');
            }
        });
    }
}

// ==========================================================================
// FEATURE 1: Z-REPORT PRINT ENGINE (DAILY CLOSURE)
// ==========================================================================
function printZReport() {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayTransactions = state.transactions.filter(t => t.timestamp.split('T')[0] === todayStr);
    const todayExpensesList = state.expenses.filter(e => e.date.split('T')[0] === todayStr);

    const grossRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0);
    const totalDiscounts = todayTransactions.reduce((sum, t) => sum + (t.subtotal * t.discountPercent / 100), 0);
    const totalTaxes = todayTransactions.reduce((sum, t) => sum + ((t.subtotal - (t.subtotal * t.discountPercent / 100)) * t.taxPercent / 100), 0);
    const totalExpenses = todayExpensesList.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = grossRevenue - totalExpenses;

    // Payment methods breakdown
    const methods = { Tunai: 0, QRIS: 0, Transfer: 0 };
    todayTransactions.forEach(t => {
        if (methods[t.paymentMethod] !== undefined) {
            methods[t.paymentMethod] += t.total;
        }
    });

    // Best selling items today
    const itemSales = {};
    todayTransactions.forEach(t => {
        t.items.forEach(item => {
            itemSales[item.name] = (itemSales[item.name] || 0) + item.quantity;
        });
    });

    const sortedItems = Object.entries(itemSales).sort((a, b) => b[1] - a[1]);
    const itemsHtml = sortedItems.map(([name, qty]) => `
        <div class="receipt-total-row">
            <span>${name}</span>
            <span>${qty} porsi</span>
        </div>
    `).join('') || '<div class="text-center text-muted" style="font-size:0.75rem; padding:4px;">Belum ada menu terjual</div>';

    const paper = document.getElementById('receipt-paper-content');
    const zReportHtml = `
        <div class="receipt-header">
            <div class="receipt-logo-emoji" style="font-size: 2.2rem; margin-bottom: 4px;">📊</div>
            <div class="receipt-shop-name">Z-REPORT HARIAN</div>
            <div class="receipt-shop-name">${state.settings.name}</div>
            <div class="receipt-shop-address">Tutup Buku & Kas Harian</div>
        </div>
        <div class="receipt-meta">
            <div class="receipt-meta-row">
                <span>Tanggal:</span>
                <span>${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="receipt-meta-row">
                <span>Operator:</span>
                <span>Pak Asyari (Owner)</span>
            </div>
            <div class="receipt-meta-row">
                <span>Total Struk:</span>
                <span>${todayTransactions.length} Transaksi</span>
            </div>
        </div>
        <div class="receipt-items-list">
            <div style="font-weight: bold; margin-bottom: 6px; border-bottom: 1px dashed #000; padding-bottom: 2px;">RINGKASAN KEUANGAN</div>
            <div class="receipt-total-row">
                <span>Pendapatan Kotor:</span>
                <span>${formatCurrency(grossRevenue)}</span>
            </div>
            <div class="receipt-total-row text-danger">
                <span>Total Diskon:</span>
                <span>-${formatCurrency(totalDiscounts)}</span>
            </div>
            <div class="receipt-total-row">
                <span>Total Pajak:</span>
                <span>${formatCurrency(totalTaxes)}</span>
            </div>
            <div class="receipt-total-row text-danger" style="border-bottom: 1px dashed #000; padding-bottom: 4px; margin-bottom: 4px;">
                <span>Total Pengeluaran:</span>
                <span>-${formatCurrency(totalExpenses)}</span>
            </div>
            <div class="receipt-total-row grand-total" style="font-size: 0.9rem; font-weight: bold;">
                <span>KEUNTUNGAN BERSIH:</span>
                <span>${formatCurrency(netProfit)}</span>
            </div>
        </div>
        <div class="receipt-items-list">
            <div style="font-weight: bold; margin-bottom: 6px; border-bottom: 1px dashed #000; padding-bottom: 2px;">METODE PEMBAYARAN</div>
            <div class="receipt-total-row">
                <span>Tunai:</span>
                <span>${formatCurrency(methods.Tunai)}</span>
            </div>
            <div class="receipt-total-row">
                <span>QRIS:</span>
                <span>${formatCurrency(methods.QRIS)}</span>
            </div>
            <div class="receipt-total-row">
                <span>Transfer:</span>
                <span>${formatCurrency(methods.Transfer)}</span>
            </div>
        </div>
        <div class="receipt-items-list">
            <div style="font-weight: bold; margin-bottom: 6px; border-bottom: 1px dashed #000; padding-bottom: 2px;">MENU TERJUAL HARI INI</div>
            ${itemsHtml}
        </div>
        <div class="receipt-footer">
            <div class="receipt-thankyou">Laporan Resmi Kasir</div>
            <div>Dicetak pada: ${new Date().toLocaleTimeString('id-ID')}</div>
        </div>
    `;

    paper.innerHTML = zReportHtml;

    // Sync to Hidden Print Area
    const printArea = document.getElementById('print-receipt-area');
    printArea.innerHTML = zReportHtml;

    // Show Modal
    const modal = document.getElementById('receipt-modal');
    modal.classList.add('open');

    // Bind printing trigger
    const printBtn = document.getElementById('btn-print-receipt-action');
    const newPrintBtn = printBtn.cloneNode(true);
    printBtn.parentNode.replaceChild(newPrintBtn, printBtn);
    newPrintBtn.addEventListener('click', () => {
        window.print();
    });

    showToast('Laporan Z-Report berhasil dibuat!', 'success');
}

// ==========================================================================
// FEATURE 3: SIMPLE STOCK INVENTORY CONTROL
// ==========================================================================
let stockSearchQuery = '';
let stockEventsInitialized = false;

function initMenuMgmtSubtabs() {
    const subtabs = document.querySelectorAll('.sub-nav-btn');
    const subpanels = document.querySelectorAll('.sub-screen-panel');

    subtabs.forEach(btn => {
        btn.addEventListener('click', () => {
            subtabs.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');

            const target = btn.getAttribute('data-subtab');
            subpanels.forEach(panel => panel.classList.remove('active'));
            document.getElementById(`subscreen-${target}`).classList.add('active');

            if (target === 'menu-list') {
                renderMenuManagementTable();
            } else {
                renderStockTable();
                if (!stockEventsInitialized) {
                    initStockEvents();
                    stockEventsInitialized = true;
                }
            }
        });
    });
}

function renderStockTable() {
    const tbody = document.getElementById('stock-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filtered = state.ingredients.filter(ing =>
        ing.name.toLowerCase().includes(stockSearchQuery.toLowerCase())
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">Bahan baku tidak ditemukan.</td>
            </tr>
        `;
        return;
    }

    filtered.forEach(ing => {
        const isLow = ing.qty <= ing.minQty;
        const isOut = ing.qty === 0;
        let badgeClass = 'badge-success';
        let statusText = 'Aman';

        if (isOut) {
            badgeClass = 'badge-danger';
            statusText = 'Habis';
        } else if (isLow) {
            badgeClass = 'badge-warning';
            statusText = 'Menipis';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${ing.name}</strong></td>
            <td><strong>${ing.qty}</strong></td>
            <td><span class="badge badge-info">${ing.unit}</span></td>
            <td>${ing.minQty}</td>
            <td><span class="badge ${badgeClass}">${statusText}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon edit-action" title="Ubah Bahan" onclick="openEditStockModal('${ing.id}')">
                        <i data-lucide="edit-3"></i>
                    </button>
                    <button class="btn-icon delete-action" title="Hapus Bahan" onclick="deleteStockItem('${ing.id}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function initStockEvents() {
    // Search input
    document.getElementById('stock-search').addEventListener('input', (e) => {
        stockSearchQuery = e.target.value;
        renderStockTable();
    });

    // Add Stock trigger
    document.getElementById('btn-add-stock-item').addEventListener('click', () => {
        openAddStockModal();
    });

    // Close Modal triggers
    const closeModal = () => {
        document.getElementById('stock-item-modal').classList.remove('open');
    };
    document.getElementById('stock-modal-close').addEventListener('click', closeModal);
    document.getElementById('stock-modal-cancel').addEventListener('click', closeModal);

    // Form submit
    document.getElementById('stock-item-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveStockItem();
    });
}

function openAddStockModal() {
    document.getElementById('stock-modal-title').textContent = 'Tambah Bahan Baku';
    document.getElementById('stock-form-id').value = '';
    document.getElementById('stock-form-name').value = '';
    document.getElementById('stock-form-qty').value = '';
    document.getElementById('stock-form-unit').value = 'porsi';
    document.getElementById('stock-form-min').value = '5';

    document.getElementById('stock-item-modal').classList.add('open');
    document.getElementById('stock-form-name').focus();
}

window.openEditStockModal = function (id) {
    const ing = state.ingredients.find(i => i.id === id);
    if (!ing) return;

    document.getElementById('stock-modal-title').textContent = 'Ubah Bahan Baku';
    document.getElementById('stock-form-id').value = ing.id;
    document.getElementById('stock-form-name').value = ing.name;
    document.getElementById('stock-form-qty').value = ing.qty;
    document.getElementById('stock-form-unit').value = ing.unit;
    document.getElementById('stock-form-min').value = ing.minQty;

    document.getElementById('stock-item-modal').classList.add('open');
    document.getElementById('stock-form-qty').focus();
};

function saveStockItem() {
    const id = document.getElementById('stock-form-id').value;
    const name = document.getElementById('stock-form-name').value.trim();
    const qty = Number(document.getElementById('stock-form-qty').value);
    const unit = document.getElementById('stock-form-unit').value.trim();
    const minQty = Number(document.getElementById('stock-form-min').value);

    if (!name || qty < 0 || !unit || minQty < 0) {
        showToast('Form tidak valid!', 'error');
        return;
    }

    if (id) {
        const index = state.ingredients.findIndex(i => i.id === id);
        if (index !== -1) {
            state.ingredients[index] = { id, name, qty, unit, minQty };
            showToast(`Bahan baku ${name} berhasil diperbarui!`, 'success');
        }
    } else {
        const newId = `ing-${Date.now()}`;
        state.ingredients.push({ id: newId, name, qty, unit, minQty });
        showToast(`Bahan baku ${name} berhasil ditambahkan!`, 'success');
    }

    storage.saveIngredients();
    document.getElementById('stock-item-modal').classList.remove('open');
    renderStockTable();
}

window.deleteStockItem = function (id) {
    const ing = state.ingredients.find(i => i.id === id);
    if (!ing) return;

    if (confirm(`Apakah Anda yakin ingin menghapus bahan baku "${ing.name}"?`)) {
        state.ingredients = state.ingredients.filter(i => i.id !== id);
        storage.saveIngredients();
        renderStockTable();
        showToast(`Bahan baku ${ing.name} telah dihapus.`, 'warning');
    }
};

// ==========================================
// FEATURE 2: EXPENSE TRACKER (PENGELUARAN)
// ==========================================
let expenseSearchQuery = '';
let expenseCategoryFilter = 'all';

function renderExpensesTable() {
    const tbody = document.getElementById('expenses-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filtered = state.expenses.filter(exp => {
        const matchesCategory = expenseCategoryFilter === 'all' || exp.category === expenseCategoryFilter;
        const matchesSearch = exp.title.toLowerCase().includes(expenseSearchQuery.toLowerCase()) ||
            exp.notes.toLowerCase().includes(expenseSearchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">Belum ada catatan pengeluaran.</td>
            </tr>
        `;
        return;
    }

    filtered.forEach(exp => {
        const dateFormatted = new Date(exp.date).toLocaleString('id-ID', {
            month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
        });

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dateFormatted}</td>
            <td><strong>${exp.title}</strong></td>
            <td><span class="badge badge-warning">${exp.category}</span></td>
            <td><strong>${formatCurrency(exp.amount)}</strong></td>
            <td><small>${exp.notes || '-'}</small></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon edit-action" title="Ubah Pengeluaran" onclick="openEditExpenseModal('${exp.id}')">
                        <i data-lucide="edit-3"></i>
                    </button>
                    <button class="btn-icon delete-action" title="Hapus Pengeluaran" onclick="deleteExpense('${exp.id}')">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function initExpensesEvents() {
    // Search input
    document.getElementById('expense-search').addEventListener('input', (e) => {
        expenseSearchQuery = e.target.value;
        renderExpensesTable();
    });

    // Category filter
    document.getElementById('expense-filter-category').addEventListener('change', (e) => {
        expenseCategoryFilter = e.target.value;
        renderExpensesTable();
    });

    // Add Expense Trigger
    document.getElementById('btn-add-expense').addEventListener('click', () => {
        openAddExpenseModal();
    });

    // Modal close triggers
    const closeModal = () => {
        document.getElementById('expense-item-modal').classList.remove('open');
    };
    document.getElementById('expense-modal-close').addEventListener('click', closeModal);
    document.getElementById('expense-modal-cancel').addEventListener('click', closeModal);

    // Form submit
    document.getElementById('expense-item-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveExpense();
    });
}

function openAddExpenseModal() {
    document.getElementById('expense-modal-title').textContent = 'Tambah Pengeluaran Baru';
    document.getElementById('expense-form-id').value = '';
    document.getElementById('expense-form-title').value = '';
    document.getElementById('expense-form-amount').value = '';
    document.getElementById('expense-form-category').value = 'Bahan Baku';
    document.getElementById('expense-form-notes').value = '';

    document.getElementById('expense-item-modal').classList.add('open');
    document.getElementById('expense-form-title').focus();
}

window.openEditExpenseModal = function (id) {
    const exp = state.expenses.find(e => e.id === id);
    if (!exp) return;

    document.getElementById('expense-modal-title').textContent = 'Ubah Catatan Pengeluaran';
    document.getElementById('expense-form-id').value = exp.id;
    document.getElementById('expense-form-title').value = exp.title;
    document.getElementById('expense-form-amount').value = exp.amount;
    document.getElementById('expense-form-category').value = exp.category;
    document.getElementById('expense-form-notes').value = exp.notes || '';

    document.getElementById('expense-item-modal').classList.add('open');
    document.getElementById('expense-form-amount').focus();
};

function saveExpense() {
    const id = document.getElementById('expense-form-id').value;
    const title = document.getElementById('expense-form-title').value.trim();
    const amount = Number(document.getElementById('expense-form-amount').value);
    const category = document.getElementById('expense-form-category').value;
    const notes = document.getElementById('expense-form-notes').value.trim();

    if (!title || amount <= 0) {
        showToast('Form pengeluaran tidak valid!', 'error');
        return;
    }

    if (id) {
        const index = state.expenses.findIndex(e => e.id === id);
        if (index !== -1) {
            const expDate = state.expenses[index].date; // preserve original date
            state.expenses[index] = { id, title, date: expDate, amount, category, notes };
            showToast('Pengeluaran berhasil diperbarui!', 'success');
        }
    } else {
        const newId = `exp-${Date.now()}`;
        state.expenses.unshift({ id: newId, title, date: new Date().toISOString(), amount, category, notes });
        showToast('Pengeluaran berhasil dicatat!', 'success');
    }

    storage.saveExpenses();
    document.getElementById('expense-item-modal').classList.remove('open');

    renderExpensesTable();
    updateDashboard();
}

window.deleteExpense = function (id) {
    const exp = state.expenses.find(e => e.id === id);
    if (!exp) return;

    if (confirm(`Apakah Anda yakin ingin menghapus catatan pengeluaran "${exp.title}"?`)) {
        state.expenses = state.expenses.filter(e => e.id !== id);
        storage.saveExpenses();
        renderExpensesTable();
        updateDashboard();
        showToast(`Catatan pengeluaran ${exp.title} telah dihapus.`, 'warning');
    }
};

// ==========================================
// FEATURE 4: DASHBOARD CHART EVENTS BINDING
// ==========================================
function initChartEvents() {
    const tabs = document.querySelectorAll('#chart-trend-selectors .chart-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentChartPeriod = tab.getAttribute('data-period');

            // Update titles
            const mainTitle = document.getElementById('chart-main-title');
            const subTitle = document.getElementById('chart-sub-title');
            if (currentChartPeriod === 'today') {
                mainTitle.textContent = 'Tren Penjualan Hari Ini';
                subTitle.textContent = 'Grafik jam-ke-jam';
            } else if (currentChartPeriod === 'week') {
                mainTitle.textContent = 'Tren Penjualan 7 Hari Terakhir';
                subTitle.textContent = 'Grafik harian';
            } else {
                mainTitle.textContent = 'Tren Penjualan Bulan Ini';
                subTitle.textContent = 'Grafik mingguan';
            }

            renderDashboardSalesChart();
        });
    });
}
