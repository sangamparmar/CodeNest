// Minimal polyfill setup to avoid conflicts
import { Buffer } from 'buffer';
import process from 'process';

// Only apply polyfills in browser context
if (typeof window !== 'undefined') {
  // Essential polyfills for Node.js APIs in browser
  window.Buffer = window.Buffer || Buffer;
  window.process = window.process || process;
  window.global = window.global || window;
  
  console.log('Basic polyfills loaded successfully');
}

// Simple interface extension for TypeScript
declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: any;
    global: typeof globalThis;
  }
}