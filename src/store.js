import {
  INITIAL_ARTICLES,
  INITIAL_CATEGORIES,
  INITIAL_OPERATOR_LOGS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
} from './data.js';
import { slugify } from './utils.js';

const KEYS = {
  products: 'maduahay_v2_products',
  categories: 'maduahay_v2_categories',
  articles: 'maduahay_v2_articles',
  reviews: 'maduahay_v2_reviews',
  orders: 'maduahay_v2_orders',
  operatorLogs: 'maduahay_v2_operator_logs',
  settings: 'maduahay_v2_settings',
  cart: 'maduahay_v2_cart',
  authRole: 'maduahay_v2_auth_role',
  theme: 'maduahay_v2_theme',
};

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') return;
  try {
    // shortcut: localStorage ~5MB quota per origin, upgrade to server DB when deployed multi-device
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors safely
  }
}

const state = {
  products: readStorage(KEYS.products, INITIAL_PRODUCTS),
  categories: readStorage(KEYS.categories, INITIAL_CATEGORIES),
  articles: readStorage(KEYS.articles, INITIAL_ARTICLES),
  reviews: readStorage(KEYS.reviews, INITIAL_REVIEWS),
  orders: readStorage(KEYS.orders, INITIAL_ORDERS),
  operatorLogs: readStorage(KEYS.operatorLogs, INITIAL_OPERATOR_LOGS),
  settings: readStorage(KEYS.settings, INITIAL_SETTINGS),
  cart: readStorage(KEYS.cart, []),
  // authRole: 'guest' | 'operator' | 'admin'
  authRole: readStorage(KEYS.authRole, 'guest'),
  theme: readStorage(KEYS.theme, 'light'),
  isCartOpen: false,
  selectedProductId: null,
  // Opener state: starts at 0% on first load, unlocks Homepage at scrollY=0 once 100%
  openerProgress: 0,
  openerDone: false,
  // UI transient states
  catalogCategory: 'Semua',
  catalogSearch: '',
  catalogSort: 'featured',
  articleSearch: '',
  activeMapLayer: 'toko',
  mapAnimPaused: false,
  harvestJarPercent: 50,
  harvestSkyMood: 'pagi',
  harvestAnimPaused: false,
  harvestBubble:
    'Klik sarang lebah di dahan pohon atau tombol "Teteskan Madu" untuk memanen ke stoples.',
  adminTab: 'ringkasan',
  operatorTab: 'pesanan',
  reviewFilter: 'Semua',
  editingArticleId: '',
  bannerNotice: '',
};

const listeners = new Set();

function persist() {
  writeStorage(KEYS.products, state.products);
  writeStorage(KEYS.categories, state.categories);
  writeStorage(KEYS.articles, state.articles);
  writeStorage(KEYS.reviews, state.reviews);
  writeStorage(KEYS.orders, state.orders);
  writeStorage(KEYS.operatorLogs, state.operatorLogs);
  writeStorage(KEYS.settings, state.settings);
  writeStorage(KEYS.cart, state.cart);
  writeStorage(KEYS.authRole, state.authRole);
  writeStorage(KEYS.theme, state.theme);
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', state.theme);
    document.title = `${state.settings.storeName}: ${state.settings.tagline}`;
  }
}

function emit() {
  persist();
  listeners.forEach((fn) => fn(state));
}

