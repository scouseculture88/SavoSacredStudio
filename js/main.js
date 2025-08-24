#!/usr/bin/env node
/**
 * Alternative main entry point for deployment
 * Starts the Savo Mode Color Studio server
 */

const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs');

console.log('🚀 Savo Mode Color Studio - Main Entry Point');

const PORT = process.env.PORT || 5000;
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// If Express is available, use it for better deployment compatibility
let useExpress = true;
try {
    require.resolve('express');
} catch (e) {
    useExpress = false;
    console.log('Express not available, falling back to basic HTTP server');
}

if (useExpress) {
    // Use Express.js server (preferred for deployments)
    const app = express();
    
    // Middleware
    app.use(express.json());
    app.use(express.static('.', {
        index: 'index.html',
        extensions: ['html']
    }));
    
    // CORS
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    });
    
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({
            status: 'healthy',
            service: 'Savo Mode Color Studio',
            timestamp: new Date().toISOString(),
            port: PORT
        });
    });
    
    // Root endpoint
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });
    
    // API endpoints with demo functionality
    app.post('/api/generate-palette', (req, res) => {
        const { prompt } = req.body;
        
        const demoResponse = {
            colors: ['#2d5016', '#4a7c28', '#1a3d0a', '#7cff50', '#365a1e'],
            name: 'Demo Forest Palette',
            description: 'Demo palette from main.js server',
            prompt: prompt || 'demo',
            timestamp: Date.now()
        };
        
        res.json(demoResponse);
    });
    
    app.get('/api/check-gemini-key', (req, res) => {
        res.json({
            hasKey: !!process.env.GEMINI_API_KEY,
            status: process.env.GEMINI_API_KEY ? 'connected' : 'demo_mode'
        });
    });
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Express server running on http://0.0.0.0:${PORT}`);
        console.log(`🔍 Health check: http://0.0.0.0:${PORT}/health`);
    });
    
} else {
    // Fallback to the existing server.js
    console.log('Starting existing server.js...');
    require('./server.js');
}
