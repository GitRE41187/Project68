# Project Startup Guide - Robot Control Lab

คู่มือการเริ่มต้นโปรเจค Robot Control Lab แบบครบถ้วน

## 🚀 Quick Start

### 1. Clone Project
```bash
git clone <your-repository-url>
cd Project68
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Setup Environment
```bash
# Copy environment file
cd ../backend
cp env.example .env

# Edit .env with your configuration
nano .env
```

### 4. Start Services
```bash
# Terminal 1: Start backend server
cd backend
npm start

# Terminal 2: Start frontend
cd frontend
npm start
```

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.x or higher
- **Python**: 3.9+ (for Raspberry Pi)
- **MySQL**: 8.0 or higher
- **Git**: Latest version

### Hardware Requirements (for Raspberry Pi)
- **Raspberry Pi 5**: 4GB RAM recommended
- **MicroSD Card**: 32GB Class 10+
- **Power Supply**: 5V/3A USB-C
- **Robot Car Kit**: Motors, sensors, camera

## ⚙️ Detailed Setup

### Backend Setup

#### 1. Database Configuration
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE robot_lab_db;
USE robot_lab_db;

# Import schema
mysql -u root -p robot_lab_db < setup-database.sql
```

#### 2. Environment Variables
```bash
# backend/.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=robot_lab_db
JWT_SECRET=your_super_secret_key
RASPBERRY_PI_URL=http://192.168.1.100:5000
PORT=3001
NODE_ENV=development
```

#### 3. Start Backend Server
```bash
cd backend
npm start
```

**Expected Output:**
```
🚀 Robot Control Lab Backend Server Started!
📍 Port: 3001
🌐 API: http://localhost:3001/api
🔍 Health Check: http://localhost:3001/api/health
✅ Ready to serve React frontend!
```

### Frontend Setup

#### 1. Configuration
```bash
cd frontend
# Proxy is already configured in package.json
# It will forward API calls to http://localhost:3001
```

#### 2. Start Frontend
```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view robot-control-lab-react in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.xxx:3000
```

### Raspberry Pi Setup

