// Consciousness Therapy Studio JavaScript
class ConsciousnessTherapyStudio {
    constructor() {
        this.currentSession = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.sessionDuration = 0;
        this.animationId = null;
        this.timer = null;
        this.canvas = null;
        this.ctx = null;
        
        // Therapy session data organized by categories
        this.therapySessions = {
            meditation: [
                {
                    id: 'deep-meditation',
                    title: 'Deep Consciousness Meditation',
                    description: 'Journey into expanded awareness with sacred geometry visuals',
                    frequency: '7.83 Hz (Earth Resonance)',
                    duration: 20,
                    visual: 'sacredGeometry',
                    benefits: ['Enhanced awareness', 'Deep relaxation', 'Spiritual connection']
                },
                {
                    id: 'mindfulness-flow',
                    title: 'Mindful Flow State',
                    description: 'Flowing patterns to support present moment awareness',
                    frequency: '10 Hz (Alpha Waves)',
                    duration: 15,
                    visual: 'flowingMandalas',
                    benefits: ['Present moment focus', 'Calm alertness', 'Inner peace']
                },
                {
                    id: 'transcendental-journey',
                    title: 'Transcendental Journey',
                    description: 'Cosmic visuals for transcending ordinary consciousness',
                    frequency: '6.3 Hz (Theta Waves)',
                    duration: 30,
                    visual: 'cosmicPortals',
                    benefits: ['Transcendent states', 'Expanded consciousness', 'Spiritual insights']
                }
            ],
            sleep: [
                {
                    id: 'deep-sleep-induction',
                    title: 'Deep Sleep Induction',
                    description: 'Gentle waves and calming frequencies for profound rest',
                    frequency: '1-4 Hz (Delta Waves)',
                    duration: 60,
                    visual: 'gentleWaves',
                    benefits: ['Deep sleep', 'Physical healing', 'Memory consolidation']
                },
                {
                    id: 'lucid-dream-prep',
                    title: 'Lucid Dream Preparation',
                    description: 'Prepare consciousness for lucid dreaming experiences',
                    frequency: '40 Hz (Gamma Waves)',
                    duration: 25,
                    visual: 'dreamPortals',
                    benefits: ['Lucid dreaming', 'Enhanced awareness', 'Dream recall']
                },
                {
                    id: 'insomnia-relief',
                    title: 'Insomnia Relief',
                    description: 'Soothing patterns to quiet an overactive mind',
                    frequency: '2.5 Hz (Deep Delta)',
                    duration: 45,
                    visual: 'calmingSpirals',
                    benefits: ['Overcome insomnia', 'Mental quieting', 'Peaceful sleep']
                }
            ],
            focus: [
                {
                    id: 'laser-focus',
                    title: 'Laser Focus Enhancement',
                    description: 'Geometric patterns to enhance concentration and productivity',
                    frequency: '40 Hz (High Gamma)',
                    duration: 25,
                    visual: 'focusGeometry',
                    benefits: ['Enhanced focus', 'Increased productivity', 'Mental clarity']
                },
                {
                    id: 'creative-flow',
                    title: 'Creative Flow State',
                    description: 'Inspiring visuals to unlock creative potential',
                    frequency: '8-10 Hz (Alpha)',
                    duration: 30,
                    visual: 'creativePatterns',
                    benefits: ['Creative insights', 'Flow state', 'Innovative thinking']
                },
                {
                    id: 'study-concentration',
                    title: 'Study Concentration',
                    description: 'Balanced frequencies for optimal learning and retention',
                    frequency: '12-15 Hz (SMR)',
                    duration: 45,
                    visual: 'learningPatterns',
                    benefits: ['Better retention', 'Sustained focus', 'Learning enhancement']
                }
            ],
            healing: [
                {
                    id: 'cellular-healing',
                    title: 'Cellular Healing Frequency',
                    description: 'Regenerative frequencies with healing light patterns',
                    frequency: '528 Hz (Love Frequency)',
                    duration: 20,
                    visual: 'healingLight',
                    benefits: ['Cellular repair', 'DNA healing', 'Emotional balance']
                },
                {
                    id: 'energy-restoration',
                    title: 'Energy Field Restoration',
                    description: 'Restore and balance your energetic field',
                    frequency: '741 Hz (Intuition)',
                    duration: 25,
                    visual: 'energyFields',
                    benefits: ['Energy restoration', 'Aura cleansing', 'Vitality boost']
                },
                {
                    id: 'pain-relief',
                    title: 'Pain Relief & Recovery',
                    description: 'Therapeutic frequencies for physical healing',
                    frequency: '174 Hz (Foundation)',
                    duration: 30,
                    visual: 'healingWaves',
                    benefits: ['Pain relief', 'Muscle recovery', 'Physical healing']
                }
            ],
            stress: [
                {
                    id: 'anxiety-release',
                    title: 'Anxiety Release',
                    description: 'Calming patterns to release anxiety and tension',
                    frequency: '432 Hz (Natural Tuning)',
                    duration: 15,
                    visual: 'calmingBreaths',
                    benefits: ['Anxiety relief', 'Stress reduction', 'Emotional calm']
                },
                {
                    id: 'tension-relief',
                    title: 'Muscle Tension Relief',
                    description: 'Relaxing visuals to release physical and mental tension',
                    frequency: '10 Hz (Alpha Relaxation)',
                    duration: 20,
                    visual: 'relaxingFlows',
                    benefits: ['Muscle relaxation', 'Mental ease', 'Physical comfort']
                },
                {
                    id: 'overwhelm-support',
                    title: 'Overwhelm Support',
                    description: 'Grounding patterns for when life feels overwhelming',
                    frequency: '7.83 Hz (Grounding)',
                    duration: 25,
                    visual: 'groundingPatterns',
                    benefits: ['Emotional grounding', 'Mental clarity', 'Inner stability']
                }
            ],
            chakra: [
                {
                    id: 'root-chakra',
                    title: 'Root Chakra Balancing',
                    description: 'Ground and strengthen your foundation energy center',
                    frequency: '396 Hz (Root Chakra)',
                    duration: 12,
                    visual: 'rootChakra',
                    benefits: ['Grounding', 'Security', 'Stability']
                },
                {
                    id: 'heart-chakra',
                    title: 'Heart Chakra Opening',
                    description: 'Open and balance your heart energy center',
                    frequency: '639 Hz (Heart Chakra)',
                    duration: 15,
                    visual: 'heartChakra',
                    benefits: ['Unconditional love', 'Compassion', 'Emotional healing']
                },
                {
                    id: 'crown-chakra',
                    title: 'Crown Chakra Activation',
                    description: 'Connect with higher consciousness and spiritual awareness',
                    frequency: '963 Hz (Crown Chakra)',
                    duration: 18,
                    visual: 'crownChakra',
                    benefits: ['Spiritual connection', 'Higher awareness', 'Divine consciousness']
                }
            ]
        };
    }

