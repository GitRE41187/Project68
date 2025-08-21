import React, { useState } from 'react';
import { FaHistory, FaFilter, FaDownload, FaEye, FaTrash, FaCalendarAlt, FaRobot, FaVideo } from 'react-icons/fa';

const History = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const historyData = [
    {
      id: 1,
      type: 'robot',
      title: 'ควบคุมหุ่นยนต์ A',
      description: 'รันโค้ด Python เพื่อควบคุมหุ่นยนต์',
      date: '2024-01-15',
      time: '14:30',
      duration: '45 นาที',
      user: 'สมชาย ใจดี',
      status: 'completed'
    },
    {
      id: 2,
      type: 'camera',
      title: 'บันทึกวิดีโอ',
      description: 'บันทึกวิดีโอจากกล้องหลัก',
      date: '2024-01-15',
      time: '15:00',
      duration: '30 นาที',
      user: 'สมหญิง รักเรียน',
      status: 'completed'
    },
    {
      id: 3,
      type: 'booking',
      title: 'จองห้องปฏิบัติการ B',
      description: 'จองห้องปฏิบัติการสำหรับการทดลอง',
      date: '2024-01-15',
      time: '16:00',
      duration: '2 ชั่วโมง',
      user: 'สมศักดิ์ มุ่งมั่น',
      status: 'active'
    },
    {
      id: 4,
      type: 'robot',
      title: 'ควบคุมหุ่นยนต์ C',
      description: 'ทดสอบการเคลื่อนที่ของหุ่นยนต์',
      date: '2024-01-14',
      time: '10:30',
      duration: '1 ชั่วโมง',
      user: 'สมศรี ตั้งใจ',
      status: 'completed'
    },
    {
      id: 5,
      type: 'camera',
      title: 'ถ่ายภาพ',
      description: 'ถ่ายภาพจากกล้องสำรอง',
      date: '2024-01-14',
      time: '11:00',
      duration: '5 นาที',
      user: 'สมชาย ใจดี',
      status: 'completed'
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'robot':
        return <FaRobot className="text-warning" />;
      case 'camera':
        return <FaVideo className="text-info" />;
      case 'booking':
        return <FaCalendarAlt className="text-success" />;
      default:
        return <FaHistory className="text-secondary" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'robot':
        return 'ควบคุมหุ่นยนต์';
      case 'camera':
        return 'กล้อง';
      case 'booking':
        return 'การจอง';
      default:
        return 'อื่นๆ';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="badge bg-success">เสร็จสิ้น</span>;
      case 'active':
        return <span className="badge bg-primary">กำลังดำเนินการ</span>;
      case 'cancelled':
        return <span className="badge bg-danger">ยกเลิก</span>;
      default:
        return <span className="badge bg-secondary">ไม่ทราบสถานะ</span>;
    }
  };

  const filteredData = historyData.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesDate = !filterDate || item.date === filterDate;
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesDate && matchesSearch;
  });

  const handleExport = () => {
    // Export functionality
    console.log('Exporting history data...');
  };

  const handleView = (item) => {
    // View details functionality
    console.log('Viewing item:', item);
  };

  const handleDelete = (item) => {
    // Delete functionality
    console.log('Deleting item:', item);
  };

  return (
    <main className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">ประวัติการใช้งาน</h1>
        <button className="btn btn-outline-primary" onClick={handleExport}>
          <FaDownload className="me-2" />ส่งออก
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <label className="form-label">ประเภท</label>
              <select 
                className="form-select" 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">ทั้งหมด</option>
                <option value="robot">ควบคุมหุ่นยนต์</option>
                <option value="camera">กล้อง</option>
                <option value="booking">การจอง</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">วันที่</label>
              <input 
                type="date" 
                className="form-control" 
                value={filterDate} 
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">ค้นหา</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="ค้นหาจากชื่อกิจกรรมหรือผู้ใช้..."
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">&nbsp;</label>
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setFilterType('all');
                  setFilterDate('');
                  setSearchTerm('');
                }}
              >
                <FaFilter className="me-2" />ล้างตัวกรอง
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card stats-card">
            <div className="card-body text-center">
              <FaRobot className="text-warning mb-2" style={{ fontSize: '2rem' }} />
              <div className="stat-number text-warning">
                {historyData.filter(item => item.type === 'robot').length}
              </div>
              <div className="stat-label">การควบคุมหุ่นยนต์</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stats-card">
            <div className="card-body text-center">
              <FaVideo className="text-info mb-2" style={{ fontSize: '2rem' }} />
              <div className="stat-number text-info">
                {historyData.filter(item => item.type === 'camera').length}
              </div>
              <div className="stat-label">การใช้กล้อง</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stats-card">
            <div className="card-body text-center">
              <FaCalendarAlt className="text-success mb-2" style={{ fontSize: '2rem' }} />
              <div className="stat-number text-success">
                {historyData.filter(item => item.type === 'booking').length}
              </div>
              <div className="stat-label">การจอง</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stats-card">
            <div className="card-body text-center">
              <FaHistory className="text-secondary mb-2" style={{ fontSize: '2rem' }} />
              <div className="stat-number text-secondary">
                {historyData.length}
              </div>
              <div className="stat-label">ทั้งหมด</div>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">รายการประวัติ</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ประเภท</th>
                  <th>กิจกรรม</th>
                  <th>ผู้ใช้</th>
                  <th>วันที่</th>
                  <th>เวลา</th>
                  <th>ระยะเวลา</th>
                  <th>สถานะ</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {getTypeIcon(item.type)}
                        <span className="ms-2">{getTypeLabel(item.type)}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-bold">{item.title}</div>
                        <small className="text-muted">{item.description}</small>
                      </div>
                    </td>
                    <td>{item.user}</td>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td>{item.duration}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary" 
                          onClick={() => handleView(item)}
                          title="ดูรายละเอียด"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn btn-outline-danger" 
                          onClick={() => handleDelete(item)}
                          title="ลบ"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredData.length === 0 && (
            <div className="text-center py-4">
              <FaHistory className="text-muted mb-3" style={{ fontSize: '3rem' }} />
              <p className="text-muted">ไม่พบข้อมูลประวัติการใช้งาน</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default History;
