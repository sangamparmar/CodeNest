// Basic polyfills import first
import './polyfill.ts';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import AppProvider from "./context/AppProvider.tsx";
import "@/styles/global.css";

// Load app with better error handling
const mountApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Root element not found. Creating one...");
    const newRoot = document.createElement("div");
    newRoot.id = "root";
    document.body.appendChild(newRoot);
    
    renderApp(newRoot);
  } else {
    renderApp(rootElement);
  }
};

const renderApp = (container: HTMLElement) => {
  try {
    ReactDOM.createRoot(container).render(
      <React.StrictMode>
        <AppProvider>
          <App />
        </AppProvider>
      </React.StrictMode>
    );
    console.log("App rendering started");
  } catch (error) {
    console.error("Failed to render React application:", error);
    container.innerHTML = `
      <div style="padding: 20px; color: white; background-color: #333;">
        <h1>Unable to load application</h1>
        <p>There was an error loading the application. Please try refreshing the page.</p>
        <p>Error details: ${error}</p>
        <button onclick="window.location.reload()" style="padding: 8px 16px; background: #4338ca; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
          Refresh Page
        </button>
      </div>
    `;
  }
};

// Start app initialization with a small delay to ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  // Small delay to ensure browser is ready
  setTimeout(mountApp, 50);
}
