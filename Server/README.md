# Robot Control Lab - Backend Server

## 🚀 Overview

This is the backend server for the Robot Control Lab system, built with Node.js, Express, and MySQL. It provides a comprehensive API for managing robot control, lab bookings, user authentication, and camera operations.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with JWT tokens
- Password hashing with bcrypt
- Role-based access control (student, teacher, researcher, admin)
- Session management and activity logging

### 🏢 Lab Management
- Lab availability tracking
- Real-time status updates
- Equipment information management

### 📅 Booking System
- Lab reservation system
- Conflict detection and validation
- Booking status management
- User booking history

### 🤖 Robot Control
- Python code execution tracking
- Robot status monitoring
- Execution history and results
- Integration ready for Raspberry Pi

### 📹 Camera Operations
- Live streaming sessions
- Recording management
- Snapshot capture
- Session tracking

### 📊 Dashboard & Analytics
- User statistics
- System status monitoring
- Activity logging
- Performance metrics

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 8.0+
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Database ORM**: mysql2 (Promise-based)
- **CORS**: Cross-Origin Resource Sharing enabled

## 📋 Prerequisites

- Node.js 16+ 
- MySQL 8.0+
- npm or yarn package manager

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Project68/Server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE robot_lab_db;
USE robot_lab_db;
```

### 4. Environment Configuration
Create a `.env` file in the Server directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=robot_lab_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# Optional: Raspberry Pi Integration
# RASPBERRY_PI_URL=http://localhost:5000
```

### 5. Start the server
```bash
npm start
# or
npm run server
```

## 🗄️ Database Schema

### Users Table
- User authentication and profile information
- Role-based access control
- Activity tracking

### Labs Table
- Laboratory information and status
- Equipment details
- Capacity and availability

### Bookings Table
- Lab reservation system
- Time slot management
- Status tracking

### Robot Executions Table
- Code execution history
- Robot control tracking
- Performance metrics

### Camera Sessions Table
- Streaming and recording sessions
- File management
- Session tracking

### Activity Logs Table
- User activity monitoring
- System audit trail
- Security logging

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

### Dashboard
- `GET /api/dashboard/stats` - User statistics
- `GET /api/dashboard/activities` - Recent activities

### Labs
- `GET /api/labs` - List all labs

### Bookings
- `POST /api/booking/create` - Create new booking
- `GET /api/booking/list` - User's bookings
- `PUT /api/booking/:id/cancel` - Cancel booking

### Robot Control
- `POST /api/robot/execute` - Execute robot code
- `POST /api/robot/stop` - Stop robot execution
- `GET /api/robot/executions` - Execution history

### Camera
- `POST /api/camera/start-stream` - Start streaming
- `POST /api/camera/stop-stream` - Stop streaming
- `POST /api/camera/snapshot` - Take snapshot

### History
- `GET /api/history` - User activity history

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- SQL injection prevention
- Activity logging and monitoring

## 📱 Frontend Integration

The backend is designed to work seamlessly with the React frontend:
- CORS configured for React development server
- JWT token management
- Real-time data synchronization
- Responsive API design

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Test Authentication
```bash
# Register a new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "0812345678",
    "userType": "student",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🚀 Deployment

### Production Considerations
1. Change JWT secret
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Set up proper CORS origins
5. Configure database connection pooling
6. Set up logging and monitoring
7. Enable rate limiting
8. Set up backup and recovery

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔧 Configuration

### Database Connection
The server automatically creates all necessary tables on startup. Make sure your MySQL server is running and accessible.

### JWT Tokens
- Default expiration: 24 hours
- Remember me: 7 days
- Configurable via environment variables

### CORS Settings
- Frontend origin: http://localhost:3000 (development)
- Credentials: enabled
- Configurable via environment variables

## 📊 Monitoring

### Health Endpoint
- `GET /api/health` - Server status and version

### Activity Logging
- All user actions are logged
- Database queries are monitored
- Error tracking and reporting

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL service status
   - Verify database credentials
   - Ensure database exists

2. **JWT Token Issues**
   - Check token expiration
   - Verify JWT secret
   - Check token format

3. **CORS Errors**
   - Verify frontend URL in configuration
   - Check CORS middleware setup

4. **Port Already in Use**
   - Change PORT in environment variables
   - Kill existing process on port 3001

### Logs
- Check console output for errors
- Database connection logs
- API request/response logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API endpoints
- Check the troubleshooting section
- Create an issue in the repository

## 🔮 Future Enhancements

- Real-time WebSocket support
- Advanced robot control features
- Enhanced security features
- Performance optimization
- API rate limiting
- Advanced analytics and reporting
