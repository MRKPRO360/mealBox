import mongoose, { Schema } from 'mongoose';
import { CustomerModel, ICustomer } from './customer.interface';
import {
  DISTRICTS,
  DIVISIONS,
  IUserAddress,
  IUserName,
} from '../../interface/user';
import { dietaryPreferences } from './customer.constant';

const customerNameSchema = new Schema<IUserName>(
  {
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

const customerAddressSchema = new Schema<IUserAddress>({
  street: { type: String, required: true },
  city: { type: String, enum: DIVISIONS, required: true },
  district: { type: String, enum: DISTRICTS, required: true },
  zipCode: { type: String, required: true },
});

const CustomerSchema = new Schema<ICustomer, CustomerModel>({
  name: {
    type: customerNameSchema,
    required: true,
  },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User id is required'],
    unique: true,
    ref: 'User',
  },
  dietaryPreferences: {
    type: [String],
    enum: dietaryPreferences,
    default: ['Vegetarian'],
  },
  orderHistory: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  address: {
    type: customerAddressSchema,
  },
  profileImg: String,
});

//virtual
CustomerSchema.virtual('fullName').get(function () {
  return this?.name?.firstName + this?.name?.lastName;
});

// Query Middleware
CustomerSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

CustomerSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//creating a custom static method
CustomerSchema.statics.isCustomerExistsById = async function (id: string) {
  return await Customer.findById(id);
};

const Customer = mongoose.model<ICustomer, CustomerModel>(
  'Customer',
  CustomerSchema,
);
export default Customer;
