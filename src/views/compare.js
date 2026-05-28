import { getProductById } from '../db';
import { formatPrice } from '../utils/format';
import { state } from '../state';
export const comparePage = {
    render: async () => {
        const container = document.createElement('section');
        container.className = 'page-section page-compare';
        container.innerHTML = `
      <div class="section-head">
        <h2>Сравнение</h2>
        <p>Выберите до трёх моделей и сравните характеристики в одном окне.</p>
      </div>
      <div class="compare-grid"></div>
    `;
        const compareGrid = container.querySelector('.compare-grid');
        if (!state.compareIds.length) {
            compareGrid.innerHTML = '<div class="empty-state">Вы ещё не добавили модели для сравнения.</div>';
            return container;
        }
        const products = await Promise.all(state.compareIds.map((id) => getProductById(id)));
        const available = products.filter(Boolean);
        if (!available.length) {
            compareGrid.innerHTML = '<div class="empty-state">Выбранные товары не доступны.</div>';
            return container;
        }
        const headerRow = `
      <div class="compare-card compare-header">
        <div>Параметр</div>
        ${available.map((product) => `<div>${product.title}</div>`).join('')}
      </div>
    `;
        const rows = [
            { label: 'Бренд', value: (p) => p.brand },
            { label: 'Процессор', value: (p) => p.cpu },
            { label: 'Оперативная память', value: (p) => p.ram },
            { label: 'Накопитель', value: (p) => p.storage },
            { label: 'Видеокарта', value: (p) => p.gpu },
            { label: 'Экран', value: (p) => p.display_size },
            { label: 'Цена', value: (p) => formatPrice(p.price) },
            { label: 'Наличие', value: (p) => `${p.stock} шт.` },
        ];
        compareGrid.innerHTML = headerRow + rows.map((row) => `
      <div class="compare-card">
        <div>${row.label}</div>
        ${available.map((product) => `<div>${row.value(product)}</div>`).join('')}
      </div>
    `).join('');
        return container;
    },
};
