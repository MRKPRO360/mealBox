import { model, Schema } from 'mongoose';
import { IMenuName } from './menuName.interface';

const menuNameSchema = new Schema<IMenuName>({
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
});

const MenuName = model('MenuName', menuNameSchema);

export default MenuName;
