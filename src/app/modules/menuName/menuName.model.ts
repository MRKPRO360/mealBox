import { model, Schema } from 'mongoose';
import { IMenuName } from './menuName.interface';

const menuNameSchema = new Schema<IMenuName>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    menuImg: {
      type: String,
      required: true,
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

// TO INSERT ISDELETED PROPERTY
// menuNameSchema.pre('findOne', function (next) {
//   this.where('isDeleted', false);
//   next();
// });

const MenuName = model('MenuName', menuNameSchema);

export default MenuName;
