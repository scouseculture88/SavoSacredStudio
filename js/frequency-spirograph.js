// Frequency Spirograph - Audio-Controlled Geometric Pattern Generator
class FrequencySpirograph {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.isDrawing = false;
        this.isAudioDrawing = false;
        this.animationId = null;
        this.time = 0;
        this.trail = [];
        this.maxTrailLength = 500;
        
        // Canvas contexts
        this.canvas = null;
        this.ctx = null;
        this.freqCanvas = null;
        this.freqCtx = null;
        
        // Drawing parameters
        this.freq1 = 1.0;
        this.freq2 = 3.0;
        this.freq3 = 7.0;
        this.amp1 = 100;
        this.amp2 = 50;
        this.penDistance = 30;
        this.drawSpeed = 10;
        this.patternType = 'hypotrochoid';
        this.colorMode = 'frequency';
        
        // Tesla presets
        this.presets = {
            '369': { freq1: 3, freq2: 6, freq3: 9, amp1: 120, amp2: 80, penDistance: 45 },
            'triangle': { freq1: 1, freq2: 3, freq3: 6, amp1: 100, amp2: 80, penDistance: 40 },
            'fibonacci': { freq1: 1, freq2: 1.618, freq3: 2.618, amp1: 100, amp2: 62, penDistance: 38 },
            'golden': { freq1: 1.618, freq2: 2.618, freq3: 4.236, amp1: 110, amp2: 68, penDistance: 42 },
            'solfeggio': { freq1: 5.28, freq2: 9.63, freq3: 7.41, amp1: 130, amp2: 85, penDistance: 52 },
            'torus': { freq1: 2, freq2: 5, freq3: 11, amp1: 140, amp2: 90, penDistance: 60 },
            'galaxy': { freq1: 0.8, freq2: 3.2, freq3: 12.8, amp1: 160, amp2: 100, penDistance: 75 }
        };
        
