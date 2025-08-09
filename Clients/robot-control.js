// Robot Control Module
class RobotController {
    constructor() {
        this.codeEditor = null;
        this.initializeCodeEditor();
    }

    initializeCodeEditor() {
        // Initialize CodeMirror when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            const pythonCode = document.getElementById('pythonCode');
            if (pythonCode && typeof CodeMirror !== 'undefined') {
                this.codeEditor = CodeMirror.fromTextArea(pythonCode, {
                    mode: 'python',
                    theme: 'monokai',
                    lineNumbers: true,
                    autoCloseBrackets: true,
                    matchBrackets: true,
                    indentUnit: 4,
                    tabSize: 4,
                    lineWrapping: true,
                    extraKeys: {
                        "Tab": (cm) => {
                            cm.replaceSelection("    ", "end");
                        }
                    }
                });
                
                // Set initial content
                const initialCode = `# Robot Control Code
# ตัวอย่างโค้ดพื้นฐาน

import time
from robot import Robot

# สร้างออบเจ็กต์หุ่นยนต์
robot = Robot()

# ตัวอย่างการควบคุม
def main():
    print("เริ่มการควบคุมหุ่นยนต์...")
    
    # เดินหน้า 2 วินาที
    robot.forward(2)
    
    # หยุด
    robot.stop()
    
    # เลี้ยวขวา 1 วินาที
    robot.turn_right(1)
    
    # เดินหน้า 1 วินาที
    robot.forward(1)
    
    print("เสร็จสิ้นการควบคุม")

if __name__ == "__main__":
    main()`;
                
                this.codeEditor.setValue(initialCode);
            }
        });
    }

    loadTemplate(type) {
        let template = '';
        
        switch(type) {
            case 'basic':
                template = `# โค้ดพื้นฐาน
import time
from robot import Robot

robot = Robot()

def main():
    print("เริ่มการควบคุม...")
    robot.forward(2)
    robot.stop()
    print("เสร็จสิ้น")

if __name__ == "__main__":
    main()`;
                break;
                
            case 'movement':
                template = `# การควบคุมการเคลื่อนที่
import time
from robot import Robot

robot = Robot()

def main():
    print("ทดสอบการเคลื่อนที่...")
    
    # เดินหน้า
    robot.forward(3)
    robot.stop()
    
    # เลี้ยวซ้าย
    robot.turn_left(1)
    
    # เดินหน้า
    robot.forward(2)
    
    # เลี้ยวขวา
    robot.turn_right(1)
    
    # ถอยหลัง
    robot.backward(1)
    
    robot.stop()
    print("เสร็จสิ้น")

if __name__ == "__main__":
    main()`;
                break;
                
            case 'sensor':
                template = `# การใช้เซนเซอร์
import time
from robot import Robot

robot = Robot()

def main():
    print("ทดสอบเซนเซอร์...")
    
    while True:
        # อ่านค่าเซนเซอร์ระยะทาง
        distance = robot.distance_sensor()
        print(f"ระยะทาง: {distance} cm")
        
        # อ่านค่าเซนเซอร์แสง
        light = robot.light_sensor()
        print(f"แสง: {light}")
        
        # ถ้ามีสิ่งกีดขวาง ให้หยุด
        if distance < 10:
            robot.stop()
            print("พบสิ่งกีดขวาง!")
            break
        
        # เดินหน้า
        robot.forward(0.5)
        
        time.sleep(0.5)
    
    print("เสร็จสิ้น")

if __name__ == "__main__":
    main()`;
                break;
        }
        
        if (this.codeEditor) {
            this.codeEditor.setValue(template);
        }
        
        this.addLogMessage(`โหลดเทมเพลต ${type} สำเร็จ`, 'success');
    }

    clearCode() {
        if (this.codeEditor) {
            this.codeEditor.setValue('');
        }
        this.addLogMessage('ล้างโค้ดแล้ว', 'info');
    }

    async uploadAndRun() {
        const code = this.codeEditor ? this.codeEditor.getValue() : document.getElementById('pythonCode').value;
        
        if (!code.trim()) {
            this.addLogMessage('กรุณาเขียนโค้ดก่อน', 'warning');
            return;
        }

        this.addLogMessage('กำลังตรวจสอบสิทธิ์การใช้งาน...', 'info');
        
        try {
            const response = await auth.apiRequest('/robot/upload', {
                method: 'POST',
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (response.ok) {
                this.addLogMessage('อัปโหลดโค้ดสำเร็จและเริ่มรันบนหุ่นยนต์', 'success');
                this.addLogMessage('กำลังรันโค้ดบน Raspberry Pi...', 'info');
                this.startRealTimeMonitoring();
            } else {
                if (response.status === 403) {
                    this.addLogMessage('คุณไม่มีสิทธิ์ใช้งานหุ่นยนต์ในเวลานี้ กรุณาจองเวลาก่อน', 'error');
                    this.showBookingReminder();
                } else {
                    this.addLogMessage(data.message || 'เกิดข้อผิดพลาดในการอัปโหลด', 'error');
                }
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.addLogMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
        }
    }

    simulateRobotExecution(code) {
        const commands = [
            { action: 'forward', duration: 2000, message: 'หุ่นยนต์เดินหน้า' },
            { action: 'stop', duration: 500, message: 'หุ่นยนต์หยุด' },
            { action: 'turn_right', duration: 1000, message: 'หุ่นยนต์เลี้ยวขวา' },
            { action: 'forward', duration: 1500, message: 'หุ่นยนต์เดินหน้า' },
            { action: 'stop', duration: 500, message: 'หุ่นยนต์หยุด' }
        ];
        
        let currentCommand = 0;
        
        const executeNextCommand = () => {
            if (currentCommand < commands.length) {
                const command = commands[currentCommand];
                this.addLogMessage(command.message, 'info');
                
                setTimeout(() => {
                    currentCommand++;
                    executeNextCommand();
                }, command.duration);
            } else {
                this.addLogMessage('เสร็จสิ้นการควบคุมหุ่นยนต์', 'success');
            }
        };
        
        executeNextCommand();
    }

    async stopRobot() {
        try {
            this.addLogMessage('กำลังหยุดหุ่นยนต์...', 'info');
            
            const response = await auth.apiRequest('/robot/stop', {
                method: 'POST'
            });

            const data = await response.json();

            if (response.ok) {
                this.addLogMessage('หยุดหุ่นยนต์แล้ว', 'success');
                this.updateRobotStatus(data.robotStatus);
            } else {
                if (response.status === 403) {
                    this.addLogMessage('คุณไม่มีสิทธิ์ควบคุมหุ่นยนต์ในเวลานี้', 'error');
                } else {
                    this.addLogMessage(data.message || 'เกิดข้อผิดพลาดในการหยุดหุ่นยนต์', 'error');
                }
            }
        } catch (error) {
            console.error('Stop robot error:', error);
            this.addLogMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
        }
    }

    async startRealTimeMonitoring() {
        // Start monitoring robot status every 2 seconds
        this.monitoringInterval = setInterval(async () => {
            try {
                const response = await auth.apiRequest('/robot/status');
                const data = await response.json();

                if (response.ok) {
                    this.updateRobotStatus(data.robotStatus);
                    this.updateConnectionStatus(data);
                }
            } catch (error) {
                console.error('Monitoring error:', error);
            }
        }, 2000);
    }

    updateRobotStatus(status) {
        if (!status) return;

        // Update status indicators
        const statusElements = document.querySelectorAll('.robot-status');
        statusElements.forEach(element => {
            const statusType = element.dataset.status;
            const badge = element.querySelector('.badge');
            
            if (statusType === 'direction') {
                badge.textContent = status.direction || 'หยุด';
                badge.className = `badge ${this.getStatusColor(status.direction)}`;
            } else if (statusType === 'speed') {
                badge.textContent = `${status.speed || 0}%`;
            } else if (statusType === 'distance') {
                badge.textContent = `${status.distance || 0} cm`;
            } else if (statusType === 'light') {
                badge.textContent = status.light_level || 0;
            }
        });
    }

    updateConnectionStatus(data) {
        const connectionStatus = document.getElementById('connectionStatus');
        if (connectionStatus) {
            if (data.robot === 'online') {
                connectionStatus.innerHTML = '<span class="badge bg-success">●</span> เชื่อมต่อแล้ว';
            } else {
                connectionStatus.innerHTML = '<span class="badge bg-danger">●</span> ไม่สามารถเชื่อมต่อได้';
            }
        }

        // Update booking status
        const bookingStatus = document.getElementById('bookingStatus');
        if (bookingStatus) {
            if (data.hasValidBooking) {
                bookingStatus.innerHTML = '<span class="badge bg-success">●</span> มีสิทธิ์ใช้งาน';
            } else {
                bookingStatus.innerHTML = '<span class="badge bg-warning">●</span> ไม่มีสิทธิ์ใช้งาน';
            }
        }
    }

    getStatusColor(direction) {
        switch (direction) {
            case 'forward': return 'bg-success';
            case 'backward': return 'bg-info';
            case 'left': return 'bg-warning';
            case 'right': return 'bg-warning';
            case 'stop': return 'bg-secondary';
            default: return 'bg-secondary';
        }
    }

    showBookingReminder() {
        const reminder = document.createElement('div');
        reminder.className = 'alert alert-warning alert-dismissible fade show';
        reminder.innerHTML = `
            <strong>ไม่มีสิทธิ์ใช้งาน!</strong> คุณต้องจองเวลาก่อนใช้งานหุ่นยนต์
            <br><br>
            <a href="booking.html" class="btn btn-primary btn-sm">จองเวลาตอนนี้</a>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.container-fluid');
        container.insertBefore(reminder, container.firstChild);
    }

    async sendControlCommand(command, speed = 50, duration = null) {
        try {
            const response = await auth.apiRequest('/robot/control', {
                method: 'POST',
                body: JSON.stringify({ command, speed, duration })
            });

            const data = await response.json();

            if (response.ok) {
                this.addLogMessage(`คำสั่ง ${command} ถูกส่งไปยังหุ่นยนต์แล้ว`, 'success');
                this.updateRobotStatus(data.robotStatus);
            } else {
                if (response.status === 403) {
                    this.addLogMessage('คุณไม่มีสิทธิ์ควบคุมหุ่นยนต์ในเวลานี้', 'error');
                } else {
                    this.addLogMessage(data.message || 'เกิดข้อผิดพลาดในการส่งคำสั่ง', 'error');
                }
            }
        } catch (error) {
            console.error('Control command error:', error);
            this.addLogMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
        }
    }

    saveCode() {
        const code = this.codeEditor ? this.codeEditor.getValue() : document.getElementById('pythonCode').value;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'robot_control.py';
        a.click();
        URL.revokeObjectURL(url);
        
        this.addLogMessage('บันทึกโค้ดสำเร็จ', 'success');
    }

    addLogMessage(message, type = 'info') {
        const logOutput = document.getElementById('logOutput');
        if (!logOutput) return;

        const logElement = document.createElement('div');
        logElement.className = `log-message log-${type}`;
        logElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        logOutput.appendChild(logElement);
        logOutput.scrollTop = logOutput.scrollHeight;
    }
}

// Initialize robot controller when DOM is loaded
let robotController;

document.addEventListener('DOMContentLoaded', function() {
    robotController = new RobotController();
    
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
    }
    
    // Update user interface
    auth.updateUserInterface();
    
    // Start monitoring robot status
    robotController.startRealTimeMonitoring();
    
    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
    });
    
    // Cleanup monitoring on page unload
    window.addEventListener('beforeunload', () => {
        if (robotController.monitoringInterval) {
            clearInterval(robotController.monitoringInterval);
        }
    });
});

// Make functions globally available for onclick handlers
window.loadTemplate = function(type) { robotController.loadTemplate(type); };
window.clearCode = function() { robotController.clearCode(); };
window.uploadAndRun = function() { robotController.uploadAndRun(); };
window.stopRobot = function() { robotController.stopRobot(); };
window.saveCode = function() { robotController.saveCode(); }; 