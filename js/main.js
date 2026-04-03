document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initScrollEffects();
  initTestimonialSlider();
  initNewsletterForm();
});

// Mobile Navigation
function initNavigation() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      // Create or remove overlay
      let overlay = document.querySelector('.nav-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('nav-overlay');
        document.body.appendChild(overlay);
      }
      
      overlay.classList.toggle('active');
      
      // Close menu when clicking outside
      overlay.addEventListener('click', function() {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        overlay.classList.remove('active');
      });
    });
  }
  
  // Navbar scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (mobileMenuToggle && mobileMenuToggle.classList.contains('active')) {
          mobileMenuToggle.click();
        }
        
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Scroll effects
function initScrollEffects() {
  // Add .reveal class to elements we want to animate on scroll
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    // Add reveal classes to section headers
    const header = section.querySelector('.section-header');
    if (header) {
      header.classList.add('reveal');
    }
    
    // Add reveal classes to specific elements
    const features = section.querySelectorAll('.feature-card');
    features.forEach((feature, index) => {
      feature.classList.add('reveal');
      feature.classList.add(`delay-${index % 5 + 1}`);
    });
    
    // Add left/right reveals for alternating content
    const revealLeft = section.querySelectorAll('.reveal-left-candidate');
    revealLeft.forEach(el => {
      el.classList.add('reveal-left');
    });
    
    const revealRight = section.querySelectorAll('.reveal-right-candidate');
    revealRight.forEach(el => {
      el.classList.add('reveal-right');
    });
  });
  
  // Function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
      rect.bottom >= 0
    );
  }
  
  // Activate elements when scrolled into view
  function checkScroll() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    revealElements.forEach(el => {
      if (isInViewport(el)) {
        el.classList.add('active');
      }
    });
  }
  
  // Run on scroll and on load
  window.addEventListener('scroll', checkScroll);
  window.addEventListener('resize', checkScroll);
  // Initial check
  setTimeout(checkScroll, 100);
}

// Testimonial Slider
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonials-slider');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  if (!slider || cards.length === 0) return;
  
  let currentSlide = 0;
  const slideCount = cards.length;
  
  // Initial setup - hide all cards except first
  cards.forEach((card, index) => {
    if (index !== 0) {
      card.style.display = 'none';
    }
  });
  
  // Function to go to slide
  function goToSlide(index) {
    // Validate index
    if (index < 0) index = slideCount - 1;
    if (index >= slideCount) index = 0;
    
    // Hide all cards
    cards.forEach(card => {
      card.style.display = 'none';
    });
    
    // Show current card
    cards[index].style.display = 'block';
    
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    
    // Add animation class
    slider.classList.add('animated');
    setTimeout(() => {
      slider.classList.remove('animated');
    }, 500);
    
    currentSlide = index;
  }
  
  // Next and previous buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
    });
  }
  
  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });
  
  // Auto advance slides every 5 seconds
  let slideInterval = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000);
  
  // Pause auto advance on hover
  slider.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  
  slider.addEventListener('mouseleave', () => {
    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
  });
}

// Newsletter form submission
function initNewsletterForm() {
  const form = document.querySelector('.newsletter-form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      
      // Validate email
      if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }
      
      // Simulate API call
      setTimeout(() => {
        showNotification('Thank you for subscribing!', 'success');
        form.reset();
      }, 1000);
    });
  }
}

// Helper functions
function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
} 