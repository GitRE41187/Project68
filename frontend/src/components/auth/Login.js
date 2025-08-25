import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaRobot, FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/main-menu');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page">
      <div className="login-container">
        <div className="login-header">
          <div className="robot-icon">
            <FaRobot />
          </div>
          <h1>Robot Control Lab</h1>
          <p>เข้าสู่ระบบห้องปฏิบัติการควบคุมหุ่นยนต์</p>
        </div>
        
        <div className="login-body">
          {location.state?.message && (
            <div className="alert alert-success" role="alert">
              {location.state.message}
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="อีเมล"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
              <label htmlFor="email">
                <FaEnvelope className="me-2" />
                อีเมล
              </label>
            </div>
            
            <div className="form-floating password-field">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                placeholder="รหัสผ่าน"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <label htmlFor="password">
                <FaLock className="me-2" />
                รหัสผ่าน
              </label>
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            <div className="form-options">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  จดจำฉัน
                </label>
              </div>
              
              <Link to="#" className="forgot-password">
                ลืมรหัสผ่าน?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-login"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                <FaSignInAlt className="me-2" />
              )}
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
        
        <div className="login-footer">
          <p className="mb-2">
            ยังไม่มีบัญชี? <Link to="/register" className="text-decoration-none">สมัครสมาชิก</Link>
          </p>
          <p className="mb-0 text-muted">
            <small>เข้าสู่ระบบเพื่อเริ่มต้นใช้งานห้องปฏิบัติการหุ่นยนต์</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
