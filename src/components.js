import { store } from './store.js';
import {
  buildWhatsAppCheckoutUrl,
  escapeHtml,
  formatDisplayPhone,
  formatRupiah,
} from './utils.js';

const FLAVOUR_ACCENTS = {
  'Madu Hutan Murni': '#D8B863',
  'Madu Bunga Nektar': '#FFE386',
  'Sarang Madu Asli': '#E5C158',
  'Madu Rempah & Lebah': '#C9A959',
  'Paket & Hampers': '#D5C38A',
};

export function kineticLabel(text) {
  const safe = escapeHtml(text);
  return `<span class="vs-kinetic-wrap"><span class="vs-kinetic-text">${safe}</span><span class="vs-kinetic-clone" aria-hidden="true">${safe}</span></span>`;
}

export function renderNavbar(currentPath) {
  const state = store.getState();
  const { count } = store.getCartMetrics();
  const navItems = [
    { to: '/', label: 'Beranda' },
    { to: '/produk', label: 'Katalog Madu' },
    { to: '/ulasan', label: 'Ulasan' },
    { to: '/peta', label: 'Peta Toko' },
    { to: '/artikel', label: 'Berita & Tips' },
    { to: '/tentang', label: 'Cerita Kami' },
  ];

  const linksHtml = navItems
    .map((item) => {
      const active =
        item.to === '/' ? currentPath === '/' : currentPath.startsWith(item.to);
      return `<a href="${item.to}" data-link ${
        active ? 'aria-current="page"' : ''
      } class="group inline-flex min-h-[44px] items-center rounded-[10px] px-3 font-hand text-[19px] no-underline transition-colors ${
        active
          ? 'bg-[#463721] text-[#ECE2B1]'
          : 'text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)]'
      }">${kineticLabel(item.label)}</a>`;
    })
    .join('');

  const loginActionBtn =
    state.authRole === 'admin'
      ? `<a href="/admin" data-link id="top-login-btn" class="inline-flex min-h-[44px] items-center gap-1.5 rounded-[10px] border-2 border-[#463721] bg-[#FFE386] px-3 font-sans text-[13px] font-bold text-[#463721] no-underline transition-colors hover:bg-[#463721] hover:text-[#FFE386] sm:px-3.5 sm:text-[14px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>
          <span>Panel Admin</span>
        </a>`
      : state.authRole === 'operator'
      ? `<a href="/operator" data-link id="top-login-btn" class="inline-flex min-h-[44px] items-center gap-1.5 rounded-[10px] border-2 border-[#463721] bg-[#FFE386] px-3 font-sans text-[13px] font-bold text-[#463721] no-underline transition-colors hover:bg-[#463721] hover:text-[#FFE386] sm:px-3.5 sm:text-[14px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>
          <span>Panel Operator</span>
        </a>`
      : `<a href="/login" data-link id="top-login-btn" class="inline-flex min-h-[44px] items-center gap-1.5 rounded-[10px] border-2 border-[#463721] bg-[#FFE386] px-3 font-sans text-[13px] font-bold text-[#463721] no-underline transition-colors hover:bg-[#463721] hover:text-[#FFE386] sm:px-3.5 sm:text-[14px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>
          <span>Login</span>
        </a>`;

  return `
    <header class="sticky top-0 z-20 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]/95">
      <div class="mx-auto flex min-h-[64px] max-w-[1425px] items-center justify-between gap-2 px-3 sm:px-4 md:min-h-[68px] md:px-7">
        <a href="/" data-link id="brand-logo-link" aria-label="${escapeHtml(
          state.settings.storeName
        )}, kembali ke beranda" class="group inline-flex min-h-[44px] items-center gap-2 py-1 text-[var(--color-ink)] no-underline select-none">
          <svg width="32" height="32" viewBox="0 0 160 160" fill="currentColor" aria-hidden="true" class="shrink-0 transition-transform duration-300 group-hover:scale-105">
            <path d="M74 66 C50 38, 22 44, 26 68 C30 88, 58 84, 74 74 Z" />
            <path d="M86 66 C110 38, 138 44, 134 68 C130 88, 102 84, 86 74 Z" />
            <path d="M52 78 C38 78, 34 94, 48 96 C62 98, 68 84, 52 78 Z" />
            <path d="M108 78 C122 78, 126 94, 112 96 C98 98, 92 84, 108 78 Z" />
            <ellipse cx="80" cy="48" rx="13" ry="11" />
            <rect x="62" y="64" width="36" height="13" rx="6.5" />
            <rect x="58" y="82" width="44" height="14" rx="7" />
            <rect x="63" y="101" width="34" height="13" rx="6.5" />
            <path d="M70 119 H90 L80 136 Z" />
          </svg>
          <span class="font-poster text-[23px] uppercase tracking-tight sm:text-[25px]">${escapeHtml(
            state.settings.storeName
          )}</span>
        </a>

        <nav aria-label="Navigasi Utama" class="hidden items-center gap-1 lg:flex">
          ${linksHtml}
        </nav>

        <div class="flex items-center gap-1.5 sm:gap-2">
          ${loginActionBtn}

          <button type="button" data-action="toggle-theme" aria-label="${
            state.theme === 'light' ? 'Aktifkan mode gelap' : 'Aktifkan mode terang'
          }" aria-pressed="${
    state.theme === 'dark'
  }" class="inline-flex h-[44px] w-[44px] items-center justify-center rounded-[10px] border border-[var(--color-border)]/35 bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)]">
            ${
              state.theme === 'light'
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>`
                : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/></svg>`
            }
          </button>

          <button type="button" data-action="open-cart" aria-label="Buka keranjang madu, ${count} item dipilih" class="inline-flex min-h-[44px] items-center gap-1.5 rounded-[10px] bg-[#463721] px-3 font-hand text-[17px] text-[#ECE2B1] transition-colors hover:bg-[#5E4A2C] sm:px-3.5 sm:text-[18px]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
            <span class="hidden sm:inline">Keranjang</span>
            <span class="inline-flex min-w-[22px] items-center justify-center rounded-full bg-[#FFE386] px-1.5 py-0.5 font-sans text-[11px] font-bold text-[#463721]">${count}</span>
          </button>

          <button type="button" data-action="toggle-mobile-menu" aria-expanded="false" aria-controls="mobile-nav-panel" aria-label="Buka menu navigasi" class="inline-flex min-h-[44px] items-center justify-center rounded-[10px] bg-[#463721] px-3.5 font-hand text-[17px] tracking-wide text-[#ECE2B1] lg:hidden">
            MENU
          </button>
        </div>
      </div>

      <nav id="mobile-nav-panel" aria-label="Navigasi Seluler" class="hidden border-t border-[var(--color-hairline)] bg-[var(--color-surface)] px-4 py-4 lg:hidden">
        <ul class="m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3">
          ${navItems
            .map(
              (item) => `<li><a href="${item.to}" data-link class="flex min-h-[46px] items-center justify-center rounded-[10px] px-3 text-center font-sans text-[14px] font-semibold no-underline ${
                currentPath === item.to
                  ? 'bg-[#463721] text-[#FFE386]'
                  : 'bg-[var(--color-surface-alt)]/55 text-[var(--color-ink)]'
              }">${escapeHtml(item.label)}</a></li>`
            )
            .join('')}
          <li><a href="${
            state.authRole === 'admin'
              ? '/admin'
              : state.authRole === 'operator'
              ? '/operator'
              : '/login'
          }" data-link class="flex min-h-[46px] items-center justify-center rounded-[10px] border-2 border-[#463721] bg-[#FFE386] px-3 text-center font-sans text-[14px] font-bold text-[#463721] no-underline">${
            state.authRole === 'admin'
              ? 'Panel Admin'
              : state.authRole === 'operator'
              ? 'Panel Operator'
              : 'Login Admin / Operator'
          }</a></li>
        </ul>
      </nav>
    </header>
  `;
}

// Sticky Handphone Quick Bottom Bar (Mobile-First E-Commerce UX)
export function renderMobileBottomBar(currentPath) {
  const state = store.getState();
  const { count } = store.getCartMetrics();
  const waHref = buildWhatsAppCheckoutUrl({
    whatsappNumber: state.settings.whatsappNumber,
    storeName: state.settings.storeName,
    items: [],
  });

  return `
    <nav aria-label="Navigasi Cepat Handphone" class="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-[#463721]/25 bg-[var(--color-surface)] px-2 py-1.5 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden">
      <a href="/" data-link class="flex min-h-[44px] flex-1 flex-col items-center justify-center rounded-[8px] px-1 text-[11px] font-semibold no-underline ${
        currentPath === '/' ? 'bg-[#FFE386] text-[#463721]' : 'text-[var(--color-ink)]'
      }">
        <span>Beranda</span>
      </a>
      <a href="/produk" data-link class="flex min-h-[44px] flex-1 flex-col items-center justify-center rounded-[8px] px-1 text-[11px] font-semibold no-underline ${
        currentPath === '/produk' ? 'bg-[#FFE386] text-[#463721]' : 'text-[var(--color-ink)]'
      }">
        <span>Katalog</span>
      </a>
      <a href="/ulasan" data-link class="flex min-h-[44px] flex-1 flex-col items-center justify-center rounded-[8px] px-1 text-[11px] font-semibold no-underline ${
        currentPath === '/ulasan' ? 'bg-[#FFE386] text-[#463721]' : 'text-[var(--color-ink)]'
      }">
        <span>Ulasan</span>
      </a>
      <button type="button" data-action="open-cart" class="flex min-h-[44px] flex-1 flex-col items-center justify-center rounded-[8px] border-0 bg-transparent px-1 text-[11px] font-semibold text-[var(--color-ink)]">
        <span>Keranjang (${count})</span>
      </button>
      <a href="${waHref}" target="_blank" rel="noopener noreferrer" class="flex min-h-[44px] flex-1 flex-col items-center justify-center rounded-[8px] bg-[#463721] px-1 text-[11px] font-semibold text-[#FFE386] no-underline">
        <span>Chat WA</span>
      </a>
    </nav>
  `;
}

// CLEAN REALISTIC PRODUCT CARD FOR SHOPPING CATALOG
export function renderProductCard(product) {
  const isOut = product.stock <= 0;
  const isLow = product.stock > 0 && product.stock <= 10;
  const floodColor = FLAVOUR_ACCENTS[product.category] || '#FFE386';

  return `
    <article class="group flex flex-col justify-between rounded-[14px] border border-[#463721]/20 bg-[#FFFFFF] p-3 text-[#463721] transition-transform duration-300 hover:-translate-y-1">
      <div>
        <div role="button" tabindex="0" data-action="open-product-modal" data-product-id="${escapeHtml(
          product.id
        )}" aria-label="Lihat detail ${escapeHtml(
    product.name
  )} seharga ${formatRupiah(
    product.price
  )}" class="relative aspect-[4/3] w-full overflow-hidden rounded-[10px] bg-[#F8F8F0]">
          <div aria-hidden="true" style="background-color: ${floodColor}" class="honey-radial-flood pointer-events-none absolute inset-0 opacity-35"></div>

          <img src="${escapeHtml(product.image)}" data-fallback="${escapeHtml(
    product.fallbackImage || '/images/photo-raw-honey.jpg'
  )}" alt="${escapeHtml(
    product.name
  )}" width="640" height="480" loading="lazy" class="smart-img relative z-[1] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

          <div class="absolute left-2.5 top-2.5 z-[2] flex flex-wrap gap-1.5">
            <span class="rounded-full bg-[#463721]/90 px-3 py-0.5 font-sans text-[11px] font-semibold text-[#F8F8F0]">${escapeHtml(
              product.category
            )}</span>
            ${
              product.isBestSeller
                ? `<span class="rounded-full border border-[#463721] bg-[#FFE386] px-2.5 py-0.5 font-sans text-[11px] font-bold text-[#463721]">Terlaris</span>`
                : ''
            }
          </div>

          <!-- PROMINENT CORNER PRICE BADGE ON PRODUCT PHOTO -->
          <div class="price-corner-pill">
            ${formatRupiah(product.price)}
          </div>

          ${
            isLow
              ? `<span class="absolute bottom-2.5 right-2.5 z-[2] rounded-full bg-[#463721] px-2.5 py-0.5 font-sans text-[11px] font-semibold text-[#FFE386]">Sisa ${product.stock}</span>`
              : ''
          }
          ${
            isOut
              ? `<span class="absolute bottom-2.5 right-2.5 z-[2] rounded-full bg-[#CB533B] px-2.5 py-0.5 font-sans text-[11px] font-semibold text-[#FFFFFF]">Habis</span>`
              : ''
          }
        </div>

        <div class="px-1.5 pt-3.5">
          <h3 class="m-0">
            <button type="button" data-action="open-product-modal" data-product-id="${escapeHtml(
              product.id
            )}" class="border-0 bg-transparent p-0 text-left font-sans text-[17px] font-bold leading-snug text-[#463721] hover:underline sm:text-[18px]">
              ${escapeHtml(product.name)}
            </button>
          </h3>
          <p class="mt-1 text-[13px] text-[#6E5838]">${escapeHtml(
            product.packContents
          )} &middot; ${product.weightGrams}g</p>
        </div>
      </div>

      <!-- PROMINENT PRICE STRIP & ACTION BUTTONS -->
      <div class="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#463721]/15 px-1.5 pt-3">
        <div>
          <span class="block text-[10px] font-bold uppercase tracking-wider text-[#6E5838]">Harga Resmi</span>
          <span class="price-highlight-badge mt-0.5">${formatRupiah(product.price)}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <button type="button" data-action="open-product-modal" data-product-id="${escapeHtml(
            product.id
          )}" class="inline-flex min-h-[44px] items-center rounded-[10px] border border-[#463721]/35 bg-transparent px-3 font-sans text-[13px] font-semibold text-[#463721] hover:bg-[#ECE2B1]">
            Detail
          </button>
          <button type="button" ${
            isOut ? 'disabled' : ''
          } data-action="add-to-cart" data-product-id="${escapeHtml(
    product.id
  )}" aria-label="Tambah ${escapeHtml(
    product.name
  )} ke keranjang" class="inline-flex min-h-[44px] items-center gap-1 rounded-[10px] bg-[#463721] px-3.5 font-sans text-[13px] font-bold text-[#FFE386] transition-colors hover:bg-[#5E4A2C]">
            <span>+ Beli</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

export function renderInteractiveHoneyHarvest() {
  const state = store.getState();
  const jarPercent = state.harvestJarPercent;
  const skyMood = state.harvestSkyMood;
  const isPaused = state.harvestAnimPaused;
  const fillHeight = Math.round((jarPercent / 100) * 64);
  const fillY = 316 - fillHeight;
  const sialang = state.products[0];

  return `
    <div class="placard-card placard-rivets overflow-hidden bg-[var(--color-surface)] p-4 sm:p-7">
      <div class="flex flex-wrap items-center justify-between gap-2 pb-4">
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-hand text-[18px] text-[var(--color-muted)]">&bull; Simulasi Panen Pohon ${escapeHtml(
            state.settings.storeName
          )}</span>
          <button type="button" data-action="toggle-harvest-sky" aria-pressed="${
            skyMood === 'senja'
          }" class="min-h-[44px] rounded-full border border-[var(--color-border)]/40 bg-[var(--color-surface-alt)] px-3.5 font-hand text-[16px] text-[var(--color-ink)]">
            Waktu: ${skyMood === 'pagi' ? 'Pagi Teduh' : 'Sore Keemasan'}
          </button>
        </div>

        <button type="button" data-action="toggle-harvest-pause" aria-pressed="${isPaused}" class="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#463721] px-4 font-hand text-[16px] text-[#ECE2B1]">
          <span>${isPaused ? 'Putar Animasi' : 'Jeda Animasi'}</span>
        </button>
      </div>

      <div class="relative overflow-hidden rounded-[16px] border border-[#463721]/25 ${
        skyMood === 'pagi' ? 'bg-[#F8F8F0]' : 'bg-[#F3E9C6]'
      } ${isPaused ? '' : 'scene-anim-on'}">
        <svg viewBox="0 0 620 390" class="block h-auto w-full select-none" role="img" aria-label="Ilustrasi flat-vector minimalis pemanen mengambil madu dari sarang lebah di dahan pohon">
          <circle cx="96" cy="78" r="46" fill="${
            skyMood === 'pagi' ? '#FFE386' : '#E5B84B'
          }" opacity="0.75" />
          <path d="M-10 342 Q160 312 340 338 T630 328 L630 400 L-10 400 Z" fill="#ECE2B1" />
          <path d="M-10 362 Q210 344 420 364 T630 354 L630 400 L-10 400 Z" fill="#D8CCA0" />

          <g>
            <path d="M454 366 C458 290 450 225 442 156 C398 160 364 160 322 154 C322 144 334 140 354 142 C390 144 420 140 444 132 C454 102 478 102 488 134 C500 218 504 295 522 366 Z" fill="#6E5838" />
            <g class="tree-sway">
              <circle cx="404" cy="96" r="56" fill="#606112" opacity="0.88" />
              <circle cx="520" cy="104" r="60" fill="#4E4F0E" opacity="0.9" />
              <circle cx="464" cy="64" r="66" fill="#77781E" opacity="0.92" />
              <circle cx="354" cy="110" r="40" fill="#77781E" opacity="0.85" />
            </g>

            <g data-action="harvest-scoop" class="hive-swing cursor-pointer" role="button" tabindex="0" aria-label="Sarang lebah di dahan pohon, klik untuk memanen madu">
              <line x1="355" y1="148" x2="355" y2="172" stroke="#463721" stroke-width="2.5" />
              <ellipse cx="355" cy="182" rx="26" ry="11" fill="#E5B84B" />
              <ellipse cx="355" cy="197" rx="34" ry="13" fill="#FFE386" />
              <ellipse cx="355" cy="213" rx="30" ry="12" fill="#E5B84B" />
              <ellipse cx="355" cy="227" rx="20" ry="10" fill="#B9902E" />
              <circle cx="355" cy="201" r="7" fill="#463721" />
            </g>

            <g class="honey-drip">
              <path d="M342 238 C342 238 335 249 335 255 A7 7 0 1 0 349 255 C349 249 342 238 342 238 Z" fill="#B9902E" />
            </g>
          </g>

          <g transform="translate(0, 6)">
            <rect x="170" y="320" width="16" height="38" rx="6" fill="#463721" />
            <rect x="202" y="320" width="16" height="38" rx="6" fill="#463721" />
            <rect x="158" y="236" width="72" height="90" rx="22" fill="#FFFFFF" stroke="#463721" stroke-width="2.2" />
            <rect x="170" y="258" width="48" height="52" rx="10" fill="#ECE2B1" stroke="#463721" stroke-width="1.8" />

            <g class="arm-harvest-burst">
              <path d="M222 252 Q262 238 294 214" fill="none" stroke="#463721" stroke-width="8" stroke-linecap="round" />
              <line x1="296" y1="212" x2="338" y2="196" stroke="#946C3C" stroke-width="4" stroke-linecap="round" />
              <ellipse cx="341" cy="194" rx="9" ry="6.5" transform="rotate(-18 341 194)" fill="#B9902E" />
            </g>

            <circle cx="194" cy="198" r="28" fill="#F5DFC2" stroke="#463721" stroke-width="2.2" />
            <circle cx="185" cy="197" r="2.6" fill="#463721" />
            <circle cx="203" cy="197" r="2.6" fill="#463721" />
            <path d="M187 207 Q194 213 201 207" fill="none" stroke="#463721" stroke-width="2.2" stroke-linecap="round" />
            <ellipse cx="194" cy="176" rx="50" ry="10" fill="#FFE386" stroke="#463721" stroke-width="2.2" />
            <path d="M166 174 C166 150 222 150 222 174 Z" fill="#ECE2B1" stroke="#463721" stroke-width="2.2" />
          </g>

          <g transform="translate(306, 0)">
            <rect x="10" y="322" width="68" height="42" rx="6" fill="#946C3C" />
            <rect x="16" y="250" width="56" height="68" rx="12" fill="#FFFFFF" stroke="#463721" stroke-width="2.2" />
            <rect x="19" y="${fillY}" width="50" height="${fillHeight}" rx="9" fill="#FFE386" />
            <rect x="22" y="241" width="44" height="10" rx="4" fill="#463721" />
            <text x="44" y="290" text-anchor="middle" font-size="13" font-weight="700" fill="#463721">${jarPercent}%</text>
          </g>

          <g data-action="bee-fact" data-bee-idx="0" class="bee-fly-a cursor-pointer" role="button" tabindex="0" aria-label="Lebah pekerja 1, klik untuk info nektar">
            <g transform="translate(262, 102)">
              <ellipse cx="12" cy="7" rx="6" ry="9" fill="#FFFFFF" stroke="#463721" stroke-width="1.8" class="bee-wing" />
              <ellipse cx="19" cy="8" rx="5.5" ry="8" fill="#FFFFFF" stroke="#463721" stroke-width="1.8" class="bee-wing" />
              <ellipse cx="15" cy="18" rx="13" ry="9" fill="#FFE386" stroke="#463721" stroke-width="2" />
              <path d="M12 10 V26 M19 10 V26" stroke="#463721" stroke-width="2.5" />
            </g>
          </g>

          <g data-action="bee-fact" data-bee-idx="1" class="bee-fly-b cursor-pointer" role="button" tabindex="0" aria-label="Lebah pekerja 2, klik untuk info nektar">
            <g transform="translate(492, 198)">
              <ellipse cx="12" cy="7" rx="6" ry="9" fill="#FFFFFF" stroke="#463721" stroke-width="1.8" class="bee-wing" />
              <ellipse cx="19" cy="8" rx="5.5" ry="8" fill="#FFFFFF" stroke="#463721" stroke-width="1.8" class="bee-wing" />
              <ellipse cx="15" cy="18" rx="13" ry="9" fill="#E5B84B" stroke="#463721" stroke-width="2" />
              <path d="M12 10 V26 M19 10 V26" stroke="#463721" stroke-width="2.5" />
            </g>
          </g>
        </svg>

        <div role="status" aria-live="polite" class="border-t border-[#463721]/20 bg-[#ECE2B1] px-4 py-3 text-[#463721]">
          <p class="m-0 font-hand text-[18px]">${escapeHtml(state.harvestBubble)}</p>
        </div>
      </div>

      <div class="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" data-action="harvest-scoop" class="vs-btn-primary group flex-1">
          ${kineticLabel('Teteskan Madu dari Sarang (+25%)')}
        </button>

        ${
          sialang
            ? `<button type="button" data-action="add-to-cart" data-product-id="${escapeHtml(
                sialang.id
              )}" class="vs-btn-outline !min-h-[50px] !px-5">
                <span>+ Beli Hasil Panen (${formatRupiah(sialang.price)})</span>
              </button>`
            : ''
        }
      </div>
    </div>
  `;
}

