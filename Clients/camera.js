// Camera Control Module
class CameraController {
    constructor() {
        this.isRecording = false;
        this.isStreaming = false;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Range slider value updates
        document.getElementById('brightness')?.addEventListener('input', function() {
            document.getElementById('brightnessValue').textContent = this.value;
        });

        document.getElementById('contrast')?.addEventListener('input', function() {
            document.getElementById('contrastValue').textContent = this.value;
        });

        document.getElementById('saturation')?.addEventListener('input', function() {
            document.getElementById('saturationValue').textContent = this.value;
        });
    }

    startCamera() {
        const placeholder = document.getElementById('cameraPlaceholder');
        const video = document.getElementById('cameraVideo');
        const status = document.getElementById('cameraStatus');
        
        status.textContent = 'กำลังเชื่อมต่อ...';
        
        setTimeout(() => {
            placeholder.style.display = 'none';
            video.style.display = 'block';
            status.textContent = 'เชื่อมต่อแล้ว';
            this.isStreaming = true;
            
            // Simulate video stream
            video.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJhc3BiZXJyeSBQaSBDYW1lcmE8L3RleHQ+PC9zdmc+';
            
            this.showAlert('เริ่มการถ่ายทอดกล้อง', 'success');
        }, 2000);
    }

    cameraUp() {
        if (this.isStreaming) {
            this.showAlert('กล้องเลื่อนขึ้น', 'info');
        }
    }

    cameraDown() {
        if (this.isStreaming) {
            this.showAlert('กล้องเลื่อนลง', 'info');
        }
    }

    cameraLeft() {
        if (this.isStreaming) {
            this.showAlert('กล้องเลื่อนซ้าย', 'info');
        }
    }

    cameraRight() {
        if (this.isStreaming) {
            this.showAlert('กล้องเลื่อนขวา', 'info');
        }
    }

    cameraStop() {
        if (this.isStreaming) {
            this.showAlert('กล้องหยุด', 'info');
        }
    }

    startRecording() {
        if (!this.isStreaming) {
            this.showAlert('กรุณาเริ่มการถ่ายทอดก่อน', 'warning');
            return;
        }

        this.isRecording = true;
        document.getElementById('recordingIndicator').classList.add('recording');
        document.querySelector('button[onclick="cameraController.startRecording()"]').disabled = true;
        document.querySelector('button[onclick="cameraController.stopRecording()"]').disabled = false;
        
        this.showAlert('เริ่มบันทึกวิดีโอ', 'success');
    }

    stopRecording() {
        this.isRecording = false;
        document.getElementById('recordingIndicator').classList.remove('recording');
        document.querySelector('button[onclick="cameraController.startRecording()"]').disabled = false;
        document.querySelector('button[onclick="cameraController.stopRecording()"]').disabled = true;
        
        this.showAlert('หยุดบันทึกวิดีโอ', 'info');
    }

    takeSnapshot() {
        if (!this.isStreaming) {
            this.showAlert('กรุณาเริ่มการถ่ายทอดก่อน', 'warning');
            return;
        }

        this.showAlert('ถ่ายภาพสำเร็จ', 'success');
    }

    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alertContainer') || this.createAlertContainer();
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        alertContainer.appendChild(alert);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 3000);
    }

    createAlertContainer() {
        const container = document.createElement('div');
        container.id = 'alertContainer';
        container.className = 'position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1055';
        document.body.appendChild(container);
        return container;
    }
}

// Initialize camera controller when DOM is loaded
let cameraController;

document.addEventListener('DOMContentLoaded', function() {
    cameraController = new CameraController();
    
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
    }
    
    // Update user interface
    auth.updateUserInterface();
    
    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
    });
});

// Make functions globally available for onclick handlers
window.startCamera = function() { cameraController.startCamera(); };
window.cameraUp = function() { cameraController.cameraUp(); };
window.cameraDown = function() { cameraController.cameraDown(); };
window.cameraLeft = function() { cameraController.cameraLeft(); };
window.cameraRight = function() { cameraController.cameraRight(); };
window.cameraStop = function() { cameraController.cameraStop(); };
window.startRecording = function() { cameraController.startRecording(); };
window.stopRecording = function() { cameraController.stopRecording(); };
window.takeSnapshot = function() { cameraController.takeSnapshot(); }; 