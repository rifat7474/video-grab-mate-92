
// API configuration - modify these constants to change endpoints
export const API_CONFIG = {
  // Base URL for the video processing API - Python FastAPI backend
  BASE_URL: 'http://localhost:8000',
  
  // Endpoints
  ENDPOINTS: {
    DOWNLOAD_VIDEO: '/api/download',
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
