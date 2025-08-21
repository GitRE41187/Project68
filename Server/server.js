const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

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
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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
                avatar VARCHAR(255),
                isActive BOOLEAN DEFAULT TRUE,
                lastLogin TIMESTAMP NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create labs table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS labs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                capacity INT DEFAULT 4,
                status ENUM('available', 'maintenance', 'occupied') DEFAULT 'available',
                equipment TEXT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create bookings table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                labId INT NOT NULL,
                bookingDate DATE NOT NULL,
                startTime TIME NOT NULL,
                duration INT NOT NULL,
                purpose TEXT,
                status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (labId) REFERENCES labs(id) ON DELETE CASCADE
            )
        `);

        // Create robot_executions table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS robot_executions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                labId INT NOT NULL,
                code TEXT NOT NULL,
                status ENUM('running', 'completed', 'failed', 'stopped') DEFAULT 'running',
                result TEXT,
                executionTime INT DEFAULT 0,
                startedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completedAt TIMESTAMP NULL,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (labId) REFERENCES labs(id) ON DELETE CASCADE
            )
        `);

        // Create camera_sessions table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS camera_sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                labId INT NOT NULL,
                sessionType ENUM('stream', 'recording', 'snapshot') NOT NULL,
                status ENUM('active', 'completed', 'failed') DEFAULT 'active',
                startTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                endTime TIMESTAMP NULL,
                duration INT DEFAULT 0,
                filePath VARCHAR(255),
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (labId) REFERENCES labs(id) ON DELETE CASCADE
            )
        `);

        // Create activity_logs table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS activity_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                action VARCHAR(100) NOT NULL,
                details TEXT,
                ipAddress VARCHAR(45),
                userAgent TEXT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Insert default labs if they don't exist
        await connection.execute(`
            INSERT IGNORE INTO labs (id, name, description, capacity, status) VALUES
            (1, 'ห้องปฏิบัติการ A', 'ห้องปฏิบัติการควบคุมหุ่นยนต์พื้นฐาน', 4, 'available'),
            (2, 'ห้องปฏิบัติการ B', 'ห้องปฏิบัติการควบคุมหุ่นยนต์ขั้นสูง', 6, 'available'),
            (3, 'ห้องปฏิบัติการ C', 'ห้องปฏิบัติการทดสอบระบบ', 4, 'maintenance'),
            (4, 'ห้องปฏิบัติการ D', 'ห้องปฏิบัติการวิจัย', 8, 'available')
        `);

        // Insert default admin user if it doesn't exist
        const [adminUsers] = await connection.execute('SELECT id FROM users WHERE email = ?', ['admin@robotlab.com']);
        if (adminUsers.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 12);
            await connection.execute(`
                INSERT INTO users (firstName, lastName, email, phone, userType, password) VALUES
                ('Admin', 'System', 'admin@robotlab.com', '0812345678', 'other', ?)
            `, [hashedPassword]);
        }

        connection.release();
        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
}

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Access token required' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ 
            success: false,
            message: 'Invalid or expired token' 
        });
    }
};

// Log activity middleware
const logActivity = async (userId, action, details = null, req = null) => {
    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'INSERT INTO activity_logs (userId, action, details, ipAddress, userAgent) VALUES (?, ?, ?, ?, ?)',
            [
                userId, 
                action, 
                details, 
                req?.ip || null, 
                req?.headers['user-agent'] || null
            ]
        );
        connection.release();
    } catch (error) {
        console.error('Activity logging error:', error);
    }
};

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Robot Control Lab API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, userType, password, confirmPassword } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !userType || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน' 
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false,
                message: 'รหัสผ่านไม่ตรงกัน' 
            });
        }

        if (password.length < 8) {
            return res.status(400).json({ 
                success: false,
                message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' 
            });
        }

        // Check if email already exists
        const connection = await pool.getConnection();
        const [existingUsers] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            connection.release();
            return res.status(400).json({ 
                success: false,
                message: 'อีเมลนี้ถูกใช้งานแล้ว' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert new user
        const [result] = await connection.execute(
            'INSERT INTO users (firstName, lastName, email, phone, userType, password) VALUES (?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, phone, userType, hashedPassword]
        );

        connection.release();

        // Log activity
        await logActivity(result.insertId, 'user_registered', 'New user registration');

        res.status(201).json({ 
            success: true,
            message: 'สมัครสมาชิกสำเร็จ',
            userId: result.insertId 
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' 
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'กรุณากรอกอีเมลและรหัสผ่าน' 
            });
        }

        // Find user
        const connection = await pool.getConnection();
        const [users] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            connection.release();
            return res.status(401).json({ 
                success: false,
                message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' 
            });
        }

        const user = users[0];

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            connection.release();
            return res.status(401).json({ 
                success: false,
                message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' 
            });
        }

        // Update last login (skip for now since column doesn't exist)
        // await connection.execute(
        //     'UPDATE users SET lastLogin = NOW() WHERE id = ?',
        //     [user.id]
        // );

        // Generate JWT token
        const expiresIn = rememberMe ? '7d' : '24h';
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                userType: user.userType || 'other',
                firstName: user.firstName,
                lastName: user.lastName
            }, 
            JWT_SECRET, 
            { expiresIn }
        );

        connection.release();

        // Remove password from response
        delete user.password;

        // Log activity
        await logActivity(user.id, 'user_login', 'User logged in successfully');

        res.json({
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ',
            token,
            user
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' 
        });
    }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
    try {
        // Log activity
        await logActivity(req.user.userId, 'user_logout', 'User logged out');

        res.json({ 
            success: true,
            message: 'ออกจากระบบสำเร็จ' 
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการออกจากระบบ' 
        });
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
            return res.status(404).json({ 
                success: false,
                message: 'ไม่พบผู้ใช้' 
            });
        }

        res.json({ 
            success: true,
            user: users[0] 
        });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการตรวจสอบ' 
        });
    }
});

// Dashboard routes
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        // Get user's booking count
        const [userBookings] = await connection.execute(
            'SELECT COUNT(*) as count FROM bookings WHERE userId = ? AND status IN ("confirmed", "completed")',
            [req.user.userId]
        );

        // Get user's robot executions count
        const [userExecutions] = await connection.execute(
            'SELECT COUNT(*) as count FROM robot_executions WHERE userId = ?',
            [req.user.userId]
        );

        // Get total active users
        const [totalUsers] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE isActive = TRUE');
        
        // Get today's bookings
        const today = new Date().toISOString().split('T')[0];
        const [todayBookings] = await connection.execute(
            'SELECT COUNT(*) as count FROM bookings WHERE bookingDate = ? AND status = "confirmed"',
            [today]
        );

        connection.release();

        res.json({
            success: true,
            stats: {
                userBookings: userBookings[0].count,
                userExecutions: userExecutions[0].count,
                totalUsers: totalUsers[0].count,
                todayBookings: todayBookings[0].count,
                systemStatus: 'online',
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ' 
        });
    }
});

// Lab routes
app.get('/api/labs', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [labs] = await connection.execute(`
            SELECT 
                l.*,
                COUNT(b.id) as currentBookings
            FROM labs l
            LEFT JOIN bookings b ON l.id = b.labId 
                AND b.bookingDate = CURDATE() 
                AND b.status IN ('confirmed', 'pending')
            GROUP BY l.id
            ORDER BY l.name
        `);
        connection.release();

        res.json({
            success: true,
            labs: labs
        });
    } catch (error) {
        console.error('Labs fetch error:', error);
        res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลห้องปฏิบัติการ' 
        });
    }
});

// Booking routes
app.post('/api/booking/create', authenticateToken, async (req, res) => {
    try {
        const { labId, bookingDate, startTime, duration, purpose } = req.body;
        const userId = req.user.userId;

        // Validation
        if (!labId || !bookingDate || !startTime || !duration) {
            return res.status(400).json({ 
                success: false,
                message: 'กรุณากรอกข้อมูลการจองให้ครบถ้วน' 
            });
        }

        // Check if lab exists and is available
        const connection = await pool.getConnection();
        const [labs] = await connection.execute(
            'SELECT * FROM labs WHERE id = ? AND status = "available"',
            [labId]
        );

        if (labs.length === 0) {
            connection.release();
            return res.status(400).json({ 
                success: false,
                message: 'ห้องปฏิบัติการไม่พร้อมใช้งาน' 
            });
        }

        // Create booking
        const [result] = await connection.execute(
            'INSERT INTO bookings (userId, labId, bookingDate, startTime, duration, purpose) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, labId, bookingDate, startTime, duration, purpose]
        );

        connection.release();

        // Log activity
        await logActivity(userId, 'booking_created', `Created booking for lab ${labId} on ${bookingDate}`);

        res.status(201).json({
            success: true,
            message: 'จองห้องปฏิบัติการสำเร็จ',
            bookingId: result.insertId
        });

    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการจอง' 
        });
    }
});

app.get('/api/booking/list', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const connection = await pool.getConnection();
        
        const [bookings] = await connection.execute(`
            SELECT 
                b.*,
                l.name as labName,
                l.description as labDescription,
                CONCAT(u.firstName, ' ', u.lastName) as userName
            FROM bookings b 
            JOIN labs l ON b.labId = l.id
            JOIN users u ON b.userId = u.id
            WHERE b.userId = ? 
            ORDER BY b.bookingDate DESC, b.startTime DESC`,
            [userId]
        );

        connection.release();
        res.json({ 
            success: true,
            bookings: bookings 
        });

    } catch (error) {
        console.error('Booking list error:', error);
        res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการจอง' 
        });
    }
});

// Robot control routes
app.post('/api/robot/execute', authenticateToken, async (req, res) => {
    try {
        const { code, labId } = req.body;
        const userId = req.user.userId;

        if (!code || !labId) {
            return res.status(400).json({ 
                success: false,
                message: 'กรุณาใส่โค้ดและเลือกห้องปฏิบัติการ' 
            });
        }

        const connection = await pool.getConnection();
        
        // Record execution
        const [result] = await connection.execute(
            'INSERT INTO robot_executions (userId, labId, code, status) VALUES (?, ?, ?, ?)',
            [userId, labId, code, 'running']
        );

        connection.release();

        // Log activity
        await logActivity(userId, 'robot_code_executed', `Executed robot code in lab ${labId}`);

        // Simulate robot execution
        setTimeout(async () => {
            try {
                const connection = await pool.getConnection();
                await connection.execute(
                    'UPDATE robot_executions SET status = "completed", completedAt = NOW(), executionTime = 5 WHERE id = ?',
                    [result.insertId]
                );
                connection.release();
            } catch (error) {
                console.error('Error updating execution status:', error);
            }
        }, 5000);

        res.json({
            success: true,
            message: 'เริ่มรันโค้ดบนหุ่นยนต์แล้ว',
            executionId: result.insertId,
            status: 'running'
        });

    } catch (error) {
        console.error('Robot execution error:', error);
        res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการรันโค้ด' 
        });
    }
});

// Camera routes
app.post('/api/camera/start-stream', authenticateToken, async (req, res) => {
    try {
        const { labId } = req.body;
        const userId = req.user.userId;

        if (!labId) {
            return res.status(400).json({ 
                success: false,
                message: 'กรุณาเลือกห้องปฏิบัติการ' 
            });
        }

        const connection = await pool.getConnection();
        
        // Create camera session
        const [result] = await connection.execute(
            'INSERT INTO camera_sessions (userId, labId, sessionType, status) VALUES (?, ?, ?, ?)',
            [userId, labId, 'stream', 'active']
        );

        connection.release();

        // Log activity
        await logActivity(userId, 'camera_stream_started', `Started camera stream in lab ${labId}`);

        res.json({
            success: true,
            message: 'เริ่มการถ่ายทอดสดแล้ว',
            sessionId: result.insertId,
            streamUrl: `/api/camera/stream/${result.insertId}`
        });

    } catch (error) {
        console.error('Camera stream start error:', error);
        res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการเริ่มการถ่ายทอดสด' 
        });
    }
});

// History routes
app.get('/api/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { type, date, search } = req.query;
        
        const connection = await pool.getConnection();
        
        let whereClause = 'WHERE userId = ?';
        let params = [userId];

        if (type && type !== 'all') {
            whereClause += ' AND type = ?';
            params.push(type);
        }

        if (date) {
            whereClause += ' AND DATE(createdAt) = ?';
            params.push(date);
        }

        if (search) {
            whereClause += ' AND (action LIKE ? OR details LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [activities] = await connection.execute(`
            SELECT 
                id,
                action,
                details,
                createdAt,
                'activity' as type
            FROM activity_logs 
            ${whereClause}
            ORDER BY createdAt DESC
            LIMIT 100
        `, params);

        connection.release();

        res.json({
            success: true,
            activities: activities
        });

    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประวัติ' 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'ไม่พบ API endpoint ที่ต้องการ' 
    });
});

// Start server
async function startServer() {
    await initializeDatabase();
    
    app.listen(PORT, () => {
        console.log('🚀 Robot Control Lab Backend Server Started!');
        console.log(`📍 Port: ${PORT}`);
        console.log(`🌐 API: http://localhost:${PORT}/api`);
        console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
        console.log('✅ Ready to serve React frontend!');
    });
}

startServer().catch(console.error);
