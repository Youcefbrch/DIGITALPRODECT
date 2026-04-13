// بيانات المنتجات الافتراضية (يمكنك تعديلها)
let products = [
    {
        id: 1,
        name: "دورة برمجة Python",
        price: 199,
        image: "https://via.placeholder.com/300x200/667eea/ffffff?text=Python",
        description: "دورة شاملة في برمجة Python من الصفر إلى الاحتراف",
        file: "python-course.zip"
    },
    {
        id: 2,
        name: "قوالب تصميم Canva",
        price: 149,
        image: "https://via.placeholder.com/300x200/764ba2/ffffff?text=Canva",
        description: "100 قالب جاهز للتصميم على Canva",
        file: "canva-templates.zip"
    },
    {
        id: 3,
        name: "كتاب التسويق الرقمي",
        price: 99,
        image: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Marketing",
        description: "دليل شامل للتسويق الرقمي 2024",
        file: "digital-marketing.pdf"
    }
];

let cart = [];

// Stripe
const stripe = Stripe('pk_test_51...'); // ضع مفتاح Stripe الخاص بك هنا
let elements;

// DOM Elements
const cartModal = document.getElementById('cart-modal');
const checkoutModal = document.getElementById('checkout-modal');
const adminModal = document.getElementById('admin-modal');
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.getElementById('cart-count');
const productsContainer = document.getElementById('products-container');

// عرض المنتجات
function displayProducts() {
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">${product.price} ريال</p>
            <p class="product-desc">${product.description}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                أضف للسلة
            </button>
        `;
        productsContainer.appendChild(productCard);
    });
}

// إضافة للسلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
}

// تحديث سلة التسوق
function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>السلة فارغة</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} (x${item.quantity})</span>
            <div>
                <span>${item.price * item.quantity} ريال</span>
                <button class="remove-item" onclick="removeFromCart(${item.id})">حذف</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;
}

// حذف من السلة
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// فتح/إغلاق النوافذ
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
    updateCart();
});

document.querySelectorAll('.close').forEach(close => {
    close.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    });
});

window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Stripe Checkout
document.getElementById('checkout-btn').addEventListener('click', async () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total * 100 }) // Stripe يستخدم السنتات
    });
    
    const { clientSecret } = await response.json();
    
    const appearance = {
        theme: 'stripe',
    };
    
    elements = stripe.elements({ appearance, clientSecret });
    
    const paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');
    
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'block';
});

// إتمام الدفع
document.getElementById('submit-payment').add
