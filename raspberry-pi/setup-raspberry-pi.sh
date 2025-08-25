#!/bin/bash

# Raspberry Pi 5 Setup Script for Robot Control Lab
# This script sets up the Raspberry Pi 5 for running the robot control server

echo "🤖 Setting up Raspberry Pi 5 for Robot Control Lab..."
echo "=================================================="

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "🔧 Installing required packages..."
sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    python3-opencv \
    libatlas-base-dev \
    git \
    curl \
    wget \
    vim \
    htop \
    screen

# Install additional Python packages
echo "🐍 Installing Python dependencies..."
sudo apt install -y \
    python3-dev \
    python3-setuptools \
    python3-wheel \
    python3-numpy \
    python3-pandas \
    python3-matplotlib \
    python3-scipy

# Create project directory
echo "📁 Creating project directory..."
mkdir -p ~/robot-control-lab
cd ~/robot-control-lab

# Create virtual environment
echo "🌍 Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python requirements
echo "📋 Installing Python requirements..."
pip install --upgrade pip
pip install Flask==2.3.3
pip install Flask-CORS==4.0.0
pip install RPi.GPIO==0.7.1
pip install Werkzeug==2.3.7
pip install opencv-python
pip install numpy
pip install requests

# Create systemd service for auto-start
echo "⚙️ Creating systemd service..."
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

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
echo "🚀 Enabling and starting service..."
sudo systemctl daemon-reload
sudo systemctl enable robot-control-lab
sudo systemctl start robot-control-lab

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 5000/tcp
sudo ufw allow ssh
sudo ufw --force enable

# Create log directory
echo "📝 Creating log directory..."
mkdir -p ~/robot-control-lab/logs
chmod 755 ~/robot-control-lab/logs

# Create configuration file
echo "⚙️ Creating configuration file..."
cat > ~/robot-control-lab/config.py <<EOF
# Robot Control Lab Configuration
import os

# Server Configuration
HOST = '0.0.0.0'
PORT = 5000
DEBUG = False

# GPIO Configuration
GPIO_PINS = {
    'LEFT_MOTOR_FORWARD': 17,
    'LEFT_MOTOR_BACKWARD': 18,
    'RIGHT_MOTOR_FORWARD': 27,
    'RIGHT_MOTOR_BACKWARD': 22,
    'LEFT_MOTOR_PWM': 12,
    'RIGHT_MOTOR_PWM': 13,
    'DISTANCE_TRIGGER': 23,
    'DISTANCE_ECHO': 24,
    'LIGHT_SENSOR': 25,
    'STATUS_LED': 26
}

# Robot Configuration
ROBOT_CONFIG = {
    'default_speed': 50,
    'max_speed': 100,
    'min_speed': 0,
    'turn_duration': 0.5,
    'forward_duration': 1.0
}

# Logging Configuration
LOG_LEVEL = 'INFO'
LOG_FILE = 'logs/robot_server.log'
LOG_FORMAT = '%(asctime)s - %(levelname)s - %(message)s'

# Security Configuration
ALLOWED_ORIGINS = ['*']  # Configure based on your network
API_TIMEOUT = 10
MAX_CODE_EXECUTION_TIME = 300  # 5 minutes
EOF

# Create startup script
echo "🚀 Creating startup script..."
cat > ~/robot-control-lab/start.sh <<EOF
#!/bin/bash
cd /home/pi/robot-control-lab
source venv/bin/activate
python3 raspberry-pi-server.py
EOF

chmod +x ~/robot-control-lab/start.sh

# Create monitoring script
echo "📊 Creating monitoring script..."
cat > ~/robot-control-lab/monitor.sh <<EOF
#!/bin/bash
echo "🤖 Robot Control Lab Status"
echo "=========================="
echo "Service Status:"
sudo systemctl status robot-control-lab --no-pager -l
echo ""
echo "Recent Logs:"
tail -20 logs/robot_server.log
echo ""
echo "GPIO Status:"
python3 -c "
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
pins = [17, 18, 27, 22, 12, 13, 23, 24, 25, 26]
for pin in pins:
    try:
        GPIO.setup(pin, GPIO.IN)
        state = GPIO.input(pin)
        print(f'GPIO {pin}: {state}')
    except:
        print(f'GPIO {pin}: Error')
GPIO.cleanup()
"
EOF

chmod +x ~/robot-control-lab/monitor.sh

# Create backup script
echo "💾 Creating backup script..."
cat > ~/robot-control-lab/backup.sh <<EOF
#!/bin/bash
BACKUP_DIR="/home/pi/backups/robot-control-lab"
DATE=\$(date +%Y%m%d_%H%M%S)
mkdir -p \$BACKUP_DIR
tar -czf \$BACKUP_DIR/robot-control-lab_\$DATE.tar.gz \\
    --exclude=venv \\
    --exclude=logs \\
    --exclude=*.pyc \\
    --exclude=__pycache__ \\
    .
echo "Backup created: \$BACKUP_DIR/robot-control-lab_\$DATE.tar.gz"
EOF

chmod +x ~/robot-control-lab/backup.sh

# Set permissions
echo "🔐 Setting permissions..."
chown -R pi:pi ~/robot-control-lab
chmod -R 755 ~/robot-control-lab

# Create alias for easy access
echo "🔗 Creating aliases..."
echo "alias robot-status='~/robot-control-lab/monitor.sh'" >> ~/.bashrc
echo "alias robot-start='sudo systemctl start robot-control-lab'" >> ~/.bashrc
echo "alias robot-stop='sudo systemctl stop robot-control-lab'" >> ~/.bashrc
echo "alias robot-restart='sudo systemctl restart robot-control-lab'" >> ~/.bashrc
echo "alias robot-logs='tail -f ~/robot-control-lab/logs/robot_server.log'" >> ~/.bashrc

# Display completion message
echo ""
echo "✅ Setup completed successfully!"
echo "=================================================="
echo "📁 Project directory: ~/robot-control-lab"
echo "🚀 Service: robot-control-lab (auto-start enabled)"
echo "🌐 Server will run on: http://0.0.0.0:5000"
echo "📝 Logs: ~/robot-control-lab/logs/robot_server.log"
echo ""
echo "🔧 Useful commands:"
echo "  robot-status    - Check service status and GPIO"
echo "  robot-start     - Start the service"
echo "  robot-stop      - Stop the service"
echo "  robot-restart   - Restart the service"
echo "  robot-logs      - View live logs"
echo ""
echo "📋 Next steps:"
echo "1. Copy raspberry-pi-server.py to ~/robot-control-lab/"
echo "2. Configure your network settings"
echo "3. Test the service: robot-status"
echo "4. Check logs: robot-logs"
echo ""
echo "🔄 Rebooting in 10 seconds... (Ctrl+C to cancel)"
sleep 10
sudo reboot
