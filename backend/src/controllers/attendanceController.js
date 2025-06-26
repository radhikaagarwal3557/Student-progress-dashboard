import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';  
import { Attendance } from '../models/attendance.model';
import mongoose from 'mongoose';
import { ApiResponse } from '../utils/ApiResponse';
import { Student } from '../models/student.model';
import { Teacher } from '../models/teacher.model';

export const createAttendance = asyncHandler(async (req, res) => {
    try{
        const { student, teacher, subName, date, status } = req.body;
        if(!student || !teacher || !subName || !date || !status) {
            throw new ApiError(400, 'All fields are required');
        }

        // Validate if the student exists
        const studentexists = await Student.findById(student);
        if (!studentexists) {
            throw new ApiError(404, 'Student not found');
        }

        const teacherExists = await Teacher.findById(teacher);
        if(!teacherExists) {
            throw new ApiError(404, 'Teacher not found');
        }

        const existingAttendance = await Attendance.findOne({
            student: student,
            date: new Date(date)
        });
        if(existingAttendance) {
            throw new ApiError(400, 'Attendance for this student on this date already exists');
        }
        const attendance = await Attendance.create({
            student,
            teacher,
            subName,
            date: new Date(date),
            status
        });

       // response here
        res.status(201)
        .json(new ApiResponse('Attendance created successfully', attendance));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
})

export const getAllAttendance = asyncHandler(async (req, res) => {
    try {
        const attendance = await Attendance.find();
        if(attendance.length === 0) {
            return res.status(404).json(new ApiResponse('No attendance records found', []));
        }
        // response here
        res.status(200).json(new ApiResponse('Attendance records fetched successfully', attendance));
    } catch (error) {
        res.status(500).json(new ApiResponse('Error fetching attendance', null, error.message));
    }
})

// single attendance
export const singleAttendance = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await Attendance.findById(id);
        if (!attendance) {
            return res.status(404).json(new ApiResponse('Attendance record not found', null));
        }
        // response here
        res.status(200).json(new ApiResponse('Attendance record fetched successfully', attendance));
    } catch (error) {
        res.status(500).json(new ApiResponse('Error fetching attendance', null, error.message));
    }
})

export const updateAttendance = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { student, teacher, subName, date, status } = req.body;
        //  check if attendance exists
        const attendanceRecord = await Attendance.findById(id);
        if(!attendanceRecord) {
            return res.status(404).json(new ApiResponse('Attendance record not found', null));
        }   
        if(student && student != attendanceRecord.student.toString()) {
            const studentExists = await Student.findById(student);
            if(!studentExists) {
                return res.status(404).json(new ApiResponse('Student not found', null));
            }
        }
        if(teacher && teacher != attendanceRecord.teacher.toString()) {
            const teacherExists = await Teacher.findById(teacher);
            if(!teacherExists) {
                return res.status(404).json(new ApiResponse('Teacher not found', null));
            }
        }
        // update fields
        attendanceRecord.student = student || attendanceRecord.student;
        attendanceRecord.teacher = teacher || attendanceRecord.teacher;
        attendanceRecord.subName = subName || attendanceRecord.subName;
        attendanceRecord.date = date ? new Date(date) : attendanceRecord.date;
        attendanceRecord.status = status || attendanceRecord.status;

        // save record
        const populatedAttendance = await attendanceRecord.save();

        res.status(200).json(new ApiResponse('Attendance updated successfully', updatedAttendance));
    } catch (error) {
        res.status(500).json(new ApiResponse('Error updating attendance', null, error.message));
        
    }
})

export const deleteAttendance = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const deleted  = await Attendance.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json(new ApiResponse('Attendance record not found', null));
        }
        res.status(200).json(new ApiResponse('Attendance record deleted successfully', null));
    } catch (error) {
        res.status(500).json(new ApiResponse('Error deleting attendance', null, error.message));
        
    }
})

module.exports = {
    createAttendance,
    getAllAttendance,
    singleAttendance,
    updateAttendance,
    deleteAttendance
};