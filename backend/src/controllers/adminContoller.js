import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcryptjs";
import { Admin } from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (adminId) => {
    try{
        const admin = await Admin.findById(adminId);
        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

        admin.refreshToken = refreshToken;
        await admin.save({ validateModifiedOnly: true });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
}

const adminRegister = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;

    if ([username, password, email].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedAdmin = await Admin.findOne({ $or: [{ username }, { email }] });

    if (existedAdmin) {
        throw new ApiError(409, "Admin with this username or email already exists");
    }

    const admin = new Admin({ username, email, password });
    // Generate JWT tokens
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(result._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    // Final response
    return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(201, { admin: savedAdmin, accessToken, refreshToken }, "Admin registered successfully")
    );
})

const adminLogin = asyncHandler(async (req, res) => {
    const { username, password, email} = req.body;

    if ((!username && !email) || !password) {
        throw new ApiError(400, "Username and password are required");
    }

    const admin = await Admin.findOne({
        $or: [{username}, {email}]
    })

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(admin._id);

    const loggedInadmin = await Admin.findById(admin._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            { 
                admin: loggedInadmin, accessToken, refreshToken
            }, "Admin logged in successfully"
        )
    );
})

const adminLogout = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.admin._id, 
        {
            $unset: {
                refreshToken: 1 
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", "", options)
    .cookie("refreshToken", "", options)
    .json(new ApiResponse(200, {}, "Admin logged out successfully"));
})

const changeAdminPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin?._id);

   if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid Old password");
    }

    admin.password = newPassword;
    await admin.save({ validateBeforeSave: true });

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
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
    
            const admin = await Admin.findById(decodedtoken?.id);
    
            if(!admin){
                throw new ApiError(401, "invalid refresh token");
            }
    
            if(incomingRefreshToken !== admin?.refreshToken){
                throw new ApiError(401, "Refresh token is expired or used");
            }
    
            const options = {
                httpOnly: true,
                secure: true,
            }
    
            const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(admin._id);
    
            return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200, 
                    {accessToken, refreshToken},
                    "Access token refreshed"
                )
            )    
        } catch (error) {
            throw new ApiError(401,error?.message ||  "Invalid refresh token");
        }
})

export {
    adminRegister,
    adminLogin,
    adminLogout,
    changeAdminPassword,
    refreshAccessToken
};