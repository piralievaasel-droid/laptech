export function animateTransition(container) {
    container.classList.remove('fade-in');
    void container.offsetWidth;
    container.classList.add('fade-in');
}
