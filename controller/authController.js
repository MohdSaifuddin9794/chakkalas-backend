import { promisify } from "util";
import User from "./../models/userModel.js";
import AppError from "./../util/appError.js";
import catchAsync from "./../util/catchAsync.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "./../util/email.js";

export const signtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};
export const register = catchAsync(async (req, res, next) => {
  console.log("Coming here");
  console.log("Nody data ", req.body);
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    photo: req.body.photo,
    photoCover: req.body.photoCover,
    passwordConfirm: req.body.passwordConfirm,
  });
  console.log("Here 2");
  await newUser.save();
  console.log("New user ", newUser);

  const token = signtoken(newUser._id);
  res.status(200).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check the user email or password exist
  if (!email || !password) {
    return next(new AppError("User email and password  do not exist", 400));
  }
  //   chenck if  user is exist && password correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, userPassword))) {
    return next(new AppError("Please Enter the Right email and Password", 401));
  }

  // if Everything is ok send the token
  const token = signtoken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});
export const protect = catchAsync(async (req, res, next) => {
  // Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get Aceess", 401)
    );
  }
  // Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_TOKEN_SECRET
  );
  // Check if user Still exists
  const currentUser = await User.findOne(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user is belonging to this token does no longer exist",
        401
      )
    );
  }
  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User Recently changed password! Please log in again", 401)
    );
  }

  // GET Access to Protected Route
  req.body = currentUser;
  next();
});

export const forgotpassword = catchAsync(async (req, res, next) => {
  // Get user based on POSTED Emai/l
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email Address", 404));
  }

  // Generate the random reset token /
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // Send it to user's email/
  const resetURL = `${req.protocol}://${req.get(
    "http"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot  Your Password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forgot your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token (Valid for 10min)`,
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There Was an error sending the email. Try again later!"),
      500
    );
  }
});
export const resetPassword = catchAsync(async (req, res, next) => {
  // get user based on the token
  const hasherToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hasherTokenToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // if token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.save();
  // update changedPasswordAt property for the  user
  // Log the user in, send jwt

  const token = signtoken(user.id);
  res.status(200).json({
    status: "success",
    token,
  });
});
