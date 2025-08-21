import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaRobot, FaCheck, FaTimes } from 'react-icons/fa';

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLab, setSelectedLab] = useState('');
  const [duration, setDuration] = useState(1);
  const [purpose, setPurpose] = useState('');

  const labs = [
    { id: 'A', name: 'ห้องปฏิบัติการ A', status: 'available', capacity: 4 },
    { id: 'B', name: 'ห้องปฏิบัติการ B', status: 'available', capacity: 6 },
    { id: 'C', name: 'ห้องปฏิบัติการ C', status: 'maintenance', capacity: 4 },
    { id: 'D', name: 'ห้องปฏิบัติการ D', status: 'available', capacity: 8 }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle booking submission
    console.log('Booking submitted:', {
      date: selectedDate,
      time: selectedTime,
      lab: selectedLab,
      duration,
      purpose
    });
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
                  <select 
                    className="form-select" 
                    value={selectedTime} 
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                  >
                    <option value="">เลือกเวลา</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
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

                <button type="submit" className="btn btn-primary w-100">
                  <FaCheck className="me-2" />จองห้องปฏิบัติการ
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
        </div>
      </div>
    </main>
  );
};

export default Booking;
