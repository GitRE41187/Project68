import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaRobot, FaUser, FaEnvelope, FaPhone, FaUsers, FaLock, FaUserPlus, FaGraduationCap, FaBuilding, FaUserTie, FaMicroscope, FaIndustry, FaSchool } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: '',
    organization: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const userTypeOptions = [
    { value: 'student', label: 'นักเรียน/นักศึกษา', icon: FaGraduationCap, description: 'สำหรับนักเรียนและนักศึกษาที่ต้องการเรียนรู้การควบคุมหุ่นยนต์' },
    { value: 'teacher', label: 'ครู/อาจารย์', icon: FaSchool, description: 'สำหรับครูและอาจารย์ที่ต้องการสอนหรือวิจัยเกี่ยวกับหุ่นยนต์' },
    { value: 'researcher', label: 'นักวิจัย', icon: FaMicroscope, description: 'สำหรับนักวิจัยที่ต้องการทดลองและพัฒนาเทคโนโลยีหุ่นยนต์' },
    { value: 'business', label: 'ธุรกิจ/องค์กร', icon: FaBuilding, description: 'สำหรับบริษัทและองค์กรที่ต้องการทดสอบหรือพัฒนาผลิตภัณฑ์' },
    { value: 'engineer', label: 'วิศวกร/ผู้เชี่ยวชาญ', icon: FaUserTie, description: 'สำหรับวิศวกรและผู้เชี่ยวชาญด้านหุ่นยนต์' },
    { value: 'industry', label: 'ภาคอุตสาหกรรม', icon: FaIndustry, description: 'สำหรับโรงงานและภาคอุตสาหกรรมที่ต้องการใช้หุ่นยนต์' },
    { value: 'other', label: 'อื่นๆ', icon: FaUsers, description: 'สำหรับผู้ใช้ทั่วไปที่มีความสนใจในหุ่นยนต์' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Check password strength
    if (name === 'password') {
      const password = value;
      if (password.length === 0) {
        setPasswordStrength('');
      } else if (password.length < 8) {
        setPasswordStrength('weak');
      } else if (password.length < 12) {
        setPasswordStrength('medium');
      } else {
        setPasswordStrength('strong');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (!formData.agreeTerms) {
      setError('กรุณายอมรับเงื่อนไขการใช้งาน');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        userType: formData.userType,
        organization: formData.organization,
        password: formData.password,
        confirmPassword: formData.confirmPassword
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

  const selectedUserType = userTypeOptions.find(option => option.value === formData.userType);

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
                {userTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <label htmlFor="userType">
                <FaUsers className="me-2" />
                ประเภทผู้ใช้
              </label>
            </div>
            
            {selectedUserType && (
              <div className="user-type-info">
                <div className="user-type-icon">
                  {React.createElement(selectedUserType.icon)}
                </div>
                <div className="user-type-details">
                  <h6>{selectedUserType.label}</h6>
                  <p>{selectedUserType.description}</p>
                </div>
              </div>
            )}
            
            {formData.userType && (formData.userType === 'business' || formData.userType === 'industry' || formData.userType === 'organization') && (
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="organization"
                  name="organization"
                  placeholder="ชื่อองค์กร/บริษัท"
                  value={formData.organization}
                  onChange={handleChange}
                />
                <label htmlFor="organization">
                  <FaBuilding className="me-2" />
                  ชื่อองค์กร/บริษัท
                </label>
              </div>
            )}
             
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
            
            {passwordStrength && (
              <div className={`password-strength ${passwordStrength}`}>
                {passwordStrength === 'weak' && 'รหัสผ่านอ่อนแอ - ควรใช้ตัวอักษรผสมตัวเลขและสัญลักษณ์'}
                {passwordStrength === 'medium' && 'รหัสผ่านปานกลาง - ดีขึ้นแล้ว แต่ยังสามารถปรับปรุงได้'}
                {passwordStrength === 'strong' && 'รหัสผ่านแข็งแกร่ง - ปลอดภัยและดีเยี่ยม!'}
              </div>
            )}
            
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
                ฉันยอมรับ <Link to="#" className="text-decoration-none">เงื่อนไขการใช้งาน</Link> และ <Link to="#" className="text-decoration-none">นโยบายความเป็นส่วนตัว</Link>
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
          <p className="mb-2">
            มีบัญชีอยู่แล้ว? <Link to="/login" className="text-decoration-none">เข้าสู่ระบบ</Link>
          </p>
          <p className="mb-0 text-muted">
            <small>สมัครสมาชิกเพื่อเข้าถึงห้องปฏิบัติการหุ่นยนต์</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
