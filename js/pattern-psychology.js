// Pattern Psychology JavaScript
// Interactive psychology analysis and testing system

class PatternPsychology {
    constructor() {
        this.currentPattern = 'forest';
        this.attentionTestActive = false;
        this.memoryTestActive = false;
        this.emotionTestIndex = 0;
        this.attentionStartTime = 0;
        this.memoryScore = { correct: 0, total: 0 };
        this.savedAnalyses = [];
        this.savedEmotionalResponses = [];
        
        this.patterns = {
            forest: {
                name: 'Forest Camo',
                colors: ['#2d5016', '#4a7c28', '#1a3d0a', '#7cff50'],
                complexity: 'High',
                disruption: 'Very High',
                naturalness: 'Very High',
                cognitiveLoad: 'Medium-High',
                emotionalResponse: 'Calming, Connected to nature',
                behavioralEffect: 'Increases focus, reduces stress',
                physiologicalImpact: 'Lowers heart rate, reduces cortisol'
            },
            urban: {
                name: 'Urban Grid',
                colors: ['#333333', '#666666', '#999999', '#cccccc'],
                complexity: 'Medium',
                disruption: 'Medium',
                naturalness: 'Low',
                cognitiveLoad: 'Low-Medium',
                emotionalResponse: 'Orderly, controlled, modern',
                behavioralEffect: 'Increases alertness, promotes efficiency',
                physiologicalImpact: 'Steady heart rate, maintains attention'
            },
            digital: {
                name: 'Digital Tactical',
                colors: ['#7cff50', '#00ff88', '#44ff00', '#0a0a0a'],
                complexity: 'High',
                disruption: 'High',
                naturalness: 'Very Low',
                cognitiveLoad: 'High',
                emotionalResponse: 'Energetic, futuristic, intense',
                behavioralEffect: 'Increases alertness, may cause fatigue',
                physiologicalImpact: 'Increases heart rate, heightens attention'
            },
            organic: {
                name: 'Organic Shapes',
                colors: ['#8b4513', '#a0522d', '#cd853f', '#f4a460'],
                complexity: 'Medium',
                disruption: 'Low',
                naturalness: 'High',
                cognitiveLoad: 'Low',
                emotionalResponse: 'Comfortable, warm, familiar',
                behavioralEffect: 'Promotes relaxation, reduces anxiety',
                physiologicalImpact: 'Lowers blood pressure, promotes calm'
            },
            geometric: {
                name: 'Geometric',
                colors: ['#4169e1', '#1e90ff', '#00bfff', '#87ceeb'],
                complexity: 'Low',
                disruption: 'Low',
                naturalness: 'Low',
                cognitiveLoad: 'Low',
                emotionalResponse: 'Structured, professional, clean',
                behavioralEffect: 'Promotes focus, increases productivity',
                physiologicalImpact: 'Steady vitals, maintains concentration'
            },
            fractal: {
                name: 'Mathematical Fractal',
                colors: ['#ff6b35', '#f7931e', '#ffd700', '#32cd32'],
                complexity: 'Very High',
                disruption: 'High',
                naturalness: 'Medium',
                cognitiveLoad: 'High',
                emotionalResponse: 'Fascinating, mathematical beauty, inspiring',
                behavioralEffect: 'Increases curiosity, promotes deep thinking',
                physiologicalImpact: 'Stimulates brain activity, may cause wonder'
            },
            splash: {
                name: 'Military Splash Camo',
                colors: ['#3c5a2a', '#5d7c47', '#2a4018', '#7fa055'],
                complexity: 'High',
                disruption: 'Very High',
                naturalness: 'High',
                cognitiveLoad: 'Medium-High',
                emotionalResponse: 'Tactical, protective, grounded',
                behavioralEffect: 'Increases alertness, promotes caution',
                physiologicalImpact: 'Heightens awareness, steady focus'
            },
            cosmic: {
                name: 'Cosmic Pattern',
                colors: ['#1a0033', '#4b0082', '#8a2be2', '#da70d6'],
                complexity: 'Medium',
                disruption: 'Medium',
                naturalness: 'Very Low',
                cognitiveLoad: 'Medium',
                emotionalResponse: 'Mystical, expansive, otherworldly',
                behavioralEffect: 'Encourages creativity, promotes wonder',
                physiologicalImpact: 'Calms mind, expands perception'
            },
            tribal: {
                name: 'Tribal Patterns',
                colors: ['#8b4513', '#cd853f', '#f4a460', '#2f1b14'],
                complexity: 'Medium',
                disruption: 'Medium',
                naturalness: 'High',
                cognitiveLoad: 'Low-Medium',
                emotionalResponse: 'Ancient wisdom, cultural connection, grounding',
                behavioralEffect: 'Promotes tradition, cultural awareness',
                physiologicalImpact: 'Stabilizes mood, connects to heritage'
            },
            neural: {
                name: 'Neural Network',
                colors: ['#00ffff', '#0080ff', '#4040ff', '#8000ff'],
                complexity: 'Very High',
                disruption: 'High',
                naturalness: 'Very Low',
                cognitiveLoad: 'Very High',
                emotionalResponse: 'Futuristic, intelligent, complex',
                behavioralEffect: 'Stimulates analysis, promotes learning',
                physiologicalImpact: 'Increases mental activity, may cause fatigue'
            }
        };
        
        this.psychologyEffects = [
            {
                name: 'Camouflage Effectiveness',
                category: 'cognitive',
                description: 'Irregular patterns with high contrast are most effective at disrupting object recognition',
                patterns: ['forest', 'urban'],
                impact: 'High'
            },
            {
                name: 'Visual Fatigue',
                category: 'physiological',
                description: 'Complex patterns can cause eye strain and mental fatigue after extended exposure',
                patterns: ['digital', 'forest'],
                impact: 'Medium'
            },
            {
                name: 'Attention Capture',
                category: 'behavioral',
                description: 'High-contrast patterns immediately draw attention and increase alertness',
                patterns: ['digital', 'urban'],
                impact: 'High'
            },
            {
                name: 'Stress Reduction',
                category: 'emotional',
                description: 'Natural patterns and earth tones reduce cortisol levels and promote relaxation',
                patterns: ['forest', 'organic'],
                impact: 'Medium'
            },
            {
                name: 'Memory Enhancement',
                category: 'cognitive',
                description: 'Familiar patterns are easier to remember and recognize than abstract ones',
                patterns: ['organic', 'geometric'],
                impact: 'Medium'
            },
            {
                name: 'Depth Perception',
                category: 'cognitive',
                description: 'Camouflage patterns create illusions of depth and distance',
                patterns: ['forest', 'urban'],
                impact: 'High'
            }
        ];
    }
    
