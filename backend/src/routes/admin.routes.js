import { Router } from 'express';

import{
    adminRegister,
    adminLogin,
    adminLogout,
    refreshAdminAccessToken,
    changeAdminCurrentPassword,
} from '../controllers/adminController.js';

const router = Router();

// admin
router.post('/admin/register', adminRegister);
router.route('/admin/login').post(adminLogin);
router.route('/admin/logout').post(verifyJWT, adminLogout);
router.route('/admin/refresh-token').post(refreshAdminAccessToken);
router.route('/admin/change-password').post(verifyJWT, changeAdminCurrentPassword);

export default router;
