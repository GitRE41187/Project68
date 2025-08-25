-- Robot Control Lab Database Setup Script
-- Run this script in MySQL to create the database and tables manually

-- Create database
CREATE DATABASE IF NOT EXISTS robot_lab_db;
USE robot_lab_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    userType ENUM('student', 'teacher', 'researcher', 'admin') NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    isActive BOOLEAN DEFAULT TRUE,
    lastLogin TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Labs table
CREATE TABLE IF NOT EXISTS labs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    capacity INT DEFAULT 4,
    status ENUM('available', 'maintenance', 'occupied') DEFAULT 'available',
    equipment TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings table
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
);

-- Robot executions table
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
);

-- Camera sessions table
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
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ipAddress VARCHAR(45),
    userAgent TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default labs
INSERT IGNORE INTO labs (id, name, description, capacity, status) VALUES
(1, 'ห้องปฏิบัติการ A', 'ห้องปฏิบัติการควบคุมหุ่นยนต์พื้นฐาน', 4, 'available'),
(2, 'ห้องปฏิบัติการ B', 'ห้องปฏิบัติการควบคุมหุ่นยนต์ขั้นสูง', 6, 'available'),
(3, 'ห้องปฏิบัติการ C', 'ห้องปฏิบัติการทดสอบระบบ', 4, 'maintenance'),
(4, 'ห้องปฏิบัติการ D', 'ห้องปฏิบัติการวิจัย', 8, 'available');

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (id, firstName, lastName, email, phone, userType, password) VALUES
(1, 'Admin', 'System', 'admin@robotlab.com', '0812345678', 'admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzqKqK');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_bookings_user_date ON bookings(userId, bookingDate);
CREATE INDEX idx_bookings_lab_date ON bookings(labId, bookingDate);
CREATE INDEX idx_robot_executions_user ON robot_executions(userId);
CREATE INDEX idx_camera_sessions_user ON camera_sessions(userId);
CREATE INDEX idx_activity_logs_user ON activity_logs(userId);
CREATE INDEX idx_activity_logs_created ON activity_logs(createdAt);

-- Show created tables
SHOW TABLES;

-- Show table structures
DESCRIBE users;
DESCRIBE labs;
DESCRIBE bookings;
DESCRIBE robot_executions;
DESCRIBE camera_sessions;
DESCRIBE activity_logs;
