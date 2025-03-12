import { TRecipeMenuName } from './menuName.const';

export interface IMenuName extends Document {
  name: TRecipeMenuName;
  menuImg: string;
  isDeleted: boolean;
}
