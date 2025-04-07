import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        https: {
            key: fs.readFileSync('./certs/key.pem'),
            cert: fs.readFileSync('./certs/cert.pem'),
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                cookieDomainRewrite: {
                // Rewrite domain if needed
                '*': ''
                },
                onProxyRes(proxyRes) {
                    // Ensure cookies are properly forwarded
                    const cookies = proxyRes.headers['set-cookie'];
                    if (cookies) {
                        proxyRes.headers['set-cookie'] = cookies.map(cookie => 
                            cookie
                        );
                    } 
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    optimizeDeps: {
      exclude: ['bson']
    }
});
