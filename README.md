# Robot Control Lab - Raspberry Pi 5 Integration

ระบบห้องปฏิบัติการควบคุมหุ่นยนต์ออนไลน์ที่พัฒนาด้วย React และ Raspberry Pi 5

## 🚀 คุณสมบัติหลัก

- **ระบบ Authentication**: เข้าสู่ระบบและสมัครสมาชิก
- **เมนูหลัก**: นำทางไปยังฟีเจอร์ต่างๆ
- **แดชบอร์ด**: แสดงสถานะระบบและสถิติแบบ Real-time
- **การจอง**: จองห้องปฏิบัติการ
- **ควบคุมหุ่นยนต์**: เขียนโค้ด Python เพื่อควบคุมหุ่นยนต์ผ่าน Raspberry Pi 5
- **กล้องถ่ายทอดสด**: ดูภาพและควบคุมกล้องจาก Raspberry Pi 5
- **ประวัติ**: ดูประวัติการใช้งาน
- **ช่วยเหลือ**: คู่มือการใช้งานและติดต่อ

## 🏗️ สถาปัตยกรรมระบบ

```
┌─────────────────┐    HTTP/WebSocket    ┌──────────────────┐
│   Frontend      │ ◄──────────────────► │  Main Server     │
│   (React)       │                      │  (Node.js)       │
└─────────────────┘                      └──────────────────┘
                                                    │
                                                    │ HTTP API
                                                    ▼
                                         ┌──────────────────┐
                                         │ Raspberry Pi 5   │
                                         │ (Python Flask)   │
                                         │                  │
                                         │ • Robot Control  │
                                         │ • Camera Stream  │
                                         │ • Sensors        │
                                         └──────────────────┘
```

### Main Server (Node.js)
- จัดการ Authentication และ User Management
- จัดการการจองห้องปฏิบัติการ
- เป็น Bridge ระหว่าง Frontend และ Raspberry Pi
- จัดการ Database และ Logging
- Health monitoring และ status reporting

### Raspberry Pi 5 Server (Python)
- ควบคุมหุ่นยนต์ผ่าน GPIO
- จัดการกล้องถ่ายทอดสด
- อ่านข้อมูลจากเซ็นเซอร์
- รันโค้ด Python ที่ผู้ใช้เขียน
- Real-time sensor data collection

### Frontend (React)
- User interface ที่ทันสมัยและ responsive
- Real-time status monitoring
- Code editor สำหรับเขียนโค้ด Python
- Camera control และ streaming
- Dashboard แบบ real-time

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- **React 18**: UI Framework
- **React Router DOM**: Navigation
- **Bootstrap 5**: UI Components
- **React Icons**: Icons
- **CodeMirror 6**: Code Editor
- **Axios**: HTTP Client
- **React Context API**: State Management

### Main Server (Backend)
- **Node.js**: Runtime Environment
- **Express.js**: Web Framework
- **MySQL**: Database
- **JWT**: Authentication
- **Axios**: HTTP Client for Pi communication
- **bcryptjs**: Password hashing

### Raspberry Pi 5 Server
- **Python 3**: Programming Language
- **Flask**: Web Framework
- **RPi.GPIO**: GPIO Control
- **OpenCV**: Camera Processing
- **Threading**: Concurrent Operations
- **Logging**: Comprehensive logging system

## 📁 โครงสร้างโปรเจค

```
Project68/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # UI Components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── booking/     # Lab booking
│   │   │   ├── camera/      # Camera control
│   │   │   ├── dashboard/   # Dashboard & monitoring
│   │   │   ├── robot/       # Robot control
│   │   │   ├── history/     # Activity history
│   │   │   ├── help/        # Help & support
│   │   │   ├── settings/    # User settings
│   │   │   └── common/      # Shared components
│   │   ├── contexts/        # React Contexts
│   │   └── ...
│   └── package.json
├── backend/                  # Main Server (Node.js)
│   ├── server.js            # Express Server
│   ├── package.json         # Node.js Dependencies
│   ├── env.example          # Environment Variables
│   ├── setup-database.sql   # Database schema
│   └── config.js            # Configuration
└── raspberry-pi/            # Raspberry Pi Server
    ├── raspberry-pi-server.py # Python Flask Server
    ├── requirements.txt      # Python Dependencies
    ├── setup-raspberry-pi.sh # Pi Setup Script
    └── RASPBERRY_PI_SETUP.md # Pi Setup Guide
```

## 🚀 การติดตั้งและรัน

### 1. ติดตั้ง Main Server (Node.js)

```bash
cd backend
npm install
cp env.example .env
# แก้ไข .env ให้ตรงกับค่าของคุณ
npm start
```

Main Server จะรันที่ `http://localhost:3001`

