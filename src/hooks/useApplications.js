// src/hooks/useApplications.js - Fixed import
import { useState, useEffect } from 'react';
import ApplicationService from '../services/ApplicationService.js';

export const useApplications = (stallholderId, filters = {}) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (stallholderId) {
      fetchApplications();
    }
  }, [stallholderId, filters]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const result = await ApplicationService.getStallholderApplications(stallholderId, filters);
      setApplications(result.items);
      setPagination({
        page: result.page,
        perPage: result.perPage,
        totalItems: result.totalItems,
        totalPages: result.totalPages
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async (applicationData) => {
    try {
      const newApplication = await ApplicationService.submitApplication(applicationData);
      setApplications(prev => [newApplication, ...prev]);
      return newApplication;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const cancelApplication = async (applicationId) => {
    try {
      await ApplicationService.cancelApplication(applicationId);
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'cancelled' }
            : app
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    applications,
    loading,
    error,
    pagination,
    submitApplication,
    cancelApplication,
    refetch: fetchApplications
  };
};