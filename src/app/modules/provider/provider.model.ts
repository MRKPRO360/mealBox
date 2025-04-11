import mongoose, { Schema } from 'mongoose';
import { IProvider, ProviderModel } from './provider.interface';
import {
  DISTRICTS,
  DIVISIONS,
  IUserAddress,
  IUserName,
} from '../../interface/user';
import { User } from '../user/user.model';
import { CUISINE_SPECIALTIES } from './provider.constant';

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
  street: { type: String, required: false }, // explicitly set required to false
  city: { type: String, enum: DIVISIONS, required: false },
  district: { type: String, enum: DISTRICTS, required: false },
  zipCode: { type: String, required: false }, // explicitly set required to false
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

    address: {
      type: providerAddressSchema,
    },
    profileImg: String,
    cuisineSpecialties: {
      type: [String],
      enum: CUISINE_SPECIALTIES,
      default: ['American', 'Indian'],
    },

    availableMealOptions: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    rating: { type: Number, default: 3 }, // Range: 1-5 stars.
    ratingsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

//virtual
providerSchema.virtual('fullName').get(function () {
  return this?.name?.firstName + ' ' + this?.name?.lastName;
});

// Query Middleware
providerSchema.pre('find', async function (next) {
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

// VIRTUAL POPULATE

providerSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'targetId',
  localField: '_id',
  options: {
    match: {
      targetType: 'provider',
    },
  },
});

const Provider = mongoose.model<IProvider, ProviderModel>(
  'provider',
  providerSchema,
);
export default Provider;
