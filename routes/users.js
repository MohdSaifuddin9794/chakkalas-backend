import express from 'express';
import { getAllUser, createUser, getUser, updateUser, deleteUser } from './../controller/userController.js'
import { register, login, protect, forgotpassword, resetPassword } from './../controller/authController.js'
let router = express.Router();
// ..stuff below

router.post('/register',register);
router.post('/login',login);

router.post('/forgetPassword',forgotpassword);
router.patch('/resetPassword/:token',resetPassword);

router
.patch('/updateMyPassword',
 protect
//  updateMyPassword
);

// router.patch('/updateMe', updateMe);
// router.delete('/deleteMe', authController.deleteMe);

router
.route('/')
.get(getAllUser)
.post(createUser);

router
.route('/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser);
export default router;

