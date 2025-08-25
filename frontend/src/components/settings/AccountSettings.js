import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaUsers, 
  FaBuilding, 
  FaCog, 
  FaPalette, 
  FaSun, 
  FaMoon, 
  FaSave, 
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaChartLine
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const AccountSettings = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    organization: user?.organization || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      organization: user?.organization || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Validate password change if attempting to change password
      if (formData.newPassword || formData.confirmPassword) {
        if (!formData.currentPassword) {
          setError('กรุณากรอกรหัสผ่านปัจจุบัน');
          setLoading(false);
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setError('รหัสผ่านใหม่ไม่ตรงกัน');
          setLoading(false);
          return;
        }
        if (formData.newPassword.length < 8) {
          setError('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
          setLoading(false);
          return;
        }
      }

      // Update user data
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const result = await updateUser(updateData);
      
      if (result.success) {
        setMessage('อัปเดตข้อมูลสำเร็จ');
        setIsEditing(false);
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        setError(result.error || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.userType === 'teacher' || user?.userType === 'engineer';

  return (
    <div className="settings-page">
      <div className="container">
        <div className="settings-header">
          <h1 className="settings-title">
            <FaCog className="me-3" />
            ตั้งค่าบัญชีผู้ใช้
          </h1>
          <p className="settings-subtitle">
            จัดการข้อมูลส่วนตัวและการตั้งค่าต่างๆ
          </p>
        </div>

        <div className="row">
          {/* Main Settings */}
          <div className="col-lg-8">
            <div className="settings-card">
              <div className="card-header">
                <h3 className="mb-0">
                  <FaUser className="me-2" />
                  ข้อมูลส่วนตัว
                </h3>
                {!isEditing && (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleEdit}
                  >
                    <FaEdit className="me-2" />
                    แก้ไข
                  </button>
                )}
              </div>
              
              <div className="card-body">
                {message && (
                  <div className="alert alert-success" role="alert">
                    {message}
                  </div>
                )}
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="firstName">
                          <FaUser className="me-2" />
                          ชื่อ
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="lastName">
                          <FaUser className="me-2" />
                          นามสกุล
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <FaEnvelope className="me-2" />
                      อีเมล
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      <FaPhone className="me-2" />
                      เบอร์โทรศัพท์
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  {user?.organization && (
                    <div className="form-group">
                      <label htmlFor="organization">
                        <FaBuilding className="me-2" />
                        องค์กร/บริษัท
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="userType">
                      <FaUsers className="me-2" />
                      ประเภทผู้ใช้
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={user?.userType === 'student' ? 'นักเรียน/นักศึกษา' :
                             user?.userType === 'teacher' ? 'ครู/อาจารย์' :
                             user?.userType === 'researcher' ? 'นักวิจัย' :
                             user?.userType === 'business' ? 'ธุรกิจ/องค์กร' :
                             user?.userType === 'engineer' ? 'วิศวกร/ผู้เชี่ยวชาญ' :
                             user?.userType === 'industry' ? 'ภาคอุตสาหกรรม' :
                             'อื่นๆ'}
                      disabled
                      className="form-control-plaintext"
                    />
                  </div>

                  {isEditing && (
                    <>
                      <hr className="my-4" />
                      <h5>เปลี่ยนรหัสผ่าน</h5>
                      <div className="form-group">
                        <label htmlFor="currentPassword">
                          <FaShieldAlt className="me-2" />
                          รหัสผ่านปัจจุบัน
                        </label>
                        <div className="password-input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="กรอกรหัสผ่านปัจจุบัน (ถ้าต้องการเปลี่ยนรหัสผ่าน)"
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="newPassword">
                          <FaShieldAlt className="me-2" />
                          รหัสผ่านใหม่
                        </label>
                        <div className="password-input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmPassword">
                          <FaShieldAlt className="me-2" />
                          ยืนยันรหัสผ่านใหม่
                        </label>
                        <div className="password-input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="ยืนยันรหัสผ่านใหม่"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {isEditing && (
                    <div className="form-actions">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : (
                          <FaSave className="me-2" />
                        )}
                        {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        ยกเลิก
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="col-lg-4">
            {/* Theme Settings */}
            <div className="settings-card">
              <div className="card-header">
                <h4 className="mb-0">
                  <FaPalette className="me-2" />
                  การแสดงผล
                </h4>
              </div>
              <div className="card-body">
                <div className="theme-toggle">
                  <label className="theme-label">โหมดธีม</label>
                  <div className="theme-switch">
                    <button
                      className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                      onClick={() => setTheme('light')}
                    >
                      <FaSun />
                      <span>สว่าง</span>
                    </button>
                    <button
                      className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                      onClick={() => setTheme('dark')}
                    >
                      <FaMoon />
                      <span>มืด</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Panel Access */}
            {isAdmin && (
              <div className="settings-card">
                <div className="card-header">
                  <h4 className="mb-0">
                    <FaChartLine className="me-2" />
                    แผงควบคุมผู้ดูแล
                  </h4>
                </div>
                <div className="card-body">
                  <p className="text-muted mb-3">
                    คุณมีสิทธิ์เข้าถึงแผงควบคุมผู้ดูแลระบบ
                  </p>
                  <button 
                    className="btn btn-warning w-100"
                    onClick={() => navigate('/admin/monitor')}
                  >
                    <FaChartLine className="me-2" />
                    เข้าสู่แผงควบคุม
                  </button>
                </div>
              </div>
            )}

            {/* Account Actions */}
            <div className="settings-card">
              <div className="card-header">
                <h4 className="mb-0">
                  <FaCog className="me-2" />
                  การดำเนินการ
                </h4>
              </div>
              <div className="card-body">
                <button 
                  className="btn btn-outline-danger w-100 mb-2"
                  onClick={() => {
                    if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
                      logout();
                      navigate('/login');
                    }
                  }}
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
