import {
  renderFooter,
  renderMobileBottomBar,
  renderModalsAndDrawers,
  renderNavbar,
} from './components.js';
import { store } from './store.js';
import { buildWhatsAppCheckoutUrl } from './utils.js';
import {
  renderAboutView,
  renderAdminView,
  renderArticlesView,
  renderCartView,
  renderCatalogView,
  renderHomeView,
  renderLoginView,
  renderMapView,
  renderOperatorView,
  renderReviewsView,
} from './views.js';

const BEE_FACTS = [
  '100% Nektar Hutan: Lebah menghisap sari bunga pohon sialang tanpa tambahan pakan gula.',
  'Panen Lestari: Pemetik hanya memotong kepala madu matang agar koloni lebah tetap lestari.',
  'Saring Dingin: Enzim diastase dan bee pollen alami tetap utuh tanpa pemanasan pabrik.',
  'Suhu Ruang: Madu murni cukup disimpan di tempat teduh tanpa perlu masuk kulkas.',
];

let logoClickTimestamps = [];
let beeFactCounter = 0;

function getPathname() {
  return window.location.pathname || '/';
}

export function navigateTo(path, replace = false) {
  if (replace) {
    window.history.replaceState({}, '', path);
  } else {
    window.history.pushState({}, '', path);
  }
  window.scrollTo(0, 0);
  renderApp();
}

function renderCurrentRoute(pathname) {
  const state = store.getState();

  if (pathname === '/produk') return renderCatalogView();
  if (pathname === '/ulasan') return renderReviewsView();
  if (pathname === '/peta') return renderMapView();
  if (pathname === '/keranjang') return renderCartView();
  if (pathname === '/tentang') return renderAboutView();
  if (pathname === '/artikel') return renderArticlesView(null);
  if (pathname.startsWith('/artikel/')) {
    const slug = pathname.replace('/artikel/', '');
    return renderArticlesView(slug);
  }

  if (pathname === '/login' || pathname === '/admin/login') {
    if (state.authRole === 'admin') {
      window.history.replaceState({}, '', '/admin');
      return renderAdminView();
    }
    if (state.authRole === 'operator') {
      window.history.replaceState({}, '', '/operator');
      return renderOperatorView();
    }
    return renderLoginView();
  }

  if (pathname === '/operator') {
    if (state.authRole !== 'operator' && state.authRole !== 'admin') {
      window.history.replaceState({}, '', '/login');
      return renderLoginView();
    }
    return renderOperatorView();
  }

  if (pathname === '/admin') {
    if (state.authRole !== 'admin') {
      if (state.authRole === 'operator') {
        window.history.replaceState({}, '', '/operator');
        return renderOperatorView();
      }
      window.history.replaceState({}, '', '/login');
      return renderLoginView();
    }
    return renderAdminView();
  }

  return renderHomeView();
}

export function renderApp() {
  const appEl = document.getElementById('app');
  if (!appEl) return;
  const pathname = getPathname();

  appEl.innerHTML = `
    <div id="flying-bee-cursor" aria-hidden="true" class="pointer-events-none fixed left-0 top-0 z-50 hidden scene-anim-on will-change-transform">
      <svg width="32" height="28" viewBox="0 0 48 42" fill="none">
        <ellipse cx="20" cy="11" rx="7" ry="10" fill="#F8F8F0" stroke="#463721" stroke-width="2" class="bee-wing" />
        <ellipse cx="28" cy="12" rx="6" ry="8.5" fill="#F8F8F0" stroke="#463721" stroke-width="2" class="bee-wing" />
        <ellipse cx="24" cy="24" rx="14" ry="9.5" fill="#FFE386" stroke="#463721" stroke-width="2.2" />
        <path d="M19 15 V33 M26 15 V33" stroke="#463721" stroke-width="3" />
      </svg>
    </div>
    <div class="flex min-h-screen flex-col">
      ${renderNavbar(pathname)}
      <main id="main-content" class="flex-1">
        ${renderCurrentRoute(pathname)}
      </main>
      ${renderFooter()}
      ${renderMobileBottomBar(pathname)}
      ${renderModalsAndDrawers()}
    </div>
  `;

  appEl.querySelectorAll('img.smart-img').forEach((img) => {
    img.addEventListener(
      'error',
      () => {
        const fb = img.getAttribute('data-fallback') || '/images/photo-raw-honey.jpg';
        if (img.getAttribute('src') !== fb) {
          img.setAttribute('src', fb);
        }
      },
      { once: true }
    );
  });
}

