import { Router } from 'express';

import{
    adminRegister,
    adminLogin,
    logoutAdmin,
    refreshAdminAccessToken,
    changeAdminCurrentPassword,
} from '../controllers/adminController.js';

import {
    registerStudent,
    studentLogin,
    logoutStudent,
    refreshAccessToken,
    changeCurrentPassword,
    updateStudent,
    getStudentDetail,
    deleteStudent
} from '../controllers/studentController.js';

import {verifyJWT} from '../middlewares/auth.middleware.js';

const router = Router();

// admin
router.post('/admin/register', adminRegister);
router.route('/admin/login').post(adminLogin);
router.route('/admin/logout').post(verifyJWT, logoutAdmin);
router.route('/admin/refresh-token').post(refreshAdminAccessToken);
router.route('/admin/change-password').post(verifyJWT, changeAdminCurrentPassword);

// student
router.post('/register', registerStudent);
router.route('/login').post(studentLogin);
router.route('/logout').post(verifyJWT, logoutStudent);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/update').put(verifyJWT, updateStudent);
router.route('/detail/:id').get(verifyJWT, getStudentDetail);
router.route('/delete').delete(verifyJWT, deleteStudent);

export default router;
