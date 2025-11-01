// Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);


document.addEventListener('DOMContentLoaded', function() {
    // Add scrollbar width calculation at the start
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Add loading state variable
    let isAnimating = false;
    const background = document.querySelector('.background');
    
    // Add null check for background blur
    if (background) {
        setTimeout(() => {
            background.classList.add('blurred');
        }, 0);
    }

    // Create or get the transition overlay with absolute path for logo
    let transitionOverlay = document.querySelector('.transition-overlay');
    
    if (!transitionOverlay) {
        transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'transition-overlay';
        
        // Use absolute path to ensure logo loads from any subdirectory
        transitionOverlay.innerHTML = `
            <img src="/assets/images/logokadri.png" alt="kadri24digits" class="transition-logo">
        `;
        document.body.appendChild(transitionOverlay);
    } else {
        // If overlay already exists (e.g. from browser back), reset it
        transitionOverlay.classList.remove('active', 'fade-out');
    }

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.overlay');
    const links = document.querySelectorAll('.nav-links li');

    // Check if elements exist before adding event listeners
    if (hamburger && navLinks && overlay) {
        hamburger.addEventListener('click', () => {
            // Toggle Nav
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            overlay.classList.toggle('active');

            // Animate Links only when opening, not closing
            if (navLinks.classList.contains('active')) {
                // Animate Links when opening
                links.forEach((link, index) => {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                });
            } else {
                // Remove animation when closing for instant hide
                links.forEach((link) => {
                    link.style.animation = '';
                });
            }
        });

        // Add transitionend listener to overlay to remove animation class
        overlay.addEventListener('transitionend', () => {
            if (overlay.classList.contains('active')) {
                // Keep animation styles if active
            } else {
                overlay.classList.remove('active');
            }
        });

        // Add resize handler to prevent animation during window resizing
        let resizeTimer;
        window.addEventListener('resize', function() {
            // Close mobile menu only if it's open during resize
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                overlay.classList.remove('active');
            }

            // Add the no-transition class to all relevant elements
            document.body.classList.add('no-transition');
            navLinks.classList.add('no-transition');
            overlay.classList.add('no-transition');
            hamburger.classList.add('no-transition');

            // Clear the existing timer
            clearTimeout(resizeTimer);

            // Set a timer to remove the no-transition class after resize is complete
            resizeTimer = setTimeout(function() {
                document.body.classList.remove('no-transition');
                navLinks.classList.remove('no-transition');
                overlay.classList.remove('no-transition');
                hamburger.classList.remove('no-transition');
            }, 100);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('active')) {
                // Remove animation when closing for instant hide
                links.forEach((link) => {
                    link.style.animation = '';
                });
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                overlay.classList.remove('active');
            }
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function(e) {
                // Get the href and check if it's an internal navigation link
                const href = this.getAttribute('href');
                if (href && 
                    !href.startsWith('http') && 
                    !href.startsWith('#') && 
                    !href.startsWith('mailto:') && 
                    !href.startsWith('tel:') && 
                    !this.hasAttribute('download') &&
                    !href.endsWith('.pdf') &&  // Exclude PDF files
                    !href.endsWith('.zip') &&  // Exclude ZIP files
                    !href.endsWith('.exe')) {  // Exclude executable files
                    
                    e.preventDefault();
                    
                    if (navLinks.classList.contains('active')) {
                        links.forEach(l => l.style.animation = '');
                        hamburger.classList.remove('active');
                        navLinks.classList.remove('active');
                        overlay.classList.remove('active');
                    }
                    
                    navigateToPage(this.href);
                }
            });
        });

        // Handle overlay click to close menu
        overlay.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                // Remove animation when closing for instant hide
                links.forEach((link) => {
                    link.style.animation = '';
                });
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    // Handle all navigation links with transition
    function navigateToPage(url) {
        // Set flag to indicate we're navigating
        sessionStorage.setItem('isNavigating', 'true');
        
        // Show the transition overlay
        transitionOverlay.classList.add('active');
        
        // Wait for the background to fade in and logo to appear before redirecting
        setTimeout(() => {
            // Redirect after the transition begins
            window.location.href = url;
        }, 150); // Reduced delay for better user experience
    }

    // Handle the page loading transition
    function handlePageLoadTransition() {
        const pageTransitionOverlay = document.querySelector('.transition-overlay');
        if (pageTransitionOverlay) {
            // Check if this page load was from a navigation event (not direct visit)
            const isNavigating = sessionStorage.getItem('isNavigating');
            
            if (isNavigating === 'true') {
                // This is a navigation from another page, show the transition
                pageTransitionOverlay.classList.add('active');
                
                // Mark that we're no longer navigating
                sessionStorage.setItem('isNavigating', 'false');
                
                // When the page is fully loaded, fade out the transition overlay
                window.addEventListener('load', function() {
                    // Wait for the logo to be fully visible before starting to fade out
                    setTimeout(() => {
                        // Start fade out of the logo and background
                        pageTransitionOverlay.classList.add('fade-out');
                        
                        // Remove the overlay after the fade out animation completes
                        setTimeout(() => {
                            pageTransitionOverlay.classList.remove('active', 'fade-out');
                        }, 400); // Match the CSS transition duration
                    }, 500); // Delay before starting fade out to ensure logo is visible
                });
            } else {
                // For direct page visits or browser back/forward, just make sure overlay is hidden
                pageTransitionOverlay.classList.remove('active', 'fade-out');
            }
        }
    }

    // Don't handle browser back/forward button navigation with animation
    // Only animate when user clicks navigation buttons

    // Handle all navigation links with transition - including relative paths
    document.querySelectorAll('a[href]').forEach(link => {
        // Check if this is an internal link (relative or absolute)
        const href = link.getAttribute('href');
        if (href && 
            !href.startsWith('http') && 
            !href.startsWith('#') && 
            !href.startsWith('mailto:') && 
            !href.startsWith('tel:') && 
            !link.hasAttribute('download') && 
            !href.endsWith('.pdf') &&  // Exclude PDF files
            !href.endsWith('.zip') &&  // Exclude ZIP files
            !href.endsWith('.exe')) {  // Exclude executable files
            
            link.addEventListener('click', function(e) {
                // Check if it's an internal page link by verifying it doesn't have file extensions
                if (!this.href.includes('.html') && !this.href.includes('.pdf') && 
                    !this.href.includes('.zip') && !this.href.includes('.exe')) {
                    e.preventDefault();
                    navigateToPage(this.href);
                }
            });
        }
    });

    // Handle page load transition for initial page load
    handlePageLoadTransition();

    // Lightbox functionality - Add null checks
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) { // Only initialize lightbox functionality if element exists
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const galleryImages = document.querySelectorAll('.gallery-img');
        let currentAnimation = null;
        let initialRect = null; // Variable to store the initial position/size

        // Only set up lightbox events if we have both the lightbox and gallery images
        if (lightboxImg && closeBtn && galleryImages.length > 0) {
            function openLightbox(sourceImage) {
                if (currentAnimation) {
                    currentAnimation.forEach(timeout => clearTimeout(timeout));
                }
                currentAnimation = [];

                function setPosition(animate = true) {
                    const viewportWidth = document.documentElement.clientWidth;
                    const viewportHeight = window.innerHeight;
                    const aspectRatio = sourceImage.naturalHeight / sourceImage.naturalWidth;
                    
                    // First, calculate target size
                    const targetWidth = Math.min(viewportWidth * 0.9, viewportHeight * 1.6);
                    const targetHeight = targetWidth * aspectRatio;
                    
                    // Force hardware acceleration
                    lightboxImg.style.transform = 'translateZ(0)';
                    lightboxImg.style.willChange = 'top, left, width, height';
                    
                    if (!animate) {
                        lightboxImg.style.transition = 'none';
                    }
                    
                    lightboxImg.style.width = `${targetWidth}px`;
                    lightboxImg.style.height = `${targetHeight}px`;
                    lightboxImg.style.top = `${(viewportHeight - targetHeight) / 2}px`;
                    lightboxImg.style.left = `${(viewportWidth - targetWidth) / 2}px`;
                    
                    if (!animate) {
                        // Force reflow
                        lightboxImg.offsetHeight;
                        lightboxImg.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    }
                }

                // Initial setup
                const rect = sourceImage.getBoundingClientRect();
                initialRect = rect; // Store the initial rect
                lightboxImg.src = sourceImage.src;
                lightboxImg.style.position = 'fixed';
                lightboxImg.style.transition = 'none';
                lightboxImg.style.display = 'block';
                lightboxImg.style.width = `${rect.width}px`;
                lightboxImg.style.height = `${rect.height}px`;
                lightboxImg.style.top = `${rect.top}px`;
                lightboxImg.style.left = `${rect.left}px`;
                
                // Force reflow before adding transitions
                lightboxImg.offsetHeight;
                
                document.body.style.paddingRight = '12px';
                document.body.classList.add('lightbox-open');

                // Clean up old handler and create new one
                if (window.lightboxResizeHandler) {
                    window.removeEventListener('resize', window.lightboxResizeHandler);
                }
                
                window.lightboxResizeHandler = () => {
                    if (lightbox.classList.contains('active')) {
                        setPosition(false);
                    }
                };
                
                window.addEventListener('resize', window.lightboxResizeHandler);
                
                // Start animation
                requestAnimationFrame(() => {
                    lightbox.classList.add('active');
                    lightboxImg.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    setPosition(true);
                });

                currentAnimation.push(setTimeout(() => {
                    currentAnimation = null;
                }, 400));
            }

            function closeLightbox() {
                if (currentAnimation) {
                    currentAnimation.forEach(timeout => clearTimeout(timeout));
                }
                currentAnimation = [];

                const sourceImage = [...galleryImages].find(img => img.src === lightboxImg.src);
                // Use the stored initialRect if available
                if (sourceImage && initialRect) {
                    // const rect = sourceImage.getBoundingClientRect(); // No longer needed
                    lightbox.classList.remove('active');

                    lightboxImg.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    Object.assign(lightboxImg.style, {
                        top: `${initialRect.top}px`, // Use stored value
                        left: `${initialRect.left}px`, // Use stored value
                        width: `${initialRect.width}px`, // Use stored value
                        height: `${initialRect.height}px` // Use stored value
                    });

                    currentAnimation.push(setTimeout(() => {
                        window.removeEventListener('resize', window.lightboxResizeHandler);
                        document.body.classList.remove('lightbox-open');
                        document.body.style.paddingRight = '';
                        lightboxImg.removeAttribute('style');
                        lightboxImg.src = '';
                        lightboxImg.style.display = 'none';
                        currentAnimation = null;
                        initialRect = null; // Reset stored rect
                    }, 400));
                } else {
                    // Immediate cleanup if something went wrong or initialRect missing
                    lightbox.classList.remove('active');
                    document.body.classList.remove('lightbox-open');
                    document.body.style.paddingRight = '';
                    lightboxImg.removeAttribute('style');
                    lightboxImg.src = '';
                    lightboxImg.style.display = 'none';
                    currentAnimation = null;
                    initialRect = null; // Reset stored rect
                }
            }

            galleryImages.forEach(img => {
                img.addEventListener('click', () => openLightbox(img));
            });

            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', e => {
                if (e.target === lightbox) closeLightbox();
            });
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    closeLightbox(); // Use the same closeLightbox function instead of immediate cleanup
                }
            });
        }
    }

    // Custom Select Implementation
    const customSelect = document.querySelector('.custom-select');
    if (customSelect) { // Add null check
        const selectSelected = customSelect.querySelector('.select-selected');
        const selectItems = customSelect.querySelector('.select-items');
        const hiddenInput = customSelect.querySelector('input[type="hidden"]');

        selectSelected.addEventListener('click', function(e) {
            e.stopPropagation();
            selectSelected.classList.toggle('select-arrow-active');
            selectItems.classList.toggle('select-hide');
            customSelect.classList.toggle('active');
        });

        const selectOptions = selectItems.querySelectorAll('div');
        selectOptions.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                selectSelected.textContent = this.textContent;
                hiddenInput.value = this.getAttribute('data-value');
                selectItems.classList.add('select-hide');
                selectSelected.classList.remove('select-arrow-active');
                customSelect.classList.remove('active');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            selectItems.classList.add('select-hide');
            selectSelected.classList.remove('select-arrow-active');
            customSelect.classList.remove('active');
        });
    }
});

function validateEmail() {
    const email = document.getElementById('email').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    return true;
}