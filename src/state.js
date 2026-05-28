const STORAGE_KEY = 'laptech-session';
const defaultSession = {
    currentUser: null,
    cart: [],
    compareIds: [],
};
export const state = {
    currentUser: defaultSession.currentUser,
    cart: defaultSession.cart,
    compareIds: defaultSession.compareIds,
    loadSession() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return;
        try {
            const parsed = JSON.parse(raw);
            this.currentUser = parsed.currentUser;
            this.cart = parsed.cart || [];
            this.compareIds = parsed.compareIds || [];
        }
        catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    },
    saveSession() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            currentUser: this.currentUser,
            cart: this.cart,
            compareIds: this.compareIds,
        }));
    },
    login(user) {
        this.currentUser = { ...user, password: '' };
        this.saveSession();
    },
    logout() {
        this.currentUser = null;
        this.cart = [];
        this.compareIds = [];
        this.saveSession();
    },
    addToCart(product) {
        const existing = this.cart.find((item) => item.product_id === product.id);
        if (existing) {
            existing.quantity = Math.min(existing.quantity + 1, product.stock);
            this.saveSession();
            return 'exists';
        }
        this.cart.push({
            id: crypto.randomUUID(),
            product_id: product.id,
            product,
            quantity: 1,
        });
        this.saveSession();
        return 'added';
    },
    updateCartQuantity(itemId, quantity) {
        const item = this.cart.find((entry) => entry.id === itemId);
        if (!item)
            return;
        item.quantity = Math.max(1, Math.min(quantity, item.product.stock));
        this.saveSession();
    },
    removeFromCart(itemId) {
        this.cart = this.cart.filter((item) => item.id !== itemId);
        this.saveSession();
    },
    clearCart() {
        this.cart = [];
        this.saveSession();
    },
    toggleCompare(productId) {
        if (this.compareIds.includes(productId)) {
            this.compareIds = this.compareIds.filter((id) => id !== productId);
        }
        else {
            if (this.compareIds.length < 3) {
                this.compareIds = [...this.compareIds, productId];
            }
        }
        this.saveSession();
    },
};
