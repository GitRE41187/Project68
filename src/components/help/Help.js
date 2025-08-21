import React, { useState } from 'react';
import { FaQuestionCircle, FaBook, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaSearch } from 'react-icons/fa';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('faq');

  const faqs = [
    {
      question: 'วิธีการเข้าสู่ระบบ?',
      answer: 'ใช้อีเมลและรหัสผ่านที่ลงทะเบียนไว้เพื่อเข้าสู่ระบบ หากลืมรหัสผ่าน สามารถใช้ฟีเจอร์ "ลืมรหัสผ่าน" ได้'
    },
    {
      question: 'วิธีการจองห้องปฏิบัติการ?',
      answer: 'ไปที่หน้า "จองห้องปฏิบัติการ" เลือกวันที่และเวลา จากนั้นกรอกข้อมูลและยืนยันการจอง'
    },
    {
      question: 'วิธีการควบคุมหุ่นยนต์?',
      answer: 'ไปที่หน้า "ควบคุมหุ่นยนต์" เขียนโค้ด Python ใน Code Editor แล้วกดปุ่ม "รันโค้ด" เพื่อเริ่มควบคุม'
    },
    {
      question: 'วิธีการใช้กล้องถ่ายทอดสด?',
      answer: 'ไปที่หน้า "กล้องถ่ายทอดสด" กดปุ่ม "เริ่มการถ่ายทอด" เพื่อเชื่อมต่อกล้อง และใช้ปุ่มควบคุมเพื่อปรับมุมกล้อง'
    },
    {
      question: 'ระบบรองรับการใช้งานบนมือถือหรือไม่?',
      answer: 'ใช่ ระบบได้รับการออกแบบให้รองรับการใช้งานบนทุกอุปกรณ์ รวมถึงมือถือและแท็บเล็ต'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const contactInfo = {
    email: 'support@robotlab.com',
    phone: '02-123-4567',
    address: '123 ถนนวิทยาลัย แขวงมหาวิทยาลัย เขตบางเขน กรุงเทพฯ 10900',
    hours: 'จันทร์ - ศุกร์: 8:00 - 17:00 น.\nเสาร์: 9:00 - 15:00 น.\nอาทิตย์: ปิดทำการ'
  };

  const quickLinks = [
    { title: 'คู่มือการใช้งาน', icon: FaBook, description: 'คู่มือการใช้งานระบบอย่างละเอียด' },
    { title: 'ติดต่อผู้ดูแล', icon: FaEnvelope, description: 'ส่งข้อความถึงผู้ดูแลระบบ' },
    { title: 'รายงานปัญหา', icon: FaQuestionCircle, description: 'รายงานปัญหาหรือข้อผิดพลาด' },
    { title: 'คำถามที่พบบ่อย', icon: FaSearch, description: 'ค้นหาคำตอบสำหรับปัญหาที่พบบ่อย' }
  ];

  return (
    <main className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">ช่วยเหลือ</h1>
      </div>

      {/* Quick Links */}
      <div className="row mb-4">
        {quickLinks.map((link, index) => {
          const IconComponent = link.icon;
          return (
            <div key={index} className="col-md-3 col-6 mb-3">
              <div className="card help-card">
                <div className="card-body text-center">
                  <IconComponent className="text-primary mb-3" style={{ fontSize: '2rem' }} />
                  <h6 className="card-title">{link.title}</h6>
                  <p className="card-text text-muted small">{link.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`}
                    onClick={() => setActiveTab('faq')}
                  >
                    <FaQuestionCircle className="me-2" />คำถามที่พบบ่อย
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'manual' ? 'active' : ''}`}
                    onClick={() => setActiveTab('manual')}
                  >
                    <FaBook className="me-2" />คู่มือการใช้งาน
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {activeTab === 'faq' && (
                <div>
                  <div className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaSearch />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ค้นหาคำถาม..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="faq-list">
                    {filteredFaqs.map((faq, index) => (
                      <div key={index} className="faq-item mb-3">
                        <div className="faq-question fw-bold mb-2">
                          {faq.question}
                        </div>
                        <div className="faq-answer text-muted">
                          {faq.answer}
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredFaqs.length === 0 && (
                    <div className="text-center py-4">
                      <FaSearch className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                      <p className="text-muted">ไม่พบคำถามที่ตรงกับการค้นหา</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'manual' && (
                <div>
                  <h5>คู่มือการใช้งานระบบ Robot Control Lab</h5>
                  
                  <div className="manual-section mb-4">
                    <h6>1. การเข้าสู่ระบบ</h6>
                    <p>ระบบใช้การยืนยันตัวตนด้วยอีเมลและรหัสผ่าน หลังจากเข้าสู่ระบบสำเร็จ ผู้ใช้จะถูกนำไปยังหน้าเมนูหลัก</p>
                  </div>

                  <div className="manual-section mb-4">
                    <h6>2. การจองห้องปฏิบัติการ</h6>
                    <p>ผู้ใช้สามารถจองห้องปฏิบัติการได้โดยเลือกวันที่ เวลา และระบุวัตถุประสงค์การใช้งาน ระบบจะแสดงสถานะห้องปฏิบัติการแบบเรียลไทม์</p>
                  </div>

                  <div className="manual-section mb-4">
                    <h6>3. การควบคุมหุ่นยนต์</h6>
                    <p>ผู้ใช้สามารถเขียนโค้ด Python เพื่อควบคุมหุ่นยนต์ได้ผ่าน Code Editor ที่มีให้บริการ พร้อมเทมเพลตโค้ดสำหรับการใช้งานพื้นฐาน</p>
                  </div>

                  <div className="manual-section mb-4">
                    <h6>4. การใช้กล้องถ่ายทอดสด</h6>
                    <p>ระบบกล้องถ่ายทอดสดช่วยให้ผู้ใช้สามารถดูภาพจากห้องปฏิบัติการได้แบบเรียลไทม์ พร้อมฟีเจอร์บันทึกวิดีโอและถ่ายภาพ</p>
                  </div>

                  <div className="manual-section">
                    <h6>5. การดูประวัติการใช้งาน</h6>
                    <p>ผู้ใช้สามารถดูประวัติการใช้งานทั้งหมดได้ในหน้า "ประวัติการใช้งาน" พร้อมฟีเจอร์กรองและค้นหาข้อมูล</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0"><FaEnvelope className="me-2" />ติดต่อเรา</h5>
            </div>
            <div className="card-body">
              <div className="contact-info">
                <div className="contact-item mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaEnvelope className="text-primary me-2" />
                    <strong>อีเมล</strong>
                  </div>
                  <a href={`mailto:${contactInfo.email}`} className="text-decoration-none">
                    {contactInfo.email}
                  </a>
                </div>

                <div className="contact-item mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaPhone className="text-primary me-2" />
                    <strong>เบอร์โทรศัพท์</strong>
                  </div>
                  <a href={`tel:${contactInfo.phone}`} className="text-decoration-none">
                    {contactInfo.phone}
                  </a>
                </div>

                <div className="contact-item mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaMapMarkerAlt className="text-primary me-2" />
                    <strong>ที่อยู่</strong>
                  </div>
                  <p className="mb-0 small">{contactInfo.address}</p>
                </div>

                <div className="contact-item">
                  <div className="d-flex align-items-center mb-2">
                    <FaClock className="text-primary me-2" />
                    <strong>เวลาทำการ</strong>
                  </div>
                  <pre className="mb-0 small" style={{ whiteSpace: 'pre-line' }}>
                    {contactInfo.hours}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Support Form */}
          <div className="card mt-3">
            <div className="card-header">
              <h6 className="mb-0">ส่งข้อความถึงเรา</h6>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">ชื่อ</label>
                  <input type="text" className="form-control" placeholder="ชื่อของคุณ" />
                </div>
                <div className="mb-3">
                  <label className="form-label">อีเมล</label>
                  <input type="email" className="form-control" placeholder="อีเมลของคุณ" />
                </div>
                <div className="mb-3">
                  <label className="form-label">หัวข้อ</label>
                  <input type="text" className="form-control" placeholder="หัวข้อข้อความ" />
                </div>
                <div className="mb-3">
                  <label className="form-label">ข้อความ</label>
                  <textarea className="form-control" rows="3" placeholder="รายละเอียดปัญหาหรือคำถาม"></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  ส่งข้อความ
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Help;
