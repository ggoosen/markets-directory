// src/hooks/useStallholder.js - Fixed import path
import { useState, useEffect } from 'react';
import StallholderService from '../services/StallholderService.js';
import { useAuth } from '../contexts/AuthContext';

export const useStallholder = () => {
  const [stallholder, setStallholder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'stallholder') {
      fetchStallholder();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchStallholder = async () => {
    try {
      setLoading(true);
      // Get stallholder profile for current user
      const result = await StallholderService.getStallholders({
        user: user.id
      });
      
      if (result.items.length > 0) {
        setStallholder(result.items[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    stallholder,
    loading,
    error,
    updateStallholder,
    createStallholder,
    refetch: fetchStallholder
  };
};