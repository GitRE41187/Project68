import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaRobot, FaCheck, FaTimes } from 'react-icons/fa';
import './Booking.css';

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLab, setSelectedLab] = useState('');
  const [duration, setDuration] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [bookings, setBookings] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const labs = [
    { id: 'A', name: 'ห้องปฏิบัติการ A', status: 'available', capacity: 4 },
    { id: 'B', name: 'ห้องปฏิบัติการ B', status: 'available', capacity: 6 },
    { id: 'C', name: 'ห้องปฏิบัติการ C', status: 'maintenance', capacity: 4 },
    { id: 'D', name: 'ห้องปฏิบัติการ D', status: 'available', capacity: 8 }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Sample existing bookings for demonstration
  const existingBookings = [
    { date: '2024-01-15', time: '09:00', lab: 'A', duration: 2, user: 'John Doe' },
    { date: '2024-01-15', time: '14:00', lab: 'B', duration: 1, user: 'Jane Smith' },
    { date: '2024-01-16', time: '10:00', lab: 'A', duration: 3, user: 'Bob Johnson' }
  ];

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: '', empty: true });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      
      days.push({
        day,
        date,
        isToday,
        isSelected,
        empty: false
      });
    }

    return days;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const isTimeSlotBooked = (date, time, lab) => {
    const dateStr = date.toISOString().split('T')[0];
    return existingBookings.some(booking => 
      booking.date === dateStr && 
      booking.lab === lab && 
      booking.time === time
    );
  };

  const isTimeSlotAvailable = (date, time, lab) => {
    if (!date || !time || !lab) return false;
    
    const dateStr = date.toISOString().split('T')[0];
    const selectedTimeIndex = timeSlots.indexOf(time);
    
    // Check if any part of the duration conflicts with existing bookings
    for (let i = 0; i < duration; i++) {
      const checkTime = timeSlots[selectedTimeIndex + i];
      if (!checkTime) return false; // Duration extends beyond available time slots
      
      if (existingBookings.some(booking => 
        booking.date === dateStr && 
        booking.lab === lab && 
        booking.time === checkTime
      )) {
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedLab || !purpose) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (!isTimeSlotAvailable(selectedDate, selectedTime, selectedLab)) {
      alert('ช่วงเวลาที่เลือกไม่ว่าง กรุณาเลือกเวลาอื่น');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBooking = {
        id: Date.now(),
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        lab: selectedLab,
        duration,
        purpose,
        user: 'Current User',
        status: 'confirmed'
      };

      setBookings(prev => [...prev, newBooking]);
      
      // Reset form
      setSelectedTime('');
      setSelectedLab('');
      setDuration(1);
      setPurpose('');
      
      alert('จองห้องปฏิบัติการสำเร็จ!');
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <main className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">จองห้องปฏิบัติการ</h1>
      </div>

      <div className="row">
        {/* Calendar */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0"><FaCalendarAlt className="me-2" />ปฏิทินการจอง</h5>
            </div>
            <div className="card-body">
              <div className="calendar">
                <div className="calendar-header mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(newDate.getMonth() - 1);
                        setSelectedDate(newDate);
                      }}
                    >
                      &lt;
                    </button>
                    <h5 className="mb-0">
                      {selectedDate.toLocaleDateString('th-TH', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </h5>
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(newDate.getMonth() + 1);
                        setSelectedDate(newDate);
                      }}
                    >
                      &gt;
                    </button>
                  </div>
                </div>

                <div className="calendar-grid">
                  <div className="calendar-weekdays">
                    {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(day => (
                      <div key={day} className="calendar-weekday">{day}</div>
                    ))}
                  </div>
                  
                  <div className="calendar-days">
                    {calendarDays.map((dayObj, index) => (
                      <div
                        key={index}
                        className={`calendar-day ${dayObj.empty ? 'empty' : ''} ${
                          dayObj.isToday ? 'today' : ''
                        } ${dayObj.isSelected ? 'selected' : ''}`}
                        onClick={() => !dayObj.empty && handleDateSelect(dayObj.date)}
                      >
                        {dayObj.day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">จองห้องปฏิบัติการ</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">วันที่เลือก</label>
                  <div className="form-control-plaintext">
                    {selectedDate.toLocaleDateString('th-TH')}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">ห้องปฏิบัติการ</label>
                  <select 
                    className="form-select" 
                    value={selectedLab} 
                    onChange={(e) => setSelectedLab(e.target.value)}
                    required
                  >
                    <option value="">เลือกห้องปฏิบัติการ</option>
                    {labs.map(lab => (
                      <option key={lab.id} value={lab.id} disabled={lab.status === 'maintenance'}>
                        {lab.name} {lab.status === 'maintenance' ? '(บำรุงรักษา)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">เวลาเริ่มต้น</label>
                  <div className="time-slots">
                    {timeSlots.map(time => {
                      const isBooked = selectedLab && isTimeSlotBooked(selectedDate, time, selectedLab);
                      const isAvailable = selectedLab && isTimeSlotAvailable(selectedDate, time, selectedLab);
                      const isSelected = selectedTime === time;
                      
                      return (
                        <div
                          key={time}
                          className={`time-slot ${isSelected ? 'selected' : ''} ${
                            isBooked ? 'booked' : isAvailable ? 'available' : ''
                          }`}
                          onClick={() => {
                            if (!isBooked && selectedLab) {
                              handleTimeSelect(time);
                            }
                          }}
                          style={{ cursor: isBooked ? 'not-allowed' : 'pointer' }}
                        >
                          {time}
                          {isBooked && <small className="d-block text-danger">ไม่ว่าง</small>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">ระยะเวลา (ชั่วโมง)</label>
                  <select 
                    className="form-select" 
                    value={duration} 
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    required
                  >
                    <option value={1}>1 ชั่วโมง</option>
                    <option value={2}>2 ชั่วโมง</option>
                    <option value={3}>3 ชั่วโมง</option>
                    <option value={4}>4 ชั่วโมง</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">วัตถุประสงค์</label>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="ระบุวัตถุประสงค์การใช้งาน..."
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={isSubmitting || !selectedDate || !selectedTime || !selectedLab || !purpose}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      กำลังจอง...
                    </>
                  ) : (
                    <>
                      <FaCheck className="me-2" />
                      จองห้องปฏิบัติการ
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Lab Status */}
          <div className="card mt-3">
            <div className="card-header">
              <h6 className="mb-0">สถานะห้องปฏิบัติการ</h6>
            </div>
            <div className="card-body">
              {labs.map(lab => (
                <div key={lab.id} className="d-flex justify-content-between align-items-center mb-2">
                  <span>{lab.name}</span>
                  <span className={`badge bg-${lab.status === 'available' ? 'success' : 'warning'}`}>
                    {lab.status === 'available' ? 'ว่าง' : 'บำรุงรักษา'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Existing Bookings for Selected Date */}
          {selectedDate && (
            <div className="card mt-3">
              <div className="card-header">
                <h6 className="mb-0">
                  <FaClock className="me-2" />
                  การจองวันที่ {selectedDate.toLocaleDateString('th-TH')}
                </h6>
              </div>
              <div className="card-body">
                {existingBookings
                  .filter(booking => booking.date === selectedDate.toISOString().split('T')[0])
                  .map(booking => (
                    <div key={booking.id} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                      <div>
                        <small className="text-muted d-block">{booking.time} - {booking.duration} ชม.</small>
                        <span className="fw-bold">{labs.find(lab => lab.id === booking.lab)?.name}</span>
                      </div>
                      <span className="badge bg-info">{booking.user}</span>
                    </div>
                  ))}
                {existingBookings.filter(booking => 
                  booking.date === selectedDate.toISOString().split('T')[0]
                ).length === 0 && (
                  <p className="text-muted text-center mb-0">ไม่มีรายการจองในวันที่เลือก</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Booking;
