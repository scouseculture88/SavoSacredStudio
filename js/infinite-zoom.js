// Infinite Consciousness Zoom JavaScript
class InfiniteConsciousnessZoom {
    constructor() {
        this.currentLevel = 0;
        this.maxLevel = 10;
        this.ideas = new Map();
        this.currentFocus = 'Main Consciousness';
        this.particleSystem = null;
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.planetCounter = 0;
        
        // Initialize with main idea
        this.ideas.set('level-0', {
            central: {
                id: 'main',
                text: 'Your Mind Universe',
                subtitle: 'Click to explore deeper',
                x: 50,
                y: 50,
                imagePrompt: 'Cosmic consciousness universe with swirling galaxies and sacred geometry, mystical brain-like nebula formations, ethereal cosmic colors'
            },
            satellites: []
        });
    }

    init() {
        this.setupEventListeners();
        this.initParticleSystem();
        this.startParticleAnimation();
        this.showWelcomeModal();
        
        console.log('🌌 Infinite Consciousness Zoom initialized');
    }

    setupEventListeners() {
        // Navigation hamburger
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Zoom controls
        document.getElementById('zoomOut').addEventListener('click', () => this.zoomOut());
        document.getElementById('addIdea').addEventListener('click', () => this.showIdeaInput());
        
        // Idea input
        document.getElementById('saveIdea').addEventListener('click', () => this.saveIdea());
        document.getElementById('cancelIdea').addEventListener('click', () => this.hideIdeaInput());
        document.getElementById('newIdeaText').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveIdea();
            if (e.key === 'Escape') this.hideIdeaInput();
        });

        // Welcome modal
        document.getElementById('startExploration').addEventListener('click', () => this.hideWelcomeModal());

        // Planet clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.consciousness-planet')) {
                const planet = e.target.closest('.consciousness-planet');
                this.zoomIntoPlanet(planet);
            }
        });

        // Enhanced keyboard shortcuts for healing tool
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Escape':
                    if (this.currentLevel > 0) this.zoomOut();
                    else this.hideIdeaInput(); // Close input if open
                    break;
                case '+':
                case '=':
                case ' ': // Spacebar for quick access
                    e.preventDefault();
                    this.showIdeaInput();
                    break;
                case 'Enter':
                    if (document.getElementById('ideaInput').style.display !== 'none') {
                        e.preventDefault();
                        this.saveIdea();
                    }
                    break;
                case 'Backspace':
                    if (this.currentLevel > 0) {
                        e.preventDefault();
                        this.zoomOut();
                    }
                    break;
            }
        });
    }

    showWelcomeModal() {
        document.getElementById('welcomeModal').style.display = 'flex';
    }

    hideWelcomeModal() {
        document.getElementById('welcomeModal').style.display = 'none';
    }

    showIdeaInput() {
        const ideaInput = document.getElementById('ideaInput');
        const textInput = document.getElementById('newIdeaText');
        const charCount = document.getElementById('charCount');
        
        ideaInput.style.display = 'block';
        textInput.focus();
        textInput.placeholder = 'Express your healing intention or therapeutic goal...';
        
        // Add character counter
        textInput.addEventListener('input', () => {
            const length = textInput.value.length;
            charCount.textContent = `${length}/100`;
            
            // Change color based on length
            if (length > 80) {
                charCount.style.color = '#e74c3c';
            } else if (length > 60) {
                charCount.style.color = '#f39c12';
            } else {
                charCount.style.color = '#764ba2';
            }
        });
    }

    hideIdeaInput() {
        const ideaInput = document.getElementById('ideaInput');
        ideaInput.style.display = 'none';
        document.getElementById('newIdeaText').value = '';
    }

    saveIdea() {
        const text = document.getElementById('newIdeaText').value.trim();
        if (!text) return;

        this.addIdeaToCurrentLevel(text);
        this.hideIdeaInput();
        this.renderCurrentLevel();

        console.log(`💡 New idea added: "${text}" at level ${this.currentLevel}`);
    }

    addIdeaToCurrentLevel(text) {
        const levelKey = `level-${this.currentLevel}`;
        const currentLevel = this.ideas.get(levelKey) || { central: null, satellites: [] };
        
        // Add as satellite planet
        const angle = (currentLevel.satellites.length * (Math.PI * 2)) / 6; // Max 6 satellites in circle
        const radius = 40; // Distance from center
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;

        const newIdea = {
            id: `idea-${this.planetCounter++}`,
            text: text,
            subtitle: 'Click to explore',
            x: x,
            y: y,
            imagePrompt: this.generateImagePrompt(text),
            generatingImage: false
        };

        currentLevel.satellites.push(newIdea);
        this.ideas.set(levelKey, currentLevel);

        // Generate AI image for this idea
        this.generatePlanetImage(newIdea);
    }

    generateImagePrompt(ideaText) {
        // Create cosmic/space-themed prompts based on the idea
        const cosmicThemes = [
            'cosmic nebula in deep space with swirling galaxies',
            'mystical planet with aurora borealis atmosphere',
            'sacred geometry patterns floating in cosmic void',
            'consciousness energy flowing through space dimensions',
            'crystalline structures in alien cosmic landscape',
            'meditation mandala merged with stellar formations'
        ];
        
        const theme = cosmicThemes[Math.floor(Math.random() * cosmicThemes.length)];
        return `Beautiful ${theme} representing the concept of "${ideaText}", ethereal lighting, cosmic colors, mystical atmosphere, high detail, space art style`;
    }

    async generatePlanetImage(planetData) {
        if (planetData.generatingImage || planetData.imageUrl) return;
        
        planetData.generatingImage = true;
        
        try {
            console.log(`🎨 Generating cosmic pattern for: "${planetData.text}"`);
            
            // Show generating indicator
            this.updatePlanetWithLoadingState(planetData);
            
            // Generate procedural cosmic pattern instantly
            const cosmicPattern = this.createProceduralCosmicPattern(planetData.text);
            
            setTimeout(() => {
                planetData.generatingImage = false;
                planetData.imageUrl = cosmicPattern;
                this.updatePlanetWithImage(planetData);
                console.log(`✨ Cosmic pattern generated for: "${planetData.text}"`);
            }, 1000); // Brief delay for visual feedback
            
        } catch (error) {
            console.error('Pattern generation failed, using cosmic gradient:', error);
            planetData.generatingImage = false;
            planetData.imageUrl = this.createCosmicGradient(planetData.text);
            this.updatePlanetWithImage(planetData);
        }
    }

    createProceduralCosmicPattern(text) {
        // Create unique procedural patterns based on text
        const seed = this.hashString(text);
        const patterns = [
            this.createNebulaPattern(seed),
            this.createSacredGeometryPattern(seed),
            this.createEnergyFieldPattern(seed),
            this.createCrystallinePattern(seed),
            this.createConsciousnessPattern(seed)
        ];
        
        return patterns[seed % patterns.length];
    }

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    createNebulaPattern(seed) {
        const colors = [
            'rgba(116, 235, 213, 0.8)',
            'rgba(102, 126, 234, 0.6)',
            'rgba(118, 75, 162, 0.7)',
            'rgba(45, 27, 105, 0.9)'
        ];
        
        const angle = (seed % 360) + 'deg';
        const color1 = colors[seed % colors.length];
        const color2 = colors[(seed + 1) % colors.length];
        const color3 = colors[(seed + 2) % colors.length];
        
        return `radial-gradient(circle at ${seed % 70 + 15}% ${seed % 70 + 15}%, ${color1} 0%, ${color2} 40%, ${color3} 70%, transparent 100%)`;
    }

    createSacredGeometryPattern(seed) {
        const baseColors = ['#2d1b69', '#667eea', '#74ebd5', '#764ba2'];
        const color1 = baseColors[seed % baseColors.length];
        const color2 = baseColors[(seed + 2) % baseColors.length];
        
        const size1 = (seed % 50) + 50;
        const size2 = (seed % 30) + 70;
        
        return `conic-gradient(from ${seed % 360}deg at center, ${color1} 0deg, ${color2} 60deg, ${color1} 120deg, ${color2} 180deg, ${color1} 240deg, ${color2} 300deg, ${color1} 360deg)`;
    }

    createEnergyFieldPattern(seed) {
        const energyColors = ['#74ebd5', '#667eea', '#00c9ff', '#92fe9d'];
        const primary = energyColors[seed % energyColors.length];
        const secondary = energyColors[(seed + 2) % energyColors.length];
        
        return `linear-gradient(${seed % 180}deg, ${primary}22 0%, ${secondary}44 30%, ${primary}66 60%, transparent 100%), 
                radial-gradient(ellipse at ${seed % 100}% ${seed % 100}%, ${primary}33 0%, transparent 50%)`;
    }

    createCrystallinePattern(seed) {
        const crystalColors = ['#4ecdc4', '#74ebd5', '#667eea', '#764ba2'];
        const color = crystalColors[seed % crystalColors.length];
        
        return `linear-gradient(${seed % 120}deg, ${color}aa 0%, transparent 70%), 
                linear-gradient(${(seed + 60) % 120}deg, ${color}77 0%, transparent 70%),
                linear-gradient(${(seed + 120) % 120}deg, ${color}44 0%, transparent 70%)`;
    }

    createConsciousnessPattern(seed) {
        const mindColors = ['#2d1b69', '#667eea', '#74ebd5', '#92fe9d'];
        const center = mindColors[seed % mindColors.length];
        const outer = mindColors[(seed + 1) % mindColors.length];
        
        const x = (seed % 60) + 20;
        const y = (seed % 60) + 20;
        
        return `radial-gradient(ellipse at ${x}% ${y}%, ${center}99 0%, ${outer}66 30%, ${center}33 60%, transparent 100%)`;
    }

    createCosmicGradient(text) {
        // Create unique cosmic gradients based on text
        const colors = [
            ['#2d1b69', '#667eea', '#74ebd5'],
            ['#74ebd5', '#4ecdc4', '#00c9ff'],
            ['#667eea', '#764ba2', '#74ebd5'],
            ['#00c9ff', '#92fe9d', '#74ebd5'],
            ['#764ba2', '#2d1b69', '#667eea']
        ];
        
        const colorSet = colors[text.length % colors.length];
        return `linear-gradient(135deg, ${colorSet.join(', ')})`;
    }

    updatePlanetWithLoadingState(planetData) {
        const planet = document.querySelector(`[data-planet-id="${planetData.id}"]`);
        if (planet) {
            const core = planet.querySelector('.planet-core');
            core.style.background = 'linear-gradient(135deg, #2d1b69, #667eea)';
            core.style.animation = 'planetPulse 1s ease-in-out infinite';
            
            const subtitle = planet.querySelector('.planet-subtitle');
            if (subtitle) {
                subtitle.textContent = 'Creating cosmic pattern...';
            }
        }
    }

    updatePlanetWithImage(planetData) {
        const planet = document.querySelector(`[data-planet-id="${planetData.id}"]`);
        if (planet) {
            const core = planet.querySelector('.planet-core');
            core.style.background = planetData.imageUrl;
            core.style.animation = 'planetPulse 4s ease-in-out infinite';
            
            const subtitle = planet.querySelector('.planet-subtitle');
            if (subtitle) {
                subtitle.textContent = 'Procedural cosmic world';
            }
        }
    }

    zoomIntoPlanet(planetElement) {
        if (this.currentLevel >= this.maxLevel) return;

        const planetId = planetElement.dataset.planetId;
        const planet = this.findPlanetById(planetId);
        
        if (!planet) {
            console.warn(`Planet not found: ${planetId}`);
            return;
        }

        this.currentLevel++;
        this.currentFocus = planet.text;

        // Create or get the level for this planet
        const nextLevelKey = `level-${this.currentLevel}`;
        if (!this.ideas.has(nextLevelKey)) {
            this.ideas.set(nextLevelKey, {
                central: {
                    id: planet.id,
                    text: planet.text,
                    subtitle: 'Your focused exploration',
                    x: 50,
                    y: 50,
                    imagePrompt: this.generateImagePrompt(planet.text)
                },
                satellites: []
            });
        }

        this.updateUI();
        this.renderCurrentLevel();
        this.createZoomEffect();

        console.log(`🚀 Zooming into level ${this.currentLevel}: "${this.currentFocus}"`);
    }

    zoomOut() {
        if (this.currentLevel <= 0) return;

        this.currentLevel--;
        this.updateFocusFromLevel();
        this.updateUI();
        this.renderCurrentLevel();
        this.createZoomEffect(true);

        console.log(`↩️ Zooming out to level ${this.currentLevel}`);
    }

    updateFocusFromLevel() {
        if (this.currentLevel === 0) {
            this.currentFocus = 'Main Consciousness';
        } else {
            const levelKey = `level-${this.currentLevel}`;
            const level = this.ideas.get(levelKey);
            if (level && level.central) {
                this.currentFocus = level.central.text;
            }
        }
    }

    findPlanetById(planetId) {
        for (const [levelKey, level] of this.ideas.entries()) {
            if (level.central && level.central.id === planetId) {
                return level.central;
            }
            const satellite = level.satellites.find(s => s.id === planetId);
            if (satellite) return satellite;
        }
        return null;
    }

    renderCurrentLevel() {
        const universe = document.getElementById('universe');
        const levelKey = `level-${this.currentLevel}`;
        const currentLevelData = this.ideas.get(levelKey);

        if (!currentLevelData) {
            console.warn(`No data for level ${this.currentLevel}`);
            return;
        }

        // Clear current planets
        universe.innerHTML = '';

        // Render central planet
        if (currentLevelData.central) {
            const centralPlanet = this.createPlanetElement(currentLevelData.central, true);
            universe.appendChild(centralPlanet);
        }

        // Render satellite planets
        currentLevelData.satellites.forEach(satellite => {
            const satellitePlanet = this.createPlanetElement(satellite, false);
            universe.appendChild(satellitePlanet);
        });

        // Update zoom level class
        document.body.className = document.body.className.replace(/zoom-level-\d+/g, '');
        if (this.currentLevel > 0) {
            document.body.classList.add(`zoom-level-${Math.min(this.currentLevel, 5)}`);
        }
    }

    createPlanetElement(planetData, isCentral = false) {
        const planet = document.createElement('div');
        planet.className = isCentral ? 'consciousness-planet' : 'consciousness-planet sub-planet';
        planet.dataset.planetId = planetData.id;
        
        // Position the planet
        planet.style.left = `${planetData.x}%`;
        planet.style.top = `${planetData.y}%`;

        // Create planet structure
        planet.innerHTML = `
            <div class="planet-core">
                <div class="planet-text">${planetData.text}</div>
                <div class="planet-subtitle">${planetData.subtitle}</div>
            </div>
            <div class="planet-atmosphere"></div>
        `;

        // Add cosmic colors based on level
        const colors = [
            'linear-gradient(135deg, #2d1b69, #764ba2, #667eea)',
            'linear-gradient(135deg, #667eea, #764ba2, #74ebd5)',
            'linear-gradient(135deg, #74ebd5, #4ecdc4, #00c9ff)',
            'linear-gradient(135deg, #00c9ff, #92fe9d, #74ebd5)',
            'linear-gradient(135deg, #764ba2, #667eea, #2d1b69)'
        ];
        
        const colorIndex = (this.currentLevel + planetData.id.length) % colors.length;
        planet.querySelector('.planet-core').style.background = colors[colorIndex];

        return planet;
    }

    createZoomEffect(reverse = false) {
        // Create zoom effect particles
        const effectContainer = document.createElement('div');
        effectContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #74ebd5;
                border-radius: 50%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 10px #74ebd5;
            `;

            const angle = (i / 20) * Math.PI * 2;
            const distance = reverse ? 0 : window.innerWidth;
            const endDistance = reverse ? window.innerWidth : 0;
            
            particle.animate([
                {
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
                    opacity: 1
                },
                {
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * endDistance}px, ${Math.sin(angle) * endDistance}px)`,
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'ease-out'
            });

            effectContainer.appendChild(particle);
        }

        document.body.appendChild(effectContainer);
        setTimeout(() => effectContainer.remove(), 1000);
    }

    updateUI() {
        // Update zoom level
        document.getElementById('currentLevel').textContent = this.currentLevel;
        
        // Update zoom out button
        document.getElementById('zoomOut').disabled = this.currentLevel === 0;
        
        // Update current focus
        document.querySelector('#currentFocus span').textContent = this.currentFocus;
        
        // Update depth indicator
        const depthPercentage = Math.min((this.currentLevel / 10) * 100, 100);
        document.getElementById('depthFill').style.width = `${depthPercentage}%`;
    }

    initParticleSystem() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Create initial particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: `rgba(116, 235, 213, ${Math.random() * 0.3 + 0.2})`
            });
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    startParticleAnimation() {
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Update and draw particles
            this.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Wrap around screen
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;

                // Draw particle
                this.ctx.fillStyle = particle.color;
                this.ctx.globalAlpha = particle.opacity;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
            });

            this.ctx.globalAlpha = 1;
            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.infiniteZoom = new InfiniteConsciousnessZoom();
    window.infiniteZoom.init();
});

// Feather icons initialization
document.addEventListener('DOMContentLoaded', function() {
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

console.log('🌌 Infinite Consciousness Zoom script loaded');
