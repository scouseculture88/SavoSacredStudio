/**
 * Accessibility Features for Savo Mode
 * Provides comprehensive accessibility support including color blindness,
 * motor disabilities, and screen reader enhancements
 */

class AccessibilityManager {
    constructor() {
        this.settings = {
            colorBlindFilter: 'none',
            highContrast: false,
            fontSize: 'normal',
            motionReduced: false,
            texturePatterns: false,
            dyslexiaFont: false,
            showAltText: false
        };
        
        this.init();
        this.loadSettings();
    }

    init() {
        this.createAccessibilityControls();
        this.createColorBlindFilters();
        this.setupKeyboardNavigation();
        this.addAriaLabels();
        this.setupPatternDescriptions();
        this.detectKeyboardUser();
    }

    createAccessibilityControls() {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'accessibility-toggle';
        toggleButton.innerHTML = '♿';
        toggleButton.setAttribute('aria-label', 'Open accessibility options');
        toggleButton.addEventListener('click', () => this.toggleAccessibilityPanel());
        document.body.appendChild(toggleButton);

        const panel = document.createElement('div');
        panel.className = 'accessibility-panel';
        panel.id = 'accessibility-panel';
        panel.innerHTML = this.createAccessibilityPanelHTML();
        document.body.appendChild(panel);

        this.bindAccessibilityControls();
    }

    createAccessibilityPanelHTML() {
        return `
            <div class="accessibility-section">
                <h4>Vision Support</h4>
                <div class="accessibility-option">
                    <input type="radio" id="filter-none" name="colorblind" value="none" checked>
                    <label for="filter-none">Normal Vision</label>
                </div>
                <div class="accessibility-option">
                    <input type="radio" id="filter-deuteranopia" name="colorblind" value="deuteranopia">
                    <label for="filter-deuteranopia">Deuteranopia (Red-Green)</label>
                </div>
                <div class="accessibility-option">
                    <input type="radio" id="filter-protanopia" name="colorblind" value="protanopia">
                    <label for="filter-protanopia">Protanopia (Red)</label>
                </div>
                <div class="accessibility-option">
                    <input type="radio" id="filter-tritanopia" name="colorblind" value="tritanopia">
                    <label for="filter-tritanopia">Tritanopia (Blue-Yellow)</label>
                </div>
                <div class="accessibility-option">
                    <input type="checkbox" id="high-contrast">
                    <label for="high-contrast">High Contrast</label>
                </div>
                <div class="accessibility-option">
                    <input type="checkbox" id="pattern-textures">
                    <label for="pattern-textures">Pattern Textures</label>
                </div>
            </div>

            <div class="accessibility-section">
                <h4>Text & Reading</h4>
                <div class="accessibility-option">
                    <label for="font-size">Font Size:</label>
                    <select id="font-size">
                        <option value="small">Small</option>
                        <option value="normal" selected>Normal</option>
                        <option value="large">Large</option>
                        <option value="xl">Extra Large</option>
                    </select>
                </div>
                <div class="accessibility-option">
                    <input type="checkbox" id="dyslexia-font">
                    <label for="dyslexia-font">Dyslexia-Friendly Font</label>
                </div>
                <div class="accessibility-option">
                    <input type="checkbox" id="show-alt-text">
                    <label for="show-alt-text">Show Pattern Descriptions</label>
                </div>
            </div>

            <div class="accessibility-section">
                <h4>Motion & Interaction</h4>
                <div class="accessibility-option">
                    <input type="checkbox" id="reduce-motion">
                    <label for="reduce-motion">Reduce Motion</label>
                </div>
            </div>

            <button class="btn" onclick="accessibilityManager.resetSettings()">Reset to Default</button>
        `;
    }

