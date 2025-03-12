/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMenuName } from './menuName.interface';
import MenuName from './menuName.model';

const createMenuNameInDB = async (file: any, payload: IMenuName) => {
  return await MenuName.create({ ...payload, menuImg: file?.path || '' });
};

const getAllMenuNamesFromDB = async () => {
  return await MenuName.find({});
};
const updateSingleMenuFromDB = async (
  id: string,
  payload: Partial<IMenuName>,
) => {
  return await MenuName.findByIdAndUpdate(id, payload);
};
const deleteMenuFromDB = async (id: string) => {
  return await MenuName.findByIdAndUpdate(id, {
    isDeleted: true,
  });
};

export const MenuNameServices = {
  createMenuNameInDB,
  getAllMenuNamesFromDB,
  updateSingleMenuFromDB,
  deleteMenuFromDB,
};
