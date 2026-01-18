document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor click behavior

            const targetId = this.getAttribute('href'); // Get the target section ID
            const targetSection = document.querySelector(targetId); // Select the target section

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth' // Enable smooth scrolling
                });
            }
        });
    });

    // --- Search Functionality ---
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const productGrid = document.querySelector('.product-grid');
    const productItems = document.querySelectorAll('.product-item'); // Get all product items

    // Function to filter products based on search query
    function filterProducts() {
        const query = searchInput.value.toLowerCase(); // Get search query and convert to lowercase

        productItems.forEach(item => {
            const productName = item.querySelector('h3').textContent.toLowerCase(); // Get product name
            const productDescription = item.querySelector('p').textContent.toLowerCase(); // Get product description

            // Check if product name or description includes the search query
            if (productName.includes(query) || productDescription.includes(query)) {
                item.style.display = 'block'; // Show the product item
            } else {
                item.style.display = 'none'; // Hide the product item
            }
        });
    }

    // Event listeners for search input and button
    searchButton.addEventListener('click', filterProducts);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') { // Trigger search on Enter key press
            filterProducts();
        }
    });

    // --- Shopping Cart Functionality ---
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Load cart from localStorage or initialize empty

    // Function to update the cart display (modal and count)
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ''; // Clear current cart items
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <span>${item.name}</span>
                    <span>${item.price.toLocaleString('ru-RU')} rub.</span>
                    <button class="remove-from-cart-btn" data-id="${item.id}">delete.</button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
                total += item.price;
            });
        }
        cartTotalElement.textContent = total.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Format total with 2 decimal places
        cartCount.textContent = cart.length; // Update item count in header icon
        localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
    }

    // Add item to cart
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productItem = event.target.closest('.product-item');
            const productId = productItem.dataset.id;
            const productName = productItem.dataset.name;
            const productPrice = parseFloat(productItem.dataset.price);

            // Check if item already exists in cart (optional: for quantity update)
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                // For simplicity, we're just adding a new entry.
                // In a real app, you'd increment quantity for existing items.
                // existingItem.quantity++;
            } else {
                cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
            }
            updateCartDisplay();
            // Optional: show a small confirmation message
            // alert(`"${productName}" добавлен в корзину!`);
        });
    });

    // Remove item from cart (event delegation)
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-cart-btn')) {
            const productIdToRemove = event.target.dataset.id;
            cart = cart.filter(item => item.id !== productIdToRemove); // Filter out the item to remove
            updateCartDisplay();
        }
    });

    // Open cart modal
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex'; // Use flex to center content
    });

    // Close cart modal when clicking on 'x'
    closeButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Close cart modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Initial update of cart display when page loads
    updateCartDisplay();
});
