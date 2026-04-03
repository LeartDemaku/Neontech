document.addEventListener('DOMContentLoaded', function() {
  // Initialize product functionality
  loadProducts();
  initProductFilters();
  setupQuickView();
});

// Product data (in a real app, this would come from a database/API)
const productData = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 199.99,
    rating: 4.8,
    image: "img/products/product1.svg",
    category: "best",
    description: "Experience crystal clear audio with our premium noise-cancelling headphones. Designed for comfort during extended listening sessions.",
    features: ["Noise cancellation", "40-hour battery life", "Bluetooth 5.0", "Premium materials"]
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 249.99,
    rating: 4.5,
    image: "img/products/product2.svg",
    category: "new",
    description: "Stay connected and track your fitness with our feature-packed smartwatch. Sleek design meets powerful technology.",
    features: ["Heart rate monitor", "GPS tracking", "Water resistant", "5-day battery life"]
  },
  {
    id: 3,
    name: "Wireless Speaker",
    price: 149.99,
    rating: 4.7,
    image: "img/products/product3.svg",
    category: "best",
    description: "Fill any room with immersive, high-fidelity sound. Our wireless speaker delivers deep bass and crisp highs.",
    features: ["360° sound", "Waterproof design", "15-hour battery", "Voice assistant compatible"]
  },
  {
    id: 4,
    name: "Ultra-Thin Laptop",
    price: 1299.99,
    rating: 4.9,
    image: "img/products/product4.svg",
    category: "premium",
    description: "Powerful performance in an incredibly thin and light design. The perfect tool for professionals on the go.",
    features: ["Intel Core i7", "16GB RAM", "512GB SSD", "15-inch 4K display"]
  },
  {
    id: 5,
    name: "Flagship Smartphone",
    price: 899.99,
    rating: 4.6,
    image: "img/products/product5.svg",
    category: "premium",
    description: "Our most advanced smartphone yet. Featuring a stunning display, powerful camera system, and all-day battery life.",
    features: ["Triple camera system", "6.7-inch OLED display", "5G connectivity", "All-day battery life"]
  },
  {
    id: 6,
    name: "Fitness Tracker",
    price: 99.99,
    rating: 4.4,
    image: "img/products/product6.svg",
    category: "new",
    description: "Track your workouts, heart rate, sleep, and more with our comprehensive fitness band. Slim design for 24/7 wear.",
    features: ["Heart rate monitoring", "Sleep tracking", "Water resistant", "7-day battery life"]
  }
];

// Load products with optional category filter
function loadProducts(filterCategory = 'all') {
  const productsGrid = document.querySelector('.products-grid');
  
  if (!productsGrid) return;
  
  // Clear existing products
  productsGrid.innerHTML = '';
  
  // Filter products
  const filteredProducts = filterCategory === 'all' 
      ? productData 
      : productData.filter(product => product.category === filterCategory);
  
  // Update count if on products page
  const resultsCount = document.querySelector('.results-count strong');
  if (resultsCount) {
      resultsCount.textContent = filteredProducts.length;
  }
  
  // Add product cards to grid
  filteredProducts.forEach(product => {
      const productCard = createProductCard(product);
      productsGrid.appendChild(productCard);
  });
  
  // If no products found
  if (filteredProducts.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = 'No products found matching your criteria.';
      productsGrid.appendChild(noResults);
  }
  
  // Initialize reveal animations
  setTimeout(() => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
      card.classList.add('reveal');
      card.classList.add(`delay-${index % 5 + 1}`);
    });
    
    // Trigger check for visibility
    document.dispatchEvent(new Event('scroll'));
  }, 100);
}

