// ===================================
// Photo Gallery JavaScript
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the gallery
    initGallery();
    initLightbox();
    initLazyLoading();
    initSmoothScroll();
});

// ===================================
// Gallery Initialization
// ===================================
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Add click event to each gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
        
        // Add keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View image ${index + 1} in full size`);
        
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });
}

// ===================================
// Lightbox Functionality
// ===================================
let currentImageIndex = 0;
const totalImages = 13;
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

function initLightbox() {
    // Close button
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Navigation buttons
    lightboxPrev.addEventListener('click', showPreviousImage);
    lightboxNext.addEventListener('click', showNextImage);
    
    // Click outside to close
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });
    
    // Prevent body scroll when lightbox is open
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (lightbox.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    });
    
    observer.observe(lightbox, {
        attributes: true,
        attributeFilter: ['class']
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    
    // Focus on close button for accessibility
    setTimeout(() => {
        lightboxClose.focus();
    }, 300);
}

function closeLightbox() {
    lightbox.classList.remove('active');
}

function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    updateLightboxImage();
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % totalImages;
    updateLightboxImage();
}

function updateLightboxImage() {
    const imageNumber = currentImageIndex + 1;
    const imageSrc = `assets/img${imageNumber}.jpg`;
    const imageAlt = `Gallery image ${imageNumber}`;
    
    // Show loading state
    lightboxImage.style.opacity = '0';
    
    // Create new image to preload
    const img = new Image();
    img.onload = function() {
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt;
        lightboxCounter.textContent = `${imageNumber} / ${totalImages}`;
        
        // Fade in
        setTimeout(() => {
            lightboxImage.style.opacity = '1';
        }, 50);
    };
    
    img.src = imageSrc;
}

// ===================================
// Lazy Loading with Intersection Observer
// ===================================
function initLazyLoading() {
    const images = document.querySelectorAll('.gallery-image[loading="lazy"]');
    
    // Check if browser supports Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loading placeholder
                    img.style.backgroundColor = '#f0f0f0';
                    
                    // Load the image
                    img.addEventListener('load', function() {
                        img.style.backgroundColor = '';
                        img.classList.add('loaded');
                        
                        // Add fade-in animation
                        img.style.animation = 'fadeIn 0.5s ease';
                    });
                    
                    // Stop observing this image
                    observer.unobserve(img);
                }
            });
        }, {
            // Start loading when image is 200px from viewport
            rootMargin: '200px'
        });
        
        // Observe all gallery images
        images.forEach(function(img) {
            imageObserver.observe(img);
        });
    }
}

// ===================================
// Smooth Scrolling for Navigation Links
// ===================================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id], main[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(function(section) {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===================================
// Scroll Animation for Gallery Items
// ===================================
function initScrollAnimation() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    galleryItems.forEach(function(item) {
        scrollObserver.observe(item);
    });
}

// Initialize scroll animation
if ('IntersectionObserver' in window) {
    initScrollAnimation();
}

// ===================================
// Touch Gestures for Mobile (Swipe Navigation)
// ===================================
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, false);

lightbox.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
}, false);

function handleSwipeGesture() {
    const swipeThreshold = 50;
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - show next image
        showNextImage();
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - show previous image
        showPreviousImage();
    }
}

// ===================================
// Preload Adjacent Images for Better Performance
// ===================================
function preloadAdjacentImages() {
    const prevIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    const nextIndex = (currentImageIndex + 1) % totalImages;
    
    // Preload previous image
    const prevImg = new Image();
    prevImg.src = `assets/img${prevIndex + 1}.jpg`;
    
    // Preload next image
    const nextImg = new Image();
    nextImg.src = `assets/img${nextIndex + 1}.jpg`;
}

// Call preload when image changes
const originalUpdateLightboxImage = updateLightboxImage;
updateLightboxImage = function() {
    originalUpdateLightboxImage();
    preloadAdjacentImages();
};

// ===================================
// Add fade-in animation CSS dynamically
// ===================================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    .gallery-image {
        transition: opacity 0.5s ease;
    }
    
    .lightbox-image {
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);

// ===================================
// Performance Optimization: Debounce Scroll Events
// ===================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handler
const debouncedUpdateActiveNav = debounce(updateActiveNav, 100);
window.removeEventListener('scroll', updateActiveNav);
window.addEventListener('scroll', debouncedUpdateActiveNav);

// ===================================
// Console Welcome Message
// ===================================
console.log('%c📷 Photo Gallery Loaded Successfully! ', 'background: #3498db; color: white; font-size: 16px; padding: 8px; border-radius: 4px;');
console.log('%cFeatures:', 'font-weight: bold; font-size: 14px;');
console.log('✓ Responsive grid layout');
console.log('✓ Lightbox with keyboard navigation');
console.log('✓ Lazy loading images');
console.log('✓ Touch gestures support');
console.log('✓ Smooth animations');
