document.addEventListener('DOMContentLoaded', function() {
  // Initialize scroll-based effects
  initParallaxEffect();
  initScrollAnimations();
  initProductCardEffects();
});

// Parallax scrolling effect
function initParallaxEffect() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  function updateParallaxPosition() {
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(window.scrollY * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }
  
  window.addEventListener('scroll', updateParallaxPosition);
  updateParallaxPosition(); // Initial position
}

// Scroll-triggered animations using Intersection Observer
function initScrollAnimations() {
  // Create observer instance
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Unobserve after animation is triggered
        if (!entry.target.classList.contains('repeat-animate')) {
          observer.unobserve(entry.target);
        }
      } else if (entry.target.classList.contains('repeat-animate')) {
        // Remove active class only for elements that need to repeat animation
        entry.target.classList.remove('active');
      }
    });
  }, {
    // Options
    root: null, // viewport
    threshold: 0.1, // 10% of the item visible
    rootMargin: '-50px 0px'
  });
  
  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// 3D tilt effect for product cards
function initProductCardEffects() {
  const cards = document.querySelectorAll('.product-card.interactive');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      // Calculate mouse position relative to card center
      const mouseX = e.clientX - cardCenterX;
      const mouseY = e.clientY - cardCenterY;
      
      // Calculate rotation angles (limited to small angles)
      const rotateY = mouseX * 0.02; // Horizontal rotation
      const rotateX = -mouseY * 0.02; // Vertical rotation
      
      // Apply transform to card inner
      const cardInner = card.querySelector('.card-inner');
      if (cardInner) {
        cardInner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      }
    });
    
    // Reset transform when mouse leaves
    card.addEventListener('mouseleave', () => {
      const cardInner = card.querySelector('.card-inner');
      if (cardInner) {
        cardInner.style.transform = 'rotateY(0deg) rotateX(0deg)';
      }
    });
  });
}

// Progress-based animations (progress bars, counters, etc.)
function initProgressAnimations() {
  const progressElements = document.querySelectorAll('.progress-bar, .count-up');
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('progress-bar')) {
          animateProgressBar(entry.target);
        } else if (entry.target.classList.contains('count-up')) {
          animateCounter(entry.target);
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });
  
  progressElements.forEach(element => {
    observer.observe(element);
  });
}

// Animate progress bar
function animateProgressBar(element) {
  const targetValue = element.dataset.value || 100;
  element.style.width = '0%';
  
  setTimeout(() => {
    element.style.width = `${targetValue}%`;
  }, 100);
}

// Animate counter
function animateCounter(element) {
  const targetValue = parseInt(element.dataset.value) || 0;
  const duration = parseInt(element.dataset.duration) || 2000;
  const startTime = performance.now();
  let currentValue = 0;
  
  function updateCounter(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    currentValue = Math.floor(progress * targetValue);
    element.textContent = currentValue.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = targetValue.toLocaleString();
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Smooth scrolling for entire page
function initSmoothScroll() {
  // Calculate the viewport height
  const viewportHeight = window.innerHeight;
  const scrollContainer = document.createElement('div');
  const content = document.querySelector('body > *:not(script)');
  
  // Set up container
  scrollContainer.className = 'smooth-scroll-container';
  document.body.appendChild(scrollContainer);
  
  let currentY = window.scrollY;
  let targetY = currentY;
  let scrollRequest = null;
  
  // Update scroll position
  function updateScroll() {
    currentY += (targetY - currentY) * 0.1;
    
    if (Math.abs(targetY - currentY) < 0.1) {
      currentY = targetY;
      scrollRequest = null;
    } else {
      scrollRequest = requestAnimationFrame(updateScroll);
    }
    
    scrollContainer.style.transform = `translateY(${-currentY}px)`;
  }
  
  // Listen for scroll events
  window.addEventListener('scroll', () => {
    targetY = window.scrollY;
    
    if (!scrollRequest) {
      scrollRequest = requestAnimationFrame(updateScroll);
    }
  });
}

// Background effects that respond to scroll
function initScrollingBackgroundEffects() {
  const sections = document.querySelectorAll('.bg-effect-section');
  
  function updateBackgrounds() {
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = scrollY - sectionTop;
      const scrollPercentage = Math.min(Math.max(scrollPosition / sectionHeight, 0), 1);
      
      // Different effects based on section type
      if (section.classList.contains('bg-gradient-shift')) {
        // Shift gradient position based on scroll
        const gradientPos = 50 + (scrollPercentage * 50);
        section.style.backgroundPosition = `${gradientPos}% center`;
      } else if (section.classList.contains('bg-color-shift')) {
        // Change opacity of overlay based on scroll
        const overlay = section.querySelector('.bg-overlay');
        if (overlay) {
          overlay.style.opacity = 0.2 + (scrollPercentage * 0.6);
        }
      }
    });
  }
  
  window.addEventListener('scroll', updateBackgrounds);
  updateBackgrounds(); // Initial update
}

// Initialize scroll effects if needed based on URL hash
function checkForScrollTarget() {
  if (window.location.hash) {
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement) {
      setTimeout(() => {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }, 500); // Small delay to ensure all content is loaded
    }
  }
}

// Call at the end of the script
checkForScrollTarget(); 