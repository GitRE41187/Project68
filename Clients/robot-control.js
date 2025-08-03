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

        this.addLogMessage('กำลังอัปโหลดโค้ด...', 'info');
        
        try {
            const response = await auth.apiRequest('/robot/upload', {
                method: 'POST',
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (response.ok) {
                this.addLogMessage('อัปโหลดโค้ดสำเร็จ', 'success');
                this.addLogMessage('เริ่มรันโค้ด...', 'info');
                this.simulateRobotExecution(code);
            } else {
                this.addLogMessage(data.message || 'เกิดข้อผิดพลาดในการอัปโหลด', 'error');
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

    stopRobot() {
        this.addLogMessage('หยุดหุ่นยนต์', 'warning');
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
    
    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
    });
});

// Make functions globally available for onclick handlers
window.loadTemplate = function(type) { robotController.loadTemplate(type); };
window.clearCode = function() { robotController.clearCode(); };
window.uploadAndRun = function() { robotController.uploadAndRun(); };
window.stopRobot = function() { robotController.stopRobot(); };
window.saveCode = function() { robotController.saveCode(); }; 