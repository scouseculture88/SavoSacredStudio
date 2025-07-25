/**
 * Design Process Visualizer JavaScript
 * Handles interactive timeline, phase switching, and canvas content
 */

class DesignProcessVisualizer {
    constructor() {
        this.currentPhase = null;
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.animateOnLoad();
    }

    setupEventListeners() {
        // Phase marker clicks
        const phaseMarkers = document.querySelectorAll('.phase-marker');
        phaseMarkers.forEach(marker => {
            marker.addEventListener('click', (e) => {
                const phase = e.currentTarget.closest('.process-phase');
                const phaseType = phase.getAttribute('data-phase');
                this.switchPhase(phaseType);
            });
        });

        // Phase content hover effects
        const phaseContents = document.querySelectorAll('.phase-content');
        phaseContents.forEach(content => {
            content.addEventListener('mouseenter', (e) => {
                const phase = e.currentTarget.closest('.process-phase');
                const phaseType = phase.getAttribute('data-phase');
                this.highlightPhase(phaseType);
            });

            content.addEventListener('mouseleave', () => {
                this.unhighlightPhases();
            });
        });

        // Reset canvas on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.process-phase') && !e.target.closest('.canvas-container')) {
                this.resetCanvas();
            }
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe timeline phases
        const phases = document.querySelectorAll('.process-phase');
        phases.forEach(phase => observer.observe(phase));

        // Observe principle cards
        const principleCards = document.querySelectorAll('.principle-card');
        principleCards.forEach(card => observer.observe(card));
    }

    animateElement(element) {
        if (element.classList.contains('process-phase')) {
            this.animatePhase(element);
        } else if (element.classList.contains('principle-card')) {
            this.animatePrincipleCard(element);
        }
    }

    animatePhase(phase) {
        const marker = phase.querySelector('.phase-marker');
        const content = phase.querySelector('.phase-content');
        
        // Animate marker
        marker.style.transform = 'scale(0)';
        marker.style.opacity = '0';
        
        setTimeout(() => {
            marker.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            marker.style.transform = 'scale(1)';
            marker.style.opacity = '1';
        }, 200);

        // Animate content
        content.style.transform = 'translateY(50px)';
        content.style.opacity = '0';
        
        setTimeout(() => {
            content.style.transition = 'all 0.6s ease';
            content.style.transform = 'translateY(0)';
            content.style.opacity = '1';
        }, 400);
    }

    animatePrincipleCard(card) {
        card.style.transform = 'translateY(30px)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        }, 100);
    }

    switchPhase(phaseType) {
        if (this.isAnimating || this.currentPhase === phaseType) return;
        
        this.isAnimating = true;
        this.currentPhase = phaseType;

        // Hide default content
        const defaultContent = document.querySelector('.canvas-default');
        defaultContent.classList.remove('active');

        // Hide all phase contents
        const allPhaseContents = document.querySelectorAll('.canvas-phase');
        allPhaseContents.forEach(content => {
            content.classList.remove('active');
        });

        // Show selected phase content
        setTimeout(() => {
            const selectedContent = document.getElementById(`${phaseType}-content`);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
            
            // Update phase markers
            this.updatePhaseMarkers(phaseType);
            
            this.isAnimating = false;
        }, 300);

        // Analytics
        this.trackPhaseSelection(phaseType);
    }

    updatePhaseMarkers(activePhase) {
        const markers = document.querySelectorAll('.phase-marker');
        markers.forEach(marker => {
            const phase = marker.closest('.process-phase');
            const phaseType = phase.getAttribute('data-phase');
            
            if (phaseType === activePhase) {
                marker.style.background = '#2ecc71';
                marker.style.transform = 'scale(1.1)';
            } else {
                marker.style.background = '#27ae60';
                marker.style.transform = 'scale(1)';
            }
        });
    }

    highlightPhase(phaseType) {
        const phase = document.querySelector(`[data-phase="${phaseType}"]`);
        if (phase) {
            const marker = phase.querySelector('.phase-marker');
            marker.style.background = '#2ecc71';
            marker.style.transform = 'scale(1.05)';
        }
    }

    unhighlightPhases() {
        const markers = document.querySelectorAll('.phase-marker');
        markers.forEach(marker => {
            const phase = marker.closest('.process-phase');
            const phaseType = phase.getAttribute('data-phase');
            
            if (phaseType !== this.currentPhase) {
                marker.style.background = '#27ae60';
                marker.style.transform = 'scale(1)';
            }
        });
    }

    resetCanvas() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentPhase = null;

        // Hide all phase contents
        const allPhaseContents = document.querySelectorAll('.canvas-phase');
        allPhaseContents.forEach(content => {
            content.classList.remove('active');
        });

        // Show default content
        setTimeout(() => {
            const defaultContent = document.querySelector('.canvas-default');
            defaultContent.classList.add('active');
            
            // Reset all markers
            this.updatePhaseMarkers(null);
            
            this.isAnimating = false;
        }, 300);
    }

    animateOnLoad() {
        // Animate hero stats
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach((stat, index) => {
            const finalValue = stat.textContent;
            const numericValue = parseInt(finalValue.replace(/\D/g, ''));
            
            if (numericValue) {
                this.animateNumber(stat, 0, numericValue, finalValue, index * 200);
            }
        });

        // Animate timeline line
        const timelineLine = document.querySelector('.timeline-line');
        if (timelineLine) {
            timelineLine.style.height = '0';
            timelineLine.style.transition = 'height 2s ease';
            
            setTimeout(() => {
                timelineLine.style.height = '100%';
            }, 500);
        }
    }

    animateNumber(element, start, end, suffix, delay) {
        setTimeout(() => {
            const duration = 1000;
            const startTime = Date.now();
            const isNumeric = !isNaN(end);
            
            const update = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.round(start + (end - start) * easeOutQuart);
                
                if (isNumeric) {
                    element.textContent = current === end ? suffix : current;
                } else {
                    element.textContent = suffix;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };
            
            update();
        }, delay);
    }

    trackPhaseSelection(phaseType) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'design_phase_selected', {
                'phase_type': phaseType,
                'timestamp': new Date().toISOString()
            });
        }

        // Console logging for development
        console.log(`🎨 Design phase selected: ${phaseType}`);
    }

    // Public methods for external interaction
    selectPhase(phaseType) {
        this.switchPhase(phaseType);
    }

    getCurrentPhase() {
        return this.currentPhase;
    }

    getPhaseProgress() {
        const phases = ['discovery', 'ideation', 'prototyping', 'development', 'evolution'];
        const currentIndex = phases.indexOf(this.currentPhase);
        return currentIndex >= 0 ? (currentIndex + 1) / phases.length : 0;
    }
}

// Initialize the visualizer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the design process visualizer
    const processVisualizer = new DesignProcessVisualizer();
    
    // Make it globally accessible
    window.processVisualizer = processVisualizer;
    
    // Initialize navigation
    if (typeof initializeNavigation === 'function') {
        initializeNavigation();
    }
    
    // Initialize accessibility
    if (typeof AccessibilityManager !== 'undefined') {
        const accessibilityManager = new AccessibilityManager();
        accessibilityManager.init();
    }
    
    console.log('🎨 Design Process Visualizer initialized successfully');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DesignProcessVisualizer;
}