    init() {
        this.canvas = document.getElementById('visualCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.renderSessions('meditation'); // Start with meditation category
    }

    setupEventListeners() {
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderSessions(e.target.dataset.category);
            });
        });

        // Control buttons
        document.getElementById('playBtn').addEventListener('click', () => this.startSession());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseSession());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopSession());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());

        // Navigation hamburger
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    renderSessions(category) {
        const grid = document.getElementById('sessionsGrid');
        const sessions = this.therapySessions[category] || [];
        
        grid.innerHTML = sessions.map(session => `
            <div class="session-card" onclick="consciousnessStudio.selectSession('${session.id}', '${category}')">
                <div class="session-preview"></div>
                <div class="session-info">
                    <h3>${session.title}</h3>
                    <p>${session.description}</p>
                    <div class="session-meta">
                        <span>⚡ ${session.frequency}</span>
                        <span>⏱️ ${session.duration} min</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    selectSession(sessionId, category) {
        const session = this.therapySessions[category].find(s => s.id === sessionId);
        if (!session) return;

        this.currentSession = session;
        this.sessionDuration = session.duration * 60; // Convert to seconds
        this.currentTime = 0;

        // Update active session display
        document.getElementById('sessionTitle').textContent = session.title;
        document.getElementById('sessionDescription').textContent = session.description;
        document.getElementById('sessionFrequency').textContent = `⚡ ${session.frequency}`;
        document.getElementById('sessionDuration').textContent = `⏱️ ${session.duration} min`;

        // Show active session
        document.getElementById('activeSession').style.display = 'block';
        document.getElementById('activeSession').scrollIntoView({ behavior: 'smooth' });

        // Reset controls
        this.showPlayButton();
        this.updateTimer();
        this.updateProgress();

        console.log(`🧘 Selected session: ${session.title}`);
    }

    startSession() {
        if (!this.currentSession) return;

        this.isPlaying = true;
        this.showPauseButton();
        this.startTimer();
        this.startVisuals();

        console.log(`🧘 Started session: ${this.currentSession.title}`);
    }

    pauseSession() {
        this.isPlaying = false;
        this.showPlayButton();
        this.stopTimer();
        this.stopVisuals();

        console.log('⏸️ Session paused');
    }

    stopSession() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.showPlayButton();
        this.stopTimer();
        this.stopVisuals();
        this.updateTimer();
        this.updateProgress();

        console.log('⏹️ Session stopped');
    }

    toggleFullscreen() {
        const activeSession = document.getElementById('activeSession');
        
        if (!document.fullscreenElement) {
            // Try different fullscreen methods for compatibility
            if (activeSession.requestFullscreen) {
                activeSession.requestFullscreen().then(() => {
                    activeSession.classList.add('fullscreen-mode');
                }).catch(err => {
                    console.log('Fullscreen request failed:', err);
                    this.enablePseudoFullscreen();
                });
            } else if (activeSession.webkitRequestFullscreen) {
                activeSession.webkitRequestFullscreen();
                activeSession.classList.add('fullscreen-mode');
            } else if (activeSession.msRequestFullscreen) {
                activeSession.msRequestFullscreen();
                activeSession.classList.add('fullscreen-mode');
            } else {
                this.enablePseudoFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then(() => {
                    activeSession.classList.remove('fullscreen-mode');
                });
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
                activeSession.classList.remove('fullscreen-mode');
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
                activeSession.classList.remove('fullscreen-mode');
            } else {
                this.disablePseudoFullscreen();
            }
        }
    }

    enablePseudoFullscreen() {
        const activeSession = document.getElementById('activeSession');
        activeSession.classList.add('fullscreen-mode');
        activeSession.style.position = 'fixed';
        activeSession.style.top = '0';
        activeSession.style.left = '0';
        activeSession.style.width = '100vw';
        activeSession.style.height = '100vh';
        activeSession.style.zIndex = '9999';
        activeSession.style.background = 'black';
        
        // Add close button for pseudo fullscreen
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 18px;
            cursor: pointer;
        `;
        closeBtn.id = 'pseudoFullscreenClose';
        closeBtn.onclick = () => this.disablePseudoFullscreen();
        activeSession.appendChild(closeBtn);
        
        console.log('🖥️ Pseudo fullscreen enabled');
    }

    disablePseudoFullscreen() {
        const activeSession = document.getElementById('activeSession');
        activeSession.classList.remove('fullscreen-mode');
        activeSession.style.position = '';
        activeSession.style.top = '';
        activeSession.style.left = '';
        activeSession.style.width = '';
        activeSession.style.height = '';
        activeSession.style.zIndex = '';
        activeSession.style.background = '';
        
        // Remove close button
        const closeBtn = document.getElementById('pseudoFullscreenClose');
        if (closeBtn) {
            closeBtn.remove();
        }
        
        console.log('🖥️ Pseudo fullscreen disabled');
    }

    showPlayButton() {
        document.getElementById('playBtn').style.display = 'flex';
        document.getElementById('pauseBtn').style.display = 'none';
    }

    showPauseButton() {
        document.getElementById('playBtn').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'flex';
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.currentTime++;
            this.updateTimer();
            this.updateProgress();

            if (this.currentTime >= this.sessionDuration) {
                this.stopSession();
                this.showCompletionMessage();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimer() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timerDisplay').textContent = display;
    }

    updateProgress() {
        const progress = (this.currentTime / this.sessionDuration) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }

    startVisuals() {
        if (!this.currentSession || !this.ctx) return;

        // Generate healing frequency sound (basic web audio)
        this.generateHealingTone();
        
        const visualType = this.currentSession.visual;
        this.animateVisual(visualType);
    }

    async generateHealingTone() {
        try {
            // Stop any existing audio first
            this.stopHealingTone();
            
            // Create Web Audio Context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            this.oscillator = this.audioContext.createOscillator();
            this.gainNode = this.audioContext.createGain();
            
            // Connect nodes
            this.oscillator.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);
            
            // Set frequency based on session
            const frequencyMap = {
                '7.83 Hz (Earth Resonance)': 110, // Make audible (base + binaural)
                '10 Hz (Alpha Waves)': 120,
                '6.3 Hz (Theta Waves)': 106.3,
                '1-4 Hz (Delta Waves)': 102,
                '40 Hz (Gamma Waves)': 140,
                '2.5 Hz (Deep Delta)': 102.5,
                '40 Hz (High Gamma)': 140,
                '8-10 Hz (Alpha)': 118,
                '12-15 Hz (SMR)': 126,
                '528 Hz (Love Frequency)': 528,
                '741 Hz (Intuition)': 741,
                '174 Hz (Foundation)': 174,
                '432 Hz (Natural Tuning)': 432,
                '7.83 Hz (Grounding)': 110,
                '396 Hz (Root Chakra)': 396,
                '639 Hz (Heart Chakra)': 639,
                '963 Hz (Crown Chakra)': 963
            };
            
            const frequency = frequencyMap[this.currentSession.frequency] || 110;
            
            // Set oscillator properties
            this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            this.oscillator.type = 'sine';
            
            // Set gentle volume with fade in
            this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            this.gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 3);
            
            // Start the tone
            this.oscillator.start();
            
            console.log(`🎵 Playing healing frequency: ${frequency} Hz`);
        } catch (error) {
            console.log('Audio generation failed:', error.message);
            // Try clicking to enable audio
            document.addEventListener('click', () => this.generateHealingTone(), { once: true });
        }
    }

    stopHealingTone() {
        try {
            if (this.oscillator) {
                this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
                this.oscillator.stop(this.audioContext.currentTime + 0.5);
                this.oscillator = null;
            }
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
            }
        } catch (error) {
            console.log('Error stopping audio:', error.message);
        }
    }

    stopVisuals() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.stopHealingTone();
    }

    animateVisual(type) {
        const animate = () => {
            if (!this.isPlaying) return;

            // Set canvas size first
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width || 800;
            this.canvas.height = rect.height || 400;
            
            // Ensure minimum dimensions
            if (this.canvas.width < 100) this.canvas.width = 800;
            if (this.canvas.height < 100) this.canvas.height = 400;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const time = Date.now() * 0.001; // Use timestamp for smooth animation

            switch(type) {
                case 'sacredGeometry':
                    this.drawSacredGeometry(time);
                    break;
                case 'flowingMandalas':
                    this.drawFlowingMandalas(time);
                    break;
                case 'cosmicPortals':
                    this.drawCosmicPortals(time);
                    break;
                case 'gentleWaves':
                    this.drawGentleWaves(time);
                    break;
                case 'healingLight':
                    this.drawHealingLight(time);
                    break;
                case 'focusGeometry':
                    this.drawFocusGeometry(time);
                    break;
                case 'calmingBreaths':
                    this.drawCalmingBreaths(time);
                    break;
                case 'rootChakra':
                    this.drawChakraVisual(time, '#ff0000', 'root');
                    break;
                case 'heartChakra':
                    this.drawChakraVisual(time, '#00ff00', 'heart');
                    break;
                case 'crownChakra':
                    this.drawChakraVisual(time, '#9400d3', 'crown');
                    break;
                default:
                    this.drawDefaultVisual(time);
            }

            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    drawSacredGeometry(time) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.6;

        // Dynamic cosmic background with nebula effects
        const bgGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(centerX, centerY));
        bgGradient.addColorStop(0, `rgba(118, 75, 162, ${0.4 + Math.sin(time * 0.3) * 0.2})`);
        bgGradient.addColorStop(0.3, `rgba(45, 27, 105, ${0.6 + Math.cos(time * 0.2) * 0.2})`);
        bgGradient.addColorStop(0.7, 'rgba(26, 26, 46, 0.8)');
        bgGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Floating cosmic particles
        for (let i = 0; i < 50; i++) {
            const x = (Math.sin(time * 0.1 + i) * centerX * 0.8) + centerX;
            const y = (Math.cos(time * 0.05 + i * 0.5) * centerY * 0.8) + centerY;
            const size = 1 + Math.sin(time + i) * 1.5;
            
            this.ctx.fillStyle = `rgba(116, 235, 213, ${0.3 + Math.sin(time + i) * 0.4})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, 2 * Math.PI);
            this.ctx.fill();
        }

        // Advanced Flower of Life with multiple layers
        for (let layer = 0; layer < 3; layer++) {
            const layerRadius = radius * (0.4 + layer * 0.2);
            const layerOpacity = 0.8 - layer * 0.2;
            const layerSpeed = 0.3 + layer * 0.1;
            
            this.ctx.strokeStyle = `rgba(116, 235, 213, ${layerOpacity + Math.sin(time * layerSpeed) * 0.3})`;
            this.ctx.lineWidth = 3 - layer * 0.5;
            this.ctx.shadowColor = '#74ebd5';
            this.ctx.shadowBlur = 15 + layer * 5;

            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3 + time * layerSpeed;
                const x = centerX + Math.cos(angle) * layerRadius * 0.5;
                const y = centerY + Math.sin(angle) * layerRadius * 0.5;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, layerRadius * 0.3, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
        }

        // Central sacred symbol with pulsing energy
        const pulseSize = Math.max(10, radius * (0.2 + Math.sin(time) * 0.1));
        this.ctx.fillStyle = `rgba(116, 235, 213, ${0.4 + Math.sin(time * 2) * 0.3})`;
        this.ctx.shadowColor = '#74ebd5';
        this.ctx.shadowBlur = 30;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, pulseSize, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 + Math.sin(time * 1.5) * 0.2})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, pulseSize, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        this.ctx.shadowBlur = 0; // Reset shadow
    }

    drawFlowingMandalas(time) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Dark background
        this.ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Multiple rotating mandalas
        for (let layer = 0; layer < 3; layer++) {
            const radius = (layer + 1) * 60;
            const speed = (layer + 1) * 0.002;
            const opacity = 0.6 - layer * 0.15;

            this.ctx.strokeStyle = `rgba(116, 235, 213, ${opacity})`;
            this.ctx.lineWidth = 2 - layer * 0.5;

            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI / 4) + (time * speed);
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;

                this.ctx.beginPath();
                this.ctx.arc(x, y, 20 - layer * 5, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
        }
    }

    drawCosmicPortals(time) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Cosmic background
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(centerX, centerY));
        gradient.addColorStop(0, 'rgba(118, 75, 162, 0.4)');
        gradient.addColorStop(0.5, 'rgba(45, 27, 105, 0.6)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Portal rings
        for (let i = 0; i < 5; i++) {
            const radius = (i + 1) * 40 + Math.sin(time + i) * 10;
            const opacity = 0.8 - i * 0.15;
            
            this.ctx.strokeStyle = `rgba(116, 235, 213, ${opacity})`;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            this.ctx.stroke();
        }

        // Portal energy
        this.ctx.fillStyle = `rgba(116, 235, 213, ${0.3 + Math.sin(time * 2) * 0.2})`;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawGentleWaves(time) {
        // Gentle sleep-inducing waves
        this.ctx.fillStyle = 'rgba(26, 26, 46, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const amplitude = 50;
        const frequency = 0.01;
        const speed = 0.5;

        for (let y = 0; y < this.canvas.height; y += 60) {
            this.ctx.strokeStyle = `rgba(116, 235, 213, ${0.3 + Math.sin(time + y * 0.01) * 0.2})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            
            for (let x = 0; x < this.canvas.width; x += 2) {
                const waveY = y + Math.sin((x * frequency) + (time * speed)) * amplitude;
                if (x === 0) {
                    this.ctx.moveTo(x, waveY);
                } else {
                    this.ctx.lineTo(x, waveY);
                }
            }
            this.ctx.stroke();
        }
    }

    drawHealingLight(time) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Multi-layered healing energy background
        const bgGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(centerX, centerY));
        bgGradient.addColorStop(0, `rgba(78, 205, 196, ${0.8 + Math.sin(time * 0.5) * 0.4})`);
        bgGradient.addColorStop(0.2, `rgba(116, 235, 213, ${0.6 + Math.cos(time * 0.3) * 0.3})`);
        bgGradient.addColorStop(0.5, 'rgba(45, 27, 105, 0.4)');
        bgGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Healing energy particles
        for (let i = 0; i < 80; i++) {
            const angle = (i / 80) * Math.PI * 2 + time * 0.2;
            const spiralRadius = (i / 80) * Math.min(centerX, centerY) * 0.8;
            const x = centerX + Math.cos(angle) * spiralRadius;
            const y = centerY + Math.sin(angle) * spiralRadius;
            const size = 2 + Math.sin(time * 2 + i * 0.1) * 2;
            
            this.ctx.fillStyle = `rgba(78, 205, 196, ${0.6 + Math.sin(time + i * 0.1) * 0.4})`;
            this.ctx.shadowColor = '#4ecdc4';
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, 2 * Math.PI);
            this.ctx.fill();
        }

        // Advanced healing rays with energy waves
        for (let i = 0; i < 16; i++) {
            const baseAngle = (i * Math.PI / 8) + time * 0.3;
            const length = Math.min(centerX, centerY) * 0.9;
            
            // Main ray
            const gradient = this.ctx.createLinearGradient(
                centerX, centerY,
                centerX + Math.cos(baseAngle) * length,
                centerY + Math.sin(baseAngle) * length
            );
            gradient.addColorStop(0, `rgba(78, 205, 196, ${0.8 + Math.sin(time + i) * 0.3})`);
            gradient.addColorStop(0.5, `rgba(116, 235, 213, ${0.6 + Math.cos(time + i) * 0.2})`);
            gradient.addColorStop(1, 'rgba(116, 235, 213, 0)');
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 4 + Math.sin(time * 2 + i) * 2;
            this.ctx.shadowColor = '#74ebd5';
            this.ctx.shadowBlur = 20;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(
                centerX + Math.cos(baseAngle) * length,
                centerY + Math.sin(baseAngle) * length
            );
            this.ctx.stroke();

            // Energy waves along the ray
            for (let j = 0; j < 5; j++) {
                const wavePos = (j / 5) * length;
                const waveSize = 8 + Math.sin(time * 3 + i + j) * 4;
                const waveX = centerX + Math.cos(baseAngle) * wavePos;
                const waveY = centerY + Math.sin(baseAngle) * wavePos;
                
                this.ctx.fillStyle = `rgba(116, 235, 213, ${0.5 + Math.sin(time * 2 + i + j) * 0.3})`;
                this.ctx.beginPath();
                this.ctx.arc(waveX, waveY, waveSize, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }

        // Central healing vortex
        for (let layer = 0; layer < 5; layer++) {
            const vortexRadius = (layer + 1) * 15;
            const rotation = time * (1 + layer * 0.2);
            const opacity = 0.7 - layer * 0.1;
            
            this.ctx.strokeStyle = `rgba(78, 205, 196, ${opacity + Math.sin(time * 2) * 0.2})`;
            this.ctx.lineWidth = 3 - layer * 0.4;
            this.ctx.shadowColor = '#4ecdc4';
            this.ctx.shadowBlur = 15;
            
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(rotation);
            
            this.ctx.beginPath();
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4;
                const x = Math.cos(angle) * vortexRadius;
                const y = Math.sin(angle) * vortexRadius;
                
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
        }
        
        this.ctx.shadowBlur = 0; // Reset shadow
    }

    drawFocusGeometry(time) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Sharp geometric patterns for focus
        this.ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Rotating triangles
        this.ctx.strokeStyle = `rgba(116, 235, 213, ${0.8 + Math.sin(time) * 0.2})`;
        this.ctx.lineWidth = 2;

        for (let i = 0; i < 6; i++) {
            const radius = 80 + i * 20;
            const rotation = time * (0.5 + i * 0.1);
            
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(rotation);
            
            this.ctx.beginPath();
            for (let j = 0; j < 3; j++) {
                const angle = (j * 2 * Math.PI) / 3;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                if (j === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    drawCalmingBreaths(time) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Breathing visualization
        const breathCycle = Math.sin(time * 0.1) * 0.5 + 0.5; // 0 to 1
        const radius = 50 + breathCycle * 100;
        
        // Background
        this.ctx.fillStyle = 'rgba(26, 26, 46, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Breathing circle
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, `rgba(116, 235, 213, ${0.6 * breathCycle})`);
        gradient.addColorStop(1, 'rgba(116, 235, 213, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.fill();

        // Breathing instruction text
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '20px Inter';
        this.ctx.textAlign = 'center';
        const instruction = breathCycle > 0.5 ? 'Breathe In' : 'Breathe Out';
        this.ctx.fillText(instruction, centerX, centerY);
    }

    drawChakraVisual(time, color, chakraType) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Chakra background
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(centerX, centerY));
        gradient.addColorStop(0, `${color}40`);
        gradient.addColorStop(1, 'rgba(26, 26, 46, 1)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Chakra energy rings
        for (let i = 0; i < 7; i++) {
            const radius = (i + 1) * 30;
            const opacity = 0.7 - i * 0.1;
            const rotation = time * (0.2 + i * 0.05);
            
            this.ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16)}`;
            this.ctx.lineWidth = 2;
            
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(rotation);
            
            // Draw chakra symbol (simplified)
            this.ctx.beginPath();
            for (let j = 0; j < 8; j++) {
                const angle = (j * Math.PI) / 4;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                if (j === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    drawDefaultVisual(time) {
        // Default consciousness visualization
        this.drawSacredGeometry(time);
    }

    showCompletionMessage() {
        // Simple completion notification
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-size: 2rem;
            font-weight: bold;
        `;
        overlay.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">✨</div>
                <div>Session Complete!</div>
                <div style="font-size: 1rem; margin-top: 1rem; opacity: 0.8;">
                    Thank you for your consciousness journey
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="margin-top: 2rem; padding: 1rem 2rem; border: none; border-radius: 25px; 
                               background: linear-gradient(45deg, #667eea, #764ba2); color: white; 
                               font-weight: bold; cursor: pointer;">
                    Complete
                </button>
            </div>
        `;
        document.body.appendChild(overlay);
    }
}

// Global instance
let consciousnessStudio;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    consciousnessStudio = new ConsciousnessTherapyStudio();
    consciousnessStudio.init();
    console.log('🧘 Consciousness Therapy Studio initialized');
});
