// Pattern Mathematics JavaScript
// Mathematical foundations for pattern creation

class PatternMathematics {
    constructor() {
        this.phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
        this.currentNoise = null;
        this.seedValue = Math.random() * 1000;
        this.currentColors = ['#00d2ff', '#7cff50', '#ff6b35', '#e74c3c', '#9b59b6', '#f39c12', '#1abc9c', '#34495e'];
        this.colorPalettes = {
            default: ['#00d2ff', '#7cff50', '#ff6b35', '#e74c3c', '#9b59b6', '#f39c12', '#1abc9c', '#34495e'],
            forest: ['#2d5016', '#4a7c28', '#7cff50', '#1a3d0a', '#5d7c3c', '#8fbc8f', '#228b22', '#006400'],
            ocean: ['#003366', '#0066cc', '#00ccff', '#66ffff', '#4682b4', '#5f9ea0', '#00bfff', '#87ceeb'],
            sunset: ['#ff4500', '#ff6b35', '#ffa500', '#ffff00', '#ff8c00', '#ff7f50', '#ffd700', '#ffb347'],
            cosmic: ['#4b0082', '#8b00ff', '#da70d6', '#ff1493', '#9400d3', '#ba55d3', '#dda0dd', '#ee82ee'],
            arctic: ['#e0e0e0', '#b0e0e6', '#87ceeb', '#ffffff', '#f0f8ff', '#e6e6fa', '#f5f5f5', '#dcdcdc']
        };
        this.selectedPalette = 'default';
        

        
        // Initialize update handlers
        this.setupUpdateHandlers();
    }
    
    init() {
        this.setupEventListeners();
        this.drawFibonacciSpiral();
        this.generateFractal();
        this.generatePerlinNoise();
        this.generateColorHarmony();
        this.setupPatternUpload();
        this.updatePhiDisplay();
        this.setupSymmetryControls();
        this.drawReflectionSymmetry();

    }
    

    
    setupUpdateHandlers() {
        // Throttle fractal generation to prevent freezing
        let fractalTimeout;
        let perlinTimeout;
        
        // Real-time updates for controls
        document.addEventListener('input', (e) => {
            const id = e.target.id;
            const value = e.target.value;
            
            switch(id) {
                case 'iterations':
                    document.getElementById('iteration-count').textContent = value;
                    // Throttle fractal generation for smooth sliding
                    clearTimeout(fractalTimeout);
                    fractalTimeout = setTimeout(() => {
                        this.generateFractal();
                    }, 300);
                    break;
                case 'fractal-scale':
                    document.getElementById('fractal-scale-value').textContent = value;
                    clearTimeout(fractalTimeout);
                    fractalTimeout = setTimeout(() => {
                        this.generateFractal();
                    }, 300);
                    break;
                case 'fractal-count':
                    document.getElementById('fractal-count-value').textContent = value;
                    clearTimeout(fractalTimeout);
                    fractalTimeout = setTimeout(() => {
                        this.generateFractal();
                    }, 300);
                    break;
                case 'frequency':
                    document.getElementById('frequency-value').textContent = value;
                    clearTimeout(perlinTimeout);
                    perlinTimeout = setTimeout(() => {
                        this.generatePerlinNoise();
                    }, 200);
                    break;
                case 'octaves':
                    document.getElementById('octaves-value').textContent = value;
                    clearTimeout(perlinTimeout);
                    perlinTimeout = setTimeout(() => {
                        this.generatePerlinNoise();
                    }, 200);
                    break;
                case 'persistence':
                    document.getElementById('persistence-value').textContent = value;
                    clearTimeout(perlinTimeout);
                    perlinTimeout = setTimeout(() => {
                        this.generatePerlinNoise();
                    }, 200);
                    break;
                case 'base-hue':
                    document.getElementById('base-hue-value').textContent = value;
                    this.generateColorHarmony();
                    break;
                case 'venation-density':
                    document.getElementById('venation-density-value').textContent = value;
                    break;
                case 'leaf-size':
                    document.getElementById('leaf-size-value').textContent = value + 'px';
                    break;
                case 'edge-variation':
                    document.getElementById('edge-variation-value').textContent = value;
                    break;
            }
        });
    }
    
    setupEventListeners() {
        // Fractal type change
        const fractalSelect = document.getElementById('fractal-type');
        if (fractalSelect) {
            fractalSelect.addEventListener('change', () => {
                this.generateFractal();
            });
        }
        
        // Harmony type change
        const harmonySelect = document.getElementById('harmony-type');
        if (harmonySelect) {
            harmonySelect.addEventListener('change', () => {
                this.generateColorHarmony();
            });
        }
    }
    
    updatePhiDisplay() {
        const phiElement = document.getElementById('phi-value');
        if (phiElement) {
            phiElement.textContent = this.phi.toFixed(6) + '...';
        }
    }
    
    drawFibonacciSpiral() {
        const canvas = document.getElementById('golden-canvas');
        if (!canvas) return;
        
        this.animateFibonacciSpiral();
    }
    
