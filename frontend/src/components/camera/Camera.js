import React, { useState, useEffect } from 'react';
import { FaVideo, FaPlay, FaGamepad, FaStop, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaRecordVinyl, FaStopCircle, FaCamera, FaCog, FaHistory, FaWifi, FaWifiSlash, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import './Camera.css';

const Camera = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedLab, setSelectedLab] = useState(1);
  const [piConnection, setPiConnection] = useState('checking');
  const [streamUrl, setStreamUrl] = useState('');
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

  const labs = [
    { id: 1, name: 'ห้องปฏิบัติการ A', status: 'available', description: 'ห้องปฏิบัติการควบคุมหุ่นยนต์พื้นฐาน' },
    { id: 2, name: 'ห้องปฏิบัติการ B', status: 'available', description: 'ห้องปฏิบัติการควบคุมหุ่นยนต์ขั้นสูง' },
    { id: 3, name: 'ห้องปฏิบัติการ C', status: 'maintenance', description: 'ห้องปฏิบัติการทดสอบระบบ' },
    { id: 4, name: 'ห้องปฏิบัติการ D', status: 'available', description: 'ห้องปฏิบัติการวิจัย' }
  ];

  // Check Raspberry Pi connection
  useEffect(() => {
    checkPiConnection();
    const interval = setInterval(checkPiConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkPiConnection = async () => {
    try {
      const response = await axios.get('/api/health');
      if (response.data.services?.raspberryPi === 'online') {
        setPiConnection('connected');
      } else {
        setPiConnection('disconnected');
      }
    } catch (error) {
      setPiConnection('disconnected');
    }
  };

  const handleSettingChange = (setting, value) => {
    setCameraSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const startCamera = async () => {
    if (!selectedLab) {
      showAlert('กรุณาเลือกห้องปฏิบัติการ', 'warning');
      return;
    }

    try {
      const response = await axios.post('/api/camera/start-stream', {
        labId: selectedLab
      });

      if (response.data.success) {
        setIsStreaming(true);
        setStreamUrl(response.data.streamUrl);
        showAlert('เริ่มการถ่ายทอดกล้อง', 'success');
      }
    } catch (error) {
      showAlert('เกิดข้อผิดพลาดในการเริ่มการถ่ายทอดกล้อง', 'error');
    }
  };

  const stopCamera = () => {
    setIsStreaming(false);
    setIsRecording(false);
    setStreamUrl('');
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
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1055; min-width: 300px;';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.parentNode.removeChild(alertDiv);
      }
    }, 5000);
  };

  return (
    <main className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">กล้องถ่ายทอดสด</h1>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center">
            <span className="me-2">Connection:</span>
            {piConnection === 'connected' ? (
              <span className="badge bg-success">
                <FaWifi className="me-1" />
                Connected
              </span>
            ) : piConnection === 'checking' ? (
              <span className="badge bg-warning">
                Checking...
              </span>
            ) : (
              <span className="badge bg-danger">
                <FaWifiSlash className="me-1" />
                Disconnected
              </span>
            )}
          </div>
          
          <select 
            className="form-select form-select-sm" 
            style={{width: 'auto'}}
            value={selectedLab}
            onChange={(e) => setSelectedLab(parseInt(e.target.value))}
          >
            {labs.map(lab => (
              <option key={lab.id} value={lab.id}>
                {lab.name} - {lab.status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        {/* Camera View */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <FaVideo className="me-2" />
                Camera View
              </h5>
            </div>
            <div className="card-body">
              <div className="camera-view mb-3">
                {isStreaming && streamUrl ? (
                  <div className="streaming-container">
                    <div className="streaming-indicator">
                      <FaVideo className="streaming-icon" />
                      <span>กำลังถ่ายทอดสด</span>
                    </div>
                    <div className="stream-url-info">
                      <small className="text-muted">
                        Stream URL: {streamUrl}
                      </small>
                    </div>
                    {/* In a real implementation, you would embed the video stream here */}
                    <div className="video-placeholder">
                      <div className="video-placeholder-content">
                        <FaVideo className="video-icon" />
                        <p>Camera Stream Active</p>
                        <small>Stream URL: {streamUrl}</small>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="camera-placeholder">
                    <div className="camera-off">
                      <FaVideo className="camera-off-icon" />
                      <span>กล้องปิด</span>
                      <small className="text-muted">เลือกห้องปฏิบัติการและเริ่มการถ่ายทอด</small>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="camera-controls mb-3">
                <div className="d-grid gap-2">
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-success flex-fill"
                      onClick={startCamera}
                      disabled={isStreaming || piConnection !== 'connected'}
                    >
                      <FaPlay className="me-2" />
                      เริ่มกล้อง
                    </button>
                    <button 
                      className="btn btn-danger flex-fill"
                      onClick={stopCamera}
                      disabled={!isStreaming}
                    >
                      <FaStop className="me-2" />
                      หยุดกล้อง
                    </button>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-warning flex-fill"
                      onClick={startRecording}
                      disabled={!isStreaming || isRecording}
                    >
                      <FaRecordVinyl className="me-2" />
                      บันทึก
                    </button>
                    <button 
                      className="btn btn-secondary flex-fill"
                      onClick={stopRecording}
                      disabled={!isRecording}
                    >
                      <FaStopCircle className="me-2" />
                      หยุดบันทึก
                    </button>
                  </div>
                  
                  <button 
                    className="btn btn-info"
                    onClick={takeSnapshot}
                    disabled={!isStreaming}
                  >
                    <FaCamera className="me-2" />
                    ถ่ายภาพ
                  </button>
                </div>
              </div>

              {/* Camera Movement Controls */}
              <div className="camera-movement mb-3">
                <label className="form-label">ควบคุมกล้อง</label>
                <div className="movement-grid">
                  <div className="movement-row">
                    <button 
                      className="movement-btn up"
                      onClick={() => cameraControl('up')}
                      disabled={!isStreaming}
                    >
                      <FaArrowUp />
                    </button>
                  </div>
                  <div className="movement-row">
                    <button 
                      className="movement-btn left"
                      onClick={() => cameraControl('left')}
                      disabled={!isStreaming}
                    >
                      <FaArrowLeft />
                    </button>
                    <button 
                      className="movement-btn center"
                      onClick={() => cameraControl('stop')}
                      disabled={!isStreaming}
                    >
                      <FaGamepad />
                    </button>
                    <button 
                      className="movement-btn right"
                      onClick={() => cameraControl('right')}
                      disabled={!isStreaming}
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                  <div className="movement-row">
                    <button 
                      className="movement-btn down"
                      onClick={() => cameraControl('down')}
                      disabled={!isStreaming}
                    >
                      <FaArrowDown />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Settings & History */}
        <div className="col-lg-4">
          {/* Camera Settings */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">
                <FaCog className="me-2" />
                ตั้งค่ากล้อง
              </h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">ความละเอียด</label>
                <select 
                  className="form-select"
                  value={cameraSettings.resolution}
                  onChange={(e) => handleSettingChange('resolution', e.target.value)}
                >
                  <option value="640x480">640x480</option>
                  <option value="1280x720">1280x720</option>
                  <option value="1920x1080">1920x1080</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label">FPS</label>
                <select 
                  className="form-select"
                  value={cameraSettings.fps}
                  onChange={(e) => handleSettingChange('fps', e.target.value)}
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label">ความสว่าง: {cameraSettings.brightness}%</label>
                <input 
                  type="range" 
                  className="form-range"
                  min="0" 
                  max="100" 
                  value={cameraSettings.brightness}
                  onChange={(e) => handleSettingChange('brightness', parseInt(e.target.value))}
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">ความคมชัด: {cameraSettings.contrast}%</label>
                <input 
                  type="range" 
                  className="form-range"
                  min="0" 
                  max="100" 
                  value={cameraSettings.contrast}
                  onChange={(e) => handleSettingChange('contrast', parseInt(e.target.value))}
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">ความอิ่มตัว: {cameraSettings.saturation}%</label>
                <input 
                  type="range" 
                  className="form-range"
                  min="0" 
                  max="100" 
                  value={cameraSettings.saturation}
                  onChange={(e) => handleSettingChange('saturation', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Recording History */}
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">
                <FaHistory className="me-2" />
                ประวัติการบันทึก
              </h6>
            </div>
            <div className="card-body">
              <div className="recording-history">
                {recordingHistory.map(record => (
                  <div key={record.id} className="recording-item">
                    <div className="recording-info">
                      <div className="recording-type">
                        <FaVideo className="me-1" />
                        {record.type}
                      </div>
                      <div className="recording-date">
                        {record.date} {record.time}
                      </div>
                      <div className="recording-details">
                        <span className="me-3">Duration: {record.duration}</span>
                        <span>Size: {record.fileSize}</span>
                      </div>
                    </div>
                    <div className="recording-actions">
                      <button className="btn btn-sm btn-outline-primary">
                        <FaDownload className="me-1" />
                        Download
                      </button>
                    </div>
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

export default Camera;
