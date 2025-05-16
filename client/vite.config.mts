import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

export default defineConfig({
    plugins: [react()],
    build: {
        chunkSizeWarningLimit: 1600,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return id
                            .toString()
                            .split("node_modules/")[1]
                            .split("/")[0]
                            .toString();
                    }
                },
            },
        },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            'buffer': 'buffer',
            'process': 'process/browser',
            'util': 'util',
            'stream': 'stream-browserify',
        }
    },
    // Define globals needed for WebRTC dependencies
    define: {
        global: 'window',
        'process.env': {}
    },
    // Provide Node.js modules for the browser
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis',
            },
        },
        include: [
            'framer-motion',
            'buffer',
            'process/browser',
            'util',
            'stream-browserify'
        ]
    },
    // Force pre-bundle dependencies that might be causing issues
    server: {
        hmr: true,
        force: true,
        open: true,
        host: '0.0.0.0',
        port: 5173,
        allowedHosts: true, 
    },
    test: {
        globals: true,
        environment: "jsdom",
    },
});
