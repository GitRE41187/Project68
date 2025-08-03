// Dashboard functionality
class DashboardManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.codeEditor = null;
        this.currentTime = null;
        this.init();
    }

    init() {
        this.initializeNavigation();
        this.initializeCodeEditor();
        this.initializeTimeDisplay();
        this.initializeBookingForm();
        this.checkAuthentication();
        this.updateCurrentTime();
        
        // Update time every second
        setInterval(() => this.updateCurrentTime(), 1000);
    }

    checkAuthentication() {
        if (!auth.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
        
        // Update user interface
        auth.updateUserInterface();
    }

    initializeNavigation() {
        // Sidebar navigation
        const navLinks = document.querySelectorAll('.sidebar .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Mobile sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.toggle('show');
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const sidebarToggle = document.getElementById('sidebarToggle');
            
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        });
    }

    initializeCodeEditor() {
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
                    "Tab": function(cm) {
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
    }

    initializeTimeDisplay() {
        this.currentTime = document.getElementById('currentTime');
    }

    initializeBookingForm() {
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => this.handleBooking(e));
        }
    }

    showSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        const navLinks = document.querySelectorAll('.sidebar .nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionName) {
                link.classList.add('active');
            }
        });

        this.currentSection = sectionName;

        // Initialize section-specific features
        if (sectionName === 'booking') {
            this.generateCalendar();
        }
    }

    updateCurrentTime() {
        if (this.currentTime) {
            const now = new Date();
            this.currentTime.textContent = now.toLocaleString('th-TH');
        }
    }

    async handleBooking(e) {
        e.preventDefault();
        
        const formData = {
            bookingDate: document.getElementById('bookingDate').value,
            startTime: document.getElementById('startTime').value,
            duration: document.getElementById('duration').value,
            purpose: document.getElementById('purpose').value
        };

        try {
            this.showLoading('กำลังส่งคำขอจอง...');
            
            const response = await auth.apiRequest('/booking/create', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                this.showAlert('จองห้องปฏิบัติการสำเร็จ!', 'success');
                document.getElementById('bookingForm').reset();
                this.generateCalendar();
            } else {
                this.showAlert(data.message || 'เกิดข้อผิดพลาดในการจอง', 'danger');
            }
        } catch (error) {
            console.error('Booking error:', error);
            this.showAlert('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'danger');
        } finally {
            this.hideLoading();
        }
    }

    generateCalendar() {
        const calendarContainer = document.getElementById('calendarContainer');
        if (!calendarContainer) return;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const monthNames = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let calendarHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="mb-0">${monthNames[currentMonth]} ${currentYear}</h6>
            </div>
            <div class="row text-center mb-2">
                <div class="col">อา</div>
                <div class="col">จ</div>
                <div class="col">อ</div>
                <div class="col">พ</div>
                <div class="col">พฤ</div>
                <div class="col">ศ</div>
                <div class="col">ส</div>
            </div>
        `;

        for (let week = 0; week < 6; week++) {
            calendarHTML += '<div class="row text-center mb-1">';
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + (week * 7) + day);
                
                const isCurrentMonth = currentDate.getMonth() === currentMonth;
                const isToday = currentDate.toDateString() === new Date().toDateString();
                
                let dayClass = 'col p-1';
                let dayContent = currentDate.getDate();
                
                if (!isCurrentMonth) {
                    dayClass += ' text-muted';
                } else if (isToday) {
                    dayClass += ' bg-primary text-white rounded';
                }
                
                calendarHTML += `<div class="${dayClass}">${dayContent}</div>`;
            }
            calendarHTML += '</div>';
        }

        calendarContainer.innerHTML = calendarHTML;
    }

    // Code editor functions
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
        
        this.showAlert(`โหลดเทมเพลต ${type} สำเร็จ`, 'success');
    }

    clearCode() {
        if (this.codeEditor) {
            this.codeEditor.setValue('');
        }
        this.showAlert('ล้างโค้ดแล้ว', 'info');
    }

    async uploadAndRun() {
        const code = this.codeEditor ? this.codeEditor.getValue() : document.getElementById('pythonCode').value;
        
        if (!code.trim()) {
            this.showAlert('กรุณาเขียนโค้ดก่อน', 'warning');
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
        
        this.showAlert('บันทึกโค้ดสำเร็จ', 'success');
    }

    // Camera functions
    startCamera() {
        const placeholder = document.getElementById('cameraPlaceholder');
        const video = document.getElementById('cameraVideo');
        
        this.addLogMessage('กำลังเชื่อมต่อกล้อง...', 'info');
        
        setTimeout(() => {
            placeholder.style.display = 'none';
            video.style.display = 'block';
            
            // Simulate video stream
            video.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJhc3BiZXJyeSBQaSBDYW1lcmE8L3RleHQ+PC9zdmc+';
            
            this.addLogMessage('เชื่อมต่อกล้องสำเร็จ', 'success');
            this.showAlert('เริ่มการถ่ายทอดกล้อง', 'success');
        }, 2000);
    }

    cameraUp() { this.addLogMessage('กล้องเลื่อนขึ้น', 'info'); }
    cameraDown() { this.addLogMessage('กล้องเลื่อนลง', 'info'); }
    cameraLeft() { this.addLogMessage('กล้องเลื่อนซ้าย', 'info'); }
    cameraRight() { this.addLogMessage('กล้องเลื่อนขวา', 'info'); }
    cameraStop() { this.addLogMessage('กล้องหยุด', 'info'); }

    // History functions
    filterHistory() {
        const date = document.getElementById('historyDate').value;
        const type = document.getElementById('historyType').value;
        
        this.addLogMessage(`กรองประวัติ: ${date} - ${type}`, 'info');
    }

    // Utility functions
    addLogMessage(message, type = 'info') {
        const logOutput = document.getElementById('logOutput');
        if (!logOutput) return;

        const logElement = document.createElement('p');
        logElement.className = 'mb-1';
        logElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        switch(type) {
            case 'success':
                logElement.className += ' text-success';
                break;
            case 'warning':
                logElement.className += ' text-warning';
                break;
            case 'error':
                logElement.className += ' text-danger';
                break;
            default:
                logElement.className += ' text-light';
        }
        
        logOutput.appendChild(logElement);
        logOutput.scrollTop = logOutput.scrollHeight;
    }

    showAlert(message, type = 'info') {
        // Create toast notification
        const toastContainer = document.getElementById('toastContainer') || this.createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove toast after it's hidden
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1055';
        document.body.appendChild(container);
        return container;
    }

    showLoading(message = 'กำลังโหลด...') {
        const button = document.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = true;
            button.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ${message}
            `;
        }
    }

    hideLoading() {
        const button = document.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-calendar-plus me-2"></i>จองเวลา';
        }
    }
}

// Initialize dashboard
const dashboard = new DashboardManager();

// Global functions for onclick handlers
window.showSection = (section) => dashboard.showSection(section);
window.loadTemplate = (type) => dashboard.loadTemplate(type);
window.clearCode = () => dashboard.clearCode();
window.uploadAndRun = () => dashboard.uploadAndRun();
window.stopRobot = () => dashboard.stopRobot();
window.saveCode = () => dashboard.saveCode();
window.startCamera = () => dashboard.startCamera();
window.cameraUp = () => dashboard.cameraUp();
window.cameraDown = () => dashboard.cameraDown();
window.cameraLeft = () => dashboard.cameraLeft();
window.cameraRight = () => dashboard.cameraRight();
window.cameraStop = () => dashboard.cameraStop();
window.filterHistory = () => dashboard.filterHistory(); 