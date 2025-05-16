/// <reference types="vite/client" />

// Extend the Window interface to include our polyfill properties
interface Window {
  global: typeof globalThis;
  process: any;
  Buffer: typeof Buffer;
}