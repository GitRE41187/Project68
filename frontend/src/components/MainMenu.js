import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaRobot, 
  FaVideo, 
  FaHistory, 
  FaQuestionCircle,
  FaRocket,
  FaChartLine,
  FaClock,
  FaStar,
  FaCog
} from 'react-icons/fa';

const MainMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      title: 'แดชบอร์ด',
      description: 'ดูสถานะระบบและสถิติการใช้งาน',
      icon: FaTachometerAlt,
      path: '/dashboard',
      color: 'primary',
      badge: 'แนะนำ',
      features: ['สถิติการใช้งาน', 'สถานะระบบ', 'การแจ้งเตือน']
    },
    {
      id: 'booking',
      title: 'จองห้องปฏิบัติการ',
      description: 'จองเวลาใช้งานห้องปฏิบัติการ',
      icon: FaCalendarAlt,
      path: '/booking',
      color: 'success',
      badge: 'ใหม่',
      features: ['จองเวลา', 'เลือกห้อง', 'ประวัติการจอง']
    },
    {
      id: 'robot-control',
      title: 'ควบคุมหุ่นยนต์',
      description: 'เขียนโค้ด Python เพื่อควบคุมหุ่นยนต์',
      icon: FaRobot,
      path: '/robot-control',
      color: 'warning',
      badge: 'ยอดนิยม',
      features: ['เขียนโค้ด Python', 'ควบคุมหุ่นยนต์', 'บันทึกโค้ด']
    },
    {
      id: 'camera',
      title: 'กล้องถ่ายทอดสด',
      description: 'ดูภาพจากกล้องและควบคุมการบันทึก (รวมกับควบคุมหุ่นยนต์)',
      icon: FaVideo,
      path: '/robot-control',
      color: 'info',
      badge: 'รวม',
      features: ['ดูภาพสด', 'บันทึกวิดีโอ', 'ควบคุมกล้อง']
    },
    {
      id: 'history',
      title: 'ประวัติการใช้งาน',
      description: 'ดูประวัติการใช้งานและสถิติ',
      icon: FaHistory,
      path: '/history',
      color: 'secondary',
      badge: 'ข้อมูล',
      features: ['ประวัติการใช้งาน', 'สถิติรายเดือน', 'รายงาน']
    },
    {
      id: 'settings',
      title: 'ตั้งค่า',
      description: 'จัดการข้อมูลส่วนตัวและการตั้งค่าต่างๆ',
      icon: FaCog,
      path: '/settings',
      color: 'dark',
      badge: 'ตั้งค่า',
      features: ['ข้อมูลส่วนตัว', 'เปลี่ยนรหัสผ่าน', 'ธีม']
    },
    {
      id: 'help',
      title: 'ช่วยเหลือ',
      description: 'คู่มือการใช้งานและติดต่อผู้ดูแล',
      icon: FaQuestionCircle,
      path: '/help',
      color: 'dark',
      badge: 'ช่วยเหลือ',
      features: ['คู่มือการใช้งาน', 'ติดต่อผู้ดูแล', 'FAQ']
    }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 17) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

  return (
    <div className="main-container">
      <div className="container">
        {/* Welcome Card */}
        <div className="card welcome-card">
          <div className="card-body text-center">
            <div className="welcome-header">
              <h1 className="display-4 mb-3">
                <FaRocket className="welcome-icon me-3" />
                ยินดีต้อนรับสู่ Robot Control Lab
              </h1>
              <p className="lead mb-4">
                {getGreeting()} คุณ {user?.firstName} {user?.lastName} 
                <br />
                <span className="welcome-subtitle">
                  ยินดีต้อนรับสู่ระบบห้องปฏิบัติการควบคุมหุ่นยนต์ออนไลน์
                </span>
              </p>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaRobot />
                </div>
                <div className="stat-number text-success">5</div>
                <div className="stat-label">ห้องปฏิบัติการ</div>
                <div className="stat-status available">พร้อมใช้งาน</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaRobot />
                </div>
                <div className="stat-number text-primary">12</div>
                <div className="stat-label">หุ่นยนต์พร้อมใช้งาน</div>
                <div className="stat-status available">พร้อมใช้งาน</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaClock />
                </div>
                <div className="stat-number text-warning">3</div>
                <div className="stat-label">ห้องว่าง</div>
                <div className="stat-status available">ว่าง</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaStar />
                </div>
                <div className="stat-number text-info">24/7</div>
                <div className="stat-label">บริการตลอดเวลา</div>
                <div className="stat-status available">เปิดให้บริการ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="menu-grid">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="card menu-card"
                onClick={() => handleMenuClick(item.path)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body">
                  <div className="menu-header">
                    <div className={`menu-icon text-${item.color}`}>
                      <IconComponent />
                    </div>
                    <div className="menu-badge">
                      {item.badge}
                    </div>
                  </div>
                  <h3 className="menu-title">{item.title}</h3>
                  <p className="menu-description">{item.description}</p>
                  
                  <div className="menu-features">
                    {item.features.map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="menu-action">
                    <span className="action-text">คลิกเพื่อเข้าใช้งาน</span>
                    <div className="action-arrow">→</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card quick-actions-card">
              <div className="card-header">
                <h5 className="mb-0">
                  <FaChartLine className="me-2" />
                  การดำเนินการล่าสุด
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="section-title">
                      <FaCalendarAlt className="me-2" />
                      การจองล่าสุด
                    </h6>
                    <div className="activity-list">
                      <div className="activity-item">
                        <div className="activity-time">2024-01-15 14:30</div>
                        <div className="activity-text">จองห้องปฏิบัติการ A - 2 ชั่วโมง</div>
                        <div className="activity-status success">สำเร็จ</div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-time">2024-01-14 09:00</div>
                        <div className="activity-text">จองห้องปฏิบัติการ B - 1 ชั่วโมง</div>
                        <div className="activity-status success">สำเร็จ</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="section-title">
                      <FaRobot className="me-2" />
                      การใช้งานล่าสุด
                    </h6>
                    <div className="activity-list">
                      <div className="activity-item">
                        <div className="activity-time">2024-01-15 16:00</div>
                        <div className="activity-text">ควบคุมหุ่นยนต์ - 45 นาที</div>
                        <div className="activity-status info">เสร็จสิ้น</div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-time">2024-01-14 15:30</div>
                        <div className="activity-text">บันทึกวิดีโอ - 30 นาที</div>
                        <div className="activity-status info">เสร็จสิ้น</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
