import React, { createContext, useContext, useState, useEffect } from 'react';
import pb, { auth, handlePocketBaseError } from '../lib/pocketbase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pb.authStore.isValid) {
      setUser(pb.authStore.model);
    }
    setLoading(false);

    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const authData = await auth.login(email, password);
      setUser(authData.record);
      
      return authData;
    } catch (err) {
      const errorData = handlePocketBaseError(err);
      setError(errorData);
      throw errorData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await auth.register({
        ...userData,
        emailVisibility: true,
        passwordConfirm: userData.password
      });

      const authData = await auth.login(userData.email, userData.password);
      setUser(authData.record);
      
      return authData;
    } catch (err) {
      const errorData = handlePocketBaseError(err);
      setError(errorData);
      throw errorData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
    setError(null);
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await pb.collection('users').update(user.id, userData);
      setUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      const errorData = handlePocketBaseError(err);
      setError(errorData);
      throw errorData;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};