        this.init();
    }
    
    async init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.updateDisplayValues();
        this.updateEquations();
        await this.setupAudioContext();
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('spirographCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.freqCanvas = document.getElementById('frequencyDisplay');
        this.freqCtx = this.freqCanvas.getContext('2d');
        
        // Set high DPI
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        this.clearCanvas();
    }
    
    setupEventListeners() {
        // Frequency controls
        document.getElementById('freq1').addEventListener('input', (e) => {
            this.freq1 = parseFloat(e.target.value);
            this.updateDisplayValues();
            this.updateEquations();
        });
        
        document.getElementById('freq2').addEventListener('input', (e) => {
            this.freq2 = parseFloat(e.target.value);
            this.updateDisplayValues();
            this.updateEquations();
        });
        
        document.getElementById('freq3').addEventListener('input', (e) => {
            this.freq3 = parseFloat(e.target.value);
            this.updateDisplayValues();
            this.updateEquations();
        });
        
        document.getElementById('amp1').addEventListener('input', (e) => {
            this.amp1 = parseInt(e.target.value);
            this.updateDisplayValues();
        });
        
        document.getElementById('amp2').addEventListener('input', (e) => {
            this.amp2 = parseInt(e.target.value);
            this.updateDisplayValues();
        });
        
        document.getElementById('penDistance').addEventListener('input', (e) => {
            this.penDistance = parseInt(e.target.value);
            this.updateDisplayValues();
        });
        
        document.getElementById('drawSpeed').addEventListener('input', (e) => {
            this.drawSpeed = parseInt(e.target.value);
            document.getElementById('drawSpeedValue').textContent = e.target.value;
        });
        
        document.getElementById('trailLength').addEventListener('input', (e) => {
            this.maxTrailLength = parseInt(e.target.value);
            document.getElementById('trailLengthValue').textContent = e.target.value;
        });
        
        document.getElementById('patternType').addEventListener('change', (e) => {
            this.patternType = e.target.value;
            this.updateEquations();
        });
        
        document.getElementById('colorMode').addEventListener('change', (e) => {
            this.colorMode = e.target.value;
        });
        
        // Drawing controls
        document.getElementById('startDrawing').addEventListener('click', () => this.startDrawing());
        document.getElementById('pauseDrawing').addEventListener('click', () => this.pauseDrawing());
        document.getElementById('clearCanvas').addEventListener('click', () => this.clearCanvas());
        document.getElementById('savePattern').addEventListener('click', () => this.savePattern());
        
        // Audio controls
        document.getElementById('startAudioDraw').addEventListener('click', () => this.startAudioDrawing());
        document.getElementById('uploadAudio').addEventListener('click', () => {
            document.getElementById('audioFile').click();
        });
        document.getElementById('audioFile').addEventListener('change', (e) => this.handleAudioFile(e));
        
        document.getElementById('audioSensitivity').addEventListener('input', (e) => {
            document.getElementById('audioSensitivityValue').textContent = e.target.value;
        });
        
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.applyPreset(e.target.dataset.preset));
        });
        
        // Play frequency buttons
        document.getElementById('playFreq1').addEventListener('click', () => this.playFrequency(this.freq1));
        document.getElementById('playFreq2').addEventListener('click', () => this.playFrequency(this.freq2));
        document.getElementById('playFreq3').addEventListener('click', () => this.playFrequency(this.freq3));
    }
    
    updateDisplayValues() {
        document.getElementById('freq1Value').textContent = this.freq1.toFixed(1) + ' Hz';
        document.getElementById('freq2Value').textContent = this.freq2.toFixed(1) + ' Hz';
        document.getElementById('freq3Value').textContent = this.freq3.toFixed(1) + ' Hz';
        document.getElementById('amp1Value').textContent = this.amp1;
        document.getElementById('amp2Value').textContent = this.amp2;
        document.getElementById('penDistanceValue').textContent = this.penDistance;
        
        // Update parameter display
        document.getElementById('outerRadius').textContent = this.amp1;
        document.getElementById('innerRadius').textContent = this.amp2;
        document.getElementById('penParam').textContent = this.penDistance;
        
        // Update frequency relationships
        const ratio = (this.freq1 / this.freq2).toFixed(2);
        document.getElementById('freqRatio').textContent = `1:${ratio}`;
        
        const teslaNum = this.calculateTeslaNumber();
        document.getElementById('teslaNumber').textContent = teslaNum;
        
        const complexity = this.calculateComplexity();
        document.getElementById('complexity').textContent = complexity;
    }
    
    updateEquations() {
        const equations = document.getElementById('currentEquations');
        let xEq, yEq;
        
        switch (this.patternType) {
            case 'hypotrochoid':
                xEq = 'x = (R-r) × cos(θ) + d × cos(θ×(R-r)/r)';
                yEq = 'y = (R-r) × sin(θ) - d × sin(θ×(R-r)/r)';
                break;
            case 'epitrochoid':
                xEq = 'x = (R+r) × cos(θ) - d × cos(θ×(R+r)/r)';
                yEq = 'y = (R+r) × sin(θ) - d × sin(θ×(R+r)/r)';
                break;
            case 'lissajous':
                xEq = 'x = A × sin(f1×t + φ1)';
                yEq = 'y = B × sin(f2×t + φ2)';
                break;
            case 'torus':
                xEq = 'x = (R + r×cos(v)) × cos(u)';
                yEq = 'y = (R + r×cos(v)) × sin(u)';
                break;
            case 'galaxy':
                xEq = 'x = r × cos(θ) × e^(-θ/10)';
                yEq = 'y = r × sin(θ) × e^(-θ/10)';
                break;
        }
        
        equations.innerHTML = `
            <div class="equation">${xEq}</div>
            <div class="equation">${yEq}</div>
        `;
    }
    
    calculateTeslaNumber() {
        const numbers = [this.freq1, this.freq2, this.freq3];
        const teslaNumbers = numbers.map(num => {
            let digitalRoot = Math.round(num);
            while (digitalRoot >= 10) {
                let sum = 0;
                while (digitalRoot > 0) {
                    sum += digitalRoot % 10;
                    digitalRoot = Math.floor(digitalRoot / 10);
                }
                digitalRoot = sum;
            }
            return digitalRoot;
        });
        
        return teslaNumbers.join('-');
    }
    
    calculateComplexity() {
        const ratio = this.freq1 / this.freq2;
        if (ratio < 1.5) return 'Simple';
        if (ratio < 3) return 'Medium';
        if (ratio < 6) return 'Complex';
        return 'Chaotic';
    }
    
    applyPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return;
        
        // Update sliders
        document.getElementById('freq1').value = preset.freq1;
        document.getElementById('freq2').value = preset.freq2;
        document.getElementById('freq3').value = preset.freq3;
        document.getElementById('amp1').value = preset.amp1;
        document.getElementById('amp2').value = preset.amp2;
        document.getElementById('penDistance').value = preset.penDistance;
        
        // Update internal values
        this.freq1 = preset.freq1;
        this.freq2 = preset.freq2;
        this.freq3 = preset.freq3;
        this.amp1 = preset.amp1;
        this.amp2 = preset.amp2;
        this.penDistance = preset.penDistance;
        
        this.updateDisplayValues();
        this.updateEquations();
        
        // Visual feedback
        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-preset="${presetName}"]`).classList.add('active');
        
        // Apply Tesla effect for Tesla presets
        if (['369', 'solfeggio'].includes(presetName)) {
            document.body.classList.add('tesla-active');
            setTimeout(() => document.body.classList.remove('tesla-active'), 3000);
        }
    }
    
    startDrawing() {
        if (this.isDrawing) return;
        
        this.isDrawing = true;
        this.time = 0;
        this.trail = [];
        
        document.body.classList.add('drawing-active');
        document.getElementById('startDrawing').textContent = 'Drawing...';
        
        this.drawLoop();
    }
    
    pauseDrawing() {
        this.isDrawing = false;
        document.body.classList.remove('drawing-active');
        document.getElementById('startDrawing').innerHTML = '<i data-feather="play"></i> Start Drawing';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Re-initialize feather icons
        setTimeout(() => feather.replace(), 100);
    }
    
    drawLoop() {
        if (!this.isDrawing) return;
        
        const centerX = this.canvas.width / (2 * window.devicePixelRatio);
        const centerY = this.canvas.height / (2 * window.devicePixelRatio);
        
        // Calculate position based on pattern type
        let x, y;
        
        switch (this.patternType) {
            case 'hypotrochoid':
                x = this.calculateHypotrochoid().x;
                y = this.calculateHypotrochoid().y;
                break;
            case 'epitrochoid':
                x = this.calculateEpitrochoid().x;
                y = this.calculateEpitrochoid().y;
                break;
            case 'lissajous':
                x = this.calculateLissajous().x;
                y = this.calculateLissajous().y;
                break;
            case 'torus':
                x = this.calculateTorus().x;
                y = this.calculateTorus().y;
                break;
            case 'galaxy':
                x = this.calculateGalaxy().x;
                y = this.calculateGalaxy().y;
                break;
        }
        
        // Add to trail
        this.trail.push({
            x: centerX + x,
            y: centerY + y,
            time: this.time,
            freq1: this.freq1,
            freq2: this.freq2,
            freq3: this.freq3
        });
        
        // Limit trail length
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        // Draw the pattern
        this.drawPattern();
        
        // Update current angle display
        document.getElementById('currentAngle').textContent = Math.round(this.time * 180 / Math.PI) + '°';
        
        this.time += this.drawSpeed * 0.01;
        this.animationId = requestAnimationFrame(() => this.drawLoop());
    }
    
    calculateHypotrochoid() {
        const R = this.amp1;
        const r = this.amp2;
        const d = this.penDistance;
        const theta = this.time * this.freq1;
        
        const x = (R - r) * Math.cos(theta) + d * Math.cos(theta * (R - r) / r);
        const y = (R - r) * Math.sin(theta) - d * Math.sin(theta * (R - r) / r);
        
        return { x, y };
    }
    
    calculateEpitrochoid() {
        const R = this.amp1;
        const r = this.amp2;
        const d = this.penDistance;
        const theta = this.time * this.freq1;
        
        const x = (R + r) * Math.cos(theta) - d * Math.cos(theta * (R + r) / r);
        const y = (R + r) * Math.sin(theta) - d * Math.sin(theta * (R + r) / r);
        
        return { x, y };
    }
    
    calculateLissajous() {
        const x = this.amp1 * Math.sin(this.freq1 * this.time);
        const y = this.amp2 * Math.sin(this.freq2 * this.time + this.freq3);
        
        return { x, y };
    }
    
    calculateTorus() {
        const R = this.amp1;
        const r = this.amp2;
        const u = this.time * this.freq1;
        const v = this.time * this.freq2;
        
        const x = (R + r * Math.cos(v)) * Math.cos(u);
        const y = (R + r * Math.cos(v)) * Math.sin(u);
        
        return { x, y };
    }
    
    calculateGalaxy() {
        const r = this.amp1;
        const theta = this.time * this.freq1;
        const spiral = Math.exp(-theta / 10);
        
        const x = r * Math.cos(theta) * spiral;
        const y = r * Math.sin(theta) * spiral;
        
        return { x, y };
    }
    
    drawPattern() {
        // Fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.trail.length < 2) return;
        
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        for (let i = 1; i < this.trail.length; i++) {
            const current = this.trail[i];
            const previous = this.trail[i - 1];
            
            // Calculate color
            const color = this.getTrailColor(i, current);
            this.ctx.strokeStyle = color;
            
            // Draw line segment
            this.ctx.beginPath();
            this.ctx.moveTo(previous.x, previous.y);
            this.ctx.lineTo(current.x, current.y);
            this.ctx.stroke();
        }
    }
    
    getTrailColor(index, point) {
        const alpha = index / this.trail.length;
        
        switch (this.colorMode) {
            case 'frequency':
                const hue = (point.freq1 + point.freq2 + point.freq3) * 30 % 360;
                return `hsla(${hue}, 100%, 60%, ${alpha})`;
                
            case 'rainbow':
                const rainbowHue = (index / this.trail.length) * 360;
                return `hsla(${rainbowHue}, 100%, 60%, ${alpha})`;
                
            case 'tesla':
                const teslaColors = ['#ff6b35', '#00ff88', '#7cff50'];
                const colorIndex = Math.floor((index / this.trail.length) * teslaColors.length);
                const color = teslaColors[colorIndex] || teslaColors[0];
                return color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
                
            case 'cosmic':
                const cosmicHue = (point.time * 50) % 360;
                return `hsla(${cosmicHue}, 80%, 70%, ${alpha})`;
                
            case 'solfeggio':
                const solfeggioHue = (point.freq1 * 60) % 360;
                return `hsla(${solfeggioHue}, 90%, 65%, ${alpha})`;
                
            default:
                return `rgba(255, 107, 53, ${alpha})`;
        }
    }
    
    clearCanvas() {
        this.ctx.fillStyle = 'rgba(15, 15, 35, 1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.trail = [];
    }
    
    savePattern() {
        const link = document.createElement('a');
        link.download = `spirograph_pattern_${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }
    
    async setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8;
        } catch (error) {
            console.error('Audio context setup failed:', error);
        }
    }
    
    async playFrequency(frequency) {
        if (!this.audioContext) return;
        
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 1);
    }
    
    async startAudioDrawing() {
        if (this.isAudioDrawing) {
            this.stopAudioDrawing();
            return;
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.analyser);
            
            this.isAudioDrawing = true;
            document.getElementById('startAudioDraw').textContent = 'Stop Audio Drawing';
            
            this.audioDrawLoop();
            
        } catch (error) {
            console.error('Audio drawing failed:', error);
            alert('Microphone access required for audio drawing');
        }
    }
    
    stopAudioDrawing() {
        this.isAudioDrawing = false;
        document.getElementById('startAudioDraw').innerHTML = '<i data-feather="mic"></i> Draw from Microphone';
        setTimeout(() => feather.replace(), 100);
    }
    
    audioDrawLoop() {
        if (!this.isAudioDrawing) return;
        
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        
        // Extract dominant frequencies
        const frequencies = this.extractDominantFrequencies(dataArray);
        
        if (frequencies.length >= 2) {
            // Map frequencies to drawing parameters
            this.freq1 = this.mapFrequencyToRange(frequencies[0].freq, 0.1, 10);
            this.freq2 = this.mapFrequencyToRange(frequencies[1].freq, 0.1, 10);
            if (frequencies[2]) {
                this.freq3 = this.mapFrequencyToRange(frequencies[2].freq, 0.1, 10);
            }
            
            // Map amplitudes to drawing parameters
            this.amp1 = Math.max(50, frequencies[0].amplitude * 2);
            this.amp2 = Math.max(25, frequencies[1].amplitude);
            
            this.updateDisplayValues();
            
            // Start drawing if not already drawing
            if (!this.isDrawing) {
                this.startDrawing();
            }
        }
        
        this.visualizeFrequencies(dataArray);
        
        setTimeout(() => this.audioDrawLoop(), 100);
    }
    
    extractDominantFrequencies(dataArray) {
        const frequencies = [];
        const sensitivity = parseInt(document.getElementById('audioSensitivity').value);
        const threshold = (100 - sensitivity) * 2.55;
        
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i] > threshold) {
                const freq = (i * this.audioContext.sampleRate) / (this.analyser.fftSize * 2);
                frequencies.push({
                    freq: freq,
                    amplitude: dataArray[i]
                });
            }
        }
        
        return frequencies
            .sort((a, b) => b.amplitude - a.amplitude)
            .slice(0, 3);
    }
    
    mapFrequencyToRange(frequency, min, max) {
        // Logarithmic mapping for better frequency distribution
        const logFreq = Math.log10(frequency + 1);
        const maxLogFreq = Math.log10(20000);
        const ratio = logFreq / maxLogFreq;
        return min + (max - min) * ratio;
    }
    
    visualizeFrequencies(dataArray) {
        const canvas = this.freqCanvas;
        const ctx = this.freqCtx;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = canvas.width / dataArray.length * 2;
        let x = 0;
        
        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            
            const hue = (i / dataArray.length) * 360;
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }
    
    async handleAudioFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            // Analyze the audio file and extract frequency patterns
            this.analyzeAudioFile(audioBuffer);
            
        } catch (error) {
            console.error('Audio file analysis failed:', error);
        }
    }
    
    analyzeAudioFile(audioBuffer) {
        const channelData = audioBuffer.getChannelData(0);
        const sampleRate = audioBuffer.sampleRate;
        
        // Simple frequency analysis
        const fftSize = 2048;
        const frequencies = [];
        
        for (let i = 0; i < channelData.length; i += fftSize) {
            const chunk = channelData.slice(i, i + fftSize);
            const freqData = this.performSimpleFFT(chunk, sampleRate);
            frequencies.push(...freqData);
        }
        
        // Extract dominant frequencies
        const dominantFreqs = frequencies
            .sort((a, b) => b.magnitude - a.magnitude)
            .slice(0, 3);
        
        if (dominantFreqs.length >= 2) {
            this.freq1 = this.mapFrequencyToRange(dominantFreqs[0].freq, 0.1, 10);
            this.freq2 = this.mapFrequencyToRange(dominantFreqs[1].freq, 0.1, 10);
            if (dominantFreqs[2]) {
                this.freq3 = this.mapFrequencyToRange(dominantFreqs[2].freq, 0.1, 10);
            }
            
            this.updateDisplayValues();
            document.getElementById('audioStatus').textContent = 
                `Analyzed audio file: ${dominantFreqs.length} dominant frequencies detected`;
        }
    }
    
    performSimpleFFT(data, sampleRate) {
        const frequencies = [];
        
        for (let freq = 20; freq < 2000; freq += 50) {
            let magnitude = 0;
            for (let i = 0; i < data.length; i++) {
                const time = i / sampleRate;
                magnitude += Math.abs(data[i] * Math.sin(2 * Math.PI * freq * time));
            }
            
            if (magnitude > 0.1) {
                frequencies.push({ freq, magnitude });
            }
        }
        
        return frequencies;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FrequencySpirograph();
});
