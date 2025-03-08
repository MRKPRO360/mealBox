import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MenuNameServices } from './menuName.service';

const createMenuName = catchAsync(async (req, res) => {
  const menuName = await MenuNameServices.createMenuNameInDB(
    req.file,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Recipe menu name created successfully!',
    data: menuName,
  });
});
const getAllMenuName = catchAsync(async (req, res) => {
  const menuName = await MenuNameServices.getAllMenuNamesFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recipe menu name retrieved successfully!',
    data: menuName,
  });
});
const updateMenuName = catchAsync(async (req, res) => {
  const { id } = req.params;

  const menuName = await MenuNameServices.updateSingleMenuFromDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recipe menu name updated successfully!',
    data: menuName,
  });
});

const deleteMenuName = catchAsync(async (req, res) => {
  const { id } = req.params;

  const menuName = await MenuNameServices.deleteMenuFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Recipe menu name deleted successfully!',
    data: menuName,
  });
});

export const MenuNameControllers = {
  createMenuName,
  getAllMenuName,
  updateMenuName,
  deleteMenuName,
};
