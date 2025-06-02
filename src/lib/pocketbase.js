import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090');

// Configure authentication
pb.autoCancellation(false);

// Export the instance
export default pb;

// Helper functions for common operations
export const auth = {
  // Login user
  async login(email, password) {
    return await pb.collection('users').authWithPassword(email, password);
  },

  // Register user
  async register(data) {
    return await pb.collection('users').create(data);
  },

  // Logout
  logout() {
    pb.authStore.clear();
  },

  // Get current user
  getCurrentUser() {
    return pb.authStore.model;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return pb.authStore.isValid;
  },

  // Subscribe to auth changes
  onChange(callback) {
    return pb.authStore.onChange(callback);
  }
};

// Helper for handling API errors
export const handlePocketBaseError = (error) => {
  console.error('PocketBase Error:', error);
  
  if (error?.response?.data) {
    // Extract field-specific errors
    const fieldErrors = {};
    Object.entries(error.response.data).forEach(([field, fieldError]) => {
      fieldErrors[field] = fieldError.message || fieldError;
    });
    return fieldErrors;
  }
  
  return { general: error.message || 'An unexpected error occurred' };
};
