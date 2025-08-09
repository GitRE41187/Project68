#!/usr/bin/env python3
"""
Raspberry Pi Robot Control Server
Handles robot car control commands and sensor data
"""

import socket
import json
import threading
import time
import logging
from datetime import datetime
import RPi.GPIO as GPIO
from flask import Flask, request, jsonify
from flask_cors import CORS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('robot_server.log'),
        logging.StreamHandler()
    ]
)

app = Flask(__name__)
CORS(app)

class RobotCar:
    def __init__(self):
        # GPIO pin configuration for robot car
        self.LEFT_MOTOR_FORWARD = 17
        self.LEFT_MOTOR_BACKWARD = 18
        self.RIGHT_MOTOR_FORWARD = 27
        self.RIGHT_MOTOR_BACKWARD = 22
        
        # PWM pins for speed control
        self.LEFT_MOTOR_PWM = 12
        self.RIGHT_MOTOR_PWM = 13
        
        # Sensor pins
        self.DISTANCE_TRIGGER = 23
        self.DISTANCE_ECHO = 24
        self.LIGHT_SENSOR = 25
        
        # LED indicator
        self.STATUS_LED = 26
        
        # Initialize GPIO
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        
        # Setup motor pins
        GPIO.setup(self.LEFT_MOTOR_FORWARD, GPIO.OUT)
        GPIO.setup(self.LEFT_MOTOR_BACKWARD, GPIO.OUT)
        GPIO.setup(self.RIGHT_MOTOR_FORWARD, GPIO.OUT)
        GPIO.setup(self.RIGHT_MOTOR_BACKWARD, GPIO.OUT)
        
        # Setup PWM
        GPIO.setup(self.LEFT_MOTOR_PWM, GPIO.OUT)
        GPIO.setup(self.RIGHT_MOTOR_PWM, GPIO.OUT)
        self.left_pwm = GPIO.PWM(self.LEFT_MOTOR_PWM, 100)
        self.right_pwm = GPIO.PWM(self.RIGHT_MOTOR_PWM, 100)
        self.left_pwm.start(0)
        self.right_pwm.start(0)
        
        # Setup sensors
        GPIO.setup(self.DISTANCE_TRIGGER, GPIO.OUT)
        GPIO.setup(self.DISTANCE_ECHO, GPIO.IN)
        GPIO.setup(self.LIGHT_SENSOR, GPIO.IN)
        
        # Setup status LED
        GPIO.setup(self.STATUS_LED, GPIO.OUT)
        
        # Robot state
        self.is_running = False
        self.current_speed = 0
        self.current_direction = 'stop'
        
        logging.info("Robot car initialized successfully")
    
    def forward(self, speed=50, duration=None):
        """Move robot forward"""
        try:
            self.current_direction = 'forward'
            self.current_speed = speed
            
            GPIO.output(self.LEFT_MOTOR_FORWARD, GPIO.HIGH)
            GPIO.output(self.LEFT_MOTOR_BACKWARD, GPIO.LOW)
            GPIO.output(self.RIGHT_MOTOR_FORWARD, GPIO.HIGH)
            GPIO.output(self.RIGHT_MOTOR_BACKWARD, GPIO.LOW)
            
            self.left_pwm.ChangeDutyCycle(speed)
            self.right_pwm.ChangeDutyCycle(speed)
            
            logging.info(f"Robot moving forward at {speed}% speed")
            
            if duration:
                time.sleep(duration)
                self.stop()
                
        except Exception as e:
            logging.error(f"Error in forward movement: {e}")
    
    def backward(self, speed=50, duration=None):
        """Move robot backward"""
        try:
            self.current_direction = 'backward'
            self.current_speed = speed
            
            GPIO.output(self.LEFT_MOTOR_FORWARD, GPIO.LOW)
            GPIO.output(self.LEFT_MOTOR_BACKWARD, GPIO.HIGH)
            GPIO.output(self.RIGHT_MOTOR_FORWARD, GPIO.LOW)
            GPIO.output(self.RIGHT_MOTOR_BACKWARD, GPIO.HIGH)
            
            self.left_pwm.ChangeDutyCycle(speed)
            self.right_pwm.ChangeDutyCycle(speed)
            
            logging.info(f"Robot moving backward at {speed}% speed")
            
            if duration:
                time.sleep(duration)
                self.stop()
                
        except Exception as e:
            logging.error(f"Error in backward movement: {e}")
    
    def turn_left(self, speed=50, duration=None):
        """Turn robot left"""
        try:
            self.current_direction = 'left'
            self.current_speed = speed
            
            GPIO.output(self.LEFT_MOTOR_FORWARD, GPIO.LOW)
            GPIO.output(self.LEFT_MOTOR_BACKWARD, GPIO.HIGH)
            GPIO.output(self.RIGHT_MOTOR_FORWARD, GPIO.HIGH)
            GPIO.output(self.RIGHT_MOTOR_BACKWARD, GPIO.LOW)
            
            self.left_pwm.ChangeDutyCycle(speed)
            self.right_pwm.ChangeDutyCycle(speed)
            
            logging.info(f"Robot turning left at {speed}% speed")
            
            if duration:
                time.sleep(duration)
                self.stop()
                
        except Exception as e:
            logging.error(f"Error in left turn: {e}")
    
    def turn_right(self, speed=50, duration=None):
        """Turn robot right"""
        try:
            self.current_direction = 'right'
            self.current_speed = speed
            
            GPIO.output(self.LEFT_MOTOR_FORWARD, GPIO.HIGH)
            GPIO.output(self.LEFT_MOTOR_BACKWARD, GPIO.LOW)
            GPIO.output(self.RIGHT_MOTOR_FORWARD, GPIO.LOW)
            GPIO.output(self.RIGHT_MOTOR_BACKWARD, GPIO.HIGH)
            
            self.left_pwm.ChangeDutyCycle(speed)
            self.right_pwm.ChangeDutyCycle(speed)
            
            logging.info(f"Robot turning right at {speed}% speed")
            
            if duration:
                time.sleep(duration)
                self.stop()
                
        except Exception as e:
            logging.error(f"Error in right turn: {e}")
    
    def stop(self):
        """Stop robot movement"""
        try:
            self.current_direction = 'stop'
            self.current_speed = 0
            
            GPIO.output(self.LEFT_MOTOR_FORWARD, GPIO.LOW)
            GPIO.output(self.LEFT_MOTOR_BACKWARD, GPIO.LOW)
            GPIO.output(self.RIGHT_MOTOR_FORWARD, GPIO.LOW)
            GPIO.output(self.RIGHT_MOTOR_BACKWARD, GPIO.LOW)
            
            self.left_pwm.ChangeDutyCycle(0)
            self.right_pwm.ChangeDutyCycle(0)
            
            logging.info("Robot stopped")
            
        except Exception as e:
            logging.error(f"Error stopping robot: {e}")
    
    def get_distance(self):
        """Get distance from ultrasonic sensor"""
        try:
            GPIO.output(self.DISTANCE_TRIGGER, GPIO.LOW)
            time.sleep(0.1)
            
            GPIO.output(self.DISTANCE_TRIGGER, GPIO.HIGH)
            time.sleep(0.00001)
            GPIO.output(self.DISTANCE_TRIGGER, GPIO.LOW)
            
            start_time = time.time()
            while GPIO.input(self.DISTANCE_ECHO) == 0:
                start_time = time.time()
            
            end_time = time.time()
            while GPIO.input(self.DISTANCE_ECHO) == 1:
                end_time = time.time()
            
            duration = end_time - start_time
            distance = (duration * 34300) / 2  # Speed of sound = 343 m/s
            
            return round(distance, 2)
            
        except Exception as e:
            logging.error(f"Error reading distance sensor: {e}")
            return -1
    
    def get_light_level(self):
        """Get light level from light sensor"""
        try:
            # Read analog value from light sensor
            # This is a simplified implementation
            # In real implementation, you might use ADC
            light_value = GPIO.input(self.LIGHT_SENSOR)
            return light_value
            
        except Exception as e:
            logging.error(f"Error reading light sensor: {e}")
            return -1
    
    def get_status(self):
        """Get current robot status"""
        return {
            'direction': self.current_direction,
            'speed': self.current_speed,
            'distance': self.get_distance(),
            'light_level': self.get_light_level(),
            'is_running': self.is_running,
            'timestamp': datetime.now().isoformat()
        }
    
    def cleanup(self):
        """Cleanup GPIO resources"""
        try:
            self.stop()
            self.left_pwm.stop()
            self.right_pwm.stop()
            GPIO.cleanup()
            logging.info("GPIO cleanup completed")
        except Exception as e:
            logging.error(f"Error during cleanup: {e}")

