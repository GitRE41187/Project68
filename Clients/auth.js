// Authentication and Session Management
class AuthManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkSession();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Password strength checker
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => this.handleLogout(e));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe')?.checked || false;

        try {
            this.showLoading('กำลังเข้าสู่ระบบ...');
            
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, rememberMe })
            });

            const data = await response.json();

            if (response.ok) {
                this.setSession(data.token, data.user);
                this.showAlert('เข้าสู่ระบบสำเร็จ!', 'success');
                setTimeout(() => {
                    window.location.href = 'main-menu.html';
                }, 1500);
            } else {
                this.showAlert(data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 'danger');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            userType: document.getElementById('userType').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value
        };

        // Validation
        if (formData.password !== formData.confirmPassword) {
            this.showAlert('รหัสผ่านไม่ตรงกัน', 'danger');
            return;
        }

        if (formData.password.length < 8) {
            this.showAlert('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร', 'danger');
            return;
        }

        try {
            this.showLoading('กำลังสมัครสมาชิก...');
            
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                this.showAlert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                this.showAlert(data.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก', 'danger');
            }
        } catch (error) {
            console.error('Register error:', error);
            this.showAlert('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'danger');
        } finally {
            this.hideLoading();
        }
    }

    async handleLogout(e) {
        e.preventDefault();
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });

            this.clearSession();
            this.showAlert('ออกจากระบบสำเร็จ', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } catch (error) {
            console.error('Logout error:', error);
            this.clearSession();
            window.location.href = 'login.html';
        }
    }

    async checkSession() {
        const token = this.getToken();
        if (!token) {
            this.redirectToLogin();
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
                this.updateUserInterface();
            } else {
                this.clearSession();
                this.redirectToLogin();
            }
        } catch (error) {
            console.error('Session check error:', error);
            this.clearSession();
            this.redirectToLogin();
        }
    }

    setSession(token, user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser = user;
    }

    getToken() {
        return localStorage.getItem('authToken');
    }

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    clearSession() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.currentUser = null;
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    redirectToLogin() {
        if (!window.location.pathname.includes('login.html') && 
            !window.location.pathname.includes('register.html')) {
            window.location.href = 'login.html';
        }
    }

    updateUserInterface() {
        const user = this.getUser();
        if (!user) return;

        // Update user info in navbar
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = `${user.firstName} ${user.lastName}`;
        }

        const userTypeElement = document.getElementById('userType');
        if (userTypeElement) {
            const userTypes = {
                'student': 'นักเรียน/นักศึกษา',
                'teacher': 'ครู/อาจารย์',
                'researcher': 'นักวิจัย',
                'other': 'อื่นๆ'
            };
            userTypeElement.textContent = userTypes[user.userType] || user.userType;
        }

        // Show/hide elements based on authentication
        const authElements = document.querySelectorAll('.auth-required');
        authElements.forEach(el => el.style.display = 'block');

        const guestElements = document.querySelectorAll('.guest-only');
        guestElements.forEach(el => el.style.display = 'none');
    }

    checkPasswordStrength(password) {
        const strengthElement = document.getElementById('passwordStrength');
        if (!strengthElement) return;

        let strength = 0;
        let message = '';

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        switch (strength) {
            case 0:
            case 1:
                message = '<span class="strength-weak">รหัสผ่านอ่อน</span>';
                break;
            case 2:
            case 3:
                message = '<span class="strength-medium">รหัสผ่านปานกลาง</span>';
                break;
            case 4:
            case 5:
                message = '<span class="strength-strong">รหัสผ่านแข็งแกร่ง</span>';
                break;
        }

        strengthElement.innerHTML = message;
    }

    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) return;

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        alertContainer.appendChild(alertDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    showLoading(message = 'กำลังโหลด...') {
        const button = document.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = true;
            button.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ${message}
            `;
        }
    }

    hideLoading() {
        const button = document.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = false;
            if (window.location.pathname.includes('login.html')) {
                button.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>เข้าสู่ระบบ';
            } else if (window.location.pathname.includes('register.html')) {
                button.innerHTML = '<i class="fas fa-user-plus me-2"></i>สมัครสมาชิก';
            }
        }
    }

    // API helper methods
    async apiRequest(endpoint, options = {}) {
        const token = this.getToken();
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        return response;
    }
}

// Initialize authentication manager
const auth = new AuthManager();

// Export for use in other files
window.auth = auth; 