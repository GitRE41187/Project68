# Raspberry Pi 5 Setup Guide for Robot Control Lab

คู่มือการติดตั้งและตั้งค่า Raspberry Pi 5 สำหรับระบบ Robot Control Lab

## 📋 Prerequisites

### Hardware Requirements
- **Raspberry Pi 5** (4GB RAM recommended)
- **MicroSD Card** (32GB Class 10+ recommended)
- **Power Supply** (5V/3A USB-C)
- **Robot Car Kit** with:
  - 2 DC Motors
  - Motor Driver Board (L298N or similar)
  - Chassis and Wheels
  - Ultrasonic Distance Sensor (HC-SR04)
  - Light Sensor (LDR)
  - LED Indicators
  - Jumper Wires
  - Breadboard

### Software Requirements
- **Raspberry Pi OS** (Bookworm - 64-bit recommended)
- **Python 3.9+**
- **Git**

## 🚀 Quick Setup

### 1. Flash Raspberry Pi OS
```bash
# Download Raspberry Pi Imager
# https://www.raspberrypi.com/software/

# Flash to MicroSD card with:
# - Hostname: robot-pi
# - Enable SSH
# - Set username/password
# - Configure WiFi
```

### 2. First Boot Setup
```bash
# Connect to Pi via SSH
ssh pi@robot-pi.local

# Update system
sudo apt update && sudo apt upgrade -y

# Enable I2C and SPI if needed
sudo raspi-config
# Interface Options > I2C > Enable
# Interface Options > SPI > Enable
```

### 3. Run Automated Setup
```bash
# Download and run setup script
curl -sSL https://raw.githubusercontent.com/your-repo/Project68/main/backend/setup-raspberry-pi.sh | bash

# Or manually download and run
wget https://raw.githubusercontent.com/your-repo/Project68/main/backend/setup-raspberry-pi.sh
chmod +x setup-raspberry-pi.sh
./setup-raspberry-pi.sh
```

## 🔌 Hardware Connection

### Motor Control Wiring
```
Motor Driver Board (L298N):
├── VCC → 5V (Pi or External)
├── GND → GND
├── ENA → GPIO 12 (PWM Left)
├── ENB → GPIO 13 (PWM Right)
├── IN1 → GPIO 17 (Left Forward)
├── IN2 → GPIO 18 (Left Backward)
├── IN3 → GPIO 27 (Right Forward)
└── IN4 → GPIO 22 (Right Backward)
```

### Sensor Wiring
```
Ultrasonic Sensor (HC-SR04):
├── VCC → 5V
├── GND → GND
├── TRIG → GPIO 23
└── ECHO → GPIO 24

Light Sensor (LDR):
├── VCC → 3.3V
├── GND → GND
└── Signal → GPIO 25

Status LED:
├── Anode → GPIO 26 (via 220Ω resistor)
└── Cathode → GND
```

### Power Distribution
```
Power Supply:
├── 5V/3A → Motor Driver Board
├── 5V/3A → Raspberry Pi 5
└── 3.3V → Sensors and Pi GPIO

⚠️  Warning: Never power motors directly from Pi GPIO pins!
```

## ⚙️ Manual Installation

### 1. Install System Dependencies
```bash
# Update package list
sudo apt update

# Install essential packages
sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    git \
    curl \
    wget \
    vim \
    htop \
    screen \
    ufw

# Install OpenCV dependencies
sudo apt install -y \
    python3-opencv \
    libatlas-base-dev \
    libhdf5-dev \
    libhdf5-serial-dev \
    libharfbuzz0b \
    libwebp6 \
    libtiff5 \
    libjasper1 \
    libilmbase23 \
    libopenexr23 \
    libgstreamer1.0-0 \
    libavcodec58 \
    libavformat58 \
    libswscale5 \
    libv4l-0 \
    libxvidcore4 \
    libx264-163
```

### 2. Create Project Structure
```bash
# Create project directory
mkdir -p ~/robot-control-lab
cd ~/robot-control-lab

# Create subdirectories
mkdir -p logs backups config

# Clone or copy project files
# (Copy raspberry-pi-server.py and other files here)
```

