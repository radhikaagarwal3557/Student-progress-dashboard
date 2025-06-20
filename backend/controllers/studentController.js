import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils.ApiError.js";
import Student from "../models/studentSchema.js";

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
    const {sname,rollNumber, username, password,email} = req.body;

    if(
        [sname, password, rollNumber, email, username].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }

    const existedStudent = await Student.findOne({$or: [{rollNumber}, {username}, {email}]})

    if(existedStudent) {
        throw new ApiError(409, "Student with this roll number or username already exists");
    }
    
    const student = new Student({ rollNumber, username, email, sname, password });
    let result = await student.save();

    // Generate JWT tokens
    const tokens = await generateAccessAndRefreshTokens(result._id);

    // Remove password from response
    result = result.toObject();
    delete result.password;

    // Final response
    res.status(201).json(
        new ApiResponse(201, { student: result, tokens }, "Student registered successfully")
    );
});

const studentLogin = asyncHandler(async (req, res) => {
    const {rollNumber, password, username, email} = req.body;
    if(!rollNumber && !username && !email){
        throw new ApiError(400, "Roll number, username or email is required");
    }

    const student = await Student.findOne({
        $or: [{rollNumber}, {username}, {email}]
    });
    
    if(!student){
        throw new ApiError(404, "Student not found");
    }

    const isPasswordValid = await student.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid student credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(student._id);

    const loggedInStudent = await Student.findById(student._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                student: loggedInStudent,accessToken,
                refreshToken
            },
            "Student logged in successfully"
        )
    )
})

const logoutStudent = asyncHandler(async (req, res) => {
    await Student.findbyIdAndUpdate(
        req.student._id,
        {
            $unset: { refreshToken: 1 }
        },
        { new: true }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Student logged out successfully"));
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken ||  req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request");
    }

    try{
        const decodedtoken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const student = await Student.findById(decodedtoken?.id);

        if(!student){
            throw new ApiError(401, "invalid refresh token");
        }

        if(incomingRefreshToken !== student?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(student._id);

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken:newRefreshToken},
                "Access token refreshed"
            )
        )    
    } catch (error) {
        throw new ApiError(401,error?.message ||  "Invalid refresh token");
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {oldPasswod, newPassword} = req.body;

    const student = await Student.findById(req.student._id);
    const isPasswordCorrect = await student.isPasswordCorrect(oldPasswod);

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password");
    }

    student.password = newPassword;
    await student.save({validateForSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
})

const updateStudent = asyncHandler(async (req, res) => {
    const {sname, email, password} = req.body;

    if(!sname || !email){
        throw new ApiError(400, "All fields are required");
    }

    const updatedData = {sname, email};

    if (password) {
        updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
        req.student?._id,
        {
            $set: {
                ...updatedData,
            }
        },
        {new: true}
    ).select("-password")

    if (!updatedStudent) {
        throw new ApiError(404, "Student not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedstudent, "Student updated successfully"));
})

const getStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;

    
})

export{
    registerStudent,
    studentLogin,
    logoutStudent,
    refreshAccessToken,
    changeCurrentPassword,
    updateStudent,
    getStudentDetail
}

