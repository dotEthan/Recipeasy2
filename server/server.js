import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path'
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import process from 'process';

// Load .env file
dotenv.config();

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from Vue's dist folder
app.use(express.static(path.join(__dirname, '../dist')));

// Proxy API requests to your BE
app.use('/api', createProxyMiddleware({ 
  target: 'https://recipeasy-backend.onrender.com',
  changeOrigin: true,
}));

// Handle SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on ${PORT}`));