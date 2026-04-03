document.addEventListener('DOMContentLoaded', function() {
  // Initialize animations
  initHeroAnimation();
  initProductCardsAnimation();
  initNotificationSystem();
  initQuickViewAnimation();
});

// Hero section animations
function initHeroAnimation() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  // Animated title with typing effect
  const title = hero.querySelector('.animated-title');
  if (title) {
    const firstSpan = title.querySelector('span:first-child');
    const secondSpan = title.querySelector('span:last-child');
    
    if (firstSpan && secondSpan) {
      setTimeout(() => {
        firstSpan.style.opacity = '1';
        firstSpan.style.transform = 'translateY(0)';
      }, 300);
      
      setTimeout(() => {
        secondSpan.style.opacity = '1';
        secondSpan.style.transform = 'translateY(0)';
      }, 800);
    }
  }
  
  // Hero description fade in
  const heroDesc = hero.querySelector('.hero-desc');
  if (heroDesc) {
    setTimeout(() => {
      heroDesc.style.opacity = '1';
      heroDesc.style.transform = 'translateY(0)';
    }, 1200);
  }
  
  // Animate floating badges
  const badges = hero.querySelectorAll('.floating-badge');
  badges.forEach((badge, index) => {
    // Add staggered float animation
    const delay = index * 0.5;
    badge.style.animationDelay = `${delay}s, ${delay}s`;
  });
  
  // Add subtle parallax effect to hero image
  const heroImage = hero.querySelector('.hero-image');
  if (heroImage) {
    window.addEventListener('mousemove', e => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      // Translate based on mouse position (subtle effect)
      const moveX = (mouseX - 0.5) * 20;
      const moveY = (mouseY - 0.5) * 20;
      
      heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  }
}

// Product cards animations
function initProductCardsAnimation() {
  const productCards = document.querySelectorAll('.product-card.interactive');
  
  productCards.forEach(card => {
    // Add shine effect on hover
    card.addEventListener('mousemove', createShineEffect);
    card.addEventListener('mouseleave', removeShineEffect);
  });
  
  function createShineEffect(e) {
    const card = this;
    
    // Check if shine already exists
    let shine = card.querySelector('.shine-effect');
    if (!shine) {
      shine = document.createElement('div');
      shine.classList.add('shine-effect');
      card.appendChild(shine);
    }
    
    // Update shine position
    updateShinePosition(e, shine);
  }
  
  function updateShinePosition(e, shine) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate position as percentage
    const posX = (x / rect.width) * 100;
    const posY = (y / rect.height) * 100;
    
    // Apply transformation
    shine.style.opacity = '1';
    shine.style.transform = `translate(${posX}%, ${posY}%) translateX(-50%) translateY(-50%)`;
  }
  
  function removeShineEffect(e) {
    const shine = this.querySelector('.shine-effect');
    if (shine) {
      shine.style.opacity = '0';
      setTimeout(() => {
        if (shine.parentNode) {
          shine.parentNode.removeChild(shine);
        }
      }, 300);
    }
  }
}

// Custom notification system
function initNotificationSystem() {
  // Create notification container if it doesn't exist
  let notificationContainer = document.querySelector('.notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Global function to show notifications
  window.showNotification = function(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => closeNotification(notification));
    
    // Add message
    const messageElement = document.createElement('div');
    messageElement.className = 'notification-message';
    messageElement.textContent = message;
    
    // Add icon based on type
    const icon = document.createElement('div');
    icon.className = 'notification-icon';
    
    switch (type) {
      case 'success':
        icon.innerHTML = '✓';
        break;
      case 'error':
        icon.innerHTML = '✗';
        break;
      case 'warning':
        icon.innerHTML = '⚠';
        break;
      default:
        icon.innerHTML = 'ℹ';
    }
    
    // Assemble notification
    notification.appendChild(icon);
    notification.appendChild(messageElement);
    notification.appendChild(closeBtn);
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Auto-remove after duration
    const timeout = setTimeout(() => {
      closeNotification(notification);
    }, duration);
    
    // Store timeout to clear if manually closed
    notification.dataset.timeout = timeout;
    
    return notification;
  };
  
  function closeNotification(notification) {
    // Clear timeout if it exists
    if (notification.dataset.timeout) {
      clearTimeout(notification.dataset.timeout);
    }
    
    // Hide with animation
    notification.classList.remove('show');
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
}

// Quick view modal animations
function initQuickViewAnimation() {
  // Add click animations to buttons
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quick-view-btn') || 
      e.target.classList.contains('add-to-cart-btn')) {
      animateButtonClick(e.target, e);
    }
  });
  
  function animateButtonClick(button, event) {
    // Add ripple effect
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    // Slight scale effect on button
    button.style.transform = 'scale(0.98)';
    setTimeout(() => {
      button.style.transform = '';
    }, 200);
  }
}

// Text typing animation
function createTypingAnimation(element, text, speed = 50, delay = 0) {
  if (!element) return;
  
  // Clear existing content
  element.textContent = '';
  
  // Create and append cursor
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.textContent = '|';
  element.appendChild(cursor);
  
  // Start animation after delay
  setTimeout(() => {
    let charIndex = 0;
    
    const typeNextChar = () => {
      if (charIndex < text.length) {
        // Create text node before cursor
        const textNode = document.createTextNode(text.charAt(charIndex));
        element.insertBefore(textNode, cursor);
        charIndex++;
        
        // Schedule next character
        setTimeout(typeNextChar, speed);
      } else {
        // Animation complete, make cursor blink
        cursor.classList.add('blinking');
        
        // Optional: remove cursor after some time
        setTimeout(() => {
          if (cursor.parentNode) {
            cursor.parentNode.removeChild(cursor);
          }
        }, 3000);
      }
    };
    
    // Start typing
    typeNextChar();
  }, delay);
}

// Section transition animations
function animateSectionTransition(targetSection) {
  if (!targetSection) return;
  
  // Add transition class
  document.body.classList.add('section-transitioning');
  
  // Fade out current view
  document.querySelectorAll('section').forEach(section => {
    if (section !== targetSection) {
      section.style.opacity = 0.3;
    }
  });
  
  // Scroll to target
  window.scrollTo({
    top: targetSection.offsetTop - 100,
    behavior: 'smooth'
  });
  
  // Fade in target section
  setTimeout(() => {
    targetSection.style.opacity = 1;
    
    // Add highlight effect
    const highlight = document.createElement('div');
    highlight.className = 'section-highlight';
    targetSection.appendChild(highlight);
    
    setTimeout(() => {
      // Remove highlight
      highlight.remove();
      
      // Restore other sections
      document.querySelectorAll('section').forEach(section => {
        section.style.opacity = 1;
      });
      
      // Remove transition class
      document.body.classList.remove('section-transitioning');
    }, 800);
  }, 400);
} 