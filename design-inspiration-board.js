// Design Inspiration Board JavaScript
// Interactive mood board for collecting and organizing design inspiration

class DesignInspirationBoard {
    constructor() {
        this.inspirations = [];
        this.filteredInspirations = [];
        this.currentFilter = { category: 'all', mood: '', search: '' };
        this.viewMode = 'grid';
        this.currentInspiration = null;
        
        this.init();
    }
    
    init() {
        this.loadInspirations();
        this.setupEventListeners();
        this.renderInspirations();
        this.generateSampleInspirations();
    }
    
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-tag').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleFilterClick(e.target);
            });
        });
        
        // Search input
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            this.currentFilter.search = e.target.value.toLowerCase();
            this.applyFilters();
        });
        
        // Form submission
        document.getElementById('inspiration-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
        
        // File upload
        const fileInput = document.getElementById('image-upload');
        const uploadArea = document.getElementById('upload-area');
        
        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#7cff50';
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#444444';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#444444';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleFileUpload(file);
            }
        });
    }
    
    handleFilterClick(button) {
        const filterType = button.dataset.category ? 'category' : 'mood';
        const filterValue = button.dataset.category || button.dataset.mood;
        
        // Remove active class from siblings
        button.parentElement.querySelectorAll('.filter-tag').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update filter
        this.currentFilter[filterType] = filterValue;
        this.applyFilters();
    }
    
    applyFilters() {
        this.filteredInspirations = this.inspirations.filter(inspiration => {
            const matchesCategory = this.currentFilter.category === 'all' || 
                                  inspiration.category === this.currentFilter.category;
            const matchesMood = !this.currentFilter.mood || 
                              inspiration.mood === this.currentFilter.mood;
            const matchesSearch = !this.currentFilter.search || 
                                inspiration.title.toLowerCase().includes(this.currentFilter.search) ||
                                inspiration.description.toLowerCase().includes(this.currentFilter.search) ||
                                inspiration.tags.some(tag => tag.toLowerCase().includes(this.currentFilter.search));
            
            return matchesCategory && matchesMood && matchesSearch;
        });
        
        this.renderInspirations();
    }
    
    renderInspirations() {
        const board = document.getElementById('inspiration-board');
        
        if (this.filteredInspirations.length === 0) {
            board.innerHTML = `
                <div class="empty-state">
                    <i data-feather="image"></i>
                    <h3>No inspiration found</h3>
                    <p>Try adjusting your filters or add some new inspiration to get started.</p>
                    <button class="btn btn-primary" onclick="showUploadModal()">
                        <i data-feather="plus"></i>
                        Add Inspiration
                    </button>
                </div>
            `;
            feather.replace();
            return;
        }
        
        board.innerHTML = this.filteredInspirations.map(inspiration => 
            this.createInspirationCard(inspiration)
        ).join('');
        
        // Add click listeners to cards
        board.querySelectorAll('.inspiration-card').forEach(card => {
            card.addEventListener('click', () => {
                const inspirationId = card.dataset.id;
                this.showInspirationDetail(inspirationId);
            });
        });
        
        feather.replace();
    }
    
    createInspirationCard(inspiration) {
        const imageHtml = inspiration.imageUrl ? 
            `<img src="${inspiration.imageUrl}" alt="${inspiration.title}">` :
            `<div class="placeholder"><i data-feather="image"></i></div>`;
        
        const tagsHtml = inspiration.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
        
        return `
            <div class="inspiration-card fade-in" data-id="${inspiration.id}">
                <div class="card-image">
                    ${imageHtml}
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${inspiration.title}</h3>
                        <span class="card-category">${inspiration.category}</span>
                    </div>
                    <p class="card-description">${inspiration.description}</p>
                    <div class="card-tags">
                        ${tagsHtml}
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); extractColors('${inspiration.id}')">
                            <i data-feather="palette"></i>
                            Colors
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); analyzePattern('${inspiration.id}')">
                            <i data-feather="target"></i>
                            Analyze
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    showInspirationDetail(inspirationId) {
        const inspiration = this.inspirations.find(i => i.id === inspirationId);
        if (!inspiration) return;
        
        this.currentInspiration = inspiration;
        
        // Populate detail modal
        document.getElementById('detail-title').textContent = inspiration.title;
        document.getElementById('detail-description').textContent = inspiration.description;
        document.getElementById('detail-category').textContent = inspiration.category;
        document.getElementById('detail-mood').textContent = inspiration.mood;
        
        const detailImage = document.getElementById('detail-image');
        if (inspiration.imageUrl) {
            detailImage.src = inspiration.imageUrl;
            detailImage.style.display = 'block';
        } else {
            detailImage.style.display = 'none';
        }
        
        // Populate tags
        const tagsContainer = document.getElementById('detail-tags');
        tagsContainer.innerHTML = inspiration.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
        
        // Show modal
        document.getElementById('detail-modal').classList.add('active');
    }
    
    handleFormSubmit() {
        const form = document.getElementById('inspiration-form');
        const formData = new FormData(form);
        
        const inspiration = {
            id: Date.now().toString(),
            title: document.getElementById('inspiration-title').value,
            description: document.getElementById('inspiration-description').value,
            category: document.getElementById('inspiration-category').value,
            mood: document.getElementById('inspiration-mood').value,
            tags: document.getElementById('inspiration-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            source: document.getElementById('inspiration-source').value,
            imageUrl: document.getElementById('upload-preview').querySelector('img')?.src || null,
            createdAt: new Date().toISOString(),
            colors: null,
            analysis: null
        };
        
        this.addInspiration(inspiration);
        this.hideUploadModal();
        form.reset();
        document.getElementById('upload-preview').innerHTML = '';
    }
    
    addInspiration(inspiration) {
        this.inspirations.unshift(inspiration);
        this.saveInspirations();
        this.applyFilters();
        this.showNotification('Inspiration added successfully!', 'success');
    }
    
    handleFileUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            this.showNotification('Please select a valid image file', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('upload-preview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
    
    generateSampleInspirations() {
        if (this.inspirations.length > 0) return;
        
        const sampleInspirations = [
            {
                id: 'sample-1',
                title: 'Forest Canopy Patterns',
                description: 'Beautiful overlapping leaf patterns creating natural camouflage effects. Perfect inspiration for organic tactical designs.',
                category: 'nature',
                mood: 'organic',
                tags: ['forest', 'leaves', 'green', 'natural', 'camouflage'],
                source: '',
                imageUrl: null,
                createdAt: new Date().toISOString(),
                colors: ['#2d5016', '#4a7c28', '#7cff50', '#1a3d0a'],
                analysis: {
                    complexity: 75,
                    naturalness: 95,
                    symmetry: 30,
                    effectiveness: 85
                }
            },
            {
                id: 'sample-2',
                title: 'Urban Geometric Grid',
                description: 'Angular architectural patterns with strong geometric lines. Great for modern tactical applications.',
                category: 'patterns',
                mood: 'industrial',
                tags: ['urban', 'geometric', 'angular', 'modern', 'grid'],
                source: '',
                imageUrl: null,
                createdAt: new Date().toISOString(),
                colors: ['#333333', '#666666', '#999999', '#cccccc'],
                analysis: {
                    complexity: 60,
                    naturalness: 20,
                    symmetry: 85,
                    effectiveness: 70
                }
            },
            {
                id: 'sample-3',
                title: 'Digital Camo Inspiration',
                description: 'Pixelated digital camouflage patterns with tactical color schemes. Modern military aesthetic.',
                category: 'tactical',
                mood: 'bold',
                tags: ['digital', 'pixelated', 'military', 'tactical', 'modern'],
                source: '',
                imageUrl: null,
                createdAt: new Date().toISOString(),
                colors: ['#4a5d23', '#8b8a5c', '#5d6b2f', '#3d4a1c'],
                analysis: {
                    complexity: 45,
                    naturalness: 35,
                    symmetry: 50,
                    effectiveness: 90
                }
            },
            {
                id: 'sample-4',
                title: 'Sunset Color Palette',
                description: 'Warm orange and pink tones from golden hour photography. Perfect for energetic brand applications.',
                category: 'colors',
                mood: 'energetic',
                tags: ['sunset', 'warm', 'orange', 'pink', 'golden'],
                source: '',
                imageUrl: null,
                createdAt: new Date().toISOString(),
                colors: ['#ff6b35', '#f7931e', '#ffd23f', '#ee4036'],
                analysis: {
                    complexity: 30,
                    naturalness: 80,
                    symmetry: 25,
                    effectiveness: 75
                }
            },
            {
                id: 'sample-5',
                title: 'Minimalist Typography',
                description: 'Clean, modern typography with excellent readability. Perfect for professional branding applications.',
                category: 'typography',
                mood: 'minimal',
                tags: ['clean', 'modern', 'readable', 'professional', 'sans-serif'],
                source: '',
                imageUrl: null,
                createdAt: new Date().toISOString(),
                colors: ['#ffffff', '#000000', '#f5f5f5', '#333333'],
                analysis: {
                    complexity: 15,
                    naturalness: 10,
                    symmetry: 70,
                    effectiveness: 95
                }
            }
        ];
        
        this.inspirations = sampleInspirations;
        this.saveInspirations();
        this.applyFilters();
    }
    
    saveInspirations() {
        try {
            localStorage.setItem('savoStudioInspirations', JSON.stringify(this.inspirations));
        } catch (error) {
            console.error('Failed to save inspirations:', error);
            this.showNotification('Failed to save inspirations', 'error');
        }
    }
    
    loadInspirations() {
        try {
            const saved = localStorage.getItem('savoStudioInspirations');
            if (saved) {
                this.inspirations = JSON.parse(saved);
                this.filteredInspirations = [...this.inspirations];
            }
        } catch (error) {
            console.error('Failed to load inspirations:', error);
            this.inspirations = [];
            this.filteredInspirations = [];
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
}

// Global functions for modal and UI interactions
function showUploadModal() {
    document.getElementById('upload-modal').classList.add('active');
}

function hideUploadModal() {
    document.getElementById('upload-modal').classList.remove('active');
}

function hideDetailModal() {
    document.getElementById('detail-modal').classList.remove('active');
}

function toggleGridView() {
    const board = document.getElementById('inspiration-board');
    board.classList.toggle('list-view');
    
    const button = event.target.closest('.btn');
    const icon = button.querySelector('i');
    
    if (board.classList.contains('list-view')) {
        icon.setAttribute('data-feather', 'grid');
        button.querySelector('span')?.textContent = 'Grid View';
    } else {
        icon.setAttribute('data-feather', 'list');
        button.querySelector('span')?.textContent = 'List View';
    }
    
    feather.replace();
}

function extractColors(inspirationId) {
    const inspiration = window.inspirationBoard.inspirations.find(i => i.id === inspirationId);
    if (!inspiration) return;
    
    // Simulate color extraction
    const colors = inspiration.colors || [
        '#2d5016', '#4a7c28', '#7cff50', '#1a3d0a', '#8b8a5c'
    ];
    
    // Update the current inspiration with colors
    inspiration.colors = colors;
    window.inspirationBoard.saveInspirations();
    
    // Show colors in detail modal if open
    const colorContainer = document.getElementById('extracted-colors');
    colorContainer.innerHTML = colors.map(color => 
        `<div class="color-swatch" style="background-color: ${color}" title="${color}"></div>`
    ).join('');
    
    document.getElementById('color-analysis').style.display = 'block';
    
    window.inspirationBoard.showNotification('Colors extracted successfully!', 'success');
}

function analyzePattern(inspirationId) {
    const inspiration = window.inspirationBoard.inspirations.find(i => i.id === inspirationId);
    if (!inspiration) return;
    
    // Simulate pattern analysis
    const analysis = inspiration.analysis || {
        complexity: Math.floor(Math.random() * 100),
        naturalness: Math.floor(Math.random() * 100),
        symmetry: Math.floor(Math.random() * 100),
        effectiveness: Math.floor(Math.random() * 100)
    };
    
    // Update the current inspiration with analysis
    inspiration.analysis = analysis;
    window.inspirationBoard.saveInspirations();
    
    // Show analysis in detail modal if open
    const resultsContainer = document.getElementById('pattern-results');
    resultsContainer.innerHTML = `
        <div class="analysis-item">
            <span class="analysis-label">Complexity</span>
            <span class="analysis-value">${analysis.complexity}%</span>
        </div>
        <div class="analysis-item">
            <span class="analysis-label">Naturalness</span>
            <span class="analysis-value">${analysis.naturalness}%</span>
        </div>
        <div class="analysis-item">
            <span class="analysis-label">Symmetry</span>
            <span class="analysis-value">${analysis.symmetry}%</span>
        </div>
        <div class="analysis-item">
            <span class="analysis-label">Effectiveness</span>
            <span class="analysis-value">${analysis.effectiveness}%</span>
        </div>
    `;
    
    document.getElementById('pattern-analysis').style.display = 'block';
    
    window.inspirationBoard.showNotification('Pattern analyzed successfully!', 'success');
}

function createFromInspiration() {
    const inspiration = window.inspirationBoard.currentInspiration;
    if (!inspiration) return;
    
    // Create URL with inspiration data
    const inspirationData = {
        colors: inspiration.colors,
        category: inspiration.category,
        mood: inspiration.mood,
        tags: inspiration.tags
    };
    
    const dataParam = encodeURIComponent(JSON.stringify(inspirationData));
    const url = `forest-pattern-generator.html?inspiration=${dataParam}`;
    
    window.open(url, '_blank');
    
    window.inspirationBoard.showNotification('Opening Forest Pattern Generator with inspiration data!', 'success');
}

// Initialize the inspiration board when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.inspirationBoard = new DesignInspirationBoard();
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            hideUploadModal();
            hideDetailModal();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideUploadModal();
            hideDetailModal();
        }
    });
});