export const store = {
  getState() {
    return state;
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  setUI(patch) {
    Object.assign(state, patch);
    emit();
  },

  notify(msg) {
    state.bannerNotice = msg;
    emit();
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        if (state.bannerNotice === msg) {
          state.bannerNotice = '';
          emit();
        }
      }, 4000);
    }
  },

  toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    emit();
  },

  getCartMetrics() {
    let count = 0;
    let total = 0;
    const detailed = [];
    for (const item of state.cart) {
      const product = state.products.find((p) => p.id === item.productId);
      if (product) {
        count += item.quantity;
        const subtotal = product.price * item.quantity;
        total += subtotal;
        detailed.push({ product, quantity: item.quantity, subtotal });
      }
    }
    return { count, total, detailed };
  },

  addToCart(productId, qty = 1) {
    const target = state.products.find((p) => p.id === productId);
    if (!target || target.stock <= 0) return;
    const existing = state.cart.find((item) => item.productId === productId);
    if (existing) {
      existing.quantity = Math.min(target.stock, existing.quantity + qty);
    } else {
      state.cart.push({
        productId,
        quantity: Math.min(target.stock, Math.max(1, qty)),
      });
    }
    state.isCartOpen = true;
    emit();
  },

  updateCartQty(productId, qty) {
    const target = state.products.find((p) => p.id === productId);
    const maxStock = target ? target.stock : 99;
    if (qty <= 0) {
      state.cart = state.cart.filter((item) => item.productId !== productId);
    } else {
      state.cart = state.cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(maxStock, qty) }
          : item
      );
    }
    emit();
  },

  removeFromCart(productId) {
    state.cart = state.cart.filter((item) => item.productId !== productId);
    emit();
  },

  clearCart() {
    state.cart = [];
    emit();
  },

  createOrderFromCart(customerName, deliveryNotes) {
    const { detailed, total } = this.getCartMetrics();
    if (detailed.length === 0) return null;
    const summary = detailed
      .map((d) => `${d.quantity}x ${d.product.name}`)
      .join(', ');
    const newOrder = {
      id: `ORD-${Math.floor(100 + Math.random() * 899)}`,
      customerName: (customerName || '').trim() || 'Pelanggan Website',
      itemsSummary: summary,
      total,
      notes: (deliveryNotes || '').trim() || 'Pesanan dari keranjang website.',
      status: 'Baru Masuk',
      createdAt: 'Baru saja',
    };
    state.orders = [newOrder, ...state.orders];
    emit();
    return newOrder;
  },

  // Role Login: Supports 'admin' (admin/admin) and 'operator' (operator/operator)
  loginRole(username, password) {
    const u = String(username || '').trim().toLowerCase();
    const p = String(password || '');
    // shortcut: client-side demo credentials for Admin and Operator roles, upgrade to backend JWT in production
    if (u === 'admin' && p === 'admin') {
      state.authRole = 'admin';
      emit();
      return 'admin';
    }
    if (u === 'operator' && p === 'operator') {
      state.authRole = 'operator';
      emit();
      return 'operator';
    }
    return null;
  },

  logoutRole() {
    state.authRole = 'guest';
    emit();
  },

  // Operator & Admin Actions
  updateOrderStatus(orderId, nextStatus) {
    state.orders = state.orders.map((o) =>
      o.id === orderId ? { ...o, status: nextStatus } : o
    );
    state.operatorLogs = [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        actor: state.authRole === 'admin' ? 'Admin' : 'Operator',
        note: `Status pesanan ${orderId} diperbarui menjadi "${nextStatus}".`,
      },
      ...state.operatorLogs,
    ];
    emit();
  },

  addManualOrder(input) {
    const newOrder = {
      id: `ORD-${Math.floor(100 + Math.random() * 899)}`,
      customerName: input.customerName.trim() || 'Pelanggan Walk-In',
      itemsSummary: input.itemsSummary.trim(),
      total: Math.max(0, Number(input.total) || 0),
      notes: input.notes.trim() || 'Input dari panel operator',
      status: 'Baru Masuk',
      createdAt: 'Baru saja',
    };
    state.orders = [newOrder, ...state.orders];
    state.operatorLogs = [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        actor: state.authRole === 'admin' ? 'Admin' : 'Operator',
        note: `Mencatat pesanan baru ${newOrder.id} a.n. ${newOrder.customerName}.`,
      },
      ...state.operatorLogs,
    ];
    emit();
  },

  addOperatorLog(noteText) {
    const clean = String(noteText || '').trim();
    if (!clean) return;
    state.operatorLogs = [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        actor: state.authRole === 'admin' ? 'Admin' : 'Operator Dapur',
        note: clean,
      },
      ...state.operatorLogs,
    ];
    emit();
  },

  adjustProductStock(id, delta) {
    let targetName = '';
    let finalStock = 0;
    state.products = state.products.map((p) => {
      if (p.id === id) {
        targetName = p.name;
        finalStock = Math.max(0, p.stock + delta);
        return { ...p, stock: finalStock };
      }
      return p;
    });
    if (targetName) {
      state.operatorLogs = [
        {
          id: `log-${Date.now()}`,
          time:
            new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) +
            ' WIB',
          actor: state.authRole === 'admin' ? 'Admin' : 'Operator Stok',
          note: `Stok "${targetName}" diubah (${delta > 0 ? '+' + delta : delta}) menjadi ${finalStock} item.`,
        },
        ...state.operatorLogs,
      ];
    }
    emit();
  },

  saveProduct(input) {
    if (input.id) {
      state.products = state.products.map((p) =>
        p.id === input.id ? { ...p, ...input, id: input.id } : p
      );
    } else {
      const newId = `${slugify(input.name)}-${Date.now().toString(36)}`;
      state.products = [{ ...input, id: newId }, ...state.products];
    }
    emit();
  },

  setProductDiscount(id, discountPercent) {
    const pct = Math.max(0, Math.min(80, Math.round(Number(discountPercent) || 0)));
    state.products = state.products.map((p) => {
      if (p.id !== id) return p;
      const basePrice =
        Number(p.originalPrice) > Number(p.price) ? Number(p.originalPrice) : Number(p.price);
      if (pct <= 0) {
        const { originalPrice: _orig, discountPercent: _disc, ...rest } = p;
        return { ...rest, price: basePrice };
      }
      const discountedPrice = Math.max(1000, Math.round((basePrice * (100 - pct)) / 100 / 1000) * 1000);
      return {
        ...p,
        originalPrice: basePrice,
        discountPercent: pct,
        price: discountedPrice,
      };
    });
    emit();
  },

  deleteProduct(id) {
    state.products = state.products.filter((p) => p.id !== id);
    state.cart = state.cart.filter((item) => item.productId !== id);
    emit();
  },

  addCategory(name) {
    const clean = String(name || '').trim();
    if (!clean || state.categories.some((c) => c.toLowerCase() === clean.toLowerCase())) {
      return false;
    }
    state.categories = [...state.categories, clean];
    emit();
    return true;
  },

  deleteCategory(name) {
    if (state.products.some((p) => p.category === name)) return false;
    state.categories = state.categories.filter((c) => c !== name);
    emit();
    return true;
  },

  saveArticle(input) {
    const cleanSlug = slugify(input.slug || input.title) || `artikel-${Date.now()}`;
    if (input.id) {
      state.articles = state.articles.map((a) =>
        a.id === input.id ? { ...a, ...input, id: input.id, slug: cleanSlug } : a
      );
    } else {
      const newId = `art-${Date.now().toString(36)}`;
      state.articles = [{ ...input, id: newId, slug: cleanSlug }, ...state.articles];
    }
    emit();
  },

  toggleArticleStatus(id) {
    state.articles = state.articles.map((a) =>
      a.id === id ? { ...a, status: a.status === 'Terbit' ? 'Draf' : 'Terbit' } : a
    );
    emit();
  },

  deleteArticle(id) {
    state.articles = state.articles.filter((a) => a.id !== id);
    emit();
  },

  updateSettings(next) {
    state.settings = { ...state.settings, ...next };
    emit();
  },

  addReview(input) {
    const cleanName = String(input.name || '').trim() || 'Pelanggan';
    const parts = cleanName.split(/\s+/);
    const initials =
      parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : cleanName.slice(0, 2).toUpperCase();

    const newRev = {
      id: `rev-${Date.now().toString(36)}`,
      initials,
      customerLabel: cleanName,
      productName: input.productName,
      rating: Math.min(5, Math.max(1, Number(input.rating) || 5)),
      comment: String(input.comment || '').trim(),
      isSamplePlaceholder: false,
      dateLabel: new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date()),
    };
    state.reviews = [newRev, ...state.reviews];
    emit();
  },

  resetDemoData() {
    state.products = INITIAL_PRODUCTS;
    state.categories = INITIAL_CATEGORIES;
    state.articles = INITIAL_ARTICLES;
    state.reviews = INITIAL_REVIEWS;
    state.orders = INITIAL_ORDERS;
    state.operatorLogs = INITIAL_OPERATOR_LOGS;
    state.settings = INITIAL_SETTINGS;
    state.cart = [];
    emit();
  },
};

persist();