### 2. ติดตั้ง Raspberry Pi 5 Server

#### 2.1 ติดตั้ง Dependencies บน Pi
```bash
# บน Raspberry Pi 5
sudo apt update
sudo apt install python3-pip python3-venv
sudo apt install python3-opencv
sudo apt install libatlas-base-dev  # สำหรับ OpenCV
```

#### 2.2 ติดตั้ง Python Dependencies
```bash
cd raspberry-pi
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 2.3 รัน Pi Server
```bash
python3 raspberry-pi-server.py
```

Pi Server จะรันที่ `http://0.0.0.0:5000`

### 3. ติดตั้ง Frontend

```bash
cd frontend
npm install
npm start
```

Frontend จะรันที่ `http://localhost:3000`

## ⚙️ การตั้งค่า Environment Variables

### Main Server (.env)
```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=robot_lab_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Raspberry Pi Configuration
RASPBERRY_PI_URL=http://192.168.1.100:5000

# Server Configuration
PORT=3001
NODE_ENV=development
```

### Raspberry Pi Configuration
- เปลี่ยน IP Address ใน `RASPBERRY_PI_URL` ให้ตรงกับ IP ของ Pi
- ตรวจสอบว่า Pi และ Main Server สามารถสื่อสารกันได้
- เปิด Firewall port 5000 บน Pi

## 🔌 การเชื่อมต่อ Hardware

### Raspberry Pi 5 GPIO Pins
```
Motor Control:
- LEFT_MOTOR_FORWARD: GPIO 17
- LEFT_MOTOR_BACKWARD: GPIO 18
- RIGHT_MOTOR_FORWARD: GPIO 27
- RIGHT_MOTOR_BACKWARD: GPIO 22

PWM Control:
- LEFT_MOTOR_PWM: GPIO 12
- RIGHT_MOTOR_PWM: GPIO 13

Sensors:
- DISTANCE_TRIGGER: GPIO 23
- DISTANCE_ECHO: GPIO 24
- LIGHT_SENSOR: GPIO 25

Status LED:
- STATUS_LED: GPIO 26
```

## 📡 API Endpoints

