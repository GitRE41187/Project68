# 🚀 Robot Control Lab - Complete Startup Guide

## 📋 Prerequisites

Before starting the system, ensure you have the following installed:

### Required Software
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **MySQL** 8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git** (optional, for version control)

### System Requirements
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: At least 2GB free space
- **OS**: Windows 10+, macOS 10.14+, or Linux

## 🗄️ Database Setup

### 1. Start MySQL Server
```bash
# Windows (if installed as service)
# MySQL should start automatically

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### 2. Create Database
```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE robot_lab_db;
USE robot_lab_db;

# Exit MySQL
EXIT;
```

### 3. Alternative: Use Setup Script
```bash
# Run the setup script
mysql -u root -p < Server/setup-database.sql
```

## 🔧 Backend Setup

### 1. Install Dependencies
```bash
# Navigate to project root
cd Project68

# Install all dependencies (frontend + backend)
npm install
```

### 2. Configure Environment
Create a `.env` file in the Server directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=robot_lab_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Start Backend Server
```bash
# Option 1: Using npm script
npm run server

# Option 2: Direct command
cd Server
npm start

# Option 3: Windows batch file
start-backend.bat

# Option 4: PowerShell script
.\start-backend.ps1
```

**Expected Output:**
```
🚀 Robot Control Lab Backend Server Started!
📍 Port: 3001
🌐 API: http://localhost:3001/api
🔍 Health Check: http://localhost:3001/api/health
✅ Ready to serve React frontend!
✅ Database initialized successfully
```

## 🎨 Frontend Setup

### 1. Start React Development Server
```bash
# In a new terminal, from project root
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view robot-control-lab-react in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
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
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 2. Frontend Access
- Open browser: `http://localhost:3000`
- You should see the login page

### 3. Test User Registration
- Click "สมัครสมาชิก" (Register)
- Fill in the form with test data
- Submit and verify success message

### 4. Test User Login
- Use the credentials from registration
- Verify successful login and redirect to main menu

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using port 3001
netstat -ano | findstr :3001

# Kill the process
taskkill /PID <process_id> /F
```

#### 2. Database Connection Error
```bash
# Check MySQL status
mysql -u root -p -e "SELECT 1;"

# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"
```

#### 3. CORS Errors
- Ensure backend is running on port 3001
- Check frontend proxy setting in package.json
- Verify CORS configuration in server.js

#### 4. JWT Token Issues
- Check JWT_SECRET in .env file
- Verify token expiration settings
- Check browser console for token errors

### Error Logs

#### Backend Logs
- Check terminal where backend is running
- Look for error messages and stack traces
- Verify database connection logs

#### Frontend Logs
- Open browser Developer Tools (F12)
- Check Console tab for errors
- Check Network tab for failed API calls

## 📱 System Features

### Available Pages
1. **Login/Register** - User authentication
2. **Main Menu** - Navigation hub
3. **Dashboard** - System overview and statistics
4. **Lab Booking** - Reserve laboratory time
5. **Robot Control** - Python code execution
6. **Camera** - Live streaming and recording
7. **History** - Activity logs and tracking
8. **Help** - User manual and support

### Default Admin Account
- **Email**: admin@robotlab.com
- **Password**: admin123
- **Role**: Administrator

## 🚀 Production Deployment

### Environment Variables
```env
# Production settings
NODE_ENV=production
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://yourdomain.com
```

### Security Considerations
1. Change default JWT secret
2. Use strong database passwords
3. Enable HTTPS
4. Set up proper CORS origins
5. Implement rate limiting
6. Set up monitoring and logging

## 📞 Support

### Getting Help
1. Check this startup guide
2. Review error logs
3. Verify all prerequisites
4. Check network connectivity
5. Restart services if needed

### Contact Information
- **Project**: Robot Control Lab
- **Version**: 1.0.0
- **Backend**: Node.js + Express + MySQL
- **Frontend**: React + Bootstrap

## 🎯 Next Steps

After successful startup:
1. **Test all features** - Navigate through all pages
2. **Create test users** - Register different user types
3. **Test lab booking** - Make test reservations
4. **Test robot control** - Execute sample Python code
5. **Test camera features** - Start streaming sessions
6. **Review logs** - Monitor system activity

## ✨ Success Indicators

Your system is running correctly when:
- ✅ Backend shows "Ready to serve React frontend!"
- ✅ Frontend loads without errors
- ✅ Login/Register forms work
- ✅ API calls return successful responses
- ✅ Database tables are created
- ✅ No CORS errors in browser console
- ✅ Both servers show correct ports

---

**🎉 Congratulations! Your Robot Control Lab system is now running successfully!**
