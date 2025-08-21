# Robot Control Lab - React Version

ระบบห้องปฏิบัติการควบคุมหุ่นยนต์ออนไลน์ที่พัฒนาด้วย React

## 🚀 คุณสมบัติหลัก

- **ระบบ Authentication**: เข้าสู่ระบบและสมัครสมาชิก
- **เมนูหลัก**: นำทางไปยังฟีเจอร์ต่างๆ
- **แดชบอร์ด**: แสดงสถานะระบบและสถิติ
- **การจอง**: จองห้องปฏิบัติการ
- **ควบคุมหุ่นยนต์**: เขียนโค้ด Python เพื่อควบคุมหุ่นยนต์
- **กล้องถ่ายทอดสด**: ดูภาพและควบคุมกล้อง
- **ประวัติ**: ดูประวัติการใช้งาน
- **ช่วยเหลือ**: คู่มือการใช้งานและติดต่อ

## 🛠️ เทคโนโลยีที่ใช้

- **Frontend**: React 18, React Router DOM
- **UI Framework**: Bootstrap 5, React Bootstrap
- **Icons**: React Icons
- **Code Editor**: CodeMirror 6
- **HTTP Client**: Axios
- **State Management**: React Context API

## 📁 โครงสร้างโปรเจค

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.js          # หน้าเข้าสู่ระบบ
│   │   ├── Register.js       # หน้าสมัครสมาชิก
│   │   └── Auth.css          # สไตล์สำหรับ auth
│   ├── camera/
│   │   ├── Camera.js         # หน้ากล้องถ่ายทอดสด
│   │   └── Camera.css        # สไตล์สำหรับกล้อง
│   ├── common/
│   │   └── Navigation.js     # แถบนำทาง
│   ├── dashboard/
│   │   └── DashboardOverview.js # หน้าแดชบอร์ด
│   ├── booking/
│   │   └── Booking.js        # หน้าจองห้องปฏิบัติการ
│   ├── robot/
│   │   └── RobotControl.js   # หน้าควบคุมหุ่นยนต์
│   ├── history/
│   │   └── History.js        # หน้าประวัติการใช้งาน
│   ├── help/
│   │   └── Help.js           # หน้าช่วยเหลือ
│   └── MainMenu.js           # เมนูหลัก
├── contexts/
│   └── AuthContext.js        # Context สำหรับ authentication
├── App.js                    # Component หลัก
├── App.css                   # สไตล์หลัก
├── index.js                  # Entry point
└── index.css                 # สไตล์ global
```

## 🚀 การติดตั้งและรัน

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รัน Development Server
```bash
npm start
```

แอปจะเปิดที่ `http://localhost:3000`

### 3. รัน Backend Server (แยก)
```bash
npm run server
```

Backend จะรันที่ `http://localhost:3001`

## 🔧 การ Build สำหรับ Production

```bash
npm run build
```

ไฟล์ที่ build จะอยู่ในโฟลเดอร์ `build/`

## 📱 Responsive Design

แอปได้รับการออกแบบให้รองรับทุกขนาดหน้าจอ:
- Desktop (≥1200px)
- Tablet (≥768px)
- Mobile (≥576px)

## 🎨 สไตล์และการออกแบบ

- ใช้ CSS Variables สำหรับสีหลัก
- Gradient backgrounds และ animations
- Card-based layout
- Hover effects และ transitions
- Bootstrap 5 components

## 🔐 ระบบ Authentication

- JWT Token-based authentication
- Protected routes
- User context management
- Auto-logout เมื่อ token หมดอายุ

## 📊 State Management

ใช้ React Context API สำหรับ:
- User authentication state
- Global app state
- Theme preferences

## 🚀 การ Deploy

### Netlify
1. Push code ไปยัง Git repository
2. Connect repository ใน Netlify
3. Build command: `npm run build`
4. Publish directory: `build`

### Vercel
1. Push code ไปยัง Git repository
2. Import project ใน Vercel
3. Framework preset: Create React App
4. Build command: `npm run build`

## 🔧 การปรับแต่ง

### เปลี่ยนสีหลัก
แก้ไขใน `src/index.css`:
```css
:root {
  --primary-color: #667eea;    /* เปลี่ยนสีหลัก */
  --secondary-color: #764ba2;  /* เปลี่ยนสีรอง */
}
```

### เพิ่ม Route ใหม่
1. สร้าง component ใหม่ใน `src/components/`
2. เพิ่ม route ใน `src/App.js`
3. เพิ่ม link ใน `src/components/MainMenu.js`

## 📝 การพัฒนาเพิ่มเติม

### เพิ่ม Feature ใหม่
1. สร้าง component ใหม่
2. เพิ่ม route ใน App.js
3. อัปเดต navigation
4. เพิ่ม CSS styles

### การทดสอบ
```bash
npm test
```

### การ Build และ Deploy
```bash
npm run build
npm run eject  # (ระวัง: ไม่สามารถย้อนกลับได้)
```

## 🤝 การมีส่วนร่วม

1. Fork โปรเจค
2. สร้าง feature branch
3. Commit การเปลี่ยนแปลง
4. Push ไปยัง branch
5. สร้าง Pull Request

## 📄 License

ISC License

## 📞 ติดต่อ

สำหรับคำถามหรือข้อเสนอแนะ กรุณาติดต่อทีมพัฒนา

---

**หมายเหตุ**: นี่คือ React version ของโปรเจค Robot Control Lab เดิม โปรดดู README.md สำหรับข้อมูลเพิ่มเติมเกี่ยวกับ backend และระบบโดยรวม
