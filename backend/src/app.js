import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import studentRoutes from './routes/student.routes.js';


app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendace', attendanceRoutes);

export{app};