### 3. Setup Python Environment
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install Python dependencies
pip install -r requirements.txt

# Or install manually
pip install Flask==2.3.3
pip install Flask-CORS==4.0.0
pip install RPi.GPIO==0.7.1
pip install Werkzeug==2.3.7
pip install opencv-python
pip install numpy
pip install requests
pip install pillow
```

### 4. Configure System Service
```bash
# Create systemd service file
sudo tee /etc/systemd/system/robot-control-lab.service > /dev/null <<EOF
[Unit]
Description=Robot Control Lab Server
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/robot-control-lab
Environment=PATH=/home/pi/robot-control-lab/venv/bin
ExecStart=/home/pi/robot-control-lab/venv/bin/python raspberry-pi-server.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable robot-control-lab
sudo systemctl start robot-control-lab
```

### 5. Configure Firewall
```bash
# Allow SSH and robot control server
sudo ufw allow ssh
sudo ufw allow 5000/tcp

# Enable firewall
sudo ufw --force enable

# Check status
sudo ufw status
```

## 🔧 Configuration

### Environment Variables
```bash
# Create .env file
cat > ~/robot-control-lab/.env <<EOF
# Server Configuration
HOST=0.0.0.0
PORT=5000
DEBUG=False

# GPIO Configuration
LEFT_MOTOR_FORWARD=17
LEFT_MOTOR_BACKWARD=18
RIGHT_MOTOR_FORWARD=27
RIGHT_MOTOR_BACKWARD=22
LEFT_MOTOR_PWM=12
RIGHT_MOTOR_PWM=13
DISTANCE_TRIGGER=23
DISTANCE_ECHO=24
LIGHT_SENSOR=25
STATUS_LED=26

# Robot Configuration
DEFAULT_SPEED=50
MAX_SPEED=100
MIN_SPEED=0
TURN_DURATION=0.5
FORWARD_DURATION=1.0

# Security
ALLOWED_ORIGINS=*
API_TIMEOUT=10
MAX_CODE_EXECUTION_TIME=300
EOF
```

### Network Configuration
```bash
# Set static IP (optional but recommended)
sudo tee -a /etc/dhcpcd.conf > /dev/null <<EOF

# Static IP configuration
interface eth0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8 8.8.4.4

interface wlan0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8 8.8.4.4
EOF

# Restart networking
sudo systemctl restart dhcpcd
```

## 🧪 Testing

### 1. Test GPIO Access
```bash
# Test GPIO functionality
python3 -c "
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(26, GPIO.OUT)
GPIO.output(26, GPIO.HIGH)
print('GPIO test successful')
GPIO.cleanup()
"
```

### 2. Test Motor Control
```bash
# Test basic motor movement
python3 -c "
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.OUT)
GPIO.setup(18, GPIO.OUT)

print('Testing left motor forward...')
GPIO.output(17, GPIO.HIGH)
GPIO.output(18, GPIO.LOW)
time.sleep(1)

print('Testing left motor backward...')
GPIO.output(17, GPIO.LOW)
GPIO.output(18, GPIO.HIGH)
time.sleep(1)

print('Stopping motor...')
GPIO.output(17, GPIO.LOW)
GPIO.output(18, GPIO.LOW)
GPIO.cleanup()
print('Motor test completed')
"
```

### 3. Test Server
```bash
# Start server manually
cd ~/robot-control-lab
source venv/bin/activate
python3 raspberry-pi-server.py

# In another terminal, test API
curl http://localhost:5000/api/robot/status
```

## 📊 Monitoring and Maintenance

### Service Management
```bash
# Check service status
sudo systemctl status robot-control-lab

# View logs
sudo journalctl -u robot-control-lab -f

# Restart service
sudo systemctl restart robot-control-lab

# Stop service
sudo systemctl stop robot-control-lab
```

### Log Management
```bash
# View application logs
tail -f ~/robot-control-lab/logs/robot_server.log

