
// Chrome Music Lab Spectrogram - Simplified Implementation
class SpectrogramVisualizer {
    constructor() {
        this.canvas = document.getElementById('spectrogram');
        this.ctx = this.canvas.getContext('2d');
        this.legendCanvas = document.getElementById('legend');
        this.legendCtx = this.legendCanvas.getContext('2d');
        
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.audioBuffer = null;
        this.spectrogramData = [];
        this.animationId = null;
        
        this.isRecording = false;
        this.currentAudio = null;
        this.currentWaveType = 'sine'; // sine, square, sawtooth, triangle
        this.butterflyTrails = []; // Array to store motion trails
        this.maxTrailLength = 50; // Maximum trail points to keep
        this.trailsEnabled = true;
        
        // Gesture-based wave manipulation
        this.gestureHistory = []; // Track finger movements for gesture recognition
        this.maxGestureHistory = 10; // Keep last 10 points for gesture analysis
        this.currentGesture = 'none'; // Current detected gesture
        this.gestureWaveModulation = 1.0; // Current wave modulation from gestures
        
        this.setupCanvas();
        this.setupControls();
        this.startVisualization();
    }
    
    setupCanvas() {
        const resizeCanvas = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.legendCanvas.width = 200;
            this.legendCanvas.height = 400;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }
    
