// Global variables
let currentUser = null;
let currentBooking = null;
let robotConnection = false;
let cameraStream = null;
let codeEditor = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// DOM elements
const logOutput = document.getElementById('logOutput');
const pythonCode = document.getElementById('pythonCode');
const cameraVideo = document.getElementById('cameraVideo');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCodeEditor();
    generateCalendar();
    initializeBookingForm();
    updateStatusPanel();
    
    // Simulate robot connection
    setTimeout(() => {
        robotConnection = true;
        updateStatusPanel();
        addLogMessage('เชื่อมต่อกับหุ่นยนต์สำเร็จ', 'success');
    }, 2000);
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Initialize CodeMirror editor
function initializeCodeEditor() {
    if (typeof CodeMirror !== 'undefined') {
        codeEditor = CodeMirror.fromTextArea(pythonCode, {
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
        
        codeEditor.setValue(initialCode);
    }
}

// Calendar functionality
function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    
    const monthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day header';
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = 'bold';
        calendarGrid.appendChild(dayHeader);
    });
    
    // Add calendar days
    for (let i = 0; i < 42; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        dayElement.textContent = currentDate.getDate();
        
        // Check if date is in current month
        if (currentDate.getMonth() === currentMonth) {
            dayElement.style.color = '#333';
            
            // Simulate booked dates (random for demo)
            if (Math.random() < 0.3) {
                dayElement.classList.add('booked');
                dayElement.title = 'จองแล้ว';
            } else {
                dayElement.classList.add('available');
                dayElement.title = 'ว่าง';
            }
            
            dayElement.addEventListener('click', () => selectDate(currentDate));
        } else {
            dayElement.style.color = '#ccc';
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar();
}

function selectDate(date) {
    const bookingDate = document.getElementById('bookingDate');
    const formattedDate = date.toISOString().split('T')[0];
    bookingDate.value = formattedDate;
}

// Booking functionality
function initializeBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            userName: document.getElementById('userName').value,
            userEmail: document.getElementById('userEmail').value,
            bookingDate: document.getElementById('bookingDate').value,
            startTime: document.getElementById('startTime').value,
            duration: document.getElementById('duration').value,
            purpose: document.getElementById('purpose').value
        };
        
        submitBooking(formData);
    });
}

