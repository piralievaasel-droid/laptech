export function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'KZT',
        maximumFractionDigits: 0,
    }).format(price);
}
export function truncate(text, length = 120) {
    return text.length > length ? text.slice(0, length - 1) + '…' : text;
}