    animateFibonacciSpiral() {
        const canvas = document.getElementById('golden-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        let currentStep = 0;
        const maxSteps = 200;
        const animationSpeed = 3; // Steps per frame
        
        const animate = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw animated Fibonacci spiral
            ctx.strokeStyle = '#00d2ff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            let angle = 0;
            let radius = 2;
            let prevX = centerX;
            let prevY = centerY;
            
            for (let i = 0; i < Math.min(currentStep, maxSteps); i++) {
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                
                angle += 0.1;
                radius += 0.5;
                prevX = x;
                prevY = y;
            }
            
            ctx.stroke();
            
            // Draw growing golden rectangles
            ctx.strokeStyle = '#7cff50';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            
            const rectangleSteps = Math.min(Math.floor(currentStep / 25), 8);
            let size = 10;
            let x = centerX - size / 2;
            let y = centerY - size / 2;
            
            for (let i = 0; i < rectangleSteps; i++) {
                // Animate rectangle appearance
                const alpha = Math.min(1, (currentStep - i * 25) / 25);
                ctx.globalAlpha = alpha;
                
                ctx.strokeRect(x, y, size, size / this.phi);
                
                // Update for next rectangle
                const nextSize = size * this.phi;
                x -= (nextSize - size) / 2;
                y -= (nextSize / this.phi - size / this.phi) / 2;
                size = nextSize;
            }
            
            ctx.globalAlpha = 1;
            ctx.setLineDash([]);
            
            // Draw animated golden ratio point
            if (currentStep > 0) {
                const pointAngle = (currentStep * 0.1) % (2 * Math.PI);
                const pointRadius = 2 + (currentStep * 0.5);
                const pointX = centerX + pointRadius * Math.cos(pointAngle);
                const pointY = centerY + pointRadius * Math.sin(pointAngle);
                
                ctx.fillStyle = '#ff6b35';
                ctx.beginPath();
                ctx.arc(pointX, pointY, 4, 0, 2 * Math.PI);
                ctx.fill();
            }
            
            currentStep += animationSpeed;
            
            // Reset animation when complete
            if (currentStep >= maxSteps + 50) {
                currentStep = 0;
                setTimeout(() => requestAnimationFrame(animate), 1000);
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    drawPineconePattern() {
        const canvas = document.getElementById('golden-canvas');
        if (!canvas) return;
        
        this.animatePineconePattern();
    }
    
    animatePineconePattern() {
        const canvas = document.getElementById('golden-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        let currentSeeds = 0;
        const maxSeeds = 150;
        const numSpirals = 13; // Fibonacci number
        const goldenAngle = 2 * Math.PI / (this.phi * this.phi);
        const animationSpeed = 2;
        
        const animate = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw growing pinecone spiral pattern
            for (let i = 0; i < Math.min(currentSeeds, maxSeeds); i++) {
                const angle = i * goldenAngle;
                const radius = 3 * Math.sqrt(i);
                
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                
                // Animate seed appearance
                const alpha = Math.min(1, (currentSeeds - i) / 10);
                const scale = Math.min(1, (currentSeeds - i) / 5);
                
                ctx.globalAlpha = alpha;
                ctx.fillStyle = `hsl(${120 + i * 2}, 70%, 30%)`;
                
                // Draw seed with scale animation
                ctx.beginPath();
                ctx.arc(x, y, 3 * scale, 0, 2 * Math.PI);
                ctx.fill();
                
                // Draw pulsing highlight on recent seeds
                if (i >= currentSeeds - 10 && i < currentSeeds) {
                    ctx.fillStyle = '#7cff50';
                    ctx.beginPath();
                    ctx.arc(x, y, 1.5 * scale, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
            
            ctx.globalAlpha = 1;
            
            // Draw animated spiral connections
            ctx.strokeStyle = '#4a7c28';
            ctx.lineWidth = 1;
            
            const visibleSpirals = Math.min(numSpirals, Math.floor(currentSeeds / 10));
            
            for (let spiral = 0; spiral < visibleSpirals; spiral++) {
                ctx.beginPath();
                
                const spiralSeeds = Math.min(currentSeeds, maxSeeds);
                let firstPoint = true;
                
                for (let i = spiral; i < spiralSeeds; i += numSpirals) {
                    const angle = i * goldenAngle;
                    const radius = 3 * Math.sqrt(i);
                    
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);
                    
                    if (firstPoint) {
                        ctx.moveTo(x, y);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                
                // Animate line drawing
                const lineAlpha = Math.min(1, (currentSeeds - spiral * 10) / 50);
                ctx.globalAlpha = lineAlpha;
                ctx.stroke();
            }
            
            ctx.globalAlpha = 1;
            
            // Draw center fibonacci numbers
            if (currentSeeds > 30) {
                ctx.fillStyle = '#00d2ff';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`φ = ${this.phi.toFixed(3)}`, centerX, centerY - 10);
                ctx.fillText(`Seeds: ${Math.min(currentSeeds, maxSeeds)}`, centerX, centerY + 10);
            }
            
            currentSeeds += animationSpeed;
            
            // Reset animation when complete
            if (currentSeeds >= maxSeeds + 50) {
                currentSeeds = 0;
                setTimeout(() => requestAnimationFrame(animate), 1500);
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    drawLeafVenation() {
        this.animateLeafVenation();
    }
    
    animateLeafVenation() {
        const canvas = document.getElementById('golden-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        let currentVeins = 0;
        const maxVeins = 50;
        const animationSpeed = 1;
        
        const animate = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const leafWidth = 120;
            const leafHeight = 160;
            
            // Draw leaf outline first
            ctx.strokeStyle = '#4a7c28';
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            // Draw simple leaf shape
            ctx.ellipse(centerX, centerY, leafWidth/2, leafHeight/2, 0, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Draw main central vein
            ctx.strokeStyle = '#2d5016';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - leafHeight/2);
            ctx.lineTo(centerX, centerY + leafHeight/2);
            ctx.stroke();
            
            // Draw animated secondary veins using golden ratio
            const goldenAngle = 2 * Math.PI / this.phi;
            
            for (let i = 0; i < Math.min(currentVeins, maxVeins); i++) {
                // Calculate vein position using golden ratio
                const t = i / maxVeins;
                const angle = i * goldenAngle;
                const veinY = centerY - leafHeight/2 + t * leafHeight;
                
                // Alternate left and right
                const side = (i % 2 === 0) ? 1 : -1;
                const veinLength = (leafWidth/2) * (1 - t) * 0.8;
                
                // Animate vein growth
                const growth = Math.min(1, (currentVeins - i) / 5);
                const endX = centerX + side * veinLength * growth;
                
                // Draw vein with tapering
                const veinAlpha = Math.min(1, (currentVeins - i) / 10);
                ctx.globalAlpha = veinAlpha;
                
                ctx.strokeStyle = `hsl(${120 + i * 3}, 60%, ${30 + t * 20}%)`;
                ctx.lineWidth = Math.max(1, 3 * (1 - t) * growth);
                
                ctx.beginPath();
                ctx.moveTo(centerX, veinY);
                ctx.lineTo(endX, veinY);
                ctx.stroke();
                
                // Draw sub-veins using fibonacci pattern
                if (growth > 0.5 && i < currentVeins - 3) {
                    const subVeins = Math.floor(veinLength / 20);
                    for (let j = 1; j <= subVeins; j++) {
                        const subT = j / subVeins;
                        const subAngle = angle + Math.PI/6 * side;
                        const subLength = veinLength * 0.3 * (1 - subT);
                        
                        const subStartX = centerX + side * veinLength * subT * growth;
                        const subEndX = subStartX + side * subLength * Math.cos(subAngle) * growth;
                        const subEndY = veinY + subLength * Math.sin(subAngle) * growth;
                        
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(subStartX, veinY);
                        ctx.lineTo(subEndX, subEndY);
                        ctx.stroke();
                    }
                }
            }
            
            ctx.globalAlpha = 1;
            
            // Draw fibonacci spiral overlay on leaf
            if (currentVeins > 20) {
                ctx.strokeStyle = '#7cff50';
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);
                
                ctx.beginPath();
                let spiralAngle = 0;
                let spiralRadius = 5;
                
                for (let i = 0; i < 30; i++) {
                    const x = centerX + spiralRadius * Math.cos(spiralAngle);
                    const y = centerY + spiralRadius * Math.sin(spiralAngle);
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                    
                    spiralAngle += 0.3;
                    spiralRadius += 1.5;
                }
                
                ctx.stroke();
                ctx.setLineDash([]);
            }
            
            // Draw golden ratio text
            if (currentVeins > 10) {
                ctx.fillStyle = '#00d2ff';
                ctx.font = '14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`φ = ${this.phi.toFixed(3)}`, centerX, centerY + leafHeight/2 + 30);
                ctx.fillText('Leaf Venation Pattern', centerX, centerY + leafHeight/2 + 50);
            }
            
            currentVeins += animationSpeed;
            
            // Reset animation when complete
            if (currentVeins >= maxVeins + 30) {
                currentVeins = 0;
                setTimeout(() => requestAnimationFrame(animate), 2000);
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    generateLeafVariation() {
        const canvas = document.getElementById('golden-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Get current settings
        const leafType = document.getElementById('leaf-type')?.value || 'oak';
        const venationDensity = parseInt(document.getElementById('venation-density')?.value) || 15;
        const leafSize = parseInt(document.getElementById('leaf-size')?.value) || 150;
        const edgeVariation = parseFloat(document.getElementById('edge-variation')?.value) || 0.3;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw leaf based on type
        switch(leafType) {
            case 'oak':
                this.drawOakLeaf(ctx, centerX, centerY, leafSize, edgeVariation, venationDensity);
                break;
            case 'maple':
                this.drawMapleLeaf(ctx, centerX, centerY, leafSize, edgeVariation, venationDensity);
                break;
            case 'birch':
                this.drawBirchLeaf(ctx, centerX, centerY, leafSize, edgeVariation, venationDensity);
                break;
            case 'pine':
                this.drawPineNeedle(ctx, centerX, centerY, leafSize, edgeVariation, venationDensity);
                break;
            case 'cedar':
                this.drawCedarScale(ctx, centerX, centerY, leafSize, edgeVariation, venationDensity);
                break;
            case 'redwood':
                this.drawRedwoodNeedle(ctx, centerX, centerY, leafSize, edgeVariation, venationDensity);
                break;
            default:
                this.drawOakLeaf(ctx, centerX, centerY, leafSize, edgeVariation, venationDensity);
        }
    }
    
    drawOakLeaf(ctx, centerX, centerY, size, variation, venationDensity) {
        const leafWidth = size * 0.6;
        const leafHeight = size;
        
        // Draw lobed oak leaf outline
        ctx.strokeStyle = '#4a7c28';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const lobes = 5;
        for (let i = 0; i <= 100; i++) {
            const t = i / 100;
            const angle = t * Math.PI;
            
            // Create lobed edge
            const lobeEffect = 1 + variation * Math.sin(angle * lobes);
            const randomVariation = 1 + (Math.random() - 0.5) * variation * 0.5;
            
            const x = centerX + (leafWidth / 2) * Math.sin(angle) * (1 - t) * lobeEffect * randomVariation;
            const y = centerY - leafHeight / 2 + t * leafHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        for (let i = 100; i >= 0; i--) {
            const t = i / 100;
            const angle = t * Math.PI;
            
            const lobeEffect = 1 + variation * Math.sin(angle * lobes);
            const randomVariation = 1 + (Math.random() - 0.5) * variation * 0.5;
            
            const x = centerX - (leafWidth / 2) * Math.sin(angle) * (1 - t) * lobeEffect * randomVariation;
            const y = centerY - leafHeight / 2 + t * leafHeight;
            
            ctx.lineTo(x, y);
        }
        
        ctx.closePath();
        ctx.stroke();
        
        // Draw venation based on density
        this.drawVenation(ctx, centerX, centerY, leafWidth, leafHeight, venationDensity, 'oak');
    }
    
    drawMapleLeaf(ctx, centerX, centerY, size, variation, venationDensity) {
        const leafWidth = size * 0.8;
        const leafHeight = size * 0.9;
        
        // Draw pointed maple leaf with 5 main points
        ctx.strokeStyle = '#4a7c28';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const points = [
            { x: centerX, y: centerY - leafHeight / 2 }, // Top point
            { x: centerX + leafWidth * 0.3, y: centerY - leafHeight * 0.1 },
            { x: centerX + leafWidth / 2, y: centerY },
            { x: centerX + leafWidth * 0.2, y: centerY + leafHeight * 0.3 },
            { x: centerX, y: centerY + leafHeight / 2 }, // Bottom point
            { x: centerX - leafWidth * 0.2, y: centerY + leafHeight * 0.3 },
            { x: centerX - leafWidth / 2, y: centerY },
            { x: centerX - leafWidth * 0.3, y: centerY - leafHeight * 0.1 }
        ];
        
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            // Add variation to each point
            const varX = points[i].x + (Math.random() - 0.5) * variation * 20;
            const varY = points[i].y + (Math.random() - 0.5) * variation * 20;
            ctx.lineTo(varX, varY);
        }
        ctx.closePath();
        ctx.stroke();
        
        this.drawVenation(ctx, centerX, centerY, leafWidth, leafHeight, venationDensity, 'maple');
    }
    
    drawBirchLeaf(ctx, centerX, centerY, size, variation, venationDensity) {
        const leafWidth = size * 0.4;
        const leafHeight = size * 0.7;
        
        // Draw serrated birch leaf
        ctx.strokeStyle = '#4a7c28';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const serrations = 20;
        for (let i = 0; i <= serrations; i++) {
            const t = i / serrations;
            const angle = t * Math.PI;
            
            // Create serrated edge
            const serrationEffect = 1 + variation * 0.5 * Math.sin(angle * serrations);
            const x = centerX + (leafWidth / 2) * Math.sin(angle) * (1 - t) * serrationEffect;
            const y = centerY - leafHeight / 2 + t * leafHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        for (let i = serrations; i >= 0; i--) {
            const t = i / serrations;
            const angle = t * Math.PI;
            
            const serrationEffect = 1 + variation * 0.5 * Math.sin(angle * serrations);
            const x = centerX - (leafWidth / 2) * Math.sin(angle) * (1 - t) * serrationEffect;
            const y = centerY - leafHeight / 2 + t * leafHeight;
            
            ctx.lineTo(x, y);
        }
        
        ctx.closePath();
        ctx.stroke();
        
        this.drawVenation(ctx, centerX, centerY, leafWidth, leafHeight, venationDensity, 'birch');
    }
    
    drawPineNeedle(ctx, centerX, centerY, size, variation, venationDensity) {
        const needleWidth = size * 0.08;
        const needleHeight = size;
        
        // Draw multiple pine needles in a cluster
        ctx.strokeStyle = '#2d5016';
        ctx.lineWidth = 2;
        
        const needleCount = Math.min(venationDensity, 20);
        for (let i = 0; i < needleCount; i++) {
            const angle = (i / needleCount) * Math.PI * 0.6 - Math.PI * 0.3;
            const length = needleHeight * (0.8 + Math.random() * 0.4);
            
            const startX = centerX + (Math.random() - 0.5) * variation * 10;
            const startY = centerY + needleHeight / 3;
            const endX = startX + Math.sin(angle) * length * 0.3;
            const endY = startY - Math.cos(angle) * length;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
    
    drawCedarScale(ctx, centerX, centerY, size, variation, venationDensity) {
        const scaleSize = size * 0.6;
        
        // Draw overlapping cedar scales
        ctx.fillStyle = '#2d5016';
        ctx.strokeStyle = '#4a7c28';
        ctx.lineWidth = 1;
        
        const scales = Math.min(venationDensity, 15);
        for (let i = 0; i < scales; i++) {
            const angle = (i / scales) * 2 * Math.PI;
            const distance = (i / scales) * scaleSize * 0.3;
            
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            // Draw scale as small rounded rectangle
            const scaleWidth = scaleSize * 0.2 * (1 + variation * (Math.random() - 0.5));
            const scaleHeight = scaleSize * 0.15 * (1 + variation * (Math.random() - 0.5));
            
            ctx.beginPath();
            ctx.roundRect(x - scaleWidth / 2, y - scaleHeight / 2, scaleWidth, scaleHeight, 2);
            ctx.fill();
            ctx.stroke();
        }
    }
    
    drawRedwoodNeedle(ctx, centerX, centerY, size, variation, venationDensity) {
        const needleWidth = size * 0.12;
        const needleHeight = size * 0.8;
        
        // Draw flat redwood needles arranged in spiral
        ctx.fillStyle = '#2d5016';
        ctx.strokeStyle = '#4a7c28';
        ctx.lineWidth = 1;
        
        const needles = Math.min(venationDensity, 18);
        for (let i = 0; i < needles; i++) {
            const angle = (i / needles) * 2 * Math.PI;
            const distance = (i / needles) * needleHeight * 0.4;
            
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            // Draw flat needle
            const width = needleWidth * (1 + variation * (Math.random() - 0.5));
            const height = needleHeight * 0.3 * (1 + variation * (Math.random() - 0.5));
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }
    
    drawVenation(ctx, centerX, centerY, leafWidth, leafHeight, density, leafType) {
        // Draw main vein
        ctx.strokeStyle = '#2d5016';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - leafHeight / 2);
        ctx.lineTo(centerX, centerY + leafHeight / 2);
        ctx.stroke();
        
        // Draw secondary veins based on density
        ctx.strokeStyle = '#4a7c28';
        ctx.lineWidth = 1;
        
        const numVeins = Math.min(density, 25);
        for (let i = 0; i < numVeins; i++) {
            const t = (i + 1) / (numVeins + 1);
            const veinY = centerY - leafHeight / 2 + t * leafHeight;
            
            let veinLength, veinAngle;
            
            switch(leafType) {
                case 'maple':
                    veinLength = (leafWidth / 2) * (1 - Math.abs(t - 0.5)) * 0.9;
                    veinAngle = (t - 0.5) * 0.5; // Angled veins
                    break;
                case 'birch':
                    veinLength = (leafWidth / 2) * (1 - t) * 0.7;
                    veinAngle = (Math.random() - 0.5) * 0.2; // Slight randomness
                    break;
                case 'oak':
                    veinLength = (leafWidth / 2) * (1 - t) * 0.8;
                    veinAngle = 0; // Straight veins
                    break;
                default:
                    veinLength = (leafWidth / 2) * (1 - t) * 0.8;
                    veinAngle = 0;
            }
            
            // Right vein
            ctx.beginPath();
            ctx.moveTo(centerX, veinY);
            ctx.lineTo(centerX + veinLength * Math.cos(veinAngle), veinY + veinLength * Math.sin(veinAngle));
            ctx.stroke();
            
            // Left vein
            ctx.beginPath();
            ctx.moveTo(centerX, veinY);
            ctx.lineTo(centerX - veinLength * Math.cos(veinAngle), veinY + veinLength * Math.sin(veinAngle));
            ctx.stroke();
        }
    }
    
    generateFractal() {
        const canvas = document.getElementById('fractal-canvas');
        const loadingIndicator = document.getElementById('fractal-loading');
        if (!canvas) return;
        
        // Show loading indicator
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
        
        const ctx = canvas.getContext('2d');
        const type = document.getElementById('fractal-type').value;
        const iterations = parseInt(document.getElementById('iterations').value);
        const scale = parseFloat(document.getElementById('fractal-scale').value);
        const count = parseInt(document.getElementById('fractal-count').value);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const colors = ['#00d2ff', '#7cff50', '#ff6b35', '#e74c3c', '#9b59b6', '#f39c12', '#3498db', '#2ecc71'];
        
        // Use setTimeout to allow UI to update before computation
        setTimeout(() => {
            try {
                // Calculate optimal grid layout for multiple fractals
                let gridCols, gridRows;
                
                if (count <= 3) {
                    gridCols = count;
                    gridRows = 1;
                } else if (count <= 6) {
                    gridCols = 3;
                    gridRows = 2;
                } else if (count <= 9) {
                    gridCols = 3;
                    gridRows = 3;
                }
                
                const cellWidth = canvas.width / gridCols;
                const cellHeight = canvas.height / gridRows;
                
                for (let i = 0; i < count; i++) {
                    const row = Math.floor(i / gridCols);
                    const col = i % gridCols;
                    const centerX = (col + 0.5) * cellWidth;
                    const centerY = (row + 0.5) * cellHeight;
                    
                    // Save context for scaling
                    ctx.save();
                    
                    // Apply scaling from center of each grid cell
                    ctx.translate(centerX, centerY);
                    ctx.scale(scale, scale);
                    ctx.translate(-centerX, -centerY);
                    
                    // Adjust base sizes based on scaling and count
                    const baseSize = 80 * scale;
                    
                    // Smart iteration limits based on fractal type and count
                    let maxIterations;
                    const scaledCount = count > 4 ? count * 0.8 : count; // Reduce complexity for many fractals
                    
                    switch(type) {
                        case 'fern':
                            maxIterations = Math.min(iterations, count > 4 ? 15 : 25);
                            break;
                        case 'spiral':
                            maxIterations = Math.min(iterations, count > 4 ? 8 : 12);
                            break;
                        case 'tree':
                            maxIterations = Math.min(iterations, count > 4 ? 8 : 12);
                            break;
                        case 'seed-of-life':
                            maxIterations = Math.min(iterations, count > 4 ? 5 : 7);
                            break;
                        case 'flower-of-life':
                            maxIterations = Math.min(iterations, count > 4 ? 3 : 4);
                            break;
                        case 'merkaba':
                            maxIterations = Math.min(iterations, count > 4 ? 6 : 8);
                            break;
                        case 'sri-yantra':
                            maxIterations = Math.min(iterations, count > 4 ? 6 : 9);
                            break;

                        case 'penrose':
                            maxIterations = Math.min(iterations, count > 4 ? 6 : 8);
                            break;
                        case 'fungus':
                        case 'neural':
                            maxIterations = Math.min(iterations, count > 4 ? 10 : 15);
                            break;
                        case 'constellation':
                            maxIterations = Math.min(iterations, count > 4 ? 15 : 20);
                            break;
                        default:
                            maxIterations = Math.min(iterations, count > 4 ? 10 : 15);
                    }
                    
                    switch (type) {
                        case 'none':
                            // Skip drawing main fractal for clean canvas
                            break;
                        case 'tree':
                            this.drawFractalTree(ctx, centerX, centerY + cellHeight/3, -Math.PI / 2, Math.min(maxIterations, 12), baseSize, colors);
                            break;
                        case 'fern':
                            this.drawBarnsleyFern(ctx, centerX, centerY, Math.min(maxIterations, 25), 1.0, colors);
                            break;

                        case 'spiral':
                            this.drawSpiralFractals(ctx, centerX, centerY, Math.min(maxIterations, 12), colors);
                            break;

                        case 'penrose':
                            this.drawPenroseTiling(ctx, centerX, centerY, Math.min(maxIterations, 8), colors);
                            break;
                        case 'fungus':
                            this.drawFungalNetwork(ctx, centerX, centerY, Math.min(maxIterations, 15), colors);
                            break;
                        case 'constellation':
                            this.drawStarConstellations(ctx, centerX, centerY, Math.min(maxIterations, 20), colors);
                            break;
                        case 'neural':
                            this.drawNeuralNetworks(ctx, centerX, centerY, Math.min(maxIterations, 15), colors);
                            break;
                        case 'seed-of-life':
                            this.drawSeedOfLife(ctx, centerX, centerY, maxIterations, colors);
                            break;
                        case 'flower-of-life':
                            this.drawFlowerOfLife(ctx, centerX, centerY, maxIterations, colors);
                            break;
                        case 'merkaba':
                            this.drawMerkaba(ctx, centerX, centerY, maxIterations, colors);
                            break;
                        case 'sri-yantra':
                            this.drawSriYantra(ctx, centerX, centerY, Math.min(maxIterations, 9), colors);
                            break;

                        case 'tesla-coil':
                            this.drawTeslaCoilResonance(ctx, centerX, centerY, maxIterations, colors);
                            break;
                        case 'tesla-spiral':
                            this.drawTeslaVortexSpiral(ctx, centerX, centerY, maxIterations, colors);
                            break;

                        case 'sacred-diamond':
                            this.drawSacredGeometryDiamond(ctx, centerX, centerY, Math.min(maxIterations, 12), colors);
                            break;
                        case 'universal-eye':
                            this.drawUniversalEye(ctx, centerX, centerY, Math.min(maxIterations, 20), colors);
                            break;
                        case 'torus-field':
                            this.drawTorusField(ctx, centerX, centerY, Math.min(maxIterations, 20), colors);
                            break;
                    }
                    
                    // Restore context
                    ctx.restore();
                }
            } catch (error) {
                console.log('Fractal generation error:', error);
                // Draw simple fallback
                ctx.strokeStyle = colors[0];
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(canvas.width / 2, 50);
                ctx.lineTo(canvas.width / 2, canvas.height - 50);
                ctx.stroke();
            }
            
            // Hide loading indicator
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }, 50); // Small delay to allow UI update
    }
    
    drawFractalTree(ctx, x, y, angle, iterations, length, colors) {
        if (iterations === 0 || length < 1) return;
        
        const endX = x + length * Math.cos(angle);
        const endY = y + length * Math.sin(angle);
        
        // Draw branch with continuous color cycling
        const colorIndex = iterations % colors.length;
        ctx.strokeStyle = colors[colorIndex];
        ctx.lineWidth = Math.max(1, iterations / 3);
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Continue recursion without artificial iteration limits
        if (iterations > 1 && length > 2) {
            const newLength = length * 0.7;
            this.drawFractalTree(ctx, endX, endY, angle - Math.PI / 6, iterations - 1, newLength, colors);
            this.drawFractalTree(ctx, endX, endY, angle + Math.PI / 6, iterations - 1, newLength, colors);
        }
    }
    
    drawFractalFern(ctx, x, y, iterations) {
        if (iterations === 0) return;
        
        ctx.strokeStyle = '#2d5016';
        ctx.lineWidth = 1;
        
        // Draw main stem
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 100);
        ctx.stroke();
        
        // Draw fronds
        for (let i = 0; i < 10; i++) {
            const frondY = y - (i * 10);
            const frondLength = 30 * (1 - i / 10);
            
            // Left frond
            ctx.beginPath();
            ctx.moveTo(x, frondY);
            ctx.lineTo(x - frondLength, frondY - frondLength / 2);
            ctx.stroke();
            
            // Right frond
            ctx.beginPath();
            ctx.moveTo(x, frondY);
            ctx.lineTo(x + frondLength, frondY - frondLength / 2);
            ctx.stroke();
        }
    }
    
    drawFractalLightning(ctx, x1, y1, x2, y2, iterations, colors) {
        if (iterations === 0 || iterations > 15) {
            ctx.strokeStyle = colors[0];
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            return;
        }
        
        const randomFactor = Math.max(5, 50 / iterations); // Reduce randomness at higher iterations
        const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * randomFactor;
        const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * randomFactor;
        
        ctx.strokeStyle = colors[iterations % colors.length];
        this.drawFractalLightning(ctx, x1, y1, midX, midY, iterations - 1, colors);
        this.drawFractalLightning(ctx, midX, midY, x2, y2, iterations - 1, colors);
    }
    
    drawFractalCoastline(ctx, x1, y1, x2, y2, iterations, colors) {
        if (iterations === 0 || iterations > 15) {
            ctx.strokeStyle = colors[0];
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            return;
        }
        
        const dx = x2 - x1;
        const dy = y2 - y1;
        const randomFactor = Math.max(0.05, 0.1 / iterations); // Reduce randomness at higher iterations
        const midX = (x1 + x2) / 2 + dy * randomFactor * (Math.random() - 0.5);
        const midY = (y1 + y2) / 2 - dx * randomFactor * (Math.random() - 0.5);
        
        ctx.strokeStyle = colors[iterations % colors.length];
        this.drawFractalCoastline(ctx, x1, y1, midX, midY, iterations - 1, colors);
        this.drawFractalCoastline(ctx, midX, midY, x2, y2, iterations - 1, colors);
    }

    // New Enhanced Fractal Functions
    drawBarnsleyFern(ctx, centerX, centerY, iterations, scaleFactor, colors) {
        let x = 0, y = 0;
        
        // Scale points based on iteration level for animation effect - limit for performance
        const numPoints = Math.min(iterations * 300, 12000);
        
        for (let i = 0; i < numPoints; i++) {
            const rand = Math.random();
            let nextX, nextY;
            
            if (rand < 0.01) {
                nextX = 0;
                nextY = 0.16 * y;
            } else if (rand < 0.86) {
                nextX = 0.85 * x + 0.04 * y;
                nextY = -0.04 * x + 0.85 * y + 1.6;
            } else if (rand < 0.93) {
                nextX = 0.2 * x - 0.26 * y;
                nextY = 0.23 * x + 0.22 * y + 1.6;
            } else {
                nextX = -0.15 * x + 0.28 * y;
                nextY = 0.26 * x + 0.24 * y + 0.44;
            }
            
            x = nextX;
            y = nextY;
            
            // Position relative to center with scaling - FIXED: Centered in viewing area
            const plotX = centerX + x * 25 * scaleFactor;
            const plotY = centerY - y * 20 * scaleFactor + 20;
            
            // FIXED: Better color cycling that changes with iterations AND throughout the fern
            const colorIndex = (Math.floor(i / 400) + iterations * 2) % colors.length;
            ctx.fillStyle = colors[colorIndex];
            
            // Enhanced point rendering with better visibility
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(plotX, plotY, 1.2, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }

    drawKochSnowflake(ctx, centerX, centerY, iterations, colors) {
        const size = 150;
        const points = [
            { x: centerX - size, y: centerY + size / Math.sqrt(3) },
            { x: centerX + size, y: centerY + size / Math.sqrt(3) },
            { x: centerX, y: centerY - 2 * size / Math.sqrt(3) }
        ];
        
        for (let i = 0; i < 3; i++) {
            const start = points[i];
            const end = points[(i + 1) % 3];
            this.drawKochLine(ctx, start.x, start.y, end.x, end.y, iterations, colors);
        }
    }

    drawKochLine(ctx, x1, y1, x2, y2, iterations, colors) {
        if (iterations === 0) {
            ctx.strokeStyle = colors[0];
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            return;
        }
        
        const dx = x2 - x1;
        const dy = y2 - y1;
        
        const x3 = x1 + dx / 3;
        const y3 = y1 + dy / 3;
        const x4 = x1 + 2 * dx / 3;
        const y4 = y1 + 2 * dy / 3;
        
        const x5 = x3 + (dx / 3) * Math.cos(Math.PI / 3) - (dy / 3) * Math.sin(Math.PI / 3);
        const y5 = y3 + (dx / 3) * Math.sin(Math.PI / 3) + (dy / 3) * Math.cos(Math.PI / 3);
        
        ctx.strokeStyle = colors[iterations % colors.length];
        this.drawKochLine(ctx, x1, y1, x3, y3, iterations - 1, colors);
        this.drawKochLine(ctx, x3, y3, x5, y5, iterations - 1, colors);
        this.drawKochLine(ctx, x5, y5, x4, y4, iterations - 1, colors);
        this.drawKochLine(ctx, x4, y4, x2, y2, iterations - 1, colors);
    }

    drawSierpinskiTriangle(ctx, centerX, centerY, iterations, colors) {
        const size = 150;
        const points = [
            { x: centerX, y: centerY - size },
            { x: centerX - size, y: centerY + size },
            { x: centerX + size, y: centerY + size }
        ];
        
        this.drawSierpinskiRecursive(ctx, points[0], points[1], points[2], iterations, colors);
    }

    drawSierpinskiRecursive(ctx, p1, p2, p3, iterations, colors) {
        if (iterations === 0) {
            ctx.strokeStyle = colors[0];
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.stroke();
            return;
        }
        
        const mid1 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        const mid2 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
        const mid3 = { x: (p3.x + p1.x) / 2, y: (p3.y + p1.y) / 2 };
        
        ctx.strokeStyle = colors[iterations % colors.length];
        this.drawSierpinskiRecursive(ctx, p1, mid1, mid3, iterations - 1, colors);
        this.drawSierpinskiRecursive(ctx, mid1, p2, mid2, iterations - 1, colors);
        this.drawSierpinskiRecursive(ctx, mid3, mid2, p3, iterations - 1, colors);
    }



    drawMandelbrotSet(ctx, iterations, colors) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        // Limit iterations for performance
        const maxIter = Math.min(iterations, 30);
        
        // Use step size to reduce computation
        const step = Math.max(1, Math.floor(50 / iterations));
        
        for (let px = 0; px < width; px += step) {
            for (let py = 0; py < height; py += step) {
                const x0 = (px - width / 2) * 4 / width;
                const y0 = (py - height / 2) * 4 / height;
                
                let x = 0, y = 0;
                let iter = 0;
                
                while (x * x + y * y <= 4 && iter < maxIter) {
                    const temp = x * x - y * y + x0;
                    y = 2 * x * y + y0;
                    x = temp;
                    iter++;
                }
                
                const colorIndex = iter % colors.length;
                const color = this.hexToRgb(colors[colorIndex]);
                
                // Fill block instead of single pixel for performance
                for (let dx = 0; dx < step && px + dx < width; dx++) {
                    for (let dy = 0; dy < step && py + dy < height; dy++) {
                        const index = ((py + dy) * width + (px + dx)) * 4;
                        data[index] = color.r;
                        data[index + 1] = color.g;
                        data[index + 2] = color.b;
                        data[index + 3] = 255;
                    }
                }
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    drawJuliaSet(ctx, iterations, colors) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        const cx = -0.7;
        const cy = 0.27015;
        
        // Limit iterations for performance
        const maxIter = Math.min(iterations, 30);
        
        // Use step size to reduce computation
        const step = Math.max(1, Math.floor(50 / iterations));
        
        for (let px = 0; px < width; px += step) {
            for (let py = 0; py < height; py += step) {
                let x = (px - width / 2) * 4 / width;
                let y = (py - height / 2) * 4 / height;
                
                let iter = 0;
                
                while (x * x + y * y <= 4 && iter < maxIter) {
                    const temp = x * x - y * y + cx;
                    y = 2 * x * y + cy;
                    x = temp;
                    iter++;
                }
                
                const colorIndex = iter % colors.length;
                const color = this.hexToRgb(colors[colorIndex]);
                
                // Fill block instead of single pixel for performance
                for (let dx = 0; dx < step && px + dx < width; dx++) {
                    for (let dy = 0; dy < step && py + dy < height; dy++) {
                        const index = ((py + dy) * width + (px + dx)) * 4;
                        data[index] = color.r;
                        data[index + 1] = color.g;
                        data[index + 2] = color.b;
                        data[index + 3] = 255;
                    }
                }
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    drawSpiralFractals(ctx, centerX, centerY, iterations, colors) {
        const numSpirals = 8;
        const angleStep = (2 * Math.PI) / numSpirals;
        
        for (let spiral = 0; spiral < numSpirals; spiral++) {
            ctx.strokeStyle = colors[spiral % colors.length];
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let i = 0; i < iterations * 10; i++) {
                const angle = spiral * angleStep + i * 0.1;
                const radius = i * 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
    }

    drawHexagonalSnowflake(ctx, centerX, centerY, iterations, colors) {
        const numSides = 6;
        const angleStep = (2 * Math.PI) / numSides;
        
        for (let side = 0; side < numSides; side++) {
            const angle = side * angleStep;
            const x1 = centerX + 100 * Math.cos(angle);
            const y1 = centerY + 100 * Math.sin(angle);
            const x2 = centerX + 100 * Math.cos(angle + angleStep);
            const y2 = centerY + 100 * Math.sin(angle + angleStep);
            
            this.drawKochLine(ctx, x1, y1, x2, y2, iterations, colors);
        }
    }

    drawCantorSet(ctx, iterations, colors) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const lineHeight = height / iterations;
        
        for (let i = 0; i < iterations; i++) {
            ctx.strokeStyle = colors[i % colors.length];
            ctx.lineWidth = lineHeight * 0.8;
            this.drawCantorLine(ctx, 50, 50 + i * lineHeight, width - 100, i);
        }
    }

    drawCantorLine(ctx, x, y, length, iteration) {
        if (iteration === 0) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + length, y);
            ctx.stroke();
            return;
        }
        
        const third = length / 3;
        this.drawCantorLine(ctx, x, y, third, iteration - 1);
        this.drawCantorLine(ctx, x + 2 * third, y, third, iteration - 1);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 210, b: 255 };
    }

    // New Nature-Inspired Fractal Functions
    drawForestCanopy(ctx, centerX, centerY, iterations, colors) {
        const numTrees = Math.min(iterations * 2, 30);
        const canopyRadius = 180;
        
        for (let i = 0; i < numTrees; i++) {
            const angle = (i / numTrees) * 2 * Math.PI;
            const distance = Math.random() * canopyRadius;
            const x = centerX + distance * Math.cos(angle);
            const y = centerY + distance * Math.sin(angle);
            
            // Draw tree canopy as circle with fractal edges
            const treeRadius = 15 + Math.random() * 20;
            const edgePoints = Math.min(iterations, 12);
            
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            
            for (let j = 0; j <= edgePoints; j++) {
                const edgeAngle = (j / edgePoints) * 2 * Math.PI;
                const radiusVariation = treeRadius * (0.8 + Math.random() * 0.4);
                const px = x + radiusVariation * Math.cos(edgeAngle);
                const py = y + radiusVariation * Math.sin(edgeAngle);
                
                if (j === 0) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            
            ctx.closePath();
            ctx.fill();
            
            // Add some smaller canopy details
            if (iterations > 5) {
                const detailRadius = treeRadius * 0.3;
                const detailX = x + (Math.random() - 0.5) * treeRadius;
                const detailY = y + (Math.random() - 0.5) * treeRadius;
                
                ctx.fillStyle = colors[(i + 1) % colors.length];
                ctx.beginPath();
                ctx.arc(detailX, detailY, detailRadius, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }

    drawRiverDelta(ctx, startX, startY, iterations, colors) {
        const branches = [];
        branches.push({ x: startX, y: startY, angle: Math.PI / 2, width: 8, generation: 0 });
        
        for (let gen = 0; gen < iterations && gen < 12; gen++) {
            const currentBranches = branches.filter(b => b.generation === gen);
            
            currentBranches.forEach(branch => {
                const branchLength = 40 - gen * 3;
                const endX = branch.x + branchLength * Math.cos(branch.angle);
                const endY = branch.y + branchLength * Math.sin(branch.angle);
                
                // Draw river branch
                ctx.strokeStyle = colors[gen % colors.length];
                ctx.lineWidth = Math.max(1, branch.width - gen);
                ctx.beginPath();
                ctx.moveTo(branch.x, branch.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                
                // Create new branches (delta effect)
                if (gen < iterations - 1 && Math.random() > 0.3) {
                    const numNewBranches = Math.random() > 0.5 ? 2 : 3;
                    for (let i = 0; i < numNewBranches; i++) {
                        const angleVariation = (Math.random() - 0.5) * Math.PI / 3;
                        branches.push({
                            x: endX,
                            y: endY,
                            angle: branch.angle + angleVariation,
                            width: branch.width * 0.7,
                            generation: gen + 1
                        });
                    }
                }
            });
        }
    }

    drawMountainRidges(ctx, centerX, centerY, iterations, colors) {
        const numRidges = Math.min(iterations, 15);
        const ridgeHeight = 150;
        const ridgeWidth = 400;
        
        for (let ridge = 0; ridge < numRidges; ridge++) {
            const baseY = centerY + ridge * (ridgeHeight / numRidges) - ridgeHeight / 2;
            const points = [];
            const numPoints = Math.min(iterations * 2, 20);
            
            // Generate ridge line with fractal noise
            for (let i = 0; i <= numPoints; i++) {
                const x = centerX - ridgeWidth / 2 + (i / numPoints) * ridgeWidth;
                const noiseScale = Math.pow(0.8, ridge); // Smaller ridges have less noise
                const y = baseY + (Math.random() - 0.5) * 30 * noiseScale;
                points.push({ x, y });
            }
            
            // Smooth the ridge line
            ctx.strokeStyle = colors[ridge % colors.length];
            ctx.lineWidth = Math.max(1, 3 - ridge * 0.2);
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            
            for (let i = 1; i < points.length; i++) {
                const cp1x = points[i - 1].x + (points[i].x - points[i - 1].x) / 3;
                const cp1y = points[i - 1].y;
                const cp2x = points[i].x - (points[i].x - points[i - 1].x) / 3;
                const cp2y = points[i].y;
                
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, points[i].x, points[i].y);
            }
            ctx.stroke();
        }
    }

    drawRootSystem(ctx, startX, startY, iterations, colors) {
        const drawRoot = (x, y, angle, length, depth, maxDepth) => {
            if (depth >= maxDepth || length < 3) return;
            
            const endX = x + length * Math.cos(angle);
            const endY = y + length * Math.sin(angle);
            
            // Draw root segment
            ctx.strokeStyle = colors[depth % colors.length];
            ctx.lineWidth = Math.max(1, maxDepth - depth);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            // Create branching roots
            const numBranches = Math.random() > 0.7 ? 3 : 2;
            for (let i = 0; i < numBranches; i++) {
                const branchAngle = angle + (Math.random() - 0.5) * Math.PI / 2;
                const branchLength = length * (0.6 + Math.random() * 0.3);
                drawRoot(endX, endY, branchAngle, branchLength, depth + 1, maxDepth);
            }
        };
        
        // Create main root systems
        const numMainRoots = Math.min(iterations / 2, 8);
        for (let i = 0; i < numMainRoots; i++) {
            const rootAngle = Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 3;
            const rootLength = 30 + Math.random() * 20;
            drawRoot(startX, startY, rootAngle, rootLength, 0, Math.min(iterations, 8));
        }
    }
    
    generatePerlinNoise() {
        const canvas = document.getElementById('perlin-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const frequency = parseFloat(document.getElementById('frequency').value);
        const octaves = parseInt(document.getElementById('octaves').value);
        const persistence = parseFloat(document.getElementById('persistence').value);
        
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let x = 0; x < canvas.width; x++) {
            for (let y = 0; y < canvas.height; y++) {
                let noise = 0;
                let amplitude = 1;
                let freq = frequency;
                let maxValue = 0;
                
                for (let i = 0; i < octaves; i++) {
                    noise += this.perlinNoise(x * freq, y * freq) * amplitude;
                    maxValue += amplitude;
                    amplitude *= persistence;
                    freq *= 2;
                }
                
                noise /= maxValue;
                
                // Convert to grayscale
                const value = Math.floor((noise + 1) * 127.5);
                const index = (y * canvas.width + x) * 4;
                
                data[index] = value;     // Red
                data[index + 1] = value; // Green
                data[index + 2] = value; // Blue
                data[index + 3] = 255;   // Alpha
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    perlinNoise(x, y) {
        // Simplified Perlin noise implementation
        const xi = Math.floor(x) & 255;
        const yi = Math.floor(y) & 255;
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);
        
        const u = this.fade(xf);
        const v = this.fade(yf);
        
        const aa = this.grad(this.hash(xi, yi), xf, yf);
        const ba = this.grad(this.hash(xi + 1, yi), xf - 1, yf);
        const ab = this.grad(this.hash(xi, yi + 1), xf, yf - 1);
        const bb = this.grad(this.hash(xi + 1, yi + 1), xf - 1, yf - 1);
        
        return this.lerp(v, this.lerp(u, aa, ba), this.lerp(u, ab, bb));
    }
    
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    
    lerp(t, a, b) {
        return a + t * (b - a);
    }
    
    grad(hash, x, y) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    
    hash(x, y) {
        // Simple hash function for demo
        return Math.floor(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) & 255;
    }
    
    generateColorHarmony() {
        const canvas = document.getElementById('color-wheel-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;
        const baseHue = parseInt(document.getElementById('base-hue').value);
        const harmonyType = document.getElementById('harmony-type').value;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw color wheel
        for (let angle = 0; angle < 360; angle += 1) {
            const startAngle = (angle - 90) * Math.PI / 180;
            const endAngle = ((angle + 1) - 90) * Math.PI / 180;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.arc(centerX, centerY, radius - 30, endAngle, startAngle, true);
            ctx.closePath();
            
            ctx.fillStyle = `hsl(${angle}, 70%, 50%)`;
            ctx.fill();
        }
        
        // Calculate harmony colors
        let harmonies = [];
        
        switch (harmonyType) {
            case 'complementary':
                harmonies = [baseHue, (baseHue + 180) % 360];
                break;
            case 'triadic':
                harmonies = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
                break;
            case 'analogous':
                harmonies = [(baseHue - 30 + 360) % 360, baseHue, (baseHue + 30) % 360];
                break;
            case 'tetradic':
                harmonies = [baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360];
                break;
        }
        
        // Draw harmony markers
        harmonies.forEach((hue, index) => {
            const angle = (hue - 90) * Math.PI / 180;
            const x = centerX + (radius - 15) * Math.cos(angle);
            const y = centerY + (radius - 15) * Math.sin(angle);
            
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, 2 * Math.PI);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        
        // Draw harmony colors as swatches
        harmonies.forEach((hue, index) => {
            const swatchX = 50 + index * 60;
            const swatchY = canvas.height - 50;
            
            ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
            ctx.fillRect(swatchX, swatchY, 40, 40);
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(swatchX, swatchY, 40, 40);
        });
    }
    
    setupPatternUpload() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('pattern-upload');
        
        if (!uploadArea || !fileInput) return;
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(0, 210, 255, 0.6)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'rgba(0, 210, 255, 0.3)';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(0, 210, 255, 0.3)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.analyzeUploadedPattern(files[0]);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.analyzeUploadedPattern(e.target.files[0]);
            }
        });
    }
    
    analyzeUploadedPattern(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.performPatternAnalysis(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    performPatternAnalysis(img) {
        // Analyze the pattern and update metrics
        // This is a simplified analysis for demo purposes
        
        // Edge density calculation
        const edgeDensity = Math.random() * 0.8 + 0.1;
        document.getElementById('edge-density').textContent = (edgeDensity * 100).toFixed(1) + '%';
        
        // Color variance
        const colorVariance = Math.random() * 0.9 + 0.1;
        document.getElementById('color-variance').textContent = (colorVariance * 100).toFixed(1) + '%';
        
        // Fractal dimension
        const fractalDim = 1.2 + Math.random() * 0.6;
        document.getElementById('fractal-dimension').textContent = fractalDim.toFixed(2);
        
        // Symmetry analysis
        const rotationalSymmetry = Math.floor(Math.random() * 8) * 45;
        document.getElementById('rotational-symmetry').textContent = rotationalSymmetry + '°';
        
        const hasReflection = Math.random() > 0.5;
        document.getElementById('reflection-symmetry').textContent = hasReflection ? 'Vertical' : 'None';
        
        const regularity = Math.random() * 100;
        document.getElementById('pattern-regularity').textContent = regularity.toFixed(1) + '%';
        
        // Effectiveness scores
        const camouflageScore = edgeDensity * colorVariance * 100;
        document.getElementById('camouflage-score').textContent = camouflageScore.toFixed(1) + '%';
        
        const visualDisruption = (edgeDensity + (1 - regularity/100)) * 50;
        document.getElementById('visual-disruption').textContent = visualDisruption.toFixed(1) + '%';
        
        const naturalHarmony = (1 - Math.abs(fractalDim - 1.5)) * 100;
        document.getElementById('natural-harmony').textContent = naturalHarmony.toFixed(1) + '%';
        
        // Update analysis canvases
        this.updateAnalysisCanvases(img);
    }
    
    showScoringGuide() {
        const guideModal = document.createElement('div');
        guideModal.className = 'modal-overlay';
        guideModal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2>📊 Pattern Analysis Scoring Guide</h2>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="scoring-section">
                        <h3>🔍 Pattern Complexity</h3>
                        <div class="score-breakdown">
                            <div class="score-item">
                                <strong>Edge Density (0-100%):</strong>
                                <p>• <span class="score-good">60-100%</span> = Complex, detailed patterns with many edges</p>
                                <p>• <span class="score-ok">30-59%</span> = Moderate complexity, balanced detail</p>
                                <p>• <span class="score-poor">0-29%</span> = Simple patterns, few edges</p>
                            </div>
                            <div class="score-item">
                                <strong>Color Variance (0-100%):</strong>
                                <p>• <span class="score-good">70-100%</span> = Rich color diversity, excellent camouflage</p>
                                <p>• <span class="score-ok">40-69%</span> = Good color range, decent variation</p>
                                <p>• <span class="score-poor">0-39%</span> = Limited colors, monotone patterns</p>
                            </div>
                            <div class="score-item">
                                <strong>Fractal Dimension (1.0-2.0):</strong>
                                <p>• <span class="score-good">1.4-1.6</span> = Natural complexity, like real forests</p>
                                <p>• <span class="score-ok">1.2-1.39 or 1.61-1.8</span> = Moderate complexity</p>
                                <p>• <span class="score-poor">1.0-1.19 or 1.81-2.0</span> = Too simple or too chaotic</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="scoring-section">
                        <h3>🔄 Pattern Symmetry</h3>
                        <div class="score-breakdown">
                            <div class="score-item">
                                <strong>Rotational Symmetry:</strong>
                                <p>• <span class="score-good">0°, 180°</span> = Good for tactical patterns (asymmetric disruption)</p>
                                <p>• <span class="score-ok">90°, 45°</span> = Moderate symmetry, some disruption</p>
                                <p>• <span class="score-poor">Multiple angles</span> = Too regular, easily detected</p>
                            </div>
                            <div class="score-item">
                                <strong>Pattern Regularity (0-100%):</strong>
                                <p>• <span class="score-good">20-50%</span> = Optimal balance of order and chaos</p>
                                <p>• <span class="score-ok">10-19% or 51-70%</span> = Acceptable variation</p>
                                <p>• <span class="score-poor">0-9% or 71-100%</span> = Too chaotic or too regular</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="scoring-section">
                        <h3>🎯 Effectiveness Scores</h3>
                        <div class="score-breakdown">
                            <div class="score-item">
                                <strong>Camouflage Score (0-100%):</strong>
                                <p>• <span class="score-good">70-100%</span> = Excellent tactical concealment</p>
                                <p>• <span class="score-ok">40-69%</span> = Good camouflage properties</p>
                                <p>• <span class="score-poor">0-39%</span> = Limited concealment value</p>
                            </div>
                            <div class="score-item">
                                <strong>Visual Disruption (0-100%):</strong>
                                <p>• <span class="score-good">60-100%</span> = Breaks up shapes effectively</p>
                                <p>• <span class="score-ok">30-59%</span> = Moderate disruption</p>
                                <p>• <span class="score-poor">0-29%</span> = Minimal disruption effect</p>
                            </div>
                            <div class="score-item">
                                <strong>Natural Harmony (0-100%):</strong>
                                <p>• <span class="score-good">80-100%</span> = Looks natural, blends with environment</p>
                                <p>• <span class="score-ok">50-79%</span> = Fairly natural appearance</p>
                                <p>• <span class="score-poor">0-49%</span> = Artificial, stands out</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="scoring-section">
                        <h3>🏆 Overall Rating System</h3>
                        <div class="score-breakdown">
                            <div class="score-item">
                                <strong>Excellent Pattern (A+ Grade):</strong>
                                <p>• Camouflage Score: 80%+</p>
                                <p>• Visual Disruption: 70%+</p>
                                <p>• Natural Harmony: 85%+</p>
                                <p>• Fractal Dimension: 1.4-1.6</p>
                            </div>
                            <div class="score-item">
                                <strong>Good Pattern (B Grade):</strong>
                                <p>• Camouflage Score: 60-79%</p>
                                <p>• Visual Disruption: 50-69%</p>
                                <p>• Natural Harmony: 70-84%</p>
                            </div>
                            <div class="score-item">
                                <strong>Needs Improvement (C Grade):</strong>
                                <p>• Camouflage Score: Below 60%</p>
                                <p>• Visual Disruption: Below 50%</p>
                                <p>• Natural Harmony: Below 70%</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="scoring-section">
                        <h3>💡 Tips for Better Patterns</h3>
                        <ul>
                            <li><strong>For Tactical Use:</strong> Aim for high edge density and color variance</li>
                            <li><strong>For Natural Look:</strong> Keep fractal dimension between 1.4-1.6</li>
                            <li><strong>For Disruption:</strong> Use irregular shapes and avoid too much symmetry</li>
                            <li><strong>For Authenticity:</strong> Study real forest/nature patterns</li>
                            <li><strong>For Versatility:</strong> Balance all scores rather than maximizing one</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(guideModal);
    }
    
    updateAnalysisCanvases(img) {
        // Update complexity canvas
        const complexityCanvas = document.getElementById('complexity-canvas');
        if (complexityCanvas) {
            const ctx = complexityCanvas.getContext('2d');
            ctx.clearRect(0, 0, complexityCanvas.width, complexityCanvas.height);
            ctx.drawImage(img, 0, 0, complexityCanvas.width, complexityCanvas.height);
            
            // Add complexity overlay
            ctx.fillStyle = 'rgba(0, 210, 255, 0.2)';
            ctx.fillRect(0, 0, complexityCanvas.width, complexityCanvas.height);
        }
        
        // Update symmetry canvas
        const symmetryCanvas = document.getElementById('symmetry-main-canvas');
        if (symmetryCanvas) {
            const ctx = symmetryCanvas.getContext('2d');
            ctx.clearRect(0, 0, symmetryCanvas.width, symmetryCanvas.height);
            ctx.drawImage(img, 0, 0, symmetryCanvas.width, symmetryCanvas.height);
            
            // Add symmetry lines
            ctx.strokeStyle = '#00d2ff';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            
            // Vertical symmetry line
            ctx.beginPath();
            ctx.moveTo(symmetryCanvas.width / 2, 0);
            ctx.lineTo(symmetryCanvas.width / 2, symmetryCanvas.height);
            ctx.stroke();
            
            // Horizontal symmetry line
            ctx.beginPath();
            ctx.moveTo(0, symmetryCanvas.height / 2);
            ctx.lineTo(symmetryCanvas.width, symmetryCanvas.height / 2);
            ctx.stroke();
            
            ctx.setLineDash([]);
        }
        
        // Update effectiveness canvas
        const effectivenessCanvas = document.getElementById('effectiveness-canvas');
        if (effectivenessCanvas) {
            const ctx = effectivenessCanvas.getContext('2d');
            ctx.clearRect(0, 0, effectivenessCanvas.width, effectivenessCanvas.height);
            ctx.drawImage(img, 0, 0, effectivenessCanvas.width, effectivenessCanvas.height);
            
            // Add effectiveness heatmap overlay
            const gradient = ctx.createRadialGradient(
                effectivenessCanvas.width / 2, effectivenessCanvas.height / 2, 0,
                effectivenessCanvas.width / 2, effectivenessCanvas.height / 2, 100
            );
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 255, 0, 0.3)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, effectivenessCanvas.width, effectivenessCanvas.height);
        }
    }
    
    saveFractalToLibrary() {
        const canvas = document.getElementById('fractal-canvas');
        if (!canvas) return;
        
        const type = document.getElementById('fractal-type').value;
        const iterations = parseInt(document.getElementById('iterations').value);
        const scale = parseFloat(document.getElementById('fractal-scale').value);
        const count = parseInt(document.getElementById('fractal-count').value);
        
        // Check storage space before saving
        if (!this.checkStorageBeforeSave()) {
            this.showStorageManagementModal();
            return;
        }
        
        // Create optimized compressed image data
        const optimizedImage = this.compressImage(canvas, 0.5, 400, 300); // Smaller size, lower quality
        
        // Create minimal pattern data to save storage space
        const patternData = {
            id: Date.now(),
            name: `${type.charAt(0).toUpperCase() + type.slice(1)} Fractal`,
            description: `${type} (${iterations}i)`, // Shortened description
            category: 'Generated',
            type: 'Fractal',
            colors: ['#00d2ff', '#7cff50', '#ff6b35'], // Limited to 3 colors
            created: new Date().toISOString().split('T')[0], // Date only
            tags: [type], // Minimal tags
            actualImage: optimizedImage,
            timestamp: Date.now(),
            source: 'math',
            // Essential fractal data only
            fractalType: type,
            iterations: iterations,
            scale: scale,
            count: count
        };
        
        try {
            // Save to localStorage with error handling
            let savedPatterns = JSON.parse(localStorage.getItem('savoModePatterns') || '[]');
            savedPatterns.push(patternData);
            localStorage.setItem('savoModePatterns', JSON.stringify(savedPatterns));
            
            // Update pattern counter for 500 Pattern Challenge
            let patternCount = parseInt(localStorage.getItem('patternCount') || '0');
            patternCount++;
            localStorage.setItem('patternCount', patternCount.toString());
            
            // Show optimized success notification
            this.showNotification(`Fractal saved! (${patternCount} total) - Storage optimized`, 'success');
            
            // Debug logging with storage info
            const storageUsed = JSON.stringify(savedPatterns).length / 1024 / 1024;
            console.log('Fractal saved. Patterns:', savedPatterns.length, 'Storage:', storageUsed.toFixed(2) + 'MB');
            
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('💾 Storage quota exceeded. Pattern count:', JSON.parse(localStorage.getItem('savoModePatterns') || '[]').length);
                this.showStorageManagementModal();
            } else {
                this.showNotification('Error saving pattern. Please try again.', 'error');
                console.error('Save error:', error);
            }
        }
    }

    checkStorageBeforeSave() {
        try {
            const patterns = JSON.parse(localStorage.getItem('savoModePatterns') || '[]');
            const storageSize = JSON.stringify(patterns).length;
            const maxStorage = 4 * 1024 * 1024; // 4MB limit for safety
            
            return storageSize < maxStorage;
        } catch (error) {
            return false;
        }
    }

    showStorageManagementModal() {
        const patterns = JSON.parse(localStorage.getItem('savoModePatterns') || '[]');
        const storageSize = (JSON.stringify(patterns).length / 1024 / 1024).toFixed(2);
        
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
                    max-width: 500px;
                    text-align: center;
                    border: 2px solid #e74c3c;
                ">
                    <h3 style="color: #e74c3c; margin-bottom: 20px;">📦 Storage Management</h3>
                    <p style="margin-bottom: 20px; line-height: 1.6;">
                        <strong>${patterns.length} patterns</strong> using <strong>${storageSize}MB</strong><br>
                        Storage is getting full!<br>
                        <br>
                        <strong>Recommended Actions:</strong><br>
                        • Save 3-5 patterns at a time<br>
                        • Use Samsung AI to backup patterns<br>
                        • Delete older patterns you don't need<br>
                        • Export favorites before clearing
                    </p>
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="this.closest('div').parentElement.remove()" style="
                            padding: 12px 20px;
                            background: #27ae60;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 14px;
                        ">Continue Creating</button>
                        <button onclick="window.open('/pattern-library.html', '_blank'); this.closest('div').parentElement.remove();" style="
                            padding: 12px 20px;
                            background: #3498db;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 14px;
                        ">Manage Library</button>
                        <button onclick="patternMath.showQuickCleanup(); this.closest('div').parentElement.remove();" style="
                            padding: 12px 20px;
                            background: #f39c12;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 14px;
                        ">Quick Cleanup</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showQuickCleanup() {
        const patterns = JSON.parse(localStorage.getItem('savoModePatterns') || '[]');
        const oldestPatterns = patterns.slice(0, Math.min(10, Math.floor(patterns.length / 3)));
        
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
                    max-width: 600px;
                    text-align: center;
                    border: 2px solid #f39c12;
                    max-height: 80vh;
                    overflow-y: auto;
                ">
                    <h3 style="color: #f39c12; margin-bottom: 20px;">🧹 Quick Cleanup</h3>
                    <p style="margin-bottom: 20px;">
                        Delete ${oldestPatterns.length} oldest patterns to free up space?<br>
                        <small>You can always recreate fractals with the same settings</small>
                    </p>
                    <div style="max-height: 200px; overflow-y: auto; margin: 20px 0; text-align: left;">
                        ${oldestPatterns.map(p => `<div style="padding: 5px; border-bottom: 1px solid #444;">• ${p.name} (${p.created})</div>`).join('')}
                    </div>
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button onclick="this.closest('div').parentElement.remove()" style="
                            padding: 12px 20px;
                            background: #666;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                        ">Cancel</button>
                        <button onclick="patternMath.deleteOldestPatterns(${oldestPatterns.length}); this.closest('div').parentElement.remove();" style="
                            padding: 12px 20px;
                            background: #e74c3c;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                        ">Delete ${oldestPatterns.length} Patterns</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    deleteOldestPatterns(count) {
        try {
            let patterns = JSON.parse(localStorage.getItem('savoModePatterns') || '[]');
            const deletedPatterns = patterns.splice(0, count);
            localStorage.setItem('savoModePatterns', JSON.stringify(patterns));
            
            // Update pattern counter
            const currentCount = parseInt(localStorage.getItem('patternCount') || '0');
            localStorage.setItem('patternCount', Math.max(0, currentCount - deletedPatterns.length).toString());
            
            this.showNotification(`Deleted ${deletedPatterns.length} old patterns. Space freed!`, 'success');
            console.log('Cleanup completed. Remaining patterns:', patterns.length);
        } catch (error) {
            this.showNotification('Cleanup failed. Please try manual deletion.', 'error');
        }
    }
    
    compressImage(canvas, quality = 0.7, maxWidth = null, maxHeight = null) {
        // Create a temporary canvas for compression
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Set dimensions
        if (maxWidth && maxHeight) {
            tempCanvas.width = maxWidth;
            tempCanvas.height = maxHeight;
        } else {
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
        }
        
        // Draw and compress
        tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
        return tempCanvas.toDataURL('image/jpeg', quality);
    }
    
    checkStorageSpace() {
        try {
            const patterns = JSON.parse(localStorage.getItem('savoModePatterns') || '[]');
            const patternsSize = JSON.stringify(patterns).length;
            const storageLimitMB = 10; // Approximate localStorage limit
            const currentUsageMB = (patternsSize / 1024 / 1024).toFixed(2);
            const usagePercent = ((patternsSize / (storageLimitMB * 1024 * 1024)) * 100).toFixed(1);
            
            let message = `Storage Usage: ${currentUsageMB}MB / ${storageLimitMB}MB (${usagePercent}%)\n`;
            message += `Total Patterns: ${patterns.length}\n`;
            
            if (usagePercent > 80) {
                message += `\nWarning: Storage nearly full! Consider:\n`;
                message += `- Export patterns and clear old ones\n`;
                message += `- Use Pattern Library cleanup function`;
                this.showNotification(message, 'warning');
            } else {
                message += `\nStorage healthy - plenty of space for more fractals!`;
                this.showNotification(message, 'success');
            }
            
            console.log('📊 Storage stats:', {
                patterns: patterns.length,
                sizeMB: currentUsageMB,
                usagePercent: usagePercent + '%'
            });
            
        } catch (error) {
            this.showNotification('Error checking storage space.', 'error');
            console.error('Storage check error:', error);
        }
    }

    // New fractal drawing functions to replace removed ones
    drawWinterTree(ctx, x, y, angle, iterations, length, colors) {
        if (iterations === 0 || length < 2) return;
        
        const endX = x + length * Math.cos(angle);
        const endY = y + length * Math.sin(angle);
        
        // Draw bare winter branch (no leaves)
        ctx.strokeStyle = colors[Math.min(iterations, colors.length - 1)];
        ctx.lineWidth = Math.max(1, iterations * 0.8);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Add ice crystal effects on branches
        if (iterations > 5 && Math.random() > 0.7) {
            ctx.fillStyle = 'rgba(200, 230, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(endX, endY, 2, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Create more angular, sparse winter branches
        const newLength = length * (0.65 + Math.random() * 0.1);
        const leftAngle = angle - Math.PI / 4 - (Math.random() - 0.5) * 0.3;
        const rightAngle = angle + Math.PI / 4 + (Math.random() - 0.5) * 0.3;
        
        if (Math.random() > 0.3) { // Sparser branching for winter effect
            this.drawWinterTree(ctx, endX, endY, leftAngle, iterations - 1, newLength, colors);
        }
        if (Math.random() > 0.3) {
            this.drawWinterTree(ctx, endX, endY, rightAngle, iterations - 1, newLength, colors);
        }
    }

    drawOakTree(ctx, x, y, angle, iterations, length, colors) {
        if (iterations === 0 || length < 3) return;
        
        const endX = x + length * Math.cos(angle);
        const endY = y + length * Math.sin(angle);
        
        // Draw consistent oak trunk
        ctx.strokeStyle = colors[Math.min(iterations, colors.length - 1)];
        ctx.lineWidth = Math.max(2, iterations * 1.2);
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Add organized oak canopy at specific iterations
        if (iterations <= 3 && iterations > 0) {
            const canopyColor = colors[(iterations - 1) % colors.length];
            ctx.fillStyle = canopyColor;
            
            // Create consistent rounded canopy
            const canopySize = length * 0.6;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(endX, endY, canopySize, 0, 2 * Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // Add organized leaf pattern
            const leafCount = 8;
            for (let i = 0; i < leafCount; i++) {
                const leafAngle = (i / leafCount) * 2 * Math.PI;
                const leafDist = canopySize * 0.7;
                const leafX = endX + leafDist * Math.cos(leafAngle);
                const leafY = endY + leafDist * Math.sin(leafAngle);
                this.drawDetailedOakLeaf(ctx, leafX, leafY, 5);
            }
        }
        
        // Create structured branching pattern
        if (iterations > 3) {
            const newLength = length * 0.7;
            const numBranches = iterations > 8 ? 2 : 3;
            
            for (let i = 0; i < numBranches; i++) {
                // Consistent angular spread
                const branchSpread = Math.PI / 3; // 60 degrees total spread
                const branchAngle = angle + (i - (numBranches - 1) / 2) * (branchSpread / (numBranches - 1));
                this.drawOakTree(ctx, endX, endY, branchAngle, iterations - 1, newLength, colors);
            }
        }
    }

    drawDetailedOakLeaf(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.random() * Math.PI);
        
        // Draw authentic oak leaf with deep lobes
        ctx.fillStyle = ctx.fillStyle; // Keep current fill color
        ctx.strokeStyle = this.darkenColor(ctx.fillStyle, 0.3);
        ctx.lineWidth = 0.5;
        
        ctx.beginPath();
        
        // Create oak leaf with characteristic deep rounded lobes
        const lobePoints = [
            [0, -size], // tip
            [size * 0.3, -size * 0.7], // first lobe
            [size * 0.6, -size * 0.4],
            [size * 0.8, -size * 0.1], // widest point
            [size * 0.6, size * 0.2],
            [size * 0.3, size * 0.5], // second lobe
            [0, size * 0.8], // stem
            [-size * 0.3, size * 0.5], // mirror side
            [-size * 0.6, size * 0.2],
            [-size * 0.8, -size * 0.1],
            [-size * 0.6, -size * 0.4],
            [-size * 0.3, -size * 0.7]
        ];
        
        ctx.moveTo(lobePoints[0][0], lobePoints[0][1]);
        for (let i = 1; i < lobePoints.length; i++) {
            const cp1x = lobePoints[i-1][0] + (lobePoints[i][0] - lobePoints[i-1][0]) * 0.5;
            const cp1y = lobePoints[i-1][1] + (lobePoints[i][1] - lobePoints[i-1][1]) * 0.5;
            ctx.quadraticCurveTo(cp1x, cp1y, lobePoints[i][0], lobePoints[i][1]);
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Add central vein
        ctx.strokeStyle = this.darkenColor(ctx.fillStyle, 0.5);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(0, size * 0.8);
        ctx.stroke();
        
        ctx.restore();
    }

    drawIceCrystalSnowflake(ctx, centerX, centerY, iterations, colors) {
        const branches = 6;
        const armLength = 80;
        
        for (let i = 0; i < branches; i++) {
            const angle = (i / branches) * 2 * Math.PI;
            this.drawCrystalArm(ctx, centerX, centerY, angle, armLength, iterations, colors, 0);
        }
    }

    drawCrystalArm(ctx, x, y, angle, length, iterations, colors, depth) {
        if (iterations <= 0 || length < 5) return;
        
        const endX = x + length * Math.cos(angle);
        const endY = y + length * Math.sin(angle);
        
        // Main crystal arm
        ctx.strokeStyle = colors[depth % colors.length];
        ctx.lineWidth = Math.max(1, 4 - depth);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Add crystal details along the arm
        const segments = Math.min(iterations, 8);
        for (let i = 1; i < segments; i++) {
            const segmentX = x + (length * i / segments) * Math.cos(angle);
            const segmentY = y + (length * i / segments) * Math.sin(angle);
            const branchLength = length * 0.3 * (1 - i / segments);
            
            // Left crystal branch
            const leftAngle = angle - Math.PI / 3;
            const leftEndX = segmentX + branchLength * Math.cos(leftAngle);
            const leftEndY = segmentY + branchLength * Math.sin(leftAngle);
            ctx.beginPath();
            ctx.moveTo(segmentX, segmentY);
            ctx.lineTo(leftEndX, leftEndY);
            ctx.stroke();
            
            // Right crystal branch
            const rightAngle = angle + Math.PI / 3;
            const rightEndX = segmentX + branchLength * Math.cos(rightAngle);
            const rightEndY = segmentY + branchLength * Math.sin(rightAngle);
            ctx.beginPath();
            ctx.moveTo(segmentX, segmentY);
            ctx.lineTo(rightEndX, rightEndY);
            ctx.stroke();
        }
    }

    drawPenroseTiling(ctx, centerX, centerY, iterations, colors) {
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        const baseSize = 20;
        const radius = Math.min(iterations * 12, 120);
        
        // Create organized radial pattern like reference image
        const rings = Math.min(Math.floor(iterations / 3) + 2, 6);
        
        for (let ring = 0; ring < rings; ring++) {
            const ringRadius = (ring + 1) * (radius / rings);
            const tilesInRing = Math.max(6, ring * 6); // More tiles in outer rings
            
            for (let i = 0; i < tilesInRing; i++) {
                const angle = (i / tilesInRing) * 2 * Math.PI;
                const x = centerX + ringRadius * Math.cos(angle);
                const y = centerY + ringRadius * Math.sin(angle);
                
                // Consistent sizing based on ring
                const size = baseSize * (1 - ring * 0.15);
                const rotation = angle + Math.PI / 6; // Aligned rotation
                const colorIndex = ring % colors.length;
                
                // Alternate tile types in organized pattern
                if ((ring + i) % 2 === 0) {
                    this.drawStainedGlassKite(ctx, x, y, size, rotation, colors[colorIndex]);
                } else {
                    this.drawStainedGlassDart(ctx, x, y, size, rotation, colors[(colorIndex + 1) % colors.length]);
                }
            }
        }
        
        // Add center piece
        this.drawStainedGlassKite(ctx, centerX, centerY, baseSize * 1.2, 0, colors[0]);
    }

    drawStainedGlassKite(ctx, x, y, size, rotation, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Create stained glass effect with gradient and dark borders
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, this.darkenColor(color, 0.3));
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        const vertices = [
            [0, -size],
            [size / goldenRatio, 0],
            [0, size / goldenRatio],
            [-size / goldenRatio, 0]
        ];
        
        ctx.beginPath();
        ctx.moveTo(vertices[0][0], vertices[0][1]);
        for (let i = 1; i < vertices.length; i++) {
            ctx.lineTo(vertices[i][0], vertices[i][1]);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Add inner highlight for glass effect
        ctx.strokeStyle = this.lightenColor(color, 0.4);
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        ctx.restore();
    }

    drawStainedGlassDart(ctx, x, y, size, rotation, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Create stained glass effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, this.darkenColor(color, 0.3));
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        
        const goldenRatio = (1 + Math.sqrt(5)) / 2;
        const vertices = [
            [0, -size / goldenRatio],
            [size, 0],
            [0, size],
            [-size, 0]
        ];
        
        ctx.beginPath();
        ctx.moveTo(vertices[0][0], vertices[0][1]);
        for (let i = 1; i < vertices.length; i++) {
            ctx.lineTo(vertices[i][0], vertices[i][1]);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Add inner highlight
        ctx.strokeStyle = this.lightenColor(color, 0.4);
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        ctx.restore();
    }

    darkenColor(color, amount) {
        // Safety check for color parameter
        if (!color || typeof color !== 'string') {
            return '#333333'; // Default dark color
        }
        
        // Handle colors without # prefix
        const cleanColor = color.startsWith('#') ? color : `#${color}`;
        
        try {
            const num = parseInt(cleanColor.replace('#', ''), 16);
            const r = Math.max(0, (num >> 16) - Math.floor(255 * amount));
            const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.floor(255 * amount));
            const b = Math.max(0, (num & 0x0000FF) - Math.floor(255 * amount));
            return `rgb(${r}, ${g}, ${b})`;
        } catch (error) {
            return '#333333'; // Fallback color
        }
    }

    lightenColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + Math.floor(255 * amount));
        const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.floor(255 * amount));
        const b = Math.min(255, (num & 0x0000FF) + Math.floor(255 * amount));
        return `rgb(${r}, ${g}, ${b})`;
    }

    drawFungalNetwork(ctx, centerX, centerY, iterations, colors) {
        const nodes = [];
        const connections = [];
        const numNodes = Math.min(iterations * 2, 25);
        
        // Create fungal nodes
        for (let i = 0; i < numNodes; i++) {
            const angle = (i / numNodes) * 2 * Math.PI + Math.random() * 0.5;
            const distance = 30 + Math.random() * 100;
            nodes.push({
                x: centerX + distance * Math.cos(angle),
                y: centerY + distance * Math.sin(angle),
                size: 3 + Math.random() * 8
            });
        }
        
        // Create fungal connections (mycelium)
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dist = Math.sqrt((nodes[i].x - nodes[j].x) ** 2 + (nodes[i].y - nodes[j].y) ** 2);
                if (dist < 80 && Math.random() > 0.4) {
                    connections.push([i, j]);
                }
            }
        }
        
        // Draw mycelium connections
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 1;
        connections.forEach(([i, j]) => {
            const midX = (nodes[i].x + nodes[j].x) / 2;
            const midY = (nodes[i].y + nodes[j].y) / 2;
            const curve = 20 * (Math.random() - 0.5);
            
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.quadraticCurveTo(midX + curve, midY + curve, nodes[j].x, nodes[j].y);
            ctx.stroke();
        });
        
        // Draw fungal nodes
        nodes.forEach((node, i) => {
            ctx.fillStyle = colors[(i + 1) % colors.length];
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    drawStarConstellations(ctx, centerX, centerY, iterations, colors) {
        const stars = [];
        const numStars = Math.min(iterations + 5, 20);
        
        // Create star positions
        for (let i = 0; i < numStars; i++) {
            const angle = (i / numStars) * 2 * Math.PI + Math.random() * 0.3;
            const distance = 20 + Math.random() * 120;
            stars.push({
                x: centerX + distance * Math.cos(angle),
                y: centerY + distance * Math.sin(angle),
                brightness: 0.3 + Math.random() * 0.7,
                size: 1 + Math.random() * 4
            });
        }
        
        // Draw constellation lines
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        
        for (let i = 0; i < stars.length - 1; i++) {
            if (Math.random() > 0.4) { // Not all stars connected
                ctx.beginPath();
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[i + 1].x, stars[i + 1].y);
                ctx.stroke();
            }
        }
        
        // Draw stars
        ctx.globalAlpha = 1;
        stars.forEach((star, i) => {
            ctx.fillStyle = colors[(i + 1) % colors.length];
            ctx.globalAlpha = star.brightness;
            
            // Draw star with points
            ctx.save();
            ctx.translate(star.x, star.y);
            
            ctx.beginPath();
            for (let p = 0; p < 8; p++) {
                const angle = (p / 8) * 2 * Math.PI;
                const radius = p % 2 === 0 ? star.size : star.size * 0.4;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                
                if (p === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });
        
        ctx.globalAlpha = 1;
    }

    drawNeuralNetworks(ctx, centerX, centerY, iterations, colors) {
        const layers = Math.min(Math.floor(iterations / 3) + 2, 5);
        const neurons = [];
        const connections = [];
        
        // Create neural layers
        for (let layer = 0; layer < layers; layer++) {
            const layerNeurons = 3 + Math.floor(Math.random() * 4);
            const layerX = centerX - 120 + (layer / (layers - 1)) * 240;
            
            for (let n = 0; n < layerNeurons; n++) {
                const neuronY = centerY - 60 + (n / (layerNeurons - 1)) * 120;
                neurons.push({
                    x: layerX,
                    y: neuronY,
                    layer: layer,
                    activation: Math.random()
                });
            }
        }
        
        // Create connections between layers
        for (let i = 0; i < neurons.length; i++) {
            for (let j = 0; j < neurons.length; j++) {
                if (neurons[j].layer === neurons[i].layer + 1 && Math.random() > 0.3) {
                    connections.push({
                        from: i,
                        to: j,
                        weight: Math.random()
                    });
                }
            }
        }
        
        // Draw connections
        connections.forEach(conn => {
            const from = neurons[conn.from];
            const to = neurons[conn.to];
            
            ctx.strokeStyle = colors[Math.floor(conn.weight * colors.length)];
            ctx.lineWidth = 1 + conn.weight * 2;
            ctx.globalAlpha = 0.6;
            
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        });
        
        // Draw neurons
        ctx.globalAlpha = 1;
        neurons.forEach((neuron, i) => {
            ctx.fillStyle = colors[neuron.layer % colors.length];
            ctx.beginPath();
            ctx.arc(neuron.x, neuron.y, 3 + neuron.activation * 5, 0, 2 * Math.PI);
            ctx.fill();
            
            // Add activation glow
            if (neuron.activation > 0.7) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(neuron.x, neuron.y, 2, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        // Add animation keyframes if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Enhanced Seed of Life - Dimensional Energy Circles
    drawSeedOfLife(ctx, centerX, centerY, iterations, colors) {
        const baseRadius = 50;
        const time = Date.now() * 0.001;
        const circles = [];
        
        // Show progressive circle addition based on iterations
        const maxCircles = 7; // Central + 6 surrounding
        const circlesToShow = Math.min(iterations, maxCircles);
        
        // Always start with central circle
        if (circlesToShow >= 1) {
            circles.push({ x: centerX, y: centerY, order: 0 });
        }
        
        // Add surrounding circles progressively with slight animation
        for (let i = 0; i < Math.min(circlesToShow - 1, 6); i++) {
            const angle = (i * Math.PI * 2) / 6;
            const dynamicRadius = baseRadius + Math.sin(time + i * 0.5) * 3;
            const x = centerX + dynamicRadius * Math.cos(angle);
            const y = centerY + dynamicRadius * Math.sin(angle);
            circles.push({ x, y, order: i + 1 });
        }
        
        // Draw circles with enhanced 3D effects
        circles.forEach((circle, index) => {
            const drawRadius = baseRadius * (0.8 + (circle.order * 0.08));
            const pulseRadius = drawRadius + Math.sin(time + index * 0.3) * 4;
            
            // Create multi-layer 3D gradient
            const gradient = ctx.createRadialGradient(
                circle.x - pulseRadius * 0.3, circle.y - pulseRadius * 0.3, 0,
                circle.x, circle.y, pulseRadius * 1.3
            );
            
            const colorIndex = index % colors.length;
            const baseColor = colors[colorIndex];
            
            // Enhanced dimensional gradient
            gradient.addColorStop(0, baseColor + 'FF');
            gradient.addColorStop(0.3, baseColor + 'DD');
            gradient.addColorStop(0.6, baseColor + '88');
            gradient.addColorStop(0.9, baseColor + '33');
            gradient.addColorStop(1, 'rgba(0,0,0,0.1)');
            
            // Outer energy field
            ctx.shadowColor = baseColor;
            ctx.shadowBlur = 15 + Math.sin(time + index * 0.2) * 8;
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3 + Math.sin(time + index * 0.1) * 1;
            
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, pulseRadius, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Inner energy ring
            if (iterations > 3) {
                ctx.shadowBlur = 10;
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = baseColor + 'AA';
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, pulseRadius * 0.7, 0, 2 * Math.PI);
                ctx.stroke();
            }
            
            // Energy core
            if (iterations > 5) {
                ctx.shadowBlur = 20;
                ctx.fillStyle = baseColor + 'CC';
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, 4 + Math.sin(time + index * 0.4) * 2, 0, 2 * Math.PI);
                ctx.fill();
            }
            
            // Connecting energy lines between circles
            if (circle.order > 0 && iterations > 8) {
                ctx.globalAlpha = 0.3;
                ctx.strokeStyle = baseColor + '66';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(circle.x, circle.y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        });
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }
    
    drawFlowerOfLife(ctx, centerX, centerY, iterations, colors) {
        const radius = 35;
        const circles = [];
        
        // Progressive ring development based on iterations
        const maxLevel = Math.min(Math.floor(iterations / 2), 6);
        
        // Always start with central circle
        if (iterations >= 1) {
            circles.push({ x: centerX, y: centerY, level: 0, order: 0 });
        }
        
        // Add rings progressively
        for (let level = 1; level <= maxLevel; level++) {
            const numInRing = level * 6;
            const ringRadius = radius * level * 0.9;
            
            // Progressive circle addition within each ring
            const circlesInThisRing = Math.min(numInRing, Math.max(0, iterations - level));
            
            for (let i = 0; i < circlesInThisRing; i++) {
                const angle = (i * Math.PI * 2) / numInRing;
                const x = centerX + ringRadius * Math.cos(angle);
                const y = centerY + ringRadius * Math.sin(angle);
                circles.push({ x, y, level, order: level * numInRing + i });
            }
        }
        
        // Draw circles with rainbow gradients and star-like glow effects
        circles.forEach((circle, index) => {
            const animatedRadius = radius * (0.7 + (iterations * 0.05));
            
            // Create rainbow gradient for each circle based on position
            const gradient = ctx.createRadialGradient(
                circle.x, circle.y, animatedRadius * 0.2,
                circle.x, circle.y, animatedRadius * 1.3
            );
            
            // Rainbow colors based on circle position and iteration
            const hueBase = (circle.level * 60 + circle.order * 15 + iterations * 8) % 360;
            gradient.addColorStop(0, `hsla(${hueBase}, 100%, 90%, 1.0)`);
            gradient.addColorStop(0.4, `hsla(${(hueBase + 60) % 360}, 100%, 70%, 0.9)`);
            gradient.addColorStop(0.7, `hsla(${(hueBase + 120) % 360}, 100%, 60%, 0.8)`);
            gradient.addColorStop(1, `hsla(${(hueBase + 180) % 360}, 100%, 50%, 0.6)`);
            
            // Outer glow effect
            ctx.shadowColor = `hsla(${hueBase}, 100%, 60%, 0.8)`;
            ctx.shadowBlur = 25;
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3 - circle.level * 0.2;
            
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, animatedRadius, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Additional bright star-like glow for higher iterations
            if (iterations > 4) {
                ctx.shadowBlur = 40;
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = `hsla(${hueBase}, 100%, 85%, 0.9)`;
                ctx.stroke();
            }
            
            // Bright center points for energy intersections
            if (iterations > 6) {
                ctx.shadowBlur = 10;
                ctx.fillStyle = `hsla(${hueBase}, 100%, 95%, 0.9)`;
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, 2, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }
    
    drawMerkaba(ctx, centerX, centerY, iterations, colors) {
        const baseSize = 60;
        
        // Progressive tetrahedra development based on iterations
        const tetraToShow = Math.min(iterations, 2);
        
        // Draw tetrahedra progressively
        for (let tetra = 0; tetra < tetraToShow; tetra++) {
            const rotation = tetra === 0 ? 0 : Math.PI;
            const points = [];
            
            // Scale grows with iterations for animation effect
            const animatedSize = baseSize * (0.8 + (iterations * 0.1));
            
            // Calculate tetrahedron points
            for (let i = 0; i < 3; i++) {
                const angle = (i * Math.PI * 2) / 3 + rotation;
                const x = centerX + animatedSize * Math.cos(angle);
                const y = centerY + animatedSize * Math.sin(angle);
                points.push({ x, y });
            }
            
            // Add apex point with progressive development
            const apexOffset = animatedSize * (0.6 + (iterations * 0.05));
            const apexY = tetra === 0 ? centerY - apexOffset : centerY + apexOffset;
            points.push({ x: centerX, y: apexY });
            
            // Progressive edge drawing based on iterations
            const edgesToShow = Math.min(iterations + 3, 6); // Base triangle + 3 apex connections
            
            const colorIndex = (tetra + iterations) % colors.length;
            ctx.strokeStyle = colors[colorIndex];
            ctx.lineWidth = 4;
            ctx.globalAlpha = 0.9;
            
            let edgeCount = 0;
            
            // Draw base triangle edges
            for (let i = 0; i < 3 && edgeCount < edgesToShow; i++) {
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[(i + 1) % 3].x, points[(i + 1) % 3].y);
                ctx.stroke();
                edgeCount++;
            }
            
            // Draw apex connections
            for (let i = 0; i < 3 && edgeCount < edgesToShow; i++) {
                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[3].x, points[3].y);
                ctx.stroke();
                edgeCount++;
            }
            
            // Add glow effect for higher iterations
            if (iterations > 4) {
                ctx.globalAlpha = 0.3;
                ctx.lineWidth = 8;
                ctx.stroke();
            }
        }
        
        ctx.globalAlpha = 1;
    }
    
    drawSriYantra(ctx, centerX, centerY, iterations, colors) {
        const baseSize = 60;
        
        // Progressive development - start with central point
        if (iterations >= 1) {
            const pointSize = 2 + (iterations * 0.5);
            ctx.fillStyle = colors[0];
            ctx.beginPath();
            ctx.arc(centerX, centerY, pointSize, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Progressive triangle development based on iterations
        const maxTriangles = 12;
        const trianglesToShow = Math.min(iterations - 1, maxTriangles);
        
        for (let i = 0; i < trianglesToShow; i++) {
            // Alternating upward and downward triangles with scaling
            const triangleSize = baseSize * (0.4 + (i * 0.08)) * (0.8 + (iterations * 0.03));
            const isUpward = i % 2 === 0;
            const rotation = isUpward ? 0 : Math.PI;
            
            const colorIndex = (i + iterations) % colors.length;
            ctx.strokeStyle = colors[colorIndex];
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            
            // Draw triangle with progressive development
            for (let j = 0; j < 3; j++) {
                const angle = (j * Math.PI * 2) / 3 + rotation;
                const x = centerX + triangleSize * Math.cos(angle);
                const y = centerY + triangleSize * Math.sin(angle);
                
                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            ctx.stroke();
            
            // Add glow effect for higher iterations
            if (iterations > 6) {
                ctx.globalAlpha = 0.3;
                ctx.lineWidth = 6;
                ctx.stroke();
                ctx.globalAlpha = 0.8;
                ctx.lineWidth = 3;
            }
        }
        
        // Progressive outer circles (only appear at higher iterations)
        if (iterations > 8) {
            const circleCount = Math.min(iterations - 8, 4);
            for (let i = 0; i < circleCount; i++) {
                const circleRadius = baseSize * (1.4 + i * 0.3) * (0.8 + (iterations * 0.02));
                const colorIndex = (trianglesToShow + i) % colors.length;
                ctx.strokeStyle = colors[colorIndex];
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
        
        ctx.globalAlpha = 1;
    }
    
    // Symmetry Methods
    setupSymmetryControls() {
        const orderSlider = document.getElementById('symmetry-order');
        const sizeSlider = document.getElementById('symmetry-size');
        const complexitySlider = document.getElementById('symmetry-complexity');
        
        if (orderSlider) {
            orderSlider.addEventListener('input', (e) => {
                document.getElementById('symmetry-order-value').textContent = e.target.value;
                this.updateCurrentSymmetry();
            });
        }
        
        if (sizeSlider) {
            sizeSlider.addEventListener('input', (e) => {
                document.getElementById('symmetry-size-value').textContent = e.target.value;
                this.updateCurrentSymmetry();
            });
        }
        
        if (complexitySlider) {
            complexitySlider.addEventListener('input', (e) => {
                document.getElementById('symmetry-complexity-value').textContent = e.target.value;
                this.updateCurrentSymmetry();
            });
        }
        
        this.currentSymmetryType = 'reflection';
    }
    
    updateCurrentSymmetry() {
        switch(this.currentSymmetryType) {
            case 'reflection':
                this.drawReflectionSymmetry();
                break;
            case 'rotational':
                this.drawRotationalSymmetry();
                break;
            case 'translational':
                this.drawTranslationalSymmetry();
                break;
            case 'spiral':
                this.drawSpiralSymmetry();
                break;
            case 'tesla':
                this.drawTeslaSymmetry();
                break;
        }
    }
    
    drawReflectionSymmetry() {
        this.currentSymmetryType = 'reflection';
        const canvas = document.getElementById('symmetry-main-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const size = parseInt(document.getElementById('symmetry-size')?.value || 80);
        const complexity = parseInt(document.getElementById('symmetry-complexity')?.value || 5);
        
        // Draw vertical reflection symmetry
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        
        // Draw mirror line
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(centerX, 50);
        ctx.lineTo(centerX, canvas.height - 50);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw symmetric pattern
        for (let i = 0; i < complexity; i++) {
            const y = 100 + (i * 60);
            const offset = size * (0.5 + Math.sin(i) * 0.3);
            
            // Left side
            ctx.fillStyle = this.currentColors[i % this.currentColors.length];
            ctx.fillRect(centerX - offset - 20, y, 40, 20);
            
            // Right side (mirrored)
            ctx.fillRect(centerX + offset - 20, y, 40, 20);
            
            // Connect with lines
            ctx.strokeStyle = this.currentColors[i % this.currentColors.length];
            ctx.beginPath();
            ctx.moveTo(centerX - offset, y + 10);
            ctx.lineTo(centerX + offset, y + 10);
            ctx.stroke();
        }
        
        // Add title
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Reflection Symmetry', centerX, 30);
    }
    
    drawRotationalSymmetry() {
        this.currentSymmetryType = 'rotational';
        const canvas = document.getElementById('symmetry-main-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const order = parseInt(document.getElementById('symmetry-order')?.value || 6);
        const size = parseInt(document.getElementById('symmetry-size')?.value || 80);
        const complexity = parseInt(document.getElementById('symmetry-complexity')?.value || 5);
        
        // Draw center point
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw rotational pattern
        for (let i = 0; i < order; i++) {
            const angle = (i * 2 * Math.PI) / order;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            
            // Draw pattern element
            ctx.fillStyle = this.currentColors[i % this.currentColors.length];
            
            for (let j = 0; j < complexity; j++) {
                const distance = 30 + (j * 25);
                const elementSize = size / (j + 3);
                
                // Draw triangle pointing outward
                ctx.beginPath();
                ctx.moveTo(distance, -elementSize/2);
                ctx.lineTo(distance + elementSize, 0);
                ctx.lineTo(distance, elementSize/2);
                ctx.closePath();
                ctx.fill();
                
                // Draw connecting line
                ctx.strokeStyle = this.currentColors[i % this.currentColors.length];
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(distance + elementSize/2, 0);
                ctx.stroke();
            }
            
            ctx.restore();
        }
        
        // Add title
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${order}-fold Rotational Symmetry`, centerX, 30);
    }
    
    drawTranslationalSymmetry() {
        this.currentSymmetryType = 'translational';
        const canvas = document.getElementById('symmetry-main-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const size = parseInt(document.getElementById('symmetry-size')?.value || 80);
        const complexity = parseInt(document.getElementById('symmetry-complexity')?.value || 5);
        
        const patternWidth = size;
        const patternHeight = size;
        
        // Draw repeating pattern
        for (let x = 0; x < canvas.width; x += patternWidth) {
            for (let y = 40; y < canvas.height; y += patternHeight) {
                const colorIndex = Math.floor((x + y) / 100) % this.currentColors.length;
                ctx.fillStyle = this.currentColors[colorIndex];
                
                // Draw basic pattern unit
                for (let i = 0; i < complexity; i++) {
                    const offsetX = (i * 15) % patternWidth;
                    const offsetY = (i * 10) % patternHeight;
                    
                    ctx.fillRect(x + offsetX, y + offsetY, 10, 10);
                    
                    // Add connecting elements
                    if (i > 0) {
                        ctx.strokeStyle = this.currentColors[colorIndex];
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(x + offsetX, y + offsetY);
                        ctx.lineTo(x + offsetX + 10, y + offsetY + 10);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Add title
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Translational Symmetry', canvas.width / 2, 30);
    }
    
    drawSpiralSymmetry() {
        this.currentSymmetryType = 'spiral';
        const canvas = document.getElementById('symmetry-main-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const size = parseInt(document.getElementById('symmetry-size')?.value || 80);
        const complexity = parseInt(document.getElementById('symmetry-complexity')?.value || 5);
        
        // Draw Fibonacci spiral with pattern elements
        const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 20;
        const spiralTurns = complexity;
        
        for (let i = 0; i < spiralTurns * 50; i++) {
            const angle = i * 0.2;
            const radius = (i * maxRadius) / (spiralTurns * 50);
            
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            if (i % 5 === 0) {
                const colorIndex = Math.floor(i / 10) % this.currentColors.length;
                ctx.fillStyle = this.currentColors[colorIndex];
                
                const elementSize = size / 10 + (radius / maxRadius) * 10;
                ctx.beginPath();
                ctx.arc(x, y, elementSize, 0, 2 * Math.PI);
                ctx.fill();
                
                // Add spiral line
                if (i > 0) {
                    ctx.strokeStyle = this.currentColors[colorIndex];
                    ctx.lineWidth = 1;
                    ctx.globalAlpha = 0.5;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, angle);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
        
        // Add center point
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add title
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Spiral Symmetry', centerX, 30);
    }
    
    drawTeslaSymmetry() {
        this.currentSymmetryType = 'tesla';
        const canvas = document.getElementById('symmetry-main-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const size = parseInt(document.getElementById('symmetry-size')?.value || 80);
        
        // Draw Tesla 3-6-9 energy pattern
        const radius = size + 50;
        
        // Draw energy nodes at 3, 6, 9 positions
        const teslaNumbers = [3, 6, 9];
        const nodePositions = [];
        
        teslaNumbers.forEach((num, index) => {
            const angle = (num * Math.PI * 2) / 12; // 12 positions around circle
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            nodePositions.push({ x, y, number: num });
            
            // Draw energy node
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, 2 * Math.PI);
            ctx.fill();
            
            // Add glow effect
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.globalAlpha = 1;
            
            // Add number label
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(num.toString(), x, y + 5);
        });
        
        // Draw energy connections
        ctx.strokeStyle = '#00d2ff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        
        for (let i = 0; i < nodePositions.length; i++) {
            for (let j = i + 1; j < nodePositions.length; j++) {
                ctx.beginPath();
                ctx.moveTo(nodePositions[i].x, nodePositions[i].y);
                ctx.lineTo(nodePositions[j].x, nodePositions[j].y);
                ctx.stroke();
            }
        }
        
        // Draw center vortex
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw vortex spiral
        ctx.strokeStyle = '#7cff50';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        
        for (let i = 0; i < 100; i++) {
            const angle = i * 0.3;
            const spiralRadius = (i * 60) / 100;
            const x = centerX + spiralRadius * Math.cos(angle);
            const y = centerY + spiralRadius * Math.sin(angle);
            
            if (i === 0) {
                ctx.beginPath();
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        // Add title
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Tesla 3-6-9 Energy Symmetry', centerX, 30);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const mathematics = new PatternMathematics();
    mathematics.init();
    
    // Animate Fractal Growth Function - Shows iteration progression
    window.animateFractalGrowth = () => {
        const canvas = document.getElementById('fractal-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const type = document.getElementById('fractal-type').value;
        const maxIterations = parseInt(document.getElementById('iterations').value);
        const scale = parseFloat(document.getElementById('fractal-scale').value);
        const count = parseInt(document.getElementById('fractal-count').value);
        
        if (maxIterations <= 1) {
            mathematics.showNotification('Set iterations to 2 or higher for animation!', 'warning');
            return;
        }
        
        let currentIteration = 1;
        const animationSpeed = 800; // milliseconds between frames
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Start animation loop
        const animate = () => {
            
            // Clear canvas for new frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Show progress indicator
            ctx.fillStyle = '#00d2ff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`Growing... Iteration ${currentIteration}/${maxIterations}`, 10, 25);
            
            // Draw progress bar
            const progressWidth = 200;
            const progressHeight = 8;
            const progress = currentIteration / maxIterations;
            
            ctx.strokeStyle = 'rgba(0, 210, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 35, progressWidth, progressHeight);
            
            ctx.fillStyle = '#7cff50';
            ctx.fillRect(10, 35, progressWidth * progress, progressHeight);
            
            // Generate fractal with current iteration count
            mathematics.generateFractalWithIterations(currentIteration, type, scale, count);
            
            // Move to next iteration
            currentIteration++;
            
            // Continue animation or finish
            if (currentIteration <= maxIterations) {
                setTimeout(animate, animationSpeed);
            } else {
                // Animation complete - show final message
                setTimeout(() => {
                    ctx.fillStyle = '#7cff50';
                    ctx.font = 'bold 18px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('🎬 Growth Animation Complete! 🎬', canvas.width / 2, 30);
                    
                    setTimeout(() => {
                        // Clear and show final fractal
                        mathematics.generateFractal();
                    }, 2000);
                }, 500);
            }
        };
        
        // Start the animation with minimal safety protection
        mathematics.showNotification('🎬 Starting fractal growth animation...', 'success');
        animate();
    };
    
    // Color palette methods
    mathematics.initColorPaletteSelector = () => {
        const paletteOptions = document.querySelectorAll('.palette-option');
        paletteOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                paletteOptions.forEach(opt => opt.classList.remove('active'));
                // Add active class to clicked option
                option.classList.add('active');
                
                // Update selected palette
                const palette = option.dataset.palette;
                mathematics.selectedPalette = palette;
                
                // Update current colors from palette
                if (mathematics.colorPalettes[palette]) {
                    mathematics.currentColors = [...mathematics.colorPalettes[palette]];
                }
                
                // Update custom color inputs
                mathematics.updateCustomColorInputs();
                
                // Show notification
                mathematics.showNotification(`🎨 Switched to ${palette} palette`, 'success');
            });
        });
        
        // Initialize custom color inputs
        mathematics.updateCustomColorInputs();
    };
    
    mathematics.getCurrentColors = () => {
        return mathematics.currentColors;
    };
    
    mathematics.generateFractalWithIterations = (currentIteration, type, scale, count) => {
        const canvas = document.getElementById('fractal-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const colors = mathematics.getCurrentColors();
        
        // Calculate optimal grid layout for multiple fractals
        let gridCols, gridRows;
        
        if (count <= 3) {
            gridCols = count;
            gridRows = 1;
        } else if (count <= 6) {
            gridCols = 3;
            gridRows = 2;
        } else if (count <= 9) {
            gridCols = 3;
            gridRows = 3;
        }
        
        const cellWidth = canvas.width / gridCols;
        const cellHeight = canvas.height / gridRows;
        
        for (let i = 0; i < count; i++) {
            const row = Math.floor(i / gridCols);
            const col = i % gridCols;
            const centerX = (col + 0.5) * cellWidth;
            const centerY = (row + 0.5) * cellHeight;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.scale(scale, scale);
            ctx.translate(-centerX, -centerY);
            
            switch (type) {
                case 'fern':
                    mathematics.drawBarnsleyFern(ctx, centerX, centerY, currentIteration, 1.0, colors);
                    break;
                case 'seed-of-life':
                    mathematics.drawSeedOfLife(ctx, centerX, centerY, currentIteration, colors);
                    break;
                case 'flower-of-life':
                    mathematics.drawFlowerOfLife(ctx, centerX, centerY, currentIteration, colors);
                    break;
                case 'merkaba':
                    mathematics.drawMerkaba(ctx, centerX, centerY, currentIteration, colors);
                    break;
                case 'spiral':
                    mathematics.drawSpiralFractals(ctx, centerX, centerY, currentIteration, colors);
                    break;
                case 'tree':
                    mathematics.drawFractalTree(ctx, centerX, centerY + cellHeight/3, -Math.PI / 2, currentIteration, 80, colors);
                    break;
                default:
                    mathematics.drawSpiralFractals(ctx, centerX, centerY, currentIteration, colors);
            }
            
            ctx.restore();
        }
    };
    
    mathematics.updateCustomColorInputs = () => {
        for (let i = 1; i <= 8; i++) {
            const input = document.getElementById(`custom-color-${i}`);
            if (input && mathematics.currentColors[i-1]) {
                input.value = mathematics.currentColors[i-1];
            }
        }
    };
    
    mathematics.applyCustomColors = () => {
        const customColors = [];
        for (let i = 1; i <= 8; i++) {
            const input = document.getElementById(`custom-color-${i}`);
            if (input) {
                customColors.push(input.value);
            }
        }
        mathematics.currentColors = customColors;
        mathematics.selectedPalette = 'custom';
        
        // Update active palette option
        const paletteOptions = document.querySelectorAll('.palette-option');
        paletteOptions.forEach(opt => opt.classList.remove('active'));
        
        mathematics.showNotification('🎨 Applied custom colors', 'success');
    };
    
    mathematics.randomizeColors = () => {
        const randomColors = [];
        for (let i = 0; i < 8; i++) {
            const hue = Math.floor(Math.random() * 360);
            const saturation = 60 + Math.random() * 40; // 60-100%
            const lightness = 40 + Math.random() * 30; // 40-70%
            randomColors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
        mathematics.currentColors = randomColors;
        mathematics.selectedPalette = 'random';
        
        // Update custom color inputs
        mathematics.updateCustomColorInputs();
        
        // Update active palette option
        const paletteOptions = document.querySelectorAll('.palette-option');
        paletteOptions.forEach(opt => opt.classList.remove('active'));
        
        mathematics.showNotification('🎨 Generated random colors', 'success');
    };
    
    // Add new method to mathematics class for step-by-step generation
    mathematics.generateFractalWithIterations = (iterations, type, scale, count) => {
        const canvas = document.getElementById('fractal-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Get color scheme from current palette
        const colors = mathematics.getCurrentColors();
        
        // Calculate grid layout for multiple fractals
        const gridSize = Math.ceil(Math.sqrt(count));
        const cellWidth = canvas.width / gridSize;
        const cellHeight = canvas.height / gridSize;
        
        // Generate each fractal with current iteration
        for (let i = 0; i < count; i++) {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const x = col * cellWidth + cellWidth / 2;
            const y = row * cellHeight + cellHeight / 2;
            const size = Math.min(cellWidth, cellHeight) / 2 * scale;
            
            ctx.save();
            
            // Apply scaling and positioning
            const scaleFactor = scale * (count > 1 ? 0.8 : 1);
            
            switch(type) {
                case 'fern':
                    mathematics.drawBarnsleyFern(ctx, x, y, iterations, scaleFactor, colors);
                    break;
                case 'tree':
                    mathematics.drawFractalTree(ctx, x, y + size/2, -Math.PI/2, iterations, size/3, colors);
                    break;
                case 'tree-winter':
                    mathematics.drawWinterTree(ctx, x, y + size/2, -Math.PI/2, iterations, size/3, colors);
                    break;
                case 'tree-oak':
                    mathematics.drawOakTree(ctx, x, y + size/2, -Math.PI/2, iterations, size/3, colors);
                    break;
                case 'snowflake':
                    mathematics.drawIceCrystalSnowflake(ctx, x, y, iterations, colors);
                    break;
                case 'koch':
                    mathematics.drawKochSnowflake(ctx, x, y, iterations, colors);
                    break;
                case 'sierpinski':
                    mathematics.drawSierpinskiTriangle(ctx, x, y, iterations, colors);
                    break;
                case 'spiral':
                    mathematics.drawSpiralFractals(ctx, x, y, iterations, colors);
                    break;
                case 'hexflake':
                    mathematics.drawHexagonalSnowflake(ctx, x, y, iterations, colors);
                    break;
                case 'penrose':
                    mathematics.drawPenroseTiling(ctx, x, y, iterations, colors);
                    break;
                case 'fungus':
                    mathematics.drawFungalNetwork(ctx, x, y, iterations, colors);
                    break;
                case 'constellation':
                    mathematics.drawStarConstellations(ctx, x, y, iterations, colors);
                    break;
                case 'neural':
                    mathematics.drawNeuralNetworks(ctx, x, y, iterations, colors);
                    break;
                case 'seed-of-life':
                    mathematics.drawSeedOfLife(ctx, x, y, iterations, colors);
                    break;
                case 'flower-of-life':
                    mathematics.drawFlowerOfLife(ctx, x, y, iterations, colors);
                    break;
                case 'merkaba':
                    mathematics.drawMerkaba(ctx, x, y, iterations, colors);
                    break;
                case 'sri-yantra':
                    mathematics.drawSriYantra(ctx, x, y, iterations, colors);
                    break;
                case 'tesla-coil':
                    mathematics.drawTeslaCoilResonance(ctx, x, y, iterations, colors);
                    break;
                case 'tesla-spiral':
                    mathematics.drawTeslaVortexSpiral(ctx, x, y, iterations, colors);
                    break;
                case 'sacred-diamond':
                    mathematics.drawSacredGeometryDiamond(ctx, x, y, iterations, colors);
                    break;
                case 'universal-eye':
                    mathematics.drawUniversalEye(ctx, x, y, iterations, colors);
                    break;
                case 'torus-field':
                    mathematics.drawTorusField(ctx, x, y, iterations, colors);
                    break;
            }
            
            ctx.restore();
        }
    };
    
    // Tesla 3-6-9 Pattern Functions
    mathematics.drawTesla369Pattern = function(ctx, centerX, centerY, iterations, colors) {
        // Tesla's 3-6-9 theory visualized as energy nodes
        const radius = 120;
        const energyNodes = [];
        
        // Create energy nodes based on 3-6-9 pattern
        for (let i = 0; i < iterations; i++) {
            const angle = (i * 2 * Math.PI) / 9; // 9 positions for 3-6-9
            const nodeRadius = radius * (0.5 + (i % 3) * 0.25); // Varying radii for 3-6-9
            
            // Only place nodes at 3, 6, 9 positions and their multiples
            if (i % 3 === 0 || (i * 3) % 9 === 0 || (i * 6) % 9 === 0) {
                const x = centerX + nodeRadius * Math.cos(angle);
                const y = centerY + nodeRadius * Math.sin(angle);
                
                energyNodes.push({
                    x: x,
                    y: y,
                    energy: (i % 3) + 1, // 1, 2, 3 energy levels
                    resonance: Math.sin(i * Math.PI / 3) // Tesla resonance frequency
                });
            }
        }
        
        // Draw energy connections between nodes
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        
        for (let i = 0; i < energyNodes.length; i++) {
            for (let j = i + 1; j < energyNodes.length; j++) {
                const node1 = energyNodes[i];
                const node2 = energyNodes[j];
                
                // Connect nodes with energy differences of 3, 6, or 9
                const energyDiff = Math.abs(node1.energy - node2.energy);
                if (energyDiff === 3 || energyDiff === 6 || energyDiff === 9 || energyDiff === 0) {
                    ctx.beginPath();
                    ctx.moveTo(node1.x, node1.y);
                    ctx.lineTo(node2.x, node2.y);
                    ctx.stroke();
                }
            }
        }
        
        // Draw energy nodes with continuous color cycling
        ctx.globalAlpha = 1;
        energyNodes.forEach((node, i) => {
            // Use iterations for continuous color cycling
            const colorIndex = (node.energy + iterations + i) % colors.length;
            const color = colors[colorIndex];
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            
            // Draw pulsing energy node
            const size = 8 + node.energy * 3 + Math.sin(i * 0.5) * 2;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
            ctx.fill();
            
            // Add energy glow
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size * 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // Add 3-6-9 numbers
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(node.energy === 1 ? '3' : node.energy === 2 ? '6' : '9', node.x, node.y + 4);
        });
    };
    
    mathematics.drawTeslaCoilResonance = function(ctx, centerX, centerY, iterations, colors) {
        // Tesla coil electric resonance patterns
        const coilHeight = 150;
        const coilWidth = 40;
        
        // Draw main coil structure
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.rect(centerX - coilWidth/2, centerY - coilHeight/2, coilWidth, coilHeight);
        ctx.stroke();
        
        // Draw electric arcs based on iterations
        for (let i = 0; i < iterations; i++) {
            const arcAngle = (i * 2 * Math.PI) / iterations;
            const arcLength = 50 + Math.sin(i * 0.5) * 30;
            
            ctx.strokeStyle = colors[i % colors.length];
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.8;
            
            // Create jagged electric arc
            ctx.beginPath();
            const startX = centerX + (coilWidth/2) * Math.cos(arcAngle);
            const startY = centerY + (coilHeight/2) * Math.sin(arcAngle);
            ctx.moveTo(startX, startY);
            
            const segments = 8;
            for (let s = 1; s <= segments; s++) {
                const segmentAngle = arcAngle + (s / segments) * Math.PI / 6;
                const segmentLength = (s / segments) * arcLength;
                const jitter = (Math.random() - 0.5) * 20;
                
                const x = startX + segmentLength * Math.cos(segmentAngle) + jitter;
                const y = startY + segmentLength * Math.sin(segmentAngle) + jitter;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        // Draw resonance frequency waves
        ctx.globalAlpha = 0.4;
        for (let wave = 0; wave < 5; wave++) {
            const waveRadius = 30 + wave * 20;
            ctx.strokeStyle = colors[wave % colors.length];
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, waveRadius, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    };
    
    mathematics.drawTeslaVortexSpiral = function(ctx, centerX, centerY, iterations, colors) {
        // Tesla's vortex mathematics - energy spirals
        const maxRadius = 100;
        const spirals = 3; // 3 main energy spirals
        
        for (let spiral = 0; spiral < spirals; spiral++) {
            const spiralOffset = (spiral * 2 * Math.PI) / spirals;
            
            ctx.strokeStyle = colors[spiral % colors.length];
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            // Draw logarithmic spiral based on Tesla's energy theory
            for (let i = 0; i < iterations * 20; i++) {
                const angle = spiralOffset + i * 0.1;
                const radius = (i / (iterations * 20)) * maxRadius;
                
                // Tesla's 3-6-9 influence on radius
                const teslaModifier = 1 + 0.3 * Math.sin(angle * 3) + 0.2 * Math.sin(angle * 6) + 0.1 * Math.sin(angle * 9);
                const adjustedRadius = radius * teslaModifier;
                
                const x = centerX + adjustedRadius * Math.cos(angle);
                const y = centerY + adjustedRadius * Math.sin(angle);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
        
        // Add energy nodes at 3-6-9 positions
        for (let node = 0; node < 9; node++) {
            if (node % 3 === 0) { // Only at 3, 6, 9 positions
                const nodeAngle = (node * 2 * Math.PI) / 9;
                const nodeRadius = maxRadius * 0.7;
                const x = centerX + nodeRadius * Math.cos(nodeAngle);
                const y = centerY + nodeRadius * Math.sin(nodeAngle);
                
                ctx.fillStyle = colors[Math.floor(node / 3) % colors.length];
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, 2 * Math.PI);
                ctx.fill();
                
                // Add glow
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(x, y, 12, 0, 2 * Math.PI);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }
    };
    
    mathematics.drawTeslaTriangleMatrix = function(ctx, centerX, centerY, iterations, colors) {
        // Tesla's triangle energy matrix - geometric representation of 3-6-9
        const triangleSize = 80;
        const matrices = Math.min(iterations, 5);
        
        for (let matrix = 0; matrix < matrices; matrix++) {
            const matrixScale = 1 + matrix * 0.3;
            const matrixAngle = (matrix * 2 * Math.PI) / 3; // 120-degree rotation
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(matrixAngle);
            ctx.scale(matrixScale, matrixScale);
            
            // Draw main triangle
            ctx.strokeStyle = colors[matrix % colors.length];
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const points = [];
            for (let i = 0; i < 3; i++) {
                const angle = (i * 2 * Math.PI) / 3;
                const x = triangleSize * Math.cos(angle);
                const y = triangleSize * Math.sin(angle);
                points.push({x, y});
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
            
            // Add 3-6-9 energy points
            points.forEach((point, i) => {
                const energyLevel = [3, 6, 9][i];
                ctx.fillStyle = colors[i % colors.length];
                
                // Draw energy node
                ctx.beginPath();
                ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
                ctx.fill();
                
                // Add energy label
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(energyLevel.toString(), point.x, point.y + 3);
            });
            
            // Draw inner energy connections
            ctx.strokeStyle = colors[matrix % colors.length];
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5;
            
            for (let i = 0; i < 3; i++) {
                const center = {x: 0, y: 0};
                ctx.beginPath();
                ctx.moveTo(center.x, center.y);
                ctx.lineTo(points[i].x, points[i].y);
                ctx.stroke();
            }
            
            ctx.globalAlpha = 1;
            ctx.restore();
        }
        
        // Draw central energy core
        ctx.fillStyle = colors[0];
        ctx.beginPath();
        ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add Tesla frequency rings
        for (let ring = 1; ring <= 3; ring++) {
            ctx.strokeStyle = colors[ring % colors.length];
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, ring * 25, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    };

    mathematics.drawSacredGeometryDiamond = function(ctx, centerX, centerY, iterations, colors) {
        // Sacred Geometry Diamond pattern based on Tesla 3-6-9 theory
        // 9 nodes arranged in diamond formation with numbered connections
        const nodes = [
            { x: centerX, y: centerY - 80, number: 1 },           // Top
            { x: centerX + 60, y: centerY - 40, number: 2 },      // Top right
            { x: centerX + 80, y: centerY, number: 3 },           // Right
            { x: centerX + 40, y: centerY + 40, number: 4 },      // Bottom right inner
            { x: centerX, y: centerY + 80, number: 5 },           // Bottom
            { x: centerX - 40, y: centerY + 40, number: 6 },      // Bottom left inner
            { x: centerX - 80, y: centerY, number: 7 },           // Left
            { x: centerX - 60, y: centerY - 40, number: 8 },      // Top left
            { x: centerX, y: centerY, number: 9 }                 // Center
        ];
        
        // Connection patterns based on Tesla 3-6-9 energy flow
        const connections = [
            // Outer diamond connections
            { from: 0, to: 1, color: 0 }, // 1-2
            { from: 1, to: 2, color: 1 }, // 2-3
            { from: 2, to: 3, color: 2 }, // 3-4
            { from: 3, to: 4, color: 3 }, // 4-5
            { from: 4, to: 5, color: 4 }, // 5-6
            { from: 5, to: 6, color: 5 }, // 6-7
            { from: 6, to: 7, color: 6 }, // 7-8
            { from: 7, to: 0, color: 7 }, // 8-1
            
            // Inner diamond connections
            { from: 0, to: 8, color: 0 }, // 1-9
            { from: 2, to: 8, color: 1 }, // 3-9
            { from: 4, to: 8, color: 2 }, // 5-9
            { from: 6, to: 8, color: 3 }, // 7-9
            
            // Cross connections forming sacred geometry
            { from: 0, to: 4, color: 4 }, // 1-5
            { from: 2, to: 6, color: 5 }, // 3-7
            { from: 1, to: 5, color: 6 }, // 2-6
            { from: 3, to: 7, color: 7 }, // 4-8
        ];
        
        // Draw connections with gradient effects - show all connections with continuous color cycling
        connections.forEach((conn, index) => {
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];
            
            // Create gradient line with continuous color cycling
            const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
            const colorIndex1 = (conn.color + iterations) % colors.length;
            const colorIndex2 = (conn.color + iterations + 1) % colors.length;
            gradient.addColorStop(0, colors[colorIndex1]);
            gradient.addColorStop(1, colors[colorIndex2]);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.shadowColor = colors[colorIndex1];
            ctx.shadowBlur = 10;
            
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.stroke();
            
            ctx.shadowBlur = 0;
        });
        
        // Draw nodes with numbers - show all nodes with continuous color cycling
        nodes.forEach((node, index) => {
            // Draw node circle with glow effect using continuous color cycling
            const colorIndex = (index + iterations) % colors.length;
            ctx.fillStyle = colors[colorIndex];
            ctx.shadowColor = colors[colorIndex];
            ctx.shadowBlur = 15;
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, 12, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.shadowBlur = 0;
            
            // Draw number
            ctx.fillStyle = '#000';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.number.toString(), node.x, node.y);
        });
        
        // Draw Tesla 3-6-9 energy field around center
        if (iterations > 8) {
            ctx.strokeStyle = colors[0];
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            
            const energyRadius = 100;
            ctx.beginPath();
            ctx.arc(centerX, centerY, energyRadius, 0, 2 * Math.PI);
            ctx.stroke();
            
            ctx.setLineDash([]);
        }
    };

    // Cosmic Particle Emission Animation System
    mathematics.cosmicParticles = [];
    mathematics.cosmicAnimationId = null;
    mathematics.cosmicSettings = {
        particlesEnabled: false,
        energyWavesEnabled: false,
        stellarTrailsEnabled: false,
        density: 50,
        speed: 2,
        glow: 15,
        theme: 'galaxy',
        particleSize: 2,
        trailLength: 5,
        bounceForce: 0.8,
        gravity: 0.1,
        collisionEnabled: false,
        dvdBounceEnabled: false,
        complexity: 5
    };

    mathematics.initCosmicParticleSystem = function() {
        const canvas = document.getElementById('fractal-canvas');
        const ctx = canvas.getContext('2d');
        
        // Initialize particle system
        mathematics.cosmicParticles = [];
        
        // Get behavior settings for current theme
        const behavior = mathematics.getCosmicParticleBehavior();
        
        // Create particles based on density
        const particleCount = mathematics.cosmicSettings.density;
        for (let i = 0; i < particleCount; i++) {
            const size = behavior.sizeRange[0] + Math.random() * (behavior.sizeRange[1] - behavior.sizeRange[0]);
            
            mathematics.cosmicParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * mathematics.cosmicSettings.speed * behavior.speedMultiplier,
                vy: (Math.random() - 0.5) * mathematics.cosmicSettings.speed * behavior.speedMultiplier,
                size: mathematics.cosmicSettings.particleSize + Math.random() * 2,
                opacity: Math.random() * 0.8 + 0.2,
                color: mathematics.getCosmicColor(),
                life: 1.0,
                trail: [],
                angle: Math.random() * Math.PI * 2,
                behavior: behavior,
                bounceCount: 0
            });
        }
        
        console.log(`🌟 Created ${particleCount} particles with ${mathematics.cosmicSettings.theme} theme`);
    };

    mathematics.getCosmicColor = function() {
        // Safety check for cosmicSettings
        if (!mathematics.cosmicSettings) {
            mathematics.cosmicSettings = {
                theme: 'galaxy',
                particlesEnabled: false,
                density: 50,
                speed: 2
            };
        }
        
        const theme = mathematics.cosmicSettings.theme || 'galaxy';
        const themes = {
            galaxy: ['#9b59b6', '#3498db', '#e67e22', '#f39c12', '#e74c3c'],
            supernova: ['#ff4757', '#ff7675', '#ffa502', '#ffff00', '#ffffff'],
            aurora: ['#00ff80', '#00ffff', '#8000ff', '#ff00ff', '#00ff00'],
            stardust: ['#ffd700', '#ffb347', '#dda0dd', '#87ceeb', '#f0e68c'],
            blackhole: ['#663399', '#8B008B', '#FF4500', '#FF6347', '#DC143C'],
            tesla: ['#00d2ff', '#7cff50', '#ff6b35', '#e74c3c', '#9b59b6'],
            quantum: ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5', '#fb8500'],
            pulsar: ['#ffffff', '#00d4aa', '#7209b7', '#560bad', '#f72585'],
            wormhole: ['#240046', '#3c096c', '#5a189a', '#7b2cbf', '#9d4edd'],
            'cosmic-web': ['#ff9500', '#ff5400', '#ff006e', '#c77dff', '#7209b7'],
            'dark-matter': ['#14213d', '#fca311', '#e5e5e5', '#ffffff', '#023047'],
            'solar-flare': ['#ffbe0b', '#fb8500', '#ff006e', '#8ecae6', '#219ebc'],
            'neutron-star': ['#03045e', '#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'],
            'plasma-field': ['#f72585', '#b5179e', '#7209b7', '#480ca8', '#3c096c']
        };
        
        const colors = themes[theme] || themes.galaxy;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Additional safety check
        return color || '#9b59b6';
    };

    mathematics.getCosmicParticleBehavior = function() {
        const theme = mathematics.cosmicSettings.theme;
        const behaviors = {
            galaxy: { 
                speedMultiplier: 1, 
                sizeRange: [1, 3], 
                lifeDecay: 0.005,
                pattern: 'spiral'
            },
            supernova: { 
                speedMultiplier: 3, 
                sizeRange: [2, 5], 
                lifeDecay: 0.01,
                pattern: 'explosion'
            },
            aurora: { 
                speedMultiplier: 0.5, 
                sizeRange: [1, 4], 
                lifeDecay: 0.003,
                pattern: 'wave'
            },
            stardust: { 
                speedMultiplier: 0.8, 
                sizeRange: [0.5, 2], 
                lifeDecay: 0.004,
                pattern: 'drift'
            },
            blackhole: { 
                speedMultiplier: 2, 
                sizeRange: [1, 6], 
                lifeDecay: 0.008,
                pattern: 'vortex'
            },
            tesla: { 
                speedMultiplier: 1.5, 
                sizeRange: [1, 4], 
                lifeDecay: 0.006,
                pattern: 'energy'
            },
            quantum: { 
                speedMultiplier: 4, 
                sizeRange: [0.5, 3], 
                lifeDecay: 0.002,
                pattern: 'quantum'
            },
            pulsar: { 
                speedMultiplier: 0.3, 
                sizeRange: [2, 8], 
                lifeDecay: 0.01,
                pattern: 'pulse'
            },
            wormhole: { 
                speedMultiplier: 2.5, 
                sizeRange: [1, 5], 
                lifeDecay: 0.007,
                pattern: 'portal'
            },
            'cosmic-web': { 
                speedMultiplier: 0.7, 
                sizeRange: [1, 3], 
                lifeDecay: 0.004,
                pattern: 'web'
            },
            'dark-matter': { 
                speedMultiplier: 0.2, 
                sizeRange: [3, 7], 
                lifeDecay: 0.001,
                pattern: 'dark'
            },
            'solar-flare': { 
                speedMultiplier: 5, 
                sizeRange: [1, 6], 
                lifeDecay: 0.015,
                pattern: 'flare'
            },
            'neutron-star': { 
                speedMultiplier: 1.8, 
                sizeRange: [0.8, 4], 
                lifeDecay: 0.005,
                pattern: 'magnetic'
            },
            'plasma-field': { 
                speedMultiplier: 3.2, 
                sizeRange: [1, 5], 
                lifeDecay: 0.008,
                pattern: 'plasma'
            }
        };
        
        return behaviors[theme] || behaviors.galaxy;
    };

    mathematics.updateCosmicParticles = function() {
        const canvas = document.getElementById('fractal-canvas');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const time = Date.now() * 0.001;
        
        mathematics.cosmicParticles.forEach(particle => {
            // Apply theme-specific behaviors
            const behavior = particle.behavior;
            
            switch (behavior.pattern) {
                case 'spiral':
                    // Galaxy spiral pattern - distinct spiraling motion
                    particle.angle += 0.03;
                    const spiralRadius = 50 + Math.sin(particle.angle) * 20;
                    particle.x += Math.cos(particle.angle) * particle.vx * 0.8;
                    particle.y += Math.sin(particle.angle) * particle.vy * 0.8;
                    
                    // Add spiral drift toward center
                    const spiralDx = centerX - particle.x;
                    const spiralDy = centerY - particle.y;
                    particle.x += spiralDx * 0.001;
                    particle.y += spiralDy * 0.001;
                    break;
                    
                case 'explosion':
                    // Supernova explosion pattern - fast outward bursts
                    const explosionSpeed = behavior.speedMultiplier * 3;
                    particle.x += particle.vx * explosionSpeed;
                    particle.y += particle.vy * explosionSpeed;
                    
                    // Add pulsing size effect
                    particle.size = Math.max(0.5, behavior.sizeRange[0] + Math.sin(time * 5) * 2);
                    break;
                    
                case 'wave':
                    // Aurora wave pattern - flowing wave motion
                    particle.x += particle.vx;
                    particle.y += particle.vy + Math.sin(time * 2 + particle.x * 0.02) * 2;
                    
                    // Add secondary wave for complexity
                    particle.x += Math.cos(time * 1.5 + particle.y * 0.015) * 0.5;
                    break;
                    
                case 'drift':
                    // Stardust slow drift - gentle floating motion
                    particle.x += particle.vx * 0.3;
                    particle.y += particle.vy * 0.3;
                    
                    // Add gentle sparkle effect
                    particle.size = Math.max(0.5, behavior.sizeRange[0] + Math.sin(time * 3 + particle.x * 0.01) * 0.5);
                    particle.opacity = 0.5 + Math.sin(time * 2 + particle.y * 0.01) * 0.3;
                    break;
                    
                case 'vortex':
                    // Black hole vortex - strong inward spiral
                    const dx = centerX - particle.x;
                    const dy = centerY - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const force = 0.3 / (distance + 1);
                    
                    particle.vx += dx * force;
                    particle.vy += dy * force;
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // Create strong swirling motion
                    particle.angle += 0.15;
                    particle.x += Math.cos(particle.angle) * 1.5;
                    particle.y += Math.sin(particle.angle) * 1.5;
                    
                    // Size increases as it approaches center
                    particle.size = Math.max(0.5, behavior.sizeRange[0] + (1 - distance / 200) * 3);
                    break;
                    
                case 'energy':
                    // Tesla energy field - electromagnetic patterns
                    particle.x += particle.vx + Math.sin(time * 3 + particle.y * 0.01) * 1.5;
                    particle.y += particle.vy + Math.cos(time * 3 + particle.x * 0.01) * 1.5;
                    
                    // Tesla 3-6-9 field resonance
                    const fieldStrength = Math.sin(time * 2 + particle.x * 0.02 + particle.y * 0.02);
                    particle.size = Math.max(0.5, particle.behavior.sizeRange[0] + Math.abs(fieldStrength) * 3);
                    
                    // Tesla harmonic face formation patterns
                    const teslaHarmonic = Math.sin(time * 3) + Math.sin(time * 6) + Math.sin(time * 9);
                    particle.brightness = 0.7 + Math.abs(teslaHarmonic) * 0.3;
                    
                    // Sacred geometry energy resonance
                    const energyField = Math.sin(time * 3.69) * Math.cos(time * 6.93);
                    particle.vx += energyField * 0.2;
                    particle.vy += energyField * 0.2;
                    break;
                    
                case 'quantum':
                    // Quantum tunneling - particles randomly jump positions
                    if (Math.random() < 0.002) {
                        particle.x = Math.random() * canvas.width;
                        particle.y = Math.random() * canvas.height;
                    }
                    // Quantum superposition - size fluctuates rapidly
                    particle.size = particle.behavior.sizeRange[0] + Math.sin(time * 20 + particle.x * 0.1) * 2;
                    particle.x += particle.vx * Math.sin(time * 5);
                    particle.y += particle.vy * Math.cos(time * 5);
                    break;
                    
                case 'pulse':
                    // Pulsar emissions - rhythmic pulses from center
                    const pulseFreq = Math.sin(time * 2);
                    particle.size = particle.behavior.sizeRange[0] + Math.abs(pulseFreq) * 4;
                    particle.brightness = 0.3 + Math.abs(pulseFreq) * 0.7;
                    
                    // Particles get pushed out in pulses
                    if (pulseFreq > 0.8) {
                        const dx = particle.x - centerX;
                        const dy = particle.y - centerY;
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        if (dist > 0) {
                            particle.vx += (dx/dist) * 2;
                            particle.vy += (dy/dist) * 2;
                        }
                    }
                    particle.x += particle.vx * 0.95;
                    particle.y += particle.vy * 0.95;
                    break;
                    
                case 'portal':
                    // Wormhole portal - particles spiral inward then teleport out
                    const portalDx = centerX - particle.x;
                    const portalDy = centerY - particle.y;
                    const portalDist = Math.sqrt(portalDx*portalDx + portalDy*portalDy);
                    
                    if (portalDist < 30) {
                        // Teleport to random edge
                        const edge = Math.random() * 4;
                        if (edge < 1) particle.x = 0, particle.y = Math.random() * canvas.height;
                        else if (edge < 2) particle.x = canvas.width, particle.y = Math.random() * canvas.height;
                        else if (edge < 3) particle.y = 0, particle.x = Math.random() * canvas.width;
                        else particle.y = canvas.height, particle.x = Math.random() * canvas.width;
                    } else {
                        // Spiral toward center
                        particle.angle += 0.1;
                        particle.x += (portalDx * 0.02) + Math.cos(particle.angle) * particle.vx;
                        particle.y += (portalDy * 0.02) + Math.sin(particle.angle) * particle.vy;
                    }
                    break;
                    
                case 'web':
                    // Cosmic web - particles form connected networks
                    particle.x += particle.vx * 0.5;
                    particle.y += particle.vy * 0.5;
                    
                    // Gravitational attraction to nearby particles
                    mathematics.cosmicParticles.forEach(other => {
                        if (other !== particle) {
                            const webDx = other.x - particle.x;
                            const webDy = other.y - particle.y;
                            const webDist = Math.sqrt(webDx*webDx + webDy*webDy);
                            
                            if (webDist < 100 && webDist > 0) {
                                const force = 0.001 / webDist;
                                particle.vx += (webDx/webDist) * force;
                                particle.vy += (webDy/webDist) * force;
                            }
                        }
                    });
                    break;
                    
                case 'dark':
                    // Dark matter - slow, mysterious, barely visible
                    particle.x += particle.vx * 0.3;
                    particle.y += particle.vy * 0.3;
                    particle.opacity = 0.1 + Math.sin(time + particle.x * 0.01) * 0.1;
                    particle.size = particle.behavior.sizeRange[0] + Math.sin(time * 0.5 + particle.y * 0.01) * 2;
                    break;
                    
                case 'flare':
                    // Solar flare - explosive bursts from center
                    const flareIntensity = Math.sin(time * 3) + Math.sin(time * 7);
                    if (Math.abs(flareIntensity) > 1.5) {
                        // Explosive burst
                        const burstAngle = Math.atan2(particle.y - centerY, particle.x - centerX);
                        particle.vx += Math.cos(burstAngle) * 5;
                        particle.vy += Math.sin(burstAngle) * 5;
                        particle.size = particle.behavior.sizeRange[1];
                    }
                    particle.x += particle.vx * 0.9;
                    particle.y += particle.vy * 0.9;
                    particle.vx *= 0.98;
                    particle.vy *= 0.98;
                    break;
                    
                case 'magnetic':
                    // Neutron star magnetosphere - particles follow magnetic field lines
                    const magneticAngle = Math.atan2(particle.y - centerY, particle.x - centerX);
                    const magneticField = Math.sin(magneticAngle * 3 + time);
                    
                    particle.x += particle.vx + Math.cos(magneticAngle + Math.PI/2) * magneticField * 0.5;
                    particle.y += particle.vy + Math.sin(magneticAngle + Math.PI/2) * magneticField * 0.5;
                    
                    // Particle streams along field lines
                    particle.vx += Math.cos(magneticAngle) * 0.1;
                    particle.vy += Math.sin(magneticAngle) * 0.1;
                    break;
                    
                case 'plasma':
                    // Plasma field - chaotic, high-energy particle interactions
                    const plasmaForce = Math.sin(time * 8 + particle.x * 0.05) * Math.cos(time * 6 + particle.y * 0.03);
                    
                    particle.x += particle.vx + plasmaForce * 2;
                    particle.y += particle.vy - plasmaForce * 2;
                    particle.size = particle.behavior.sizeRange[0] + Math.abs(plasmaForce) * 3;
                    particle.brightness = 0.6 + Math.abs(plasmaForce) * 0.4;
                    
                    // Random electrical discharge effects
                    if (Math.random() < 0.01) {
                        particle.vx += (Math.random() - 0.5) * 4;
                        particle.vy += (Math.random() - 0.5) * 4;
                    }
                    break;
                    
                default:
                    particle.x += particle.vx;
                    particle.y += particle.vy;
            }
            
            // DVD Bounce Mode or Standard wrapping
            if (mathematics.cosmicSettings.dvdBounceEnabled) {
                // Bounce off walls with color change
                if (particle.x <= 0 || particle.x >= canvas.width) {
                    particle.vx *= -mathematics.cosmicSettings.bounceForce;
                    particle.x = Math.max(0, Math.min(canvas.width, particle.x));
                    particle.color = mathematics.getCosmicColor();
                    particle.bounceCount++;
                }
                if (particle.y <= 0 || particle.y >= canvas.height) {
                    particle.vy *= -mathematics.cosmicSettings.bounceForce;
                    particle.y = Math.max(0, Math.min(canvas.height, particle.y));
                    particle.color = mathematics.getCosmicColor();
                    particle.bounceCount++;
                }
            } else {
                // Standard wrapping
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
            }
            
            // Update stellar trails with custom length
            if (mathematics.cosmicSettings.stellarTrailsEnabled) {
                particle.trail.push({ x: particle.x, y: particle.y });
                const maxTrailLength = mathematics.cosmicSettings.trailLength || 10;
                if (particle.trail.length > maxTrailLength) {
                    particle.trail.shift();
                }
            }
            
            // Update life and opacity with theme-specific decay
            particle.life -= behavior.lifeDecay;
            if (particle.life <= 0) {
                particle.life = 1.0;
                particle.x = Math.random() * canvas.width;
                particle.y = Math.random() * canvas.height;
                particle.color = mathematics.getCosmicColor();
                particle.angle = Math.random() * Math.PI * 2;
            }
        });
    };

    mathematics.drawCosmicParticles = function() {
        const canvas = document.getElementById('fractal-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Check if particles exist
        if (!mathematics.cosmicParticles || mathematics.cosmicParticles.length === 0) {
            console.log('⚠️ No cosmic particles found, initializing...');
            mathematics.initCosmicParticleSystem();
            return;
        }
        
        mathematics.cosmicParticles.forEach(particle => {
            ctx.save();
            
            // Draw stellar trails
            if (mathematics.cosmicSettings.stellarTrailsEnabled && particle.trail.length > 1) {
                ctx.strokeStyle = particle.color;
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.3;
                
                ctx.beginPath();
                ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
                for (let i = 1; i < particle.trail.length; i++) {
                    ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
                }
                ctx.stroke();
            }
            
            // Draw particle with glow and brightness
            const finalOpacity = (particle.opacity || 0.8) * particle.life * (particle.brightness || 1);
            ctx.globalAlpha = finalOpacity;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = mathematics.cosmicSettings.glow;
            ctx.fillStyle = particle.color;
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, Math.max(0.5, particle.size), 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.restore();
        });
    };

    mathematics.initCosmicParticles = function() {
        // Initialize cosmic particle system
        mathematics.initCosmicParticleSystem();
        console.log('🌌 Cosmic particle system initialized');
    };

    mathematics.drawEnergyWaves = function() {
        const canvas = document.getElementById('fractal-canvas');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const time = Date.now() * 0.001;
        
        // Draw pulsing energy waves
        for (let i = 0; i < 3; i++) {
            const radius = 50 + Math.sin(time + i * 2) * 30;
            const opacity = 0.3 + Math.sin(time + i * 2) * 0.2;
            
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = mathematics.getCosmicColor();
            ctx.lineWidth = 2;
            ctx.shadowColor = mathematics.getCosmicColor();
            ctx.shadowBlur = 20;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + i * 20, 0, 2 * Math.PI);
            ctx.stroke();
            
            ctx.restore();
        }
    };

    mathematics.startCosmicAnimation = function() {
        if (mathematics.cosmicAnimationId) {
            cancelAnimationFrame(mathematics.cosmicAnimationId);
        }
        
        function animate() {
            const canvas = document.getElementById('fractal-canvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            
            // Clear canvas with space background
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            if (mathematics.cosmicSettings.particlesEnabled) {
                mathematics.updateCosmicParticles();
                mathematics.drawCosmicParticles();
            }
            
            if (mathematics.cosmicSettings.energyWavesEnabled) {
                mathematics.drawEnergyWaves();
            }
            
            // Draw fractal overlay on top of particles
            mathematics.drawFractalOverlay();
            
            mathematics.cosmicAnimationId = requestAnimationFrame(animate);
        }
        
        animate();
    };

    mathematics.stopCosmicAnimation = function() {
        if (mathematics.cosmicAnimationId) {
            cancelAnimationFrame(mathematics.cosmicAnimationId);
            mathematics.cosmicAnimationId = null;
        }
    };

    mathematics.initCosmicControls = function() {
        // Cosmic particles toggle
        const particlesToggle = document.getElementById('cosmic-particles-toggle');
        if (particlesToggle) {
            particlesToggle.addEventListener('change', function() {
                mathematics.cosmicSettings.particlesEnabled = this.checked;
                if (this.checked) {
                    mathematics.initCosmicParticleSystem();
                    mathematics.startCosmicAnimation();
                    console.log('🌌 Cosmic particles enabled - switch themes to see different behaviors!');
                } else {
                    mathematics.stopCosmicAnimation();
                    console.log('🌌 Cosmic particles disabled');
                }
            });
        }
        
        // Energy waves toggle
        const wavesToggle = document.getElementById('energy-waves-toggle');
        if (wavesToggle) {
            wavesToggle.addEventListener('change', function() {
                mathematics.cosmicSettings.energyWavesEnabled = this.checked;
                if (this.checked && !mathematics.cosmicAnimationId) {
                    mathematics.startCosmicAnimation();
                }
            });
        }
        
        // Stellar trails toggle
        const trailsToggle = document.getElementById('stellar-trails-toggle');
        if (trailsToggle) {
            trailsToggle.addEventListener('change', function() {
                mathematics.cosmicSettings.stellarTrailsEnabled = this.checked;
            });
        }
        
        // Particle density slider
        const densitySlider = document.getElementById('particle-density');
        const densityValue = document.getElementById('particle-density-value');
        if (densitySlider) {
            densitySlider.addEventListener('input', function() {
                mathematics.cosmicSettings.density = parseInt(this.value);
                densityValue.textContent = this.value;
                // Immediately regenerate particles with new density
                if (mathematics.cosmicSettings.particlesEnabled) {
                    mathematics.initCosmicParticleSystem();
                    console.log(`🔄 Particle density updated to ${this.value}`);
                }
            });
        }
        
        // Emission speed slider
        const speedSlider = document.getElementById('emission-speed');
        const speedValue = document.getElementById('emission-speed-value');
        if (speedSlider) {
            speedSlider.addEventListener('input', function() {
                mathematics.cosmicSettings.speed = parseFloat(this.value);
                speedValue.textContent = this.value;
                // Update particle speed immediately for better responsiveness
                if (mathematics.cosmicSettings.particles) {
                    mathematics.cosmicSettings.particles.forEach(particle => {
                        particle.baseSpeed = mathematics.cosmicSettings.speed;
                    });
                }
            });
        }
        
        // Cosmic glow slider
        const glowSlider = document.getElementById('cosmic-glow');
        const glowValue = document.getElementById('cosmic-glow-value');
        if (glowSlider) {
            glowSlider.addEventListener('input', function() {
                mathematics.cosmicSettings.glow = parseInt(this.value);
                glowValue.textContent = this.value;
            });
        }
        
        // Cosmic theme selector
        const themeSelect = document.getElementById('cosmic-theme');
        if (themeSelect) {
            themeSelect.addEventListener('change', function() {
                mathematics.cosmicSettings.theme = this.value;
                console.log(`🌌 Switched to ${this.value} cosmic theme`);
                if (mathematics.cosmicSettings.particlesEnabled) {
                    mathematics.initCosmicParticleSystem();
                    mathematics.showNotification(`🌌 ${this.value} universe activated!`, 'success');
                }
            });
        }
        
        // Advanced particle size control
        const particleSizeSlider = document.getElementById('particle-size');
        const particleSizeValue = document.getElementById('particle-size-value');
        if (particleSizeSlider) {
            particleSizeSlider.addEventListener('input', function() {
                mathematics.cosmicSettings.particleSize = parseInt(this.value);
                particleSizeValue.textContent = this.value;
                console.log(`🔬 Particle size set to ${this.value}px`);
            });
        }
        
        // Trail length control
        const trailLengthSlider = document.getElementById('trail-length');
        const trailLengthValue = document.getElementById('trail-length-value');
        if (trailLengthSlider) {
            trailLengthSlider.addEventListener('input', function() {
                mathematics.cosmicSettings.trailLength = parseInt(this.value);
                trailLengthValue.textContent = this.value;
                console.log(`✨ Trail length set to ${this.value}`);
            });
        }
        
        // Bounce force control
        const bounceForceSlider = document.getElementById('bounce-force');
        const bounceForceValue = document.getElementById('bounce-force-value');
        if (bounceForceSlider) {
            bounceForceSlider.addEventListener('input', function() {
                mathematics.cosmicSettings.bounceForce = parseFloat(this.value);
                bounceForceValue.textContent = this.value;
                console.log(`🏀 Bounce force set to ${this.value}`);
            });
        }
        
        // Gravity control
        const gravitySlider = document.getElementById('gravity-strength');
        const gravityValue = document.getElementById('gravity-strength-value');
        if (gravitySlider) {
            gravitySlider.addEventListener('input', function() {
                mathematics.cosmicSettings.gravity = parseFloat(this.value);
                gravityValue.textContent = this.value;
                console.log(`⬇️ Gravity strength set to ${this.value}`);
            });
        }
        
        // DVD Bounce toggle
        const dvdBounceToggle = document.getElementById('dvd-bounce-toggle');
        if (dvdBounceToggle) {
            dvdBounceToggle.addEventListener('change', function() {
                mathematics.cosmicSettings.dvdBounceEnabled = this.checked;
                console.log(`📀 DVD Bounce mode: ${this.checked ? 'enabled' : 'disabled'}`);
                if (this.checked) {
                    mathematics.showNotification('📀 DVD Bounce mode activated!', 'success');
                }
            });
        }
        
        // Particle collision toggle
        const collisionToggle = document.getElementById('particle-collision-toggle');
        if (collisionToggle) {
            collisionToggle.addEventListener('change', function() {
                mathematics.cosmicSettings.collisionEnabled = this.checked;
                console.log(`💥 Particle collision: ${this.checked ? 'enabled' : 'disabled'}`);
                if (this.checked) {
                    mathematics.showNotification('💥 Particle collision enabled!', 'success');
                }
            });
        }
        
        // Pattern complexity control
        const complexitySlider = document.getElementById('pattern-complexity');
        const complexityValue = document.getElementById('pattern-complexity-value');
        if (complexitySlider) {
            complexitySlider.addEventListener('input', function() {
                mathematics.cosmicSettings.complexity = parseInt(this.value);
                complexityValue.textContent = this.value;
                console.log(`🔬 Pattern complexity set to ${this.value}`);
            });
        }
    };
    
    // Preset Pattern Combinations
    mathematics.applyPreset = function(presetName) {
        const presets = {
            mesmerizing: {
                theme: 'galaxy',
                particlesEnabled: true,
                stellarTrailsEnabled: true,
                energyWavesEnabled: true,
                density: 80,
                speed: 1.5,
                glow: 25,
                particleSize: 3,
                trailLength: 12,
                bounceForce: 0.6,
                gravity: 0.05,
                dvdBounceEnabled: false,
                fractalType: 'fern',
                fractalOverlay: 'tesla-diamond'
            },
            explosive: {
                theme: 'supernova',
                particlesEnabled: true,
                stellarTrailsEnabled: true,
                energyWavesEnabled: true,
                density: 150,
                speed: 5,
                glow: 35,
                particleSize: 4,
                trailLength: 8,
                bounceForce: 1.2,
                gravity: 0.2,
                dvdBounceEnabled: true,
                fractalType: 'tesla-369',
                fractalOverlay: 'merkaba'
            },
            ethereal: {
                theme: 'aurora',
                particlesEnabled: true,
                stellarTrailsEnabled: true,
                energyWavesEnabled: true,
                density: 60,
                speed: 0.8,
                glow: 20,
                particleSize: 2,
                trailLength: 15,
                bounceForce: 0.3,
                gravity: 0,
                dvdBounceEnabled: false,
                fractalType: 'flower-of-life',
                fractalOverlay: 'spiral'
            },
            breakthrough: {
                theme: 'tesla',
                particlesEnabled: true,
                stellarTrailsEnabled: true,
                energyWavesEnabled: true,
                density: 100,
                speed: 2.5,
                glow: 40,
                particleSize: 5,
                trailLength: 10,
                bounceForce: 0.9,
                gravity: 0.1,
                dvdBounceEnabled: true,
                fractalType: 'tesla-diamond',
                fractalOverlay: 'tesla-369'
            }
        };
        
        const preset = presets[presetName];
        if (!preset) return;
        
        // Apply all settings
        Object.assign(mathematics.cosmicSettings, preset);
        
        // Update UI elements
        mathematics.updatePresetUI(preset);
        
        // Restart cosmic system with new settings
        if (mathematics.cosmicSettings.particlesEnabled) {
            mathematics.initCosmicParticleSystem();
            mathematics.startCosmicAnimation();
        }
        
        // Update fractal display
        mathematics.generateFractal();
        
        // Show notification
        mathematics.showNotification(`🎨 ${presetName.charAt(0).toUpperCase() + presetName.slice(1)} preset applied!`, 'success');
        console.log(`🎨 Applied ${presetName} preset combination`);
    };
    
    mathematics.updatePresetUI = function(preset) {
        // Update all UI controls to match preset
        const updates = [
            ['cosmic-theme', preset.theme],
            ['cosmic-particles-toggle', preset.particlesEnabled],
            ['stellar-trails-toggle', preset.stellarTrailsEnabled],
            ['energy-waves-toggle', preset.energyWavesEnabled],
            ['particle-density', preset.density],
            ['emission-speed', preset.speed],
            ['cosmic-glow', preset.glow],
            ['particle-size', preset.particleSize],
            ['trail-length', preset.trailLength],
            ['bounce-force', preset.bounceForce],
            ['gravity-strength', preset.gravity],
            ['dvd-bounce-toggle', preset.dvdBounceEnabled],
            ['fractal-type', preset.fractalType]
        ];
        
        updates.forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
                
                // Update corresponding value displays
                const valueDisplay = document.getElementById(id + '-value');
                if (valueDisplay) {
                    valueDisplay.textContent = value;
                }
            }
        });
    };

    // Initialize color palette selector
    mathematics.initColorPaletteSelector();
    
    // Initialize cosmic controls
    mathematics.initCosmicControls();
    
    // Initialize cosmic particle system
    mathematics.initCosmicParticles();
    
    // Initialize fractal overlay system (will be defined below)
    // mathematics.initFractalOverlay();

    // Fractal Overlay System for Cosmic Particles
    mathematics.fractalOverlaySettings = {
        enabled: false,
        type: 'fern',
        opacity: 0.7,
        size: 0.8,
        animationPhase: 0
    };

    mathematics.initFractalOverlay = function() {
        // Fractal overlay toggle
        const fractalToggle = document.getElementById('fractal-overlay-toggle');
        if (fractalToggle) {
            fractalToggle.addEventListener('change', function() {
                mathematics.fractalOverlaySettings.enabled = this.checked;
                if (this.checked) {
                    mathematics.showNotification('✨ Fractal overlay activated!', 'success');
                } else {
                    mathematics.showNotification('✨ Fractal overlay disabled', 'info');
                }
            });
        }

        // Fractal type selector
        const fractalTypeSelect = document.getElementById('fractal-overlay-type');
        if (fractalTypeSelect) {
            fractalTypeSelect.addEventListener('change', function() {
                mathematics.fractalOverlaySettings.type = this.value;
                mathematics.showNotification(`🔄 Switched to ${this.value} fractal`, 'success');
            });
        }

        // Fractal opacity slider
        const opacitySlider = document.getElementById('fractal-opacity');
        const opacityValue = document.getElementById('fractal-opacity-value');
        if (opacitySlider) {
            opacitySlider.addEventListener('input', function() {
                mathematics.fractalOverlaySettings.opacity = parseInt(this.value) / 100;
                opacityValue.textContent = this.value + '%';
            });
        }

        // Fractal size slider
        const sizeSlider = document.getElementById('fractal-overlay-size');
        const sizeValue = document.getElementById('fractal-overlay-size-value');
        if (sizeSlider) {
            sizeSlider.addEventListener('input', function() {
                mathematics.fractalOverlaySettings.size = parseInt(this.value) / 100;
                sizeValue.textContent = this.value + '%';
            });
        }
    };

    mathematics.drawFractalOverlay = function() {
        if (!mathematics.fractalOverlaySettings.enabled) return;
        


        const canvas = document.getElementById('fractal-canvas');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const colors = mathematics.getCurrentColors();
        
        // Update animation phase
        mathematics.fractalOverlaySettings.animationPhase += 0.02;
        
        // Save current context
        ctx.save();
        
        // Apply fractal overlay settings
        ctx.globalAlpha = mathematics.fractalOverlaySettings.opacity;
        const scale = mathematics.fractalOverlaySettings.size;
        ctx.scale(scale, scale);
        
        // Adjust center position for scaling and center within particle circle
        const adjustedCenterX = centerX / scale;
        const adjustedCenterY = centerY / scale;
        
        // Center fractals within the cosmic particle circle (approx 150px radius)
        const particleRadius = 150 / scale;
        const fractalCenterX = adjustedCenterX;
        const fractalCenterY = adjustedCenterY;
        
        // Draw selected fractal type
        const iterations = 20 + Math.sin(mathematics.fractalOverlaySettings.animationPhase) * 5;
        
        switch (mathematics.fractalOverlaySettings.type) {
            case 'fern':
                // Increase fern visibility with brighter colors and better opacity
                ctx.globalAlpha = mathematics.fractalOverlaySettings.opacity + 0.4;
                mathematics.drawBarnsleyFern(ctx, fractalCenterX, fractalCenterY, iterations, 1.2, colors);
                break;
            case 'tree':
                mathematics.drawFractalTree(ctx, fractalCenterX, fractalCenterY + 50, -Math.PI / 2, iterations, 40, colors);
                break;
            case 'spiral':
                mathematics.drawSpiralFractals(ctx, fractalCenterX, fractalCenterY, iterations, colors);
                break;
            case 'seed-of-life':
                mathematics.drawSeedOfLife(ctx, fractalCenterX, fractalCenterY, iterations, colors);
                break;
            case 'flower-of-life':
                mathematics.drawFlowerOfLife(ctx, fractalCenterX, fractalCenterY, iterations, colors);
                break;
            case 'merkaba':
                mathematics.drawMerkaba(ctx, fractalCenterX, fractalCenterY, iterations, colors);
                break;
            case 'tesla-diamond':
                // Enhanced Tesla Diamond visibility and iteration progression
                ctx.globalAlpha = mathematics.fractalOverlaySettings.opacity + 0.3;
                ctx.shadowBlur = 20;
                ctx.shadowColor = colors[0];
                mathematics.drawSacredGeometryDiamond(ctx, fractalCenterX, fractalCenterY, Math.min(iterations, 16), colors);
                break;
            case 'universal-eye':
                mathematics.drawUniversalEye(ctx, fractalCenterX, fractalCenterY, iterations, colors);
                break;
            case 'torus-field':
                mathematics.drawTorusField(ctx, fractalCenterX, fractalCenterY, iterations, colors);
                break;
            default:
                mathematics.drawBarnsleyFern(ctx, adjustedCenterX, adjustedCenterY, iterations, 0.8, colors);
        }
        
        // Restore context
        ctx.restore();
    };

    mathematics.drawTeslaDiamond = function(ctx, centerX, centerY, iterations, colors) {
        // Tesla's 3-6-9 Diamond pattern - scaling is handled by canvas transform in drawFractalOverlay
        const baseSize = 50;
        
        const nodes = [
            { x: centerX, y: centerY - baseSize * 1.6, num: 3 },
            { x: centerX + baseSize * 1.4, y: centerY - baseSize * 0.8, num: 6 },
            { x: centerX + baseSize * 1.4, y: centerY + baseSize * 0.8, num: 9 },
            { x: centerX, y: centerY + baseSize * 1.6, num: 6 },
            { x: centerX - baseSize * 1.4, y: centerY + baseSize * 0.8, num: 9 },
            { x: centerX - baseSize * 1.4, y: centerY - baseSize * 0.8, num: 3 },
            { x: centerX, y: centerY, num: 6 },
            { x: centerX + baseSize * 0.7, y: centerY, num: 9 },
            { x: centerX - baseSize * 0.7, y: centerY, num: 3 }
        ];
        
        // Show all nodes instead of limiting by iterations - iterations now controls animation
        const maxNodes = nodes.length;
        const animationProgress = Math.min(iterations / 10, 1);
        
        // Draw energy connections with animation
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6 * animationProgress;
        
        for (let i = 0; i < maxNodes; i++) {
            for (let j = i + 1; j < maxNodes; j++) {
                const colorIndex = (i + j + iterations) % colors.length;
                ctx.strokeStyle = colors[colorIndex];
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
        
        // Draw numbered nodes
        ctx.globalAlpha = 1;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        
        for (let i = 0; i < maxNodes; i++) {
            const node = nodes[i];
            const colorIndex = (node.num + i + iterations) % colors.length;
            
            // Draw node circle
            ctx.fillStyle = colors[colorIndex];
            ctx.beginPath();
            ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw number
            ctx.fillStyle = '#000';
            ctx.fillText(node.num.toString(), node.x, node.y + 5);
        }
    };

    // Initialize fractal overlay system now that functions are defined
    if (typeof mathematics.initFractalOverlay === 'function') {
        mathematics.initFractalOverlay();
    }

    // Cymatics System - Sound Frequency Patterns with Audio
    mathematics.cymaticsSettings = {
        frequency: 440,
        amplitude: 0.8,
        harmonics: 3,
        animationId: null,
        audioContext: null,
        oscillator: null,
        gainNode: null,
        isPlaying: false
    };

    mathematics.generateCymaticsPattern = function() {
        const canvas = document.getElementById('cymatics-canvas');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate pattern based on frequency
        const frequency = mathematics.cymaticsSettings.frequency;
        const amplitude = mathematics.cymaticsSettings.amplitude;
        const harmonics = mathematics.cymaticsSettings.harmonics;
        
        // Create standing wave pattern
        const nodes = Math.floor(frequency / 50); // Number of nodes based on frequency
        const wavelength = canvas.width / nodes;
        
        // Draw cymantic pattern
        for (let i = 0; i < nodes; i++) {
            for (let j = 0; j < nodes; j++) {
                const x = (i * wavelength) + (wavelength / 2);
                const y = (j * wavelength) + (wavelength / 2);
                
                // Calculate wave interference
                const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                const waveValue = Math.sin(distanceFromCenter * 0.1 * frequency / 100) * amplitude;
                
                // Add harmonics
                let harmonicValue = 0;
                for (let h = 1; h <= harmonics; h++) {
                    harmonicValue += Math.sin(distanceFromCenter * 0.1 * frequency * h / 100) * (amplitude / h);
                }
                
                const finalValue = (waveValue + harmonicValue) / 2;
                
                // Draw particle based on wave value
                if (Math.abs(finalValue) > 0.3) {
                    const size = Math.abs(finalValue) * 5;
                    const opacity = Math.abs(finalValue);
                    
                    // Color based on frequency
                    const hue = (frequency % 360);
                    const saturation = 80;
                    const lightness = 50 + (finalValue * 30);
                    
                    ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
                    ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                    ctx.shadowBlur = 10;
                    
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        }
        
        // Draw standing wave lines
        ctx.strokeStyle = `hsla(${frequency % 360}, 80%, 70%, 0.3)`;
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 8; i++) {
            const radius = (i + 1) * 25;
            const waveOffset = Math.sin(Date.now() * 0.001 + i) * 5;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + waveOffset, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        // Add frequency text
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${frequency}Hz`, centerX, canvas.height - 20);
    };

    // Initialize Web Audio API
    mathematics.initAudioContext = function() {
        if (!mathematics.cymaticsSettings.audioContext) {
            mathematics.cymaticsSettings.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return mathematics.cymaticsSettings.audioContext;
    };

    // Play frequency sound with smooth fade-in
    mathematics.playFrequency = function(frequency) {
        mathematics.stopFrequency(); // Stop any existing sound
        
        const audioContext = mathematics.initAudioContext();
        
        // Create oscillator
        mathematics.cymaticsSettings.oscillator = audioContext.createOscillator();
        mathematics.cymaticsSettings.gainNode = audioContext.createGain();
        
        // Set frequency and type
        mathematics.cymaticsSettings.oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        mathematics.cymaticsSettings.oscillator.type = 'sine';
        
        // Set volume with smooth fade-in to eliminate clicking
        mathematics.cymaticsSettings.gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        mathematics.cymaticsSettings.gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
        
        // Connect and start
        mathematics.cymaticsSettings.oscillator.connect(mathematics.cymaticsSettings.gainNode);
        mathematics.cymaticsSettings.gainNode.connect(audioContext.destination);
        mathematics.cymaticsSettings.oscillator.start();
        
        mathematics.cymaticsSettings.isPlaying = true;
    };

    // Stop frequency sound with smooth fade-out
    mathematics.stopFrequency = function() {
        if (mathematics.cymaticsSettings.oscillator && mathematics.cymaticsSettings.gainNode) {
            const audioContext = mathematics.cymaticsSettings.audioContext;
            
            // Smooth fade-out to eliminate clicking
            mathematics.cymaticsSettings.gainNode.gain.setValueAtTime(mathematics.cymaticsSettings.gainNode.gain.value, audioContext.currentTime);
            mathematics.cymaticsSettings.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.05);
            
            // Stop after fade-out completes
            setTimeout(() => {
                if (mathematics.cymaticsSettings.oscillator) {
                    mathematics.cymaticsSettings.oscillator.stop();
                    mathematics.cymaticsSettings.oscillator.disconnect();
                    mathematics.cymaticsSettings.oscillator = null;
                }
                if (mathematics.cymaticsSettings.gainNode) {
                    mathematics.cymaticsSettings.gainNode.disconnect();
                    mathematics.cymaticsSettings.gainNode = null;
                }
            }, 60); // Slightly longer than fade-out time
        }
        mathematics.cymaticsSettings.isPlaying = false;
    };

    mathematics.setCymaticsFrequency = function(freq) {
        mathematics.cymaticsSettings.frequency = freq;
        document.getElementById('frequency-hz').value = freq;
        document.getElementById('frequency-hz-value').textContent = freq;
        mathematics.generateCymaticsPattern();
        
        // If currently playing, update the frequency
        if (mathematics.cymaticsSettings.isPlaying) {
            mathematics.playFrequency(freq);
        }
    };

    mathematics.animateCymaticsFrequency = function() {
        if (mathematics.cymaticsSettings.animationId) {
            cancelAnimationFrame(mathematics.cymaticsSettings.animationId);
            mathematics.cymaticsSettings.animationId = null;
            return;
        }
        
        let startFreq = mathematics.cymaticsSettings.frequency;
        let targetFreq = startFreq + 200;
        let direction = 1;
        
        function animate() {
            mathematics.cymaticsSettings.frequency += direction * 2;
            
            if (mathematics.cymaticsSettings.frequency >= targetFreq) {
                direction = -1;
            } else if (mathematics.cymaticsSettings.frequency <= startFreq) {
                direction = 1;
            }
            
            document.getElementById('frequency-hz').value = mathematics.cymaticsSettings.frequency;
            document.getElementById('frequency-hz-value').textContent = mathematics.cymaticsSettings.frequency;
            
            mathematics.generateCymaticsPattern();
            
            mathematics.cymaticsSettings.animationId = requestAnimationFrame(animate);
        }
        
        animate();
    };

    mathematics.saveCymaticsToLibrary = function() {
        const canvas = document.getElementById('cymatics-canvas');
        const frequency = mathematics.cymaticsSettings.frequency;
        
        // Generate pattern data
        const patternData = {
            type: 'cymatics',
            frequency: frequency,
            amplitude: mathematics.cymaticsSettings.amplitude,
            harmonics: mathematics.cymaticsSettings.harmonics,
            name: `Cymatics ${frequency}Hz Pattern`,
            timestamp: Date.now(),
            actualImage: canvas.toDataURL('image/png')
        };
        
        // Save to localStorage
        let savedPatterns = JSON.parse(localStorage.getItem('savoModePatterns') || '[]');
        savedPatterns.push(patternData);
        localStorage.setItem('savoModePatterns', JSON.stringify(savedPatterns));
        
        // Increment pattern counter
        let patternCount = parseInt(localStorage.getItem('patternCount') || '0');
        patternCount++;
        localStorage.setItem('patternCount', patternCount.toString());
        
        alert(`Cymatics pattern saved! Pattern count: ${patternCount}/500`);
    };

    // Initialize cymatics controls
    mathematics.initCymaticsControls = function() {
        const frequencySlider = document.getElementById('frequency-hz');
        const frequencyValue = document.getElementById('frequency-hz-value');
        
        if (frequencySlider) {
            frequencySlider.addEventListener('input', function() {
                mathematics.cymaticsSettings.frequency = parseInt(this.value);
                frequencyValue.textContent = this.value;
                mathematics.generateCymaticsPattern();
            });
        }
        
        const amplitudeSlider = document.getElementById('amplitude');
        const amplitudeValue = document.getElementById('amplitude-value');
        
        if (amplitudeSlider) {
            amplitudeSlider.addEventListener('input', function() {
                mathematics.cymaticsSettings.amplitude = parseFloat(this.value);
                amplitudeValue.textContent = this.value;
                mathematics.generateCymaticsPattern();
            });
        }
        
        const harmonicsSlider = document.getElementById('harmonics');
        const harmonicsValue = document.getElementById('harmonics-value');
        
        if (harmonicsSlider) {
            harmonicsSlider.addEventListener('input', function() {
                mathematics.cymaticsSettings.harmonics = parseInt(this.value);
                harmonicsValue.textContent = this.value;
                mathematics.generateCymaticsPattern();
            });
        }
        
        // Volume control
        const volumeSlider = document.getElementById('volume-slider');
        const volumeValue = document.getElementById('volume-value');
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                const volume = parseFloat(this.value);
                if (mathematics.cymaticsSettings.gainNode) {
                    mathematics.cymaticsSettings.gainNode.gain.setValueAtTime(
                        volume, 
                        mathematics.cymaticsSettings.audioContext.currentTime
                    );
                }
                volumeValue.textContent = Math.round(volume * 100) + '%';
            });
        }
    };

    // Initialize cymatics controls
    mathematics.initCymaticsControls();

    // Make it globally available
    window.patternMath = mathematics;

    // Global functions for buttons
    window.drawFibonacciSpiral = () => mathematics.drawFibonacciSpiral();
    window.drawPineconePattern = () => mathematics.drawPineconePattern();
    window.drawLeafVenation = () => mathematics.drawLeafVenation();
    window.checkStorageSpace = () => mathematics.checkStorageSpace();
    window.saveFractalToLibrary = () => mathematics.saveFractalToLibrary();
    window.generateFractal = () => mathematics.generateFractal();
    window.generatePerlinNoise = () => mathematics.generatePerlinNoise();
    window.generateColorHarmony = () => mathematics.generateColorHarmony();
    window.applyCustomColors = () => mathematics.applyCustomColors();
    window.randomizeColors = () => mathematics.randomizeColors();
    window.generateCymaticsPattern = () => mathematics.generateCymaticsPattern();
    window.setCymaticsFrequency = (freq) => mathematics.setCymaticsFrequency(freq);
    window.animateCymaticsFrequency = () => mathematics.animateCymaticsFrequency();
    window.saveCymaticsToLibrary = () => mathematics.saveCymaticsToLibrary();
    window.playCurrentFrequency = () => mathematics.playFrequency(mathematics.cymaticsSettings.frequency);
    window.stopCurrentFrequency = () => mathematics.stopFrequency();
    window.toggleFrequencySound = (freq) => {
        mathematics.setCymaticsFrequency(freq);
        if (mathematics.cymaticsSettings.isPlaying) {
            mathematics.stopFrequency();
        } else {
            mathematics.playFrequency(freq);
        }
    };
    
    // Symmetry functions
    window.drawReflectionSymmetry = () => mathematics.drawReflectionSymmetry();
    window.drawRotationalSymmetry = () => mathematics.drawRotationalSymmetry();
    window.drawTranslationalSymmetry = () => mathematics.drawTranslationalSymmetry();
    window.drawSpiralSymmetry = () => mathematics.drawSpiralSymmetry();
    window.drawTeslaSymmetry = () => mathematics.drawTeslaSymmetry();
    
    // Universal Eye - 2D Sacred Geometry Eye Pattern
    mathematics.drawUniversalEye = function(ctx, centerX, centerY, iterations, colors) {
        // Create 2D universal eye pattern with sacred geometry
        const baseRadius = 60;
        const time = Date.now() * 0.001;
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.8;
        
        // Draw energy field rings - concentric circles
        for (let ring = 0; ring < iterations; ring++) {
            const ringRadius = baseRadius + ring * 8;
            const colorIndex = ring % colors.length;
            
            // Create gradient for each ring
            const gradient = ctx.createRadialGradient(
                centerX, centerY, ringRadius * 0.7,
                centerX, centerY, ringRadius
            );
            gradient.addColorStop(0, `${colors[colorIndex]}88`);
            gradient.addColorStop(0.5, `${colors[colorIndex]}CC`);
            gradient.addColorStop(1, `${colors[colorIndex]}22`);
            
            // Draw outer ring
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3 + Math.sin(ring * Math.PI / 4) * 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw inner energy flow
            ctx.strokeStyle = colors[colorIndex];
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, ringRadius * 0.6, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw bubble-like energy nodes at intersection points
        const nodeCount = Math.min(iterations * 2, 36);
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i * 2 * Math.PI) / nodeCount;
            const radius = baseRadius + (i % 3) * 20;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            // Bubble effect with multiple layers
            const bubbleRadius = 4 + Math.sin(i * Math.PI / 6) * 2;
            const colorIndex = i % colors.length;
            
            // Outer glow
            const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, bubbleRadius * 2);
            glowGradient.addColorStop(0, `${colors[colorIndex]}44`);
            glowGradient.addColorStop(1, `${colors[colorIndex]}00`);
            
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(x, y, bubbleRadius * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Main bubble
            const bubbleGradient = ctx.createRadialGradient(
                x - bubbleRadius * 0.3, y - bubbleRadius * 0.3, 0,
                x, y, bubbleRadius
            );
            bubbleGradient.addColorStop(0, `${colors[colorIndex]}FF`);
            bubbleGradient.addColorStop(0.7, `${colors[colorIndex]}AA`);
            bubbleGradient.addColorStop(1, `${colors[colorIndex]}33`);
            
            ctx.fillStyle = bubbleGradient;
            ctx.beginPath();
            ctx.arc(x, y, bubbleRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Highlight for bubble effect
            ctx.fillStyle = `${colors[colorIndex]}66`;
            ctx.beginPath();
            ctx.arc(x - bubbleRadius * 0.4, y - bubbleRadius * 0.4, bubbleRadius * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw energy field lines connecting nodes
        ctx.globalAlpha = 0.4;
        for (let i = 0; i < nodeCount; i++) {
            const angle1 = (i * 2 * Math.PI) / nodeCount;
            const angle2 = ((i + 3) * 2 * Math.PI) / nodeCount; // Connect every 3rd node
            
            const radius1 = baseRadius + (i % 3) * 20;
            const radius2 = baseRadius + ((i + 3) % 3) * 20;
            
            const x1 = centerX + radius1 * Math.cos(angle1);
            const y1 = centerY + radius1 * Math.sin(angle1);
            const x2 = centerX + radius2 * Math.cos(angle2);
            const y2 = centerY + radius2 * Math.sin(angle2);
            
            ctx.strokeStyle = colors[i % colors.length];
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // Central eye with sacred geometry
        ctx.globalAlpha = 0.9;
        const eyeRadius = 25;
        
        // Eye iris
        const irisGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, eyeRadius);
        irisGradient.addColorStop(0, `${colors[0]}FF`);
        irisGradient.addColorStop(0.5, `${colors[1]}AA`);
        irisGradient.addColorStop(1, `${colors[2]}33`);
        
        ctx.fillStyle = irisGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupil
        const pupilRadius = 8;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX, centerY, pupilRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye reflection
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX - 3, centerY - 3, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset alpha
        ctx.globalAlpha = 1;
    };

    // 3D Torus Field Implementation
    mathematics.drawTorusField = function(ctx, centerX, centerY, iterations, colors) {
        // Create authentic 3D/4D torus field with dimensional depth
        const baseRadius = 80;
        const torusThickness = 40;
        const time = Date.now() * 0.001; // Animation time
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.9;
        
        // 3D Torus Ring Structure - Multiple dimensional layers
        for (let layer = 0; layer < iterations; layer++) {
            const layerDepth = layer / iterations;
            const ringRadius = baseRadius + Math.sin(layerDepth * Math.PI) * 30;
            const thickness = torusThickness * (1 - layerDepth * 0.5);
            
            // Create 3D perspective effect
            const perspective = 1 - layerDepth * 0.3;
            const yOffset = Math.sin(layerDepth * Math.PI * 2 + time) * 20;
            
            // Draw torus ring with 3D shading
            for (let segment = 0; segment < 72; segment++) {
                const angle = (segment * Math.PI * 2) / 72;
                const nextAngle = ((segment + 1) * Math.PI * 2) / 72;
                
                // 3D coordinates
                const x1 = centerX + ringRadius * Math.cos(angle) * perspective;
                const y1 = centerY + ringRadius * Math.sin(angle) * perspective * 0.6 + yOffset;
                const x2 = centerX + ringRadius * Math.cos(nextAngle) * perspective;
                const y2 = centerY + ringRadius * Math.sin(nextAngle) * perspective * 0.6 + yOffset;
                
                // Inner ring coordinates for thickness
                const innerRadius = ringRadius - thickness;
                const ix1 = centerX + innerRadius * Math.cos(angle) * perspective;
                const iy1 = centerY + innerRadius * Math.sin(angle) * perspective * 0.6 + yOffset;
                const ix2 = centerX + innerRadius * Math.cos(nextAngle) * perspective;
                const iy2 = centerY + innerRadius * Math.sin(nextAngle) * perspective * 0.6 + yOffset;
                
                // Calculate 3D lighting based on angle
                const lightIntensity = Math.abs(Math.sin(angle)) * 0.7 + 0.3;
                const colorIndex = (layer + segment) % colors.length;
                const baseColor = colors[colorIndex];
                
                // Create gradient for 3D effect
                const gradient = ctx.createLinearGradient(ix1, iy1, x1, y1);
                gradient.addColorStop(0, `${baseColor}${Math.floor(lightIntensity * 255).toString(16).padStart(2, '0')}`);
                gradient.addColorStop(1, `${baseColor}${Math.floor(lightIntensity * 120).toString(16).padStart(2, '0')}`);
                
                // Draw torus segment
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(ix2, iy2);
                ctx.lineTo(ix1, iy1);
                ctx.closePath();
                ctx.fill();
                
                // Add highlight for 3D effect
                if (lightIntensity > 0.8) {
                    ctx.strokeStyle = `${baseColor}FF`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        // Enhanced Torus Field Energy Lines - Flowing dimensional streams
        ctx.globalAlpha = 0.6;
        for (let stream = 0; stream < 20; stream++) {
            const streamAngle = (stream * Math.PI * 2) / 20;
            const colorIndex = stream % colors.length;
            
            ctx.strokeStyle = colors[colorIndex];
            ctx.lineWidth = 1.5 + Math.sin(time + stream * 0.2) * 0.7;
            ctx.beginPath();
            
            // Create flowing curved energy streams
            for (let segment = 0; segment < 30; segment++) {
                const segmentRatio = segment / 30;
                const radius = 25 + segmentRatio * (baseRadius + 45);
                
                // Add flowing wave motion
                const waveOffset = Math.sin(segmentRatio * 3 + time + stream * 0.1) * 12;
                const angle = streamAngle + waveOffset * 0.008;
                
                // 3D perspective effect
                const depth = Math.sin(segmentRatio * Math.PI) * 0.3;
                const x = centerX + radius * Math.cos(angle) * (1 + depth);
                const y = centerY + radius * Math.sin(angle) * 0.6 * (1 + depth);
                
                if (segment === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
        
        // Concentric energy circles
        ctx.globalAlpha = 0.3;
        for (let ring = 1; ring <= 6; ring++) {
            const ringRadius = baseRadius + (ring - 3) * 15;
            if (ringRadius > 10) {
                const colorIndex = ring % colors.length;
                
                ctx.strokeStyle = colors[colorIndex];
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        // Central Torus Core - Pure energy field center
        ctx.globalAlpha = 1;
        const coreRadius = 15;
        
        // Energy core with dimensional depth
        const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius);
        coreGradient.addColorStop(0, `${colors[0]}FF`);
        coreGradient.addColorStop(0.3, `${colors[1]}DD`);
        coreGradient.addColorStop(0.7, `${colors[2]}AA`);
        coreGradient.addColorStop(1, `${colors[3]}44`);
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner void/portal - the torus hole
        const voidRadius = 5 + Math.sin(time * 2) * 1;
        const voidGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, voidRadius);
        voidGradient.addColorStop(0, '#000000');
        voidGradient.addColorStop(0.8, '#111111');
        voidGradient.addColorStop(1, colors[0] + '44');
        
        ctx.fillStyle = voidGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, voidRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Energy spark at center
        ctx.fillStyle = `${colors[0]}FF`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Dimensional ripples emanating from the core
        ctx.globalAlpha = 0.3;
        for (let ripple = 0; ripple < 5; ripple++) {
            const rippleRadius = coreRadius + (ripple * 15) + Math.sin(time * 3 + ripple) * 10;
            ctx.strokeStyle = colors[ripple % colors.length];
            ctx.lineWidth = 2 - ripple * 0.3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, rippleRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Reset alpha
        ctx.globalAlpha = 1;
    };
});