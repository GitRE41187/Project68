module.exports = {
    // Database Configuration
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'robot_lab_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    },

    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
        expiresIn: '24h',
        rememberMeExpiresIn: '7d'
    },

    // Server Configuration
    server: {
        port: process.env.PORT || 3001,
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
    },

    // Optional: Raspberry Pi Integration
    raspberryPi: {
        url: process.env.RASPBERRY_PI_URL || 'http://localhost:5000'
    }
};
