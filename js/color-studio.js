// Color Studio functionality for AI-powered color palette generation
class ColorStudio {
    constructor() {
        this.apiKey = null;
        this.savedPalettes = this.loadSavedPalettes();
        this.currentPalette = null;
        this.initializeEventListeners();
        this.checkApiStatus();
    }

    async checkApiStatus() {
        // Check if API key is available as environment variable
        try {
            const response = await fetch('/api/check-gemini-key');
            const data = await response.json();
            
            if (data.hasKey) {
                this.apiKey = 'server-configured'; // Use server-side API calls
                this.hideApiSetup();
                return;
            }
        } catch (error) {
            console.log('Server API check failed, showing manual input');
        }

        // Show the API setup notice for manual input
        const apiNotice = document.getElementById('api-setup-notice');
        if (apiNotice) {
            apiNotice.style.display = 'block';
        }
    }

    hideApiSetup() {
        const apiNotice = document.getElementById('api-setup-notice');
        if (apiNotice) {
            apiNotice.innerHTML = `
                <div class="notice-content">
                    <div class="api-connected">
                        AI Color Generation Active! Describe any color vision and generate professional palettes.
                    </div>
                </div>
            `;
        }
    }

    initializeEventListeners() {
        // API key connection
        const connectApiBtn = document.getElementById('connect-api-btn');
        if (connectApiBtn) {
            connectApiBtn.addEventListener('click', () => {
                this.connectApiKey();
            });
        }

        // Enter key in API input
        const apiKeyInput = document.getElementById('openai-api-key');
        if (apiKeyInput) {
            apiKeyInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.connectApiKey();
                }
            });
        }

        // Prompt example clicks
        document.querySelectorAll('.prompt-example').forEach(example => {
            example.addEventListener('click', () => {
                this.selectPromptExample(example);
            });
        });

        // Generate palette button
        const generateBtn = document.getElementById('generate-palette-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generatePalette();
            });
        }

        // Refresh palette button
        const refreshBtn = document.getElementById('refresh-palette-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshPalette();
            });
        }

        // Apply to preview button
        const applyBtn = document.getElementById('apply-to-preview-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyPaletteToPreview();
            });
        }

        // Save palette button
        const saveBtn = document.getElementById('save-palette-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.savePalette();
            });
        }

        // Try another button
        const tryAnotherBtn = document.getElementById('try-another-btn');
        if (tryAnotherBtn) {
            tryAnotherBtn.addEventListener('click', () => {
                this.resetGenerator();
            });
        }

        // Save design button
        const saveDesignBtn = document.getElementById('save-design-btn');
        if (saveDesignBtn) {
            saveDesignBtn.addEventListener('click', () => {
                this.saveDesign();
            });
        }
    }

    selectPromptExample(exampleElement) {
        // Remove active class from all examples
        document.querySelectorAll('.prompt-example').forEach(ex => {
            ex.classList.remove('active');
        });
        
        // Add active class to selected example
        exampleElement.classList.add('active');
        
        // Fill the prompt input with the example text
        const promptInput = document.getElementById('color-prompt');
        const promptText = exampleElement.getAttribute('data-prompt');
        if (promptInput && promptText) {
            promptInput.value = promptText;
        }
    }

    async generatePalette() {
        const promptInput = document.getElementById('color-prompt');
        const generateBtn = document.getElementById('generate-palette-btn');
        const btnText = generateBtn.querySelector('.btn-text');
        const btnLoading = generateBtn.querySelector('.btn-loading');

        if (!promptInput.value.trim()) {
            this.showNotification('Please describe your color vision first!', 'warning');
            return;
        }

        // Check if API key is available
        if (!this.apiKey) {
            this.showNotification('Using demo mode - upgrade to get AI-powered generation!', 'info');
            this.generateSamplePalette(promptInput.value);
            this.showRefreshButton();
            return;
        }

        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        generateBtn.disabled = true;

        try {
            const palette = await this.callOpenAIForPalette(promptInput.value);
            this.displayPalette(palette);
            this.showRefreshButton();
        } catch (error) {
            console.error('Error generating palette:', error);
            
            // If API quota exceeded or other API issues, fall back to demo mode
            if (error.message.includes('quota') || error.message.includes('API error')) {
                this.showNotification('API limit reached - using smart demo mode instead!', 'info');
                this.generateSamplePalette(promptInput.value);
                this.showRefreshButton();
            } else {
                this.showNotification('Failed to generate palette. Using demo mode.', 'warning');
                this.generateSamplePalette(promptInput.value);
                this.showRefreshButton();
            }
        } finally {
            // Reset button state
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            generateBtn.disabled = false;
        }
    }

    async refreshPalette() {
        const promptInput = document.getElementById('color-prompt');
        const refreshBtn = document.getElementById('refresh-palette-btn');
        const btnText = refreshBtn.querySelector('.btn-text');
        const btnLoading = refreshBtn.querySelector('.btn-loading');

        if (!promptInput.value.trim()) {
            this.showNotification('Enter a prompt first!', 'warning');
            return;
        }

        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        refreshBtn.disabled = true;

        try {
            // Always use demo mode for refresh to generate variations
            this.generateSamplePalette(promptInput.value, true); // true = force variation
            this.showNotification('Generated new color variation!', 'success');
        } finally {
            // Reset button state
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            refreshBtn.disabled = false;
        }
    }

    showRefreshButton() {
        const refreshBtn = document.getElementById('refresh-palette-btn');
        if (refreshBtn) {
            refreshBtn.style.display = 'block';
        }
    }

    generateSamplePalette(prompt, forceVariation = false) {
        // Enhanced sample palettes based on prompt keywords 
        const samplePalettes = {
            'aurora': ['#00ff88', '#4400ff', '#ff0099', '#00ffff', '#8800ff'],
            'borealis': ['#2d8659', '#6a0dad', '#ff1493', '#1e90ff', '#9370db'],
            'desert': ['#ddb892', '#c9a876', '#b8956a', '#e6c49a', '#8b7355'],
            'sunset': ['#ff6b35', '#f7931e', '#ffb347', '#ff7f50', '#cd853f'],
            'ocean': ['#1e3a5f', '#2d5a87', '#0f2844', '#1e4a6f', '#3d7eb8'],
            'storm': ['#2f4f4f', '#696969', '#778899', '#4682b4', '#5f9ea0'],
            'forest': ['#2d5016', '#4a7c2a', '#1a3d0a', '#3d6b1f', '#5d8c2f'],
            'jungle': ['#355e3b', '#228b22', '#006400', '#556b2f', '#8fbc8f'],
            'pine': ['#1c4532', '#2d5016', '#3d6b2a', '#4a7c28', '#0f2818'],
            'spruce': ['#0d2818', '#1c4532', '#355e1f', '#2d5016', '#4a7c28'],
            'cedar': ['#2d4532', '#3d5016', '#4a6c28', '#1a3d1a', '#355e2f'],
            'redwood': ['#8b4513', '#2d5016', '#a0522d', '#4a7c28', '#654321'],
            'deepforest': ['#0f1f0f', '#1a3d0a', '#2d5016', '#355e1f', '#0a1f0a'],
            'emerald': ['#2d5016', '#4a7c28', '#50c878', '#3cb371', '#355e1f'],
            'mossland': ['#8fbc8f', '#2d5016', '#9acd32', '#4a7c28', '#6b8e23'],
            'oldgrowth': ['#1a2e1a', '#2d5016', '#4a7c28', '#355e1f', '#0f1f0f'],
            'urban': ['#2a2a2a', '#4a4a4a', '#1a1a1a', '#3a3a3a', '#5a5a5a'],
            'night': ['#191970', '#2f2f4f', '#000080', '#1e1e3f', '#36454f'],
            'mountain': ['#5d4e37', '#8b7355', '#3d2f1f', '#6b5a45', '#4a3c2a'],
            'volcanic': ['#8b0000', '#2f1b14', '#654321', '#800000', '#a0522d'],
            'arctic': ['#e8f0ff', '#b8d4f0', '#d1e2f5', '#a8c4e8', '#c8ddf2'],
            'winter': ['#f0f8ff', '#e6f3ff', '#b0c4de', '#add8e6', '#87ceeb'],
            'tactical': ['#4b5320', '#2f4f2f', '#556b2f', '#6b8e23', '#9acd32'],
            'stealth': ['#36454f', '#2f4f4f', '#708090', '#696969', '#778899'],
            'electric': ['#00ffff', '#0080ff', '#4169e1', '#1e90ff', '#00bfff'],
            'neon': ['#39ff14', '#ff073a', '#ff6600', '#ffff00', '#bf00ff'],
            'dolph': ['#ff6b35', '#4caf50', '#2e7d32', '#ff8f65', '#66bb6a'],
            'young': ['#ff6b35', '#4caf50', '#2e7d32', '#ff8f65', '#66bb6a'],
            'orange': ['#ff6b35', '#ff8f65', '#ffa726', '#ff7043', '#ff5722'],
            'green': ['#4caf50', '#66bb6a', '#81c784', '#2e7d32', '#388e3c'],
            'street': ['#ff6b35', '#4caf50', '#2e2e2e', '#ff8f65', '#757575'],
            'hip': ['#ff6b35', '#4caf50', '#9c27b0', '#ff8f65', '#673ab7'],
            'hop': ['#ff6b35', '#4caf50', '#9c27b0', '#ff8f65', '#673ab7'],
            'bold': ['#ff1744', '#76ff03', '#ff6d00', '#00e676', '#ff3d00'],
            'liquid': ['#d4af37', '#cd853f', '#b8860b', '#daa520', '#f4a460'],
            'amber': ['#ffbf00', '#ff8c00', '#daa520', '#cd853f', '#b8860b'],
            'golden': ['#ffd700', '#daa520', '#b8860b', '#cd853f', '#d4af37'],
            'red': ['#8b0000', '#a0522d', '#cd853f', '#daa520', '#b8860b'],
            'autumn': ['#d2691e', '#cd853f', '#daa520', '#b8860b', '#a0522d'],
            'fall': ['#ff6347', '#cd853f', '#daa520', '#d2691e', '#a0522d'],
            'maple': ['#ff4500', '#ff6347', '#cd853f', '#daa520', '#d2691e']
        };

        let palette = ['#2c3e50', '#27ae60', '#34495e', '#2ecc71', '#1a252f']; // default
        let paletteName = 'Custom Tactical';

        // Check prompt for keywords and use appropriate palette
        const lowerPrompt = prompt.toLowerCase();
        for (const [keyword, colors] of Object.entries(samplePalettes)) {
            if (lowerPrompt.includes(keyword)) {
                palette = colors;
                paletteName = keyword.charAt(0).toUpperCase() + keyword.slice(1) + ' Tactical';
                break;
            }
        }

        // Add randomization - more variation for refresh button
        const variationAmount = forceVariation ? 0.4 : 0.2;
        palette = palette.map(color => this.adjustColorRandomly(color, variationAmount));

        // For refresh, also shuffle the palette order for variety
        if (forceVariation) {
            palette = this.shuffleArray([...palette]);
        }

        this.currentPalette = {
            colors: palette,
            name: paletteName,
            description: `Smart demo palette based on "${prompt}"${forceVariation ? ' (Variation)' : ''}`,
            prompt: prompt,
            timestamp: Date.now()
        };

        this.displayPalette(this.currentPalette);
    }

    adjustColorRandomly(hexColor, variationAmount = 0.2) {
        // Adjust color for variation - more dramatic for refresh button
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);

        const variation = 100 * variationAmount; // Scale variation amount
        const newR = Math.max(0, Math.min(255, r + (Math.random() - 0.5) * variation));
        const newG = Math.max(0, Math.min(255, g + (Math.random() - 0.5) * variation));
        const newB = Math.max(0, Math.min(255, b + (Math.random() - 0.5) * variation));

        return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    async callOpenAIForPalette(prompt) {
        if (!this.apiKey) {
            throw new Error('API key not configured');
        }

        try {
            // Use server-side API endpoint for better security
            const response = await fetch('/api/generate-palette', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${errorData.error || 'Unknown error'}`);
            }

            const palette = await response.json();
            return palette;

        } catch (error) {
            console.error('Color generation error:', error);
            throw error;
        }
    }

    displayPalette(palette) {
        const paletteResults = document.getElementById('palette-results');
        const colorSwatches = document.getElementById('color-swatches');
        const apiNotice = document.getElementById('api-setup-notice');

        // Hide API notice and show results
        if (apiNotice) apiNotice.style.display = 'none';
        if (paletteResults) paletteResults.style.display = 'block';

        // Clear existing swatches
        if (colorSwatches) {
            colorSwatches.innerHTML = '';

            // Create color swatches
            palette.colors.forEach((color, index) => {
                const swatch = document.createElement('div');
                swatch.className = 'color-swatch';
                swatch.style.backgroundColor = color;
                swatch.setAttribute('data-color', color);
                swatch.title = color;
                colorSwatches.appendChild(swatch);
            });
        }

        this.showNotification(`Generated ${palette.colors.length} colors for: "${palette.prompt}"`, 'success');
    }

    applyPaletteToPreview() {
        if (!this.currentPalette) {
            this.showNotification('Generate a palette first!', 'warning');
            return;
        }

        const patternPreview = document.getElementById('pattern-preview');
        const previewSvg = document.getElementById('preview-svg');

        if (patternPreview && previewSvg) {
            patternPreview.style.display = 'block';
            this.generatePatternWithColors(previewSvg, this.currentPalette.colors);
            this.showNotification('Pattern preview updated with your colors!', 'success');
        }
    }

    generatePatternWithColors(svgElement, colors) {
        // Generate a digital camo pattern using the provided colors
        const patternId = 'customPattern_' + Date.now();
        
        const patternHTML = `
            <defs>
                <pattern id="${patternId}" patternUnits="userSpaceOnUse" width="24" height="24">
                    <rect width="24" height="24" fill="${colors[0]}"/>
                    <rect x="2" y="1" width="7" height="5" fill="${colors[1]}"/>
                    <rect x="11" y="2" width="5" height="6" fill="${colors[2]}"/>
                    <rect x="1" y="9" width="8" height="4" fill="${colors[3]}"/>
                    <rect x="13" y="11" width="6" height="5" fill="${colors[1]}"/>
                    <rect x="3" y="16" width="9" height="4" fill="${colors[4] || colors[2]}"/>
                    <rect x="16" y="17" width="5" height="4" fill="${colors[0]}"/>
                </pattern>
            </defs>
            <rect width="400" height="300" fill="url(#${patternId})"/>
        `;

        svgElement.innerHTML = patternHTML;
    }

    savePalette() {
        if (!this.currentPalette) {
            this.showNotification('No palette to save!', 'warning');
            return;
        }

        this.savedPalettes.push({
            ...this.currentPalette,
            id: Date.now(),
            name: this.currentPalette.prompt.substring(0, 30) + '...'
        });

        this.saveToLocalStorage();
        this.updateSavedPalettesDisplay();
        this.showNotification('Palette saved successfully!', 'success');
    }

    saveDesign() {
        if (!this.currentPalette) {
            this.showNotification('No design to save!', 'warning');
            return;
        }

        // In a full implementation, this would save the complete design
        // For now, we'll save it as a special palette with pattern info
        const design = {
            ...this.currentPalette,
            id: Date.now(),
            name: 'Design: ' + this.currentPalette.prompt.substring(0, 25) + '...',
            type: 'design',
            hasPattern: true
        };

        this.savedPalettes.push(design);
        this.saveToLocalStorage();
        this.updateSavedPalettesDisplay();
        this.showNotification('Design saved successfully!', 'success');
    }

    resetGenerator() {
        const paletteResults = document.getElementById('palette-results');
        const patternPreview = document.getElementById('pattern-preview');
        const promptInput = document.getElementById('color-prompt');

        if (paletteResults) paletteResults.style.display = 'none';
        if (patternPreview) patternPreview.style.display = 'none';
        if (promptInput) promptInput.value = '';

        // Clear active example
        document.querySelectorAll('.prompt-example').forEach(ex => {
            ex.classList.remove('active');
        });

        this.currentPalette = null;
    }

    updateSavedPalettesDisplay() {
        const savedPalettesSection = document.getElementById('saved-palettes');
        const paletteGrid = document.getElementById('palette-grid');

        if (this.savedPalettes.length > 0 && savedPalettesSection && paletteGrid) {
            savedPalettesSection.style.display = 'block';
            
            paletteGrid.innerHTML = '';
            this.savedPalettes.forEach(palette => {
                const card = this.createSavedPaletteCard(palette);
                paletteGrid.appendChild(card);
            });
        }
    }

    createSavedPaletteCard(palette) {
        const card = document.createElement('div');
        card.className = 'saved-palette-card';
        
        const swatchesHTML = palette.colors.map(color => 
            `<div style="width: 20px; height: 20px; background: ${color}; border-radius: 3px; display: inline-block; margin-right: 4px;"></div>`
        ).join('');

        card.innerHTML = `
            <div style="margin-bottom: 8px;">${swatchesHTML}</div>
            <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">${palette.name}</div>
            <div style="font-size: 0.8rem; color: #666;">${new Date(palette.timestamp).toLocaleDateString()}</div>
            ${palette.type === 'design' ? '<div style="font-size: 0.7rem; color: #27ae60; font-weight: 600;">WITH PATTERN</div>' : ''}
        `;

        card.addEventListener('click', () => {
            this.loadSavedPalette(palette);
        });

        return card;
    }

    loadSavedPalette(palette) {
        this.currentPalette = palette;
        document.getElementById('color-prompt').value = palette.prompt;
        this.displayPalette(palette);
        
        if (palette.type === 'design' && palette.hasPattern) {
            this.applyPaletteToPreview();
        }
        
        this.showNotification(`Loaded: ${palette.name}`, 'info');
    }

    loadSavedPalettes() {
        try {
            const saved = localStorage.getItem('savomode_palettes');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading saved palettes:', error);
            return [];
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('savomode_palettes', JSON.stringify(this.savedPalettes));
        } catch (error) {
            console.error('Error saving palettes:', error);
        }
    }

    showNotification(message, type = 'info') {
        // Use the existing notification system from main.js
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            // Fallback notification
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    connectApiKey() {
        const apiKeyInput = document.getElementById('openai-api-key');
        const connectBtn = document.getElementById('connect-api-btn');
        const apiNotice = document.getElementById('api-setup-notice');

        if (!apiKeyInput || !apiKeyInput.value.trim()) {
            this.showNotification('Please enter your OpenAI API key', 'warning');
            return;
        }

        const apiKey = apiKeyInput.value.trim();

        // Basic validation - OpenAI keys start with 'sk-'
        if (!apiKey.startsWith('sk-')) {
            this.showNotification('Invalid API key format. OpenAI keys start with "sk-"', 'error');
            return;
        }

        // Store the API key
        this.apiKey = apiKey;
        
        // Hide the API setup notice
        if (apiNotice) {
            apiNotice.innerHTML = `
                <div class="notice-content">
                    <div class="api-connected">
                        AI Color Generation Connected! You can now generate unlimited custom color palettes.
                    </div>
                </div>
            `;
        }

        // Clear the input for security
        apiKeyInput.value = '';

        this.showNotification('AI color generation activated! Try describing any color vision.', 'success');
        console.log('OpenAI API key configured for Color Studio');
    }

    // Method to set API key when available
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        const apiNotice = document.getElementById('api-setup-notice');
        if (apiNotice) {
            apiNotice.style.display = 'none';
        }
        console.log('OpenAI API key configured for Color Studio');
    }
}

// Initialize Color Studio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('color-generator')) {
        window.colorStudio = new ColorStudio();
        console.log('🎨 Color Studio initialized');
    }
});
