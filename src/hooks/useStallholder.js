// src/hooks/useStallholder.js - Complete Implementation
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
      setError(null);
      
      // Get stallholder profile for current user
      const result = await StallholderService.getStallholders({
        user: user.id
      });
      
      if (result.items.length > 0) {
        setStallholder(result.items[0]);
      }
    } catch (err) {
      console.error('Error fetching stallholder:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStallholder = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!stallholder) {
        throw new Error('No stallholder profile to update');
      }
      
      const updated = await StallholderService.updateStallholder(stallholder.id, data);
      setStallholder(updated);
      return updated;
    } catch (err) {
      console.error('Error updating stallholder:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createStallholder = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('User must be logged in to create stallholder profile');
      }
      
      const created = await StallholderService.createStallholder({
        ...data,
        user: user.id
      });
      
      setStallholder(created);
      return created;
    } catch (err) {
      console.error('Error creating stallholder:', err);
      setError(err.message);
      throw err;
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
    refetch: fetchStallholder,
    hasProfile: !!stallholder
  };
};