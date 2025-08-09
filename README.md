# Robot Control Lab System

ระบบควบคุมหุ่นยนต์ผ่าน Raspberry Pi พร้อมระบบจองเวลาใช้งาน

## คุณสมบัติ

- 🤖 ควบคุมหุ่นยนต์ผ่าน Raspberry Pi
- 📅 ระบบจองเวลาใช้งาน
- 🔐 ระบบยืนยันตัวตน
- 📊 แสดงสถานะหุ่นยนต์แบบ Real-time
- 💻 เขียนโค้ด Python เพื่อควบคุมหุ่นยนต์
- 📱 ใช้งานผ่านเว็บเบราว์เซอร์

## โครงสร้างระบบ

```
Project68/
├── Clients/                 # Frontend files
│   ├── robot-control.html   # หน้าควบคุมหุ่นยนต์
│   ├── robot-control.js     # JavaScript สำหรับควบคุมหุ่นยนต์
│   ├── booking.html         # หน้าจองเวลา
│   └── ...
├── Server/                  # Backend files
│   ├── server.js            # Main server (Node.js)
│   ├── raspberry-pi-server.py  # Raspberry Pi server (Python)
│   ├── requirements.txt     # Python dependencies
│   └── setup-raspberry-pi.sh   # Setup script for Pi
└── README.md
```

## การติดตั้ง

### 1. ติดตั้ง Main Server (Node.js)

```bash
# Clone repository
git clone <repository-url>
cd Project68

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env file with your database and Raspberry Pi settings

# Start server
npm start
```

### 2. ติดตั้ง Raspberry Pi Server

#### 2.1 เตรียม Raspberry Pi

```bash
# SSH เข้า Raspberry Pi
ssh pi@<raspberry-pi-ip>

# Clone หรือ copy files ไปยัง Pi
cd /home/pi
mkdir robot-control
cd robot-control
```

#### 2.2 ติดตั้งระบบ

```bash
# Copy files จาก main server ไปยัง Pi
# - raspberry-pi-server.py
# - requirements.txt
# - setup-raspberry-pi.sh

# Run setup script
chmod +x setup-raspberry-pi.sh
./setup-raspberry-pi.sh
```

#### 2.3 เชื่อมต่อฮาร์ดแวร์

เชื่อมต่อ GPIO pins ตามนี้:

| Component | GPIO Pin |
|-----------|----------|
| Left Motor Forward | 17 |
| Left Motor Backward | 18 |
| Right Motor Forward | 27 |
| Right Motor Backward | 22 |
| Left Motor PWM | 12 |
| Right Motor PWM | 13 |
| Distance Sensor Trigger | 23 |
| Distance Sensor Echo | 24 |
| Light Sensor | 25 |
| Status LED | 26 |

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ใน main server:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=robot_lab_db

# JWT
JWT_SECRET=your_secret_key

# Raspberry Pi
RASPBERRY_PI_URL=http://192.168.1.100:5000

# Server
PORT=3000
```

## การใช้งาน

### 1. ลงทะเบียนและเข้าสู่ระบบ

1. เปิดเว็บเบราว์เซอร์ไปที่ `http://localhost:3000`
2. ลงทะเบียนบัญชีใหม่
3. เข้าสู่ระบบ

### 2. จองเวลาใช้งาน

1. ไปที่หน้า "จองห้องปฏิบัติการ"
2. เลือกวันที่และเวลา
3. ระบุวัตถุประสงค์
4. ยืนยันการจอง

### 3. ควบคุมหุ่นยนต์

1. ไปที่หน้า "ควบคุมหุ่นยนต์"
2. ตรวจสอบสถานะการเชื่อมต่อ
3. เขียนโค้ด Python หรือใช้ปุ่มควบคุมทันที
4. อัปโหลดและรันโค้ด

## API Endpoints

### Authentication
- `POST /api/auth/register` - ลงทะเบียน
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/logout` - ออกจากระบบ

### Booking
- `POST /api/booking/create` - สร้างการจอง
- `GET /api/booking/list` - รายการจอง

### Robot Control
- `POST /api/robot/upload` - อัปโหลดโค้ด
- `POST /api/robot/control` - ส่งคำสั่งควบคุม
- `POST /api/robot/stop` - หยุดหุ่นยนต์
- `GET /api/robot/status` - สถานะหุ่นยนต์
- `GET /api/robot/sensors` - ข้อมูลเซนเซอร์

## ตัวอย่างโค้ด Python

### การเคลื่อนที่พื้นฐาน

```python
import time
from robot import Robot

robot = Robot()

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
    main()
```

### การใช้เซนเซอร์

```python
import time
from robot import Robot

robot = Robot()

def main():
    print("ทดสอบเซนเซอร์...")
    
    while True:
        # อ่านค่าเซนเซอร์ระยะทาง
        distance = robot.distance_sensor()
        print(f"ระยะทาง: {distance} cm")
        
        # ถ้ามีสิ่งกีดขวาง ให้หยุด
        if distance < 10:
            robot.stop()
            print("พบสิ่งกีดขวาง!")
            break
        
        # เดินหน้า
        robot.forward(0.5)
        time.sleep(0.5)

if __name__ == "__main__":
    main()
```

## การแก้ไขปัญหา

### Raspberry Pi ไม่เชื่อมต่อ

1. ตรวจสอบ IP address ของ Pi
2. ตรวจสอบ firewall settings
3. ตรวจสอบ service status: `sudo systemctl status robot-control.service`

### ไม่มีสิทธิ์ใช้งาน

1. ตรวจสอบการจองเวลา
2. ตรวจสอบสถานะการจอง (ต้องเป็น "confirmed")
3. ตรวจสอบเวลาปัจจุบัน

### ข้อผิดพลาด GPIO

1. ตรวจสอบการเชื่อมต่อฮาร์ดแวร์
2. ตรวจสอบ GPIO pin configuration
3. ตรวจสอบ permissions: `sudo usermod -a -G gpio pi`

## การพัฒนาเพิ่มเติม

### เพิ่มเซนเซอร์ใหม่

1. เพิ่ม GPIO pin ใน `RobotCar` class
2. เพิ่ม method สำหรับอ่านค่าเซนเซอร์
3. อัปเดต API endpoints

### เพิ่มฟีเจอร์ใหม่

1. เพิ่ม API endpoints ใน main server
2. อัปเดต frontend interface
3. เพิ่มการตรวจสอบสิทธิ์

## License

MIT License

## Support

หากมีปัญหาหรือคำถาม กรุณาติดต่อทีมพัฒนา 