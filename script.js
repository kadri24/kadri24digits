// Store lenis instance globally
let lenisInstance = null;

// Simple smooth scrolling with local Lenis UMD version
function initSmoothScrolling() {
    // Check for Lenis in different possible locations
    var LenisConstructor = window.lenis || window.Lenis;
    
    if (typeof LenisConstructor !== 'undefined') {
        try {
            const lenis = new LenisConstructor({
                duration: 1.2,
                easing: function(t) { 
                    return Math.min(1, 1.001 - Math.pow(2, -10 * t)); 
                },
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                mouseMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false,
            });

            // Store instance for parallax
            lenisInstance = lenis;

            function raf(time) {
                lenis.raf(time);
                // Update parallax on each frame
                updateParallax(lenis.scroll);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);
            
            console.log('Lenis smooth scrolling initialized successfully');
            return true;
        } catch (error) {
            console.warn('Lenis failed to initialize:', error);
        }
    }
    
    // Fallback to native smooth scrolling
    console.log('Using native smooth scroll as fallback');
    document.documentElement.style.scrollBehavior = 'smooth';
    return false;
}

// Parallax effect for game backgrounds - keeping your dramatic effect
function updateParallax(scrollY) {
    const gameBackgrounds = document.querySelectorAll('.game-background');
    
    if (gameBackgrounds.length > 0) {
        // Keep your preferred speed of 5 but add slight responsiveness
        let speed = 5;
        
        // Slight adjustment for very small screens to prevent excessive movement
        if (window.innerWidth < 768) {
            speed = 3; // Reduced speed for mobile
        } else if (window.innerWidth < 1200) {
            speed = 4; // Medium speed for tablets
        }
        // Desktop keeps speed = 5
        
        gameBackgrounds.forEach(function(background) {
            // Get the position of the background relative to the document
            const rect = background.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const elementBottom = elementTop + rect.height;
            
            // Get current viewport position
            const viewportTop = scrollY;
            const viewportBottom = scrollY + window.innerHeight;
            
            // Only apply parallax if the element is in or near the viewport
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                // Calculate how far the element is scrolled through the viewport
                const scrolledPercentage = ((viewportBottom - elementTop) / (window.innerHeight + rect.height)) * 100;
                
                // Apply parallax effect
                const yPos = (scrolledPercentage - 50) * speed;
                background.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initSmoothScrolling, 100);
    });
} else {
    setTimeout(initSmoothScrolling, 100);
}

// Recalculate on resize
window.addEventListener('resize', function() {
    if (lenisInstance) {
        updateParallax(lenisInstance.scroll);
    }
});