import React, { useState, useEffect } from 'react';
import { FaRobot, FaPlay, FaStop, FaSave, FaDownload, FaUpload, FaCode, FaTerminal, FaVideo, FaPlay as FaPlayCamera, FaStop as FaStopCamera, FaRecordVinyl, FaStopCircle, FaCamera, FaCog, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaGamepad } from 'react-icons/fa';
import './RobotControl.css';

const RobotControl = () => {
  const [code, setCode] = useState(`# Robot Control Code
# เขียนโค้ด Python เพื่อควบคุมหุ่นยนต์

import time
import robot

# ตัวอย่างโค้ดควบคุมหุ่นยนต์
def main():
    print("เริ่มต้นการควบคุมหุ่นยนต์...")
    
    # เคลื่อนที่ไปข้างหน้า
    robot.forward(100)
    time.sleep(2)
    
    # หยุด
    robot.stop()
    time.sleep(1)
    
    # เลี้ยวขวา
    robot.turn_right(90)
    time.sleep(1)
    
    # เคลื่อนที่ไปข้างหน้า
    robot.forward(50)
    time.sleep(1)
    
    # หยุด
    robot.stop()
    print("เสร็จสิ้นการควบคุมหุ่นยนต์")

if __name__ == "__main__":
    main()`);
  
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [selectedRobot, setSelectedRobot] = useState('A');
  const [robotStatus, setRobotStatus] = useState('idle');

  // Camera states
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraSettings, setCameraSettings] = useState({
    resolution: '1280x720',
    fps: '30',
    brightness: 50,
    contrast: 50,
    saturation: 50
  });

  const robots = [
    { id: 'A', name: 'หุ่นยนต์ A', status: 'available', battery: 85 },
    { id: 'B', name: 'หุ่นยนต์ B', status: 'available', battery: 92 },
    { id: 'C', name: 'หุ่นยนต์ C', status: 'maintenance', battery: 0 },
    { id: 'D', name: 'หุ่นยนต์ D', status: 'available', battery: 78 }
  ];

  const codeTemplates = [
    {
      name: 'เคลื่อนที่พื้นฐาน',
      code: `# เคลื่อนที่พื้นฐาน
robot.forward(100)  # เดินหน้า 100 หน่วย
time.sleep(2)
robot.stop()
robot.backward(100)  # ถอยหลัง 100 หน่วย
time.sleep(2)
robot.stop()`
    },
    {
      name: 'เลี้ยว',
      code: `# เลี้ยว
robot.turn_left(90)   # เลี้ยวซ้าย 90 องศา
time.sleep(1)
robot.turn_right(90)  # เลี้ยวขวา 90 องศา
time.sleep(1)`
    },
    {
      name: 'สี่เหลี่ยม',
      code: `# วาดสี่เหลี่ยม
for i in range(4):
    robot.forward(100)
    time.sleep(2)
    robot.turn_right(90)
    time.sleep(1)`
    }
  ];

  const handleRunCode = () => {
    setIsRunning(true);
    setRobotStatus('running');
    setOutput('กำลังรันโค้ด...\n');
    
    // Simulate code execution
    setTimeout(() => {
      setOutput(prev => prev + 'เริ่มต้นการควบคุมหุ่นยนต์...\n');
      setTimeout(() => {
        setOutput(prev => prev + 'หุ่นยนต์เคลื่อนที่ไปข้างหน้า\n');
        setTimeout(() => {
          setOutput(prev => prev + 'หุ่นยนต์หยุด\n');
          setTimeout(() => {
            setOutput(prev => prev + 'หุ่นยนต์เลี้ยวขวา\n');
            setTimeout(() => {
              setOutput(prev => prev + 'เสร็จสิ้นการควบคุมหุ่นยนต์\n');
              setIsRunning(false);
              setRobotStatus('idle');
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleStopCode = () => {
    setIsRunning(false);
    setRobotStatus('idle');
    setOutput(prev => prev + 'หยุดการทำงาน\n');
  };

  const handleSaveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robot_control.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadCode = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCode(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleTemplateSelect = (template) => {
    setCode(template.code);
  };

  // Camera functions
  const handleSettingChange = (setting, value) => {
    setCameraSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const startCamera = () => {
    setIsStreaming(true);
    showAlert('เริ่มการถ่ายทอดกล้อง', 'success');
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
        alertDiv.parentNode.removeChild(alertDiv);
      }
    }, 3000);
  };

  return (
    <main className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">ควบคุมหุ่นยนต์และกล้อง</h1>
      </div>

      <div className="row">
        {/* Robot Control Section */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaRobot className="me-2" />
                ควบคุมหุ่นยนต์
              </h5>
              <div className="d-flex gap-2">
                <select 
                  className="form-select form-select-sm" 
                  style={{width: 'auto'}}
                  value={selectedRobot} 
                  onChange={(e) => setSelectedRobot(e.target.value)}
                >
                  {robots.map(robot => (
                    <option key={robot.id} value={robot.id} disabled={robot.status === 'maintenance'}>
                      {robot.name} {robot.status === 'maintenance' ? '(บำรุงรักษา)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <label className="form-label">โค้ด Python</label>
                    <textarea
                      className="form-control"
                      rows="15"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="เขียนโค้ด Python เพื่อควบคุมหุ่นยนต์..."
                      style={{ fontFamily: 'monospace' }}
                    />
                  </div>
                  
                  <div className="d-flex gap-2 mb-3">
                    <button 
                      className="btn btn-success"
                      onClick={handleRunCode}
                      disabled={isRunning || robots.find(r => r.id === selectedRobot)?.status === 'maintenance'}
                    >
                      <FaPlay className="me-2" />
                      รันโค้ด
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={handleStopCode}
                      disabled={!isRunning}
                    >
                      <FaStop className="me-2" />
                      หยุด
                    </button>
                    <button className="btn btn-primary" onClick={handleSaveCode}>
                      <FaSave className="me-2" />
                      บันทึก
                    </button>
                    <label className="btn btn-outline-primary mb-0">
                      <FaUpload className="me-2" />
                      โหลดไฟล์
                      <input
                        type="file"
                        accept=".py,.txt"
                        onChange={handleLoadCode}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label">โค้ดสำเร็จรูป</label>
                    <div className="d-grid gap-2">
                      {codeTemplates.map((template, index) => (
                        <button
                          key={index}
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleTemplateSelect(template)}
                        >
                          {template.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">สถานะหุ่นยนต์</label>
                    <div className="d-flex align-items-center mb-2">
                      <div className={`status-indicator ${robotStatus}`}></div>
                      <span className="ms-2">
                        {robotStatus === 'idle' ? 'พร้อมใช้งาน' : 
                         robotStatus === 'running' ? 'กำลังทำงาน' : 'บำรุงรักษา'}
                      </span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="battery-indicator">
                        <div 
                          className="battery-level" 
                          style={{width: `${robots.find(r => r.id === selectedRobot)?.battery || 0}%`}}
                        ></div>
                      </div>
                      <span className="ms-2">
                        {robots.find(r => r.id === selectedRobot)?.battery || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <label className="form-label">ผลลัพธ์</label>
                <div className="output-terminal">
                  <pre className="mb-0">{output || 'รอการรันโค้ด...'}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Section */}
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <FaVideo className="me-2" />
                กล้องถ่ายทอดสด
              </h5>
            </div>
            <div className="card-body">
              {/* Camera View */}
              <div className="camera-view mb-3">
                <div className="camera-placeholder">
                  {isStreaming ? (
                    <div className="streaming-indicator">
                      <FaVideo className="streaming-icon" />
                      <span>กำลังถ่ายทอดสด</span>
                    </div>
                  ) : (
                    <div className="camera-off">
                      <FaVideo className="camera-off-icon" />
                      <span>กล้องปิด</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Camera Controls */}
              <div className="camera-controls mb-3">
                <div className="d-grid gap-2">
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-success flex-fill"
                      onClick={startCamera}
                      disabled={isStreaming}
                    >
                      <FaPlayCamera className="me-2" />
                      เริ่มกล้อง
                    </button>
                    <button 
                      className="btn btn-danger flex-fill"
                      onClick={stopCamera}
                      disabled={!isStreaming}
                    >
                      <FaStopCamera className="me-2" />
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

              {/* Camera Settings */}
              <div className="camera-settings">
                <label className="form-label">ตั้งค่ากล้อง</label>
                <div className="mb-2">
                  <label className="form-label small">ความละเอียด</label>
                  <select 
                    className="form-select form-select-sm"
                    value={cameraSettings.resolution}
                    onChange={(e) => handleSettingChange('resolution', e.target.value)}
                  >
                    <option value="640x480">640x480</option>
                    <option value="1280x720">1280x720</option>
                    <option value="1920x1080">1920x1080</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label small">FPS</label>
                  <select 
                    className="form-select form-select-sm"
                    value={cameraSettings.fps}
                    onChange={(e) => handleSettingChange('fps', e.target.value)}
                  >
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label small">ความสว่าง: {cameraSettings.brightness}%</label>
                  <input 
                    type="range" 
                    className="form-range"
                    min="0" 
                    max="100" 
                    value={cameraSettings.brightness}
                    onChange={(e) => handleSettingChange('brightness', parseInt(e.target.value))}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small">ความคมชัด: {cameraSettings.contrast}%</label>
                  <input 
                    type="range" 
                    className="form-range"
                    min="0" 
                    max="100" 
                    value={cameraSettings.contrast}
                    onChange={(e) => handleSettingChange('contrast', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RobotControl;
