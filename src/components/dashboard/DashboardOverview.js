import React from 'react';
import { FaTachometerAlt, FaRobot, FaVideo, FaCalendarAlt, FaUsers, FaClock } from 'react-icons/fa';

const DashboardOverview = () => {
  const stats = [
    { icon: FaRobot, label: 'หุ่นยนต์ออนไลน์', value: '8/12', color: 'success' },
    { icon: FaVideo, label: 'กล้องออนไลน์', value: '3/5', color: 'info' },
    { icon: FaCalendarAlt, label: 'การจองวันนี้', value: '15', color: 'primary' },
    { icon: FaUsers, label: 'ผู้ใช้ออนไลน์', value: '23', color: 'warning' },
    { icon: FaClock, label: 'เวลาทำงาน', value: '24/7', color: 'secondary' }
  ];

  const recentActivities = [
    { time: '14:30', user: 'สมชาย ใจดี', action: 'เริ่มควบคุมหุ่นยนต์ A', status: 'success' },
    { time: '14:15', user: 'สมหญิง รักเรียน', action: 'จองห้องปฏิบัติการ B', status: 'info' },
    { time: '14:00', user: 'สมศักดิ์ มุ่งมั่น', action: 'บันทึกวิดีโอ 30 นาที', status: 'warning' },
    { time: '13:45', user: 'สมศรี ตั้งใจ', action: 'อัปโหลดโค้ด Python', status: 'success' }
  ];

  return (
    <main className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">แดชบอร์ด</h1>
        <div className="text-muted">
          อัปเดตล่าสุด: {new Date().toLocaleString('th-TH')}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="col-md-2 col-6 mb-3">
              <div className="card stat-card">
                <div className="card-body text-center">
                  <IconComponent className={`text-${stat.color} mb-2`} style={{ fontSize: '2rem' }} />
                  <div className="stat-number text-${stat.color}">{stat.value}</div>
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
              <h5 className="mb-0"><FaRobot className="me-2" />สถานะหุ่นยนต์</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>หุ่นยนต์</th>
                      <th>สถานะ</th>
                      <th>ผู้ใช้ปัจจุบัน</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>หุ่นยนต์ A</td>
                      <td><span className="badge bg-success">ออนไลน์</span></td>
                      <td>สมชาย ใจดี</td>
                    </tr>
                    <tr>
                      <td>หุ่นยนต์ B</td>
                      <td><span className="badge bg-success">ออนไลน์</span></td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>หุ่นยนต์ C</td>
                      <td><span className="badge bg-warning">บำรุงรักษา</span></td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>หุ่นยนต์ D</td>
                      <td><span className="badge bg-success">ออนไลน์</span></td>
                      <td>-</td>
                    </tr>
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
                      <th>กล้อง</th>
                      <th>สถานะ</th>
                      <th>การใช้งาน</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>กล้องหลัก</td>
                      <td><span className="badge bg-success">ออนไลน์</span></td>
                      <td>บันทึกวิดีโอ</td>
                    </tr>
                    <tr>
                      <td>กล้องสำรอง</td>
                      <td><span className="badge bg-success">ออนไลน์</span></td>
                      <td>สตรีมมิ่ง</td>
                    </tr>
                    <tr>
                      <td>กล้องมุม</td>
                      <td><span className="badge bg-secondary">ออฟไลน์</span></td>
                      <td>-</td>
                    </tr>
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
              <h5 className="mb-0">กิจกรรมล่าสุด</h5>
            </div>
            <div className="card-body">
              <div className="activity-timeline">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-time">{activity.time}</div>
                    <div className="activity-title">{activity.user}</div>
                    <div className="activity-description">{activity.action}</div>
                    <span className={`badge bg-${activity.status}`}>
                      {activity.status === 'success' && 'สำเร็จ'}
                      {activity.status === 'info' && 'ข้อมูล'}
                      {activity.status === 'warning' && 'คำเตือน'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardOverview;
