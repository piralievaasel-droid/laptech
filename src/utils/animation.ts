export function animateTransition(container: HTMLElement) {
  container.classList.remove('fade-in')
  void container.offsetWidth
  container.classList.add('fade-in')
}
