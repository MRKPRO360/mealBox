import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { METHOD, USER_ROLE, UserStatus } from './user.constant';
import { IUser, UserModel } from './user.interface';
import { IUserName } from '../../interface/user';

const userNameSchema = new Schema<IUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },

  lastName: {
    type: String,
    trim: true,
    default: '',
  },
});
const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: userNameSchema,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
    },

    method: {
      type: String,
      enum: Object.values(METHOD),
      default: 'credentials',
      required: true,
    },

    status: {
      type: String,
      enum: UserStatus,
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.virtual('fullName').get(function () {
  return this?.name?.firstName + this?.name?.lastName;
});

userSchema.pre('save', async function (next) {
  // hashing password and save into DB
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsById = async function (id: string) {
  return await User.findById(id).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

// VIRTUAL
// userSchema.virtual('provider', {
//   ref: 'Customer',
//   localField: '_id',
//   foreignField: 'user',
//   justOne: true,
// });

userSchema.virtual('customer', {
  ref: 'Customer',
  localField: '_id',
  foreignField: 'user',
  justOne: true,
});

export const User = model<IUser, UserModel>('User', userSchema);
