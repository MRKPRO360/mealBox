import mongoose, { Schema } from 'mongoose';
import { IProvider, ProviderModel } from './provider.interface';
import {
  DISTRICTS,
  DIVISIONS,
  IUserAddress,
  IUserName,
} from '../../interface/user';
import { User } from '../user/user.model';

const providerNameSchema = new Schema<IUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },

  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last Name is required'],
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
});

const providerAddressSchema = new Schema<IUserAddress>({
  street: { type: String, required: true },
  city: { type: String, enum: DIVISIONS, required: true },
  district: { type: String, enum: DISTRICTS, required: true },
  zipCode: { type: String, required: true },
});

const providerSchema = new Schema<IProvider, ProviderModel>(
  {
    name: {
      type: providerNameSchema,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    orderHistory: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    address: {
      type: providerAddressSchema,
    },
    profileImg: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

//virtual
providerSchema.virtual('fullName').get(function () {
  return this?.name?.firstName + this?.name?.lastName;
});

// Query Middleware
providerSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

providerSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//creating a custom static method
providerSchema.statics.isproviderExistsById = async function (id: string) {
  return await User.findById(id);
};

const Provider = mongoose.model<IProvider, ProviderModel>(
  'provider',
  providerSchema,
);
export default Provider;
