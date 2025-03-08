import mongoose, { Schema } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';
import { DISTRICTS, IUserAddress, IUserName } from '../../interface/user';
import { User } from '../user/user.model';

const adminNameSchema = new Schema<IUserName>({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
});

const adminAddressSchema = new Schema<IUserAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, enum: DISTRICTS, required: true },
  zipCode: { type: String, required: true },
});

const adminSchema = new Schema<IAdmin, AdminModel>(
  {
    name: {
      type: adminNameSchema,
      required: true,
    },
    address: {
      type: adminAddressSchema,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
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

adminSchema.virtual('fullName').get(function () {
  return this?.name?.firstName + this?.name?.lastName;
});

adminSchema.statics.isAdminExistsById = async function (id: string) {
  return await User.findById(id);
};
const Admin = mongoose.model<IAdmin, AdminModel>('admin', adminSchema);

export default Admin;
