import util from 'util';
// import { promisify } from 'promisify';
import User from'./../models/userModel.js'
import AppError from'./../util/appError.js'
import catchAsync from './../util/catchAsync.js'
import jwt from 'jsonwebtoken'
export const signtoken = id => {
 return jwt.sign( { id }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN
})
}
export const register = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        photo: req.body.photo,
        photoCover: req.body.photoCover,
        passwordConfirm: req.body.passwordConfirm
    })
    const token = signtoken(newUser._id)
    res.status(200).json({
        status: 'success',
        token,
        data: {
           user: newUser
        }
    })
})
export const login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body
    // check the user email or password exist
    if(!email || !password){
        return next (new AppError('Please Enter the email and Password', 400))
    }
    //   chenck if  user is exist && password correct
    const user = await User.findOne({ email }).select('+password')
     
    if(!user || !(await user.correctPassword(password, userPassword))){
        return next (new AppError('Please Enter the Right email and Password', 401))
    }

    // if Everything is ok send the token
    const token = signtoken(user._id)
    res.status(200).json({
        status: 'success',
        token
    })

})
export const protect = catchAsync(async (req, res, next) => {
  // Getting token and check of it's there
  let token
   if(
       req.headers.authorization && 
       req.headers.authorization.startsWith('Bearet')
       )
       {
       token = req.headers.authorization.split(' ')[1];
   }
   console.log(token);

if(!token) {
   return (next (new AppError('You are not logged in! Please log in to get Aceess', 401)));
}
  // Verification token
 const decoded = await (jwt.verify)(token, process.env.JWT_TOKEN_SECRET)
  // Check if user Still exists
  const currentUser = await User.findOne(decoded.id)
  if(!currentUser) {

  }
  // Check if user changed password after the token was issued 
  next();
})
export default authController