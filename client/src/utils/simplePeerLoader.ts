// Utility to load SimplePeer asynchronously
let SimplePeerModule: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

/**
 * Preloads the SimplePeer module and caches it for future use.
 * Returns a promise that resolves to the SimplePeer constructor.
 */
export const preloadSimplePeer = (): Promise<any> => {
  if (SimplePeerModule) {
    return Promise.resolve(SimplePeerModule);
  }
  
  if (loadPromise) {
    return loadPromise;
  }
  
  isLoading = true;
  loadPromise = import('simple-peer')
    .then(module => {
      SimplePeerModule = module.default;
      console.info('SimplePeer loaded successfully');
      return SimplePeerModule;
    })
    .catch(error => {
      console.error('Failed to load SimplePeer:', error);
      loadPromise = null;
      throw error;
    })
    .finally(() => {
      isLoading = false;
    });
    
  return loadPromise;
};

/**
 * Gets the SimplePeer module if it's already loaded, or returns null.
 */
export const getSimplePeer = (): any => SimplePeerModule;

/**
 * Checks if SimplePeer is currently loading.
 */
export const isSimplePeerLoading = (): boolean => isLoading;