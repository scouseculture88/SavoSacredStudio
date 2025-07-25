// Pattern Learning Path JavaScript
// Comprehensive learning system for pattern mathematics

class PatternLearningPath {
    constructor() {
        this.currentLesson = null;
        this.completedLessons = [];
        this.currentLevel = 'Beginner';
        this.totalLessons = 20;
        this.studyNotes = '';
        this.achievements = [];
        
        // Load saved progress
        this.loadProgress();
        
        // Initialize the system
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateProgressDisplay();
        this.unlockFirstLesson();
        this.loadStudyNotes();
    }
    
    setupEventListeners() {
        // Lesson item clicks
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', () => {
                const lessonId = item.dataset.lesson;
                if (item.classList.contains('unlocked') || item.classList.contains('completed')) {
                    this.openLesson(lessonId);
                }
            });
        });
        
        // Module card clicks
        document.querySelectorAll('.module-card').forEach(card => {
            card.addEventListener('click', () => {
                const moduleId = card.dataset.module;
                this.highlightModule(moduleId);
            });
        });
        
        // Notes auto-save
        const notesTextarea = document.getElementById('study-notes');
        if (notesTextarea) {
            notesTextarea.addEventListener('input', () => {
                this.studyNotes = notesTextarea.value;
                this.saveProgress();
            });
        }
    }
    
    unlockFirstLesson() {
        // Unlock the first lesson in basic mathematics
        const firstLesson = document.querySelector('[data-lesson="coordinates"]');
        if (firstLesson) {
            firstLesson.classList.add('unlocked');
            firstLesson.querySelector('.lesson-status').textContent = '🔓';
        }
    }
    
    openLesson(lessonId) {
        this.currentLesson = lessonId;
        const lessonContent = this.getLessonContent(lessonId);
        
        // Update lesson viewer
        const viewer = document.getElementById('lesson-viewer');
        if (viewer) {
            viewer.innerHTML = lessonContent;
        }
        
        // Mark as completed if not already
        if (!this.completedLessons.includes(lessonId)) {
            this.markLessonCompleted(lessonId);
        }
        
        // Scroll to lesson viewer
        viewer.scrollIntoView({ behavior: 'smooth' });
    }
    
    getLessonContent(lessonId) {
        const lessons = {
            'coordinates': {
                title: 'Coordinate Systems',
                content: `
                    <div class="lesson-content active">
                        <h3>🔢 Coordinate Systems</h3>
                        <p>Understanding coordinate systems is fundamental to pattern creation. Every point in a pattern has a specific location defined by coordinates.</p>
                        
                        <div class="formula">
                            Point P = (x, y)<br>
                            Where x = horizontal position, y = vertical position
                        </div>
                        
                        <div class="example">
                            <h4>Example: Pattern Grid</h4>
                            <p>In a 400x400 canvas:</p>
                            <ul>
                                <li>Top-left corner: (0, 0)</li>
                                <li>Center: (200, 200)</li>
                                <li>Bottom-right: (400, 400)</li>
                            </ul>
                        </div>
                        
                        <p>This coordinate system allows us to precisely place pattern elements and calculate relationships between them.</p>
                        
                        <div class="lesson-actions">
                            <button class="btn btn-secondary" onclick="learningPath.previousLesson()">Previous</button>
                            <button class="btn btn-primary" onclick="learningPath.nextLesson()">Next Lesson</button>
                        </div>
                    </div>
                `
            },
            'distance': {
                title: 'Distance Calculations',
                content: `
                    <div class="lesson-content active">
                        <h3>📏 Distance Calculations</h3>
                        <p>Calculating distances between points helps us create properly spaced patterns and understand spatial relationships.</p>
                        
                        <div class="formula">
                            Euclidean Distance = √[(x₂-x₁)² + (y₂-y₁)²]
                        </div>
                        
                        <div class="example">
                            <h4>Example: Pattern Spacing</h4>
                            <p>Distance between two camouflage spots:</p>
                            <p>Point A: (100, 150), Point B: (200, 250)</p>
                            <p>Distance = √[(200-100)² + (250-150)²] = √[100² + 100²] = √20000 ≈ 141.4 pixels</p>
                        </div>
                        
                        <p>This helps maintain consistent spacing in tactical patterns and creates natural-looking distributions.</p>
                        
                        <div class="lesson-actions">
                            <button class="btn btn-secondary" onclick="learningPath.previousLesson()">Previous</button>
                            <button class="btn btn-primary" onclick="learningPath.nextLesson()">Next Lesson</button>
                        </div>
                    </div>
                `
            },
            'fibonacci': {
                title: 'Fibonacci Sequence',
                content: `
                    <div class="lesson-content active">
                        <h3>🌿 Fibonacci Sequence</h3>
                        <p>The Fibonacci sequence appears throughout nature and creates visually pleasing patterns when applied to tactical design.</p>
                        
                        <div class="formula">
                            F(n) = F(n-1) + F(n-2)<br>
                            Sequence: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...
                        </div>
                        
                        <div class="example">
                            <h4>Example: Natural Spacing</h4>
                            <p>Using Fibonacci numbers for pattern element sizes:</p>
                            <ul>
                                <li>Small elements: 3px, 5px, 8px</li>
                                <li>Medium elements: 13px, 21px, 34px</li>
                                <li>Large elements: 55px, 89px</li>
                            </ul>
                        </div>
                        
                        <p>This creates natural-looking size variations that our eyes find pleasing because they mirror nature's own patterns.</p>
                        
                        <div class="lesson-actions">
                            <button class="btn btn-secondary" onclick="learningPath.previousLesson()">Previous</button>
                            <button class="btn btn-primary" onclick="learningPath.nextLesson()">Next Lesson</button>
                        </div>
                    </div>
                `
            },
            'golden-ratio': {
                title: 'Golden Ratio Explained',
                content: `
                    <div class="lesson-content active">
                        <h3>✨ Golden Ratio Explained</h3>
                        <p>The golden ratio (φ = 1.618...) creates the most aesthetically pleasing proportions found in nature and effective camouflage.</p>
                        
                        <div class="formula">
                            φ = (1 + √5) / 2 ≈ 1.618033988749...<br>
                            Golden Rectangle: width/height = φ
                        </div>
                        
                        <div class="example">
                            <h4>Example: Pattern Proportions</h4>
                            <p>For a 400px wide pattern area:</p>
                            <p>Height = 400 / 1.618 ≈ 247px</p>
                            <p>This creates naturally pleasing proportions that work well for tactical applications.</p>
                        </div>
                        
                        <p>The golden ratio appears in pinecones, flower petals, and tree branches - making it perfect for forest camouflage patterns.</p>
                        
                        <div class="lesson-actions">
                            <button class="btn btn-secondary" onclick="learningPath.previousLesson()">Previous</button>
                            <button class="btn btn-primary" onclick="learningPath.nextLesson()">Next Lesson</button>
                        </div>
                    </div>
                `
            },
            'fractal-basics': {
                title: 'What Are Fractals?',
                content: `
                    <div class="lesson-content active">
                        <h3>🔄 What Are Fractals?</h3>
                        <p>Fractals are self-similar patterns that repeat at different scales. They're perfect for creating realistic natural textures in camouflage.</p>
                        
                        <div class="formula">
                            Self-similarity: Pattern looks similar at all zoom levels<br>
                            Recursion: Each part contains a smaller copy of the whole
                        </div>
                        
                        <div class="example">
                            <h4>Example: Tree Branches</h4>
                            <p>A tree branch:</p>
                            <ul>
                                <li>Splits into smaller branches</li>
                                <li>Each small branch splits again</li>
                                <li>Pattern repeats at every scale</li>
                                <li>Creates realistic tree-like structures</li>
                            </ul>
                        </div>
                        
                        <p>This principle helps create camouflage that looks natural because it mimics how nature actually grows and develops.</p>
                        
                        <div class="lesson-actions">
                            <button class="btn btn-secondary" onclick="learningPath.previousLesson()">Previous</button>
                            <button class="btn btn-primary" onclick="learningPath.nextLesson()">Next Lesson</button>
                        </div>
                    </div>
                `
            },
            'perlin-noise': {
                title: 'Perlin Noise Algorithm',
                content: `
                    <div class="lesson-content active">
                        <h3>🌊 Perlin Noise Algorithm</h3>
                        <p>Perlin noise creates smooth, natural-looking randomness that's perfect for organic camouflage textures.</p>
                        
                        <div class="formula">
                            noise(x, y) = interpolated random values<br>
                            Multi-octave: Σ(amplitude × noise(frequency × position))
                        </div>
                        
                        <div class="example">
                            <h4>Example: Terrain Texture</h4>
                            <p>Creating forest ground texture:</p>
                            <ul>
                                <li>Low frequency: overall terrain shape</li>
                                <li>Medium frequency: rocks and bumps</li>
                                <li>High frequency: fine details</li>
                                <li>Combined: realistic ground texture</li>
                            </ul>
                        </div>
                        
                        <p>Unlike pure randomness, Perlin noise creates coherent patterns that look natural to the human eye.</p>
                        
                        <div class="lesson-actions">
                            <button class="btn btn-secondary" onclick="learningPath.previousLesson()">Previous</button>
                            <button class="btn btn-primary" onclick="learningPath.nextLesson()">Next Lesson</button>
                        </div>
                    </div>
                `
            },
            'color-spaces': {
                title: 'Color Spaces (RGB, HSL)',
                content: `
                    <div class="lesson-content active">
                        <h3>🎨 Color Spaces (RGB, HSL)</h3>
                        <p>Understanding different color spaces helps create more effective and harmonious camouflage patterns.</p>
                        
                        <div class="formula">
                            RGB: Red, Green, Blue (0-255 each)<br>
                            HSL: Hue (0-360°), Saturation (0-100%), Lightness (0-100%)
                        </div>
                        
                        <div class="example">
                            <h4>Example: Forest Colors</h4>
                            <p>Converting forest green:</p>
                            <ul>
                                <li>RGB: (45, 80, 22) - hard to adjust</li>
                                <li>HSL: (95°, 57%, 20%) - easy to modify</li>
                                <li>Adjust hue: shift green tone</li>
                                <li>Adjust saturation: make more/less vivid</li>
                            </ul>
                        </div>
                        
                        <p>HSL is particularly useful for creating color variations while maintaining the overall character of the pattern.</p>
                        
                        <div class="lesson-actions">
                            <button class="btn btn-secondary" onclick="learningPath.previousLesson()">Previous</button>
                            <button class="btn btn-primary" onclick="learningPath.nextLesson()">Next Lesson</button>
                        </div>
                    </div>
                `
            }
        };
        
        return lessons[lessonId] ? lessons[lessonId].content : '<div class="lesson-placeholder"><h3>Lesson not found</h3></div>';
    }
    
    markLessonCompleted(lessonId) {
        if (!this.completedLessons.includes(lessonId)) {
            this.completedLessons.push(lessonId);
            
            // Update UI
            const lessonElement = document.querySelector(`[data-lesson="${lessonId}"]`);
            if (lessonElement) {
                lessonElement.classList.add('completed');
                lessonElement.querySelector('.lesson-status').textContent = '✅';
            }
            
            // Unlock next lesson
            this.unlockNextLesson(lessonId);
            
            // Update progress
            this.updateProgressDisplay();
            
            // Check for achievements
            this.checkAchievements();
            
            // Save progress
            this.saveProgress();
        }
    }
    
    unlockNextLesson(completedLessonId) {
        const lessonOrder = [
            'coordinates', 'distance', 'angles', 'trigonometry', 'vectors',
            'fibonacci', 'golden-ratio', 'spirals', 'plant-patterns',
            'fractal-basics', 'fractal-dimension', 'tree-fractals', 'mandelbrot', 'fractal-camo',
            'perlin-noise', 'simplex-noise', 'turbulence',
            'color-spaces', 'color-harmony', 'color-mixing'
        ];
        
        const currentIndex = lessonOrder.indexOf(completedLessonId);
        if (currentIndex !== -1 && currentIndex < lessonOrder.length - 1) {
            const nextLessonId = lessonOrder[currentIndex + 1];
            const nextLessonElement = document.querySelector(`[data-lesson="${nextLessonId}"]`);
            if (nextLessonElement) {
                nextLessonElement.classList.add('unlocked');
                nextLessonElement.querySelector('.lesson-status').textContent = '🔓';
            }
        }
    }
    
    updateProgressDisplay() {
        const completedCount = this.completedLessons.length;
        const progressPercentage = (completedCount / this.totalLessons) * 100;
        
        // Update progress stats
        document.getElementById('completed-lessons').textContent = completedCount;
        document.getElementById('total-lessons').textContent = this.totalLessons;
        document.getElementById('current-level').textContent = this.getCurrentLevel();
        
        // Update progress bar
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
        
        // Update module progress
        this.updateModuleProgress();
    }
    
    updateModuleProgress() {
        const modules = {
            'basic': ['coordinates', 'distance', 'angles', 'trigonometry', 'vectors'],
            'golden': ['fibonacci', 'golden-ratio', 'spirals', 'plant-patterns'],
            'fractals': ['fractal-basics', 'fractal-dimension', 'tree-fractals', 'mandelbrot', 'fractal-camo'],
            'noise': ['perlin-noise', 'simplex-noise', 'turbulence'],
            'color': ['color-spaces', 'color-harmony', 'color-mixing']
        };
        
        Object.entries(modules).forEach(([moduleId, lessons]) => {
            const completedInModule = lessons.filter(lesson => 
                this.completedLessons.includes(lesson)
            ).length;
            
            const moduleCard = document.querySelector(`[data-module="${moduleId}"]`);
            if (moduleCard) {
                const progressText = moduleCard.querySelector('.progress-text');
                const progressFill = moduleCard.querySelector('.progress-mini-fill');
                
                if (progressText) {
                    progressText.textContent = `${completedInModule}/${lessons.length} lessons`;
                }
                
                if (progressFill) {
                    const percentage = (completedInModule / lessons.length) * 100;
                    progressFill.style.width = `${percentage}%`;
                }
            }
        });
    }
    
    getCurrentLevel() {
        const completedCount = this.completedLessons.length;
        if (completedCount >= 18) return 'Expert';
        if (completedCount >= 12) return 'Advanced';
        if (completedCount >= 6) return 'Intermediate';
        return 'Beginner';
    }
    
    checkAchievements() {
        const achievements = {
            'first-steps': () => this.completedLessons.length >= 1,
            'nature-mathematician': () => ['fibonacci', 'golden-ratio', 'spirals', 'plant-patterns'].every(l => 
                this.completedLessons.includes(l)
            ),
            'fractal-explorer': () => ['fractal-basics', 'fractal-dimension', 'tree-fractals', 'mandelbrot', 'fractal-camo'].every(l => 
                this.completedLessons.includes(l)
            ),
            'pattern-genius': () => this.completedLessons.length >= 20,
            'speed-learner': () => this.checkSpeedLearning()
        };
        
        Object.entries(achievements).forEach(([achievementId, condition]) => {
            if (condition() && !this.achievements.includes(achievementId)) {
                this.unlockAchievement(achievementId);
            }
        });
    }
    
    unlockAchievement(achievementId) {
        this.achievements.push(achievementId);
        
        // Update UI
        const achievementCards = document.querySelectorAll('.achievement-card');
        achievementCards.forEach(card => {
            if (card.textContent.toLowerCase().includes(achievementId.replace('-', ' '))) {
                card.classList.remove('locked');
                card.classList.add('unlocked');
            }
        });
        
        // Show notification
        this.showNotification(`Achievement unlocked: ${achievementId.replace('-', ' ')}!`, 'success');
        
        this.saveProgress();
    }
    
    checkSpeedLearning() {
        // Check if 5 lessons were completed in one day
        const today = new Date().toDateString();
        const todayLessons = this.completedLessons.filter(lesson => {
            const lessonDate = localStorage.getItem(`lesson-${lesson}-date`);
            return lessonDate && new Date(lessonDate).toDateString() === today;
        });
        
        return todayLessons.length >= 5;
    }
    
    highlightModule(moduleId) {
        // Remove existing highlights
        document.querySelectorAll('.module-card').forEach(card => {
            card.classList.remove('highlighted');
        });
        
        // Add highlight to selected module
        const moduleCard = document.querySelector(`[data-module="${moduleId}"]`);
        if (moduleCard) {
            moduleCard.classList.add('highlighted');
        }
    }
    
    saveNotes() {
        const notes = document.getElementById('study-notes').value;
        localStorage.setItem('pattern-learning-notes', notes);
        this.showNotification('Notes saved successfully!', 'success');
    }
    
    exportNotes() {
        const notes = document.getElementById('study-notes').value;
        const blob = new Blob([notes], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pattern-learning-notes.txt';
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Notes exported successfully!', 'success');
    }
    
    loadStudyNotes() {
        const notes = localStorage.getItem('pattern-learning-notes');
        if (notes) {
            const notesTextarea = document.getElementById('study-notes');
            if (notesTextarea) {
                notesTextarea.value = notes;
            }
        }
    }
    
    saveProgress() {
        const progress = {
            completedLessons: this.completedLessons,
            currentLevel: this.currentLevel,
            achievements: this.achievements,
            studyNotes: this.studyNotes
        };
        
        localStorage.setItem('pattern-learning-progress', JSON.stringify(progress));
    }
    
    loadProgress() {
        const saved = localStorage.getItem('pattern-learning-progress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.completedLessons = progress.completedLessons || [];
            this.currentLevel = progress.currentLevel || 'Beginner';
            this.achievements = progress.achievements || [];
            this.studyNotes = progress.studyNotes || '';
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            z-index: 1000;
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
    
    nextLesson() {
        // Logic to move to next lesson
        const lessonOrder = [
            'coordinates', 'distance', 'angles', 'trigonometry', 'vectors',
            'fibonacci', 'golden-ratio', 'spirals', 'plant-patterns',
            'fractal-basics', 'fractal-dimension', 'tree-fractals', 'mandelbrot', 'fractal-camo',
            'perlin-noise', 'simplex-noise', 'turbulence',
            'color-spaces', 'color-harmony', 'color-mixing'
        ];
        
        const currentIndex = lessonOrder.indexOf(this.currentLesson);
        if (currentIndex !== -1 && currentIndex < lessonOrder.length - 1) {
            this.openLesson(lessonOrder[currentIndex + 1]);
        }
    }
    
    previousLesson() {
        // Logic to move to previous lesson
        const lessonOrder = [
            'coordinates', 'distance', 'angles', 'trigonometry', 'vectors',
            'fibonacci', 'golden-ratio', 'spirals', 'plant-patterns',
            'fractal-basics', 'fractal-dimension', 'tree-fractals', 'mandelbrot', 'fractal-camo',
            'perlin-noise', 'simplex-noise', 'turbulence',
            'color-spaces', 'color-harmony', 'color-mixing'
        ];
        
        const currentIndex = lessonOrder.indexOf(this.currentLesson);
        if (currentIndex > 0) {
            this.openLesson(lessonOrder[currentIndex - 1]);
        }
    }
}

// Exercise functions
function startExercise(exerciseType) {
    const exercises = {
        'recognition': () => {
            alert('Pattern Recognition Exercise: Identify the mathematical patterns in the images that will appear. This exercise helps train your eye to spot geometric relationships in natural forms.');
        },
        'calculator': () => {
            alert('Geometry Calculator Exercise: You will be given pattern coordinates and asked to calculate distances, angles, and proportions. This builds practical mathematical skills.');
        },
        'fractal': () => {
            alert('Fractal Builder Exercise: Create your own fractal patterns by adjusting iteration counts and parameters. This hands-on approach reinforces fractal concepts.');
        },
        'color': () => {
            alert('Color Theory Quiz: Test your understanding of color mathematics, harmony relationships, and HSL/RGB conversions. This validates your color theory knowledge.');
        }
    };
    
    if (exercises[exerciseType]) {
        exercises[exerciseType]();
    }
}

// Global functions for buttons
function saveNotes() {
    if (window.learningPath) {
        window.learningPath.saveNotes();
    }
}

function exportNotes() {
    if (window.learningPath) {
        window.learningPath.exportNotes();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.learningPath = new PatternLearningPath();
});