function submitBooking(formData) {
    // Simulate API call
    addLogMessage('กำลังส่งคำขอจอง...', 'info');
    
    setTimeout(() => {
        currentBooking = {
            id: Date.now(),
            ...formData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        addLogMessage('จองห้องปฏิบัติการสำเร็จ!', 'success');
        addHistoryEntry('การจอง', `จองห้องปฏิบัติการ ${formData.duration} นาที`, 'success');
        
        // Reset form
        document.getElementById('bookingForm').reset();
        
        // Update status panel
        updateStatusPanel();
        
        // Show success message
        showNotification('จองห้องปฏิบัติการสำเร็จ!', 'success');
    }, 1500);
}

// Robot control functionality
function uploadAndRun() {
    if (!currentBooking) {
        showNotification('กรุณาจองห้องปฏิบัติการก่อน', 'warning');
        return;
    }
    
    const code = codeEditor ? codeEditor.getValue() : pythonCode.value;
    
    if (!code.trim()) {
        showNotification('กรุณาเขียนโค้ดก่อน', 'warning');
        return;
    }
    
    addLogMessage('กำลังอัปโหลดโค้ด...', 'info');
    
    // Simulate code upload and execution
    setTimeout(() => {
        addLogMessage('อัปโหลดโค้ดสำเร็จ', 'success');
        addLogMessage('เริ่มรันโค้ด...', 'info');
        
        // Simulate robot movement
        simulateRobotExecution(code);
        
        addHistoryEntry('การรันโค้ด', 'รันโค้ดควบคุมหุ่นยนต์', 'success');
    }, 1000);
}

function simulateRobotExecution(code) {
    const commands = [
        { action: 'forward', duration: 2000, message: 'หุ่นยนต์เดินหน้า' },
        { action: 'stop', duration: 500, message: 'หุ่นยนต์หยุด' },
        { action: 'turn_right', duration: 1000, message: 'หุ่นยนต์เลี้ยวขวา' },
        { action: 'forward', duration: 1500, message: 'หุ่นยนต์เดินหน้า' },
        { action: 'stop', duration: 500, message: 'หุ่นยนต์หยุด' }
    ];
    
    let currentCommand = 0;
    
    function executeNextCommand() {
        if (currentCommand < commands.length) {
            const command = commands[currentCommand];
            addLogMessage(command.message, 'info');
            
            // Update robot status indicators
            updateRobotStatus(command.action);
            
            setTimeout(() => {
                currentCommand++;
                executeNextCommand();
            }, command.duration);
        } else {
            addLogMessage('เสร็จสิ้นการควบคุมหุ่นยนต์', 'success');
        }
    }
    
    executeNextCommand();
}

function updateRobotStatus(action) {
    const indicators = document.querySelectorAll('.indicator .dot');
    
    // Simulate status changes based on action
    if (action === 'forward' || action === 'backward') {
        indicators[0].className = 'dot online'; // Left motor
        indicators[1].className = 'dot online'; // Right motor
    } else if (action === 'turn_left') {
        indicators[0].className = 'dot offline';
        indicators[1].className = 'dot online';
    } else if (action === 'turn_right') {
        indicators[0].className = 'dot online';
        indicators[1].className = 'dot offline';
    } else if (action === 'stop') {
        indicators[0].className = 'dot offline';
        indicators[1].className = 'dot offline';
    }
}

function stopRobot() {
    addLogMessage('หยุดหุ่นยนต์', 'warning');
    updateRobotStatus('stop');
}

function saveCode() {
    const code = codeEditor ? codeEditor.getValue() : pythonCode.value;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robot_control.py';
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('บันทึกโค้ดสำเร็จ', 'success');
}

// Code templates
function loadTemplate(type) {
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
    
    if (codeEditor) {
        codeEditor.setValue(template);
    } else {
        pythonCode.value = template;
    }
    
    showNotification(`โหลดเทมเพลต ${type} สำเร็จ`, 'success');
}

function clearCode() {
    if (codeEditor) {
        codeEditor.setValue('');
    } else {
        pythonCode.value = '';
    }
    showNotification('ล้างโค้ดแล้ว', 'info');
}

// Camera functionality
function startCamera() {
    const placeholder = document.querySelector('.camera-placeholder');
    const video = document.getElementById('cameraVideo');
    
    // Simulate camera connection
    addLogMessage('กำลังเชื่อมต่อกล้อง...', 'info');
    
    setTimeout(() => {
        placeholder.style.display = 'none';
        video.style.display = 'block';
        
        // Simulate video stream (in real implementation, this would connect to Raspberry Pi camera)
        video.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJhc3BiZXJyeSBQaSBDYW1lcmE8L3RleHQ+PC9zdmc+';
        
        addLogMessage('เชื่อมต่อกล้องสำเร็จ', 'success');
        showNotification('เริ่มการถ่ายทอดกล้อง', 'success');
    }, 2000);
}

function cameraUp() {
    addLogMessage('กล้องเลื่อนขึ้น', 'info');
}

function cameraDown() {
    addLogMessage('กล้องเลื่อนลง', 'info');
}

function cameraLeft() {
    addLogMessage('กล้องเลื่อนซ้าย', 'info');
}

function cameraRight() {
    addLogMessage('กล้องเลื่อนขวา', 'info');
}

// History functionality
function filterHistory() {
    const date = document.getElementById('historyDate').value;
    const type = document.getElementById('historyType').value;
    
    addLogMessage(`กรองประวัติ: ${date} - ${type}`, 'info');
    // In real implementation, this would filter the history table
}

function addHistoryEntry(type, description, status) {
    const tbody = document.getElementById('historyTableBody');
    const row = document.createElement('tr');
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
    
    row.innerHTML = `
        <td>${dateStr}</td>
        <td>${timeStr}</td>
        <td>${type}</td>
        <td>${description}</td>
        <td><span class="status ${status}">เสร็จสิ้น</span></td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
}

// Utility functions
function addLogMessage(message, type = 'info') {
    const logElement = document.createElement('p');
    logElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logElement.style.color = type === 'success' ? '#28a745' : 
                            type === 'warning' ? '#ffc107' : 
                            type === 'error' ? '#dc3545' : '#6c757d';
    
    logOutput.appendChild(logElement);
    logOutput.scrollTop = logOutput.scrollHeight;
}

function updateStatusPanel() {
    const userStatus = document.querySelector('.status-item:last-child .status-busy');
    if (currentBooking) {
        userStatus.textContent = currentBooking.userName;
        userStatus.className = 'status-online';
    } else {
        userStatus.textContent = 'ไม่มี';
        userStatus.className = 'status-busy';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#28a745' : 
                     type === 'warning' ? '#ffc107' : 
                     type === 'error' ? '#dc3545' : '#17a2b8'};
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style); 