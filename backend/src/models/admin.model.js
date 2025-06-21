import mongoose, {Schema} from "mongoose";

const adminSchema = new Schema(
    {
        name: {
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
        }
    }
);

export const Admin = mongoose.model('Admin', adminSchema);