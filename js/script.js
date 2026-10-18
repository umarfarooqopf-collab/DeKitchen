// Nav toggling
let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
};

// Cart toggling
let cartBtn = document.querySelector('#cart-btn');
let cartDrawer = document.querySelector('#cart-drawer');
let cartOverlay = document.querySelector('#cart-overlay');
let closeCartBtn = document.querySelector('#close-cart-btn');

cartBtn.onclick = () => {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
};

const closeCart = () => {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
};

closeCartBtn.onclick = closeCart;
cartOverlay.onclick = closeCart;

window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
    closeCart();
};

// Home Slider
document.querySelectorAll('.image-slider img').forEach(images => {
    images.onclick = () => {
        var src = images.getAttribute('src');
        document.querySelector('.main-home-image').src = src;
    };
});

// Swiper Init
var swiper = new Swiper(".review-slider", {
    spaceBetween: 20,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    loop: true,
    grabCursor: true,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        }
    },
});

// Menu Category Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const menuBoxes = document.querySelectorAll('.menu .box-container .box');

filterBtns.forEach(btn => {
    btn.onclick = () => {
        // Remove active class from all filter buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const target = btn.getAttribute('data-target');

        menuBoxes.forEach(box => {
            const category = box.getAttribute('data-category');
            if (target === 'all' || category === target) {
                box.style.display = 'flex';
            } else {
                box.style.display = 'none';
            }
        });
    };
});

// Cart State Management
let cart = JSON.parse(localStorage.getItem('de_kitchen_cart')) || [];

// Save Cart to LocalStorage and Render
const saveAndRenderCart = () => {
    localStorage.setItem('de_kitchen_cart', JSON.stringify(cart));
    renderCart();
};

// Add to Cart Function
const addToCart = (id, name, price, img) => {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price: parseFloat(price), img, quantity: 1 });
    }
    saveAndRenderCart();
    
    // Automatically open the cart drawer to show added item
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
};

// Change Quantity
const changeQuantity = (id, amount) => {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    saveAndRenderCart();
};

// Remove Item
const removeItem = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveAndRenderCart();
};

// Render Cart
const renderCart = () => {
    const container = document.querySelector('#cart-items-container');
    const badge = document.querySelector('.cart-badge');
    const totalElement = document.querySelector('#cart-total-price');
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        badge.textContent = '0';
        totalElement.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    let totalItems = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        totalItems += item.quantity;
        
        const itemHtml = `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-item-qty">
                        <button class="minus-qty-btn" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="plus-qty-btn" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="fas fa-trash remove-btn" data-id="${item.id}"></div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHtml);
    });
    
    badge.textContent = totalItems.toString();
    totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Bind buttons in cart drawer
    container.querySelectorAll('.plus-qty-btn').forEach(btn => {
        btn.onclick = () => changeQuantity(btn.getAttribute('data-id'), 1);
    });
    container.querySelectorAll('.minus-qty-btn').forEach(btn => {
        btn.onclick = () => changeQuantity(btn.getAttribute('data-id'), -1);
    });
    container.querySelectorAll('.remove-btn').forEach(btn => {
        btn.onclick = () => removeItem(btn.getAttribute('data-id'));
    });
};

// Bind Add to Cart buttons
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.onclick = (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = btn.getAttribute('data-price');
        const img = btn.getAttribute('data-img');
        addToCart(id, name, price, img);
    };
});

// Checkout Form Submission (Place Order via WhatsApp)
const checkoutForm = document.querySelector('#checkout-form');
checkoutForm.onsubmit = (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('Your cart is empty! Please add some items to your cart first.');
        return;
    }
    
    const name = document.querySelector('#customer-name').value.trim();
    const address = document.querySelector('#delivery-address').value.trim();
    const payment = document.querySelector('#payment-method').value;
    
    // Calculate total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Construct WhatsApp message
    let message = `🍔 *New Order from De Kitchen* 🍔\n`;
    message += `--------------------------------\n`;
    message += `*Customer Details:*\n`;
    message += `👤 *Name:* ${name}\n`;
    message += `📍 *Delivery Address:* ${address}\n`;
    message += `💵 *Payment Method:* ${payment}\n\n`;
    message += `--------------------------------\n`;
    message += `*Order Items:*\n`;
    
    cart.forEach(item => {
        message += `• ${item.quantity}x _${item.name}_ ($${(item.price * item.quantity).toFixed(2)})\n`;
    });
    
    message += `--------------------------------\n`;
    message += `💰 *Grand Total:* $${total.toFixed(2)}\n`;
    message += `--------------------------------\n`;
    message += `Thank you for ordering with De Kitchen! 🥂`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/923139833396?text=${encodedMessage}`;
    
    // Clear cart and form
    cart = [];
    saveAndRenderCart();
    checkoutForm.reset();
    closeCart();
    
    // Open WhatsApp link in new tab
    window.open(whatsappUrl, '_blank');
};

// Initial Render
renderCart();