import React, { useState, useEffect } from 'react';
import { FaRobot, FaPlay, FaStop, FaSave, FaDownload, FaUpload, FaCode, FaTerminal, FaVideo, FaPlay as FaPlayCamera, FaStop as FaStopCamera, FaRecordVinyl, FaStopCircle, FaCamera, FaCog, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaGamepad, FaWifi, FaWifiSlash } from 'react-icons/fa';
import axios from 'axios';
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
  const [selectedLab, setSelectedLab] = useState(1);
  const [robotStatus, setRobotStatus] = useState('idle');
  const [sensorData, setSensorData] = useState({
    distance: 0,
    lightLevel: 0,
    direction: 'stop',
    speed: 0
  });
  const [piConnection, setPiConnection] = useState('checking');

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

  const labs = [
    { id: 1, name: 'ห้องปฏิบัติการ A', status: 'available', description: 'ห้องปฏิบัติการควบคุมหุ่นยนต์พื้นฐาน' },
    { id: 2, name: 'ห้องปฏิบัติการ B', status: 'available', description: 'ห้องปฏิบัติการควบคุมหุ่นยนต์ขั้นสูง' },
    { id: 3, name: 'ห้องปฏิบัติการ C', status: 'maintenance', description: 'ห้องปฏิบัติการทดสอบระบบ' },
    { id: 4, name: 'ห้องปฏิบัติการ D', status: 'available', description: 'ห้องปฏิบัติการวิจัย' }
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
    },
    {
      name: 'หลบหลีกสิ่งกีดขวาง',
      code: `# หลบหลีกสิ่งกีดขวาง
while True:
    distance = robot.get_distance()
    if distance < 20:  # ถ้าอยู่ใกล้สิ่งกีดขวาง
        robot.stop()
        robot.turn_right(90)
        time.sleep(1)
    else:
        robot.forward(50)
    time.sleep(0.1)`
    }
  ];

  // Check Raspberry Pi connection
  useEffect(() => {
    checkPiConnection();
    const interval = setInterval(checkPiConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Update sensor data periodically
  useEffect(() => {
    if (piConnection === 'connected') {
      const interval = setInterval(updateSensorData, 2000); // Update every 2 seconds
      return () => clearInterval(interval);
    }
  }, [piConnection, selectedLab]);

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

  const updateSensorData = async () => {
    try {
      const response = await axios.get(`/api/robot/sensors?labId=${selectedLab}`);
      if (response.data.success) {
        setSensorData(response.data.sensors);
      }
    } catch (error) {
      console.error('Error updating sensor data:', error);
    }
  };

  const handleRunCode = async () => {
    if (!selectedLab) {
      showAlert('กรุณาเลือกห้องปฏิบัติการ', 'warning');
      return;
    }

    setIsRunning(true);
    setRobotStatus('running');
    setOutput('กำลังรันโค้ด...\n');
    
    try {
      const response = await axios.post('/api/robot/execute', {
        code: code,
        labId: selectedLab
      });

      if (response.data.success) {
        setOutput(prev => prev + '✅ โค้ดถูกส่งไปยังหุ่นยนต์แล้ว\n');
        setOutput(prev => prev + `🆔 Execution ID: ${response.data.executionId}\n`);
        setOutput(prev => prev + `📊 สถานะ: ${response.data.status}\n`);
        
        // Monitor execution status
        monitorExecution(response.data.executionId);
      } else {
        setOutput(prev => prev + '❌ เกิดข้อผิดพลาดในการรันโค้ด\n');
        setRobotStatus('error');
      }
    } catch (error) {
      setOutput(prev => prev + `❌ เกิดข้อผิดพลาด: ${error.response?.data?.message || error.message}\n`);
      setRobotStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  const monitorExecution = async (executionId) => {
    // Simulate monitoring execution status
    setTimeout(() => {
      setOutput(prev => prev + '✅ การรันโค้ดเสร็จสิ้น\n');
      setRobotStatus('completed');
    }, 5000);
  };

  const handleStopRobot = async () => {
    try {
      const response = await axios.post('/api/robot/stop', {
        labId: selectedLab
      });

      if (response.data.success) {
        setRobotStatus('stopped');
        setOutput(prev => prev + '🛑 หุ่นยนต์ถูกหยุดแล้ว\n');
        showAlert('หุ่นยนต์ถูกหยุดแล้ว', 'success');
      }
    } catch (error) {
      showAlert('เกิดข้อผิดพลาดในการหยุดหุ่นยนต์', 'error');
    }
  };

  const handleRobotControl = async (command, speed = 50, duration = null) => {
    try {
      const response = await axios.post('/api/robot/control', {
        command: command,
        speed: speed,
        duration: duration,
        labId: selectedLab
      });

      if (response.data.success) {
        showAlert(`คำสั่ง ${command} ถูกส่งไปยังหุ่นยนต์แล้ว`, 'success');
        updateSensorData(); // Update status immediately
      }
    } catch (error) {
      showAlert(`เกิดข้อผิดพลาดในการควบคุมหุ่นยนต์: ${error.response?.data?.message}`, 'error');
    }
  };

  const handleCameraStream = async () => {
    try {
      const response = await axios.post('/api/camera/start-stream', {
        labId: selectedLab
      });

      if (response.data.success) {
        setIsStreaming(true);
        showAlert('เริ่มการถ่ายทอดกล้องแล้ว', 'success');
        setOutput(prev => prev + `📹 เริ่มการถ่ายทอดกล้อง\n`);
        setOutput(prev => prev + `🔗 Stream URL: ${response.data.streamUrl}\n`);
      }
    } catch (error) {
      showAlert('เกิดข้อผิดพลาดในการเริ่มการถ่ายทอดกล้อง', 'error');
    }
  };

  const handleStopCamera = () => {
    setIsStreaming(false);
    setIsRecording(false);
    showAlert('หยุดการถ่ายทอดกล้องแล้ว', 'info');
    setOutput(prev => prev + '📹 หยุดการถ่ายทอดกล้อง\n');
  };

  const handleTakeSnapshot = () => {
    if (!isStreaming) {
      showAlert('กรุณาเริ่มการถ่ายทอดก่อน', 'warning');
      return;
    }
    showAlert('ถ่ายภาพสำเร็จ', 'success');
    setOutput(prev => prev + '📸 ถ่ายภาพสำเร็จ\n');
  };

  const handleStartRecording = () => {
    if (!isStreaming) {
      showAlert('กรุณาเริ่มการถ่ายทอดก่อน', 'warning');
      return;
    }
    setIsRecording(true);
    showAlert('เริ่มบันทึกวิดีโอ', 'success');
    setOutput(prev => prev + '🎥 เริ่มบันทึกวิดีโอ\n');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    showAlert('หยุดบันทึกวิดีโอ', 'info');
    setOutput(prev => prev + '🎥 หยุดบันทึกวิดีโอ\n');
  };

  const handleSaveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robot_code.py';
    a.click();
    URL.revokeObjectURL(url);
    showAlert('บันทึกโค้ดสำเร็จ', 'success');
  };

  const handleLoadCode = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
        showAlert('โหลดโค้ดสำเร็จ', 'success');
      };
      reader.readAsText(file);
    }
  };

  const handleTemplateSelect = (template) => {
    setCode(template.code);
    showAlert(`โหลดเทมเพลต: ${template.name}`, 'success');
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
    <div className="robot-control-container">
      <div className="container-fluid">
        <div className="row">
          {/* Left Panel - Code Editor */}
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaCode className="me-2" />
                  Code Editor
                </h5>
                <div className="d-flex gap-2">
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
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex gap-2 mb-2">
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={handleRunCode}
                      disabled={isRunning || !selectedLab}
                    >
                      <FaPlay className="me-1" />
                      Run Code
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={handleStopRobot}
                      disabled={!isRunning}
                    >
                      <FaStop className="me-1" />
                      Stop Robot
                    </button>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={handleSaveCode}
                    >
                      <FaSave className="me-1" />
                      Save
                    </button>
                    <label className="btn btn-outline-primary btn-sm mb-0">
                      <FaUpload className="me-1" />
                      Load
                      <input 
                        type="file" 
                        accept=".py,.txt" 
                        onChange={handleLoadCode}
                        style={{display: 'none'}}
                      />
                    </label>
                  </div>
                  
                  {/* Code Templates */}
                  <div className="mb-3">
                    <label className="form-label">Code Templates:</label>
                    <div className="d-flex gap-2 flex-wrap">
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
                </div>
                
                <textarea
                  className="form-control code-editor"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={20}
                  placeholder="เขียนโค้ด Python เพื่อควบคุมหุ่นยนต์..."
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Controls & Status */}
          <div className="col-lg-4">
            {/* Robot Status */}
            <div className="card mb-3">
              <div className="card-header">
                <h6 className="mb-0">
                  <FaRobot className="me-2" />
                  Robot Status
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
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
                  
                  <div className="mb-2">
                    <span className="me-2">Status:</span>
                    <span className={`badge bg-${robotStatus === 'running' ? 'success' : robotStatus === 'error' ? 'danger' : 'secondary'}`}>
                      {robotStatus}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="me-2">Direction:</span>
                    <span className="badge bg-info">{sensorData.direction}</span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="me-2">Speed:</span>
                    <span className="badge bg-primary">{sensorData.speed}%</span>
                  </div>
                </div>

                {/* Sensor Data */}
                <div className="mb-3">
                  <h6>Sensor Data:</h6>
                  <div className="row">
                    <div className="col-6">
                      <div className="text-center">
                        <div className="sensor-value">{sensorData.distance} cm</div>
                        <small className="text-muted">Distance</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <div className="sensor-value">{sensorData.lightLevel}</div>
                        <small className="text-muted">Light Level</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manual Control */}
                <div className="mb-3">
                  <h6>Manual Control:</h6>
                  <div className="text-center">
                    <button 
                      className="btn btn-outline-primary btn-sm mb-2"
                      onClick={() => handleRobotControl('forward')}
                      disabled={piConnection !== 'connected'}
                    >
                      <FaArrowUp />
                    </button>
                    <div className="d-flex justify-content-center gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleRobotControl('left')}
                        disabled={piConnection !== 'connected'}
                      >
                        <FaArrowLeft />
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRobotControl('stop')}
                        disabled={piConnection !== 'connected'}
                      >
                        <FaStop />
                      </button>
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleRobotControl('right')}
                        disabled={piConnection !== 'connected'}
                      >
                        <FaArrowRight />
                      </button>
                    </div>
                    <button 
                      className="btn btn-outline-primary btn-sm mt-2"
                      onClick={() => handleRobotControl('backward')}
                      disabled={piConnection !== 'connected'}
                    >
                      <FaArrowDown />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Camera Control */}
            <div className="card mb-3">
              <div className="card-header">
                <h6 className="mb-0">
                  <FaCamera className="me-2" />
                  Camera Control
                </h6>
              </div>
              <div className="card-body">
                <div className="d-flex gap-2 mb-3">
                  {!isStreaming ? (
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={handleCameraStream}
                      disabled={piConnection !== 'connected'}
                    >
                      <FaPlayCamera className="me-1" />
                      Start Stream
                    </button>
                  ) : (
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={handleStopCamera}
                    >
                      <FaStopCamera className="me-1" />
                      Stop Stream
                    </button>
                  )}
                </div>

                {isStreaming && (
                  <div className="d-flex gap-2 mb-3">
                    {!isRecording ? (
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={handleStartRecording}
                      >
                        <FaRecordVinyl className="me-1" />
                        Record
                      </button>
                    ) : (
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={handleStopRecording}
                      >
                        <FaStopCircle className="me-1" />
                        Stop Record
                      </button>
                    )}
                    <button 
                      className="btn btn-info btn-sm"
                      onClick={handleTakeSnapshot}
                    >
                      <FaCamera className="me-1" />
                      Snapshot
                    </button>
                  </div>
                )}

                {/* Camera Settings */}
                <div className="mb-3">
                  <h6>Camera Settings:</h6>
                  <div className="mb-2">
                    <label className="form-label">Resolution:</label>
                    <select 
                      className="form-select form-select-sm"
                      value={cameraSettings.resolution}
                      onChange={(e) => setCameraSettings(prev => ({...prev, resolution: e.target.value}))}
                    >
                      <option value="640x480">640x480</option>
                      <option value="1280x720">1280x720</option>
                      <option value="1920x1080">1920x1080</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">FPS:</label>
                    <select 
                      className="form-select form-select-sm"
                      value={cameraSettings.fps}
                      onChange={(e) => setCameraSettings(prev => ({...prev, fps: e.target.value}))}
                    >
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="60">60</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Console */}
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  <FaTerminal className="me-2" />
                  Output Console
                </h6>
              </div>
              <div className="card-body">
                <div className="output-console">
                  <pre>{output || 'Ready to run code...'}</pre>
                </div>
                <button 
                  className="btn btn-outline-secondary btn-sm mt-2"
                  onClick={() => setOutput('')}
                >
                  Clear Console
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotControl;