    init() {
        this.setupEventListeners();
        this.generateAnalysisCanvas();
        this.populateEffectsDatabase();
        this.setupPrincipleExamples();
        this.initEmotionTest();
    }
    
    setupEventListeners() {
        // Pattern selection
        const patternSelect = document.getElementById('pattern-select');
        if (patternSelect) {
            patternSelect.addEventListener('change', (e) => {
                this.currentPattern = e.target.value;
                this.generateAnalysisCanvas();
            });
        }
        
        // Effect filter
        const effectFilter = document.getElementById('effect-filter');
        if (effectFilter) {
            effectFilter.addEventListener('change', () => {
                this.filterEffects();
            });
        }
        
        // Search effects
        const searchEffects = document.getElementById('search-effects');
        if (searchEffects) {
            searchEffects.addEventListener('input', () => {
                this.filterEffects();
            });
        }
    }
    
    generateAnalysisCanvas() {
        const canvas = document.getElementById('analysis-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const pattern = this.patterns[this.currentPattern];
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Generate pattern based on type
        switch (this.currentPattern) {
            case 'forest':
                this.drawForestPattern(ctx, pattern.colors, canvas.width, canvas.height);
                break;
            case 'urban':
                this.drawUrbanPattern(ctx, pattern.colors, canvas.width, canvas.height);
                break;
            case 'digital':
                this.drawDigitalPattern(ctx, pattern.colors, canvas.width, canvas.height);
                break;
            case 'organic':
                this.drawOrganicPattern(ctx, pattern.colors, canvas.width, canvas.height);
                break;
            case 'geometric':
                this.drawGeometricPattern(ctx, pattern.colors, canvas.width, canvas.height);
                break;
        }
    }
    
    drawForestPattern(ctx, colors, width, height) {
        // Draw forest camouflage with irregular shapes
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 30 + 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            ctx.fillStyle = color;
            ctx.beginPath();
            
            // Create irregular forest-like shapes
            const points = 6 + Math.floor(Math.random() * 4);
            for (let j = 0; j < points; j++) {
                const angle = (j / points) * Math.PI * 2;
                const radius = size * (0.7 + Math.random() * 0.6);
                const px = x + Math.cos(angle) * radius;
                const py = y + Math.sin(angle) * radius;
                
                if (j === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            
            ctx.closePath();
            ctx.fill();
        }
    }
    
    drawUrbanPattern(ctx, colors, width, height) {
        // Draw urban grid pattern
        const gridSize = 20;
        
        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                if (Math.random() > 0.3) {
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    ctx.fillStyle = color;
                    
                    // Add some irregularity to grid
                    const offsetX = Math.random() * 5 - 2.5;
                    const offsetY = Math.random() * 5 - 2.5;
                    const sizeVar = Math.random() * 6 - 3;
                    
                    ctx.fillRect(x + offsetX, y + offsetY, gridSize + sizeVar, gridSize + sizeVar);
                }
            }
        }
        
        // Add grid lines
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 4]);
        
        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        for (let y = 0; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }
    
    drawDigitalPattern(ctx, colors, width, height) {
        // Draw digital tactical pattern
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 15 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            ctx.fillStyle = color;
            
            // Draw pixelated shapes
            const pixelSize = 3;
            for (let px = 0; px < size; px += pixelSize) {
                for (let py = 0; py < size; py += pixelSize) {
                    if (Math.random() > 0.4) {
                        ctx.fillRect(x + px, y + py, pixelSize, pixelSize);
                    }
                }
            }
        }
        
        // Add glowing effects
        ctx.shadowColor = colors[0];
        ctx.shadowBlur = 3;
        
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 4 + 2;
            
            ctx.fillStyle = colors[0];
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.shadowBlur = 0;
    }
    
    drawOrganicPattern(ctx, colors, width, height) {
        // Draw organic flowing shapes
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 40 + 20;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            ctx.fillStyle = color;
            ctx.beginPath();
            
            // Create smooth, organic curves
            const cp1x = x + Math.random() * size - size/2;
            const cp1y = y + Math.random() * size - size/2;
            const cp2x = x + Math.random() * size - size/2;
            const cp2y = y + Math.random() * size - size/2;
            const endx = x + Math.random() * size - size/2;
            const endy = y + Math.random() * size - size/2;
            
            ctx.moveTo(x, y);
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endx, endy);
            ctx.bezierCurveTo(cp2x + 20, cp2y + 20, cp1x + 20, cp1y + 20, x, y);
            ctx.fill();
        }
    }
    
    drawGeometricPattern(ctx, colors, width, height) {
        // Draw clean geometric shapes
        const shapes = ['circle', 'square', 'triangle', 'hexagon'];
        
        for (let i = 0; i < 25; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 25 + 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            
            ctx.fillStyle = color;
            ctx.beginPath();
            
            switch (shape) {
                case 'circle':
                    ctx.arc(x, y, size/2, 0, Math.PI * 2);
                    break;
                case 'square':
                    ctx.rect(x - size/2, y - size/2, size, size);
                    break;
                case 'triangle':
                    ctx.moveTo(x, y - size/2);
                    ctx.lineTo(x - size/2, y + size/2);
                    ctx.lineTo(x + size/2, y + size/2);
                    ctx.closePath();
                    break;
                case 'hexagon':
                    for (let j = 0; j < 6; j++) {
                        const angle = (j / 6) * Math.PI * 2;
                        const px = x + Math.cos(angle) * size/2;
                        const py = y + Math.sin(angle) * size/2;
                        if (j === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    break;
            }
            
            ctx.fill();
        }
    }
    
    analyzePattern() {
        const pattern = this.patterns[this.currentPattern];
        const resultsDiv = document.getElementById('analysis-results');
        
        if (!resultsDiv) return;
        
        resultsDiv.innerHTML = `
            <h3>Psychological Analysis: ${pattern.name}</h3>
            <div class="analysis-content">
                <div class="analysis-metric">
                    <strong>Complexity Level:</strong> ${pattern.complexity}
                    <p>Affects cognitive load and processing time</p>
                </div>
                
                <div class="analysis-metric">
                    <strong>Visual Disruption:</strong> ${pattern.disruption}
                    <p>Influences camouflage effectiveness and attention capture</p>
                </div>
                
                <div class="analysis-metric">
                    <strong>Naturalness:</strong> ${pattern.naturalness}
                    <p>Impacts emotional response and comfort level</p>
                </div>
                
                <div class="analysis-metric">
                    <strong>Cognitive Load:</strong> ${pattern.cognitiveLoad}
                    <p>Mental effort required to process the pattern</p>
                </div>
                
                <div class="analysis-metric">
                    <strong>Emotional Response:</strong> ${pattern.emotionalResponse}
                    <p>Typical feelings evoked by this pattern</p>
                </div>
                
                <div class="analysis-metric">
                    <strong>Behavioral Effect:</strong> ${pattern.behavioralEffect}
                    <p>How this pattern influences behavior and performance</p>
                </div>
                
                <div class="analysis-metric">
                    <strong>Physiological Impact:</strong> ${pattern.physiologicalImpact}
                    <p>Physical responses to pattern exposure</p>
                </div>
            </div>
        `;
    }
    
    saveAnalysisResults() {
        const pattern = this.patterns[this.currentPattern];
        if (!pattern) return;
        
        const analysisData = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            patternName: pattern.name,
            patternType: this.currentPattern,
            complexity: pattern.complexity,
            disruption: pattern.disruption,
            naturalness: pattern.naturalness,
            cognitiveLoad: pattern.cognitiveLoad,
            emotionalResponse: pattern.emotionalResponse,
            behavioralEffect: pattern.behavioralEffect,
            physiologicalImpact: pattern.physiologicalImpact,
            colors: pattern.colors
        };
        
        this.savedAnalyses.push(analysisData);
        this.saveToStorage('psychologyAnalyses', this.savedAnalyses);
        
        this.showSaveModal('Pattern analysis saved successfully!', analysisData);
    }
    
    saveEmotionalResponse() {
        const energyScale = document.getElementById('energy-scale');
        const naturalScale = document.getElementById('natural-scale');
        const comfortScale = document.getElementById('comfort-scale');
        
        if (!energyScale || !naturalScale || !comfortScale) return;
        
        const currentPatternName = this.getCurrentEmotionPatternName();
        
        const emotionalData = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            patternName: currentPatternName,
            emotionTestIndex: this.emotionTestIndex,
            scales: {
                energy: parseInt(energyScale.value),
                natural: parseInt(naturalScale.value),
                comfort: parseInt(comfortScale.value)
            },
            analysis: this.generateEmotionalAnalysis(energyScale.value, naturalScale.value, comfortScale.value)
        };
        
        this.savedEmotionalResponses.push(emotionalData);
        this.saveToStorage('psychologyEmotions', this.savedEmotionalResponses);
        
        this.showSaveModal('Emotional response saved successfully!', emotionalData);
    }
    
    getCurrentEmotionPatternName() {
        const patternTypes = ['Forest', 'Urban', 'Digital', 'Organic', 'Geometric'];
        return patternTypes[this.emotionTestIndex % patternTypes.length] || 'Unknown Pattern';
    }
    
    generateEmotionalAnalysis(energy, natural, comfort) {
        let analysis = [];
        
        if (energy <= 3) analysis.push('Very calming effect');
        else if (energy >= 8) analysis.push('High energy stimulation');
        else analysis.push('Moderate energy level');
        
        if (natural <= 3) analysis.push('Artificial appearance');
        else if (natural >= 8) analysis.push('Highly natural feeling');
        else analysis.push('Semi-natural appearance');
        
        if (comfort <= 3) analysis.push('Creates discomfort');
        else if (comfort >= 8) analysis.push('Very comfortable');
        else analysis.push('Neutral comfort level');
        
        return analysis.join(', ');
    }
    
    showSaveModal(message, data) {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3000;
                color: white;
                font-family: Arial, sans-serif;
            ">
                <div style="
                    background: #2a2a2a;
                    padding: 30px;
                    border-radius: 15px;
                    max-width: 500px;
                    text-align: center;
                    border: 2px solid #27ae60;
                ">
                    <h3 style="color: #27ae60; margin-bottom: 20px;">✓ Data Saved</h3>
                    <p style="margin-bottom: 20px;">${message}</p>
                    <div style="text-align: left; background: #1a1a1a; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <strong>Saved Data:</strong><br>
                        <small>ID: ${data.id}</small><br>
                        <small>Time: ${new Date(data.timestamp).toLocaleString()}</small><br>
                        <small>Pattern: ${data.patternName}</small>
                        ${data.scales ? `<br><small>Scales: Energy ${data.scales.energy}/10, Natural ${data.scales.natural}/10, Comfort ${data.scales.comfort}/10</small>` : ''}
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button onclick="this.closest('div').parentElement.remove()" style="
                            padding: 12px 20px;
                            background: #27ae60;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                        ">Close</button>
                        <button onclick="window.showSavedData()" style="
                            padding: 12px 20px;
                            background: #3498db;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                        ">View All Saved</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Save failed:', error);
            alert('Save failed - storage may be full. Try clearing old data.');
        }
    }
    
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Load failed:', error);
            return [];
        }
    }
    
    showSavedData() {
        const analyses = this.loadFromStorage('psychologyAnalyses');
        const emotions = this.loadFromStorage('psychologyEmotions');
        
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3000;
                color: white;
                font-family: Arial, sans-serif;
            ">
                <div style="
                    background: #2a2a2a;
                    padding: 30px;
                    border-radius: 15px;
                    max-width: 700px;
                    max-height: 80vh;
                    overflow-y: auto;
                    border: 2px solid #9b59b6;
                ">
                    <h3 style="color: #9b59b6; margin-bottom: 20px;">📊 Saved Psychology Data</h3>
                    
                    <div style="margin-bottom: 30px;">
                        <h4 style="color: #3498db;">Pattern Analyses (${analyses.length})</h4>
                        ${analyses.length === 0 ? '<p>No analyses saved yet.</p>' : 
                          analyses.slice(-5).map(analysis => `
                            <div style="background: #1a1a1a; padding: 15px; margin: 10px 0; border-radius: 8px;">
                                <strong>${analysis.patternName}</strong><br>
                                <small>Saved: ${new Date(analysis.timestamp).toLocaleString()}</small><br>
                                <small>Complexity: ${analysis.complexity}, Disruption: ${analysis.disruption}</small>
                            </div>
                          `).join('')}
                    </div>
                    
                    <div style="margin-bottom: 30px;">
                        <h4 style="color: #e74c3c;">Emotional Responses (${emotions.length})</h4>
                        ${emotions.length === 0 ? '<p>No emotional responses saved yet.</p>' : 
                          emotions.slice(-5).map(emotion => `
                            <div style="background: #1a1a1a; padding: 15px; margin: 10px 0; border-radius: 8px;">
                                <strong>${emotion.patternName}</strong><br>
                                <small>Saved: ${new Date(emotion.timestamp).toLocaleString()}</small><br>
                                <small>Energy: ${emotion.scales.energy}/10, Natural: ${emotion.scales.natural}/10, Comfort: ${emotion.scales.comfort}/10</small><br>
                                <small>Analysis: ${emotion.analysis}</small>
                            </div>
                          `).join('')}
                    </div>
                    
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button onclick="this.closest('div').parentElement.remove()" style="
                            padding: 12px 20px;
                            background: #666;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                        ">Close</button>
                        <button onclick="window.exportPsychologyData()" style="
                            padding: 12px 20px;
                            background: #27ae60;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                        ">Export Data</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    exportPsychologyData() {
        const analyses = this.loadFromStorage('psychologyAnalyses');
        const emotions = this.loadFromStorage('psychologyEmotions');
        
        const exportData = {
            exported: new Date().toISOString(),
            totalAnalyses: analyses.length,
            totalEmotions: emotions.length,
            patternAnalyses: analyses,
            emotionalResponses: emotions
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `psychology-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert('Psychology data exported successfully!');
    }
    
    setupPrincipleExamples() {
        const examples = document.querySelectorAll('.example-pattern');
        examples.forEach(example => {
            example.addEventListener('click', () => {
                // Add interactive feedback
                example.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    example.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }
    
    populateEffectsDatabase() {
        const effectsGrid = document.getElementById('effects-grid');
        if (!effectsGrid) return;
        
        effectsGrid.innerHTML = '';
        
        this.psychologyEffects.forEach(effect => {
            const effectCard = document.createElement('div');
            effectCard.className = 'effect-card';
            effectCard.innerHTML = `
                <h4>${effect.name}</h4>
                <p>${effect.description}</p>
                <div class="effect-meta">
                    <span class="effect-category">${effect.category}</span>
                    <span class="effect-impact">Impact: ${effect.impact}</span>
                </div>
            `;
            effectsGrid.appendChild(effectCard);
        });
    }
    
    filterEffects() {
        const filterValue = document.getElementById('effect-filter').value;
        const searchValue = document.getElementById('search-effects').value.toLowerCase();
        
        const filteredEffects = this.psychologyEffects.filter(effect => {
            const matchesFilter = filterValue === 'all' || effect.category === filterValue;
            const matchesSearch = effect.name.toLowerCase().includes(searchValue) || 
                                  effect.description.toLowerCase().includes(searchValue);
            return matchesFilter && matchesSearch;
        });
        
        const effectsGrid = document.getElementById('effects-grid');
        effectsGrid.innerHTML = '';
        
        filteredEffects.forEach(effect => {
            const effectCard = document.createElement('div');
            effectCard.className = 'effect-card';
            effectCard.innerHTML = `
                <h4>${effect.name}</h4>
                <p>${effect.description}</p>
                <div class="effect-meta">
                    <span class="effect-category">${effect.category}</span>
                    <span class="effect-impact">Impact: ${effect.impact}</span>
                </div>
            `;
            effectsGrid.appendChild(effectCard);
        });
    }
    
    startAttentionTest() {
        const canvas = document.getElementById('attention-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        this.attentionTestActive = true;
        this.attentionStartTime = Date.now();
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw camouflage background
        this.drawForestPattern(ctx, ['#2d5016', '#4a7c28', '#1a3d0a'], canvas.width, canvas.height);
        
        // Add hidden target
        const targetX = Math.random() * (canvas.width - 20) + 10;
        const targetY = Math.random() * (canvas.height - 20) + 10;
        
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(targetX, targetY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Add click listener
        canvas.addEventListener('click', (e) => {
            if (!this.attentionTestActive) return;
            
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            const distance = Math.sqrt(Math.pow(clickX - targetX, 2) + Math.pow(clickY - targetY, 2));
            
            if (distance < 15) {
                this.endAttentionTest();
            }
        });
        
        this.updateAttentionTimer();
    }
    
    updateAttentionTimer() {
        if (!this.attentionTestActive) return;
        
        const elapsed = (Date.now() - this.attentionStartTime) / 1000;
        const timerElement = document.getElementById('attention-timer');
        if (timerElement) {
            timerElement.textContent = `Time: ${elapsed.toFixed(2)}s`;
        }
        
        setTimeout(() => this.updateAttentionTimer(), 10);
    }
    
    endAttentionTest() {
        this.attentionTestActive = false;
        const elapsed = (Date.now() - this.attentionStartTime) / 1000;
        const timerElement = document.getElementById('attention-timer');
        if (timerElement) {
            timerElement.textContent = `Completed in: ${elapsed.toFixed(2)}s`;
        }
    }
    
    initEmotionTest() {
        this.nextEmotionPattern();
    }
    
    nextEmotionPattern() {
        const patternKeys = Object.keys(this.patterns);
        const patternKey = patternKeys[this.emotionTestIndex % patternKeys.length];
        const pattern = this.patterns[patternKey];
        
        const emotionPatternDiv = document.getElementById('emotion-pattern');
        if (emotionPatternDiv) {
            // Create mini canvas for emotion test
            emotionPatternDiv.innerHTML = `<canvas width="360" height="150"></canvas>`;
            const canvas = emotionPatternDiv.querySelector('canvas');
            const ctx = canvas.getContext('2d');
            
            // Draw pattern based on type
            switch (patternKey) {
                case 'forest':
                    this.drawForestPattern(ctx, pattern.colors, canvas.width, canvas.height);
                    break;
                case 'urban':
                    this.drawUrbanPattern(ctx, pattern.colors, canvas.width, canvas.height);
                    break;
                case 'digital':
                    this.drawDigitalPattern(ctx, pattern.colors, canvas.width, canvas.height);
                    break;
                case 'organic':
                    this.drawOrganicPattern(ctx, pattern.colors, canvas.width, canvas.height);
                    break;
                case 'geometric':
                    this.drawGeometricPattern(ctx, pattern.colors, canvas.width, canvas.height);
                    break;
            }
        }
        
        this.emotionTestIndex++;
    }
    
    startMemoryTest() {
        // Memory test implementation
        const canvas = document.getElementById('memory-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        this.memoryTestActive = true;
        
        // Show pattern briefly, then test recognition
        const patternKey = Object.keys(this.patterns)[Math.floor(Math.random() * Object.keys(this.patterns).length)];
        const pattern = this.patterns[patternKey];
        
        // Draw pattern
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawForestPattern(ctx, pattern.colors, canvas.width, canvas.height);
        
        // Hide after 3 seconds
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '24px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Pattern hidden - click to reveal', canvas.width/2, canvas.height/2);
        }, 3000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const psychology = new PatternPsychology();
    psychology.init();
    
    // Global functions for buttons
    window.analyzePattern = () => psychology.analyzePattern();
    window.startAttentionTest = () => psychology.startAttentionTest();
    window.nextEmotionPattern = () => psychology.nextEmotionPattern();
    window.startMemoryTest = () => psychology.startMemoryTest();
    window.saveAnalysisResults = () => psychology.saveAnalysisResults();
    window.saveEmotionalResponse = () => psychology.saveEmotionalResponse();
    window.showSavedData = () => psychology.showSavedData();
    window.exportPsychologyData = () => psychology.exportPsychologyData();
});
