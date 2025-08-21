import React, { useState, useEffect } from 'react';
import { FaRobot, FaPlay, FaStop, FaSave, FaDownload, FaUpload, FaCode, FaTerminal } from 'react-icons/fa';

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
    // Save code to localStorage
    localStorage.setItem('robotCode', code);
    setOutput(prev => prev + 'บันทึกโค้ดสำเร็จ\n');
  };

  const handleLoadCode = () => {
    // Load code from localStorage
    const savedCode = localStorage.getItem('robotCode');
    if (savedCode) {
      setCode(savedCode);
      setOutput(prev => prev + 'โหลดโค้ดสำเร็จ\n');
    } else {
      setOutput(prev => prev + 'ไม่พบโค้ดที่บันทึกไว้\n');
    }
  };

  const handleTemplateSelect = (template) => {
    setCode(template.code);
    setOutput(prev => prev + `โหลดเทมเพลต: ${template.name}\n`);
  };

  return (
    <main className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">ควบคุมหุ่นยนต์</h1>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-success" 
            onClick={handleRunCode}
            disabled={isRunning || robotStatus === 'maintenance'}
          >
            <FaPlay className="me-2" />รันโค้ด
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleStopCode}
            disabled={!isRunning}
          >
            <FaStop className="me-2" />หยุด
          </button>
        </div>
      </div>

      <div className="row">
        {/* Code Editor */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0"><FaCode className="me-2" />Code Editor</h5>
            </div>
            <div className="card-body p-0">
              <div className="code-editor">
                <textarea
                  className="form-control border-0"
                  rows="20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="เขียนโค้ด Python เพื่อควบคุมหุ่นยนต์..."
                  style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '14px',
                    resize: 'none'
                  }}
                />
              </div>
            </div>
            <div className="card-footer">
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary btn-sm" onClick={handleSaveCode}>
                  <FaSave className="me-2" />บันทึก
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={handleLoadCode}>
                  <FaDownload className="me-2" />โหลด
                </button>
                <button className="btn btn-outline-info btn-sm">
                  <FaUpload className="me-2" />อัปโหลด
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="col-md-4">
          {/* Robot Selection */}
          <div className="card mb-3">
            <div className="card-header">
              <h6 className="mb-0"><FaRobot className="me-2" />เลือกหุ่นยนต์</h6>
            </div>
            <div className="card-body">
              <select 
                className="form-select" 
                value={selectedRobot} 
                onChange={(e) => setSelectedRobot(e.target.value)}
              >
                {robots.map(robot => (
                  <option key={robot.id} value={robot.id} disabled={robot.status === 'maintenance'}>
                    {robot.name} - {robot.status === 'available' ? 'พร้อมใช้งาน' : 'บำรุงรักษา'}
                  </option>
                ))}
              </select>
              
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>แบตเตอรี่:</span>
                  <span>{robots.find(r => r.id === selectedRobot)?.battery}%</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${robots.find(r => r.id === selectedRobot)?.battery}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Templates */}
          <div className="card mb-3">
            <div className="card-header">
              <h6 className="mb-0">เทมเพลตโค้ด</h6>
            </div>
            <div className="card-body">
              {codeTemplates.map((template, index) => (
                <button
                  key={index}
                  className="btn btn-outline-secondary btn-sm w-100 mb-2"
                  onClick={() => handleTemplateSelect(template)}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Output Log */}
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0"><FaTerminal className="me-2" />Output Log</h6>
            </div>
            <div className="card-body">
              <div className="log-output">
                <pre className="mb-0" style={{ fontSize: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                  {output || 'รอการรันโค้ด...'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RobotControl;
