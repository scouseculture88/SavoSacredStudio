// Savo Mode Website JavaScript
// Author: Savo Mode Development Team
// Description: Main JavaScript file for interactive functionality

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Global error handler for SVG className issues
    window.addEventListener('error', function(event) {
        if (event.message && event.message.includes('className') && event.message.includes('SVGElement')) {
            event.preventDefault();
            console.log('🎨 SVG className compatibility issue handled silently');
            return true;
        }
    });
    
    // Initialize essential components only
    initializeNavigation();
    initializeScrollEffects();
    // Removed unused initialization functions
    // initializeFeatherIcons(); // Removed - not used on main page
    initializeScrollToTop();
    initializeNotificationSystem();
    
    console.log('🏔️ Savo Mode website initialized successfully');
});

// Navigation functionality - simplified with null checks
function initializeNavigation() {
    const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
    const navToggle = document.getElementById('nav-toggle') || document.querySelector('.hamburger');
    const navMenu = document.getElementById('nav-menu') || document.querySelector('.mobile-nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle - only if elements exist
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            console.log('🚨 CLICK DETECTED ON HAMBURGER');
            e.preventDefault();
            e.stopImmediatePropagation();
            
            // Simple toggle
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
            
            const isNowOpen = navMenu.classList.contains('active');
            console.log('🍔 Menu is now:', isNowOpen ? 'OPEN' : 'CLOSED');
        }, { passive: false });
    } else {
        // Silent handling for pages without mobile menu
        console.log('📱 Simple navigation - no mobile menu');
    }
    
    // Close mobile menu when clicking on a link - only if elements exist
    if (navToggle && navMenu) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
            });
        });
    }
    
    // Close mobile menu when clicking outside (temporarily disabled for debugging)
    /*
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
            console.log('📱 Menu closed by outside click');
        }
    });
    */
    
    // Navbar scroll effect - only if navbar exists
    if (navbar) {
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class for styling
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (optional)
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // Active navigation link highlighting
    updateActiveNavLink();
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
}

// Scroll effects and smooth scrolling
function initializeScrollEffects() {
    // Smooth scrolling for navigation links
    const scrollLinks = document.querySelectorAll('[data-scroll]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default for internal scroll links
            if (this.hasAttribute('data-scroll') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('data-scroll');
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for navbar height
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // Allow external links to work normally
        });
    });
    
    // Hero scroll indicator
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const storySection = document.getElementById('story');
            if (storySection) {
                const offsetTop = storySection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Parallax effect for hero background
    const heroBackground = document.querySelector('.hero-bg-image');
    if (heroBackground) {
        window.addEventListener('scroll', throttle(function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        }, 16));
    }
}

// Removed unused animation system

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                submitForm(data);
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
    
    // Notify button functionality
    const notifyBtn = document.getElementById('notify-btn');
    if (notifyBtn) {
        notifyBtn.addEventListener('click', function() {
            showNotificationModal();
        });
    }
}

// Form validation
function validateForm(data) {
    let isValid = true;
    const errors = [];
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
        isValid = false;
    }
    
    // Subject validation
    if (!data.subject) {
        errors.push({ field: 'subject', message: 'Please select a subject' });
        isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        errors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
        isValid = false;
    }
    
    // Display errors
    if (!isValid) {
        displayFormErrors(errors);
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    switch (field.name) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                message = 'Name must be at least 2 characters long';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
            break;
        case 'message':
            if (value.length < 10) {
                isValid = false;
                message = 'Message must be at least 10 characters long';
            }
            break;
    }
    
    if (!isValid) {
        displayFieldError(field, message);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function displayFormErrors(errors) {
    errors.forEach(error => {
        const field = document.getElementById(error.field);
        if (field) {
            displayFieldError(field, error.message);
        }
    });
}

function displayFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    const errorElement = document.createElement('div');
    errorElement.setAttribute('class', 'field-error');
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Form submission
function submitForm(data) {
    const submitBtn = document.querySelector('#contact-form .btn-primary');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        document.getElementById('contact-form').reset();
        
        // In a real application, you would send the data to your server:
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data)
        // })
        // .then(response => response.json())
        // .then(result => {
        //     if (result.success) {
        //         showNotification('Message sent successfully!', 'success');
        //         document.getElementById('contact-form').reset();
        //     } else {
        //         showNotification('Failed to send message. Please try again.', 'error');
        //     }
        // })
        // .catch(error => {
        //     showNotification('An error occurred. Please try again.', 'error');
        // });
        
    }, 2000);
}

