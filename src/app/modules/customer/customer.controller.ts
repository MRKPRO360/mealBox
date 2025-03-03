import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CustomerServices } from './customer.service';

const getAllCustomers = catchAsync(async (req, res) => {
  const customers = await CustomerServices.getAllCustomersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customers retrieved successfully',
    data: customers,
  });
});

const getSingleCustomer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const customers = await CustomerServices.getSingleCustomerFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customers retrieved successfully',
    data: customers,
  });
});

const deleteCustomer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const customers = await CustomerServices.deleteCustomerFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer deleted successfully',
    data: customers,
  });
});

export const CustomerControllers = {
  getAllCustomers,
  getSingleCustomer,
  deleteCustomer,
};