export function renderAnimatedMap(compact = false) {
  const state = store.getState();
  const activeLayer = state.activeMapLayer;
  const isPaused = state.mapAnimPaused;
  const layerDescriptions = {
    toko: {
      badge: 'TOKO KAMI DI SINI',
      title: `Rumah Kemas & Galeri ${state.settings.storeName}`,
      desc: 'Titik pengambilan langsung stoples madu segar maupun penjemputan kurir instan dengan kemasan aman.',
    },
    kurir: {
      badge: 'JALUR PENGANTARAN',
      title: 'Kirim Instan & Ekspedisi Seluruh Indonesia',
      desc: 'Setiap botol kaca dilindungi selongsong pelindung tebal agar tiba utuh di meja makan Anda.',
    },
    kebun: {
      badge: 'JEJARING PANEN LESTARI',
      title: 'Terhubung Langsung dengan Pemanen Pohon',
      desc: 'Madu dikirim dari kelompok pemanen hutan sialang dan kebun bunga tanpa perantara panjang.',
    },
  };
  const info = layerDescriptions[activeLayer] || layerDescriptions.toko;

  return `
    <div class="placard-card placard-rivets bg-[var(--color-surface)] p-5 sm:p-6 md:p-10">
      <div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <div class="lg:col-span-5">
          <span class="font-hand text-[18px] text-[var(--color-muted)]">&bull; ${escapeHtml(
            info.badge
          )}</span>
          <h2 class="${
            compact ? 'type-display-xs' : 'type-display-md'
          } mt-2 text-[var(--color-ink)]">${escapeHtml(info.title)}</h2>
          <p class="type-body-md mt-3 text-[var(--color-body)]">${escapeHtml(info.desc)}</p>

          <div role="group" aria-label="Pilih lapisan peta toko madu" class="mt-6 flex flex-wrap gap-2">
            ${[
              { id: 'toko', label: 'Toko di Sini' },
              { id: 'kurir', label: 'Jalur Kirim' },
              { id: 'kebun', label: 'Asal Kebun' },
            ]
              .map(
                (btn) => `<button type="button" data-action="set-map-layer" data-layer="${
                  btn.id
                }" aria-pressed="${
                  activeLayer === btn.id
                }" class="min-h-[44px] rounded-full border px-4 font-hand text-[17px] transition-colors ${
                  activeLayer === btn.id
                    ? 'border-[#463721] bg-[#463721] text-[#FFE386]'
                    : 'border-[var(--color-border)]/40 bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)]'
                }">${btn.label}</button>`
              )
              .join('')}
          </div>

          <div class="mt-6 border-t border-[var(--color-hairline)] pt-4">
            <p class="type-body-sm font-semibold text-[var(--color-ink)]">${escapeHtml(
              state.settings.addressLabel
            )}</p>
            <p class="type-caption mt-1 text-[var(--color-muted)]">Jam Layanan: ${escapeHtml(
              state.settings.operationalHours
            )} &middot; WA: ${escapeHtml(formatDisplayPhone(state.settings.whatsappNumber))}</p>
          </div>

          <div class="mt-6">
            <a href="${escapeHtml(
              state.settings.mapsShortUrl
            )}" target="_blank" rel="noopener noreferrer" class="vs-btn-primary group">
              ${kineticLabel('Buka Lokasi di Google Maps')}
            </a>
          </div>
        </div>

        <div class="lg:col-span-7">
          <div class="overflow-hidden rounded-[18px] border border-[#463721] bg-[#463721] text-[#F8F8F0] ${
            isPaused ? '' : 'map-anim-active scene-anim-on'
          }">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#6D5B3A] px-4 py-3">
              <span class="font-hand text-[18px] text-[#FFE386]">&bull; Peta Lokasi Toko ${escapeHtml(
                state.settings.storeName
              )}</span>
              <button type="button" data-action="toggle-map-pause" aria-pressed="${isPaused}" class="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#ECE2B1]/40 bg-[#362A18] px-3.5 font-hand text-[16px] text-[#ECE2B1] hover:bg-[#FFE386] hover:text-[#463721]">
                <span>${isPaused ? 'Putar Animasi' : 'Jeda Animasi'}</span>
              </button>
            </div>

            <div class="relative aspect-[16/10] w-full bg-[#3A2D1B]">
              <svg viewBox="0 0 640 400" class="h-full w-full" role="img" aria-label="Peta lokasi toko ${escapeHtml(
                state.settings.storeName
              )}: Toko Kami di Sini">
                <g fill="#463721">
                  <rect x="36" y="34" width="160" height="106" rx="10" />
                  <rect x="444" y="34" width="160" height="106" rx="10" />
                  <rect x="36" y="256" width="160" height="108" rx="10" />
                  <rect x="444" y="256" width="160" height="108" rx="10" />
                  <rect x="234" y="34" width="172" height="82" rx="10" />
                </g>
                <path d="M -10 210 Q 170 195 320 205 T 650 185" fill="none" stroke="#57452A" stroke-width="22" />
                <path d="M 310 -10 Q 320 135 320 205 T 340 410" fill="none" stroke="#57452A" stroke-width="20" />
                <path d="M 48 210 Q 180 198 320 205" fill="none" stroke="#FFE386" stroke-width="3" class="map-route-path" />
                <path d="M 592 186 Q 450 196 320 205" fill="none" stroke="#ECE2B1" stroke-width="3" class="map-route-path" />
                <g fill="#606112">
                  <circle cx="96" cy="90" r="18" />
                  <circle cx="520" cy="86" r="20" />
                  <circle cx="118" cy="306" r="18" />
                  <circle cx="528" cy="308" r="22" />
                </g>
                <g transform="translate(320, 205)">
                  <circle r="28" fill="none" stroke="#FFE386" stroke-width="2" class="map-radar-ring" />
                  <circle r="28" fill="none" stroke="#ECE2B1" stroke-width="1.5" class="map-radar-ring-delayed" />
                </g>
                <g transform="translate(292, 174)">
                  <rect x="6" y="20" width="44" height="30" rx="5" fill="#ECE2B1" />
                  <polygon points="0,22 28,2 56,22" fill="#FFE386" />
                  <rect x="22" y="32" width="12" height="18" rx="2" fill="#463721" />
                </g>
                <g class="map-pin-float">
                  <rect x="220" y="120" width="200" height="38" rx="19" fill="#FFE386" />
                  <polygon points="312,158 328,158 320,170" fill="#FFE386" />
                  <text x="320" y="144" text-anchor="middle" font-size="14" font-weight="700" fill="#463721">TOKO ${escapeHtml(
                    state.settings.storeName.toUpperCase()
                  )} DI SINI</text>
                </g>
                <g class="bee-fly-a">
                  <g transform="translate(185, 194)">
                    <ellipse cx="10" cy="6" rx="5" ry="7" fill="#F8F8F0" class="bee-wing" />
                    <ellipse cx="16" cy="7" rx="4.5" ry="6" fill="#F8F8F0" class="bee-wing" />
                    <ellipse cx="13" cy="14" rx="10" ry="7" fill="#FFE386" />
                  </g>
                </g>
              </svg>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-3 border-t border-[#6D5B3A] bg-[#463721] px-4 py-3 text-[13px] text-[#ECE2B1]">
              <span class="break-all">Tautan Google Maps: <code class="text-[#FFE386]">${escapeHtml(
                state.settings.mapsShortUrl
              )}</code></span>
              <a href="${escapeHtml(
                state.settings.mapsShortUrl
              )}" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-[44px] items-center rounded-full bg-[#FFE386] px-4 font-hand text-[16px] text-[#463721] no-underline">
                Rute Navigasi &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderCartPanelHtml() {
  const state = store.getState();
  const { detailed, total } = store.getCartMetrics();

  if (detailed.length === 0) {
    return `
      <div class="placard-card bg-[var(--color-surface)] p-6 sm:p-8">
        <span class="inline-block rounded-full border border-[#463721] bg-[#FFE386] px-3 py-0.5 font-hand text-[16px] text-[#463721]">keranjang masih kosong</span>
        <h3 class="type-display-xs mt-4 text-[var(--color-ink)]">BELUM ADA STOPLES MADU DI KERANJANG.</h3>
        <p class="type-body-sm mt-2 text-[var(--color-body)]">Pilih Madu Hutan Sialang, Madu Bunga Kaliandra, atau Sarang Madu Potong untuk mulai memesan lewat WhatsApp (${escapeHtml(
          formatDisplayPhone(state.settings.whatsappNumber)
        )}).</p>
        <a href="/produk" data-link data-action="close-cart" class="vs-btn-primary mt-6">${kineticLabel(
          'Lihat Katalog Madu'
        )}</a>
      </div>
    `;
  }

  const waHref = buildWhatsAppCheckoutUrl({
    whatsappNumber: state.settings.whatsappNumber,
    storeName: state.settings.storeName,
    items: detailed.map((d) => ({
      name: d.product.name,
      packContents: d.product.packContents,
      quantity: d.quantity,
      price: d.product.price,
    })),
  });

  return `
    <div class="flex flex-col gap-5">
      <ul class="m-0 flex list-none flex-col gap-3 p-0">
        ${detailed
          .map(
            ({ product, quantity, subtotal }) => `
            <li class="placard-card flex flex-col gap-3 bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-3.5">
                <div class="h-16 w-16 shrink-0 overflow-hidden rounded-[10px] bg-[#ECE2B1]">
                  <img src="${escapeHtml(product.image)}" data-fallback="${escapeHtml(
              product.fallbackImage || '/images/photo-raw-honey.jpg'
            )}" alt="${escapeHtml(
              product.name
            )}" width="128" height="128" class="smart-img h-full w-full object-cover" />
                </div>
                <div>
                  <p class="m-0 font-sans text-[16px] font-bold leading-tight text-[var(--color-ink)]">${escapeHtml(
                    product.name
                  )}</p>
                  <p class="type-caption mt-0.5 text-[var(--color-muted)]">${escapeHtml(
                    product.packContents
                  )} &middot; ${formatRupiah(product.price)}</p>
                  <p class="mt-1"><span class="price-highlight-badge !text-[21px] !py-0.5 !px-2.5">${formatRupiah(
                    subtotal
                  )}</span></p>
                </div>
              </div>

              <div class="flex items-center justify-between gap-2 sm:justify-end">
                <div class="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                  <button type="button" data-action="cart-dec" data-product-id="${escapeHtml(
                    product.id
                  )}" aria-label="Kurangi jumlah ${escapeHtml(
              product.name
            )}" class="inline-flex h-[44px] w-[44px] items-center justify-center text-[var(--color-ink)]">&minus;</button>
                  <span class="min-w-[32px] text-center font-poster text-[18px]">${quantity}</span>
                  <button type="button" data-action="cart-inc" data-product-id="${escapeHtml(
                    product.id
                  )}" aria-label="Tambah jumlah ${escapeHtml(
              product.name
            )}" class="inline-flex h-[44px] w-[44px] items-center justify-center text-[var(--color-ink)]">+</button>
                </div>

                <button type="button" data-action="cart-remove" data-product-id="${escapeHtml(
                  product.id
                )}" aria-label="Hapus ${escapeHtml(
              product.name
            )} dari keranjang" class="inline-flex h-[44px] w-[44px] items-center justify-center rounded-[10px] border border-[var(--color-border)]/40 bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[#463721] hover:text-[#FFE386]">
                  &times;
                </button>
              </div>
            </li>
          `
          )
          .join('')}
      </ul>

      <div class="rounded-[14px] border border-[var(--color-border)]/40 bg-[var(--color-surface-alt)]/55 p-4">
        <div class="grid grid-cols-1 gap-3">
          <div>
            <label for="wa-buyer-name" class="mb-1 block font-sans text-[14px] font-semibold text-[var(--color-ink)]">Nama Pemesan (Opsional)</label>
            <input id="wa-buyer-name" type="text" placeholder="Contoh: Kak Rina" class="vs-input" />
          </div>
          <div>
            <label for="wa-buyer-notes" class="mb-1 block font-sans text-[14px] font-semibold text-[var(--color-ink)]">Alamat / Catatan Pengiriman (Opsional)</label>
            <input id="wa-buyer-notes" type="text" placeholder="Contoh: Kirim kurir instan sore" class="vs-input" />
          </div>
        </div>
      </div>

      <div class="border-t border-[var(--color-hairline)] pt-4">
        <div class="flex items-center justify-between">
          <span class="font-sans text-[16px] font-bold text-[var(--color-body)]">Total Harga Pesanan</span>
          <span class="price-highlight-badge !text-[30px]">${formatRupiah(total)}</span>
        </div>
        <p class="type-caption mt-1 text-[var(--color-muted)]">Pesanan dikirim langsung ke WhatsApp resmi <strong>${escapeHtml(
          formatDisplayPhone(state.settings.whatsappNumber)
        )}</strong>.</p>

        <div class="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <a id="wa-checkout-link" href="${waHref}" target="_blank" rel="noopener noreferrer" data-action="record-wa-order" class="vs-btn-primary group flex-1">
            ${kineticLabel('Pesan via WhatsApp (' + formatDisplayPhone(state.settings.whatsappNumber) + ')')}
          </a>
          <button type="button" data-action="clear-cart" class="vs-btn-ghost">Kosongkan</button>
        </div>
      </div>
    </div>
  `;
}

