import { state } from '../state';
import { showToast } from './notifications';
export function showProfileModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    const modal = document.createElement('div');
    modal.className = 'modal-profile';
    modal.innerHTML = `
    <div class="modal-header">
      <h2>Мой профиль</h2>
      <button type="button" class="modal-close" aria-label="Закрыть">&times;</button>
    </div>
    <div class="modal-body">
      <form id="profile-form-modal" class="profile-form-modal">
        <label>Имя<input name="name" value="${state.currentUser?.name || ''}" required /></label>
        <label>Почта<input type="email" name="email" value="${state.currentUser?.email || ''}" required /></label>
        <button type="submit" class="button button-primary">Сохранить</button>
        <div class="alert" id="profile-alert-modal"></div>
      </form>
      <div class="profile-support-modal">
        <h3>Поддержка</h3>
        <p><strong>Email:</strong> <a href="mailto:support@laptech.kz">support@laptech.kz</a></p>
      </div>
    </div>
  `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => overlay.remove());
    }
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay)
            overlay.remove();
    });
    const form = modal.querySelector('#profile-form-modal');
    const alertBox = modal.querySelector('#profile-alert-modal');
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
        setTimeout(() => overlay.remove(), 1500);
    });
}
