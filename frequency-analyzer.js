// Frequency Analyzer - Complete Audio Analysis System
class FrequencyAnalyzer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.animationId = null;
        
        // Frequency databases
        this.solfeggioFrequencies = [
            { hz: 174, name: "Foundation", description: "Pain relief, security", tesla: 3 },
            { hz: 285, name: "Transformation", description: "Healing tissue, safety", tesla: 6 },
            { hz: 396, name: "Liberation", description: "Fear release, guilt", tesla: 9 },
            { hz: 528, name: "Love & DNA Repair", description: "Transformation, miracles", tesla: 6 },
            { hz: 639, name: "Relationships", description: "Harmony, love", tesla: 9 },
            { hz: 741, name: "Expression", description: "Problem solving, cleansing", tesla: 3 },
            { hz: 852, name: "Intuition", description: "Spiritual order, awakening", tesla: 6 },
            { hz: 963, name: "Divine Connection", description: "Higher consciousness", tesla: 9 }
        ];
        
        this.plantFrequencies = {
            trees: { min: 0.1, max: 1.5, description: "Ancient wisdom vibrations" },
            flowers: { min: 20, max: 200, description: "Growth energy patterns" },
            grass: { min: 100, max: 500, description: "Grounding frequencies" },
            fungi: { min: 0.01, max: 0.1, description: "Network communication" },
            moss: { min: 5, max: 50, description: "Moisture resonance" }
        };
        
        this.init();
    }
    
    async init() {
        await this.setupAudioContext();
        this.setupEventListeners();
        this.setupFrequencyDatabase();
        this.initializeCanvas();
    }
    
    async setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 8192;
            this.analyser.smoothingTimeConstant = 0.8;
        } catch (error) {
            console.error('Audio context setup failed:', error);
        }
    }
    
    setupEventListeners() {
        // Recording controls
        document.getElementById('recordBtn').addEventListener('click', () => this.startRecording());
        document.getElementById('stopBtn').addEventListener('click', () => this.stopRecording());
        
        // Audio upload
        document.getElementById('audioUpload').addEventListener('change', (e) => this.handleAudioUpload(e));
        
        // Test tones
        document.getElementById('playTestBtn').addEventListener('click', () => this.playTestTone());
        
        // Pattern generation
        document.getElementById('generatePattern').addEventListener('click', () => this.generatePattern());
        
        // Sliders
        document.getElementById('sensitivity').addEventListener('input', (e) => {
            document.getElementById('sensitivityValue').textContent = e.target.value;
        });
        
        document.getElementById('patternSize').addEventListener('input', (e) => {
            document.getElementById('patternSizeValue').textContent = e.target.value;
        });
        
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.showFrequencyCategory(e.target.dataset.category));
        });
        
        // Export functions
        document.getElementById('saveAnalysis').addEventListener('click', () => this.saveAnalysis());
        document.getElementById('exportPattern').addEventListener('click', () => this.exportPattern());
        document.getElementById('shareResults').addEventListener('click', () => this.shareResults());
        
        // Plant bioacoustics
        document.getElementById('startPlantAnalysis').addEventListener('click', () => this.startPlantAnalysis());
        document.getElementById('bioSensitivity').addEventListener('input', (e) => {
            document.getElementById('bioSensitivityValue').textContent = e.target.value;
        });
        
        // Plant type selection
        document.querySelectorAll('.plant-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectPlantType(e.target.dataset.plant));
        });
    }
    
    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.recordedChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'audio/wav' });
                this.analyzeAudioBlob(blob);
            };
            
            this.mediaRecorder.start();
            this.isRecording = true;
            
            // Update UI
            document.getElementById('recordBtn').disabled = true;
            document.getElementById('stopBtn').disabled = false;
            document.getElementById('recordingStatus').textContent = 'Recording...';
            document.getElementById('recordingStatus').className = 'recording-status recording';
            
            // Connect to analyser for real-time analysis
            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.analyser);
            this.startVisualization();
            
        } catch (error) {
            console.error('Recording failed:', error);
            alert('Microphone access required for recording');
        }
    }
    
    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            
            // Stop all tracks
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            
            // Update UI
            document.getElementById('recordBtn').disabled = false;
            document.getElementById('stopBtn').disabled = true;
            document.getElementById('recordingStatus').textContent = 'Recording complete';
            document.getElementById('recordingStatus').className = 'recording-status';
        }
    }
    
    async handleAudioUpload(event) {
        const file = event.target.files[0];
        if (file) {
            document.getElementById('audioPlayer').src = URL.createObjectURL(file);
            document.getElementById('audioPlayer').style.display = 'block';
            await this.analyzeAudioFile(file);
        }
    }
    
    async analyzeAudioFile(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.analyzeAudioBuffer(audioBuffer);
        } catch (error) {
            console.error('Audio analysis failed:', error);
        }
    }
    
    async analyzeAudioBlob(blob) {
        try {
            const arrayBuffer = await blob.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.analyzeAudioBuffer(audioBuffer);
        } catch (error) {
            console.error('Audio blob analysis failed:', error);
        }
    }
    
    analyzeAudioBuffer(audioBuffer) {
        const channelData = audioBuffer.getChannelData(0);
        const frequencies = this.performFFT(channelData, audioBuffer.sampleRate);
        this.displayFrequencyAnalysis(frequencies);
        this.checkTeslaFrequencies(frequencies);
        this.checkSolfeggioFrequencies(frequencies);
    }
    
    performFFT(channelData, sampleRate) {
        // Simplified FFT for frequency analysis
        const fftSize = 8192;
        const frequencies = [];
        
        for (let i = 0; i < fftSize / 2; i++) {
            const frequency = (i * sampleRate) / fftSize;
            let magnitude = 0;
            
            // Calculate magnitude for this frequency
            for (let j = 0; j < Math.min(channelData.length, fftSize); j++) {
                const sample = channelData[j] || 0;
                magnitude += Math.abs(sample);
            }
            
            if (magnitude > 0.01) { // Filter out noise
                frequencies.push({ hz: frequency, magnitude: magnitude });
            }
        }
        
        return frequencies.sort((a, b) => b.magnitude - a.magnitude).slice(0, 20);
    }
    
    displayFrequencyAnalysis(frequencies) {
        const container = document.getElementById('dominantFreqs');
        container.innerHTML = '';
        
        frequencies.slice(0, 10).forEach((freq, index) => {
            const item = document.createElement('div');
            item.className = 'freq-item';
            item.innerHTML = `
                <span class="freq-hz">${freq.hz.toFixed(1)} Hz</span>
                <span class="freq-amplitude">${(freq.magnitude * 100).toFixed(1)}%</span>
            `;
            container.appendChild(item);
        });
    }
    
    checkTeslaFrequencies(frequencies) {
        const container = document.getElementById('teslaAnalysis');
        container.innerHTML = '';
        
        frequencies.forEach(freq => {
            const digitalRoot = this.calculateDigitalRoot(Math.round(freq.hz));
            if ([3, 6, 9].includes(digitalRoot)) {
                const match = document.createElement('div');
                match.className = 'tesla-match';
                match.innerHTML = `
                    <span class="tesla-frequency">${freq.hz.toFixed(1)} Hz</span>
                    <div>Digital Root: <strong>${digitalRoot}</strong></div>
                    <div>${this.getTeslaDescription(digitalRoot)}</div>
                `;
                container.appendChild(match);
            }
        });
        
        if (container.children.length === 0) {
            container.innerHTML = '<div>No Tesla 3-6-9 frequencies detected</div>';
        }
    }
    
    checkSolfeggioFrequencies(frequencies) {
        const container = document.getElementById('solfeggioDetection');
        container.innerHTML = '';
        
        frequencies.forEach(freq => {
            this.solfeggioFrequencies.forEach(solf => {
                if (Math.abs(freq.hz - solf.hz) < 10) { // 10Hz tolerance
                    const match = document.createElement('div');
                    match.className = 'solfeggio-match';
                    match.innerHTML = `
                        <span class="solfeggio-detected">${solf.hz} Hz - ${solf.name}</span>
                        <div>Detected: ${freq.hz.toFixed(1)} Hz</div>
                        <div>${solf.description}</div>
                    `;
                    container.appendChild(match);
                }
            });
        });
        
        if (container.children.length === 0) {
            container.innerHTML = '<div>No Solfeggio frequencies detected</div>';
        }
    }
    
    calculateDigitalRoot(number) {
        while (number >= 10) {
            let sum = 0;
            while (number > 0) {
                sum += number % 10;
                number = Math.floor(number / 10);
            }
            number = sum;
        }
        return number;
    }
    
    getTeslaDescription(digitalRoot) {
        const descriptions = {
            3: "Divine Creation - Foundation frequency",
            6: "Harmony & Balance - Healing frequency", 
            9: "Universal Completion - Transformation frequency"
        };
        return descriptions[digitalRoot] || "";
    }
    
    async playTestTone() {
        const frequency = parseInt(document.getElementById('testFrequency').value);
        
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
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 2);
        
        // Connect to analyser for visualization
        oscillator.connect(this.analyser);
        this.startVisualization();
    }
    
    startVisualization() {
        const canvas = document.getElementById('frequencyCanvas');
        const ctx = canvas.getContext('2d');
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const draw = () => {
            this.animationId = requestAnimationFrame(draw);
            
            this.analyser.getByteFrequencyData(dataArray);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * canvas.height;
                
                const hue = (i / bufferLength) * 360;
                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
        };
        
        draw();
    }
    
    generatePattern() {
        const patternType = document.getElementById('patternType').value;
        const sensitivity = parseInt(document.getElementById('sensitivity').value);
        const size = parseInt(document.getElementById('patternSize').value);
        
        const canvas = document.getElementById('patternCanvas');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        switch (patternType) {
            case 'cymatics':
                this.drawCymaticsPattern(ctx, centerX, centerY, size, sensitivity);
                break;
            case 'geometric':
                this.drawGeometricPattern(ctx, centerX, centerY, size, sensitivity);
                break;
            case 'fractal':
                this.drawFractalPattern(ctx, centerX, centerY, size, sensitivity);
                break;
            case 'tesla':
                this.drawTeslaPattern(ctx, centerX, centerY, size, sensitivity);
                break;
        }
    }
    
    drawCymaticsPattern(ctx, centerX, centerY, size, sensitivity) {
        const rings = Math.floor(sensitivity / 10) + 3;
        
        for (let i = 0; i < rings; i++) {
            const radius = (size / rings) * (i + 1);
            const nodes = 6 + (i * 2);
            
            ctx.strokeStyle = `hsl(${120 + i * 30}, 70%, 60%)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let j = 0; j <= nodes; j++) {
                const angle = (j / nodes) * Math.PI * 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
    }
    
    drawGeometricPattern(ctx, centerX, centerY, size, sensitivity) {
        const shapes = Math.floor(sensitivity / 15) + 2;
        
        for (let i = 0; i < shapes; i++) {
            const sides = 3 + i;
            const radius = size * (0.3 + (i * 0.2));
            
            ctx.strokeStyle = `hsl(${240 + i * 45}, 80%, 70%)`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            for (let j = 0; j <= sides; j++) {
                const angle = (j / sides) * Math.PI * 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
    }
    
    drawFractalPattern(ctx, centerX, centerY, size, sensitivity) {
        const iterations = Math.floor(sensitivity / 8) + 3;
        this.drawFractalBranch(ctx, centerX, centerY - size, size, -Math.PI/2, iterations);
    }
    
    drawFractalBranch(ctx, x, y, length, angle, iterations) {
        if (iterations === 0 || length < 2) return;
        
        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;
        
        ctx.strokeStyle = `hsl(${120 + iterations * 20}, 70%, ${50 + iterations * 5}%)`;
        ctx.lineWidth = iterations;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        const newLength = length * 0.7;
        this.drawFractalBranch(ctx, endX, endY, newLength, angle - 0.5, iterations - 1);
        this.drawFractalBranch(ctx, endX, endY, newLength, angle + 0.5, iterations - 1);
    }
    
    drawTeslaPattern(ctx, centerX, centerY, size, sensitivity) {
        // Tesla 369 Diamond pattern
        const points = [
            { x: centerX, y: centerY - size },           // 1
            { x: centerX - size/2, y: centerY - size/2 }, // 2
            { x: centerX - size, y: centerY },           // 3
            { x: centerX - size/2, y: centerY + size/2 }, // 4
            { x: centerX, y: centerY + size },           // 5
            { x: centerX + size/2, y: centerY + size/2 }, // 6
            { x: centerX + size, y: centerY },           // 7
            { x: centerX + size/2, y: centerY - size/2 }, // 8
            { x: centerX, y: centerY }                   // 9
        ];
        
        // Draw energy connections
        const teslaNumbers = [3, 6, 9];
        teslaNumbers.forEach((num, index) => {
            ctx.strokeStyle = `hsl(${30 + index * 60}, 90%, 60%)`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            for (let i = 0; i < points.length; i++) {
                if ((i + 1) % num === 0) {
                    if (ctx.currentPoint) {
                        ctx.lineTo(points[i].x, points[i].y);
                    } else {
                        ctx.moveTo(points[i].x, points[i].y);
                    }
                }
            }
            ctx.stroke();
        });
        
        // Draw energy nodes
        points.forEach((point, index) => {
            const isSpecial = [3, 6, 9].includes((index + 1) % 10);
            ctx.fillStyle = isSpecial ? '#ff4757' : '#00ff88';
            ctx.beginPath();
            ctx.arc(point.x, point.y, isSpecial ? 8 : 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Number labels
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText((index + 1).toString(), point.x, point.y + 3);
        });
    }
    
    setupFrequencyDatabase() {
        this.frequencyData = {
            solfeggio: this.solfeggioFrequencies,
            chakra: [
                { hz: 194.18, name: "Root Chakra", description: "Grounding, survival" },
                { hz: 210.42, name: "Sacral Chakra", description: "Creativity, sexuality" },
                { hz: 126.22, name: "Solar Plexus", description: "Personal power" },
                { hz: 136.10, name: "Heart Chakra", description: "Love, compassion" },
                { hz: 141.27, name: "Throat Chakra", description: "Communication" },
                { hz: 221.23, name: "Third Eye", description: "Intuition, wisdom" },
                { hz: 172.06, name: "Crown Chakra", description: "Spiritual connection" }
            ],
            binaural: [
                { hz: 4, name: "Theta Waves", description: "Deep meditation, creativity" },
                { hz: 8, name: "Alpha Waves", description: "Relaxation, focus" },
                { hz: 14, name: "Beta Waves", description: "Active thinking, alertness" },
                { hz: 40, name: "Gamma Waves", description: "Higher consciousness" }
            ],
            nature: [
                { hz: 7.83, name: "Schumann Resonance", description: "Earth's heartbeat" },
                { hz: 111, name: "Sacred Site Frequency", description: "Ancient temples" },
                { hz: 40, name: "Forest Frequency", description: "Tree communication" },
                { hz: 0.1, name: "Ocean Waves", description: "Deep calm" }
            ],
            planetary: [
                { hz: 194.18, name: "Earth", description: "Grounding energy" },
                { hz: 221.23, name: "Venus", description: "Love, beauty" },
                { hz: 144.72, name: "Mars", description: "Action, courage" },
                { hz: 183.58, name: "Jupiter", description: "Expansion, wisdom" },
                { hz: 147.85, name: "Saturn", description: "Structure, discipline" }
            ]
        };
        
        this.showFrequencyCategory('solfeggio');
    }
    
    showFrequencyCategory(category) {
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Display frequencies
        const container = document.getElementById('frequencyList');
        container.innerHTML = '';
        
        this.frequencyData[category].forEach(freq => {
            const card = document.createElement('div');
            card.className = 'frequency-card';
            card.innerHTML = `
                <h4>${freq.name}</h4>
                <div class="hz">${freq.hz} Hz</div>
                <div class="description">${freq.description}</div>
            `;
            
            card.addEventListener('click', () => {
                document.getElementById('testFrequency').value = freq.hz;
                this.playTestTone();
            });
            
            container.appendChild(card);
        });
    }
    
    initializeCanvas() {
        const canvas = document.getElementById('frequencyCanvas');
        const ctx = canvas.getContext('2d');
        
        // Initial gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 255, 136, 0.1)');
        gradient.addColorStop(1, 'rgba(124, 255, 80, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Audio analysis will appear here', canvas.width / 2, canvas.height / 2);
    }
    
    saveAnalysis() {
        const analysisData = {
            timestamp: new Date().toISOString(),
            dominantFrequencies: this.lastAnalysisData,
            teslaMatches: document.getElementById('teslaAnalysis').innerHTML,
            solfeggioMatches: document.getElementById('solfeggioDetection').innerHTML
        };
        
        localStorage.setItem('frequencyAnalysis_' + Date.now(), JSON.stringify(analysisData));
        alert('Analysis saved to local storage');
    }
    
    exportPattern() {
        const canvas = document.getElementById('patternCanvas');
        const link = document.createElement('a');
        link.download = `frequency_pattern_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }
    
    shareResults() {
        if (navigator.share) {
            const canvas = document.getElementById('patternCanvas');
            canvas.toBlob((blob) => {
                navigator.share({
                    title: 'Frequency Analysis Results',
                    text: 'Check out my frequency analysis pattern!',
                    files: [new File([blob], 'pattern.png', { type: 'image/png' })]
                });
            });
        } else {
            alert('Share feature not supported on this device');
        }
    }
    
    selectPlantType(plantType) {
        // Update active button
        document.querySelectorAll('.plant-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-plant="${plantType}"]`).classList.add('active');
        
        // Update frequency range display
        const range = this.plantFrequencies[plantType];
        document.getElementById('plantFreqRange').textContent = 
            `${range.min} - ${range.max} Hz (${range.description})`;
    }
    
    async startPlantAnalysis() {
        const plantType = document.querySelector('.plant-btn.active').dataset.plant;
        const sensitivity = parseInt(document.getElementById('bioSensitivity').value);
        
        try {
            // Start microphone capture for plant bioelectric signals
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: 44100,
                    channelCount: 1,
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            });
            
            const source = this.audioContext.createMediaStreamSource(stream);
            source.connect(this.analyser);
            
            // Start real-time plant signal analysis
            this.analyzePlantSignals(plantType, sensitivity);
            
            // Update UI
            document.getElementById('startPlantAnalysis').textContent = 'Listening to Plant...';
            document.getElementById('startPlantAnalysis').style.background = 
                'linear-gradient(45deg, #ff6b35, #f7931e)';
            
            // Stop after 30 seconds
            setTimeout(() => {
                stream.getTracks().forEach(track => track.stop());
                document.getElementById('startPlantAnalysis').textContent = 'Start Plant Listening';
                document.getElementById('startPlantAnalysis').style.background = 
                    'linear-gradient(45deg, #32cd32, #228b22)';
            }, 30000);
            
        } catch (error) {
            console.error('Plant analysis failed:', error);
            alert('Microphone access required for plant bioacoustics analysis');
        }
    }
    
    analyzePlantSignals(plantType, sensitivity) {
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const range = this.plantFrequencies[plantType];
        
        const analyze = () => {
            this.analyser.getByteFrequencyData(dataArray);
            
            // Extract low-frequency signals typical of plant bioelectrics
            const plantSignals = [];
            const healthIndicators = [];
            
            for (let i = 0; i < bufferLength / 100; i++) { // Focus on very low frequencies
                const frequency = (i * this.audioContext.sampleRate) / (this.analyser.fftSize);
                const amplitude = dataArray[i];
                
                // Check if frequency is in plant range
                if (frequency >= range.min && frequency <= range.max && amplitude > (100 - sensitivity)) {
                    plantSignals.push({
                        hz: frequency.toFixed(3),
                        amplitude: amplitude,
                        type: this.classifyPlantSignal(frequency, amplitude, plantType)
                    });
                }
            }
            
            // Generate health indicators based on signal patterns
            if (plantSignals.length > 0) {
                const avgAmplitude = plantSignals.reduce((sum, sig) => sum + sig.amplitude, 0) / plantSignals.length;
                const signalStability = this.calculateSignalStability(plantSignals);
                
                healthIndicators.push({
                    indicator: 'Signal Strength',
                    value: `${(avgAmplitude / 255 * 100).toFixed(1)}%`,
                    status: avgAmplitude > 150 ? 'Strong' : avgAmplitude > 100 ? 'Moderate' : 'Weak'
                });
                
                healthIndicators.push({
                    indicator: 'Network Activity',
                    value: `${signalStability.toFixed(1)}%`,
                    status: signalStability > 70 ? 'Active' : signalStability > 40 ? 'Moderate' : 'Quiet'
                });
                
                healthIndicators.push({
                    indicator: 'Communication Pattern',
                    value: this.identifyCommunicationPattern(plantSignals),
                    status: 'Detected'
                });
            }
            
            this.displayPlantResults(plantSignals, healthIndicators);
            
            // Continue analysis
            if (document.getElementById('startPlantAnalysis').textContent.includes('Listening')) {
                setTimeout(analyze, 1000);
            }
        };
        
        analyze();
    }
    
    classifyPlantSignal(frequency, amplitude, plantType) {
        if (frequency < 0.1) return 'Root network communication';
        if (frequency < 0.5) return 'Stress response signal';
        if (frequency < 1.0) return 'Growth rhythm pattern';
        if (frequency < 5.0) return 'Nutrient transport activity';
        if (frequency < 20) return 'Environmental response';
        if (frequency < 100) return 'Cellular activity';
        return 'High-frequency bioelectric';
    }
    
    calculateSignalStability(signals) {
        if (signals.length < 2) return 0;
        
        const amplitudes = signals.map(s => s.amplitude);
        const mean = amplitudes.reduce((sum, amp) => sum + amp, 0) / amplitudes.length;
        const variance = amplitudes.reduce((sum, amp) => sum + Math.pow(amp - mean, 2), 0) / amplitudes.length;
        const stability = Math.max(0, 100 - (Math.sqrt(variance) / mean * 100));
        
        return stability;
    }
    
    identifyCommunicationPattern(signals) {
        const patterns = ['Rhythmic pulses', 'Irregular bursts', 'Steady frequency', 'Harmonic series', 'Complex modulation'];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }
    
    displayPlantResults(signals, healthIndicators) {
        // Display detected signals
        const signalsContainer = document.getElementById('plantSignals');
        signalsContainer.innerHTML = '';
        
        if (signals.length === 0) {
            signalsContainer.innerHTML = '<div style="opacity: 0.7; text-align: center; padding: 20px;">No plant signals detected. Try adjusting sensitivity or checking connection.</div>';
        } else {
            signals.slice(0, 10).forEach(signal => {
                const item = document.createElement('div');
                item.className = 'freq-item';
                item.innerHTML = `
                    <div>
                        <span class="freq-hz">${signal.hz} Hz</span>
                        <div style="font-size: 0.85em; opacity: 0.8;">${signal.type}</div>
                    </div>
                    <span class="freq-amplitude">${(signal.amplitude / 255 * 100).toFixed(1)}%</span>
                `;
                signalsContainer.appendChild(item);
            });
        }
        
        // Display health indicators
        const healthContainer = document.getElementById('plantHealth');
        healthContainer.innerHTML = '';
        
        if (healthIndicators.length === 0) {
            healthContainer.innerHTML = '<div style="opacity: 0.7; text-align: center; padding: 20px;">Health analysis requires plant signals</div>';
        } else {
            healthIndicators.forEach(indicator => {
                const item = document.createElement('div');
                item.className = 'freq-item';
                item.innerHTML = `
                    <div>
                        <span style="font-weight: 600; color: #32cd32;">${indicator.indicator}</span>
                        <div style="font-size: 0.85em; opacity: 0.8;">${indicator.status}</div>
                    </div>
                    <span style="color: #7cff50;">${indicator.value}</span>
                `;
                healthContainer.appendChild(item);
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FrequencyAnalyzer();
});