    async setupAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8;
        }
        
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
    
    async startMicrophone() {
        try {
            await this.setupAudioContext();
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: { 
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                } 
            });
            
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.microphone.connect(this.analyser);
            this.isRecording = true;
            
            document.getElementById('record').style.display = 'flex';
            document.getElementById('statusDisplay').textContent = 'Microphone active - ready for bird calls';
            console.log('🎤 Microphone started - ready for bird calls!');
            
        } catch (error) {
            console.error('Microphone access denied:', error);
            alert('Microphone access required for real-time analysis');
        }
    }
    
    stopMicrophone() {
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone = null;
        }
        this.isRecording = false;
        document.getElementById('record').style.display = 'none';
    }
    
    async playAudioFile(src) {
        try {
            await this.setupAudioContext();
            
            if (this.currentAudio) {
                this.currentAudio.pause();
            }
            
            this.currentAudio = new Audio(src);
            const source = this.audioContext.createMediaElementSource(this.currentAudio);
            source.connect(this.analyser);
            source.connect(this.audioContext.destination);
            
            this.currentAudio.play();
            console.log(`🎵 Playing: ${src}`);
            
        } catch (error) {
            console.error('Audio playback error:', error);
            // For demo purposes, simulate bird call data
            this.simulateBirdCall();
        }
    }
    
    // Remove audio file simulation - focus on real microphone input only
    simulateBirdCall() {
        console.log('🐦 Audio files not found - microphone mode active');
        // Don't simulate - keep microphone as primary input
    }
    
    getFrequencyData() {
        if (!this.analyser) return null;
        
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        
        // Convert to normalized values
        const normalizedData = Array.from(dataArray).map(value => value / 255);
        return normalizedData;
    }
    
    render3DSpectrogram() {
        if (!this.ctx) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas with 3D background
        const gradient = this.ctx.createRadialGradient(
            width/2, height/2, 0, 
            width/2, height/2, Math.max(width, height)/2
        );
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.7, '#16213e');
        gradient.addColorStop(1, '#0a0a0a');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);
        
        // Get current frequency data
        const frequencyData = this.getFrequencyData();
        if (frequencyData) {
            // Add to spectrogram history
            this.spectrogramData.push(frequencyData);
            if (this.spectrogramData.length > 150) {
                this.spectrogramData.shift();
            }
        }
        
        if (this.spectrogramData.length === 0) return;
        
        // Render 3D spectrogram
        const sliceWidth = width / this.spectrogramData.length;
        const freqBins = this.spectrogramData[0].length;
        const binHeight = height / freqBins;
        
        // Detect bird shapes
        const birdShapes = this.detectBirdShapes();
        
        // Render frequency data with 3D depth
        this.spectrogramData.forEach((timeSlice, timeIndex) => {
            const x = timeIndex * sliceWidth;
            const depth = 1 - (timeIndex / this.spectrogramData.length) * 0.4; // 3D depth
            
            timeSlice.forEach((magnitude, freqIndex) => {
                if (magnitude > 0.02) {
                    const y = height - (freqIndex * binHeight);
                    const frequency = (freqIndex / freqBins) * 22050;
                    
                    // 3D scaling based on depth
                    const scale = 0.6 + (depth * 0.4);
                    const pixelWidth = Math.ceil(sliceWidth * scale);
                    const pixelHeight = Math.ceil(binHeight * scale);
                    
                    // Color mapping optimized for birds
                    let hue, saturation, lightness;
                    if (frequency < 1000) {
                        hue = 240; saturation = 70; lightness = 30 * depth;
                    } else if (frequency < 4000) {
                        hue = 180 - (magnitude * 120);
                        saturation = 80; lightness = (40 + magnitude * 40) * depth;
                    } else {
                        hue = 60 - (magnitude * 60);
                        saturation = 90; lightness = (50 + magnitude * 35) * depth;
                    }
                    
                    // Enhanced glow for strong signals
                    if (magnitude > 0.6) {
                        this.ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness + 30}%)`;
                        this.ctx.shadowBlur = 8 * scale;
                    }
                    
                    this.ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                    this.ctx.fillRect(x, y, pixelWidth, pixelHeight);
                    
                    this.ctx.shadowBlur = 0;
                }
            });
        });
        
        // Render bird shapes
        this.renderBirdShapes(birdShapes);
        
        // Render legend
        this.renderLegend();
    }
    
    detectBirdShapes() {
        const shapes = [];
        if (this.spectrogramData.length < 10) return shapes;
        
        const recentData = this.spectrogramData.slice(-20);
        
        recentData.forEach((slice, timeIndex) => {
            const peaks = [];
            
            // Find frequency peaks
            for (let i = 10; i < slice.length - 10; i++) {
                if (slice[i] > 0.4) {
                    const neighbors = slice.slice(i - 5, i + 5);
                    if (slice[i] === Math.max(...neighbors)) {
                        peaks.push({ freq: i, amp: slice[i] });
                    }
                }
            }
            
            // Detect rapid frequency changes (hummingbird-like)
            if (peaks.length >= 2) {
                const freqSpread = Math.max(...peaks.map(p => p.freq)) - Math.min(...peaks.map(p => p.freq));
                const avgAmp = peaks.reduce((sum, p) => sum + p.amp, 0) / peaks.length;
                
                if (freqSpread > 30 && avgAmp > 0.5) {
                    shapes.push({
                        type: 'hummingbird',
                        x: timeIndex + this.spectrogramData.length - 20,
                        peaks: peaks,
                        intensity: avgAmp
                    });
                }
            }
        });
        
        return shapes;
    }
    
    renderBirdShapes(shapes) {
        shapes.forEach(shape => {
            if (shape.type === 'hummingbird') {
                const x = (shape.x / this.spectrogramData.length) * this.canvas.width;
                const y = this.canvas.height * 0.6;
                const intensity = shape.intensity;
                
                // Draw hummingbird silhouette
                this.ctx.globalAlpha = 0.4 + (intensity * 0.4);
                this.ctx.strokeStyle = `hsl(${120 + intensity * 60}, 80%, 70%)`;
                this.ctx.lineWidth = 3;
                
                // Body
                this.ctx.beginPath();
                this.ctx.ellipse(x, y, 12, 6, 0, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // Animated wings
                const wingPhase = (Date.now() * 0.03) % (Math.PI * 2);
                const wingSpan = 15 + Math.sin(wingPhase) * 10;
                
                // Left wing
                this.ctx.beginPath();
                this.ctx.ellipse(x - 8, y - 3, wingSpan, 4, wingPhase * 0.3, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // Right wing
                this.ctx.beginPath();
                this.ctx.ellipse(x + 8, y - 3, wingSpan, 4, -wingPhase * 0.3, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // Beak
                this.ctx.beginPath();
                this.ctx.moveTo(x - 12, y);
                this.ctx.lineTo(x - 20, y - 2);
                this.ctx.stroke();
                
                this.ctx.globalAlpha = 1;
            }
        });
    }
    
    renderLegend() {
        if (!this.legendCtx) return;
        
        const width = this.legendCanvas.width;
        const height = this.legendCanvas.height;
        
        // Clear legend
        this.legendCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.legendCtx.fillRect(0, 0, width, height);
        
        // Frequency scale
        this.legendCtx.strokeStyle = 'rgba(116, 235, 213, 0.6)';
        this.legendCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.legendCtx.font = '12px Roboto';
        
        const freqLabels = [
            { freq: 22050, label: '22kHz' },
            { freq: 16000, label: '16kHz' },
            { freq: 8000, label: '8kHz' },
            { freq: 4000, label: '4kHz' },
            { freq: 2000, label: '2kHz' },
            { freq: 1000, label: '1kHz' },
            { freq: 500, label: '500Hz' },
            { freq: 0, label: '0Hz' }
        ];
        
        freqLabels.forEach(({ freq, label }) => {
            const y = height - (freq / 22050) * height;
            
            this.legendCtx.beginPath();
            this.legendCtx.moveTo(0, y);
            this.legendCtx.lineTo(width, y);
            this.legendCtx.stroke();
            
            this.legendCtx.fillText(label, 10, y - 5);
        });
        
        // Title
        this.legendCtx.fillStyle = '#74ebd5';
        this.legendCtx.font = '14px Roboto';
        this.legendCtx.fillText('Frequency', 10, 20);
        
        // Bird detection indicator
        if (this.isRecording) {
            this.legendCtx.fillStyle = '#ff6b6b';
            this.legendCtx.fillText('🎤 LIVE', 10, height - 20);
        }
    }
    
    setupControls() {
        // Microphone button
        const micBtn = document.getElementById('micBtn');
        micBtn.addEventListener('click', () => {
            if (this.isRecording) {
                this.stopMicrophone();
                micBtn.style.background = 'linear-gradient(135deg, #74ebd5, #acb6e5)';
            } else {
                this.startMicrophone();
                micBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
            }
        });
        
        // Professional button handlers
        document.querySelectorAll('[data-src]').forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('🎤 Switch to microphone for authentic recording');
                document.getElementById('statusDisplay').textContent = 'Starting microphone...';
                if (!this.isRecording) {
                    this.startMicrophone();
                }
            });
        });
        
        // Touch interaction for frequency creation
        this.setupTouchFrequencyCreator();
        
        // Wave type controls
        this.setupWaveTypeControls();
        
        // Close modal on click
        document.getElementById('record').addEventListener('click', (e) => {
            if (e.target.id === 'record') {
                this.stopMicrophone();
            }
        });
    }
    
    startVisualization() {
        const animate = () => {
            this.render3DSpectrogram();
            this.drawButterflyTrails(); // Add butterfly trails to animation loop
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
        
        console.log('🎵 3D Spectrogram visualization started');
        console.log('🦋 Ready for cosmic butterfly frequency analysis with motion trails');
        console.log('👆 Touch screen to create epic butterfly dance sequences');
    }
    
    setupTouchFrequencyCreator() {
        let isCreating = false;
        let touchData = [];
        let touchMode = false;
        
        // Touch mode toggle
        const touchModeBtn = document.getElementById('touchModeBtn');
        const statusDisplay = document.getElementById('statusDisplay');
        
        touchModeBtn.addEventListener('click', () => {
            touchMode = !touchMode;
            touchModeBtn.style.background = touchMode ? 
                'linear-gradient(135deg, #f39c12, #e67e22)' : 
                'linear-gradient(135deg, #ff6b35, #f7931e)';
            touchModeBtn.textContent = touchMode ? '🎯 Touch Mode ON' : '👆 Touch Create Mode';
            statusDisplay.textContent = touchMode ? 'Touch screen to create frequencies' : 'Touch mode disabled';
            this.canvas.style.cursor = touchMode ? 'crosshair' : 'default';
        });
        
        // Touch/mouse events for frequency creation
        const canvas = this.canvas;
        
        const startCreating = (e) => {
            if (!touchMode) return;
            isCreating = true;
            touchData = [];
            canvas.style.cursor = 'crosshair';
            statusDisplay.textContent = 'Creating frequency sequence...';
            console.log('🎨 Starting frequency sequence creation');
        };
        
        const createFrequency = (e) => {
            if (!isCreating || !touchMode) return;
            
            const rect = canvas.getBoundingClientRect();
            let x, y;
            
            // Fix touch tracking issue - always get current position
            if (e.touches && e.touches[0]) {
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            } else {
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            }
            
            // Ensure coordinates are within canvas bounds
            x = Math.max(0, Math.min(x, canvas.width));
            y = Math.max(0, Math.min(y, canvas.height));
            
            // Convert touch position to frequency (fixed calculation)
            const frequency = 22050 - (y / canvas.height) * 20000; // 2kHz to 22kHz range
            const intensity = (x / canvas.width) * 0.8 + 0.2; // Left-right controls intensity
            
            touchData.push({ frequency, intensity, time: Date.now(), x, y });
            
            // Add to butterfly motion trails
            this.addButterflyTrail(x, y, frequency, intensity);
            
            // Gesture recognition and wave manipulation
            this.analyzeGesture(x, y, frequency, intensity);
            
            // Create real-time audio synthesis with gesture modulation
            this.synthesizeFrequency(frequency, intensity);
        };
        
        const stopCreating = (e) => {
            if (isCreating && touchData.length > 0) {
                console.log(`🎵 Created epic frequency sequence with ${touchData.length} points`);
                statusDisplay.textContent = `Created ${touchData.length}-point sequence`;
                this.playTouchSequence(touchData);
            } else if (touchMode) {
                statusDisplay.textContent = 'Touch screen to create frequencies';
            }
            isCreating = false;
            touchData = [];
            canvas.style.cursor = touchMode ? 'crosshair' : 'default';
        };
        
        // Mouse events
        canvas.addEventListener('mousedown', startCreating);
        canvas.addEventListener('mousemove', createFrequency);
        canvas.addEventListener('mouseup', stopCreating);
        
        // Touch events for mobile epic sequences
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startCreating(e);
        });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            createFrequency(e);
        });
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            stopCreating(e);
        });
        
        console.log('👆 Touch frequency creator ready - draw epic sequences!');
    }
    
    setupWaveTypeControls() {
        // Professional wave type dropdown
        const waveSelect = document.getElementById('waveSelect');
        const statusDisplay = document.getElementById('statusDisplay');
        
        waveSelect.addEventListener('change', (e) => {
            this.currentWaveType = e.target.value;
            const descriptions = {
                'sine': 'Pure cosmic flow',
                'square': 'Digital butterfly',
                'sawtooth': 'Cutting edge',
                'triangle': 'Gentle flutter',
                'custom1': 'Butterfly harmonic dance',
                'custom2': 'Ocean wave flowing',
                'custom3': 'Cosmic stardust shimmer',
                'custom4': 'Spiral vortex energy'
            };
            console.log(`🎵 Wave type changed to: ${this.currentWaveType} - ${descriptions[this.currentWaveType]}`);
            statusDisplay.textContent = `Wave: ${descriptions[this.currentWaveType]}`;
        });
        
        // Minimize/maximize controls
        const minimizeBtn = document.getElementById('minimizeBtn');
        const controlPanel = document.getElementById('controlPanel');
        const minimizedControl = document.getElementById('minimizedControl');
        
        minimizeBtn.addEventListener('click', () => {
            controlPanel.style.display = 'none';
            minimizedControl.style.display = 'block';
        });
        
        minimizedControl.addEventListener('click', () => {
            controlPanel.style.display = 'block';
            minimizedControl.style.display = 'none';
        });
        
        // Butterfly trails toggle
        const trailsToggle = document.getElementById('trailsToggle');
        trailsToggle.addEventListener('click', () => {
            this.trailsEnabled = !this.trailsEnabled;
            trailsToggle.style.background = this.trailsEnabled ? 
                'linear-gradient(135deg, #9b59b6, #8e44ad)' : 
                'linear-gradient(135deg, #555, #444)';
            trailsToggle.textContent = this.trailsEnabled ? '🦋 Motion Trails ON' : '🦋 Motion Trails OFF';
            statusDisplay.textContent = this.trailsEnabled ? 'Butterfly trails enabled' : 'Butterfly trails disabled';
            
            if (!this.trailsEnabled) {
                this.butterflyTrails = []; // Clear existing trails
            }
        });
        
        console.log('🎛️ Professional interface ready - clean layout activated!');
    }
    
    addButterflyTrail(x, y, frequency, intensity) {
        if (!this.trailsEnabled) return;
        
        // Create a new trail point with cosmic butterfly properties
        const trailPoint = {
            x: x,
            y: y,
            frequency: frequency,
            intensity: intensity,
            timestamp: Date.now(),
            life: 1.0, // Fade from 1.0 to 0.0
            hue: (frequency / 22050) * 360, // Color based on frequency
            size: 2 + intensity * 8, // Size based on intensity
            id: Math.random() // Unique identifier
        };
        
        this.butterflyTrails.push(trailPoint);
        
        // Limit trail length for performance
        if (this.butterflyTrails.length > this.maxTrailLength) {
            this.butterflyTrails.shift();
        }
        
        console.log(`🦋 Trail point added at ${frequency.toFixed(0)}Hz`);
    }
    
    drawButterflyTrails() {
        if (!this.trailsEnabled || this.butterflyTrails.length === 0) return;
        
        const currentTime = Date.now();
        const ctx = this.ctx;
        
        // Update and draw each trail point
        this.butterflyTrails = this.butterflyTrails.filter(trail => {
            // Age the trail (fade over 2 seconds)
            const age = (currentTime - trail.timestamp) / 2000;
            trail.life = Math.max(0, 1 - age);
            
            if (trail.life <= 0) return false; // Remove dead trails
            
            // Draw cosmic butterfly trail with ethereal glow
            const alpha = trail.life * 0.8;
            const glowSize = trail.size * (1 + trail.life);
            
            // Outer glow
            ctx.globalAlpha = alpha * 0.3;
            const gradient = ctx.createRadialGradient(
                trail.x, trail.y, 0,
                trail.x, trail.y, glowSize * 2
            );
            gradient.addColorStop(0, `hsla(${trail.hue}, 80%, 70%, ${alpha})`);
            gradient.addColorStop(0.5, `hsla(${trail.hue + 30}, 60%, 50%, ${alpha * 0.5})`);
            gradient.addColorStop(1, `hsla(${trail.hue + 60}, 40%, 30%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, glowSize * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner core with butterfly shimmer
            ctx.globalAlpha = alpha;
            ctx.fillStyle = `hsla(${trail.hue}, 90%, 80%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Butterfly wing sparkles
            if (trail.life > 0.5) {
                const sparkleAlpha = (trail.life - 0.5) * 2;
                ctx.globalAlpha = sparkleAlpha * 0.6;
                ctx.fillStyle = `hsla(${trail.hue + 120}, 100%, 90%, ${sparkleAlpha})`;
                
                // Left wing sparkle
                ctx.beginPath();
                ctx.arc(trail.x - trail.size * 1.5, trail.y - trail.size * 0.5, trail.size * 0.3, 0, Math.PI * 2);
                ctx.fill();
                
                // Right wing sparkle
                ctx.beginPath();
                ctx.arc(trail.x + trail.size * 1.5, trail.y - trail.size * 0.5, trail.size * 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
            
            return true; // Keep this trail
        });
        
        // Draw connecting lines between recent trail points (butterfly flight path)
        if (this.butterflyTrails.length > 1) {
            ctx.globalAlpha = 0.4;
            ctx.strokeStyle = '#74ebd5';
            ctx.lineWidth = 1;
            
            for (let i = 1; i < this.butterflyTrails.length; i++) {
                const current = this.butterflyTrails[i];
                const previous = this.butterflyTrails[i - 1];
                
                if (current.life > 0.3 && previous.life > 0.3) {
                    ctx.beginPath();
                    ctx.moveTo(previous.x, previous.y);
                    ctx.lineTo(current.x, current.y);
                    ctx.stroke();
                }
            }
        }
        
        // Reset alpha
        ctx.globalAlpha = 1.0;
    }
    
    analyzeGesture(x, y, frequency, intensity) {
        // Add current point to gesture history
        const gesturePoint = {
            x: x,
            y: y,
            frequency: frequency,
            intensity: intensity,
            timestamp: Date.now(),
            velocityX: 0,
            velocityY: 0
        };
        
        // Calculate velocity if we have previous points
        if (this.gestureHistory.length > 0) {
            const prev = this.gestureHistory[this.gestureHistory.length - 1];
            const deltaTime = gesturePoint.timestamp - prev.timestamp;
            if (deltaTime > 0) {
                gesturePoint.velocityX = (x - prev.x) / deltaTime * 1000; // pixels per second
                gesturePoint.velocityY = (y - prev.y) / deltaTime * 1000;
            }
        }
        
        this.gestureHistory.push(gesturePoint);
        
        // Limit history size
        if (this.gestureHistory.length > this.maxGestureHistory) {
            this.gestureHistory.shift();
        }
        
        // Analyze gesture pattern
        this.detectGesturePattern();
        
        // Apply gesture-based wave modulation
        this.applyGestureModulation();
    }
    
    detectGesturePattern() {
        if (this.gestureHistory.length < 3) return;
        
        const recent = this.gestureHistory.slice(-5); // Last 5 points
        const avgVelocityX = recent.reduce((sum, p) => sum + Math.abs(p.velocityX), 0) / recent.length;
        const avgVelocityY = recent.reduce((sum, p) => sum + Math.abs(p.velocityY), 0) / recent.length;
        
        // Detect circular motion (spiral gesture)
        const isCircular = this.detectCircularMotion(recent);
        
        // Detect quick back-and-forth (shake gesture)
        const isShaking = this.detectShakeMotion(recent);
        
        // Detect slow sweep (wave gesture)
        const isSweeping = this.detectSweepMotion(recent);
        
        // Detect rapid tapping (flutter gesture)
        const isFluttering = this.detectFlutterMotion(recent);
        
        let newGesture = 'none';
        
        if (isCircular) {
            newGesture = 'spiral';
        } else if (isShaking) {
            newGesture = 'shake';
        } else if (isSweeping) {
            newGesture = 'sweep';
        } else if (isFluttering) {
            newGesture = 'flutter';
        }
        
        if (newGesture !== this.currentGesture) {
            this.currentGesture = newGesture;
            console.log(`🎭 Gesture detected: ${newGesture}`);
            this.updateGestureDisplay();
        }
    }
    
    detectCircularMotion(points) {
        if (points.length < 4) return false;
        
        // Check for consistent angular movement
        let angularChanges = 0;
        for (let i = 2; i < points.length; i++) {
            const p1 = points[i - 2];
            const p2 = points[i - 1];
            const p3 = points[i];
            
            // Calculate angles
            const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
            
            const angleDiff = Math.abs(angle2 - angle1);
            if (angleDiff > Math.PI / 6 && angleDiff < Math.PI) { // 30-180 degrees
                angularChanges++;
            }
        }
        
        return angularChanges >= 2;
    }
    
    detectShakeMotion(points) {
        if (points.length < 4) return false;
        
        let directionChanges = 0;
        for (let i = 1; i < points.length - 1; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const next = points[i + 1];
            
            const dir1 = curr.x - prev.x;
            const dir2 = next.x - curr.x;
            
            if ((dir1 > 0 && dir2 < 0) || (dir1 < 0 && dir2 > 0)) {
                directionChanges++;
            }
        }
        
        return directionChanges >= 2 && points.some(p => Math.abs(p.velocityX) > 500);
    }
    
    detectSweepMotion(points) {
        if (points.length < 3) return false;
        
        const first = points[0];
        const last = points[points.length - 1];
        const distance = Math.sqrt((last.x - first.x) ** 2 + (last.y - first.y) ** 2);
        
        // Consistent slow movement across distance
        const avgSpeed = points.reduce((sum, p) => sum + Math.sqrt(p.velocityX ** 2 + p.velocityY ** 2), 0) / points.length;
        
        return distance > 100 && avgSpeed > 200 && avgSpeed < 800;
    }
    
    detectFlutterMotion(points) {
        if (points.length < 3) return false;
        
        // Rapid small movements
        const avgSpeed = points.reduce((sum, p) => sum + Math.sqrt(p.velocityX ** 2 + p.velocityY ** 2), 0) / points.length;
        const maxDistance = Math.max(...points.map((p, i) => {
            if (i === 0) return 0;
            const prev = points[i - 1];
            return Math.sqrt((p.x - prev.x) ** 2 + (p.y - prev.y) ** 2);
        }));
        
        return avgSpeed > 300 && maxDistance < 30;
    }
    
    applyGestureModulation() {
        switch (this.currentGesture) {
            case 'spiral':
                this.gestureWaveModulation = 1.5; // Enhance spiral effects
                break;
            case 'shake':
                this.gestureWaveModulation = 2.0; // Amplify tremolo
                break;
            case 'sweep':
                this.gestureWaveModulation = 0.7; // Smooth waves
                break;
            case 'flutter':
                this.gestureWaveModulation = 1.8; // Quick vibrato
                break;
            default:
                this.gestureWaveModulation = 1.0; // Normal
        }
    }
    
    updateGestureDisplay() {
        const statusDisplay = document.getElementById('statusDisplay');
        if (statusDisplay) {
            const gestureEmojis = {
                'spiral': '🌀 Spiral Motion',
                'shake': '⚡ Shake Tremolo', 
                'sweep': '🌊 Wave Sweep',
                'flutter': '🦋 Flutter Vibrato',
                'none': 'Ready for gestures'
            };
            statusDisplay.textContent = gestureEmojis[this.currentGesture] || 'Gesture mode active';
        }
    }
    
    applyCustomWaveEffect(oscillator, gainNode, waveType, frequency, intensity) {
        const currentTime = this.audioContext.currentTime;
        
        switch(waveType) {
            case 'custom1': // Butterfly Wave - Harmonic Dance
                // Create fluttering effect with frequency modulation
                const lfo1 = this.audioContext.createOscillator();
                const lfoGain1 = this.audioContext.createGain();
                lfo1.frequency.setValueAtTime(8 + intensity * 12, currentTime); // Flutter rate
                lfoGain1.gain.setValueAtTime(frequency * 0.02, currentTime); // Modulation depth
                lfo1.connect(lfoGain1);
                lfoGain1.connect(oscillator.frequency);
                lfo1.start(currentTime);
                lfo1.stop(currentTime + 0.2);
                console.log('🦋 Butterfly wave dancing at ' + frequency.toFixed(0) + 'Hz');
                break;
                
            case 'custom2': // Ocean Wave - Flowing Motion
                // Gentle amplitude waves like ocean swells
                const lfo2 = this.audioContext.createOscillator();
                const lfoGain2 = this.audioContext.createGain();
                lfo2.frequency.setValueAtTime(0.5 + intensity * 2, currentTime); // Slow wave motion
                lfoGain2.gain.setValueAtTime(intensity * 0.05, currentTime);
                lfo2.connect(lfoGain2);
                lfoGain2.connect(gainNode.gain);
                lfo2.start(currentTime);
                lfo2.stop(currentTime + 0.2);
                console.log('🌊 Ocean wave flowing at ' + frequency.toFixed(0) + 'Hz');
                break;
                
            case 'custom3': // Stardust Wave - Cosmic Shimmer
                // Sparkling harmonics effect
                const harmonic1 = this.audioContext.createOscillator();
                const harmonic2 = this.audioContext.createOscillator();
                const harmonicGain = this.audioContext.createGain();
                
                harmonic1.frequency.setValueAtTime(frequency * 2, currentTime); // Octave
                harmonic2.frequency.setValueAtTime(frequency * 3, currentTime); // Fifth
                harmonicGain.gain.setValueAtTime(intensity * 0.03, currentTime);
                
                harmonic1.connect(harmonicGain);
                harmonic2.connect(harmonicGain);
                harmonicGain.connect(this.audioContext.destination);
                
                harmonic1.start(currentTime);
                harmonic2.start(currentTime);
                harmonic1.stop(currentTime + 0.2);
                harmonic2.stop(currentTime + 0.2);
                console.log('✨ Stardust shimmering at ' + frequency.toFixed(0) + 'Hz');
                break;
                
            case 'custom4': // Spiral Wave - Vortex Energy
                // Frequency spiral effect
                oscillator.frequency.setValueAtTime(frequency, currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.2, currentTime + 0.1);
                oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.8, currentTime + 0.2);
                console.log('🌀 Spiral vortex at ' + frequency.toFixed(0) + 'Hz');
                break;
        }
    }
    
    synthesizeFrequency(frequency, intensity) {
        if (!this.audioContext) return;
        
        try {
            // Create oscillator - this is like a digital synthesizer
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // Set the exact frequency from your finger position
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            // Different wave shapes create different timbres
            // Custom wave types for cosmic butterfly experience
            if (['sine', 'square', 'sawtooth', 'triangle'].includes(this.currentWaveType)) {
                oscillator.type = this.currentWaveType;
            } else {
                // Custom wave types using real-time synthesis
                oscillator.type = 'sine'; // Base type
                this.applyCustomWaveEffect(oscillator, gainNode, this.currentWaveType, frequency, intensity);
            }
            
            // Apply gesture-based wave modulation
            this.applyGestureWaveEffects(oscillator, gainNode, frequency, intensity);
            
            // Volume envelope - starts loud, fades to silence
            gainNode.gain.setValueAtTime(intensity * 0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
            
            // Connect the audio chain: oscillator → volume → speakers
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Also send to the visual analyzer for frequency display
            gainNode.connect(this.analyser);
            
            // Play the tone for 0.2 seconds
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
            
            console.log(`🎵 Generated ${frequency.toFixed(0)}Hz tone at ${(intensity * 100).toFixed(0)}% intensity`);
            
        } catch (error) {
            console.log('Audio synthesis requires user interaction first');
        }
    }
    
    applyGestureWaveEffects(oscillator, gainNode, frequency, intensity) {
        const currentTime = this.audioContext.currentTime;
        
        switch(this.currentGesture) {
            case 'spiral':
                // Enhanced spiral modulation
                const spiralLFO = this.audioContext.createOscillator();
                const spiralGain = this.audioContext.createGain();
                spiralLFO.frequency.setValueAtTime(12 * this.gestureWaveModulation, currentTime);
                spiralGain.gain.setValueAtTime(frequency * 0.05, currentTime);
                spiralLFO.connect(spiralGain);
                spiralGain.connect(oscillator.frequency);
                spiralLFO.start(currentTime);
                spiralLFO.stop(currentTime + 0.2);
                console.log('🌀 Spiral gesture enhancing frequency modulation');
                break;
                
            case 'shake':
                // Tremolo effect for shake gestures
                const tremoloLFO = this.audioContext.createOscillator();
                const tremoloGain = this.audioContext.createGain();
                tremoloLFO.frequency.setValueAtTime(20 * this.gestureWaveModulation, currentTime);
                tremoloGain.gain.setValueAtTime(intensity * 0.3, currentTime);
                tremoloLFO.connect(tremoloGain);
                tremoloGain.connect(gainNode.gain);
                tremoloLFO.start(currentTime);
                tremoloLFO.stop(currentTime + 0.2);
                console.log('⚡ Shake gesture creating tremolo effect');
                break;
                
            case 'sweep':
                // Smooth frequency sweep for wave gestures
                oscillator.frequency.setValueAtTime(frequency, currentTime);
                oscillator.frequency.linearRampToValueAtTime(frequency * this.gestureWaveModulation, currentTime + 0.1);
                oscillator.frequency.linearRampToValueAtTime(frequency, currentTime + 0.2);
                console.log('🌊 Wave sweep modulating frequency smoothly');
                break;
                
            case 'flutter':
                // Quick vibrato for flutter gestures
                const vibratoLFO = this.audioContext.createOscillator();
                const vibratoGain = this.audioContext.createGain();
                vibratoLFO.frequency.setValueAtTime(25 * this.gestureWaveModulation, currentTime);
                vibratoGain.gain.setValueAtTime(frequency * 0.03, currentTime);
                vibratoLFO.connect(vibratoGain);
                vibratoGain.connect(oscillator.frequency);
                vibratoLFO.start(currentTime);
                vibratoLFO.stop(currentTime + 0.2);
                console.log('🦋 Flutter gesture adding quick vibrato');
                break;
        }
    }
    
    playTouchSequence(touchData) {
        // Play back the epic sequence the user created
        console.log('🎵 Playing back your epic frequency creation');
        
        touchData.forEach((point, index) => {
            setTimeout(() => {
                this.synthesizeFrequency(point.frequency, point.intensity);
            }, index * 50); // 50ms between each frequency point
        });
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.stopMicrophone();
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.spectrogram = new SpectrogramVisualizer();
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.spectrogram.stopMicrophone();
        }
    });
});
