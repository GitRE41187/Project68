# Robot Control Lab - Backend Server

เซิร์ฟเวอร์หลัก (Node.js) สำหรับระบบ Robot Control Lab

## 📁 ไฟล์ในโฟลเดอร์

- **`server.js`** - Express server หลัก
- **`package.json`** - Node.js dependencies
- **`env.example`** - ตัวอย่าง environment variables
- **`setup-database.sql`** - Database schema
- **`config.js`** - การตั้งค่าฐานข้อมูล

## 🚀 การใช้งาน

### ติดตั้ง Dependencies
```bash
cd backend
npm install
```

### ตั้งค่า Environment Variables
```bash
cp env.example .env
# แก้ไข .env ให้ตรงกับค่าของคุณ
```

### รันเซิร์ฟเวอร์
```bash
npm start
```

เซิร์ฟเวอร์จะรันที่ `http://localhost:3001`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/register` - สมัครสมาชิก
- `GET /api/auth/verify` - ตรวจสอบ token

### Dashboard
- `GET /api/health` - ตรวจสอบสถานะระบบ
- `GET /api/dashboard/stats` - สถิติแดชบอร์ด

### Lab Management
- `GET /api/labs` - รายการห้องปฏิบัติการ
- `POST /api/booking/create` - สร้างการจอง
- `GET /api/booking/list` - รายการการจอง

### Robot Control
- `POST /api/robot/execute` - รันโค้ด Python บนหุ่นยนต์
- `POST /api/robot/control` - ควบคุมการเคลื่อนที่
- `GET /api/robot/status` - สถานะหุ่นยนต์
- `GET /api/robot/sensors` - ข้อมูลเซ็นเซอร์
- `POST /api/robot/stop` - หยุดหุ่นยนต์

### Camera
- `POST /api/camera/start-stream` - เริ่มการถ่ายทอดกล้อง

### History
- `GET /api/history` - ประวัติการใช้งาน

## 🔧 การตั้งค่า

### Database
```bash
# สร้างฐานข้อมูล
mysql -u root -p
CREATE DATABASE robot_lab_db;
USE robot_lab_db;

# Import schema
mysql -u root -p robot_lab_db < setup-database.sql
```

### Environment Variables
```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=robot_lab_db

# JWT Configuration
JWT_SECRET=your_super_secret_key

# Raspberry Pi Configuration
RASPBERRY_PI_URL=http://192.168.1.100:5000

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 🔒 ความปลอดภัย

- JWT Authentication สำหรับทุก API
- Input validation และ sanitization
- SQL injection protection
- CORS configuration
- Rate limiting

## 📊 การ Monitor

- Health check endpoint
- Real-time system status
- Raspberry Pi connection monitoring
- Database health indicators

## 🔗 การเชื่อมต่อ

เซิร์ฟเวอร์นี้ทำหน้าที่เป็น Bridge ระหว่าง:
- **Frontend (React)** - สำหรับ user interface
- **Raspberry Pi 5** - สำหรับควบคุมหุ่นยนต์และกล้อง
- **Database (MySQL)** - สำหรับเก็บข้อมูลผู้ใช้และการจอง
