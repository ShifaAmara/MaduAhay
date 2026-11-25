export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function slugify(text) {
  return String(text ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function normalizeWhatsAppNumber(rawPhone) {
  const digits = String(rawPhone || '').replace(/\D/g, '');
  if (!digits) return '6282236010244';
  if (digits.startsWith('0')) {
    return '62' + digits.slice(1);
  }
  return digits;
}

export function formatDisplayPhone(rawPhone) {
  const digits = String(rawPhone || '').replace(/\D/g, '');
  if (digits.startsWith('628')) {
    return '08' + digits.slice(3);
  }
  return digits || '082236010244';
}

export function buildWhatsAppCheckoutUrl(params) {
  const cleanPhone = normalizeWhatsAppNumber(params.whatsappNumber);
  const items = Array.isArray(params.items) ? params.items : [];
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const lines = [
    `Halo toko *${params.storeName || 'Madu'}*, saya ingin memesan produk madu murni:`,
    '',
  ];

  items.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    lines.push(
      `${index + 1}. *${item.name}* (${item.packContents})`,
      `   ${item.quantity} item x ${formatRupiah(item.price)} = *${formatRupiah(subtotal)}*`
    );
  });

  if (items.length > 0) {
    lines.push('', `*Total Pesanan: ${formatRupiah(total)}*`);
  }

  if (params.customerName && String(params.customerName).trim()) {
    lines.push(`Nama Pemesan: ${String(params.customerName).trim()}`);
  }
  if (params.deliveryNotes && String(params.deliveryNotes).trim()) {
    lines.push(`Catatan / Alamat: ${String(params.deliveryNotes).trim()}`);
  }

  lines.push('', 'Mohon info ketersediaan stok dan ongkos kirim. Terima kasih!');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
}
