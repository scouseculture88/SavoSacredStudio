// Shape & Logo Creator - Professional Geometric Design Tool
// Inspired by Isometric app and GeoGebra for creating Tesla 369 Diamond and geometric art

window.ShapeCreator = (function() {
    let canvas, ctx, currentTool, currentShape, shapes, gridEnabled, snapEnabled;
    let isDrawing = false, startX, startY, selectedShape = null;
    let geometryTool = null, protractorAngle = 0, rulerLength = 100;
    let undoStack = [], redoStack = [];
    
    // Initialize the Shape Creator
    function init() {
        canvas = document.getElementById('design-canvas');
        if (!canvas) return;
        
        ctx = canvas.getContext('2d');
        shapes = [];
        currentTool = 'rectangle';
        gridEnabled = true;
        snapEnabled = true;
        
        setupEventListeners();
        setupToolPanels();
        setupGeometryTools();
        
        console.log('🎨 Shape Creator initialized - Ready for Tesla 369 Diamond creation');
    }
    
    // Setup event listeners for canvas interaction
    function setupEventListeners() {
        // Mouse events for desktop
        canvas.addEventListener('mousedown', handleStart);
        canvas.addEventListener('mousemove', handleMove);
        canvas.addEventListener('mouseup', handleEnd);
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', handleTouchEnd);
        
        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => selectTool(e.target.dataset.shape || e.target.dataset.tool));
        });
        
        // Geometry tools
        document.querySelectorAll('.geometry-tool').forEach(btn => {
            btn.addEventListener('click', (e) => activateGeometryTool(e.target.dataset.tool));
        });
        
        // Style controls
        setupStyleControls();
        
        // Canvas tools
        document.getElementById('grid-toggle')?.addEventListener('click', toggleGrid);
        document.getElementById('snap-toggle')?.addEventListener('click', toggleSnap);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboard);
    }
    
    // Handle mouse/touch start
    function handleStart(e) {
        if (geometryTool) return handleGeometryTool(e);
        
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        
        if (snapEnabled) {
            startX = Math.round(startX / 20) * 20;
            startY = Math.round(startY / 20) * 20;
        }
        
        isDrawing = true;
        saveState();
        
        // Check if clicking existing shape for selection
        selectedShape = findShapeAt(startX, startY);
        if (selectedShape && currentTool === 'select') {
            return;
        }
        
        // Create new shape
        currentShape = createShape(currentTool, startX, startY);
        if (currentShape) {
            shapes.push(currentShape);
        }
        
        redraw();
    }
    
    // Handle mouse/touch move
    function handleMove(e) {
        if (!isDrawing || !currentShape) return;
        
        const rect = canvas.getBoundingClientRect();
        let currentX = e.clientX - rect.left;
        let currentY = e.clientY - rect.top;
        
        if (snapEnabled) {
            currentX = Math.round(currentX / 20) * 20;
            currentY = Math.round(currentY / 20) * 20;
        }
        
        updateShape(currentShape, startX, startY, currentX, currentY);
        redraw();
    }
    
    // Handle mouse/touch end
    function handleEnd(e) {
        isDrawing = false;
        currentShape = null;
        updateLayerManager();
    }
    
    // Touch event handlers
    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        handleStart(touch);
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch);
    }
    
    function handleTouchEnd(e) {
        e.preventDefault();
        handleEnd(e);
    }
    
    // Create shape based on tool type
    function createShape(type, x, y) {
        const shape = {
            type: type,
            x: x,
            y: y,
            width: 0,
            height: 0,
            fillColor: document.getElementById('fill-color')?.value || '#27ae60',
            strokeColor: document.getElementById('stroke-color')?.value || '#2c3e50',
            strokeWidth: parseInt(document.getElementById('stroke-width')?.value) || 2,
            opacity: parseInt(document.getElementById('opacity')?.value) / 100 || 1,
            rotation: 0,
            points: [],
            id: Date.now() + Math.random()
        };
        
        // Special handling for Tesla 369 Diamond points
        if (type === 'tesla-diamond') {
            shape.points = createTeslaDiamondPoints(x, y);
        }
        
        return shape;
    }
    
    // Create Tesla 369 Diamond coordinate points
    function createTeslaDiamondPoints(centerX, centerY) {
        const size = 100;
        const points = [];
        
        // Tesla 369 Diamond - 9 points in diamond formation
        // Point numbering: 1-9 as per Tesla's theory
        points.push({x: centerX, y: centerY - size, label: '1'});           // Top
        points.push({x: centerX + size/2, y: centerY - size/2, label: '2'}); // Top-right
        points.push({x: centerX + size, y: centerY, label: '3'});           // Right
        points.push({x: centerX + size/2, y: centerY + size/2, label: '4'}); // Bottom-right
        points.push({x: centerX, y: centerY + size, label: '5'});           // Bottom
        points.push({x: centerX - size/2, y: centerY + size/2, label: '6'}); // Bottom-left
        points.push({x: centerX - size, y: centerY, label: '7'});           // Left
        points.push({x: centerX - size/2, y: centerY - size/2, label: '8'}); // Top-left
        points.push({x: centerX, y: centerY, label: '9'});                  // Center
        
        return points;
    }
    
    // Update shape dimensions during drawing
    function updateShape(shape, startX, startY, currentX, currentY) {
        const width = currentX - startX;
        const height = currentY - startY;
        
        switch (shape.type) {
            case 'rectangle':
                shape.width = width;
                shape.height = height;
                break;
                
            case 'circle':
                const radius = Math.sqrt(width * width + height * height);
                shape.radius = radius;
                break;
                
            case 'triangle':
                shape.points = [
                    {x: startX, y: startY + Math.abs(height)},
                    {x: startX + width/2, y: startY},
                    {x: startX + width, y: startY + Math.abs(height)}
                ];
                break;
                
            case 'polygon':
                // Create regular polygon
                const sides = 6; // Default hexagon
                const polygonRadius = Math.sqrt(width * width + height * height);
                shape.points = [];
                for (let i = 0; i < sides; i++) {
                    const angle = (i * 2 * Math.PI) / sides;
                    shape.points.push({
                        x: startX + polygonRadius * Math.cos(angle),
                        y: startY + polygonRadius * Math.sin(angle)
                    });
                }
                break;
                
            case 'star':
                // Create 5-pointed star
                const starRadius = Math.sqrt(width * width + height * height);
                const innerRadius = starRadius * 0.4;
                shape.points = [];
                for (let i = 0; i < 10; i++) {
                    const angle = (i * Math.PI) / 5;
                    const radius = i % 2 === 0 ? starRadius : innerRadius;
                    shape.points.push({
                        x: startX + radius * Math.cos(angle - Math.PI/2),
                        y: startY + radius * Math.sin(angle - Math.PI/2)
                    });
                }
                break;
                
            case 'arrow':
                const arrowLength = Math.sqrt(width * width + height * height);
                const arrowAngle = Math.atan2(height, width);
                shape.angle = arrowAngle;
                shape.length = arrowLength;
                break;
        }
    }
    
    // Redraw entire canvas
    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid if enabled
        if (gridEnabled) {
            drawGrid();
        }
        
        // Draw all shapes
        shapes.forEach(shape => drawShape(shape));
        
        // Draw geometry tool overlays
        if (geometryTool) {
            drawGeometryTool();
        }
        
        // Highlight selected shape
        if (selectedShape) {
            drawSelectionHandles(selectedShape);
        }
    }
    
    // Draw individual shape
    function drawShape(shape) {
        ctx.save();
        
        // Apply transformations
        ctx.globalAlpha = shape.opacity;
        ctx.fillStyle = shape.fillColor;
        ctx.strokeStyle = shape.strokeColor;
        ctx.lineWidth = shape.strokeWidth;
        
        switch (shape.type) {
            case 'rectangle':
                if (shape.fillColor !== 'transparent') {
                    ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
                }
                if (shape.strokeWidth > 0) {
                    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                }
                break;
                
            case 'circle':
                ctx.beginPath();
                ctx.arc(shape.x, shape.y, shape.radius || 50, 0, Math.PI * 2);
                if (shape.fillColor !== 'transparent') ctx.fill();
                if (shape.strokeWidth > 0) ctx.stroke();
                break;
                
            case 'triangle':
            case 'polygon':
            case 'star':
                if (shape.points && shape.points.length > 0) {
                    ctx.beginPath();
                    ctx.moveTo(shape.points[0].x, shape.points[0].y);
                    for (let i = 1; i < shape.points.length; i++) {
                        ctx.lineTo(shape.points[i].x, shape.points[i].y);
                    }
                    ctx.closePath();
                    if (shape.fillColor !== 'transparent') ctx.fill();
                    if (shape.strokeWidth > 0) ctx.stroke();
                }
                break;
                
            case 'tesla-diamond':
                drawTeslaDiamond(shape);
                break;
                
            case 'arrow':
                drawArrow(shape);
                break;
        }
        
        ctx.restore();
    }
    
    // Draw Tesla 369 Diamond with numbered points
    function drawTeslaDiamond(shape) {
        if (!shape.points) return;
        
        // Draw connecting lines first
        ctx.beginPath();
        ctx.strokeStyle = shape.strokeColor;
        ctx.lineWidth = shape.strokeWidth;
        
        // Draw diamond outline (points 1,3,5,7)
        const diamondPoints = [0, 2, 4, 6]; // Indices for points 1,3,5,7
        ctx.moveTo(shape.points[diamondPoints[0]].x, shape.points[diamondPoints[0]].y);
        for (let i = 1; i < diamondPoints.length; i++) {
            ctx.lineTo(shape.points[diamondPoints[i]].x, shape.points[diamondPoints[i]].y);
        }
        ctx.closePath();
        
        // Draw inner connections (to center point 9)
        for (let i = 0; i < 8; i++) {
            ctx.moveTo(shape.points[i].x, shape.points[i].y);
            ctx.lineTo(shape.points[8].x, shape.points[8].y); // Center point
        }
        
        ctx.stroke();
        
        // Draw numbered points
        shape.points.forEach((point, index) => {
            // Draw point circle
            ctx.beginPath();
            ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = getPointColor(index + 1); // 1-indexed
            ctx.fill();
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw number label
            ctx.fillStyle = 'white';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(point.label, point.x, point.y);
        });
    }
    
    // Get Tesla number color based on 3-6-9 theory
    function getPointColor(number) {
        const digitalRoot = number % 9 || 9;
        if ([3, 6, 9].includes(digitalRoot)) {
            return '#e74c3c'; // Red for Tesla key numbers
        } else if ([1, 2, 4, 5, 7, 8].includes(digitalRoot)) {
            return '#3498db'; // Blue for other numbers
        }
        return '#27ae60'; // Green fallback
    }
    
    // Draw arrow shape
    function drawArrow(shape) {
        const headLength = 20;
        const headWidth = 10;
        
        ctx.beginPath();
        
        // Arrow shaft
        ctx.moveTo(shape.x, shape.y);
        ctx.lineTo(shape.x + shape.length * Math.cos(shape.angle), 
                  shape.y + shape.length * Math.sin(shape.angle));
        
        // Arrow head
        const endX = shape.x + shape.length * Math.cos(shape.angle);
        const endY = shape.y + shape.length * Math.sin(shape.angle);
        
        ctx.lineTo(endX - headLength * Math.cos(shape.angle - Math.PI/6),
                  endY - headLength * Math.sin(shape.angle - Math.PI/6));
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLength * Math.cos(shape.angle + Math.PI/6),
                  endY - headLength * Math.sin(shape.angle + Math.PI/6));
        
        ctx.stroke();
    }
    
    // Draw grid
    function drawGrid() {
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.3;
        
        // Vertical lines
        for (let x = 0; x <= canvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= canvas.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    // Setup tool panel interactions
    function setupToolPanels() {
        // Add geometry tools to HTML
        const geometrySection = document.querySelector('.tool-section:has(h4:contains("Transform"))');
        if (geometrySection) {
            const geometryToolsHTML = `
                <div class="tool-section">
                    <h4>Geometry Tools</h4>
                    <div class="geometry-tools">
                        <button class="geometry-tool" data-tool="protractor">
                            <i data-feather="rotate-cw"></i>
                            Protractor
                        </button>
                        <button class="geometry-tool" data-tool="ruler">
                            <i data-feather="maximize"></i>
                            Ruler
                        </button>
                        <button class="geometry-tool" data-tool="compass">
                            <i data-feather="circle"></i>
                            Compass
                        </button>
                        <button class="geometry-tool" data-tool="grid-snap">
                            <i data-feather="grid"></i>
                            Snap to Grid
                        </button>
                        <button class="geometry-tool" data-tool="angle-measure">
                            <i data-feather="triangle"></i>
                            Angle Measure
                        </button>
                    </div>
                </div>
            `;
            geometrySection.insertAdjacentHTML('afterend', geometryToolsHTML);
        }
        
        // Template loading
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', (e) => loadTemplate(e.target.dataset.template));
        });
    }
    
    // Setup style controls with live updates
    function setupStyleControls() {
        const controls = ['fill-color', 'stroke-color', 'stroke-width', 'opacity'];
        
        controls.forEach(controlId => {
            const control = document.getElementById(controlId);
            if (control) {
                control.addEventListener('input', updateSelectedShapeStyle);
                
                // Update value display for range inputs
                if (control.type === 'range') {
                    const valueDisplay = control.nextElementSibling;
                    if (valueDisplay && valueDisplay.classList.contains('value-display')) {
                        control.addEventListener('input', () => {
                            let value = control.value;
                            if (controlId === 'opacity') value += '%';
                            if (controlId === 'stroke-width') value += 'px';
                            valueDisplay.textContent = value;
                        });
                    }
                }
            }
        });
    }
    
    // Geometry tools setup
    function setupGeometryTools() {
        // This will be called when geometry tools are activated
        console.log('🔧 Geometry tools ready for precise Tesla Diamond construction');
    }
    
    // Select tool
    function selectTool(tool) {
        currentTool = tool;
        geometryTool = null;
        
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-shape="${tool}"], [data-tool="${tool}"]`)?.classList.add('active');
        
        console.log(`🛠️ Selected tool: ${tool}`);
    }
    
    // Activate geometry tool
    function activateGeometryTool(tool) {
        geometryTool = tool;
        
        // Update UI
        document.querySelectorAll('.geometry-tool').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tool="${tool}"]`)?.classList.add('active');
        
        console.log(`📐 Activated geometry tool: ${tool}`);
    }
    
    // Handle geometry tool interactions
    function handleGeometryTool(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        switch (geometryTool) {
            case 'protractor':
                // Position protractor at click point
                // Implementation for angle measurement
                break;
                
            case 'ruler':
                // Start ruler measurement
                // Implementation for distance measurement
                break;
                
            case 'compass':
                // Start compass circle
                // Implementation for circle construction
                break;
        }
    }
    
    // Save current state for undo
    function saveState() {
        undoStack.push(JSON.stringify(shapes));
        if (undoStack.length > 50) undoStack.shift(); // Limit undo history
        redoStack = []; // Clear redo stack
    }
    
    // Undo last action
    function undo() {
        if (undoStack.length > 0) {
            redoStack.push(JSON.stringify(shapes));
            const previousState = undoStack.pop();
            shapes = JSON.parse(previousState);
            redraw();
            updateLayerManager();
        }
    }
    
    // Redo last undone action
    function redo() {
        if (redoStack.length > 0) {
            undoStack.push(JSON.stringify(shapes));
            const nextState = redoStack.pop();
            shapes = JSON.parse(nextState);
            redraw();
            updateLayerManager();
        }
    }
    
    // Toggle grid visibility
    function toggleGrid() {
        gridEnabled = !gridEnabled;
        document.getElementById('grid-toggle')?.classList.toggle('active', gridEnabled);
        redraw();
    }
    
    // Toggle snap to grid
    function toggleSnap() {
        snapEnabled = !snapEnabled;
        document.getElementById('snap-toggle')?.classList.toggle('active', snapEnabled);
    }
    
    // Handle keyboard shortcuts
    function handleKeyboard(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) redo(); else undo();
                    break;
                case 'y':
                    e.preventDefault();
                    redo();
                    break;
                case 'c':
                    e.preventDefault();
                    if (selectedShape) duplicateShape(selectedShape);
                    break;
                case 'd':
                    e.preventDefault();
                    if (selectedShape) duplicateShape(selectedShape);
                    break;
            }
        }
        
        // Delete selected shape
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (selectedShape) {
                deleteShape(selectedShape);
            }
        }
    }
    
    // Load template
    function loadTemplate(templateName) {
        saveState();
        
        switch (templateName) {
            case 'savo-logo':
                createSavoLogo();
                break;
            case 'tesla-diamond':
                createTeslaDiamondTemplate();
                break;
            case 'tactical-badge':
                createTacticalBadge();
                break;
            case 'mountain-emblem':
                createMountainEmblem();
                break;
        }
        
        redraw();
        updateLayerManager();
    }
    
    // Create Tesla Diamond template
    function createTeslaDiamondTemplate() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        const diamond = createShape('tesla-diamond', centerX, centerY);
        shapes.push(diamond);
        
        console.log('💎 Tesla 369 Diamond template loaded');
    }
    
    // Export functionality
    function exportDesign(format, resolution) {
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        // Set resolution
        const [width, height] = resolution.split('x').map(Number);
        exportCanvas.width = width;
        exportCanvas.height = height;
        
        // Scale context for high resolution
        const scaleX = width / canvas.width;
        const scaleY = height / canvas.height;
        exportCtx.scale(scaleX, scaleY);
        
        // Render shapes to export canvas
        if (document.getElementById('export-background')?.value !== 'transparent') {
            exportCtx.fillStyle = document.getElementById('bg-color')?.value || '#ffffff';
            exportCtx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        shapes.forEach(shape => {
            // Render each shape to export canvas
            // (Implementation would mirror drawShape function)
        });
        
        // Download based on format
        const link = document.createElement('a');
        
        if (format === 'svg') {
            // SVG export implementation
            const svgData = generateSVG();
            const blob = new Blob([svgData], {type: 'image/svg+xml'});
            link.href = URL.createObjectURL(blob);
            link.download = 'tesla-diamond-design.svg';
        } else {
            // PNG/JPEG export
            exportCanvas.toBlob((blob) => {
                link.href = URL.createObjectURL(blob);
                link.download = `tesla-diamond-design.${format}`;
                link.click();
            }, `image/${format}`, 0.9);
        }
    }
    
    // Update layer manager
    function updateLayerManager() {
        const layersList = document.getElementById('layers-list');
        if (!layersList) return;
        
        layersList.innerHTML = '';
        
        shapes.forEach((shape, index) => {
            const layerItem = document.createElement('div');
            layerItem.className = 'layer-item';
            layerItem.innerHTML = `
                <div class="layer-info">
                    <button class="layer-visibility">
                        <i data-feather="eye"></i>
                    </button>
                    <span>Layer ${index + 1}: ${shape.type}</span>
                </div>
                <button class="layer-delete" data-index="${index}">
                    <i data-feather="trash-2"></i>
                </button>
            `;
            layersList.appendChild(layerItem);
        });
        
        // Refresh feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
    
    // Public API
    return {
        init: init,
        selectTool: selectTool,
        exportDesign: exportDesign,
        undo: undo,
        redo: redo,
        clearCanvas: () => {
            saveState();
            shapes = [];
            selectedShape = null;
            redraw();
            updateLayerManager();
        },
        saveToLibrary: () => {
            // Save current design to pattern library
            const designData = {
                shapes: shapes,
                timestamp: Date.now(),
                name: 'Tesla Diamond Design'
            };
            
            // Store in localStorage
            const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
            savedDesigns.push(designData);
            localStorage.setItem('savedDesigns', JSON.stringify(savedDesigns));
            
            console.log('💾 Design saved to library');
        }
    };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof ShapeCreator !== 'undefined') {
        ShapeCreator.init();
    }
});