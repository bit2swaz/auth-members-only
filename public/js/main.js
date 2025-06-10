// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Auto-dismiss alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 5000);
  });

  // Add confirmation to delete buttons
  const deleteButtons = document.querySelectorAll('.btn-danger[type="submit"]');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      if (!confirm('Are you sure you want to delete this item?')) {
        e.preventDefault();
      }
    });
  });

  // Theme toggling functionality
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const icon = themeToggle.querySelector('i');
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  // Add transition class after initial load to prevent flash
  setTimeout(() => {
    document.body.classList.add('theme-transition');
  }, 300);
  
  // Theme toggle click handler with animation
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Add animation class
    themeToggle.classList.add('rotate-animation');
    
    setTimeout(() => {
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      
      // Remove animation class after completion
      setTimeout(() => {
        themeToggle.classList.remove('rotate-animation');
      }, 300);
    }, 150);
  });
  
  // Update theme icon with animation
  function updateThemeIcon(theme) {
    if (theme === 'light') {
      icon.className = 'fas fa-moon';
    } else {
      icon.className = 'fas fa-sun';
    }
  }
  
  // Add hover animations to all buttons
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-3px)';
      button.style.boxShadow = '0 4px 8px var(--shadow-color)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
      button.style.boxShadow = '';
    });
    
    // Add ripple effect
    button.addEventListener('click', function(e) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add hover animations to cards
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 8px 24px var(--shadow-color)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
  
  // Add smooth page transitions
  document.querySelectorAll('a').forEach(link => {
    // Skip links that should not have the transition
    if (link.getAttribute('target') === '_blank' || 
        link.getAttribute('href') === '#' ||
        link.getAttribute('href') === undefined ||
        link.getAttribute('href').startsWith('#') ||
        link.getAttribute('href').startsWith('javascript:') ||
        link.classList.contains('dropdown-toggle')) {
      return;
    }
    
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      
      e.preventDefault();
      
      // Fade out
      document.body.classList.add('page-transition-out');
      
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
  
  // Add heart animation in footer
  const heart = document.querySelector('.footer .heart');
  if (heart) {
    setInterval(() => {
      heart.classList.add('pulse');
      setTimeout(() => {
        heart.classList.remove('pulse');
      }, 1000);
    }, 3000);
  }
  
  // Add animation to form controls on focus
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('input-focused');
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('input-focused');
    });
  });
  
  // Add fade-in animation to page elements on load
  document.querySelectorAll('.card, .jumbotron, .list-group-item').forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 100 + (index * 50)); // Staggered animation
  });
});