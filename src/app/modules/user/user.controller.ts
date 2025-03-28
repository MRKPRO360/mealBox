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
  const { password, ...providerData } = req.body;

  const result = await UserServices.createProviderInDB(
    req.file,
    password,
    providerData,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Provider created successfully',
    data: result,
  });
});
const createAdmin = catchAsync(async (req, res) => {
  const { password, ...adminData } = req.body;

  const result = await UserServices.createAdminInDB(
    req.file,
    password,
    adminData,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { id, role } = req.user!;
  const result = await UserServices.getMe(id, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User is retrieved succesfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Status is updated succesfully',
    data: result,
  });
});

export const UserControllers = {
  createCustomer,
  createProvider,
  createAdmin,
  getMe,
  changeStatus,
};
