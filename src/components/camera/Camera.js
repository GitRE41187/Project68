import React, { useState, useEffect } from 'react';
import { FaVideo, FaPlay, FaGamepad, FaStop, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaRecordVinyl, FaStopCircle, FaCamera, FaCog, FaHistory } from 'react-icons/fa';
import './Camera.css';

const Camera = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraSettings, setCameraSettings] = useState({
    resolution: '1280x720',
    fps: '30',
    brightness: 50,
    contrast: 50,
    saturation: 50
  });
  const [recordingHistory] = useState([
    {
      id: 1,
      date: '2024-01-15',
      time: '14:30',
      type: 'วิดีโอ',
      duration: '5:30',
      fileSize: '15.2 MB'
    },
    {
      id: 2,
      date: '2024-01-15',
      time: '15:00',
      type: 'ภาพ',
      duration: '-',
      fileSize: '2.1 MB'
    }
  ]);

  const handleSettingChange = (setting, value) => {
    setCameraSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const startCamera = () => {
    setIsStreaming(true);
    // Simulate camera connection
    setTimeout(() => {
      showAlert('เริ่มการถ่ายทอดกล้อง', 'success');
    }, 2000);
  };

  const stopCamera = () => {
    setIsStreaming(false);
    showAlert('หยุดการถ่ายทอดกล้อง', 'info');
  };

  const startRecording = () => {
    if (!isStreaming) {
      showAlert('กรุณาเริ่มการถ่ายทอดก่อน', 'warning');
      return;
    }
    setIsRecording(true);
    showAlert('เริ่มบันทึกวิดีโอ', 'success');
  };

  const stopRecording = () => {
    setIsRecording(false);
    showAlert('หยุดบันทึกวิดีโอ', 'info');
  };

  const takeSnapshot = () => {
    if (!isStreaming) {
      showAlert('กรุณาเริ่มการถ่ายทอดก่อน', 'warning');
      return;
    }
    showAlert('ถ่ายภาพสำเร็จ', 'success');
  };

  const cameraControl = (direction) => {
    if (!isStreaming) {
      showAlert('กรุณาเริ่มการถ่ายทอดก่อน', 'warning');
      return;
    }
    
    const directions = {
      up: 'กล้องเลื่อนขึ้น',
      down: 'กล้องเลื่อนลง',
      left: 'กล้องเลื่อนซ้าย',
      right: 'กล้องเลื่อนขวา',
      stop: 'กล้องหยุด'
    };
    
    showAlert(directions[direction], 'info');
  };

  const showAlert = (message, type = 'info') => {
    // Create a temporary alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1055; min-width: 300px;';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 3000);
  };

  return (
    <main className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">กล้องถ่ายทอดสด</h1>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0"><FaVideo className="me-2" />กล้องถ่ายทอดสด</h5>
            </div>
            <div className="card-body p-0">
              <div className="camera-feed">
                {!isStreaming ? (
                  <div className="camera-placeholder">
                    <div className="text-center">
                      <FaVideo className="fa-3x mb-3" />
                      <p>กล้องถ่ายทอดสดจาก Raspberry Pi</p>
                      <button className="btn btn-primary" onClick={startCamera}>
                        <FaPlay className="me-2" />เริ่มการถ่ายทอด
                      </button>
                    </div>
                  </div>
                ) : (
                  <video 
                    style={{ width: '100%', height: '400px' }} 
                    autoPlay 
                    muted
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJhc3BiZXJyeSBQaSBDYW1lcmE8L3RleHQ+PC9zdmc+"
                  />
                )}
                
                <div className="camera-status">
                  {isStreaming ? 'เชื่อมต่อแล้ว' : 'ไม่เชื่อมต่อ'}
                </div>
                
                {isRecording && (
                  <div className="recording-indicator recording">
                    <FaRecordVinyl className="me-2" />กำลังบันทึก
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0"><FaGamepad className="me-2" />ควบคุมกล้อง</h5>
            </div>
            <div className="card-body">
              <div className="camera-controls">
                <button 
                  className="btn btn-outline-primary btn-up" 
                  onClick={() => cameraControl('up')}
                >
                  <FaArrowUp />
                </button>
                <button 
                  className="btn btn-outline-primary btn-left" 
                  onClick={() => cameraControl('left')}
                >
                  <FaArrowLeft />
                </button>
                <button 
                  className="btn btn-outline-danger btn-center" 
                  onClick={() => cameraControl('stop')}
                >
                  <FaStop />
                </button>
                <button 
                  className="btn btn-outline-primary btn-right" 
                  onClick={() => cameraControl('right')}
                >
                  <FaArrowRight />
                </button>
                <button 
                  className="btn btn-outline-primary btn-down" 
                  onClick={() => cameraControl('down')}
                >
                  <FaArrowDown />
                </button>
              </div>
              
              <hr />
              
              <div className="mb-3">
                <label htmlFor="resolution" className="form-label">ความละเอียด</label>
                <select 
                  className="form-select" 
                  id="resolution"
                  value={cameraSettings.resolution}
                  onChange={(e) => handleSettingChange('resolution', e.target.value)}
                >
                  <option value="640x480">640x480</option>
                  <option value="1280x720">1280x720</option>
                  <option value="1920x1080">1920x1080</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="fps" className="form-label">เฟรมต่อวินาที</label>
                <select 
                  className="form-select" 
                  id="fps"
                  value={cameraSettings.fps}
                  onChange={(e) => handleSettingChange('fps', e.target.value)}
                >
                  <option value="15">15 FPS</option>
                  <option value="30">30 FPS</option>
                  <option value="60">60 FPS</option>
                </select>
              </div>

              <div className="d-grid gap-2">
                <button 
                  className="btn btn-success" 
                  onClick={startRecording}
                  disabled={!isStreaming || isRecording}
                >
                  <FaRecordVinyl className="me-2" />เริ่มบันทึก
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={stopRecording}
                  disabled={!isRecording}
                >
                  <FaStopCircle className="me-2" />หยุดบันทึก
                </button>
                <button 
                  className="btn btn-info" 
                  onClick={takeSnapshot}
                  disabled={!isStreaming}
                >
                  <FaCamera className="me-2" />ถ่ายภาพ
                </button>
              </div>
            </div>
          </div>

          {/* Camera Settings */}
          <div className="card mt-3">
            <div className="card-header">
              <h5 className="mb-0"><FaCog className="me-2" />ตั้งค่ากล้อง</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="brightness" className="form-label">ความสว่าง</label>
                <input 
                  type="range" 
                  className="form-range" 
                  id="brightness" 
                  min="0" 
                  max="100" 
                  value={cameraSettings.brightness}
                  onChange={(e) => handleSettingChange('brightness', parseInt(e.target.value))}
                />
                <div className="d-flex justify-content-between">
                  <small>0</small>
                  <small>{cameraSettings.brightness}</small>
                  <small>100</small>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="contrast" className="form-label">คอนทราสต์</label>
                <input 
                  type="range" 
                  className="form-range" 
                  id="contrast" 
                  min="0" 
                  max="100" 
                  value={cameraSettings.contrast}
                  onChange={(e) => handleSettingChange('contrast', parseInt(e.target.value))}
                />
                <div className="d-flex justify-content-between">
                  <small>0</small>
                  <small>{cameraSettings.contrast}</small>
                  <small>100</small>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="saturation" className="form-label">ความอิ่มตัวของสี</label>
                <input 
                  type="range" 
                  className="form-range" 
                  id="saturation" 
                  min="0" 
                  max="100" 
                  value={cameraSettings.saturation}
                  onChange={(e) => handleSettingChange('saturation', parseInt(e.target.value))}
                />
                <div className="d-flex justify-content-between">
                  <small>0</small>
                  <small>{cameraSettings.saturation}</small>
                  <small>100</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recording History */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0"><FaHistory className="me-2" />ประวัติการบันทึก</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>วันที่</th>
                      <th>เวลา</th>
                      <th>ประเภท</th>
                      <th>ความยาว</th>
                      <th>ขนาดไฟล์</th>
                      <th>การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recordingHistory.map((record) => (
                      <tr key={record.id}>
                        <td>{record.date}</td>
                        <td>{record.time}</td>
                        <td>{record.type}</td>
                        <td>{record.duration}</td>
                        <td>{record.fileSize}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">ดาวน์โหลด</button>
                          <button className="btn btn-sm btn-outline-danger">ลบ</button>
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

export default Camera;
