import User from './../models/userModel.js'
import catchAsync from './../util/catchAsync.js'
export const getAllUser = catchAsync(async (req, res, next) => {
  const user = await User.find()

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  })
})
export const getUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };
  export const createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };
  export const updateUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };
  export const deleteUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not yet defined!'
    });
  };

export default userController