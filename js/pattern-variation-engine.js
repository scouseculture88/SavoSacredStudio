// Pattern Variation Engine JavaScript
// Advanced system for generating pattern variations

class PatternVariationEngine {
    constructor() {
        this.sourcePattern = null;
        this.variations = [];
        this.currentVariation = null;
        this.variationSettings = {
            density: 20,
            scale: 30,
            color: 15,
            rotation: 25,
            position: 20,
            opacity: 10
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSamplePattern();
        this.updateControlValues();
    }
    
    setupEventListeners() {
        // Control sliders
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.handleSliderChange(e);
            });
        });
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Pattern upload
        document.getElementById('pattern-upload').addEventListener('change', (e) => {
            this.handlePatternUpload(e.target.files[0]);
        });
        
        // Generate variations on slider change
        this.debounceGenerate = this.debounce(() => {
            if (this.sourcePattern) {
                this.generateVariations();
            }
        }, 500);
    }
    
    handleSliderChange(e) {
        const sliderId = e.target.id.replace('-variation', '');
        const value = parseInt(e.target.value);
        
        this.variationSettings[sliderId] = value;
        
        // Update display value
        const valueDisplay = e.target.parentElement.querySelector('.control-value');
        valueDisplay.textContent = `${value}%`;
        
        // Generate new variations
        this.debounceGenerate();
    }
    
    updateControlValues() {
        Object.entries(this.variationSettings).forEach(([key, value]) => {
            const slider = document.getElementById(`${key}-variation`);
            const valueDisplay = slider.parentElement.querySelector('.control-value');
            
            slider.value = value;
            valueDisplay.textContent = `${value}%`;
        });
    }
    
    loadSamplePattern() {
        // Load a sample forest pattern for demonstration
        this.sourcePattern = {
            id: 'sample-forest',
            name: 'Forest Camo Sample',
            description: 'Temperate forest camouflage pattern',
            type: 'Forest',
            colors: ['#2d5016', '#4a7c28', '#7cff50', '#1a3d0a'],
            density: 0.7,
            scale: 1.0,
            data: this.generateSamplePatternData()
        };
        
        this.updateSourceDisplay();
        this.generateVariations();
    }
    
    generateSamplePatternData() {
        // Generate sample pattern data for forest camo
        const elements = [];
        const colors = ['#2d5016', '#4a7c28', '#7cff50', '#1a3d0a'];
        
        for (let i = 0; i < 50; i++) {
            elements.push({
                x: Math.random() * 400,
                y: Math.random() * 300,
                size: 20 + Math.random() * 40,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                opacity: 0.7 + Math.random() * 0.3
            });
        }
        
        return { elements, width: 400, height: 300 };
    }
    
    updateSourceDisplay() {
        if (!this.sourcePattern) return;
        
        // Update source info
        document.getElementById('source-title').textContent = this.sourcePattern.name;
        document.getElementById('source-description').textContent = this.sourcePattern.description;
        document.getElementById('source-type').textContent = this.sourcePattern.type;
        document.getElementById('source-colors').textContent = `${this.sourcePattern.colors.length} colors`;
        document.getElementById('source-density').textContent = `${Math.round(this.sourcePattern.density * 100)}%`;
        
        // Render source pattern
        this.renderSourcePattern();
    }
    
    renderSourcePattern() {
        const preview = document.getElementById('source-preview');
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        
        const ctx = canvas.getContext('2d');
        this.drawPattern(ctx, this.sourcePattern.data, 1.0);
        
        preview.innerHTML = '';
        preview.appendChild(canvas);
    }
    
    drawPattern(ctx, patternData, scaleFactor = 1.0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw background
        ctx.fillStyle = '#1a3d0a';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw pattern elements
        patternData.elements.forEach(element => {
            ctx.globalAlpha = element.opacity;
            ctx.fillStyle = element.color;
            
            ctx.save();
            ctx.translate(element.x * scaleFactor, element.y * scaleFactor);
            ctx.rotate(element.rotation * Math.PI / 180);
            
            // Draw irregular forest shape
            this.drawForestShape(ctx, element.size * scaleFactor);
            
            ctx.restore();
        });
        
        ctx.globalAlpha = 1.0;
    }
    
    drawForestShape(ctx, size) {
        ctx.beginPath();
        const sides = 6 + Math.floor(Math.random() * 4);
        const irregularity = 0.3;
        
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            const radius = size * (0.7 + Math.random() * irregularity);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        ctx.fill();
    }
    
    generateVariations() {
        if (!this.sourcePattern) return;
        
        this.variations = [];
        
        // Generate 6 variations
        for (let i = 0; i < 6; i++) {
            const variation = this.createVariation(i);
            this.variations.push(variation);
        }
        
        this.renderVariations();
    }
    
    createVariation(index) {
        const variation = {
            id: `variation-${Date.now()}-${index}`,
            name: `Variation ${index + 1}`,
            sourceId: this.sourcePattern.id,
            settings: { ...this.variationSettings },
            data: this.applyVariations(this.sourcePattern.data, index)
        };
        
        return variation;
    }
    
    applyVariations(sourceData, variationIndex) {
        const newData = {
            elements: [],
            width: sourceData.width,
            height: sourceData.height
        };
        
        // Apply variations to each element
        sourceData.elements.forEach(element => {
            const newElement = { ...element };
            
            // Apply density variation (skip some elements)
            if (Math.random() * 100 > this.variationSettings.density) {
                // Skip this element based on density setting
                if (Math.random() < 0.3) return;
            }
            
            // Apply scale variation
            const scaleVariation = (this.variationSettings.scale / 100) * (Math.random() - 0.5) * 2;
            newElement.size *= (1 + scaleVariation);
            
            // Apply position variation
            const positionVariation = this.variationSettings.position / 100;
            newElement.x += (Math.random() - 0.5) * 100 * positionVariation;
            newElement.y += (Math.random() - 0.5) * 100 * positionVariation;
            
            // Keep within bounds
            newElement.x = Math.max(0, Math.min(sourceData.width, newElement.x));
            newElement.y = Math.max(0, Math.min(sourceData.height, newElement.y));
            
            // Apply rotation variation
            const rotationVariation = (this.variationSettings.rotation / 100) * (Math.random() - 0.5) * 360;
            newElement.rotation += rotationVariation;
            
            // Apply opacity variation
            const opacityVariation = (this.variationSettings.opacity / 100) * (Math.random() - 0.5) * 0.5;
            newElement.opacity = Math.max(0.1, Math.min(1.0, newElement.opacity + opacityVariation));
            
            // Apply color variation
            if (Math.random() < this.variationSettings.color / 100) {
                newElement.color = this.varyColor(newElement.color, this.variationSettings.color / 100);
            }
            
            newData.elements.push(newElement);
        });
        
        return newData;
    }
    
    varyColor(hexColor, variation) {
        // Convert hex to RGB
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        
        // Apply variation
        const vary = (value) => {
            const change = (Math.random() - 0.5) * 2 * variation * 100;
            return Math.max(0, Math.min(255, Math.round(value + change)));
        };
        
        const newR = vary(r);
        const newG = vary(g);
        const newB = vary(b);
        
        // Convert back to hex
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    renderVariations() {
        const grid = document.getElementById('variations-grid');
        
        if (this.variations.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i data-feather="image"></i>
                    <h3>No variations generated</h3>
                    <p>Load a source pattern to generate variations</p>
                </div>
            `;
            feather.replace();
            return;
        }
        
        grid.innerHTML = this.variations.map(variation => 
            this.createVariationCard(variation)
        ).join('');
        
        // Add event listeners to cards
        grid.querySelectorAll('.variation-card').forEach(card => {
            card.addEventListener('click', () => {
                const variationId = card.dataset.id;
                this.showVariationDetail(variationId);
            });
        });
        
        // Render canvases
        this.variations.forEach(variation => {
            const canvas = document.querySelector(`[data-id="${variation.id}"] canvas`);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                this.drawPattern(ctx, variation.data, 0.7);
            }
        });
        
        feather.replace();
    }
    
    createVariationCard(variation) {
        const stats = this.calculateVariationStats(variation);
        
        return `
            <div class="variation-card fade-in" data-id="${variation.id}">
                <div class="variation-preview">
                    <canvas width="280" height="160"></canvas>
                </div>
                <div class="variation-info">
                    <h4>${variation.name}</h4>
                    <div class="variation-stats">
                        <div class="stat-item">
                            <span class="stat-value">${stats.density}%</span>
                            <span class="stat-label">Density</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${stats.scale}%</span>
                            <span class="stat-label">Scale</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${stats.uniqueness}%</span>
                            <span class="stat-label">Unique</span>
                        </div>
                    </div>
                    <div class="variation-actions-card">
                        <button class="btn btn-secondary" onclick="event.stopPropagation(); variationEngine.exportVariation('${variation.id}')">
                            <i data-feather="download"></i>
                            Export
                        </button>
                        <button class="btn btn-primary" onclick="event.stopPropagation(); variationEngine.saveVariation('${variation.id}')">
                            <i data-feather="save"></i>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    calculateVariationStats(variation) {
        const originalCount = this.sourcePattern.data.elements.length;
        const newCount = variation.data.elements.length;
        
        return {
            density: Math.round((newCount / originalCount) * 100),
            scale: Math.round(100 + (Math.random() - 0.5) * this.variationSettings.scale),
            uniqueness: Math.round(20 + Math.random() * 60)
        };
    }
    
    showVariationDetail(variationId) {
        const variation = this.variations.find(v => v.id === variationId);
        if (!variation) return;
        
        this.currentVariation = variation;
        
        // Render detail canvas
        const detailCanvas = document.getElementById('detail-canvas');
        const ctx = detailCanvas.getContext('2d');
        this.drawPattern(ctx, variation.data, 1.0);
        
        // Populate variation properties
        this.populateVariationProperties(variation);
        
        // Show modal
        document.getElementById('variation-detail-modal').classList.add('active');
    }
    
    populateVariationProperties(variation) {
        const properties = document.getElementById('variation-properties');
        const differences = document.getElementById('variation-differences');
        
        properties.innerHTML = `
            <div class="property-item">
                <span class="property-label">Elements</span>
                <span class="property-value">${variation.data.elements.length}</span>
            </div>
            <div class="property-item">
                <span class="property-label">Density Variation</span>
                <span class="property-value">${variation.settings.density}%</span>
            </div>
            <div class="property-item">
                <span class="property-label">Scale Variation</span>
                <span class="property-value">${variation.settings.scale}%</span>
            </div>
            <div class="property-item">
                <span class="property-label">Color Variation</span>
                <span class="property-value">${variation.settings.color}%</span>
            </div>
        `;
        
        const originalCount = this.sourcePattern.data.elements.length;
        const newCount = variation.data.elements.length;
        const elementDiff = newCount - originalCount;
        
        differences.innerHTML = `
            <div class="difference-item">
                <span class="difference-label">Element Count</span>
                <span class="difference-value ${elementDiff >= 0 ? 'positive' : 'negative'}">
                    ${elementDiff >= 0 ? '+' : ''}${elementDiff}
                </span>
            </div>
            <div class="difference-item">
                <span class="difference-label">Density Change</span>
                <span class="difference-value ${elementDiff >= 0 ? 'positive' : 'negative'}">
                    ${elementDiff >= 0 ? '+' : ''}${Math.round((elementDiff / originalCount) * 100)}%
                </span>
            </div>
        `;
    }
    
    exportVariation(variationId) {
        const variation = this.variations.find(v => v.id === variationId);
        if (!variation) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        
        const ctx = canvas.getContext('2d');
        this.drawPattern(ctx, variation.data, 2.0);
        
        // Download as PNG
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${variation.name.replace(/\s+/g, '-')}-variation.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
        
        this.showNotification('Variation exported successfully!', 'success');
    }
    
    saveVariation(variationId) {
        const variation = this.variations.find(v => v.id === variationId);
        if (!variation) return;
        
        // Save to pattern library
        const savedPatterns = JSON.parse(localStorage.getItem('savoModePatterns') || '[]');
        
        const patternData = {
            id: variation.id,
            name: variation.name,
            type: 'Variation',
            colors: this.sourcePattern.colors,
            createdAt: new Date().toISOString(),
            data: variation.data
        };
        
        savedPatterns.push(patternData);
        localStorage.setItem('savoModePatterns', JSON.stringify(savedPatterns));
        
        this.showNotification('Variation saved to pattern library!', 'success');
    }
    
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Load content based on tab
        if (tabName === 'library') {
            this.loadPatternLibrary();
        }
    }
    
    loadPatternLibrary() {
        const grid = document.getElementById('library-patterns');
        const savedPatterns = JSON.parse(localStorage.getItem('savoModePatterns') || '[]');
        
        if (savedPatterns.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i data-feather="folder"></i>
                    <h3>No patterns in library</h3>
                    <p>Create patterns in the Forest Generator first</p>
                </div>
            `;
            feather.replace();
            return;
        }
        
        grid.innerHTML = savedPatterns.map(pattern => `
            <div class="library-pattern" onclick="variationEngine.loadPattern('${pattern.id}')">
                <canvas width="100" height="80"></canvas>
                <span>${pattern.name}</span>
            </div>
        `).join('');
        
        // Render pattern previews
        savedPatterns.forEach(pattern => {
            const canvas = grid.querySelector(`[onclick*="${pattern.id}"] canvas`);
            if (canvas && pattern.data) {
                const ctx = canvas.getContext('2d');
                this.drawPattern(ctx, pattern.data, 0.25);
            }
        });
    }
    
    loadPattern(patternId) {
        const savedPatterns = JSON.parse(localStorage.getItem('savoModePatterns') || '[]');
        const pattern = savedPatterns.find(p => p.id === patternId);
        
        if (pattern) {
            this.sourcePattern = pattern;
            this.updateSourceDisplay();
            this.generateVariations();
            this.hidePatternLoader();
            this.showNotification('Pattern loaded successfully!', 'success');
        }
    }
    
    handlePatternUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showNotification('Please select a valid image file', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            // For now, just show a placeholder
            // In a real implementation, you'd analyze the image
            this.showNotification('Image pattern analysis not yet implemented', 'info');
        };
        reader.readAsDataURL(file);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 1001;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    debounce(func, wait) {
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
}

// Global functions
function loadExistingPattern() {
    document.getElementById('pattern-loader-modal').classList.add('active');
    window.variationEngine.switchTab('library');
}

function hidePatternLoader() {
    document.getElementById('pattern-loader-modal').classList.remove('active');
}

function hideVariationDetail() {
    document.getElementById('variation-detail-modal').classList.remove('active');
}

function randomizeAll() {
    // Randomize all variation settings
    const settings = window.variationEngine.variationSettings;
    
    Object.keys(settings).forEach(key => {
        const value = 10 + Math.random() * 80;
        settings[key] = Math.round(value);
    });
    
    window.variationEngine.updateControlValues();
    window.variationEngine.generateVariations();
    
    window.variationEngine.showNotification('All settings randomized!', 'success');
}

function applyPreset(presetName) {
    const presets = {
        subtle: { density: 10, scale: 15, color: 8, rotation: 12, position: 10, opacity: 5 },
        moderate: { density: 25, scale: 35, color: 20, rotation: 30, position: 25, opacity: 15 },
        dramatic: { density: 50, scale: 60, color: 45, rotation: 70, position: 50, opacity: 30 },
        experimental: { density: 75, scale: 80, color: 65, rotation: 90, position: 70, opacity: 45 }
    };
    
    if (presets[presetName]) {
        window.variationEngine.variationSettings = { ...presets[presetName] };
        window.variationEngine.updateControlValues();
        window.variationEngine.generateVariations();
        
        window.variationEngine.showNotification(`${presetName.charAt(0).toUpperCase() + presetName.slice(1)} preset applied!`, 'success');
    }
}

function generateVariations() {
    window.variationEngine.generateVariations();
}

function saveAllVariations() {
    let savedCount = 0;
    
    window.variationEngine.variations.forEach(variation => {
        window.variationEngine.saveVariation(variation.id);
        savedCount++;
    });
    
    window.variationEngine.showNotification(`${savedCount} variations saved to library!`, 'success');
}

function exportVariation() {
    if (window.variationEngine.currentVariation) {
        window.variationEngine.exportVariation(window.variationEngine.currentVariation.id);
    }
}

function saveVariation() {
    if (window.variationEngine.currentVariation) {
        window.variationEngine.saveVariation(window.variationEngine.currentVariation.id);
    }
}

// Initialize the variation engine when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.variationEngine = new PatternVariationEngine();
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            hidePatternLoader();
            hideVariationDetail();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hidePatternLoader();
            hideVariationDetail();
        }
    });
});
