import { state } from '../state';
import { showToast } from '../utils/notifications';
export const profilePage = {
    render: async () => {
        const container = document.createElement('section');
        container.className = 'page-section page-profile';
        if (!state.currentUser) {
            container.innerHTML = `
        <div class="section-head">
          <h2>Профиль</h2>
          <p>Для доступа к личным данным и изменению профиля войдите в систему.</p>
        </div>
        <div class="empty-state">
          <p>Вы гость. <a href="#auth">Войдите или зарегистрируйтесь</a>, чтобы управлять своим профилем и отслеживать заказы.</p>
        </div>
      `;
            return container;
        }
        container.innerHTML = `
      <div class="section-head">
        <h2>Мой профиль</h2>
        <p>Управляйте своими данными, смотрите контактную поддержку и сохраняйте профиль в своём браузере.</p>
      </div>
      <div class="profile-grid">
        <div class="profile-card">
          <h3>Данные аккаунта</h3>
          <form id="profile-form" class="profile-form">
            <label>Имя<input name="name" value="${state.currentUser.name}" required /></label>
            <label>Почта<input type="email" name="email" value="${state.currentUser.email}" required /></label>
            <button type="submit" class="button button-primary">Сохранить профиль</button>
            <div class="alert" id="profile-alert"></div>
          </form>
        </div>
        <div class="profile-card profile-support">
          <h3>Связаться с поддержкой</h3>
          <p>Если нужна помощь с заказом, оплатой или товарами, напишите продавцу или администратору.</p>
          <p><strong>Email поддержки:</strong> <a href="mailto:support@laptech.kz">support@laptech.kz</a></p>
          <p><strong>Email администратора:</strong> <a href="mailto:admin@laptech.kz">admin@laptech.kz</a></p>
          <p>Мы ответим в течение рабочего дня.</p>
        </div>
      </div>
    `;
        const form = container.querySelector('#profile-form');
        const alertBox = container.querySelector('#profile-alert');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            alertBox.textContent = '';
            const formData = new FormData(form);
            const name = String(formData.get('name') || '').trim();
            const email = String(formData.get('email') || '').trim();
            if (!name || !email) {
                alertBox.textContent = 'Заполните все поля профиля.';
                return;
            }
            state.currentUser = {
                ...state.currentUser,
                name,
                email,
            };
            state.saveSession();
            alertBox.textContent = 'Профиль обновлён.';
            showToast('Профиль успешно сохранён', 'success');
        });
        return container;
    },
};
