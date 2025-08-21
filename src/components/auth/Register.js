import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaRobot, FaUser, FaEnvelope, FaPhone, FaUsers, FaLock, FaUserPlus } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength('');
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) {
      setPasswordStrength('weak');
    } else if (strength <= 3) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (passwordStrength === 'weak') {
      setError('รหัสผ่านต้องมีความแข็งแกร่งมากกว่านี้');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        userType: formData.userType,
        password: formData.password
      };

      const result = await register(userData);
      
      if (result.success) {
        navigate('/login', { 
          state: { message: 'สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ' }
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="register-container">
        <div className="register-header">
          <div className="robot-icon">
            <FaRobot />
          </div>
          <h1>Robot Control Lab</h1>
          <p>สมัครสมาชิกห้องปฏิบัติการควบคุมหุ่นยนต์</p>
        </div>
        
        <div className="register-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    placeholder="ชื่อ"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="firstName">
                    <FaUser className="me-2" />
                    ชื่อ
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    placeholder="นามสกุล"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="lastName">
                    <FaUser className="me-2" />
                    นามสกุล
                  </label>
                </div>
              </div>
            </div>
            
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
              />
              <label htmlFor="email">
                <FaEnvelope className="me-2" />
                อีเมล
              </label>
            </div>
            
            <div className="form-floating">
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                placeholder="เบอร์โทรศัพท์"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <label htmlFor="phone">
                <FaPhone className="me-2" />
                เบอร์โทรศัพท์
              </label>
            </div>
            
            <div className="form-floating">
              <select
                className="form-select"
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
              >
                <option value="">เลือกประเภทผู้ใช้</option>
                <option value="student">นักเรียน/นักศึกษา</option>
                <option value="teacher">ครู/อาจารย์</option>
                <option value="researcher">นักวิจัย</option>
                <option value="other">อื่นๆ</option>
              </select>
              <label htmlFor="userType">
                <FaUsers className="me-2" />
                ประเภทผู้ใช้
              </label>
            </div>
            
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="รหัสผ่าน"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="password">
                <FaLock className="me-2" />
                รหัสผ่าน
              </label>
            </div>
            
            {passwordStrength && (
              <div className={`password-strength ${passwordStrength}`}>
                {passwordStrength === 'weak' && 'รหัสผ่านอ่อนแอ'}
                {passwordStrength === 'medium' && 'รหัสผ่านปานกลาง'}
                {passwordStrength === 'strong' && 'รหัสผ่านแข็งแกร่ง'}
              </div>
            )}
            
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="ยืนยันรหัสผ่าน"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <label htmlFor="confirmPassword">
                <FaLock className="me-2" />
                ยืนยันรหัสผ่าน
              </label>
            </div>
            
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <label className="form-check-label" htmlFor="agreeTerms">
                ฉันยอมรับ <Link to="#" className="text-decoration-none">ข้อกำหนดการใช้งาน</Link> และ <Link to="#" className="text-decoration-none">นโยบายความเป็นส่วนตัว</Link>
              </label>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-register"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                <FaUserPlus className="me-2" />
              )}
              {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </button>
          </form>
        </div>
        
        <div className="register-footer">
          <p className="mb-0">
            มีบัญชีอยู่แล้ว? <Link to="/login" className="text-decoration-none">เข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