// Create HTML for a product card
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card interactive';
  card.dataset.productId = product.id;
  
  const cardInner = document.createElement('div');
  cardInner.className = 'card-inner';
  
  // Product badge
  let badgeText = '';
  let badgeClass = '';
  
  switch(product.category) {
    case 'new':
      badgeText = 'New Arrival';
      badgeClass = 'badge-new';
      break;
    case 'best':
      badgeText = 'Best Seller';
      badgeClass = 'badge-best';
      break;
    case 'premium':
      badgeText = 'Premium';
      badgeClass = 'badge-premium';
      break;
  }
  
  const cardHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}">
      ${badgeText ? `<span class="product-badge ${badgeClass}">${badgeText}</span>` : ''}
    </div>
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <div class="product-rating">
        ${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}${'☆'.repeat(5 - Math.ceil(product.rating))}
        <span class="rating-value">${product.rating}</span>
      </div>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <div class="product-actions">
        <button class="quick-view-btn" data-product-id="${product.id}">Quick View</button>
        <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  `;
  
  cardInner.innerHTML = cardHTML;
  card.appendChild(cardInner);
  
  return card;
}

// Initialize product filters
function initProductFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get filter category
      const filterCategory = this.dataset.filter;
      
      // Filter products
      loadProducts(filterCategory);
    });
  });
}

// Set up quick view functionality
function setupQuickView() {
  // Create modal container if it doesn't exist
  let modal = document.querySelector('.quick-view-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeQuickViewModal();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeQuickViewModal();
      }
    });
  }
  
  // Delegate click events for quick view buttons
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quick-view-btn')) {
      const productId = parseInt(e.target.dataset.productId);
      openQuickViewModal(productId);
    }
  });
}

// Open quick view modal
function openQuickViewModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const modal = document.querySelector('.quick-view-modal');
  
  // Create modal content
  const modalHTML = `
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      <div class="modal-product">
        <div class="modal-product-image">
          <img src="${product.image}" alt="${product.name}" class="glow">
        </div>
        <div class="modal-product-info">
          <h2>${product.name}</h2>
          <div class="product-rating">
            ${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}${'☆'.repeat(5 - Math.ceil(product.rating))}
            <span class="rating-value">${product.rating}</span>
          </div>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <p class="product-description">${product.description}</p>
          
          <div class="product-features">
            <h4>Key Features</h4>
            <ul>
              ${product.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
          
          <div class="product-colors">
            <h4>Available Colors</h4>
            <div class="color-options">
              ${product.colors.map(color => `
                <div class="color-option" style="background-color: ${color.toLowerCase()}" data-color="${color}">
                  <span class="color-name">${color}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="quantity-selector">
            <button class="qty-btn minus">-</button>
            <input type="number" value="1" min="1" max="10">
            <button class="qty-btn plus">+</button>
          </div>
          
          <div class="modal-actions">
            <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
            <button class="btn btn-outline wishlist-btn" data-product-id="${product.id}">Add to Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  modal.innerHTML = modalHTML;
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Set up close button
  const closeBtn = modal.querySelector('.close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeQuickViewModal);
  }
  
  // Set up quantity selector
  const qtyInput = modal.querySelector('.quantity-selector input');
  const minusBtn = modal.querySelector('.qty-btn.minus');
  const plusBtn = modal.querySelector('.qty-btn.plus');
  
  if (minusBtn && plusBtn && qtyInput) {
    minusBtn.addEventListener('click', () => {
      const currentVal = parseInt(qtyInput.value);
      if (currentVal > 1) {
        qtyInput.value = currentVal - 1;
      }
    });
    
    plusBtn.addEventListener('click', () => {
      const currentVal = parseInt(qtyInput.value);
      if (currentVal < 10) {
        qtyInput.value = currentVal + 1;
      }
    });
  }
  
  // Set up color selection
  const colorOptions = modal.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      colorOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
  
  // Select first color by default
  if (colorOptions.length > 0) {
    colorOptions[0].classList.add('selected');
  }
  
  // Add to cart button
  const addToCartBtn = modal.querySelector('.add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      const quantity = parseInt(qtyInput.value) || 1;
      const selectedColor = modal.querySelector('.color-option.selected')?.dataset.color || product.colors[0];
      
      // In a real app, we would add to cart here
      showNotification(`Added ${quantity} ${product.name} (${selectedColor}) to cart`, 'success');
      
      closeQuickViewModal();
    });
  }
  
  // Wishlist button
  const wishlistBtn = modal.querySelector('.wishlist-btn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', function() {
      // In a real app, we would add to wishlist here
      showNotification(`Added ${product.name} to your wishlist`, 'success');
    });
  }
}

// Close quick view modal
function closeQuickViewModal() {
  const modal = document.querySelector('.quick-view-modal');
  if (modal) {
    modal.classList.remove('active');
  }
} 