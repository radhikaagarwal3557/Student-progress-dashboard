import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const adminSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        role: {
            type: String,
            enum: ['admin', 'teacher', 'student'],
            default: 'admin',
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true,
    } 
);

adminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

adminSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

adminSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        { 
            _id: this._id,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET, 
        {
           expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }   
    )
}

adminSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        { 
            _id: this._id 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}    

export const Admin = mongoose.model('Admin', adminSchema);