### Main Server Endpoints
- `GET /api/health` - System health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/labs` - Get available labs
- `POST /api/booking/create` - Create lab booking
- `GET /api/booking/list` - List user bookings
- `POST /api/robot/execute` - Execute Python code on robot
- `POST /api/robot/control` - Control robot movement
- `GET /api/robot/status` - Get robot status
- `GET /api/robot/sensors` - Get sensor data
- `POST /api/robot/stop` - Stop robot
- `POST /api/camera/start-stream` - Start camera stream
- `GET /api/history` - Get user activity history

### Raspberry Pi Endpoints
- `GET /api/robot/status` - Robot status
- `POST /api/robot/control` - Robot control
- `POST /api/robot/execute` - Code execution
- `GET /api/robot/sensors` - Sensor readings
- `POST /api/robot/stop` - Stop robot

## 🔒 ระบบความปลอดภัย

- **JWT Authentication**: ทุก API call ต้องมี valid token
- **Booking Validation**: ตรวจสอบสิทธิ์การเข้าถึงห้องปฏิบัติการ
- **Code Execution Safety**: รันโค้ดใน isolated environment
- **GPIO Protection**: ป้องกันการเข้าถึง GPIO ที่ไม่ได้รับอนุญาต
- **Input Validation**: ตรวจสอบข้อมูลที่รับเข้ามา
- **Rate Limiting**: ป้องกัน API abuse

## 📊 การ Monitor และ Logging

### Health Check
```bash
GET /api/health
```

Response:
```json
{
  "success": true,
  "message": "Robot Control Lab API is running",
  "services": {
    "mainServer": "online",
    "raspberryPi": "online",
    "database": "online"
  },
  "raspberryPi": {
    "direction": "stop",
    "speed": 0,
    "distance": 25.5,
    "light_level": 1
  }
}
```

### Logging
- Main Server: Console และ Database
- Raspberry Pi: File (`robot_server.log`) และ Console
- Activity Logs: บันทึกการใช้งานของผู้ใช้
- Error Logging: Comprehensive error tracking

## 🚨 การแก้ไขปัญหา

### Raspberry Pi ไม่ตอบสนอง
1. ตรวจสอบ IP Address ใน `.env`
2. ตรวจสอบว่า Pi Server รันอยู่
3. ตรวจสอบ Firewall settings
4. ตรวจสอบ Network connectivity

### หุ่นยนต์ไม่เคลื่อนที่
1. ตรวจสอบการเชื่อมต่อ GPIO
2. ตรวจสอบ Motor drivers
3. ตรวจสอบ Power supply
4. ตรวจสอบ Python code syntax

### กล้องไม่ทำงาน
1. ตรวจสอบการเชื่อมต่อ Camera module
2. ตรวจสอบ OpenCV installation
3. ตรวจสอบ Camera permissions

## 🔧 การปรับแต่งเพิ่มเติม

### เพิ่มเซ็นเซอร์ใหม่
1. เพิ่ม GPIO pin ใน `RobotCar` class
2. เพิ่ม method สำหรับอ่านข้อมูลเซ็นเซอร์
3. เพิ่ม endpoint ใน Pi server
4. อัปเดต frontend เพื่อแสดงข้อมูล

### เพิ่มฟีเจอร์หุ่นยนต์
1. เพิ่ม method ใน `RobotCar` class
2. เพิ่ม endpoint ใน Pi server
3. อัปเดต frontend UI
4. เพิ่ม validation และ error handling

## 📱 Responsive Design

แอปได้รับการออกแบบให้รองรับทุกขนาดหน้าจอ:
- Desktop (≥1200px)
- Tablet (≥768px)
- Mobile (≥576px)

## 🎨 สไตล์และการออกแบบ

- ใช้ CSS Variables สำหรับสีหลัก
- Gradient backgrounds และ animations
- Card-based layout
- Hover effects และ transitions
- Bootstrap 5 components
- Modern UI/UX design

## 🔐 ระบบ Authentication

- JWT Token-based authentication
- Protected routes
- User context management
- Auto-logout เมื่อ token หมดอายุ
- Role-based access control

## 📊 State Management

ใช้ React Context API สำหรับ:
- User authentication state
- Global app state
- Theme preferences
- Real-time updates

## 🚀 การ Deploy

### Main Server
1. Push code ไปยัง Git repository
2. Deploy บน VPS หรือ Cloud service
3. ตั้งค่า Environment variables
4. รัน `npm start` หรือใช้ PM2

### Raspberry Pi 5
1. Copy code ไปยัง Pi
2. ติดตั้ง dependencies
3. ตั้งค่า auto-start service
4. ตรวจสอบ network connectivity

### Frontend
1. Build: `npm run build`
2. Deploy บน Netlify, Vercel, หรือ Static hosting
3. ตั้งค่า API base URL

## 🔧 การปรับแต่ง

### เปลี่ยนสีหลัก
แก้ไขใน `frontend/src/index.css`:
```css
:root {
  --primary-color: #667eea;    /* เปลี่ยนสีหลัก */
  --secondary-color: #764ba2;  /* เปลี่ยนสีรอง */
}
```

### เพิ่ม Route ใหม่
1. สร้าง component ใหม่ใน `frontend/src/components/`
2. เพิ่ม route ใน `frontend/src/App.js`
3. เพิ่ม link ใน `frontend/src/components/MainMenu.js`

## 📝 การพัฒนาเพิ่มเติม

### เพิ่ม Feature ใหม่
1. สร้าง component ใหม่
2. เพิ่ม route ใน App.js
3. อัปเดต navigation
4. เพิ่ม CSS styles
5. อัปเดต Pi server ถ้าจำเป็น

### การทดสอบ
```bash
# Frontend
cd frontend
npm test

# Main Server
cd backend
npm test  # ถ้ามี test scripts
```

## 🤝 การมีส่วนร่วม

1. Fork โปรเจค
2. สร้าง feature branch
3. Commit การเปลี่ยนแปลง
4. Push ไปยัง branch
5. สร้าง Pull Request

## 📄 License

ISC License

## 📞 ติดต่อ

สำหรับคำถามหรือข้อเสนอแนะ กรุณาติดต่อทีมพัฒนา

---

## 🔄 Recent Updates

### Frontend Updates
- ✅ Integrated with new backend APIs
- ✅ Real-time Raspberry Pi status monitoring
- ✅ Enhanced robot control interface
- ✅ Improved camera control system
- ✅ Real-time dashboard with system health
- ✅ Better error handling and user feedback

### Backend Updates
- ✅ Added Raspberry Pi communication layer
- ✅ Enhanced robot control endpoints
- ✅ Improved camera streaming integration
- ✅ Better health monitoring system
- ✅ Enhanced security and validation
- ✅ Comprehensive logging system

### Raspberry Pi Integration
- ✅ Complete hardware control system
- ✅ Real-time sensor monitoring
- ✅ Camera streaming capabilities
- ✅ Safe code execution environment
- ✅ Automated setup scripts
- ✅ Comprehensive documentation

**หมายเหตุ**: ระบบนี้ใช้ Raspberry Pi 5 เป็น Robot Control Server และ Main Server เป็น Bridge ระหว่าง Frontend และ Pi เพื่อจัดการ Authentication, Booking, และ Database
