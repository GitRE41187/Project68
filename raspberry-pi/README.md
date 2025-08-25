# Raspberry Pi 5 Server

เซิร์ฟเวอร์สำหรับควบคุมหุ่นยนต์และกล้องบน Raspberry Pi 5

## 📁 ไฟล์ในโฟลเดอร์

- **`raspberry-pi-server.py`** - Python Flask server สำหรับควบคุมหุ่นยนต์
- **`requirements.txt`** - Python dependencies ที่จำเป็น
- **`setup-raspberry-pi.sh`** - สคริปต์ติดตั้งอัตโนมัติ
- **`RASPBERRY_PI_SETUP.md`** - คู่มือการติดตั้งแบบละเอียด

## 🚀 การใช้งาน

### ติดตั้ง Dependencies
```bash
cd raspberry-pi
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### รันเซิร์ฟเวอร์
```bash
python3 raspberry-pi-server.py
```

เซิร์ฟเวอร์จะรันที่ `http://0.0.0.0:5000`

## 🔧 การตั้งค่า

ดูรายละเอียดการตั้งค่าได้ที่ `RASPBERRY_PI_SETUP.md`

## 📡 API Endpoints

- `GET /api/robot/status` - สถานะหุ่นยนต์
- `POST /api/robot/control` - ควบคุมหุ่นยนต์
- `POST /api/robot/execute` - รันโค้ด Python
- `GET /api/robot/sensors` - ข้อมูลเซ็นเซอร์
- `POST /api/robot/stop` - หยุดหุ่นยนต์

## 🔌 การเชื่อมต่อ Hardware

ดูรายละเอียดการเชื่อมต่อ GPIO ได้ที่ `RASPBERRY_PI_SETUP.md`
