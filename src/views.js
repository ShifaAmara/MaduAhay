import {
  kineticLabel,
  renderAnimatedMap,
  renderCartPanelHtml,
  renderInteractiveHoneyHarvest,
  renderProductCard,
} from './components.js';
import { ART_PRESETS } from './data.js';
import { store } from './store.js';
import {
  buildWhatsAppCheckoutUrl,
  escapeHtml,
  formatDisplayPhone,
  formatRupiah,
} from './utils.js';

export function renderHomeView() {
  const state = store.getState();
  const bestSellers = state.products.filter((p) => p.isBestSeller).slice(0, 6);
  const featuredList = bestSellers.length > 0 ? bestSellers : state.products.slice(0, 6);
  const featuredProduct = state.products[0];

  const askWaHref = buildWhatsAppCheckoutUrl({
    whatsappNumber: state.settings.whatsappNumber,
    storeName: state.settings.storeName,
    items: [],
  });

  const fillRatio = Math.min(1, state.openerProgress / 100);
  const paddedPercent = String(Math.round(state.openerProgress)).padStart(3, '0');
  const openerHtml = !state.openerDone
    ? `
      <div id="bee-opener-overlay" class="fixed inset-0 z-30 flex flex-col items-center justify-center bg-[#463721] transition-opacity duration-500">
        <div id="bee-opener-emblem" class="flex flex-col items-center justify-center transition-transform duration-500 will-change-transform">
          <svg width="150" height="150" viewBox="0 0 160 160" fill="none">
            <defs>
              <clipPath id="bee-fill-clip">
                <rect id="bee-fill-rect" x="0" y="${160 - fillRatio * 160}" width="160" height="${
        fillRatio * 160 + 4
      }" />
              </clipPath>
            </defs>
            <g fill="#6D5B3A">
              <path d="M74 66 C50 38, 22 44, 26 68 C30 88, 58 84, 74 74 Z" />
              <path d="M86 66 C110 38, 138 44, 134 68 C130 88, 102 84, 86 74 Z" />
              <path d="M52 78 C38 78, 34 94, 48 96 C62 98, 68 84, 52 78 Z" />
              <path d="M108 78 C122 78, 126 94, 112 96 C98 98, 92 84, 108 78 Z" />
              <ellipse cx="80" cy="48" rx="13" ry="11" />
              <path d="M73 38 Q64 24 54 26 M87 38 Q96 24 106 26" stroke="#6D5B3A" stroke-width="4" stroke-linecap="round" />
              <rect x="62" y="64" width="36" height="13" rx="6.5" />
              <rect x="58" y="82" width="44" height="14" rx="7" />
              <rect x="63" y="101" width="34" height="13" rx="6.5" />
              <path d="M70 119 H90 L80 136 Z" />
            </g>
            <g clip-path="url(#bee-fill-clip)" fill="#FFE386">
              <path d="M74 66 C50 38, 22 44, 26 68 C30 88, 58 84, 74 74 Z" />
              <path d="M86 66 C110 38, 138 44, 134 68 C130 88, 102 84, 86 74 Z" />
              <path d="M52 78 C38 78, 34 94, 48 96 C62 98, 68 84, 52 78 Z" />
              <path d="M108 78 C122 78, 126 94, 112 96 C98 98, 92 84, 108 78 Z" />
              <ellipse cx="80" cy="48" rx="13" ry="11" />
              <path d="M73 38 Q64 24 54 26 M87 38 Q96 24 106 26" stroke="#FFE386" stroke-width="4" stroke-linecap="round" />
              <rect x="62" y="64" width="36" height="13" rx="6.5" />
              <rect x="58" y="82" width="44" height="14" rx="7" />
              <rect x="63" y="101" width="34" height="13" rx="6.5" />
              <path d="M70 119 H90 L80 136 Z" />
            </g>
          </svg>
        </div>

        <div class="absolute bottom-7 left-7 flex items-baseline gap-1.5 text-[#FFE386] md:bottom-10 md:left-10">
          <span id="bee-opener-counter" class="font-poster text-[60px] font-bold leading-none tracking-tight sm:text-[68px] md:text-[88px]">${paddedPercent}</span>
          <span class="font-poster text-[20px] font-semibold md:text-[26px]">%</span>
        </div>

        <button type="button" data-action="skip-bee-opener" class="absolute bottom-8 right-5 rounded-full border border-[#ECE2B1]/40 bg-[#362A18] px-4 py-2 font-hand text-[17px] text-[#FFE386] hover:bg-[#FFE386] hover:text-[#463721] sm:right-7 sm:text-[19px] md:bottom-11 md:right-10">
          Scroll / Klik untuk Membuka Homepage &darr;
        </button>
      </div>
    `
    : '';

  return `
    ${openerHtml}

    <!-- 1. HOMEPAGE HERO SECTION (Stays right at top scrollY = 0 when opener finishes!) -->
    <section id="hero-homepage" class="relative flex min-h-[calc(100vh-68px)] items-center justify-center overflow-hidden bg-[var(--color-canvas)] py-10 sm:py-12">
      <svg aria-hidden="true" viewBox="0 0 500 500" class="pointer-events-none absolute -right-20 top-6 h-[420px] w-[420px] text-[#FFE386] opacity-75 sm:h-[520px] sm:w-[520px] md:h-[660px] md:w-[660px]" fill="currentColor">
        <path d="M265 490 C262 380 264 275 256 185 C195 195 135 235 98 282 C92 240 128 182 228 164 C168 134 112 146 74 176 C96 118 168 102 246 144 C230 84 185 56 146 54 C194 26 254 54 268 136 C305 64 368 48 416 66 C370 84 320 106 286 150 C362 126 426 154 456 196 C404 184 342 174 284 178 C302 276 306 385 322 490 Z" />
      </svg>

      <div class="relative z-[2] mx-auto flex w-full max-w-[1160px] flex-col items-center px-4 text-center md:px-6">
        <span class="rounded-full border border-[#463721]/30 bg-[#FFE386] px-4 py-1 font-hand text-[17px] text-[#463721] sm:text-[18px]">
          ${state.products.length} Produk Pilihan &bull; ${
    state.categories.length
  } Kategori Nektar &bull; 100% Murni Alami
        </span>

        <h1 class="type-display-xxl mt-4 max-w-[920px] text-[var(--color-ink)]">
          MANIS MURNI DI SETIAP TETES.
        </h1>

        <div class="relative my-5 flex w-full max-w-[820px] flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          <span class="font-hand text-[21px] text-[var(--color-ink)] sm:text-[25px]">&bull; Kaya Enzim Diastase</span>

          <div class="relative flex flex-col items-center">
            <div class="h-44 w-44 overflow-hidden rounded-full border-2 border-[#463721]/30 bg-[#FFFFFF] p-2 sm:h-56 sm:w-56">
              <img src="/images/photo-raw-honey.jpg" data-fallback="/images/honey-jar-cartoon.svg" alt="Stoples kaca madu murni keemasan asli dengan sendok kayu" width="440" height="440" fetchpriority="high" class="smart-img h-full w-full rounded-full object-cover" />
            </div>
            ${
              featuredProduct
                ? `<div class="-mt-4 rounded-[10px] border-2 border-[#463721] bg-[#FFE386] px-4 py-1 font-poster text-[22px] font-bold text-[#463721] shadow-[0_2px_0_#463721] sm:text-[24px]">
                    Mulai ${formatRupiah(52000)} s.d. ${formatRupiah(featuredProduct.price)}
                  </div>`
                : ''
            }
          </div>

          <span class="font-hand text-[21px] text-[var(--color-ink)] sm:text-[25px]">&bull; Tanpa Gula Tambahan</span>
        </div>

        <p class="type-body-lg mt-2 max-w-[760px] text-[var(--color-body)]">
          Nikmati Kemurnian Madu Hutan &amp; Nektar Bunga Alami Dari Kebun <strong>${escapeHtml(
            state.settings.storeName
          )}</strong>, Dipanen Lestari Langsung Dari Sarang Tanpa Pemanasan Pabrik.
        </p>

        <div class="mt-7 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          <a href="/produk" data-link class="group relative inline-flex h-[68px] w-[224px] items-center justify-center font-hand text-[23px] text-[var(--color-ink)] no-underline sm:h-[74px] sm:w-[228px] sm:text-[24px]">
            <svg aria-hidden="true" viewBox="0 0 228 74" fill="none" class="pointer-events-none absolute inset-0 h-full w-full text-[var(--color-ink)] transition-transform duration-300 group-hover:scale-105">
              <path d="M 42 66 C 148 66, 222 57, 222 36 C 222 14, 166 7, 114 7 C 56 7, 6 15, 6 36 C 6 58, 72 64, 152 61" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" />
            </svg>
            ${kineticLabel('Belanja Katalog Madu')}
          </a>

          <a href="/ulasan" data-link class="vs-btn-primary">
            ${kineticLabel('Buka Halaman Ulasan (' + state.reviews.length + ')')}
          </a>

          <a href="#panen-interaktif" class="font-hand text-[20px] text-[var(--color-ink)] underline-offset-4 hover:underline">
            Simulasi Panen Pohon &darr;
          </a>
        </div>
      </div>
    </section>

    <!-- 2. INTERACTIVE BOTANICAL TREE, BEES & HARVESTER STAGE -->
    <section id="panen-interaktif" class="mx-auto max-w-[1425px] scroll-mt-20 px-4 py-12 md:px-7 md:py-20">
      <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div class="lg:col-span-7">
          ${renderInteractiveHoneyHarvest()}
        </div>

        <div class="flex flex-col gap-5 lg:col-span-5">
          <div class="placard-card placard-rivets !bg-[#FFE386] p-6 text-[#463721] sm:p-7 md:p-9">
            <span class="font-hand text-[17px] uppercase tracking-wider">langsung dari sarang pohon</span>
            <h2 class="type-display-md mt-2 text-[#463721]">KOTAK KEMURNIAN ALAM.</h2>
            <p class="type-body-sm mt-3 text-[#463721]">
              Tersedia <strong>${state.products.length} Produk Pilihan</strong> dalam <strong>${
    state.categories.length
  } Kategori</strong> nektar hutan dan sarang lebah asli. Disaring dingin tanpa pemanasan pabrik dan disegel higienis.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="placard-card bg-[var(--color-surface)] p-5">
              <h3 class="m-0 font-hand text-[22px] text-[var(--color-ink)]">Tanpa Gula Rafinasi</h3>
              <p class="type-body-sm mt-1.5 text-[var(--color-body)]">Murni nektar bunga hutan dan kebun tanpa tambahan sirup fruktosa.</p>
            </div>
            <div class="placard-card bg-[var(--color-surface)] p-5">
              <h3 class="m-0 font-hand text-[22px] text-[var(--color-ink)]">Enzim Alami Utuh</h3>
              <p class="type-body-sm mt-1.5 text-[var(--color-body)]">Saring dingin menjaga enzim diastase, propolis, dan serbuk sari bunga.</p>
            </div>
          </div>

          <div class="placard-card flex flex-col justify-between gap-4 !bg-[#ECE2B1] p-6 text-[#463721] sm:flex-row sm:items-center">
            <div>
              <h3 class="m-0 font-hand text-[22px]">Pesan &amp; Tanya via WhatsApp</h3>
              <p class="type-body-sm mt-0.5">Nomor Resmi: <strong>${escapeHtml(
                formatDisplayPhone(state.settings.whatsappNumber)
              )}</strong></p>
            </div>
            <a href="${askWaHref}" target="_blank" rel="noopener noreferrer" class="vs-btn-primary shrink-0">
              ${kineticLabel('Chat WhatsApp')}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. PALMO SCALLOPED TRANSITION INTO DEEP ESPRESSO (#463721) REAL PHOTO CATALOG SHOWCASE -->
    <div aria-hidden="true" class="flex w-full overflow-hidden leading-none">
      ${Array.from({ length: 7 })
        .map(
          () =>
            `<div class="-mb-8 h-16 flex-1 rounded-t-full bg-[#463721] md:-mb-12 md:h-24"></div>`
        )
        .join('')}
    </div>

    <section id="produk-terlaris" class="bg-[#463721] py-14 text-[#F8F8F0] md:py-24">
      <div class="mx-auto max-w-[1425px] px-4 md:px-7">
        <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
          <h2 class="type-display-lg text-[#F8F8F0]">KOLEKSI PANEN</h2>
          <svg aria-hidden="true" width="76" height="76" viewBox="0 0 100 100" fill="none" class="text-[#FFE386] md:h-[86px] md:w-[86px]">
            ${Array.from({ length: 16 })
              .map(
                (_, idx) =>
                  `<path d="M50 18 Q54 8 50 2 Q46 8 50 18" stroke="currentColor" stroke-width="2.2" fill="none" transform="rotate(${
                    idx * 22.5
                  } 50 50)" />`
              )
              .join('')}
            <circle cx="50" cy="50" r="24" stroke="currentColor" stroke-width="2.4" />
          </svg>
          <h2 class="type-display-lg text-[#F8F8F0]">TERLARIS</h2>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          ${featuredList.map((p) => renderProductCard(p)).join('')}
        </div>

        <div class="mt-12 flex flex-wrap justify-center gap-4">
          <a href="/produk" data-link class="group relative inline-flex h-[74px] w-[240px] items-center justify-center font-hand text-[23px] text-[#FFE386] no-underline">
            <svg aria-hidden="true" viewBox="0 0 240 74" fill="none" class="pointer-events-none absolute inset-0 h-full w-full text-[#FFE386] transition-transform duration-300 group-hover:scale-105">
              <path d="M 44 66 C 154 66, 232 57, 232 36 C 232 14, 174 7, 120 7 C 58 7, 8 15, 8 36 C 8 58, 76 64, 160 61" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" />
            </svg>
            ${kineticLabel(`Lihat Semua ${state.products.length} Varian`)}
          </a>
        </div>
      </div>
    </section>

    <!-- 4. ULASAN PREVIEW + BUTTON TO DEDICATED /ulasan PAGE -->
    <section class="mx-auto max-w-[1425px] px-4 py-14 md:px-7 md:py-20">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span class="font-hand text-[19px] text-[var(--color-muted)]">&bull; Ulasan Bintang 5 Pelanggan</span>
          <h2 class="type-display-lg mt-1 text-[var(--color-ink)]">KATA PENIKMAT MADU !</h2>
        </div>
        <a href="/ulasan" data-link class="vs-btn-primary self-start sm:self-auto">
          ${kineticLabel('Buka Halaman Ulasan & Tulis Review')}
        </a>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        ${state.reviews
          .slice(0, 3)
          .map(
            (rev) => `
            <article class="placard-card placard-rivets flex flex-col justify-between bg-[var(--color-surface)] p-6 pt-9">
              <div>
                <div class="flex items-center justify-between gap-2">
                  <span class="font-poster text-[18px] text-[#B9902E]" aria-label="${
                    rev.rating
                  } dari 5 bintang">${'&#9733;'.repeat(rev.rating)}</span>
                  <span class="font-hand text-[16px] text-[var(--color-muted)]">${escapeHtml(
                    rev.dateLabel
                  )}</span>
                </div>
                <p class="type-body-md mt-4 text-[var(--color-ink)]">&ldquo;${escapeHtml(
                  rev.comment
                )}&rdquo;</p>
              </div>
              <div class="mt-5 border-t border-[var(--color-hairline)] pt-3">
                <p class="m-0 font-sans text-[15px] font-bold text-[var(--color-ink)]">${escapeHtml(
                  rev.customerLabel
                )}</p>
                <p class="type-caption mt-0.5 text-[var(--color-muted)]">Varian: ${escapeHtml(
                  rev.productName
                )}</p>
              </div>
            </article>
          `
          )
          .join('')}
      </div>
    </section>

    <section class="mx-auto max-w-[1425px] px-4 pb-8 md:px-7">
      ${renderAnimatedMap(true)}
    </section>
  `;
}

// DEDICATED REVIEWS PAGE (`/ulasan`)
export function renderReviewsView() {
  const state = store.getState();
  const filteredReviews =
    state.reviewFilter === 'Semua'
      ? state.reviews
      : state.reviews.filter((r) => r.productName === state.reviewFilter);

  const avgRating =
    state.reviews.length > 0
      ? (
          state.reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / state.reviews.length
        ).toFixed(1)
      : '5.0';

  return `
    <div class="mx-auto max-w-[1425px] px-4 py-10 md:px-7 md:py-14">
      <div class="placard-card placard-rivets !bg-[#FFE386] p-6 text-[#463721] md:p-10">
        <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <span class="inline-block rounded-full border border-[#463721] bg-[#FFFFFF] px-4 py-1 font-hand text-[16px] text-[#463721]">pengalaman pelanggan &amp; contoh data demo</span>
            <h1 class="type-display-lg mt-3 text-[#463721]">HALAMAN ULASAN PELANGGAN.</h1>
            <p class="type-body-md mt-2 max-w-2xl text-[#463721]">
              Baca pengalaman keluarga yang telah mencicipi madu murni kami atau tulis ulasan Anda langsung pada formulir di bawah.
            </p>
          </div>

          <div class="flex items-center gap-4 rounded-[16px] border-2 border-[#463721] bg-[#FFFFFF] px-6 py-4 text-[#463721]">
            <div>
              <span class="block font-poster text-[44px] font-bold leading-none">${avgRating} / 5.0</span>
              <span class="mt-1 block text-[13px] font-semibold">Dari total ${
                state.reviews.length
              } ulasan</span>
            </div>
            <span class="font-poster text-[24px] text-[#B9902E]">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          </div>
        </div>
      </div>

      ${
        state.bannerNotice
          ? `<div role="status" aria-live="polite" class="mt-6 rounded-[14px] border border-[#463721] bg-[#FFE386] px-5 py-3.5 font-sans text-[15px] font-bold text-[#463721]">${escapeHtml(
              state.bannerNotice
            )}</div>`
          : ''
      }

      <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <!-- Left: Write New Review Form -->
        <section class="lg:col-span-5" aria-label="Formulir Tulis Ulasan">
          <form id="public-review-form" class="placard-card bg-[var(--color-surface)] p-6">
            <h2 class="type-display-xs text-[var(--color-ink)]">TULIS ULASAN BARU</h2>
            <p class="type-body-sm mt-1 text-[var(--color-body)]">Ulasan Anda langsung tampil di halaman ini dan tersimpan di browser.</p>

            <div class="mt-4 space-y-4">
              <div>
                <label for="rev-name" class="mb-1 block font-sans text-[14px] font-semibold text-[var(--color-ink)]">Nama Lengkap / Panggilan</label>
                <input id="rev-name" type="text" required placeholder="Contoh: Ibu Sarah, Bandung" class="vs-input" />
              </div>

              <div>
                <label for="rev-product" class="mb-1 block font-sans text-[14px] font-semibold text-[var(--color-ink)]">Varian Madu yang Dicoba</label>
                <select id="rev-product" class="vs-input">
                  ${state.products
                    .map(
                      (p) =>
                        `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)} (${formatRupiah(
                          p.price
                        )})</option>`
                    )
                    .join('')}
                </select>
              </div>

              <div>
                <label for="rev-rating" class="mb-1 block font-sans text-[14px] font-semibold text-[var(--color-ink)]">Penilaian Bintang</label>
                <select id="rev-rating" class="vs-input">
                  <option value="5">5 Bintang (Sangat Puas)</option>
                  <option value="4">4 Bintang (Puas)</option>
                  <option value="3">3 Bintang (Cukup)</option>
                </select>
              </div>

              <div>
                <label for="rev-comment" class="mb-1 block font-sans text-[14px] font-semibold text-[var(--color-ink)]">Cerita Rasa &amp; Pengiriman</label>
                <textarea id="rev-comment" rows="3" required placeholder="Ceritakan rasa madu, kemasan stoples kaca, atau kecepatan pengiriman..." class="vs-input"></textarea>
              </div>

              <button type="submit" class="vs-btn-primary w-full">${kineticLabel(
                'Kirim Ulasan Sekarang'
              )}</button>
            </div>
          </form>
        </section>

        <!-- Right: Review Cards List -->
        <section class="space-y-4 lg:col-span-7" aria-label="Daftar Ulasan Pelanggan">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h2 class="type-display-xs text-[var(--color-ink)]">DAFTAR ULASAN (${
              filteredReviews.length
            })</h2>
            <a href="/produk" data-link class="vs-btn-ghost">Lihat Katalog Produk &rarr;</a>
          </div>

          <div class="grid grid-cols-1 gap-4">
            ${filteredReviews
              .map(
                (rev) => `
                <article class="placard-card bg-[var(--color-surface)] p-6">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-3">
                      <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#463721] font-poster text-[17px] font-bold text-[#FFE386]">${escapeHtml(
                        rev.initials
                      )}</span>
                      <div>
                        <p class="m-0 font-sans text-[15px] font-bold text-[var(--color-ink)]">${escapeHtml(
                          rev.customerLabel
                        )}</p>
                        <p class="type-caption text-[var(--color-muted)]">Produk: <strong>${escapeHtml(
                          rev.productName
                        )}</strong></p>
                      </div>
                    </div>
                    <div class="text-right">
                      <span class="block font-poster text-[18px] text-[#B9902E]">${'&#9733;'.repeat(
                        rev.rating
                      )}</span>
                      <span class="type-caption text-[var(--color-muted)]">${escapeHtml(
                        rev.dateLabel
                      )}</span>
                    </div>
                  </div>
                  <p class="type-body-md mt-4 text-[var(--color-ink)]">&ldquo;${escapeHtml(
                    rev.comment
                  )}&rdquo;</p>
                </article>
              `
              )
              .join('')}
          </div>
        </section>
      </div>
    </div>
  `;
}

export function renderCatalogView() {
  const state = store.getState();
  const q = state.catalogSearch.trim().toLowerCase();
  const filtered = state.products.filter((p) => {
    const matchCat = state.catalogCategory === 'Semua' || p.category === state.catalogCategory;
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.packContents.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  if (state.catalogSort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (state.catalogSort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (state.catalogSort === 'stock-desc') filtered.sort((a, b) => b.stock - a.stock);
  else filtered.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));

  return `
    <div class="mx-auto max-w-[1425px] px-3 py-8 sm:px-4 md:px-7 md:py-14">
      <div class="placard-card placard-rivets !bg-[#FFE386] p-5 text-[#463721] sm:p-6 md:p-10">
        <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <span class="inline-block rounded-full border border-[#463721] bg-[#FFFFFF] px-4 py-1 font-sans text-[12px] font-bold uppercase tracking-wider text-[#463721]">Katalog Belanja Foto Asli</span>
            <h1 class="type-display-lg mt-3 text-[#463721]">KATALOG MADU &amp; SARANG LEBAH.</h1>
            <p class="type-body-md mt-2 max-w-2xl text-[#463721]">
              Menampilkan ${filtered.length} dari total ${state.products.length} produk madu murni dalam ${
    state.categories.length
  } kategori. Pesan langsung ke WhatsApp <strong>${escapeHtml(
    formatDisplayPhone(state.settings.whatsappNumber)
  )}</strong>.
            </p>
          </div>

          <div class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[460px]">
            <div>
              <label for="catalog-search" class="mb-1 block font-sans text-[13px] font-bold text-[#463721]">Cari Varian Madu</label>
              <input id="catalog-search" type="search" value="${escapeHtml(
                state.catalogSearch
              )}" placeholder="Sialang, kaliandra, sarang, propolis..." class="vs-input !border-[#463721] !bg-[#FFFFFF] !text-[#463721]" />
            </div>
            <div>
              <label for="catalog-sort" class="mb-1 block font-sans text-[13px] font-bold text-[#463721]">Urutkan Harga / Stok</label>
              <select id="catalog-sort" class="vs-input !border-[#463721] !bg-[#FFFFFF] !text-[#463721]">
                <option value="featured" ${
                  state.catalogSort === 'featured' ? 'selected' : ''
                }>Favorit &amp; Terlaris</option>
                <option value="price-asc" ${
                  state.catalogSort === 'price-asc' ? 'selected' : ''
                }>Harga: Rendah ke Tinggi</option>
                <option value="price-desc" ${
                  state.catalogSort === 'price-desc' ? 'selected' : ''
                }>Harga: Tinggi ke Rendah</option>
                <option value="stock-desc" ${
                  state.catalogSort === 'stock-desc' ? 'selected' : ''
                }>Stok Terbanyak</option>
              </select>
            </div>
          </div>
        </div>

        <div role="group" aria-label="Filter berdasarkan kategori madu" class="mt-6 flex flex-wrap gap-2 border-t border-[#463721]/25 pt-5">
          <button type="button" data-action="filter-category" data-category="Semua" aria-pressed="${
            state.catalogCategory === 'Semua'
          }" class="min-h-[44px] rounded-full border px-4 font-sans text-[13px] font-bold ${
    state.catalogCategory === 'Semua'
      ? 'border-[#463721] bg-[#463721] text-[#FFE386]'
      : 'border-[#463721] bg-[#FFFFFF] text-[#463721]'
  }">Semua (${state.products.length})</button>
          ${state.categories
            .map((cat) => {
              const count = state.products.filter((p) => p.category === cat).length;
              const active = state.catalogCategory === cat;
              return `<button type="button" data-action="filter-category" data-category="${escapeHtml(
                cat
              )}" aria-pressed="${active}" class="min-h-[44px] rounded-full border px-4 font-sans text-[13px] font-bold ${
                active
                  ? 'border-[#463721] bg-[#463721] text-[#FFE386]'
                  : 'border-[#463721] bg-[#FFFFFF] text-[#463721]'
              }">${escapeHtml(cat)} (${count})</button>`;
            })
            .join('')}
        </div>
      </div>

      ${
        filtered.length === 0
          ? `<div class="placard-card mt-8 bg-[var(--color-surface)] p-8 md:p-12">
              <span class="inline-block rounded-full border border-[#463721] bg-[#FFE386] px-3 py-0.5 font-sans text-[12px] font-bold text-[#463721]">Pencarian Tidak Ditemukan</span>
              <h2 class="type-display-xs mt-4 text-[var(--color-ink)]">TIDAK ADA VARIAN &ldquo;${escapeHtml(
                state.catalogSearch.toUpperCase()
              )}&rdquo; DI KATEGORI ${escapeHtml(state.catalogCategory.toUpperCase())}.</h2>
              <button type="button" data-action="reset-catalog-filter" class="vs-btn-primary mt-6">${kineticLabel(
                'Reset Filter & Pencarian'
              )}</button>
            </div>`
          : `<div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              ${filtered.map((p) => renderProductCard(p)).join('')}
            </div>`
      }
    </div>
  `;
}

export function renderMapView() {
  const state = store.getState();
  return `
    <div class="mx-auto max-w-[1425px] px-4 py-10 md:px-7 md:py-14">
      <div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span class="inline-block rounded-full border border-[#463721] bg-[#FFE386] px-4 py-1 font-hand text-[17px] text-[#463721]">kunjungi rumah kemas &amp; toko fisik</span>
          <h1 class="type-display-lg mt-3 text-[var(--color-ink)]">PETA LOKASI: TOKO ${escapeHtml(
            state.settings.storeName.toUpperCase()
          )} DI SINI!</h1>
        </div>
        <a href="/produk" data-link class="vs-btn-primary">${kineticLabel('Pilih Madu Dulu')}</a>
      </div>
      ${renderAnimatedMap(false)}
    </div>
  `;
}

export function renderArticlesView(slug) {
  const state = store.getState();
  const published = state.articles.filter((a) => a.status === 'Terbit');
  const activeArticle = slug ? published.find((a) => a.slug === slug) : null;

  if (slug && activeArticle) {
    return `
      <article class="mx-auto max-w-[920px] px-4 py-10 md:px-7 md:py-14">
        <a href="/artikel" data-link class="inline-flex min-h-[44px] items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 font-sans text-[14px] font-semibold text-[var(--color-ink)] no-underline hover:bg-[#FFE386] hover:text-[#463721]">&larr; Kembali ke Semua Berita &amp; Tips</a>
        <div class="placard-card placard-rivets mt-6 bg-[var(--color-surface)] p-6 md:p-12">
          <span class="rounded-full bg-[#FFE386] px-3 py-1 font-sans text-[12px] font-bold text-[#463721]">${escapeHtml(
            activeArticle.category
          )} &middot; ${escapeHtml(activeArticle.publishedAt)}</span>
          <h1 class="type-display-md mt-4 text-[var(--color-ink)]">${escapeHtml(
            activeArticle.title
          )}</h1>
          <div class="mt-7 aspect-[16/9] w-full overflow-hidden rounded-[16px] bg-[#ECE2B1]">
            <img src="${escapeHtml(
              activeArticle.image
            )}" data-fallback="/images/photo-raw-honey.jpg" alt="${escapeHtml(
      activeArticle.title
    )}" width="960" height="540" class="smart-img h-full w-full object-cover" />
          </div>
          <div class="mt-8 space-y-5">
            ${activeArticle.content
              .map((p) => `<p class="type-body-lg text-[var(--color-body)]">${escapeHtml(p)}</p>`)
              .join('')}
          </div>
        </div>
      </article>
    `;
  }

  return `
    <div class="mx-auto max-w-[1425px] px-4 py-10 md:px-7 md:py-14">
      <div class="placard-card placard-rivets !bg-[#FFE386] p-6 text-[#463721] md:p-10">
        <span class="inline-block rounded-full border border-[#463721] bg-[#FFFFFF] px-4 py-1 font-sans text-[12px] font-bold uppercase text-[#463721]">Berita Kebun &amp; Edukasi Madu</span>
        <h1 class="type-display-lg mt-3 text-[#463721]">BERITA PANEN &amp; TIPS MADU MURNI.</h1>
      </div>
      <div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        ${published
          .map(
            (art) => `
            <article class="placard-card group flex flex-col justify-between overflow-hidden bg-[var(--color-surface)] p-4">
              <div>
                <div class="aspect-[16/9] w-full overflow-hidden rounded-[14px] bg-[#ECE2B1]">
                  <img src="${escapeHtml(
                    art.image
                  )}" data-fallback="/images/photo-raw-honey.jpg" alt="${escapeHtml(
              art.title
            )}" width="720" height="405" loading="lazy" class="smart-img h-full w-full object-cover" />
                </div>
                <div class="px-2 pt-5">
                  <span class="rounded-full bg-[#FFE386] px-3 py-0.5 font-sans text-[12px] font-bold text-[#463721]">${escapeHtml(
                    art.category
                  )} &middot; ${escapeHtml(art.publishedAt)}</span>
                  <h2 class="mt-3 font-sans text-[20px] font-bold leading-snug text-[var(--color-ink)]">
                    <a href="/artikel/${escapeHtml(
                      art.slug
                    )}" data-link class="text-inherit no-underline hover:underline">${escapeHtml(
              art.title
            )}</a>
                  </h2>
                  <p class="type-body-sm mt-2 text-[var(--color-body)]">${escapeHtml(
                    art.excerpt
                  )}</p>
                </div>
              </div>
              <div class="mt-4 border-t border-[var(--color-hairline)] px-2 pt-3">
                <a href="/artikel/${escapeHtml(
                  art.slug
                )}" data-link class="inline-flex min-h-[44px] items-center font-sans text-[14px] font-bold text-[var(--color-ink)] no-underline hover:underline">Baca Berita Lengkap &rarr;</a>
              </div>
            </article>
          `
          )
          .join('')}
      </div>
    </div>
  `;
}

export function renderAboutView() {
  const state = store.getState();
  return `
    <div class="mx-auto max-w-[1425px] px-4 py-10 md:px-7 md:py-14">
      <div class="placard-card placard-rivets grid grid-cols-1 items-center gap-8 bg-[var(--color-surface)] p-6 md:p-12 lg:grid-cols-12">
        <div class="lg:col-span-7">
          <span class="inline-block rounded-full border border-[#463721] bg-[#FFE386] px-4 py-1 font-hand text-[17px] text-[#463721]">cerita kebun &amp; komitmen kemurnian</span>
          <h1 class="type-display-lg mt-4 text-[var(--color-ink)]">DARI DAHAN POHON &amp; LEBAH PEKERJA KE MEJA KELUARGA.</h1>
          <p class="type-body-lg mt-4 text-[var(--color-body)]">
            <strong>${escapeHtml(
              state.settings.storeName
            )}</strong> bekerja langsung bersama pemanen pohon hutan lestari dan peternak lebah kebun bunga di Nusantara. Hubungi WhatsApp resmi kami di <strong>${escapeHtml(
    formatDisplayPhone(state.settings.whatsappNumber)
  )}</strong>.
          </p>
          <div class="mt-7 flex flex-wrap gap-3">
            <a href="/produk" data-link class="vs-btn-primary">${kineticLabel(
              'Lihat 20 Produk Madu'
            )}</a>
            <a href="/ulasan" data-link class="vs-btn-outline">${kineticLabel(
              'Baca Ulasan Pembeli'
            )}</a>
          </div>
        </div>
        <div class="lg:col-span-5">
          <div class="aspect-square overflow-hidden rounded-[18px] border border-[#463721]/30 bg-[#F8F8F0]">
            <img src="/images/photo-honey-hamper.jpg" data-fallback="/images/photo-raw-honey.jpg" alt="Paket stoples madu murni dan sarang lebah asli" width="680" height="680" class="smart-img h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <section class="mt-12" aria-label="Peta Lokasi Toko Madu">
        ${renderAnimatedMap(false)}
      </section>
    </div>
  `;
}

export function renderCartView() {
  return `
    <div class="mx-auto max-w-[960px] px-4 py-10 md:px-7 md:py-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span class="inline-block rounded-full border border-[#463721] bg-[#FFE386] px-4 py-1 font-hand text-[17px] text-[#463721]">ringkasan pesanan whatsapp</span>
          <h1 class="type-display-lg mt-3 text-[var(--color-ink)]">KERANJANG PANEN MADU.</h1>
        </div>
        <a href="/produk" data-link class="vs-btn-outline">${kineticLabel('Tambah Varian Lain')}</a>
      </div>
      <div class="mt-8">
        ${renderCartPanelHtml()}
      </div>
    </div>
  `;
}

// LOGIN PORTAL FOR ADMIN & OPERATOR (Clean Sans-Serif Readability)
export function renderLoginView() {
  const state = store.getState();
  return `
    <div class="mx-auto max-w-[560px] px-4 py-12 font-sans md:py-16">
      <div class="rounded-[18px] border border-[#463721]/30 bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
        <span class="inline-block rounded-full bg-[#FFE386] px-3.5 py-1 text-[12px] font-bold uppercase tracking-wider text-[#463721]">Portal Login Pengelola</span>
        <h1 class="mt-3 font-sans text-[24px] font-bold text-[var(--color-ink)] sm:text-[26px]">Login Admin &amp; Operator ${escapeHtml(
          state.settings.storeName
        )}</h1>
        <p class="mt-1 text-[14px] text-[var(--color-body)]">
          Pilih akun demo di bawah untuk mengelola katalog produk, berita baru, atau antrean pengemasan.
        </p>

        <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="rounded-[12px] border border-[#463721]/25 bg-[var(--color-surface-alt)]/45 p-3.5 text-[13px]">
            <p class="m-0 font-bold text-[var(--color-ink)]">1. Akun Operator Dapur</p>
            <p class="mt-1 text-[var(--color-muted)]">User: <code>operator</code> &middot; Pass: <code>operator</code></p>
            <button type="button" data-action="autofill-login" data-user="operator" data-pass="operator" class="mt-2.5 min-h-[38px] rounded-[8px] bg-[#463721] px-3 text-[13px] font-semibold text-[#ECE2B1]">Isi Akun Operator</button>
          </div>

          <div class="rounded-[12px] border border-[#463721]/35 bg-[#FFE386]/55 p-3.5 text-[13px]">
            <p class="m-0 font-bold text-[#463721]">2. Akun Admin Utama</p>
            <p class="mt-1 text-[#57452A]">User: <code>admin</code> &middot; Pass: <code>admin</code></p>
            <button type="button" data-action="autofill-login" data-user="admin" data-pass="admin" class="mt-2.5 min-h-[38px] rounded-[8px] bg-[#463721] px-3 text-[13px] font-semibold text-[#FFE386]">Isi Akun Admin</button>
          </div>
        </div>

        <div id="login-error-box" role="alert" class="mt-4 hidden rounded-[10px] border border-[#CB533B] bg-[#FFD6B0] px-4 py-3 text-[14px] font-medium text-[#2B1B10]"></div>

        <form id="role-login-form" class="mt-5 space-y-4">
          <div>
            <label for="login-username" class="mb-1.5 block text-[14px] font-semibold text-[var(--color-ink)]">Username</label>
            <input id="login-username" name="username" type="text" required placeholder="admin atau operator" class="vs-input" />
          </div>
          <div>
            <label for="login-password" class="mb-1.5 block text-[14px] font-semibold text-[var(--color-ink)]">Password</label>
            <input id="login-password" name="password" type="password" required placeholder="admin atau operator" class="vs-input" />
          </div>
          <button type="submit" class="min-h-[48px] w-full rounded-[10px] bg-[#463721] px-5 font-sans text-[15px] font-bold text-[#FFE386] hover:bg-[#5E4A2C]">
            Masuk Sekarang
          </button>
        </form>

        <div class="mt-6 border-t border-[var(--color-hairline)] pt-4 text-center">
          <a href="/" data-link class="text-[14px] font-semibold text-[var(--color-ink)] hover:underline">&larr; Kembali ke Halaman Depan Toko</a>
        </div>
      </div>
    </div>
  `;
}

// CLEAN READABLE OPERATOR PORTAL (`/operator`)
export function renderOperatorView() {
  const state = store.getState();
  const lowStock = state.products.filter((p) => p.stock <= 10).sort((a, b) => a.stock - b.stock);

  return `
    <div class="mx-auto max-w-[1425px] px-4 py-8 font-sans md:px-7 md:py-12">
      <div class="rounded-[18px] bg-[#463721] p-6 text-[#F8F8F0] md:p-8">
        <div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <span class="inline-block rounded-full bg-[#ECE2B1] px-3.5 py-1 text-[12px] font-bold uppercase text-[#463721]">Panel Operasional Dapur &amp; Pengemasan</span>
            <h1 class="mt-2 font-sans text-[24px] font-bold text-[#FFE386] sm:text-[28px]">Dashboard Operator: ${escapeHtml(
              state.settings.storeName
            )}</h1>
            <p class="mt-1 text-[14px] text-[#ECE2B1]">
              Proses antrean pesanan masuk, perbarui stok fisik harian, dan catat aktivitas pengemasan.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <a href="/" data-link class="inline-flex min-h-[44px] items-center rounded-[10px] border border-[#ECE2B1] px-4 text-[14px] font-semibold text-[#F8F8F0] no-underline hover:bg-[#ECE2B1] hover:text-[#463721]">Halaman User</a>
            ${
              state.authRole === 'admin'
                ? `<a href="/admin" data-link class="inline-flex min-h-[44px] items-center rounded-[10px] bg-[#FFE386] px-4 text-[14px] font-bold text-[#463721] no-underline">Dashboard Admin</a>`
                : ''
            }
            <button type="button" data-action="logout-role" class="inline-flex min-h-[44px] items-center rounded-[10px] bg-[#CB533B] px-4 text-[14px] font-bold text-[#FFFFFF]">Keluar</button>
          </div>
        </div>
      </div>

      ${
        state.bannerNotice
          ? `<div role="status" aria-live="polite" class="mt-5 rounded-[12px] border border-[#463721] bg-[#FFE386] px-5 py-3.5 text-[14px] font-bold text-[#463721]">${escapeHtml(
              state.bannerNotice
            )}</div>`
          : ''
      }

      <div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div class="rounded-[14px] border border-[#463721]/20 bg-[var(--color-surface)] p-5">
          <p class="m-0 text-[13px] font-semibold text-[var(--color-muted)]">Pesanan Aktif</p>
          <p class="mt-2 text-[28px] font-bold text-[var(--color-ink)]">${
            state.orders.filter((o) => o.status !== 'Selesai').length
          }</p>
        </div>
        <div class="rounded-[14px] border border-[#463721]/20 bg-[var(--color-surface)] p-5">
          <p class="m-0 text-[13px] font-semibold text-[var(--color-muted)]">Siap Kirim Kurir</p>
          <p class="mt-2 text-[28px] font-bold text-[#606112]">${
            state.orders.filter((o) => o.status === 'Siap Kirim').length
          }</p>
        </div>
        <div class="rounded-[14px] border border-[#463721]/20 bg-[var(--color-surface)] p-5">
          <p class="m-0 text-[13px] font-semibold text-[var(--color-muted)]">Stok Menipis (&le; 10)</p>
          <p class="mt-2 text-[28px] font-bold text-[#CB533B]">${lowStock.length} Item</p>
        </div>
        <div class="rounded-[14px] border border-[#463721] bg-[#FFE386] p-5 text-[#463721]">
          <p class="m-0 text-[13px] font-bold">Total Stoples Fisik</p>
          <p class="mt-2 text-[28px] font-bold">${state.products.reduce(
            (s, p) => s + p.stock,
            0
          )}</p>
        </div>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section class="space-y-5 lg:col-span-7" aria-label="Antrean Pesanan Operator">
          <div class="rounded-[16px] border border-[#463721]/25 bg-[var(--color-surface)] p-5 sm:p-6">
            <h2 class="m-0 text-[18px] font-bold text-[var(--color-ink)]">1. Antrean Pesanan &amp; Pengemasan (${
              state.orders.length
            })</h2>
            <div class="mt-4 space-y-3.5">
              ${state.orders
                .map(
                  (ord) => `
                  <div class="rounded-[12px] border border-[var(--color-border)]/25 bg-[var(--color-surface-alt)]/30 p-4">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <span class="text-[16px] font-bold text-[var(--color-ink)]">${escapeHtml(
                        ord.id
                      )} &middot; ${escapeHtml(ord.customerName)}</span>
                      <span class="rounded-full bg-[#463721] px-3 py-1 text-[12px] font-bold text-[#FFE386]">${escapeHtml(
                        ord.status
                      )}</span>
                    </div>
                    <p class="mt-1.5 text-[14px] font-medium text-[var(--color-ink)]">${escapeHtml(
                      ord.itemsSummary
                    )}</p>
                    <p class="mt-1 text-[16px] font-bold text-[#463721]">Total: ${formatRupiah(
                      ord.total
                    )}</p>
                    <p class="mt-1 text-[12px] text-[var(--color-muted)]">Catatan: ${escapeHtml(
                      ord.notes
                    )} (${escapeHtml(ord.createdAt)})</p>

                    <div class="mt-3 flex flex-wrap gap-2 border-t border-[var(--color-hairline)] pt-3">
                      ${['Baru Masuk', 'Sedang Dikemas', 'Siap Kirim', 'Selesai']
                        .map(
                          (st) => `
                          <button type="button" data-action="operator-order-status" data-order-id="${escapeHtml(
                            ord.id
                          )}" data-status="${st}" class="min-h-[38px] rounded-[8px] border px-3 text-[13px] font-semibold ${
                            ord.status === st
                              ? 'border-[#463721] bg-[#463721] text-[#FFE386]'
                              : 'border-[#463721]/35 bg-[var(--color-surface)] text-[var(--color-ink)]'
                          }">${st}</button>
                        `
                        )
                        .join('')}
                    </div>
                  </div>
                `
                )
                .join('')}
            </div>

            <form id="operator-manual-order-form" class="mt-6 border-t border-[var(--color-hairline)] pt-5">
              <h3 class="m-0 text-[16px] font-bold text-[var(--color-ink)]">Catat Pesanan Walk-In / WhatsApp Baru</h3>
              <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label for="op-cust" class="mb-1 block text-[13px] font-semibold">Nama Pembeli</label>
                  <input id="op-cust" type="text" required placeholder="Contoh: Ibu Sari" class="vs-input" />
                </div>
                <div>
                  <label for="op-total" class="mb-1 block text-[13px] font-semibold">Total Harga (Rp)</label>
                  <input id="op-total" type="number" min="0" required value="115000" class="vs-input" />
                </div>
              </div>
              <div class="mt-3">
                <label for="op-items" class="mb-1 block text-[13px] font-semibold">Rincian Item Madu</label>
                <input id="op-items" type="text" required placeholder="Contoh: 1x Madu Hutan Sialang 450g" class="vs-input" />
              </div>
              <div class="mt-3">
                <label for="op-notes" class="mb-1 block text-[13px] font-semibold">Catatan Pengemasan</label>
                <input id="op-notes" type="text" placeholder="Contoh: Kirim ojek instan pukul 15.00" class="vs-input" />
              </div>
              <button type="submit" class="mt-4 min-h-[44px] rounded-[10px] bg-[#463721] px-4 text-[14px] font-bold text-[#FFE386]">+ Masukkan ke Antrean Dapur</button>
            </form>
          </div>
        </section>

        <section class="space-y-5 lg:col-span-5" aria-label="Stok Opname Operator">
          <div class="rounded-[16px] border border-[#463721]/25 bg-[var(--color-surface)] p-5 sm:p-6">
            <h2 class="m-0 text-[18px] font-bold text-[var(--color-ink)]">2. Stok Opname Cepat Harian</h2>
            <p class="mt-1 text-[13px] text-[var(--color-body)]">Klik tombol + atau &minus; untuk menyesuaikan stok stoples fisik.</p>

            <div class="mt-4 max-h-[420px] space-y-2.5 overflow-y-auto pr-1">
              ${state.products
                .map(
                  (p) => `
                  <div class="flex items-center justify-between gap-2 rounded-[10px] border border-[var(--color-hairline)] bg-[var(--color-surface-alt)]/25 p-3">
                    <div>
                      <p class="m-0 text-[14px] font-bold text-[var(--color-ink)]">${escapeHtml(
                        p.name
                      )}</p>
                      <span class="text-[12px] font-semibold text-[#6E5838]">${formatRupiah(
                        p.price
                      )}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <button type="button" data-action="stock-delta" data-product-id="${escapeHtml(
                        p.id
                      )}" data-delta="-1" aria-label="Kurangi stok ${escapeHtml(
                    p.name
                  )}" class="h-9 w-9 rounded-[8px] border border-[#463721]/40 bg-[var(--color-surface)] font-bold">&minus;</button>
                      <span class="min-w-[40px] rounded-[8px] px-2 py-1 text-center text-[14px] font-bold ${
                        p.stock <= 10
                          ? 'bg-[#FFD6B0] text-[#2B1B10]'
                          : 'bg-[var(--color-surface-alt)] text-[var(--color-ink)]'
                      }">${p.stock}</span>
                      <button type="button" data-action="stock-delta" data-product-id="${escapeHtml(
                        p.id
                      )}" data-delta="1" aria-label="Tambah stok ${escapeHtml(
                    p.name
                  )}" class="h-9 w-9 rounded-[8px] border border-[#463721]/40 bg-[var(--color-surface)] font-bold">+</button>
                      <button type="button" data-action="stock-delta" data-product-id="${escapeHtml(
                        p.id
                      )}" data-delta="10" class="min-h-[36px] rounded-[8px] bg-[#463721] px-2.5 text-[12px] font-bold text-[#FFE386]">+10</button>
                    </div>
                  </div>
                `
                )
                .join('')}
            </div>
          </div>

          <div class="rounded-[16px] border border-[#463721]/25 bg-[var(--color-surface)] p-5 sm:p-6">
            <h2 class="m-0 text-[18px] font-bold text-[var(--color-ink)]">3. Log Aktivitas Dapur</h2>
            <form id="operator-log-form" class="mt-3 flex gap-2">
              <label for="op-log-input" class="sr-only">Catatan Log Operator</label>
              <input id="op-log-input" type="text" required placeholder="Catat hasil cek segel / panen..." class="vs-input" />
              <button type="submit" class="min-h-[44px] shrink-0 rounded-[10px] bg-[#463721] px-4 text-[14px] font-bold text-[#FFE386]">Catat</button>
            </form>
            <ul class="mt-4 max-h-[220px] list-none space-y-2 overflow-y-auto p-0 text-[13px]">
              ${state.operatorLogs
                .map(
                  (l) => `
                  <li class="rounded-[10px] bg-[var(--color-surface-alt)]/40 p-3">
                    <span class="font-bold text-[var(--color-ink)]">[${escapeHtml(
                      l.time
                    )}] ${escapeHtml(l.actor)}:</span>
                    <span class="text-[var(--color-body)]"> ${escapeHtml(l.note)}</span>
                  </li>
                `
                )
                .join('')}
            </ul>
          </div>
        </section>
      </div>
    </div>
  `;
}

// CLEAN HIGH-READABILITY ADMIN DASHBOARD (`/admin`) WITH FULL NEW NEWS/ARTICLE FORM
export function renderAdminView() {
  const state = store.getState();
  const inventoryValue = state.products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockProducts = state.products
    .filter((p) => p.stock <= 10)
    .sort((a, b) => a.stock - b.stock);
  const discountedProducts = state.products.filter(
    (p) => Number(p.originalPrice) > Number(p.price)
  );

  const editingArt = state.editingArticleId
    ? state.articles.find((a) => a.id === state.editingArticleId)
    : null;

  return `
    <div class="mx-auto max-w-[1425px] px-4 py-8 font-sans md:px-7 md:py-12">
      <!-- Top Clean Readable Admin Header -->
      <div class="rounded-[18px] bg-[#463721] p-6 text-[#F8F8F0] md:p-8">
        <div class="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <span class="inline-block rounded-full bg-[#FFE386] px-3.5 py-1 text-[12px] font-bold uppercase tracking-wider text-[#463721]">Panel Admin Pengelola Utama</span>
            <h1 class="mt-2 font-sans text-[24px] font-bold text-[#FFE386] sm:text-[28px]">Dashboard Admin: ${escapeHtml(
              state.settings.storeName
            )}</h1>
            <p class="mt-1 text-[14px] text-[#ECE2B1]">
              Kelola katalog 20+ produk, tambah berita/artikel baru, ubah nama toko, dan atur nomor WhatsApp (${escapeHtml(
                formatDisplayPhone(state.settings.whatsappNumber)
              )}).
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <button type="button" data-action="open-new-item-tab" class="inline-flex min-h-[44px] items-center rounded-[10px] bg-[#FFE386] px-4 text-[14px] font-bold text-[#463721] hover:bg-[#FFFFFF]">
              + Tambah Produk Baru
            </button>
            <button type="button" data-action="open-new-news-tab" class="inline-flex min-h-[44px] items-center rounded-[10px] bg-[#ECE2B1] px-4 text-[14px] font-bold text-[#463721] hover:bg-[#FFFFFF]">
              + Input Berita Baru
            </button>
            <a href="/operator" data-link class="inline-flex min-h-[44px] items-center rounded-[10px] border border-[#ECE2B1] px-4 text-[14px] font-semibold text-[#F8F8F0] no-underline hover:bg-[#ECE2B1] hover:text-[#463721]">Panel Operator</a>
            <a href="/produk" data-link class="inline-flex min-h-[44px] items-center rounded-[10px] border border-[#ECE2B1] px-4 text-[14px] font-semibold text-[#F8F8F0] no-underline hover:bg-[#ECE2B1] hover:text-[#463721]">Lihat Katalog</a>
            <button type="button" data-action="logout-role" class="inline-flex min-h-[44px] items-center rounded-[10px] bg-[#CB533B] px-4 text-[14px] font-bold text-[#FFFFFF]">Keluar</button>
          </div>
        </div>

        <form id="quick-store-name-form" class="mt-6 flex flex-col gap-3 border-t border-[#685336] pt-5 sm:flex-row sm:items-end">
          <div class="flex-1 sm:max-w-sm">
            <label for="quick-store-name" class="mb-1 block text-[13px] font-bold text-[#FFE386]">Ubah Cepat Nama Toko:</label>
            <input id="quick-store-name" type="text" value="${escapeHtml(
              state.settings.storeName
            )}" class="vs-input !min-h-[44px] !bg-[#FFFFFF] !text-[#463721]" />
          </div>
          <button type="submit" class="inline-flex min-h-[44px] items-center justify-center rounded-[10px] bg-[#FFE386] px-5 text-[14px] font-bold text-[#463721] hover:bg-[#FFFFFF]">
            Simpan Nama Toko
          </button>
        </form>
      </div>

      ${
        state.bannerNotice
          ? `<div role="status" aria-live="polite" class="mt-5 rounded-[12px] border border-[#463721] bg-[#FFE386] px-5 py-3.5 text-[14px] font-bold text-[#463721]">${escapeHtml(
              state.bannerNotice
            )}</div>`
          : ''
      }

      <!-- Clear Readable Admin Tabs -->
      <div role="tablist" aria-label="Menu Pengelolaan Admin" class="mt-7 flex flex-wrap gap-2 border-b border-[var(--color-hairline)] pb-4">
        ${[
          { id: 'ringkasan', label: `1. Ringkasan & Stok (${lowStockProducts.length} Menipis)` },
          { id: 'produk', label: `2. Kelola Produk (${state.products.length})` },
          { id: 'artikel', label: `3. Tambah & Kelola Berita (${state.articles.length})` },
          { id: 'pengaturan', label: '4. Pengaturan Toko & WA' },
        ]
          .map(
            (tab) => `<button type="button" role="tab" data-action="admin-tab" data-tab="${
              tab.id
            }" aria-selected="${
              state.adminTab === tab.id
            }" class="min-h-[44px] rounded-[10px] border px-4 text-[14px] font-bold transition-colors ${
              state.adminTab === tab.id
                ? 'border-[#463721] bg-[#463721] text-[#FFE386]'
                : 'border-[var(--color-border)]/35 bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)]'
            }">${tab.label}</button>`
          )
          .join('')}
      </div>

      <!-- TAB 1: RINGKASAN -->
      ${
        state.adminTab === 'ringkasan'
          ? `
          <section class="mt-6 space-y-6" aria-label="Ringkasan Persediaan Madu">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div class="rounded-[14px] border border-[#463721]/20 bg-[var(--color-surface)] p-5">
                <p class="m-0 text-[13px] font-semibold text-[var(--color-muted)]">Total Produk Aktif</p>
                <p class="mt-2 text-[30px] font-bold text-[var(--color-ink)]">${
                  state.products.length
                } Produk</p>
              </div>
              <div class="rounded-[14px] border border-[#463721]/20 bg-[var(--color-surface)] p-5">
                <p class="m-0 text-[13px] font-semibold text-[var(--color-muted)]">Total Kategori</p>
                <p class="mt-2 text-[30px] font-bold text-[var(--color-ink)]">${
                  state.categories.length
                } Kategori</p>
              </div>
              <div class="rounded-[14px] border border-[#463721]/20 bg-[var(--color-surface)] p-5">
                <p class="m-0 text-[13px] font-semibold text-[var(--color-muted)]">Total Berita &amp; Artikel</p>
                <p class="mt-2 text-[30px] font-bold text-[var(--color-ink)]">${
                  state.articles.length
                } Berita</p>
              </div>
              <div class="rounded-[14px] border border-[#463721] bg-[#FFE386] p-5 text-[#463721]">
                <p class="m-0 text-[13px] font-bold">Estimasi Nilai Persediaan</p>
                <p class="mt-2 text-[26px] font-bold leading-tight">${formatRupiah(
                  inventoryValue
                )}</p>
              </div>
            </div>

            <div class="rounded-[16px] border border-[#463721]/25 bg-[var(--color-surface)] p-6">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span class="inline-block rounded-full bg-[#CB533B] px-3 py-1 text-[12px] font-bold text-[#FFFFFF]">Promo &amp; Diskon Aktif</span>
                  <h2 class="mt-2 text-[20px] font-bold text-[var(--color-ink)]">Daftar Produk Sedang Diskon (${
                    discountedProducts.length
                  } Produk)</h2>
                </div>
                <button type="button" data-action="admin-tab" data-tab="produk" class="min-h-[42px] rounded-[10px] border border-[#463721] bg-[#FFE386] px-4 text-[13px] font-bold text-[#463721]">Atur Diskon Produk &rarr;</button>
              </div>

              ${
                discountedProducts.length === 0
                  ? `<p class="mt-4 text-[14px] text-[var(--color-muted)]">Belum ada produk yang sedang diskon. Buka tab <strong>2. Kelola Produk</strong> untuk mengaktifkan diskon 10%, 15%, atau 20%.</p>`
                  : `<div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                      ${discountedProducts
                        .map((item) => {
                          const pct =
                            Number(item.discountPercent) ||
                            Math.round(
                              ((item.originalPrice - item.price) / item.originalPrice) * 100
                            );
                          return `
                          <div class="flex flex-col justify-between rounded-[12px] border border-[#CB533B]/35 bg-[var(--color-surface-alt)]/30 p-4">
                            <div>
                              <div class="flex items-center justify-between gap-2">
                                <span class="rounded-full bg-[#CB533B] px-2.5 py-0.5 text-[11px] font-bold text-[#FFFFFF]">Diskon ${pct}%</span>
                                <span class="text-[12px] font-semibold text-[var(--color-muted)]">Stok ${
                                  item.stock
                                }</span>
                              </div>
                              <h3 class="mt-2.5 text-[16px] font-bold leading-snug text-[var(--color-ink)]">${escapeHtml(
                                item.name
                              )}</h3>
                              <div class="mt-1.5 flex flex-wrap items-baseline gap-2">
                                <span class="text-[17px] font-bold text-[#463721]">${formatRupiah(
                                  item.price
                                )}</span>
                                <span class="text-[13px] font-semibold text-[var(--color-muted)] line-through">${formatRupiah(
                                  item.originalPrice
                                )}</span>
                              </div>
                            </div>
                            <button type="button" data-action="set-product-discount" data-product-id="${escapeHtml(
                              item.id
                            )}" data-discount="0" class="mt-3 min-h-[38px] w-full rounded-[8px] border border-[#463721]/40 bg-[var(--color-surface)] text-[12px] font-bold text-[var(--color-ink)] hover:bg-[#463721] hover:text-[#FFE386]">Matikan Diskon</button>
                          </div>
                        `;
                        })
                        .join('')}
                    </div>`
              }
            </div>

            <div class="rounded-[16px] border border-[#463721]/25 bg-[var(--color-surface)] p-6">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span class="inline-block rounded-full bg-[#FFD6B0] px-3 py-1 text-[12px] font-bold text-[#2B1B10]">Peringatan Otomatis (Stok &le; 10)</span>
                  <h2 class="mt-2 text-[20px] font-bold text-[var(--color-ink)]">Daftar Produk Stok Menipis (${
                    lowStockProducts.length
                  } Produk)</h2>
                </div>
                <button type="button" data-action="open-new-news-tab" class="min-h-[42px] rounded-[10px] bg-[#463721] px-4 text-[13px] font-bold text-[#FFE386]">+ Input Berita Baru</button>
              </div>

              <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                ${lowStockProducts
                  .map(
                    (item) => `
                    <div class="flex flex-col justify-between rounded-[12px] border border-[var(--color-border)]/30 bg-[var(--color-surface-alt)]/30 p-4">
                      <div>
                        <div class="flex items-center justify-between gap-2">
                          <span class="rounded-full bg-[#463721] px-2.5 py-0.5 text-[11px] font-semibold text-[#FFE386]">${escapeHtml(
                            item.category
                          )}</span>
                          <span class="rounded-full bg-[#FFFFFF] px-2.5 py-0.5 text-[12px] font-bold text-[#CB533B]">Sisa ${
                            item.stock
                          }</span>
                        </div>
                        <h3 class="mt-2.5 text-[16px] font-bold leading-snug text-[var(--color-ink)]">${escapeHtml(
                          item.name
                        )}</h3>
                        <p class="mt-1 text-[15px] font-bold text-[#463721]">${formatRupiah(
                          item.price
                        )}</p>
                      </div>
                      <button type="button" data-action="stock-delta" data-product-id="${escapeHtml(
                        item.id
                      )}" data-delta="10" class="mt-3 min-h-[40px] w-full rounded-[8px] bg-[#463721] text-[13px] font-bold text-[#FFE386]">+10 Stok Cepat</button>
                    </div>
                  `
                  )
                  .join('')}
              </div>
            </div>
          </section>
        `
          : ''
      }

      <!-- TAB 2: KELOLA PRODUK -->
      ${
        state.adminTab === 'produk'
          ? `
          <section class="mt-6 space-y-6" aria-label="Kelola Produk Madu">
            <form id="admin-product-form" class="rounded-[16px] border border-[#463721]/25 bg-[var(--color-surface)] p-6">
              <h2 class="m-0 text-[20px] font-bold text-[var(--color-ink)]">Tambah Item Madu Baru ke Katalog</h2>
              <p class="mt-1 text-[13px] text-[var(--color-body)]">Pilih foto produk asli di bawah atau masukkan detail produk baru.</p>
              <input type="hidden" id="pf-image" value="/images/photo-raw-honey.jpg" />

              <div class="mt-4 rounded-[12px] border border-[var(--color-border)]/25 bg-[var(--color-surface-alt)]/30 p-4">
                <p class="m-0 text-[14px] font-bold text-[var(--color-ink)]">Pilih Foto Studio Produk Madu (Klik 1x):</p>
                <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  ${ART_PRESETS.map(
                    (preset, idx) => `
                    <button type="button" data-action="pick-art-preset" data-url="${escapeHtml(
                      preset.url
                    )}" class="art-preset-btn flex flex-col items-center rounded-[10px] border p-2 text-center ${
                      idx === 0
                        ? 'border-[#463721] bg-[#FFE386] text-[#463721]'
                        : 'border-[var(--color-border)]/25 bg-[var(--color-surface)]'
                    }">
                      <img src="${escapeHtml(preset.url)}" alt="${escapeHtml(
                      preset.label
                    )}" width="120" height="90" class="h-14 w-full rounded-[6px] object-cover" />
                      <span class="mt-1.5 text-[12px] font-semibold leading-tight">${escapeHtml(
                        preset.label
                      )}</span>
                    </button>
                  `
                  ).join('')}
                </div>
              </div>

              <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label for="pf-name" class="mb-1 block text-[13px] font-bold">Nama Produk Madu</label>
                  <input id="pf-name" type="text" required placeholder="Contoh: Madu Hutan Randu" class="vs-input" />
                </div>
                <div>
                  <label for="pf-category" class="mb-1 block text-[13px] font-bold">Kategori</label>
                  <select id="pf-category" class="vs-input">
                    ${state.categories
                      .map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
                      .join('')}
                  </select>
                </div>
                <div>
                  <label for="pf-price" class="mb-1 block text-[13px] font-bold">Harga Jual Aktif (Rp)</label>
                  <input id="pf-price" type="number" min="0" required value="95000" class="vs-input" />
                </div>
                <div>
                  <label for="pf-original-price" class="mb-1 block text-[13px] font-bold">Harga Coret / Normal (Opsional Diskon)</label>
                  <input id="pf-original-price" type="number" min="0" placeholder="Kosongkan jika tidak diskon" class="vs-input" />
                </div>
                <div>
                  <label for="pf-pack" class="mb-1 block text-[13px] font-bold">Kemasan / Isi</label>
                  <input id="pf-pack" type="text" required value="Stoples kaca segel 350 gram" class="vs-input" />
                </div>
                <div>
                  <label for="pf-weight" class="mb-1 block text-[13px] font-bold">Berat Bersih (gram)</label>
                  <input id="pf-weight" type="number" min="1" required value="350" class="vs-input" />
                </div>
                <div>
                  <label for="pf-stock" class="mb-1 block text-[13px] font-bold">Stok Tersedia</label>
                  <input id="pf-stock" type="number" min="0" required value="25" class="vs-input" />
                </div>
              </div>

              <div class="mt-4">
                <label for="pf-desc" class="mb-1 block text-[13px] font-bold">Deskripsi Produk</label>
                <textarea id="pf-desc" rows="2" required placeholder="Ceritakan rasa dan kemurnian madu ini..." class="vs-input"></textarea>
              </div>

              <div class="mt-5">
                <button type="submit" class="min-h-[46px] rounded-[10px] bg-[#463721] px-6 text-[14px] font-bold text-[#FFE386] hover:bg-[#5E4A2C]">
                  Simpan Produk ke Katalog
                </button>
              </div>
            </form>

            <div class="overflow-x-auto rounded-[16px] border border-[#463721]/25 bg-[var(--color-surface)]">
              <table class="w-full border-collapse text-left text-[14px]">
                <thead>
                  <tr class="border-b border-[var(--color-hairline)] bg-[var(--color-surface-alt)]/55 text-[13px] font-bold">
                    <th class="p-4">Produk</th>
                    <th class="p-4">Kategori</th>
                    <th class="p-4">Harga</th>
                    <th class="p-4">Atur Diskon</th>
                    <th class="p-4">Stok</th>
                    <th class="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.products
                    .map((p) => {
                      const hasDisc = Number(p.originalPrice) > Number(p.price);
                      const activePct = hasDisc
                        ? Number(p.discountPercent) ||
                          Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                        : 0;
                      return `
                      <tr class="border-b border-[var(--color-hairline)]">
                        <td class="p-4">
                          <div class="flex items-center gap-3">
                            <img src="${escapeHtml(p.image)}" alt="${escapeHtml(
                        p.name
                      )}" width="48" height="48" class="h-11 w-11 rounded-[8px] object-cover" />
                            <div>
                              <span class="block font-bold text-[var(--color-ink)]">${escapeHtml(
                                p.name
                              )}</span>
                              <span class="text-[12px] text-[var(--color-muted)]">${escapeHtml(
                                p.packContents
                              )}</span>
                            </div>
                          </div>
                        </td>
                        <td class="p-4">${escapeHtml(p.category)}</td>
                        <td class="p-4">
                          <span class="block font-bold text-[#463721]">${formatRupiah(
                            p.price
                          )}</span>
                          ${
                            hasDisc
                              ? `<span class="text-[12px] text-[var(--color-muted)] line-through">${formatRupiah(
                                  p.originalPrice
                                )}</span> <span class="rounded-full bg-[#CB533B] px-2 py-0.5 text-[11px] font-bold text-[#FFFFFF]">-${activePct}%</span>`
                              : `<span class="text-[11px] text-[var(--color-muted)]">Harga Normal</span>`
                          }
                        </td>
                        <td class="p-4">
                          <div class="flex flex-wrap gap-1">
                            ${[0, 10, 15, 20]
                              .map(
                                (pct) => `<button type="button" data-action="set-product-discount" data-product-id="${escapeHtml(
                                  p.id
                                )}" data-discount="${pct}" class="rounded-[6px] border px-2 py-1 text-[12px] font-bold ${
                                  activePct === pct
                                    ? 'border-[#463721] bg-[#463721] text-[#FFE386]'
                                    : 'border-[#463721]/30 bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[#FFE386]'
                                }">${pct === 0 ? '0%' : `-${pct}%`}</button>`
                              )
                              .join('')}
                          </div>
                        </td>
                        <td class="p-4">
                          <div class="inline-flex items-center gap-1.5">
                            <button type="button" data-action="stock-delta" data-product-id="${escapeHtml(
                              p.id
                            )}" data-delta="-1" class="h-8 w-8 rounded-[6px] border border-[#463721]/40 font-bold">&minus;</button>
                            <span class="min-w-[36px] text-center font-bold">${p.stock}</span>
                            <button type="button" data-action="stock-delta" data-product-id="${escapeHtml(
                              p.id
                            )}" data-delta="1" class="h-8 w-8 rounded-[6px] border border-[#463721]/40 font-bold">+</button>
                          </div>
                        </td>
                        <td class="p-4 text-right">
                          <button type="button" data-action="delete-product" data-product-id="${escapeHtml(
                            p.id
                          )}" class="rounded-[8px] border border-[#CB533B] px-3 py-1.5 text-[12px] font-bold text-[#CB533B] hover:bg-[#CB533B] hover:text-[#FFFFFF]">Hapus</button>
                        </td>
                      </tr>
                    `;
                    })
                    .join('')}
                </tbody>
              </table>
            </div>
          </section>
        `
          : ''
      }

      <!-- TAB 3: INPUT BERITA BARU & KELOLA ARTIKEL (COMPLETE NEWS BUILDER!) -->
      ${
        state.adminTab === 'artikel'
          ? `
          <section class="mt-6 space-y-6" aria-label="Tambah dan Kelola Berita">
            <!-- FORM INPUT BERITA / ARTIKEL BARU -->
            <form id="admin-article-form" class="rounded-[16px] border border-[#463721]/25 bg-[var(--color-surface)] p-6">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span class="inline-block rounded-full bg-[#FFE386] px-3 py-1 text-[12px] font-bold text-[#463721]">Form Microblog &amp; Berita Toko</span>
                  <h2 class="mt-2 text-[20px] font-bold text-[var(--color-ink)]">
                    ${
                      editingArt
                        ? `Edit Berita: ${escapeHtml(editingArt.title)}`
                        : 'Input Berita / Artikel Baru'
                    }
                  </h2>
                </div>
                ${
                  editingArt
                    ? `<button type="button" data-action="cancel-edit-article" class="rounded-[8px] border border-[#463721]/40 px-3 py-1.5 text-[13px] font-semibold">Batal Edit</button>`
                    : ''
                }
              </div>

              <input type="hidden" id="af-id" value="${escapeHtml(editingArt?.id || '')}" />
              <input type="hidden" id="af-image" value="${escapeHtml(
                editingArt?.image || '/images/photo-raw-honey.jpg'
              )}" />

              <div class="mt-4 rounded-[12px] border border-[var(--color-border)]/25 bg-[var(--color-surface-alt)]/30 p-4">
                <p class="m-0 text-[13px] font-bold text-[var(--color-ink)]">Pilih Foto Sampul Berita (Klik 1x):</p>
                <div class="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  ${ART_PRESETS.map((preset, idx) => {
                    const isSelected = editingArt
                      ? editingArt.image === preset.url
                      : idx === 0;
                    return `
                      <button type="button" data-action="pick-news-photo" data-url="${escapeHtml(
                        preset.url
                      )}" class="news-photo-btn flex flex-col items-center rounded-[10px] border p-2 text-center ${
                        isSelected
                          ? 'border-[#463721] bg-[#FFE386] text-[#463721]'
                          : 'border-[var(--color-border)]/25 bg-[var(--color-surface)]'
                      }">
                        <img src="${escapeHtml(preset.url)}" alt="${escapeHtml(
                      preset.label
                    )}" width="120" height="80" class="h-12 w-full rounded-[6px] object-cover" />
                        <span class="mt-1 text-[11px] font-semibold leading-tight">${escapeHtml(
                          preset.label
                        )}</span>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>

              <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div class="md:col-span-2">
                  <label for="af-title" class="mb-1 block text-[13px] font-bold">Judul Berita / Artikel Baru</label>
                  <input id="af-title" type="text" required value="${escapeHtml(
                    editingArt?.title || ''
                  )}" placeholder="Contoh: Panen Raya Madu Hutan Sialang Bulan Ini Tiba!" class="vs-input" />
                </div>

                <div>
                  <label for="af-category" class="mb-1 block text-[13px] font-bold">Kategori Berita</label>
                  <input id="af-category" type="text" required value="${escapeHtml(
                    editingArt?.category || 'Kabar Panen'
                  )}" placeholder="Kabar Panen / Tips Kesehatan" class="vs-input" />
                </div>

                <div>
                  <label for="af-status" class="mb-1 block text-[13px] font-bold">Status Publikasi</label>
                  <select id="af-status" class="vs-input">
                    <option value="Terbit" ${
                      editingArt?.status !== 'Draf' ? 'selected' : ''
                    }>Terbit (Langsung Tampil di Publik)</option>
                    <option value="Draf" ${
                      editingArt?.status === 'Draf' ? 'selected' : ''
                    }>Draf (Simpan Internal)</option>
                  </select>
                </div>

                <div>
                  <label for="af-read" class="mb-1 block text-[13px] font-bold">Estimasi Baca (Menit)</label>
                  <input id="af-read" type="number" min="1" required value="${
                    editingArt?.readMinutes || 3
                  }" class="vs-input" />
                </div>

                <div>
                  <label for="af-date" class="mb-1 block text-[13px] font-bold">Tanggal Terbit</label>
                  <input id="af-date" type="date" required value="${escapeHtml(
                    editingArt?.publishedAt || '2026-11-25'
                  )}" class="vs-input" />
                </div>
              </div>

              <div class="mt-4">
                <label for="af-excerpt" class="mb-1 block text-[13px] font-bold">Ringkasan Singkat Berita</label>
                <textarea id="af-excerpt" rows="2" required placeholder="Tulis ringkasan 1-2 kalimat yang tampil di kartu berita..." class="vs-input">${escapeHtml(
                  editingArt?.excerpt || ''
                )}</textarea>
              </div>

              <div class="mt-4">
                <label for="af-content" class="mb-1 block text-[13px] font-bold">Isi Lengkap Berita / Artikel (Pisahkan paragraf dengan baris baru)</label>
                <textarea id="af-content" rows="4" required placeholder="Tulis isi lengkap berita atau tips madu di sini..." class="vs-input">${escapeHtml(
                  editingArt ? editingArt.content.join('\n\n') : ''
                )}</textarea>
              </div>

              <div class="mt-5 flex flex-wrap gap-3">
                <button type="submit" class="min-h-[46px] rounded-[10px] bg-[#463721] px-6 text-[14px] font-bold text-[#FFE386] hover:bg-[#5E4A2C]">
                  ${editingArt ? 'Simpan Perubahan Berita' : '+ Terbitkan Berita Baru'}
                </button>
              </div>
            </form>

            <!-- Daftar Berita Existing -->
            <div class="space-y-3">
              <h3 class="m-0 text-[18px] font-bold text-[var(--color-ink)]">Daftar Berita &amp; Artikel (${
                state.articles.length
              })</h3>
              ${state.articles
                .map(
                  (art) => `
                  <div class="flex flex-col justify-between gap-4 rounded-[14px] border border-[#463721]/20 bg-[var(--color-surface)] p-4 sm:p-5 md:flex-row md:items-center">
                    <div class="flex items-start gap-3.5">
                      <img src="${escapeHtml(art.image)}" alt="${escapeHtml(
                    art.title
                  )}" width="72" height="54" class="h-14 w-20 shrink-0 rounded-[8px] object-cover" />
                      <div>
                        <div class="flex flex-wrap items-center gap-2">
                          <span class="rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            art.status === 'Terbit'
                              ? 'bg-[#FFE386] text-[#463721]'
                              : 'bg-[#ECE2B1] text-[#57452A]'
                          }">${escapeHtml(art.status)}</span>
                          <span class="text-[12px] font-semibold text-[var(--color-muted)]">${escapeHtml(
                            art.category
                          )} &middot; ${escapeHtml(art.publishedAt)}</span>
                        </div>
                        <h4 class="mt-1 text-[16px] font-bold text-[var(--color-ink)]">${escapeHtml(
                          art.title
                        )}</h4>
                        <p class="mt-0.5 text-[13px] text-[var(--color-body)]">${escapeHtml(
                          art.excerpt
                        )}</p>
                      </div>
                    </div>

                    <div class="flex shrink-0 flex-wrap items-center gap-2">
                      <button type="button" data-action="edit-article" data-article-id="${escapeHtml(
                        art.id
                      )}" class="min-h-[38px] rounded-[8px] border border-[#463721]/40 px-3 text-[13px] font-semibold text-[var(--color-ink)] hover:bg-[#ECE2B1]">Edit</button>
                      <button type="button" data-action="toggle-article" data-article-id="${escapeHtml(
                        art.id
                      )}" class="min-h-[38px] rounded-[8px] border border-[#463721]/40 px-3 text-[13px] font-semibold text-[var(--color-ink)] hover:bg-[#ECE2B1]">Jadikan ${
                    art.status === 'Terbit' ? 'Draf' : 'Terbit'
                  }</button>
                      <button type="button" data-action="delete-article" data-article-id="${escapeHtml(
                        art.id
                      )}" class="min-h-[38px] rounded-[8px] border border-[#CB533B] px-3 text-[13px] font-bold text-[#CB533B] hover:bg-[#CB533B] hover:text-[#FFFFFF]">Hapus</button>
                    </div>
                  </div>
                `
                )
                .join('')}
            </div>
          </section>
        `
          : ''
      }

      <!-- TAB 4: PENGATURAN TOKO -->
      ${
        state.adminTab === 'pengaturan'
          ? `
          <section class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12" aria-label="Pengaturan Toko">
            <form id="admin-settings-form" class="rounded-[16px] border border-[#463721]/25 bg-[var(--color-surface)] p-6 lg:col-span-8">
              <h2 class="m-0 text-[20px] font-bold text-[var(--color-ink)]">Pengaturan Nama Toko &amp; Nomor WhatsApp</h2>
              <div class="mt-5 space-y-4">
                <div>
                  <label for="st-name" class="mb-1 block text-[13px] font-bold">Nama Toko Madu</label>
                  <input id="st-name" type="text" required value="${escapeHtml(
                    state.settings.storeName
                  )}" class="vs-input" />
                </div>
                <div>
                  <label for="st-wa" class="mb-1 block text-[13px] font-bold">Nomor WhatsApp Checkout (08... atau 628...)</label>
                  <input id="st-wa" type="tel" required value="${escapeHtml(
                    state.settings.whatsappNumber
                  )}" class="vs-input" />
                </div>
                <div>
                  <label for="st-map" class="mb-1 block text-[13px] font-bold">Tautan Google Maps</label>
                  <input id="st-map" type="url" required value="${escapeHtml(
                    state.settings.mapsShortUrl
                  )}" class="vs-input" />
                </div>
              </div>
              <button type="submit" class="mt-6 min-h-[46px] rounded-[10px] bg-[#463721] px-6 text-[14px] font-bold text-[#FFE386]">
                Simpan Pengaturan
              </button>
            </form>

            <div class="rounded-[16px] border border-[#463721]/25 bg-[var(--color-surface-alt)]/45 p-6 lg:col-span-4">
              <h3 class="m-0 text-[18px] font-bold text-[var(--color-ink)]">Pulihkan Data Awal</h3>
              <p class="mt-2 text-[13px] text-[var(--color-body)]">Kembalikan 20 produk foto asli, berita awal, pesanan operator, nomor WA 082236010244, dan nama toko &ldquo;Madu&rdquo;.</p>
              <button type="button" data-action="reset-demo-data" class="mt-6 min-h-[44px] w-full rounded-[10px] border border-[#463721] bg-[#FFFFFF] text-[14px] font-bold text-[#463721] hover:bg-[#FFE386]">
                Pulihkan Data Awal
              </button>
            </div>
          </section>
        `
          : ''
      }
    </div>
  `;
}
