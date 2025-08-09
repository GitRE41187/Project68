#!/bin/bash

# Raspberry Pi Robot Control Setup Script
# This script sets up the Raspberry Pi for robot control

echo "Setting up Raspberry Pi Robot Control System..."

# Update system
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Python and pip
echo "Installing Python and pip..."
sudo apt-get install -y python3 python3-pip python3-venv

# Install GPIO library
echo "Installing GPIO library..."
sudo apt-get install -y python3-rpi.gpio

# Install other required packages
echo "Installing additional packages..."
sudo apt-get install -y git curl wget

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv robot_env
source robot_env/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create systemd service for auto-start
echo "Creating systemd service..."
sudo tee /etc/systemd/system/robot-control.service > /dev/null <<EOF
[Unit]
Description=Robot Control Server
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/robot-control
Environment=PATH=/home/pi/robot-control/robot_env/bin
ExecStart=/home/pi/robot-control/robot_env/bin/python raspberry-pi-server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
echo "Enabling and starting robot control service..."
sudo systemctl daemon-reload
sudo systemctl enable robot-control.service
sudo systemctl start robot-control.service

# Configure firewall
echo "Configuring firewall..."
sudo ufw allow 5000/tcp

# Create log directory
echo "Creating log directory..."
mkdir -p /home/pi/robot-control/logs

# Set permissions
echo "Setting permissions..."
chmod +x raspberry-pi-server.py
chmod +x setup-raspberry-pi.sh

echo "Setup completed successfully!"
echo "Robot control server is running on port 5000"
echo "To check status: sudo systemctl status robot-control.service"
echo "To view logs: sudo journalctl -u robot-control.service -f"
