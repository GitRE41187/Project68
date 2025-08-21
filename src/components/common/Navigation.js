import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaArrowLeft, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/main-menu':
        return 'เมนูหลัก';
      case '/dashboard':
        return 'แดชบอร์ด';
      case '/booking':
        return 'จองห้องปฏิบัติการ';
      case '/robot-control':
        return 'ควบคุมหุ่นยนต์';
      case '/camera':
        return 'กล้องถ่ายทอดสด';
      case '/history':
        return 'ประวัติการใช้งาน';
      case '/help':
        return 'ช่วยเหลือ';
      default:
        return 'Robot Control Lab';
    }
  };

  const getBackPath = () => {
    const path = location.pathname;
    if (path === '/main-menu') return null;
    return '/main-menu';
  };

  const backPath = getBackPath();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        {backPath && (
          <button 
            className="btn back-button me-3"
            onClick={() => navigate(backPath)}
          >
            <FaArrowLeft className="me-2" />
            กลับไปเมนูหลัก
          </button>
        )}
        
        <span className="navbar-brand">
          {getPageTitle()}
        </span>
        
        <div className="navbar-nav ms-auto">
          <Dropdown>
            <Dropdown.Toggle 
              variant="link" 
              className="nav-link dropdown-toggle d-flex align-items-center text-white text-decoration-none"
            >
              <div className="user-avatar">
                <FaUser />
              </div>
              <span>{user?.firstName || 'ผู้ใช้'}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu-end">
              <Dropdown.Item href="#">
                <FaUser className="me-2" />
                โปรไฟล์
              </Dropdown.Item>
              <Dropdown.Item href="#">
                <FaCog className="me-2" />
                ตั้งค่า
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                ออกจากระบบ
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
