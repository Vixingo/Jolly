import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // React ecosystem
                    'react-vendor': ['react', 'react-dom'],
                    'react-router': ['react-router-dom'],
                    'redux': ['@reduxjs/toolkit', 'react-redux'],
                    
                    // UI Libraries
                    'ui-radix': [
                        '@radix-ui/react-accordion',
                        '@radix-ui/react-alert-dialog',
                        '@radix-ui/react-avatar',
                        '@radix-ui/react-checkbox',
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-form',
                        '@radix-ui/react-icons',
                        '@radix-ui/react-label',
                        '@radix-ui/react-navigation-menu',
                        '@radix-ui/react-popover',
                        '@radix-ui/react-progress',
                        '@radix-ui/react-radio-group',
                        '@radix-ui/react-scroll-area',
                        '@radix-ui/react-select',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-switch',
                        '@radix-ui/react-tabs',
                        '@radix-ui/react-toast',
                        '@radix-ui/react-tooltip'
                    ],
                    'ui-headless': ['@headlessui/react'],
                    'ui-icons': ['@heroicons/react', 'lucide-react'],
                    'ui-motion': ['framer-motion'],
                    'ui-carousel': ['embla-carousel-react'],
                    'ui-charts': ['recharts'],
                    
                    // Form and validation
                    'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
                    
                    // Date utilities
                    'date-utils': ['date-fns', 'react-day-picker'],
                    
                    // Backend and auth
                    'supabase': ['@supabase/supabase-js', '@supabase/auth-helpers-react'],
                    
                    // Utility libraries
                    'utils': [
                        'class-variance-authority',
                        'clsx',
                        'tailwind-merge',
                        'cmdk',
                        'sonner'
                    ]
                }
            }
        },
        // Optimize chunk size warnings
        chunkSizeWarningLimit: 1000,
        // Enable source maps for better debugging
        sourcemap: false,
        // Optimize build performance
        target: 'esnext',
        minify: 'esbuild'
    },
    // Optimize dev server
     server: {
         hmr: {
             overlay: false
         }
     }
});