// Newsletter form functionality
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            email: formData.get('email')
        };
        
        // Validate form
        if (validateNewsletterForm(data)) {
            submitNewsletterForm(data);
        }
    });
}

function validateNewsletterForm(data) {
    let isValid = true;
    const errors = [];
    
    // Validate name (optional)
    if (data.name && data.name.trim().length < 2) {
        errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
        isValid = false;
    }
    
    // Validate email (required)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email.trim())) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
        isValid = false;
    }
    
    // Display errors
    if (!isValid) {
        errors.forEach(error => {
            const field = document.querySelector(`input[name="${error.field}"]`);
            if (field) {
                displayFieldError(field, error.message);
            }
        });
    }
    
    return isValid;
}

function submitNewsletterForm(data) {
    const submitBtn = document.querySelector('#newsletter-form .newsletter-btn');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Joining...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Welcome to the Savo Mode community! We\'ll keep you updated.', 'success');
        
        // Reset form
        document.getElementById('newsletter-form').reset();
        
        console.log('Newsletter signup:', data);
    }, 1500);
}

// Notification system
function initializeNotificationSystem() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.setAttribute('class', 'notification-container');
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.setAttribute('class', `notification notification-${type}`);
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove
    setTimeout(() => {
        removeNotification(notification);
    }, duration);
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Notification modal for collection updates
function showNotificationModal() {
    const modal = document.createElement('div');
    modal.setAttribute('class', 'modal-overlay');
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Stay Updated</h3>
                <button class="modal-close" aria-label="Close modal">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <p>Be the first to know when our collection launches. Enter your email below:</p>
                <form id="notification-form" class="notification-form">
                    <div class="form-group">
                        <input type="email" id="notify-email" name="email" class="form-input" placeholder="Enter your email" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full">Notify Me</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    
    // Focus management
    const emailInput = modal.querySelector('#notify-email');
    emailInput.focus();
    
    // Close modal functionality
    const closeModal = () => {
        modal.classList.add('closing');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.classList.remove('modal-open');
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Form submission
    modal.querySelector('#notification-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = modal.querySelector('#notify-email').value;
        
        if (email) {
            // Simulate API call
            setTimeout(() => {
                showNotification('Thanks! We\'ll notify you when our collection launches.', 'success');
                closeModal();
            }, 1000);
        }
    });
    
    // Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('modal-open')) {
            closeModal();
        }
    });
    
    // Animate in
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-scroll]');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-scroll') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Initialize Feather Icons
function initializeFeatherIcons() {
    if (typeof feather !== 'undefined') {
        try {
            feather.replace();
        } catch (error) {
            // Handle SVG className errors specifically
            if (error.message && error.message.includes('className')) {
                console.log('🎨 Feather icons loaded (SVG className compatibility handled)');
            } else {
                console.log('Feather icons loaded with minor compatibility issues');
            }
        }
    }
}

// Scroll to top functionality
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.id = 'scroll-to-top';
    scrollToTopBtn.setAttribute('class', 'scroll-to-top');
    scrollToTopBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18,15 12,9 6,15"></polyline></svg>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    }, 100));
    
    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Add CSS styles for JavaScript-generated elements
