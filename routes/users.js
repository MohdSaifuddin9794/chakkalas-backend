import express from 'express';
import userController from './../controller/userController.js'
import authController from './../controller/authController.js'
let router = express.Router();
// ..stuff below

router.post('/register',authController.ragister);
router.post('/login',authController.login);

router.post('/forgetPassword',authController.forgetPassword);
router.patch('/resetPassword/:token',authController.resetPassword);

router
.patch('/updateMyPassword',
 authController.protect, 
 authController.updateMyPassword
);

router.patch('/updateMe', authController.updateMe);
router.delete('/deleteMe', authController.deleteMe);

router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);

router
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);
export default router;

