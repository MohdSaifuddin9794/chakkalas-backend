import crypto from 'crypto'
import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { findSourceMap } from 'module'
import { runInThisContext } from 'vm'
export const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        unique: true,
        required: [true, 'please enter your name']
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, 'please enter your email'],
        validate: [validator.isEmail,'Please enter valid email']
    },
    password: {
        type: String,
        trim: true,
        unique: true,
        minlength: [8, 'please enter your password 8 characters or above'],
        maxlength: [16, 'please enter your password 16 characters or below']
      
    },
    passwordConfirm: {
        type: String,
        trim: true,
        validate: {
            // This is only work on CREATE AND SAVE!
            validator: function (el) {
                return el === this.password
            },
            massege: 'password is not same as your password'
        }

    },
    photo: String,
    photoCover: String,
    passwordCreateAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
}) 

userSchema.pre('save', async function (next) {
    // this only run when user Modified the password
    if(!this.isModified('password')) return next()
    
    // use Hash to encrypt Your password
    this.password = await bcrypt.hash(this.password, 12)
    
    // set encrypted password and Delete the password confirm field
    this.passwordConfirm = undefined
    next()
})

userSchema.pre('save', function (next){
    if(!this.isModified('password') || this.isNew) return (next)

    this.passwordCreateAt = Date.now() - 1000

    next()
})

userSchema.pre(/^find/, function(next){
    this.find( { active : { $ne : false } } )
    next()
})

userSchema.methods.correctPassword = async function(
    cadidatePassword, 
    userPassword
    )
    {
 return bcrypt.compare(cadidatePassword, userPassword)
}
userSchema.methods.changedPasswordAfter = function( JWTTimestamp) {
 if(this.passwordChangedAt){
     const changedTimestamp = parseInt(
         this.passwordChangedAt.getTime() / 1000,
          10
          )
          return JWTTimestamp < changedTimestamp
 }
 return false;
}

userSchema.methods.createPasswordResetToken = function() {
  const resetToken =  crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto
  .createHash('sha256')
  .update(resetToken)
  .digest('hex')

  this.passwordTokenExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}
export default mongoose.model('User', userSchema);