export function renderFooter() {
  const state = store.getState();
  const directWaUrl = buildWhatsAppCheckoutUrl({
    whatsappNumber: state.settings.whatsappNumber,
    storeName: state.settings.storeName,
    items: [],
  });
  const displayPhone = formatDisplayPhone(state.settings.whatsappNumber);

  return `
    <footer class="mt-20 pb-16 md:pb-0">
      <div aria-hidden="true" class="flex w-full overflow-hidden leading-none text-[#463721]">
        ${Array.from({ length: 14 })
          .map(() => `<div class="-mb-5 h-10 flex-1 rounded-t-full bg-[#463721]"></div>`)
          .join('')}
      </div>

      <div class="bg-[#463721] text-[#F8F8F0]">
        <div class="mx-auto max-w-[1425px] px-4 py-12 md:px-7 md:py-16">
          <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div class="lg:col-span-7">
              <span class="inline-block rounded-full bg-[#FFE386] px-4 py-1 font-hand text-[17px] text-[#463721]">100% panen alami lebah &amp; pohon hutan</span>
              <p class="type-display-lg mt-4 text-[#FFE386]">${escapeHtml(
                state.settings.storeName
              )}</p>
              <p class="type-body-lg mt-3 max-w-xl text-[#ECE2B1]">${escapeHtml(
                state.settings.tagline
              )}. Dikemas higienis dalam stoples segel tanpa tambahan sirup gula.</p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
              <a href="${directWaUrl}" target="_blank" rel="noopener noreferrer" class="group flex min-h-[80px] flex-1 items-center justify-between rounded-[18px] bg-[#FFE386] px-5 py-4 text-[#463721] no-underline transition-transform duration-200 hover:-translate-y-1">
                <div>
                  <span class="block font-sans text-[12px] font-bold">WhatsApp Resmi (${escapeHtml(
                    displayPhone
                  )})</span>
                  <span class="mt-0.5 block font-poster text-[22px] uppercase">${kineticLabel(
                    'Chat WhatsApp'
                  )}</span>
                </div>
                <span class="font-poster text-[22px]">&rarr;</span>
              </a>

              <a href="/ulasan" data-link class="group flex min-h-[80px] flex-1 items-center justify-between rounded-[18px] bg-[#ECE2B1] px-5 py-4 text-[#463721] no-underline transition-transform duration-200 hover:-translate-y-1">
                <div>
                  <span class="block font-sans text-[12px] font-bold">Kata Pelanggan</span>
                  <span class="mt-0.5 block font-poster text-[22px] uppercase">${kineticLabel(
                    'Halaman Ulasan'
                  )}</span>
                </div>
                <span class="font-poster text-[22px]">&rarr;</span>
              </a>
            </div>
          </div>

          <div class="mt-10 grid grid-cols-1 gap-6 border-t border-[#685336] pt-8 md:grid-cols-3">
            <div>
              <p class="font-hand text-[18px] text-[#FFE386]">Menu Navigasi</p>
              <ul class="mt-2 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 font-hand text-[18px]">
                <li><a href="/" data-link class="inline-flex min-h-[44px] items-center text-[#F8F8F0] no-underline hover:underline">Beranda</a></li>
                <li><a href="/produk" data-link class="inline-flex min-h-[44px] items-center text-[#F8F8F0] no-underline hover:underline">Katalog Madu</a></li>
                <li><a href="/ulasan" data-link class="inline-flex min-h-[44px] items-center text-[#F8F8F0] no-underline hover:underline">Ulasan Pelanggan</a></li>
                <li><a href="/peta" data-link class="inline-flex min-h-[44px] items-center text-[#F8F8F0] no-underline hover:underline">Peta Toko</a></li>
                <li><a href="/artikel" data-link class="inline-flex min-h-[44px] items-center text-[#F8F8F0] no-underline hover:underline">Berita &amp; Tips</a></li>
                <li><a href="/tentang" data-link class="inline-flex min-h-[44px] items-center text-[#F8F8F0] no-underline hover:underline">Cerita Kami</a></li>
              </ul>
            </div>

            <div>
              <p class="font-hand text-[18px] text-[#FFE386]">Jam Buka &amp; Nomor WA</p>
              <p class="mt-2 text-[15px] text-[#ECE2B1]">${escapeHtml(
                state.settings.operationalHours
              )}</p>
              <p class="mt-1 text-[15px] font-bold text-[#FFE386]">WA: ${escapeHtml(
                displayPhone
              )}</p>
            </div>

            <div class="md:text-right">
              <p class="text-[14px] text-[#ECE2B1]">&copy; ${new Date().getFullYear()} ${escapeHtml(
    state.settings.storeName
  )}. Madu Murni &amp; Hasil Lebah Alami.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function renderModalsAndDrawers() {
  const state = store.getState();
  const { count } = store.getCartMetrics();
  const selectedProduct = state.selectedProductId
    ? state.products.find((p) => p.id === state.selectedProductId)
    : null;

  const productModalHtml = selectedProduct
    ? `
      <div id="product-detail-modal" class="fixed inset-0 z-40 flex items-center justify-center bg-[#2B1B10]/75 p-3 sm:p-6" data-action="close-product-modal-backdrop">
        <div role="dialog" aria-modal="true" aria-labelledby="modal-product-title" class="placard-card max-h-[92vh] w-full max-w-[900px] overflow-y-auto bg-[var(--color-surface)] text-[var(--color-ink)]">
          <div class="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-hairline)] bg-[var(--color-surface)] px-5 py-4 md:px-8">
            <div class="flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-[#463721] px-3 py-0.5 font-sans text-[13px] font-semibold text-[#FFE386]">${escapeHtml(
                selectedProduct.category
              )}</span>
              <span class="rounded-full bg-[#ECE2B1] px-3 py-0.5 font-sans text-[13px] font-semibold text-[#463721]">${
                selectedProduct.stock > 0
                  ? `Tersedia (${selectedProduct.stock} item)`
                  : 'Stok Habis'
              }</span>
            </div>

            <button type="button" data-action="close-product-modal" aria-label="Tutup detail produk" class="inline-flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[var(--color-border)]/40 bg-[var(--color-surface-alt)] text-[var(--color-ink)] hover:bg-[#463721] hover:text-[#FFE386]">
              &times;
            </button>
          </div>

          <div class="grid grid-cols-1 gap-6 p-5 md:grid-cols-12 md:gap-8 md:p-8">
            <div class="md:col-span-5">
              <div class="aspect-square w-full overflow-hidden rounded-[16px] bg-[#ECE2B1]">
                <img src="${escapeHtml(selectedProduct.image)}" data-fallback="${escapeHtml(
        selectedProduct.fallbackImage || '/images/photo-raw-honey.jpg'
      )}" alt="${escapeHtml(
        selectedProduct.name
      )}" width="640" height="640" class="smart-img h-full w-full object-cover" />
              </div>

              <div class="mt-4 grid grid-cols-2 gap-2 rounded-[14px] border border-[var(--color-hairline)] bg-[var(--color-surface-alt)]/55 p-4 text-[13px]">
                <div>
                  <span class="block text-[var(--color-muted)]">Kemasan</span>
                  <span class="mt-0.5 block font-semibold text-[var(--color-ink)]">${escapeHtml(
                    selectedProduct.packContents
                  )}</span>
                </div>
                <div>
                  <span class="block text-[var(--color-muted)]">Berat Bersih</span>
                  <span class="mt-0.5 block font-semibold text-[var(--color-ink)]">${
                    selectedProduct.weightGrams
                  } gram</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col justify-between md:col-span-7">
              <div>
                <h2 id="modal-product-title" class="type-display-md text-[var(--color-ink)]">${escapeHtml(
                  selectedProduct.name
                )}</h2>
                <div class="mt-3">
                  <span class="price-highlight-badge !text-[32px] !px-4 !py-1.5">${formatRupiah(
                    selectedProduct.price
                  )}</span>
                </div>
                <p class="type-body-md mt-4 text-[var(--color-body)]">${escapeHtml(
                  selectedProduct.description
                )}</p>

                <div class="mt-6 rounded-[14px] border border-[var(--color-hairline)] bg-[var(--color-surface-alt)]/45 p-4 md:p-5">
                  <h3 class="m-0 font-sans text-[16px] font-bold text-[var(--color-ink)]">Saran Konsumsi &amp; Penyimpanan Alami</h3>
                  <ol class="mt-2.5 space-y-2 pl-5 text-[14px] text-[var(--color-body)]">
                    ${selectedProduct.servingGuide
                      .map((step) => `<li>${escapeHtml(step)}</li>`)
                      .join('')}
                  </ol>
                </div>
              </div>

              <div class="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--color-hairline)] pt-5">
                <button type="button" ${
                  selectedProduct.stock <= 0 ? 'disabled' : ''
                } data-action="modal-add-cart" data-product-id="${escapeHtml(
        selectedProduct.id
      )}" class="vs-btn-primary w-full">
                  ${kineticLabel(
                    selectedProduct.stock <= 0
                      ? 'Stok Sedang Habis'
                      : `Masukkan ke Keranjang (${formatRupiah(selectedProduct.price)})`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    : '';

  const cartDrawerHtml = state.isCartOpen
    ? `
      <div id="cart-drawer-backdrop" class="fixed inset-0 z-40 flex justify-end bg-[#2B1B10]/70" data-action="close-cart-backdrop">
        <aside role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title" class="flex h-full w-full max-w-[500px] flex-col border-l-2 border-[#463721] bg-[var(--color-canvas)] text-[var(--color-ink)]">
          <div class="flex items-center justify-between border-b border-[#463721]/25 bg-[#FFE386] px-5 py-4 text-[#463721]">
            <div>
              <h2 id="cart-drawer-title" class="m-0 font-poster text-[26px] uppercase leading-none">Keranjang Panen</h2>
              <p class="m-0 font-hand text-[16px]">${count} item dipilih untuk WhatsApp</p>
            </div>
            <button type="button" data-action="close-cart" aria-label="Tutup keranjang belanja" class="inline-flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#463721] bg-[#FFFFFF] text-[#463721] hover:bg-[#463721] hover:text-[#FFE386]">
              &times;
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-5">
            ${renderCartPanelHtml()}
          </div>
        </aside>
      </div>
    `
    : '';

  return productModalHtml + cartDrawerHtml;
}