    createColorBlindFilters() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.className = 'accessibility-filters';
        svg.innerHTML = `
            <defs>
                <filter id="deuteranopia">
                    <feColorMatrix type="matrix" values="0.625 0.375 0 0 0
                                                         0.7 0.3 0 0 0
                                                         0 0.3 0.7 0 0
                                                         0 0 0 1 0"/>
                </filter>
                <filter id="protanopia">
                    <feColorMatrix type="matrix" values="0.567 0.433 0 0 0
                                                         0.558 0.442 0 0 0
                                                         0 0.242 0.758 0 0
                                                         0 0 0 1 0"/>
                </filter>
                <filter id="tritanopia">
                    <feColorMatrix type="matrix" values="0.95 0.05 0 0 0
                                                         0 0.433 0.567 0 0
                                                         0 0.475 0.525 0 0
                                                         0 0 0 1 0"/>
                </filter>
            </defs>
        `;
        document.body.appendChild(svg);
    }

    bindAccessibilityControls() {
        // Color blind filters
        document.querySelectorAll('input[name="colorblind"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.applyColorBlindFilter(e.target.value);
            });
        });

        // High contrast
        document.getElementById('high-contrast').addEventListener('change', (e) => {
            this.toggleHighContrast(e.target.checked);
        });

        // Font size
        document.getElementById('font-size').addEventListener('change', (e) => {
            this.changeFontSize(e.target.value);
        });

        // Pattern textures
        document.getElementById('pattern-textures').addEventListener('change', (e) => {
            this.togglePatternTextures(e.target.checked);
        });

        // Dyslexia font
        document.getElementById('dyslexia-font').addEventListener('change', (e) => {
            this.toggleDyslexiaFont(e.target.checked);
        });

        // Show alt text
        document.getElementById('show-alt-text').addEventListener('change', (e) => {
            this.toggleAltText(e.target.checked);
        });

        // Reduce motion
        document.getElementById('reduce-motion').addEventListener('change', (e) => {
            this.toggleReducedMotion(e.target.checked);
        });
    }

    toggleAccessibilityPanel() {
        const panel = document.getElementById('accessibility-panel');
        panel.classList.toggle('active');
    }

    applyColorBlindFilter(filterType) {
        this.settings.colorBlindFilter = filterType;
        const body = document.body;
        
        // Remove existing filter classes
        body.classList.remove('deuteranopia-filter', 'protanopia-filter', 'tritanopia-filter');
        
        if (filterType !== 'none') {
            body.classList.add(`${filterType}-filter`);
        }
        
        this.saveSettings();
        this.announceChange(`Color vision filter changed to ${filterType}`);
    }

    toggleHighContrast(enabled) {
        this.settings.highContrast = enabled;
        document.body.classList.toggle('high-contrast', enabled);
        this.saveSettings();
        this.announceChange(`High contrast ${enabled ? 'enabled' : 'disabled'}`);
    }

    changeFontSize(size) {
        this.settings.fontSize = size;
        const body = document.body;
        
        // Remove existing font size classes
        body.classList.remove('font-small', 'font-normal', 'font-large', 'font-xl');
        body.classList.add(`font-${size}`);
        
        this.saveSettings();
        this.announceChange(`Font size changed to ${size}`);
    }

    togglePatternTextures(enabled) {
        this.settings.texturePatterns = enabled;
        const patterns = document.querySelectorAll('.pattern-card canvas, .pattern-preview canvas');
        patterns.forEach(canvas => {
            canvas.closest('.pattern-card, .pattern-preview')?.classList.toggle('pattern-accessible', enabled);
            if (enabled) {
                canvas.closest('.pattern-card, .pattern-preview')?.classList.add('show-texture');
            } else {
                canvas.closest('.pattern-card, .pattern-preview')?.classList.remove('show-texture');
            }
        });
        
        this.saveSettings();
        this.announceChange(`Pattern textures ${enabled ? 'enabled' : 'disabled'}`);
    }

    toggleDyslexiaFont(enabled) {
        this.settings.dyslexiaFont = enabled;
        document.body.classList.toggle('dyslexia-font', enabled);
        this.saveSettings();
        this.announceChange(`Dyslexia-friendly font ${enabled ? 'enabled' : 'disabled'}`);
    }

    toggleAltText(enabled) {
        this.settings.showAltText = enabled;
        document.body.classList.toggle('show-alt-text', enabled);
        this.saveSettings();
        this.announceChange(`Pattern descriptions ${enabled ? 'shown' : 'hidden'}`);
    }

    toggleReducedMotion(enabled) {
        this.settings.motionReduced = enabled;
        document.body.classList.toggle('reduce-motion', enabled);
        
        if (enabled) {
            // Stop background animations
            const backgrounds = document.querySelectorAll('.dynamic-background');
            backgrounds.forEach(bg => bg.style.animationPlayState = 'paused');
        } else {
            // Resume background animations
            const backgrounds = document.querySelectorAll('.dynamic-background');
            backgrounds.forEach(bg => bg.style.animationPlayState = 'running');
        }
        
        this.saveSettings();
        this.announceChange(`Motion reduction ${enabled ? 'enabled' : 'disabled'}`);
    }

    setupKeyboardNavigation() {
        // Add keyboard navigation hints
        const keyboardNav = document.createElement('div');
        keyboardNav.className = 'keyboard-nav';
        keyboardNav.innerHTML = `
            <strong>Keyboard Navigation:</strong><br>
            Tab: Navigate • Enter: Activate • Space: Select<br>
            Esc: Close dialogs • Arrow keys: Navigate patterns
        `;
        document.body.appendChild(keyboardNav);

        // Enhanced focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-user');
            }
            
            if (e.key === 'Escape') {
                // Close accessibility panel
                document.getElementById('accessibility-panel').classList.remove('active');
                // Close any open modals
                document.querySelectorAll('.modal.active, .zoom-modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });

        // Add focus indicators to interactive elements
        const focusableElements = document.querySelectorAll('button, a, input, select, textarea, canvas, [tabindex]');
        focusableElements.forEach(element => {
            element.classList.add('accessible-focus');
        });
    }

    detectKeyboardUser() {
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-user');
        });
    }

    addAriaLabels() {
        // Add ARIA labels to pattern cards
        const patternCards = document.querySelectorAll('.pattern-card');
        patternCards.forEach((card, index) => {
            if (!card.getAttribute('aria-label')) {
                card.setAttribute('aria-label', `Pattern ${index + 1}`);
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
            }
        });

        // Add ARIA labels to color swatches
        const colorSwatches = document.querySelectorAll('.color-swatch');
        colorSwatches.forEach(swatch => {
            const color = swatch.style.backgroundColor || swatch.dataset.color;
            if (color && !swatch.getAttribute('aria-label')) {
                swatch.setAttribute('aria-label', `Color: ${color}`);
            }
        });

        // Add ARIA live regions for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'accessibility-announcements';
        document.body.appendChild(liveRegion);
    }

    setupPatternDescriptions() {
        // Add pattern descriptions for screen readers
        const patternCards = document.querySelectorAll('.pattern-card');
        patternCards.forEach((card, index) => {
            const canvas = card.querySelector('canvas');
            if (canvas) {
                const description = document.createElement('div');
                description.className = 'pattern-description sr-only';
                description.textContent = this.generatePatternDescription(card, index);
                card.appendChild(description);

                // Add color labels
                const colorLabel = document.createElement('div');
                colorLabel.className = 'color-label';
                colorLabel.textContent = this.getPatternColors(card);
                card.appendChild(colorLabel);
            }
        });
    }

    generatePatternDescription(patternCard, index) {
        // Try to get pattern data from various sources
        const patternName = patternCard.dataset.patternName || patternCard.querySelector('.pattern-name')?.textContent || `Pattern ${index + 1}`;
        const patternType = patternCard.dataset.patternType || 'tactical camouflage';
        const colors = this.getPatternColors(patternCard);
        
        return `${patternName}: ${patternType} pattern featuring ${colors}. Click to view full size or save to library.`;
    }

    getPatternColors(patternCard) {
        // Extract dominant colors from pattern data or canvas
        const canvas = patternCard.querySelector('canvas');
        if (canvas && canvas.dataset.colors) {
            return canvas.dataset.colors;
        }
        
        // Default color description
        return 'earth tones and tactical colors';
    }

    announceChange(message) {
        const liveRegion = document.getElementById('accessibility-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    saveSettings() {
        localStorage.setItem('savoModeAccessibility', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('savoModeAccessibility');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            this.applySettings();
        }
    }

    applySettings() {
        // Apply color blind filter
        if (this.settings.colorBlindFilter !== 'none') {
            document.body.classList.add(`${this.settings.colorBlindFilter}-filter`);
            document.querySelector(`input[value="${this.settings.colorBlindFilter}"]`).checked = true;
        }

        // Apply high contrast
        if (this.settings.highContrast) {
            document.body.classList.add('high-contrast');
            document.getElementById('high-contrast').checked = true;
        }

        // Apply font size
        if (this.settings.fontSize !== 'normal') {
            document.body.classList.add(`font-${this.settings.fontSize}`);
            document.getElementById('font-size').value = this.settings.fontSize;
        }

        // Apply other settings
        if (this.settings.texturePatterns) {
            this.togglePatternTextures(true);
            document.getElementById('pattern-textures').checked = true;
        }

        if (this.settings.dyslexiaFont) {
            document.body.classList.add('dyslexia-font');
            document.getElementById('dyslexia-font').checked = true;
        }

        if (this.settings.showAltText) {
            document.body.classList.add('show-alt-text');
            document.getElementById('show-alt-text').checked = true;
        }

        if (this.settings.motionReduced) {
            this.toggleReducedMotion(true);
            document.getElementById('reduce-motion').checked = true;
        }
    }

    resetSettings() {
        this.settings = {
            colorBlindFilter: 'none',
            highContrast: false,
            fontSize: 'normal',
            motionReduced: false,
            texturePatterns: false,
            dyslexiaFont: false,
            showAltText: false
        };

        // Reset DOM
        document.body.className = document.body.className.replace(/deuteranopia-filter|protanopia-filter|tritanopia-filter|high-contrast|font-\w+|reduce-motion|dyslexia-font|show-alt-text/g, '');
        
        // Reset form controls
        document.querySelector('input[value="none"]').checked = true;
        document.getElementById('high-contrast').checked = false;
        document.getElementById('font-size').value = 'normal';
        document.getElementById('pattern-textures').checked = false;
        document.getElementById('dyslexia-font').checked = false;
        document.getElementById('show-alt-text').checked = false;
        document.getElementById('reduce-motion').checked = false;

        this.saveSettings();
        this.announceChange('Accessibility settings reset to default');
    }

    // Method to be called when new patterns are generated
    updatePatternAccessibility() {
        this.setupPatternDescriiptions();
        if (this.settings.texturePatterns) {
            this.togglePatternTextures(true);
        }
    }
}

// Initialize accessibility manager when DOM is loaded
let accessibilityManager;
document.addEventListener('DOMContentLoaded', () => {
    accessibilityManager = new AccessibilityManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
}