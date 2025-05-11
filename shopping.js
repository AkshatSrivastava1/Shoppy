// Sample product data
const products = [
    {
        id: 1,
        title: "Wireless Headphones",
        category: "electronics",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "High-quality wireless headphones with noise cancellation."
    },
    {
        id: 2,
        title: "Smart Watch",
        category: "electronics",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Feature-rich smartwatch with health monitoring."
    },
    {
        id: 3,
        title: "Cotton T-Shirt",
        category: "clothing",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Comfortable 100% cotton t-shirt available in multiple colors."
    },
    {
        id: 4,
        title: "Denim Jeans",
        category: "clothing",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Classic fit denim jeans with stretch technology."
    },
    {
        id: 5,
        title: "Ceramic Coffee Mug",
        category: "home",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Handcrafted ceramic mug with comfortable grip."
    },
    {
        id: 6,
        title: "Throw Pillow",
        category: "home",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Soft decorative pillow for your living space."
    },
    {
        id: 7,
        title: "Bluetooth Speaker",
        category: "electronics",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Portable speaker with 12-hour battery life."
    },
    {
        id: 8,
        title: "Running Shoes",
        category: "clothing",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Lightweight running shoes with cushioned soles."
    }
];

// DOM Elements
const productContainer = document.querySelector('.product-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');
const checkoutBtn = document.querySelector('.checkout-btn');

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the app
function init() {
    renderProducts(products);
    setupEventListeners();
    updateCartCount();
}

// Render products to the DOM
function renderProducts(productsToRender) {
    productContainer.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <span class="product-category">${product.category}</span>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productContainer.appendChild(productCard);
    });
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        renderProducts(filteredProducts);
    }
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification();
}

// Update cart in UI and localStorage
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
    updateTotalAmount();
}

// Render cart items
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <i class="fas fa-trash remove-item" data-id="${item.id}"></i>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', handleQuantityInputChange);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItemFromCart);
    });
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Update total amount
function updateTotalAmount() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = total.toFixed(2);
}

// Handle quantity changes
function handleQuantityChange(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    
    if (e.target.classList.contains('plus')) {
        item.quantity += 1;
    } else if (e.target.classList.contains('minus')) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        }
    }
    
    updateCart();
}

function handleQuantityInputChange(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    const newQuantity = parseInt(e.target.value);
    
    if (newQuantity >= 1) {
        item.quantity = newQuantity;
        updateCart();
    }
}

// Remove item from cart
function removeItemFromCart(e) {
    const productId = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Show cart notification
function showCartNotification() {
    cartIcon.classList.add('animate');
    setTimeout(() => {
        cartIcon.classList.remove('animate');
    }, 500);
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProducts(button.dataset.filter);
        });
    });
    
    // Add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
    });
    
    // Cart icon click
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });
    
    // Close cart
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Thank you for your purchase!');
            cart = [];
            updateCart();
            cartModal.style.display = 'none';
        } else {
            alert('Your cart is empty!');
        }
    });
}

// Initialize the app
init();