const additionalStyles = `
    <style>
        /* Mobile Navigation Styles */
        .nav-open {
            overflow: hidden;
        }
        
        /* Notification Styles */
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        }
        
        .notification {
            background: white;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            margin-bottom: var(--spacing-sm);
            transform: translateX(100%);
            transition: var(--transition-medium);
            border-left: 4px solid var(--accent-color);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left-color: #27ae60;
        }
        
        .notification-error {
            border-left-color: #e74c3c;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--spacing-md);
        }
        
        .notification-message {
            flex: 1;
            color: var(--text-primary);
            font-size: 0.875rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: var(--spacing-xs);
            margin-left: var(--spacing-sm);
            border-radius: var(--radius-sm);
            transition: var(--transition-fast);
        }
        
        .notification-close:hover {
            background-color: var(--background-secondary);
        }
        
        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: var(--transition-medium);
        }
        
        .modal-overlay.show {
            opacity: 1;
        }
        
        .modal-overlay.closing {
            opacity: 0;
        }
        
        .modal {
            background: white;
            border-radius: var(--radius-xl);
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: var(--transition-medium);
        }
        
        .modal-overlay.show .modal {
            transform: scale(1);
        }
        
        .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--spacing-lg);
            border-bottom: 1px solid var(--border-color);
        }
        
        .modal-header h3 {
            margin: 0;
            color: var(--text-primary);
        }
        
        .modal-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: var(--spacing-xs);
            border-radius: var(--radius-sm);
            transition: var(--transition-fast);
        }
        
        .modal-close:hover {
            background-color: var(--background-secondary);
        }
        
        .modal-body {
            padding: var(--spacing-lg);
        }
        
        .notification-form .form-group {
            margin-bottom: var(--spacing-md);
        }
        
        /* Scroll to Top Button */
        .scroll-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background-color: var(--accent-color);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--shadow-md);
            transition: var(--transition-medium);
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            z-index: 1000;
        }
        
        .scroll-to-top.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .scroll-to-top:hover {
            background-color: var(--accent-light);
            transform: translateY(-2px);
        }
        
        /* Form Error Styles */
        .form-input.error {
            border-color: #e74c3c;
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
        }
        
        .field-error {
            color: #e74c3c;
            font-size: 0.75rem;
            margin-top: var(--spacing-xs);
            display: block;
        }
        
        /* Animation classes */
        .animate-in,
        .fade-in-left,
        .fade-in-right {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .value-card,
        .collection-item,
        .story-visual {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        
        /* Story text should always be visible */
        .story-text {
            opacity: 1 !important;
            transform: none !important;
        }
        
        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
            .notification {
                background: var(--background-secondary);
                color: var(--text-light);
            }
            
            .modal {
                background: var(--background-primary);
                color: var(--text-light);
            }
            
            .modal-header {
                border-bottom-color: var(--border-color);
            }
        }
        
        /* Mobile adjustments */
        @media (max-width: 768px) {
            .notification-container {
                left: 20px;
                right: 20px;
                max-width: none;
            }
            
            .modal {
                width: 95%;
                margin: 20px;
            }
            
            .scroll-to-top {
                bottom: 80px;
                right: 15px;
                width: 45px;
                height: 45px;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Static Mountain Background System (disabled rotation)
function initializeDynamicBackground() {
    const heroImages = document.querySelectorAll('.hero-bg-image');
    
    if (heroImages.length > 0) {
        // Just show the first image as static background
        heroImages[0].classList.add('active');
        console.log('🏔️ Static mountain background activated');
    }
    
    // Rotation disabled to reduce resource usage
    // Original rotating code commented out to preserve for future use
    /*
    let currentIndex = 0;
    if (heroImages.length <= 1) return;
    
    function rotateBackground() {
        heroImages[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % heroImages.length;
        setTimeout(() => {
            heroImages[currentIndex].classList.add('active');
        }, 100);
        console.log(`🌄 Switched to nature scene ${currentIndex + 1}/${heroImages.length}`);
    }
    
    setTimeout(() => {
        setInterval(rotateBackground, 5000);
    }, 3000);
    */
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    // Removed unused functions
    initializeNotificationSystem();
    initializeScrollToTop();
    updateActiveNavLink();
    initializeDynamicBackground();
    
    // Console log for verification
    console.log('🏔️ Savo Mode website initialized successfully');
    console.log('🏔️ Static mountain background activated');
});