function advanceBeeOpener(deltaPercent) {
  const state = store.getState();
  if (state.openerDone || getPathname() !== '/') return;

  const next = Math.min(100, Math.max(0, state.openerProgress + deltaPercent));
  state.openerProgress = next;

  const counterEl = document.getElementById('bee-opener-counter');
  const rectEl = document.getElementById('bee-fill-rect');
  const emblemEl = document.getElementById('bee-opener-emblem');
  const overlayEl = document.getElementById('bee-opener-overlay');

  if (counterEl) {
    counterEl.textContent = String(Math.round(next)).padStart(3, '0');
  }
  if (rectEl) {
    const ratio = next / 100;
    rectEl.setAttribute('y', String(160 - ratio * 160));
    rectEl.setAttribute('height', String(ratio * 160 + 4));
  }

  window.scrollTo(0, 0);

  if (next >= 100) {
    if (emblemEl) {
      emblemEl.style.transform = 'scale(22)';
    }
    if (overlayEl) {
      overlayEl.style.opacity = '0';
      overlayEl.style.pointerEvents = 'none';
    }
    window.setTimeout(() => {
      store.setUI({ openerDone: true, openerProgress: 100 });
      window.scrollTo(0, 0);
    }, 320);
  }
}

function setupGlobalEvents() {
  window.addEventListener(
    'wheel',
    (e) => {
      const state = store.getState();
      if (!state.openerDone && getPathname() === '/' && e.deltaY > 0) {
        e.preventDefault();
        advanceBeeOpener(Math.max(18, Math.min(45, e.deltaY * 0.32)));
      }
    },
    { passive: false }
  );

  window.addEventListener(
    'scroll',
    () => {
      const state = store.getState();
      if (!state.openerDone && getPathname() === '/' && window.scrollY > 10) {
        advanceBeeOpener(100);
      }
    },
    { passive: true }
  );

  let mouseX = -100;
  let mouseY = -100;
  window.addEventListener(
    'mousemove',
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const beeEl = document.getElementById('flying-bee-cursor');
      if (beeEl) {
        beeEl.classList.remove('hidden');
        beeEl.style.transform = `translate3d(${mouseX + 14}px, ${mouseY + 12}px, 0)`;
      }
    },
    { passive: true }
  );

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const actionEl = target.closest('[data-action]');
    if (actionEl) {
      const action = actionEl.getAttribute('data-action');

      if (action === 'skip-bee-opener') {
        advanceBeeOpener(100);
        return;
      }
      if (action === 'toggle-theme') {
        store.toggleTheme();
        return;
      }
      if (action === 'open-cart') {
        store.setUI({ isCartOpen: true });
        return;
      }
      if (action === 'close-cart') {
        store.setUI({ isCartOpen: false });
        return;
      }
      if (action === 'close-cart-backdrop' && target.id === 'cart-drawer-backdrop') {
        store.setUI({ isCartOpen: false });
        return;
      }
      if (action === 'toggle-mobile-menu') {
        const panel = document.getElementById('mobile-nav-panel');
        if (panel) {
          const isHidden = panel.classList.toggle('hidden');
          actionEl.setAttribute('aria-expanded', String(!isHidden));
        }
        return;
      }
      if (action === 'open-product-modal') {
        const pid = actionEl.getAttribute('data-product-id');
        store.setUI({ selectedProductId: pid });
        return;
      }
      if (action === 'close-product-modal') {
        store.setUI({ selectedProductId: null });
        return;
      }
      if (action === 'close-product-modal-backdrop' && target.id === 'product-detail-modal') {
        store.setUI({ selectedProductId: null });
        return;
      }
      if (action === 'add-to-cart' || action === 'modal-add-cart') {
        const pid = actionEl.getAttribute('data-product-id');
        if (pid) {
          store.setUI({ selectedProductId: null });
          store.addToCart(pid, 1);
        }
        return;
      }
      if (action === 'cart-inc') {
        const pid = actionEl.getAttribute('data-product-id');
        const item = store.getState().cart.find((i) => i.productId === pid);
        if (item) store.updateCartQty(pid, item.quantity + 1);
        return;
      }
      if (action === 'cart-dec') {
        const pid = actionEl.getAttribute('data-product-id');
        const item = store.getState().cart.find((i) => i.productId === pid);
        if (item) store.updateCartQty(pid, item.quantity - 1);
        return;
      }
      if (action === 'cart-remove') {
        const pid = actionEl.getAttribute('data-product-id');
        if (pid) store.removeFromCart(pid);
        return;
      }
      if (action === 'clear-cart') {
        store.clearCart();
        return;
      }
      if (action === 'record-wa-order') {
        const nameInput = document.getElementById('wa-buyer-name');
        const notesInput = document.getElementById('wa-buyer-notes');
        const cName = nameInput ? nameInput.value : '';
        const cNotes = notesInput ? notesInput.value : '';
        store.createOrderFromCart(cName, cNotes);
        return;
      }
      if (action === 'harvest-scoop') {
        const st = store.getState();
        const next = st.harvestJarPercent >= 100 ? 25 : Math.min(100, st.harvestJarPercent + 25);
        store.setUI({
          harvestJarPercent: next,
          harvestBubble:
            next === 100
              ? 'Stoples terisi penuh 100% madu murni. Siap dimasukkan ke keranjang!'
              : `Madu segar mengalir dari sarang pohon... (${next}% terisi)`,
        });
        return;
      }
      if (action === 'bee-fact') {
        const fact = BEE_FACTS[beeFactCounter % BEE_FACTS.length];
        beeFactCounter += 1;
        store.setUI({ harvestBubble: fact });
        return;
      }
      if (action === 'toggle-harvest-sky') {
        const st = store.getState();
        store.setUI({ harvestSkyMood: st.harvestSkyMood === 'pagi' ? 'senja' : 'pagi' });
        return;
      }
      if (action === 'toggle-harvest-pause') {
        const st = store.getState();
        store.setUI({ harvestAnimPaused: !st.harvestAnimPaused });
        return;
      }
      if (action === 'set-map-layer') {
        const layer = actionEl.getAttribute('data-layer') || 'toko';
        store.setUI({ activeMapLayer: layer });
        return;
      }
      if (action === 'toggle-map-pause') {
        const st = store.getState();
        store.setUI({ mapAnimPaused: !st.mapAnimPaused });
        return;
      }
      if (action === 'filter-category') {
        const cat = actionEl.getAttribute('data-category') || 'Semua';
        store.setUI({ catalogCategory: cat });
        return;
      }
      if (action === 'reset-catalog-filter') {
        store.setUI({ catalogCategory: 'Semua', catalogSearch: '' });
        return;
      }
      if (action === 'autofill-login') {
        const u = actionEl.getAttribute('data-user') || 'admin';
        const p = actionEl.getAttribute('data-pass') || 'admin';
        const uInput = document.getElementById('login-username');
        const pInput = document.getElementById('login-password');
        if (uInput) uInput.value = u;
        if (pInput) pInput.value = p;
        return;
      }
      if (action === 'logout-role') {
        store.logoutRole();
        navigateTo('/login');
        return;
      }
      if (action === 'operator-order-status') {
        const oid = actionEl.getAttribute('data-order-id');
        const st = actionEl.getAttribute('data-status');
        if (oid && st) {
          store.updateOrderStatus(oid, st);
          store.notify(`Status pesanan ${oid} diubah menjadi "${st}".`);
        }
        return;
      }
      if (action === 'stock-delta') {
        const pid = actionEl.getAttribute('data-product-id');
        const delta = Number(actionEl.getAttribute('data-delta') || 0);
        if (pid && delta) {
          store.adjustProductStock(pid, delta);
        }
        return;
      }
      if (action === 'admin-tab') {
        const tab = actionEl.getAttribute('data-tab') || 'ringkasan';
        store.setUI({ adminTab: tab, editingArticleId: '' });
        return;
      }
      if (action === 'open-new-item-tab') {
        store.setUI({ adminTab: 'produk' });
        return;
      }
      if (action === 'open-new-news-tab') {
        store.setUI({ adminTab: 'artikel', editingArticleId: '' });
        return;
      }
      if (action === 'pick-art-preset') {
        const url = actionEl.getAttribute('data-url') || '/images/photo-raw-honey.jpg';
        const hiddenInput = document.getElementById('pf-image');
        if (hiddenInput) hiddenInput.value = url;
        document.querySelectorAll('.art-preset-btn').forEach((btn) => {
          btn.classList.remove('border-[#463721]', 'bg-[#FFE386]', 'text-[#463721]');
        });
        actionEl.classList.add('border-[#463721]', 'bg-[#FFE386]', 'text-[#463721]');
        return;
      }
      if (action === 'pick-news-photo') {
        const url = actionEl.getAttribute('data-url') || '/images/photo-raw-honey.jpg';
        const hiddenInput = document.getElementById('af-image');
        if (hiddenInput) hiddenInput.value = url;
        document.querySelectorAll('.news-photo-btn').forEach((btn) => {
          btn.classList.remove('border-[#463721]', 'bg-[#FFE386]', 'text-[#463721]');
        });
        actionEl.classList.add('border-[#463721]', 'bg-[#FFE386]', 'text-[#463721]');
        return;
      }
      if (action === 'edit-article') {
        const aid = actionEl.getAttribute('data-article-id') || '';
        store.setUI({ adminTab: 'artikel', editingArticleId: aid });
        window.scrollTo(0, 0);
        return;
      }
      if (action === 'cancel-edit-article') {
        store.setUI({ editingArticleId: '' });
        return;
      }
      if (action === 'delete-article') {
        const aid = actionEl.getAttribute('data-article-id');
        if (aid) {
          store.deleteArticle(aid);
          store.notify('Berita / artikel telah dihapus.');
        }
        return;
      }
      if (action === 'set-product-discount') {
        const pid = actionEl.getAttribute('data-product-id');
        const pct = Number(actionEl.getAttribute('data-discount') || 0);
        if (pid) {
          store.setProductDiscount(pid, pct);
          store.notify(
            pct > 0
              ? `Diskon ${pct}% berhasil diaktifkan pada produk tersebut.`
              : 'Diskon dimatikan dan harga dikembalikan ke harga normal.'
          );
        }
        return;
      }
      if (action === 'delete-product') {
        const pid = actionEl.getAttribute('data-product-id');
        if (pid) {
          store.deleteProduct(pid);
          store.notify('Item madu telah dihapus dari katalog.');
        }
        return;
      }
      if (action === 'toggle-article') {
        const aid = actionEl.getAttribute('data-article-id');
        if (aid) {
          store.toggleArticleStatus(aid);
          store.notify('Status publikasi berita diperbarui.');
        }
        return;
      }
      if (action === 'reset-demo-data') {
        store.resetDemoData();
        store.notify('Seluruh data toko madu berhasil dipulihkan ke setelan awal.');
        return;
      }
    }

    const linkEl = target.closest('a[data-link]');
    if (linkEl) {
      const href = linkEl.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        navigateTo(href);
      }
    }
  });

  document.addEventListener('input', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.id === 'catalog-search' && target instanceof HTMLInputElement) {
      store.getState().catalogSearch = target.value;
      const pos = target.selectionStart || target.value.length;
      renderApp();
      const nextInput = document.getElementById('catalog-search');
      if (nextInput instanceof HTMLInputElement) {
        nextInput.focus();
        nextInput.setSelectionRange(pos, pos);
      }
    }

    if (target.id === 'wa-buyer-name' || target.id === 'wa-buyer-notes') {
      const nameEl = document.getElementById('wa-buyer-name');
      const notesEl = document.getElementById('wa-buyer-notes');
      const waLink = document.getElementById('wa-checkout-link');
      if (waLink) {
        const st = store.getState();
        const { detailed } = store.getCartMetrics();
        waLink.setAttribute(
          'href',
          buildWhatsAppCheckoutUrl({
            whatsappNumber: st.settings.whatsappNumber,
            storeName: st.settings.storeName,
            items: detailed.map((d) => ({
              name: d.product.name,
              packContents: d.product.packContents,
              quantity: d.quantity,
              price: d.product.price,
            })),
            customerName: nameEl ? nameEl.value : '',
            deliveryNotes: notesEl ? notesEl.value : '',
          })
        );
      }
    }
  });

  document.addEventListener('change', (e) => {
    const target = e.target;
    if (target instanceof HTMLSelectElement && target.id === 'catalog-sort') {
      store.setUI({ catalogSort: target.value });
    }
  });

  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;

    if (form.id === 'role-login-form') {
      e.preventDefault();
      const u = document.getElementById('login-username')?.value || '';
      const p = document.getElementById('login-password')?.value || '';
      const role = store.loginRole(u, p);
      if (role === 'admin') {
        navigateTo('/admin', true);
      } else if (role === 'operator') {
        navigateTo('/operator', true);
      } else {
        const errBox = document.getElementById('login-error-box');
        if (errBox) {
          errBox.textContent =
            'Kredensial tidak sesuai. Gunakan admin/admin untuk Admin atau operator/operator untuk Operator.';
          errBox.classList.remove('hidden');
        }
      }
      return;
    }

    if (form.id === 'public-review-form') {
      e.preventDefault();
      const name = document.getElementById('rev-name')?.value || '';
      const productName = document.getElementById('rev-product')?.value || '';
      const rating = Number(document.getElementById('rev-rating')?.value || 5);
      const comment = document.getElementById('rev-comment')?.value || '';
      store.addReview({ name, productName, rating, comment });
      store.notify('Terima kasih! Ulasan Anda berhasil ditambahkan ke halaman ulasan.');
      return;
    }

    if (form.id === 'quick-store-name-form') {
      e.preventDefault();
      const val = document.getElementById('quick-store-name')?.value?.trim() || 'Madu';
      store.updateSettings({ storeName: val });
      store.notify(`Nama toko berhasil diubah menjadi "${val}"!`);
      return;
    }

    if (form.id === 'admin-product-form') {
      e.preventDefault();
      const name = document.getElementById('pf-name')?.value?.trim() || 'Madu Baru';
      const category = document.getElementById('pf-category')?.value || 'Madu Hutan Murni';
      const price = Number(document.getElementById('pf-price')?.value || 95000);
      const originalPriceRaw = Number(document.getElementById('pf-original-price')?.value || 0);
      const hasDiscount = originalPriceRaw > price;
      const discountPercent = hasDiscount
        ? Math.round(((originalPriceRaw - price) / originalPriceRaw) * 100)
        : 0;
      const packContents =
        document.getElementById('pf-pack')?.value?.trim() || 'Stoples kaca 350 gram';
      const weightGrams = Number(document.getElementById('pf-weight')?.value || 350);
      const stock = Number(document.getElementById('pf-stock')?.value || 20);
      const image = document.getElementById('pf-image')?.value || '/images/photo-raw-honey.jpg';
      const description =
        document.getElementById('pf-desc')?.value?.trim() || 'Madu murni segar alami.';

      store.saveProduct({
        name,
        category,
        price,
        ...(hasDiscount ? { originalPrice: originalPriceRaw, discountPercent } : {}),
        packContents,
        weightGrams,
        stock,
        isBestSeller: true,
        image,
        fallbackImage: '/images/photo-raw-honey.jpg',
        description,
        servingGuide: ['Konsumsi 1 sampai 2 sendok makan setiap pagi di suhu ruang.'],
      });
      store.notify(`Produk baru "${name}" berhasil dimasukkan ke katalog!`);
      return;
    }

    if (form.id === 'admin-article-form') {
      e.preventDefault();
      const id = document.getElementById('af-id')?.value?.trim() || '';
      const title = document.getElementById('af-title')?.value?.trim() || 'Berita Panen Madu';
      const category = document.getElementById('af-category')?.value?.trim() || 'Kabar Panen';
      const status = document.getElementById('af-status')?.value || 'Terbit';
      const readMinutes = Number(document.getElementById('af-read')?.value || 3);
      const publishedAt = document.getElementById('af-date')?.value || '2026-11-25';
      const image = document.getElementById('af-image')?.value || '/images/photo-raw-honey.jpg';
      const excerpt = document.getElementById('af-excerpt')?.value?.trim() || title;
      const contentRaw = document.getElementById('af-content')?.value || excerpt;
      const paragraphs = contentRaw
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean);

      store.saveArticle({
        id: id || undefined,
        title,
        category,
        status,
        readMinutes,
        publishedAt,
        image,
        excerpt,
        content: paragraphs.length > 0 ? paragraphs : [excerpt],
      });
      store.setUI({ editingArticleId: '' });
      store.notify(
        id
          ? `Berita "${title}" berhasil diperbarui.`
          : `Berita baru "${title}" berhasil ditambahkan!`
      );
      return;
    }

    if (form.id === 'admin-settings-form') {
      e.preventDefault();
      const storeName = document.getElementById('st-name')?.value?.trim() || 'Madu';
      const whatsappNumber = document.getElementById('st-wa')?.value?.trim() || '082236010244';
      const mapsShortUrl =
        document.getElementById('st-map')?.value?.trim() ||
        'https://maps.app.goo.gl/UWcN2zsZndU6gNmc6';
      store.updateSettings({ storeName, whatsappNumber, mapsShortUrl });
      store.notify('Pengaturan nama toko, WhatsApp, dan peta berhasil disimpan.');
      return;
    }

    if (form.id === 'operator-manual-order-form') {
      e.preventDefault();
      const customerName = document.getElementById('op-cust')?.value || '';
      const total = document.getElementById('op-total')?.value || 0;
      const itemsSummary = document.getElementById('op-items')?.value || '';
      const notes = document.getElementById('op-notes')?.value || '';
      store.addManualOrder({ customerName, total, itemsSummary, notes });
      store.notify('Pesanan baru berhasil ditambahkan ke antrean pengemasan.');
      return;
    }

    if (form.id === 'operator-log-form') {
      e.preventDefault();
      const note = document.getElementById('op-log-input')?.value || '';
      store.addOperatorLog(note);
      store.notify('Catatan aktivitas dapur tersimpan.');
      return;
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const st = store.getState();
      if (st.selectedProductId || st.isCartOpen) {
        store.setUI({ selectedProductId: null, isCartOpen: false });
      }
    }
  });

  window.addEventListener('popstate', () => {
    renderApp();
  });
}

store.subscribe(() => {
  renderApp();
});

setupGlobalEvents();
renderApp();
