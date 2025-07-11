
// API configuration - modify these constants to change endpoints
export const API_CONFIG = {
  // Use Supabase function instead of separate backend
  BASE_URL: 'https://yzwarjplbrhqbxxmaouv.supabase.co',
  
  // Supabase function endpoints
  ENDPOINTS: {
    FETCH_VIDEO_INFO: '/functions/v1/fetch-video-info',
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Headers for Supabase functions
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6d2FyanBsYnJocWJ4eG1hb3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTAxNTMsImV4cCI6MjA2NzgyNjE1M30.ThY6cm_13_J8Y8hVkheKeu0q2fa5r2wJOijo-rkt2yU',
  },
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
