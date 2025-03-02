import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createCustomer = catchAsync(async (req, res) => {
  const { password, ...customerData } = req.body;

  const result = await UserServices.createCustomerInDB(
    req.file,
    password,
    customerData,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Customer created successfully',
    data: result,
  });
});
const createProvider = catchAsync(async (req, res) => {
  const { password, ...customerData } = req.body;

  const result = await UserServices.createCustomerInDB(
    req.file,
    password,
    customerData,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Provider created successfully',
    data: result,
  });
});
const createAdmin = catchAsync(async (req, res) => {
  const { password, ...customerData } = req.body;

  const result = await UserServices.createAdminInDB(
    req.file,
    password,
    customerData,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

export const UserControllers = {
  createCustomer,
  createProvider,
  createAdmin,
};