# Rotate logs (add to crontab)
sudo crontab -e
# Add: 0 0 * * * /usr/sbin/logrotate /etc/logrotate.d/robot-control-lab

# Create logrotate config
sudo tee /etc/logrotate.d/robot-control-lab > /dev/null <<EOF
/home/pi/robot-control-lab/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 pi pi
}
EOF
```

### Backup and Recovery
```bash
# Create backup
~/robot-control-lab/backup.sh

# Restore from backup
cd ~/robot-control-lab
tar -xzf /home/pi/backups/robot-control-lab/robot-control-lab_YYYYMMDD_HHMMSS.tar.gz

# Update service
sudo systemctl restart robot-control-lab
```

## 🚨 Troubleshooting

### Common Issues

#### 1. GPIO Permission Denied
```bash
# Add user to gpio group
sudo usermod -a -G gpio pi

# Or run with sudo (not recommended for production)
sudo python3 raspberry-pi-server.py
```

#### 2. Motor Not Moving
```bash
# Check wiring
# Check power supply
# Test individual GPIO pins
# Check motor driver board

# Test with simple script
python3 -c "
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.OUT)
GPIO.output(17, GPIO.HIGH)
print('Pin 17 set HIGH')
"
```

#### 3. Camera Not Working
```bash
# Check camera module connection
# Enable camera in raspi-config
sudo raspi-config
# Interface Options > Camera > Enable

# Test camera
raspistill -o test.jpg
```

#### 4. Service Won't Start
```bash
# Check service logs
sudo journalctl -u robot-control-lab -n 50

# Check file permissions
ls -la ~/robot-control-lab/

# Check Python path
sudo systemctl status robot-control-lab
```

#### 5. Network Issues
```bash
# Check network status
ip addr show
ping 8.8.8.8

# Check firewall
sudo ufw status

# Test port accessibility
netstat -tlnp | grep 5000
```

### Performance Optimization

#### 1. Reduce CPU Usage
```bash
# Edit service file
sudo systemctl edit robot-control-lab

# Add:
[Service]
Nice=-10
IOSchedulingClass=1
IOSchedulingPriority=4
```

#### 2. Memory Management
```bash
# Monitor memory usage
htop
free -h

# Set memory limits in service
[Service]
MemoryMax=512M
```

#### 3. Log Rotation
```bash
# Implement log rotation to prevent disk space issues
# See log management section above
```

## 🔒 Security Considerations

### Network Security
```bash
# Restrict access to specific IPs
sudo ufw allow from 192.168.1.0/24 to any port 5000

# Use VPN for remote access
# Implement API key authentication
```

### Code Execution Safety
```bash
# Limit execution time
# Sandbox Python execution
# Validate input code
# Monitor resource usage
```

### GPIO Protection
```bash
# Implement emergency stop
# Add hardware limits
# Monitor temperature
# Add current protection
```

## 📈 Scaling and Expansion

### Multiple Robots
```bash
# Run multiple instances on different ports
# Use load balancer
# Implement robot queuing system
```

### Remote Access
```bash
# Use reverse proxy (nginx)
# Implement WebSocket for real-time control
# Add SSL/TLS encryption
```

### Data Collection
```bash
# Log sensor data to database
# Implement analytics dashboard
# Add machine learning capabilities
```

## 📚 Additional Resources

### Documentation
- [Raspberry Pi GPIO Documentation](https://gpiozero.readthedocs.io/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [OpenCV Python Tutorials](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)

### Community
- [Raspberry Pi Forums](https://forums.raspberrypi.com/)
- [Python Robotics Community](https://python-robotics.readthedocs.io/)
- [OpenCV Community](https://opencv.org/community/)

### Tools
- [GPIO Zero](https://gpiozero.readthedocs.io/) - Alternative GPIO library
- [Picamera2](https://picamera2.readthedocs.io/) - Modern camera library
- [RPi.GPIO](https://pypi.org/project/RPi.GPIO/) - Standard GPIO library

---

**Note**: This guide assumes you have basic knowledge of Linux, Python, and electronics. For production use, consider additional security measures and monitoring solutions.
