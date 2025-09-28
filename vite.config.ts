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
                // More aggressive chunk splitting for better caching
                manualChunks: (id) => {
                    // Core React libraries
                    if (id.includes('react') || id.includes('react-dom')) {
                        return 'react-core';
                    }
                    if (id.includes('react-router')) {
                        return 'react-router';
                    }
                    if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
                        return 'redux';
                    }
                    
                    // Radix UI components - split into smaller chunks
                    if (id.includes('@radix-ui')) {
                        if (id.includes('dialog') || id.includes('alert-dialog') || id.includes('popover')) {
                            return 'ui-dialogs';
                        }
                        if (id.includes('form') || id.includes('select') || id.includes('checkbox') || id.includes('radio')) {
                            return 'ui-forms';
                        }
                        if (id.includes('navigation') || id.includes('dropdown') || id.includes('tabs')) {
                            return 'ui-navigation';
                        }
                        return 'ui-radix-misc';
                    }
                    
                    // Icons and visual components
                    if (id.includes('@heroicons') || id.includes('lucide-react')) {
                        return 'icons';
                    }
                    if (id.includes('framer-motion')) {
                        return 'animations';
                    }
                    if (id.includes('embla-carousel')) {
                        return 'carousel';
                    }
                    if (id.includes('recharts')) {
                        return 'charts';
                    }
                    
                    // Form libraries
                    if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
                        return 'forms';
                    }
                    
                    // Date utilities
                    if (id.includes('date-fns') || id.includes('react-day-picker')) {
                        return 'date-utils';
                    }
                    
                    // Supabase
                    if (id.includes('@supabase')) {
                        return 'supabase';
                    }
                    
                    // Utility libraries
                    if (id.includes('class-variance-authority') || id.includes('clsx') || 
                        id.includes('tailwind-merge') || id.includes('cmdk') || id.includes('sonner')) {
                        return 'utils';
                    }
                    
                    // Node modules vendor chunk for other dependencies
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                },
                // Optimize chunk file names for better caching
                chunkFileNames: () => {
                    return `assets/[name]-[hash].js`;
                },
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            },
            // Tree shaking optimizations
            treeshake: {
                moduleSideEffects: false,
                propertyReadSideEffects: false,
                unknownGlobalSideEffects: false
            }
        },
        // Reduce chunk size warning limit for mobile optimization
        chunkSizeWarningLimit: 500,
        // Disable source maps for production
        sourcemap: false,
        // Use modern target for smaller bundles
        target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
        // Use terser for better minification
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
                passes: 2
            },
            mangle: {
                safari10: true
            },
            format: {
                comments: false
            }
        },
        // Enable CSS code splitting
        cssCodeSplit: true,
        // Optimize asset inlining
        assetsInlineLimit: 4096
    },
    // Optimize dev server
     server: {
         hmr: {
             overlay: false
         }
     }
});
