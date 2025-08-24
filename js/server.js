// Simple Node.js server to handle OpenAI API calls for Color Studio
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Import database functions
let db, users, patterns, savedPalettes, feedback;
try {
    // Simple database simulation for demo
    db = {
        users: [],
        patterns: [],
        feedback: [],
        
        async query(sql, params) {
            // Demo implementation - in production this would use real database
            console.log('Demo query:', sql);
            return [];
        },
        
        async insert(table, data) {
            const id = Date.now();
            const record = { id, ...data };
            this[table].push(record);
            return record;
        },
        
        async select(table, where) {
            return this[table].filter(where || (() => true));
        },
        
        async update(table, id, data) {
            const index = this[table].findIndex(item => item.id === id);
            if (index !== -1) {
                this[table][index] = { ...this[table][index], ...data };
                return this[table][index];
            }
            return null;
        }
    };
    
    console.log('Database simulation ready for testing');
} catch (error) {
    console.log('Database not available, running in demo mode');
}

// Gemini API setup
const { GoogleGenAI } = require('@google/genai');
const genai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// OpenAI setup for pattern detection
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Set CORS headers for all responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Health check endpoint for deployment
    if (pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'healthy', 
            service: 'Savo Mode Color Studio',
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // API endpoint to generate color palette
    if (pathname === '/api/generate-palette' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { prompt } = JSON.parse(body);
                
                if (!prompt) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Prompt is required' }));
                    return;
                }

                if (!process.env.GEMINI_API_KEY) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Gemini API key not configured' }));
                    return;
                }

                // Generate color palette using Gemini
                const systemPrompt = `You are an expert color palette generator for tactical camouflage patterns. 
                Analyze the environment description and generate authentic color schemes that would provide effective camouflage.
                
                Focus on:
                - Natural color variations found in the described environment
                - Tactical effectiveness for camouflage
                - Realistic color relationships
                - Professional color harmony
                
                Return ONLY a JSON object with this exact format:
                {
                    "colors": ["#hexcode1", "#hexcode2", "#hexcode3", "#hexcode4", "#hexcode5"],
                    "name": "Palette Name",
                    "description": "Brief description of the palette and environment"
                }`;

                const response = await genai.models.generateContent({
                    model: "gemini-2.5-pro",
                    config: {
                        systemInstruction: systemPrompt,
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "object",
                            properties: {
                                colors: {
                                    type: "array",
                                    items: { type: "string" },
                                    minItems: 5,
                                    maxItems: 5
                                },
                                name: { type: "string" },
                                description: { type: "string" }
                            },
                            required: ["colors", "name", "description"]
                        }
                    },
                    contents: `Generate a tactical color palette for: ${prompt}`
                });

                const rawJson = response.text;
                console.log(`Gemini Response: ${rawJson}`);
                
                if (!rawJson) {
                    throw new Error("Empty response from Gemini");
                }

                const result = JSON.parse(rawJson);
                
                // Return the generated palette
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    colors: result.colors,
                    name: result.name || 'Custom Palette',
                    description: result.description || 'AI-generated color palette',
                    prompt: prompt,
                    timestamp: Date.now()
                }));

            } catch (error) {
                console.error('Color generation error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    error: 'Failed to generate color palette',
                    details: error.message 
                }));
            }
        });
        return;
    }

    // Image Generation API for Mind Universe
    if (pathname === '/api/generate-image' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const { prompt, aspectRatio = '1:1' } = JSON.parse(body);
                
                if (!openai) {
                    throw new Error('OpenAI not configured');
                }
                
                console.log('🎨 Generating AI image for Mind Universe:', prompt);
                
                const response = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: prompt,
                    n: 1,
                    size: aspectRatio === '1:1' ? "1024x1024" : "1024x1792",
                    quality: "standard",
                });
                
                const imageUrl = response.data[0].url;
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    imageUrl: imageUrl,
                    prompt: prompt
                }));
                
                console.log('✨ AI image generated successfully');
                
            } catch (error) {
                console.error('Image generation error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: error.message,
                    fallback: 'cosmic-gradient'
                }));
            }
        });
        return;
    }

    // API endpoint to check if Gemini key is available
    if (pathname === '/api/check-gemini-key' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            hasKey: !!process.env.GEMINI_API_KEY,
            status: process.env.GEMINI_API_KEY ? 'connected' : 'not_configured'
        }));
        return;
    }

    // API endpoint for AI circle detection
    if (pathname === '/api/detect-circles' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { image, patternType } = JSON.parse(body);

                if (!image) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'No image provided' }));
                    return;
                }

                if (!process.env.OPENAI_API_KEY) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'OpenAI API key not configured' }));
                    return;
                }

                // Use OpenAI Vision to analyze the image
                const response = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "system",
                            content: `You are an expert in sacred geometry and pattern recognition. Analyze images to detect circular elements and intersection points that would be ideal for circle placement in sacred geometry patterns like Flower of Life, Seed of Life, Metatron's Cube, etc.

                            Return your analysis as JSON with this exact format:
                            {
                                "circles": [
                                    {"x": number, "y": number, "radius": number, "confidence": number}
                                ],
                                "patternType": "string",
                                "confidence": number,
                                "analysis": "string description"
                            }

                            - x,y coordinates should be relative to an 800x600 canvas
                            - radius should typically be between 30-50 pixels for sacred geometry
                            - confidence should be 0-1 for each detection
                            - Identify key intersection points, circle centers, and geometric focal points
                            - For Flower of Life patterns, focus on the center and surrounding petal centers
                            - For other sacred geometry, identify primary geometric anchor points`
                        },
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: `Analyze this sacred geometry image and detect the optimal positions for circles. Pattern type hint: ${patternType || 'unknown'}`
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: image
                                    }
                                }
                            ]
                        }
                    ],
                    response_format: { type: "json_object" },
                    max_tokens: 1000
                });

                const result = JSON.parse(response.choices[0].message.content);

                // Validate and ensure proper format
                const circles = result.circles || [];
                const validCircles = circles.filter(circle => 
                    typeof circle.x === 'number' && 
                    typeof circle.y === 'number' && 
                    typeof circle.radius === 'number' &&
                    circle.x >= 0 && circle.x <= 800 &&
                    circle.y >= 0 && circle.y <= 600
                );

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    circles: validCircles,
                    patternType: result.patternType || 'Sacred Geometry',
                    confidence: result.confidence || 0.8,
                    analysis: result.analysis || 'AI detected key geometric points in the pattern'
                }));

            } catch (error) {
                console.error('Circle detection error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'AI detection failed. Please try again.' 
                }));
            }
        });
        return;
    }

    // API endpoint for pattern analysis
    if (pathname === '/api/analyze-pattern' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { image } = JSON.parse(body);

                if (!image) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'No image provided' }));
                    return;
                }

                if (!process.env.OPENAI_API_KEY) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'OpenAI API key not configured' }));
                    return;
                }

                // Use OpenAI Vision to analyze the sacred geometry pattern
                const response = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "system",
                            content: `You are an expert in sacred geometry, symbolism, and spiritual mathematics. Analyze sacred geometry images to provide deep insights about the pattern, its meaning, and practical applications.

                            Return your analysis as JSON with this exact format:
                            {
                                "patternName": "Name of the sacred geometry pattern",
                                "symbolism": "Spiritual and symbolic meaning",
                                "geometry": "Mathematical and geometric properties",
                                "recommendations": "Practical advice for working with this pattern"
                            }

                            Focus on:
                            - Identifying specific sacred geometry patterns (Flower of Life, Seed of Life, Metatron's Cube, Sri Yantra, etc.)
                            - Explaining the spiritual significance and symbolism
                            - Describing the mathematical relationships and proportions
                            - Providing practical guidance for meditation, healing, or creative work
                            - Noting any Tesla 3-6-9 connections or Fibonacci relationships
                            - Suggesting how to work with this pattern for therapeutic purposes`
                        },
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: "Analyze this sacred geometry pattern. Provide insights about its meaning, symbolism, and how to work with it therapeutically."
                                },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: image
                                    }
                                }
                            ]
                        }
                    ],
                    response_format: { type: "json_object" },
                    max_tokens: 1500
                });

                const result = JSON.parse(response.choices[0].message.content);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    patternName: result.patternName || 'Sacred Geometry Pattern',
                    symbolism: result.symbolism || 'This pattern carries deep spiritual significance',
                    geometry: result.geometry || 'Mathematical relationships create harmony',
                    recommendations: result.recommendations || 'Use for meditation and healing focus'
                }));

            } catch (error) {
                console.error('Pattern analysis error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Pattern analysis failed. Please try again.' 
                }));
            }
        });
        return;
    }

    // User authentication endpoints
    if (pathname === '/api/auth/signup' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { username, email } = JSON.parse(body);
                
                if (!username || !email) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Username and email are required' }));
                    return;
                }

                if (!db) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Database not available' }));
                    return;
                }

                // Check if user already exists
                const existingUser = db.users.find(u => u.username === username);
                
                if (existingUser) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Username already exists' }));
                    return;
                }

                // Create new user
                const newUser = await db.insert('users', {
                    username,
                    email,
                    createdAt: new Date(),
                    lastActive: new Date()
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
                }));

            } catch (error) {
                console.error('Signup error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to create account' }));
            }
        });
        return;
    }

    if (pathname === '/api/auth/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { username, email } = JSON.parse(body);
                
                if (!username || !email) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Username and email are required' }));
                    return;
                }

                if (!db) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Database not available' }));
                    return;
                }

                // Find user
                const user = db.users.find(u => u.username === username && u.email === email);

                if (!user) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid credentials' }));
                    return;
                }

                // Update last active
                await db.update('users', user.id, { lastActive: new Date() });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    id: user.id,
                    username: user.username,
                    email: user.email
                }));

            } catch (error) {
                console.error('Login error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to login' }));
            }
        });
        return;
    }

    // Pattern saving endpoint
    if (pathname === '/api/patterns/save' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { userId, name, colors, patternType, environmentType } = JSON.parse(body);
                
                if (!userId || !name || !colors) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }

                if (!db) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Database not available' }));
                    return;
                }

                const newPattern = await db.insert('patterns', {
                    userId,
                    name,
                    colors: JSON.stringify(colors),
                    patternType: patternType || 'digital',
                    environmentType: environmentType || 'custom',
                    isPublic: false,
                    likes: 0,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newPattern));

            } catch (error) {
                console.error('Pattern save error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to save pattern' }));
            }
        });
        return;
    }

    // Get user patterns
    if (pathname.startsWith('/api/patterns/user/') && req.method === 'GET') {
        try {
            const userId = parseInt(pathname.split('/')[4]);
            
            if (!userId || !db) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid user ID or database not available' }));
                return;
            }

            const userPatterns = db.patterns.filter(p => p.userId === userId);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(userPatterns));

        } catch (error) {
            console.error('Get patterns error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to load patterns' }));
        }
        return;
    }

    // Feedback submission
    if (pathname === '/api/feedback' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        
        req.on('end', async () => {
            try {
                const { userId, type, message, rating } = JSON.parse(body);
                
                if (!userId || !message) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'User ID and message are required' }));
                    return;
                }

                if (!db) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Database not available' }));
                    return;
                }

                const newFeedback = await db.insert('feedback', {
                    userId,
                    type: type || 'general',
                    message,
                    rating: rating || null,
                    createdAt: new Date()
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newFeedback));

            } catch (error) {
                console.error('Feedback error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to submit feedback' }));
            }
        });
        return;
    }

    // Serve static files for everything else
    let filePath = '.' + pathname;
    if (pathname === '/') {
        filePath = './index.html';
    } else if (pathname.endsWith('/')) {
        // Handle directory requests by serving index.html
        filePath = '.' + pathname + 'index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🎨 Color Studio ${process.env.GEMINI_API_KEY ? 'with Gemini AI' : 'in demo mode'}`);
});
