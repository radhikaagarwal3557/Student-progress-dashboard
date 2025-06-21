import { ApiError } from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import Student from "../models/studentSchema.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            throw new ApiError(401, "unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const student = await Student.findById(decodedToken?.id).select("-password -refreshToken");

        if(!student){
            throw new ApiError(401, "unauthorized request");
        }

        req.student = student;
        next();
    }
    catch(err){
        throw new ApiError(401, error?.message || "Invalid acess token");
    }
})