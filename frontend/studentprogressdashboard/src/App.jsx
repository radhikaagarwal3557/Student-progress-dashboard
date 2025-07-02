import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/LoginPages'; 
import StudentList from './pages/student/StudentList';
import AttendanceList from './pages/attendance/AttendanceList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentList />} />
        <Route path="/attendance" element={<AttendanceList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
