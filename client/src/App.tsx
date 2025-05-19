import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { Suspense, lazy, useState, useEffect } from 'react';
import Toast from './components/toast/Toast';
import GitHubCorner from './components/GitHubCorner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider } from './components/theme-provider';

// Use lazy loading for all pages to improve initial load time
const Home = lazy(() => import('./pages/Home'));
const Homepage = lazy(() => import('./pages/homepage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const EditorPage = lazy(() => import('./pages/EditorPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-dark text-white">
    <div className="text-center">
      <div className="mb-4 text-3xl font-bold">Loading...</div>
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
    </div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error("Application Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-dark text-white">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
            <p className="mb-4">The application encountered an error. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  
  // Ensure dark mode is applied immediately
  useEffect(() => {
    // Force dark mode by adding the class to html element
    document.documentElement.classList.add('dark');
  }, []);
  
  // Give the app a moment to initialize
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
      console.log('App initialization complete');
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    return <LoadingFallback />;
  }
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="codenest-theme" attribute="class">
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/homepage" element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            } />
            <Route path="/editor/:roomId" element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>        </Router>
        {/* Global Components */}
        <Toast />
        <GitHubCorner />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
