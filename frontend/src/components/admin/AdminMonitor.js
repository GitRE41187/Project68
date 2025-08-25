import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaChartLine, 
  FaUsers, 
  FaRobot, 
  FaCalendarAlt, 
  FaVideo, 
  FaServer, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTachometerAlt,
  FaDatabase,
  FaNetworkWired,
  FaCog,
  FaInfoCircle
} from 'react-icons/fa';
import './AdminMonitor.css';

const AdminMonitor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRobots: 0,
    availableRobots: 0,
    totalBookings: 0,
    pendingBookings: 0,
    systemStatus: 'operational',
    uptime: '99.9%'
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 45,
    memory: 62,
    network: 78,
    storage: 34
  });

  useEffect(() => {
    // Check if user has admin access
    if (!user || (user.userType !== 'teacher' && user.userType !== 'engineer')) {
      navigate('/main-menu');
      return;
    }

    // Simulate loading data
    const loadData = async () => {
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalUsers: 156,
          activeUsers: 89,
          totalRobots: 12,
          availableRobots: 8,
          totalBookings: 234,
          pendingBookings: 12,
          systemStatus: 'operational',
          uptime: '99.9%'
        });

        setRecentActivities([
          {
            id: 1,
            type: 'user_login',
            user: 'สมชาย ใจดี',
            action: 'เข้าสู่ระบบ',
            timestamp: '2 นาทีที่แล้ว',
            status: 'success'
          },
          {
            id: 2,
            type: 'robot_booking',
            user: 'สมหญิง รักดี',
            action: 'จองหุ่นยนต์ A',
            timestamp: '5 นาทีที่แล้ว',
            status: 'pending'
          },
          {
            id: 3,
            type: 'system_alert',
            user: 'System',
            action: 'ตรวจสอบระบบเสร็จสิ้น',
            timestamp: '10 นาทีที่แล้ว',
            status: 'info'
          },
          {
            id: 4,
            type: 'robot_maintenance',
            user: 'วิศวกรระบบ',
            action: 'บำรุงรักษาหุ่นยนต์ B',
            timestamp: '15 นาทีที่แล้ว',
            status: 'warning'
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error loading admin data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      case 'info': return 'info';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <FaCheckCircle />;
      case 'warning': return <FaExclamationTriangle />;
      case 'error': return <FaExclamationTriangle />;
      case 'info': return <FaInfoCircle />;
      case 'pending': return <FaClock />;
      default: return <FaClock />;
    }
  };

  if (loading) {
    return (
      <div className="admin-monitor-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">กำลังโหลด...</span>
            </div>
            <p className="mt-3">กำลังโหลดข้อมูลระบบ...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-monitor-page">
      <div className="container">
        {/* Header */}
        <div className="monitor-header">
          <div className="header-content">
            <h1 className="monitor-title">
              <FaChartLine className="me-3" />
              แผงควบคุมผู้ดูแลระบบ
            </h1>
            <p className="monitor-subtitle">
              ตรวจสอบและติดตามสถานะระบบทั้งหมด
            </p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/settings')}
            >
              <FaCog className="me-2" />
              ตั้งค่า
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/main-menu')}
            >
              <FaTachometerAlt className="me-2" />
              หน้าหลัก
            </button>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="status-overview">
              <div className="status-item">
                <div className="status-icon operational">
                  <FaCheckCircle />
                </div>
                <div className="status-info">
                  <h4>สถานะระบบ</h4>
                  <p className="status-text operational">ทำงานปกติ</p>
                  <small>Uptime: {stats.uptime}</small>
                </div>
              </div>
              <div className="status-item">
                <div className="status-icon">
                  <FaUsers />
                </div>
                <div className="status-info">
                  <h4>ผู้ใช้ทั้งหมด</h4>
                  <p className="status-number">{stats.totalUsers}</p>
                  <small>ผู้ใช้ที่ใช้งาน: {stats.activeUsers}</small>
                </div>
              </div>
              <div className="status-item">
                <div className="status-icon">
                  <FaRobot />
                </div>
                <div className="status-info">
                  <h4>หุ่นยนต์</h4>
                  <p className="status-number">{stats.totalRobots}</p>
                  <small>พร้อมใช้งาน: {stats.availableRobots}</small>
                </div>
              </div>
              <div className="status-item">
                <div className="status-icon">
                  <FaCalendarAlt />
                </div>
                <div className="status-info">
                  <h4>การจอง</h4>
                  <p className="status-number">{stats.totalBookings}</p>
                  <small>รอการอนุมัติ: {stats.pendingBookings}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* System Metrics */}
          <div className="col-lg-8">
            <div className="monitor-card">
              <div className="card-header">
                <h3 className="mb-0">
                  <FaServer className="me-2" />
                  ข้อมูลระบบ
                </h3>
              </div>
              <div className="card-body">
                <div className="metrics-grid">
                  <div className="metric-item">
                    <div className="metric-header">
                      <span className="metric-label">CPU Usage</span>
                      <span className="metric-value">{systemMetrics.cpu}%</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${systemMetrics.cpu}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="metric-item">
                    <div className="metric-header">
                      <span className="metric-label">Memory Usage</span>
                      <span className="metric-value">{systemMetrics.memory}%</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${systemMetrics.memory}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="metric-item">
                    <div className="metric-header">
                      <span className="metric-label">Network</span>
                      <span className="metric-value">{systemMetrics.network}%</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${systemMetrics.network}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="metric-item">
                    <div className="metric-header">
                      <span className="metric-label">Storage</span>
                      <span className="metric-value">{systemMetrics.storage}%</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${systemMetrics.storage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="monitor-card">
              <div className="card-header">
                <h3 className="mb-0">
                  <FaClock className="me-2" />
                  กิจกรรมล่าสุด
                </h3>
              </div>
              <div className="card-body">
                <div className="activities-list">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="activity-content">
                        <div className="activity-header">
                          <span className="activity-user">{activity.user}</span>
                          <span className="activity-time">{activity.timestamp}</span>
                        </div>
                        <p className="activity-action">{activity.action}</p>
                      </div>
                      <div className={`activity-status ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="col-lg-4">
            {/* Quick Actions */}
            <div className="monitor-card">
              <div className="card-header">
                <h4 className="mb-0">
                  <FaTachometerAlt className="me-2" />
                  การดำเนินการด่วน
                </h4>
              </div>
              <div className="card-body">
                <div className="quick-actions">
                  <button className="btn btn-outline-primary w-100 mb-2">
                    <FaUsers className="me-2" />
                    จัดการผู้ใช้
                  </button>
                  <button className="btn btn-outline-warning w-100 mb-2">
                    <FaRobot className="me-2" />
                    จัดการหุ่นยนต์
                  </button>
                  <button className="btn btn-outline-info w-100 mb-2">
                    <FaCalendarAlt className="me-2" />
                    อนุมัติการจอง
                  </button>
                  <button className="btn btn-outline-success w-100 mb-2">
                    <FaVideo className="me-2" />
                    จัดการกล้อง
                  </button>
                </div>
              </div>
            </div>

            {/* System Alerts */}
            <div className="monitor-card">
              <div className="card-header">
                <h4 className="mb-0">
                  <FaExclamationTriangle className="me-2" />
                  การแจ้งเตือนระบบ
                </h4>
              </div>
              <div className="card-body">
                <div className="alerts-list">
                  <div className="alert-item info">
                    <div className="alert-icon">
                      <FaInfoCircle />
                    </div>
                    <div className="alert-content">
                      <p>ระบบทำงานปกติ</p>
                      <small>2 นาทีที่แล้ว</small>
                    </div>
                  </div>
                  
                  <div className="alert-item warning">
                    <div className="alert-icon">
                      <FaExclamationTriangle />
                    </div>
                    <div className="alert-content">
                      <p>หุ่นยนต์ B ต้องการบำรุงรักษา</p>
                      <small>15 นาทีที่แล้ว</small>
                    </div>
                  </div>
                  
                  <div className="alert-item success">
                    <div className="alert-icon">
                      <FaCheckCircle />
                    </div>
                    <div className="alert-content">
                      <p>การสำรองข้อมูลเสร็จสิ้น</p>
                      <small>1 ชั่วโมงที่แล้ว</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Database Status */}
            <div className="monitor-card">
              <div className="card-header">
                <h4 className="mb-0">
                  <FaDatabase className="me-2" />
                  สถานะฐานข้อมูล
                </h4>
              </div>
              <div className="card-body">
                <div className="db-status">
                  <div className="status-indicator operational">
                    <span className="status-dot"></span>
                    <span>เชื่อมต่อปกติ</span>
                  </div>
                  <div className="db-metrics">
                    <div className="metric-row">
                      <span>การเชื่อมต่อ:</span>
                      <span className="metric-value">24/24</span>
                    </div>
                    <div className="metric-row">
                      <span>เวลาตอบสนอง:</span>
                      <span className="metric-value">45ms</span>
                    </div>
                    <div className="metric-row">
                      <span>ขนาดฐานข้อมูล:</span>
                      <span className="metric-value">2.4 GB</span>
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

export default AdminMonitor;
