import assert from 'node:assert/strict';
import {
  ART_PRESETS,
  INITIAL_ARTICLES,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
} from '../src/data.js';
import {
  buildWhatsAppCheckoutUrl,
  formatDisplayPhone,
  formatRupiah,
  normalizeWhatsAppNumber,
} from '../src/utils.js';

// 1. Default store name is "MaduAhay" and WhatsApp number is 082236010244
assert.equal(INITIAL_SETTINGS.storeName, 'MaduAhay', 'Default store name must be MaduAhay');
assert.equal(INITIAL_SETTINGS.whatsappNumber, '082236010244', 'Default WA must be 082236010244');
assert.equal(
  normalizeWhatsAppNumber('08 2236010244'),
  '6282236010244',
  'Must normalize 082236010244 to 6282236010244'
);
assert.equal(formatDisplayPhone('6282236010244'), '082236010244');

// 2. Verify all 20 products use realistic studio photos (no cartoon SVG primary image)
assert.equal(INITIAL_CATEGORIES.length, 5, 'Must have 5 honey categories');
assert.equal(INITIAL_PRODUCTS.length, 20, 'Must have 20 honey products');
for (const p of INITIAL_PRODUCTS) {
  assert.ok(
    p.image.startsWith('/images/photo-'),
    `Product ${p.name} must use realistic studio photo, got ${p.image}`
  );
}
assert.equal(ART_PRESETS.length, 6, 'Must provide 6 realistic studio honey photo presets');

// 3. Verify initial operator order queue exists
assert.ok(INITIAL_ORDERS.length >= 3, 'Must have initial orders for Operator & Admin portals');

// 4. Verify at least 2 products with stock <= 10 for low-stock alert & 3 discounted products
const lowStock = INITIAL_PRODUCTS.filter((p) => p.stock <= 10);
assert.ok(lowStock.length >= 2, 'Must have at least 2 products with stock <= 10');

const discounted = INITIAL_PRODUCTS.filter((p) => Number(p.originalPrice) > Number(p.price));
assert.equal(discounted.length, 3, 'Must have 3 initial discounted products');
for (const d of discounted) {
  assert.ok(d.discountPercent >= 10 && d.discountPercent <= 50, 'Discount percent must be valid');
}

// 5. Verify at least 4 published honey articles
assert.ok(INITIAL_ARTICLES.length >= 4, 'Must have at least 4 honey articles');

// 6. Verify WhatsApp checkout URL builder targets 6282236010244
const waUrl = buildWhatsAppCheckoutUrl({
  whatsappNumber: INITIAL_SETTINGS.whatsappNumber,
  storeName: INITIAL_SETTINGS.storeName,
  items: [
    {
      name: 'Madu Hutan Pohon Sialang',
      packContents: 'Botol kaca segel 450 gram',
      quantity: 2,
      price: 115000,
    },
  ],
  customerName: 'Rina',
});

assert.ok(
  waUrl.startsWith('https://wa.me/6282236010244?text='),
  'WA link must target 6282236010244'
);
assert.ok(decodeURIComponent(waUrl).includes(formatRupiah(230000)), 'WA text must include total');

console.log('ALL REAL-PHOTO & 082236010244 MADU STORE CHECKS PASSED');
