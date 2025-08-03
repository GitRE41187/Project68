const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'robot_lab_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database tables
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Create users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstName VARCHAR(100) NOT NULL,
                lastName VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20),
                userType ENUM('student', 'teacher', 'researcher', 'other') NOT NULL,
                password VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create bookings table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                bookingDate DATE NOT NULL,
                startTime TIME NOT NULL,
                duration INT NOT NULL,
                purpose TEXT,
                status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Create robot_executions table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS robot_executions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                code TEXT NOT NULL,
                status ENUM('running', 'completed', 'failed') DEFAULT 'running',
                result TEXT,
                executionTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Create sessions table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                token VARCHAR(500) NOT NULL,
                expiresAt TIMESTAMP NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        connection.release();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Check if session exists in database
        const connection = await pool.getConnection();
        const [sessions] = await connection.execute(
            'SELECT * FROM sessions WHERE token = ? AND expiresAt > NOW()',
            [token]
        );
        connection.release();

        if (sessions.length === 0) {
            return res.status(401).json({ message: 'Invalid or expired session' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

// Routes

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, userType, password, confirmPassword } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !userType || !password) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'รหัสผ่านไม่ตรงกัน' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' });
        }

        // Check if email already exists
        const connection = await pool.getConnection();
        const [existingUsers] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            connection.release();
            return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert new user
        const [result] = await connection.execute(
            'INSERT INTO users (firstName, lastName, email, phone, userType, password) VALUES (?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, phone, userType, hashedPassword]
        );

        connection.release();

        res.status(201).json({ 
            message: 'สมัครสมาชิกสำเร็จ',
            userId: result.insertId 
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'กรุณากรอกอีเมลและรหัสผ่าน' });
        }

        // Find user
        const connection = await pool.getConnection();
        const [users] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            connection.release();
            return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        const user = users[0];

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            connection.release();
            return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        // Generate JWT token
        const expiresIn = rememberMe ? '7d' : '24h';
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                userType: user.userType 
            }, 
            JWT_SECRET, 
            { expiresIn }
        );

        // Store session in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 7 : 1));

        await connection.execute(
            'INSERT INTO sessions (userId, token, expiresAt) VALUES (?, ?, ?)',
            [user.id, token, expiresAt]
        );

        connection.release();

        // Remove password from response
        delete user.password;

        res.json({
            message: 'เข้าสู่ระบบสำเร็จ',
            token,
            user
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
    }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        const connection = await pool.getConnection();
        await connection.execute(
            'DELETE FROM sessions WHERE token = ?',
            [token]
        );
        connection.release();

        res.json({ message: 'ออกจากระบบสำเร็จ' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการออกจากระบบ' });
    }
});

app.get('/api/auth/verify', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [users] = await connection.execute(
            'SELECT id, firstName, lastName, email, phone, userType, createdAt FROM users WHERE id = ?',
            [req.user.userId]
        );
        connection.release();

        if (users.length === 0) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
        }

        res.json({ user: users[0] });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบ' });
    }
});

// Booking routes
app.post('/api/booking/create', authenticateToken, async (req, res) => {
    try {
        const { bookingDate, startTime, duration, purpose } = req.body;
        const userId = req.user.userId;

        // Validation
        if (!bookingDate || !startTime || !duration) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลการจองให้ครบถ้วน' });
        }

        // Check for conflicting bookings
        const connection = await pool.getConnection();
        const [conflictingBookings] = await connection.execute(
            `SELECT * FROM bookings 
             WHERE bookingDate = ? 
             AND status IN ('pending', 'confirmed')
             AND (
                 (startTime <= ? AND startTime + INTERVAL duration MINUTE > ?) OR
                 (startTime < ? + INTERVAL ? MINUTE AND startTime + INTERVAL duration MINUTE >= ? + INTERVAL ? MINUTE) OR
                 (startTime >= ? AND startTime + INTERVAL duration MINUTE <= ? + INTERVAL ? MINUTE)
             )`,
            [bookingDate, startTime, startTime, startTime, duration, startTime, duration, startTime, startTime, duration]
        );

        if (conflictingBookings.length > 0) {
            connection.release();
            return res.status(400).json({ message: 'มีผู้จองในช่วงเวลานี้แล้ว' });
        }

        // Create booking
        const [result] = await connection.execute(
            'INSERT INTO bookings (userId, bookingDate, startTime, duration, purpose) VALUES (?, ?, ?, ?, ?)',
            [userId, bookingDate, startTime, duration, purpose]
        );

        connection.release();

        res.status(201).json({
            message: 'จองห้องปฏิบัติการสำเร็จ',
            bookingId: result.insertId
        });

    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการจอง' });
    }
});

app.get('/api/booking/list', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const connection = await pool.getConnection();
        
        const [bookings] = await connection.execute(
            `SELECT b.*, u.firstName, u.lastName 
             FROM bookings b 
             JOIN users u ON b.userId = u.id 
             WHERE b.userId = ? 
             ORDER BY b.bookingDate DESC, b.startTime DESC`,
            [userId]
        );

        connection.release();
        res.json({ bookings });

    } catch (error) {
        console.error('Booking list error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง' });
    }
});

// Robot control routes
app.post('/api/robot/upload', authenticateToken, async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.userId;

        if (!code) {
            return res.status(400).json({ message: 'กรุณาใส่โค้ด' });
        }

        const connection = await pool.getConnection();
        
        // Record execution
        const [result] = await connection.execute(
            'INSERT INTO robot_executions (userId, code, status) VALUES (?, ?, ?)',
            [userId, code, 'running']
        );

        connection.release();

        // Here you would typically send the code to Raspberry Pi
        // For now, we'll simulate the process

        res.json({
            message: 'อัปโหลดโค้ดสำเร็จ',
            executionId: result.insertId
        });

    } catch (error) {
        console.error('Robot upload error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปโหลดโค้ด' });
    }
});

app.get('/api/robot/status', authenticateToken, async (req, res) => {
    try {
        // Simulate robot status
        res.json({
            robot: 'online',
            camera: 'online',
            connection: 'stable',
            currentUser: req.user.userId
        });
    } catch (error) {
        console.error('Robot status error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงสถานะ' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'ไม่พบหน้าเว็บที่ต้องการ' });
});

// Start server
async function startServer() {
    await initializeDatabase();
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Frontend: http://localhost:${PORT}`);
        console.log(`API: http://localhost:${PORT}/api`);
    });
}

startServer().catch(console.error); 