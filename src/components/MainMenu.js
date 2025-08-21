import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaRobot, 
  FaVideo, 
  FaHistory, 
  FaQuestionCircle 
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
      color: 'primary'
    },
    {
      id: 'booking',
      title: 'จองห้องปฏิบัติการ',
      description: 'จองเวลาใช้งานห้องปฏิบัติการ',
      icon: FaCalendarAlt,
      path: '/booking',
      color: 'success'
    },
    {
      id: 'robot-control',
      title: 'ควบคุมหุ่นยนต์',
      description: 'เขียนโค้ด Python เพื่อควบคุมหุ่นยนต์',
      icon: FaRobot,
      path: '/robot-control',
      color: 'warning'
    },
    {
      id: 'camera',
      title: 'กล้องถ่ายทอดสด',
      description: 'ดูภาพจากกล้องและควบคุมการบันทึก',
      icon: FaVideo,
      path: '/camera',
      color: 'info'
    },
    {
      id: 'history',
      title: 'ประวัติการใช้งาน',
      description: 'ดูประวัติการใช้งานและสถิติ',
      icon: FaHistory,
      path: '/history',
      color: 'secondary'
    },
    {
      id: 'help',
      title: 'ช่วยเหลือ',
      description: 'คู่มือการใช้งานและติดต่อผู้ดูแล',
      icon: FaQuestionCircle,
      path: '/help',
      color: 'dark'
    }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <div className="main-container">
      <div className="container">
        {/* Welcome Card */}
        <div className="card welcome-card">
          <div className="card-body text-center">
            <h1 className="display-4 mb-3">ยินดีต้อนรับสู่ Robot Control Lab</h1>
            <p className="lead mb-4">
              สวัสดีคุณ {user?.firstName} {user?.lastName} 
              <br />
              ยินดีต้อนรับสู่ระบบห้องปฏิบัติการควบคุมหุ่นยนต์ออนไลน์
            </p>
            <div className="row">
              <div className="col-md-3 col-6 mb-3">
                <div className="stat-card">
                  <div className="stat-number text-success">5</div>
                  <div className="stat-label">ห้องปฏิบัติการ</div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div className="stat-card">
                  <div className="stat-number text-primary">12</div>
                  <div className="stat-label">หุ่นยนต์พร้อมใช้งาน</div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div className="stat-card">
                  <div className="stat-number text-warning">3</div>
                  <div className="stat-label">ห้องว่าง</div>
                </div>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div className="stat-card">
                  <div className="stat-number text-info">24/7</div>
                  <div className="stat-label">บริการตลอดเวลา</div>
                </div>
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
                  <div className={`menu-icon text-${item.color}`}>
                    <IconComponent />
                  </div>
                  <h3 className="menu-title">{item.title}</h3>
                  <p className="menu-description">{item.description}</p>
                  <div className="status-badge badge bg-success">พร้อมใช้งาน</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">การดำเนินการล่าสุด</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>การจองล่าสุด</h6>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <small className="text-muted">2024-01-15 14:30</small>
                        <br />
                        จองห้องปฏิบัติการ A - 2 ชั่วโมง
                      </li>
                      <li className="mb-2">
                        <small className="text-muted">2024-01-14 09:00</small>
                        <br />
                        จองห้องปฏิบัติการ B - 1 ชั่วโมง
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>การใช้งานล่าสุด</h6>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <small className="text-muted">2024-01-15 16:00</small>
                        <br />
                        ควบคุมหุ่นยนต์ - 45 นาที
                      </li>
                      <li className="mb-2">
                        <small className="text-muted">2024-01-14 15:30</small>
                        <br />
                        บันทึกวิดีโอ - 30 นาที
                      </li>
                    </ul>
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
