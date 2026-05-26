document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');

    // Функция обновления корзины
    window.updateCartDisplay = function() {
        const cartItemsList = document.getElementById('cart-items') || document.getElementById('cart-page-items');
        const cartTotal = document.getElementById('cart-total') || document.getElementById('cart-total-page');
        const cartCount = document.getElementById('cart-count');

        if (!cartItemsList) return;

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cartCount) cartCount.textContent = cart.length;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p>Ваша корзина пуста.</p>';
            if (cartTotal) cartTotal.textContent = '0.00';
            return;
        }

        let total = 0;
        cartItemsList.innerHTML = ''; 
        cart.forEach((item, index) => {
            const price = parseFloat(item.price) || 0;
            total += price;
            cartItemsList.innerHTML += `
                <div class="cart-item">
                    <p>${item.name || 'Товар'} — ${price} руб. 
                    <button class="remove-btn" data-index="${index}">Удалить</button></p>
                </div>
            `;
        });
        
        if (cartTotal) cartTotal.textContent = total.toFixed(2);
    };

    // Обработчик кликов
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-button') && cartModal) {
            cartModal.classList.remove('active');
        }
        
        if (e.target.classList.contains('remove-btn')) {
            const index = e.target.dataset.index;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
        
        const btn = e.target.closest('.add-to-cart-btn');
        if (btn) {
            const productCard = btn.closest('.product-item');
            if (productCard) {
                const name = productCard.getAttribute('data-name');
                const price = productCard.getAttribute('data-price');
                if (name && price) {
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    cart.push({ name, price });
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartDisplay();
                    alert(`${name} добавлено!`);
                }
            }
        }
    });

    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', () => {
            updateCartDisplay();
            cartModal.classList.toggle('active');
        });
    }

    // Авто-обновление при загрузке
    updateCartDisplay();

    // Загрузка товаров
    async function loadProducts() {
        if (!productContainer) return;
        try {
            const response = await fetch('http://localhost:3000/api/products');
            const data = await response.json();
            productContainer.innerHTML = data.map(p => `
                <div class="product-item" data-name="${p.name}" data-price="${p.price}">
                    <img src="img/${p.image_url}" alt="${p.name}">
                    <h3>${p.name}</h3>
                    <span class="price">${p.price} руб.</span>
                    <button class="add-to-cart-btn">В корзину</button>
                </div>
            `).join('');
        } catch (err) {
            console.error("Ошибка загрузки товаров:", err);
        }
    }
    loadProducts();
});

// Глобальная функция для кнопки Оформить заказ
async function checkout() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Пожалуйста, войдите в систему.");
        window.location.href = 'login.html';
        return;
    }
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return alert("Корзина пуста!");

    try {
        const response = await fetch('http://localhost:3000/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ items: cart })
        });
        if (response.ok) {
            alert("Заказ оформлен!");
            localStorage.removeItem('cart');
            window.location.href = 'cart.html';
        } else {
            alert("Ошибка оформления.");
        }
    } catch (e) {
        console.error("Ошибка сети:", e);
    }
}