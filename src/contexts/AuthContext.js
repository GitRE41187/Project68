import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          // Verify token with backend
          const response = await axios.get('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      // Set default auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' 
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update user profile (includes password change)
  const updateUser = async (userData) => {
    try {
      let response;
      
      if (userData.newPassword) {
        // Handle password change
        response = await axios.put('/api/auth/change-password', {
          currentPassword: userData.currentPassword,
          newPassword: userData.newPassword
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update profile data separately
        const profileData = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          organization: userData.organization
        };
        
        const profileResponse = await axios.put('/api/auth/profile', profileData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(profileResponse.data.user);
      } else {
        // Handle profile update only
        const profileData = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          organization: userData.organization
        };
        
        response = await axios.put('/api/auth/profile', profileData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(response.data.user);
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' 
      };
    }
  };

  // Update user profile (legacy function)
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์' 
      };
    }
  };

  // Change password (legacy function)
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put('/api/auth/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' 
      };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
