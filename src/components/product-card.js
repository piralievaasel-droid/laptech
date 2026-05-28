import { formatPrice } from '../utils/format';
import { state } from '../state';
export function createProductCard(product, showCompare = true) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
    <img src="${product.image_url}" alt="${product.title}" loading="lazy" />
    <div class="card-body">
      <div class="card-header">
        <span class="brand-pill">${product.brand}</span>
        <strong>${product.title}</strong>
      </div>
      <p class="card-description">${product.description}</p>
      <ul class="spec-list">
        <li>${product.cpu}</li>
        <li>${product.ram}</li>
        <li>${product.storage}</li>
        <li>${product.gpu}</li>
      </ul>
      <div class="card-meta">
        <span class="price">${formatPrice(product.price)}</span>
        <button class="button button-primary" data-action="buy" data-id="${product.id}">В корзину</button>
      </div>
      ${showCompare ? `<label class="compare-checkbox"><input type="checkbox" data-action="compare" data-id="${product.id}" ${state.compareIds.includes(product.id) ? 'checked' : ''} /> Сравнить</label>` : ''}
    </div>
  `;
    return card;
}
