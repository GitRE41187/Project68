import React, { useState, useEffect } from 'react';
import { FaTachometerAlt, FaRobot, FaVideo, FaCalendarAlt, FaUsers, FaClock, FaWifi, FaWifiSlash, FaServer, FaDatabase } from 'react-icons/fa';
import axios from 'axios';

const DashboardOverview = () => {
  const [systemHealth, setSystemHealth] = useState({
    mainServer: 'checking',
    raspberryPi: 'checking',
    database: 'checking'
  });
  const [piStatus, setPiStatus] = useState(null);
  const [stats, setStats] = useState({
    userBookings: 0,
    userExecutions: 0,
    totalUsers: 0,
    todayBookings: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemHealth();
    fetchDashboardStats();
    fetchRecentActivities();
    
    const interval = setInterval(() => {
      fetchSystemHealth();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const response = await axios.get('/api/health');
      if (response.data.success) {
        setSystemHealth(response.data.services);
        setPiStatus(response.data.raspberryPi);
      }
    } catch (error) {
      console.error('Error fetching system health:', error);
      setSystemHealth({
        mainServer: 'offline',
        raspberryPi: 'offline',
        database: 'offline'
      });
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await axios.get('/api/history', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        setRecentActivities(response.data.activities.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      // Fallback to static data
      setRecentActivities([
        { time: '14:30', user: 'สมชาย ใจดี', action: 'เริ่มควบคุมหุ่นยนต์ A', status: 'success' },
        { time: '14:15', user: 'สมหญิง รักเรียน', action: 'จองห้องปฏิบัติการ B', status: 'info' },
        { time: '14:00', user: 'สมศักดิ์ มุ่งมั่น', action: 'บันทึกวิดีโอ 30 นาที', status: 'warning' },
        { time: '13:45', user: 'สมศรี ตั้งใจ', action: 'อัปโหลดโค้ด Python', status: 'success' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <FaWifi className="text-success" />;
      case 'offline':
        return <FaWifiSlash className="text-danger" />;
      default:
        return <FaWifi className="text-warning" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'online':
        return <span className="badge bg-success">Online</span>;
      case 'offline':
        return <span className="badge bg-danger">Offline</span>;
      default:
        return <span className="badge bg-warning">Checking...</span>;
    }
  };

  const dashboardStats = [
    { 
      icon: FaRobot, 
      label: 'หุ่นยนต์ออนไลน์', 
      value: systemHealth.raspberryPi === 'online' ? '4/4' : '0/4', 
      color: systemHealth.raspberryPi === 'online' ? 'success' : 'danger' 
    },
    { 
      icon: FaVideo, 
      label: 'กล้องออนไลน์', 
      value: systemHealth.raspberryPi === 'online' ? '4/4' : '0/4', 
      color: systemHealth.raspberryPi === 'online' ? 'info' : 'danger' 
    },
    { 
      icon: FaCalendarAlt, 
      label: 'การจองวันนี้', 
      value: stats.todayBookings.toString(), 
      color: 'primary' 
    },
    { 
      icon: FaUsers, 
      label: 'ผู้ใช้ออนไลน์', 
      value: stats.totalUsers.toString(), 
      color: 'warning' 
    },
    { 
      icon: FaClock, 
      label: 'เวลาทำงาน', 
      value: '24/7', 
      color: 'secondary' 
    }
  ];

  const labs = [
    { id: 1, name: 'ห้องปฏิบัติการ A', status: systemHealth.raspberryPi === 'online' ? 'available' : 'offline', description: 'ห้องปฏิบัติการควบคุมหุ่นยนต์พื้นฐาน' },
    { id: 2, name: 'ห้องปฏิบัติการ B', status: systemHealth.raspberryPi === 'online' ? 'available' : 'offline', description: 'ห้องปฏิบัติการควบคุมหุ่นยนต์ขั้นสูง' },
    { id: 3, name: 'ห้องปฏิบัติการ C', status: 'maintenance', description: 'ห้องปฏิบัติการทดสอบระบบ' },
    { id: 4, name: 'ห้องปฏิบัติการ D', status: systemHealth.raspberryPi === 'online' ? 'available' : 'offline', description: 'ห้องปฏิบัติการวิจัย' }
  ];

  if (loading) {
    return (
      <main className="container-fluid p-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">แดชบอร์ด</h1>
        <div className="text-muted">
          อัปเดตล่าสุด: {new Date().toLocaleString('th-TH')}
        </div>
      </div>

      {/* System Health Overview */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <FaServer className="me-2" />
                System Health Status
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaServer className="me-3 text-primary" style={{ fontSize: '1.5rem' }} />
                    <div>
                      <div className="fw-bold">Main Server</div>
                      <div className="d-flex align-items-center">
                        {getStatusIcon(systemHealth.mainServer)}
                        <span className="ms-2">{getStatusBadge(systemHealth.mainServer)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaRobot className="me-3 text-success" style={{ fontSize: '1.5rem' }} />
                    <div>
                      <div className="fw-bold">Raspberry Pi</div>
                      <div className="d-flex align-items-center">
                        {getStatusIcon(systemHealth.raspberryPi)}
                        <span className="ms-2">{getStatusBadge(systemHealth.raspberryPi)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center mb-3">
                    <FaDatabase className="me-3 text-info" style={{ fontSize: '1.5rem' }} />
                    <div>
                      <div className="fw-bold">Database</div>
                      <div className="d-flex align-items-center">
                        {getStatusIcon(systemHealth.database)}
                        <span className="ms-2">{getStatusBadge(systemHealth.database)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {piStatus && systemHealth.raspberryPi === 'online' && (
                <div className="mt-3 p-3 bg-light rounded">
                  <h6>Raspberry Pi Status:</h6>
                  <div className="row">
                    <div className="col-md-3">
                      <small className="text-muted">Direction:</small>
                      <div className="fw-bold">{piStatus.direction}</div>
                    </div>
                    <div className="col-md-3">
                      <small className="text-muted">Speed:</small>
                      <div className="fw-bold">{piStatus.speed}%</div>
                    </div>
                    <div className="col-md-3">
                      <small className="text-muted">Distance:</small>
                      <div className="fw-bold">{piStatus.distance} cm</div>
                    </div>
                    <div className="col-md-3">
                      <small className="text-muted">Light Level:</small>
                      <div className="fw-bold">{piStatus.light_level}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4">
        {dashboardStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="col-md-2 col-6 mb-3">
              <div className="card stat-card">
                <div className="card-body text-center">
                  <IconComponent className={`text-${stat.color} mb-2`} style={{ fontSize: '2rem' }} />
                  <div className={`stat-number text-${stat.color}`}>{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Status */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0"><FaRobot className="me-2" />สถานะห้องปฏิบัติการ</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>ห้องปฏิบัติการ</th>
                      <th>สถานะ</th>
                      <th>คำอธิบาย</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labs.map(lab => (
                      <tr key={lab.id}>
                        <td>{lab.name}</td>
                        <td>
                          {lab.status === 'available' ? (
                            <span className="badge bg-success">พร้อมใช้งาน</span>
                          ) : lab.status === 'maintenance' ? (
                            <span className="badge bg-warning">บำรุงรักษา</span>
                          ) : (
                            <span className="badge bg-danger">ไม่พร้อมใช้งาน</span>
                          )}
                        </td>
                        <td>
                          <small className="text-muted">{lab.description}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0"><FaVideo className="me-2" />สถานะกล้อง</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>ห้องปฏิบัติการ</th>
                      <th>สถานะกล้อง</th>
                      <th>การเชื่อมต่อ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labs.map(lab => (
                      <tr key={lab.id}>
                        <td>{lab.name}</td>
                        <td>
                          {lab.status === 'available' && systemHealth.raspberryPi === 'online' ? (
                            <span className="badge bg-success">พร้อมใช้งาน</span>
                          ) : lab.status === 'maintenance' ? (
                            <span className="badge bg-warning">บำรุงรักษา</span>
                          ) : (
                            <span className="badge bg-danger">ไม่พร้อมใช้งาน</span>
                          )}
                        </td>
                        <td>
                          {lab.status === 'available' && systemHealth.raspberryPi === 'online' ? (
                            <span className="badge bg-success">เชื่อมต่อแล้ว</span>
                          ) : (
                            <span className="badge bg-danger">ไม่เชื่อมต่อ</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0"><FaClock className="me-2" />กิจกรรมล่าสุด</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>เวลา</th>
                      <th>ผู้ใช้</th>
                      <th>กิจกรรม</th>
                      <th>สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map((activity, index) => (
                      <tr key={index}>
                        <td>{activity.time}</td>
                        <td>{activity.user}</td>
                        <td>{activity.action}</td>
                        <td>
                          <span className={`badge bg-${activity.status}`}>
                            {activity.status === 'success' ? 'สำเร็จ' : 
                             activity.status === 'info' ? 'ข้อมูล' : 
                             activity.status === 'warning' ? 'คำเตือน' : 'ข้อผิดพลาด'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardOverview;
