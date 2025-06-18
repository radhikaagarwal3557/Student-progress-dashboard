import {student} from "../models/studentSchema.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(studentId) => {
    try{
        const student = await Student.findById(studentId)
        const accessToken = student.generateAccessToken
        const refreshToken = student.generateRefreshToken

        student.refreshToken = refreshToken
        await student.save({validateForSave: false})

        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
}

const registerStudent = asyncHandler(async (req, res) => {
    
 })