#### 1. Flash Raspberry Pi OS
- Download [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
- Flash to MicroSD card
- Enable SSH and configure WiFi

#### 2. Connect to Pi
```bash
ssh pi@raspberry-pi.local
# or
ssh pi@192.168.1.100
```

#### 3. Run Automated Setup
```bash
# Download and run setup script
curl -sSL https://raw.githubusercontent.com/your-repo/Project68/main/raspberry-pi/setup-raspberry-pi.sh | bash

# Or manually download and run
wget https://raw.githubusercontent.com/your-repo/Project68/main/raspberry-pi/setup-raspberry-pi.sh
chmod +x setup-raspberry-pi.sh
./setup-raspberry-pi.sh
```

#### 4. Manual Setup (Alternative)
```bash
# Follow detailed guide in raspberry-pi/RASPBERRY_PI_SETUP.md
cd raspberry-pi
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 raspberry-pi-server.py
```

## 🧪 Testing the System

### 1. Backend Health Check
```bash
curl http://localhost:3001/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Robot Control Lab API is running",
  "services": {
    "mainServer": "online",
    "raspberryPi": "offline",
    "database": "online"
  }
}
```

### 2. Frontend Access
- Open browser to `http://localhost:3000`
- Register a new account
- Login to access the system

### 3. Raspberry Pi Connection
```bash
# Test Pi server
curl http://192.168.1.100:5000/api/robot/status

# Test from main server
curl http://localhost:3001/api/health
```

## 🔧 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check if port is in use
netstat -tlnp | grep 3001

# Check MySQL connection
mysql -u root -p -h localhost

# Check environment variables
cat .env
```

#### Frontend Can't Connect to Backend
```bash
# Check proxy configuration
cat package.json | grep proxy

# Check backend is running
curl http://localhost:3001/api/health

# Check CORS settings in backend
```

#### Raspberry Pi Connection Issues
```bash
# Check Pi IP address
ip addr show

# Check firewall
sudo ufw status

# Test network connectivity
ping 192.168.1.100
```

#### Database Connection Issues
```bash
# Check MySQL service
sudo systemctl status mysql

# Check MySQL user permissions
mysql -u root -p
SHOW GRANTS FOR 'root'@'localhost';

# Test connection
mysql -u root -p -h localhost robot_lab_db
```

### Performance Issues

#### High CPU Usage
```bash
# Check Node.js processes
ps aux | grep node

# Monitor memory usage
htop

# Check for memory leaks
node --inspect server.js
```

#### Slow Database Queries
```bash
# Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

# Check slow queries
SELECT * FROM mysql.slow_log;
```

## 📊 Monitoring

### System Health Dashboard
- Access dashboard at `http://localhost:3000/dashboard`
- Real-time system status monitoring
- Raspberry Pi connection status
- Database health indicators

### Logs
```bash
# Backend logs
tail -f backend/logs/app.log

# Raspberry Pi logs
tail -f ~/robot-control-lab/logs/robot_server.log

# System logs
sudo journalctl -u robot-control-lab -f
```

### Performance Metrics
```bash
# Check system resources
htop
iotop
nethogs

# Check network connections
netstat -tlnp
ss -tlnp
```

## 🔒 Security Checklist

### Network Security
- [ ] Firewall enabled on Pi
- [ ] SSH key authentication
- [ ] Non-default ports (optional)
- [ ] VPN access (recommended)

### Application Security
- [ ] Strong JWT secret
- [ ] HTTPS enabled (production)
- [ ] Input validation
- [ ] Rate limiting
- [ ] SQL injection protection

### Hardware Security
- [ ] GPIO access restricted
- [ ] Emergency stop functionality
- [ ] Physical access control
- [ ] Backup power supply

## 🚀 Production Deployment

### Environment Setup
```bash
# Set production environment
export NODE_ENV=production
export PORT=80
export JWT_SECRET=very_strong_secret_here

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name "robot-control-lab"
pm2 startup
pm2 save
```

### Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## 📈 Scaling Considerations

### Multiple Raspberry Pis
```bash
# Load balancer configuration
upstream pi_servers {
    server 192.168.1.100:5000;
    server 192.168.1.101:5000;
    server 192.168.1.102:5000;
}
```

### Database Scaling
```bash
# Read replicas
# Master-slave replication
# Connection pooling
# Query optimization
```

### Frontend Scaling
```bash
# CDN for static assets
# Browser caching
# Code splitting
# Lazy loading
```

## 🔄 Maintenance

### Regular Tasks
```bash
# Daily
- Check system health
- Monitor logs for errors
- Verify Pi connections

# Weekly
- Database backups
- Log rotation
- Performance monitoring

# Monthly
- Security updates
- Dependency updates
- System optimization
```

### Backup Strategy
```bash
# Database backup
mysqldump -u root -p robot_lab_db > backup_$(date +%Y%m%d).sql

# Code backup
git push origin main
git tag v1.0.0
git push origin v1.0.0

# Pi configuration backup
tar -czf pi_config_$(date +%Y%m%d).tar.gz ~/robot-control-lab/
```

## 📚 Additional Resources

### Documentation
- [Backend API Documentation](backend/README.md)
- [Raspberry Pi Setup Guide](raspberry-pi/RASPBERRY_PI_SETUP.md)
- [Frontend Component Guide](frontend/README.md)

### Community Support
- [Raspberry Pi Forums](https://forums.raspberrypi.com/)
- [Node.js Community](https://nodejs.org/en/community/)
- [React Community](https://reactjs.org/community/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [MySQL Workbench](https://www.mysql.com/products/workbench/) - Database management
- [Raspberry Pi Imager](https://www.raspberrypi.com/software/) - OS flashing

---

## 🎯 Next Steps

1. **Complete Setup**: Follow all setup steps above
2. **Test Functionality**: Verify all components work
3. **Configure Hardware**: Connect robot hardware to Pi
4. **User Training**: Train users on system operation
5. **Monitor & Optimize**: Monitor performance and optimize
6. **Scale Up**: Add more robots and features

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review logs for error messages
3. Check system requirements
4. Verify network connectivity
5. Consult the documentation
6. Create an issue in the project repository

---

**Happy Robot Controlling! 🤖✨**
