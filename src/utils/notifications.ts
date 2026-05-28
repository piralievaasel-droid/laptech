const toastContainer = document.createElement('div')
toastContainer.id = 'toast'
toastContainer.className = 'toast-container'
document.body.appendChild(toastContainer)

export function showToast(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  const toast = document.createElement('div')
  toast.className = `toast-message toast-${type}`
  toast.textContent = message
  toastContainer.appendChild(toast)

  requestAnimationFrame(() => {
    toast.classList.add('toast-visible')
  })

  setTimeout(() => {
    toast.classList.remove('toast-visible')
    toast.addEventListener('transitionend', () => toast.remove(), { once: true })
  }, 3200)
}