# Global robot instance
robot = RobotCar()

# Booking validation
def is_booking_valid(user_id, booking_time):
    """Check if user has valid booking for current time"""
    # This would typically check against the main server's booking database
    # For now, we'll implement a simple validation
    try:
        # In real implementation, make API call to main server
        # to validate booking
        return True
    except Exception as e:
        logging.error(f"Error validating booking: {e}")
        return False

@app.route('/api/robot/status', methods=['GET'])
def get_robot_status():
    """Get robot status"""
    try:
        status = robot.get_status()
        return jsonify({
            'success': True,
            'status': status
        })
    except Exception as e:
        logging.error(f"Error getting robot status: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/robot/control', methods=['POST'])
def control_robot():
    """Control robot movement"""
    try:
        data = request.get_json()
        command = data.get('command')
        speed = data.get('speed', 50)
        duration = data.get('duration')
        user_id = data.get('user_id')
        
        # Validate booking (in real implementation)
        # if not is_booking_valid(user_id, datetime.now()):
        #     return jsonify({
        #         'success': False,
        #         'error': 'No valid booking for current time'
        #     }), 403
        
        if command == 'forward':
            robot.forward(speed, duration)
        elif command == 'backward':
            robot.backward(speed, duration)
        elif command == 'left':
            robot.turn_left(speed, duration)
        elif command == 'right':
            robot.turn_right(speed, duration)
        elif command == 'stop':
            robot.stop()
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid command'
            }), 400
        
        return jsonify({
            'success': True,
            'message': f'Robot {command} command executed',
            'status': robot.get_status()
        })
        
    except Exception as e:
        logging.error(f"Error controlling robot: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/robot/execute', methods=['POST'])
def execute_code():
    """Execute Python code on robot"""
    try:
        data = request.get_json()
        code = data.get('code')
        user_id = data.get('user_id')
        
        # Validate booking (in real implementation)
        # if not is_booking_valid(user_id, datetime.now()):
        #     return jsonify({
        #         'success': False,
        #         'error': 'No valid booking for current time'
        #     }), 403
        
        # Create a safe execution environment
        robot.is_running = True
        
        # Execute code in a separate thread to avoid blocking
        def execute_code_thread():
            try:
                # Create a local namespace with robot object
                local_vars = {'robot': robot, 'time': time}
                
                # Execute the code
                exec(code, {'__builtins__': {}}, local_vars)
                
                logging.info(f"Code execution completed for user {user_id}")
            except Exception as e:
                logging.error(f"Error executing code: {e}")
            finally:
                robot.is_running = False
                robot.stop()
        
        thread = threading.Thread(target=execute_code_thread)
        thread.daemon = True
        thread.start()
        
        return jsonify({
            'success': True,
            'message': 'Code execution started',
            'status': robot.get_status()
        })
        
    except Exception as e:
        logging.error(f"Error executing code: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/robot/stop', methods=['POST'])
def stop_robot():
    """Stop robot execution"""
    try:
        robot.stop()
        robot.is_running = False
        
        return jsonify({
            'success': True,
            'message': 'Robot stopped',
            'status': robot.get_status()
        })
        
    except Exception as e:
        logging.error(f"Error stopping robot: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/robot/sensors', methods=['GET'])
def get_sensors():
    """Get sensor readings"""
    try:
        distance = robot.get_distance()
        light_level = robot.get_light_level()
        
        return jsonify({
            'success': True,
            'sensors': {
                'distance': distance,
                'light_level': light_level,
                'timestamp': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        logging.error(f"Error reading sensors: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    try:
        logging.info("Starting Raspberry Pi Robot Server...")
        app.run(host='0.0.0.0', port=5000, debug=False)
    except KeyboardInterrupt:
        logging.info("Shutting down server...")
    finally:
        robot.cleanup()
