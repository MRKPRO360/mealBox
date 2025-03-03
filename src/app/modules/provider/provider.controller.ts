import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProviderServices } from './provider.service';

const getAllProviders = catchAsync(async (req, res) => {
  const provider = await ProviderServices.getAllProvidersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Providers retrieved successfully',
    data: provider,
  });
});

const getSingleProvider = catchAsync(async (req, res) => {
  const { id } = req.params;
  const provider = await ProviderServices.getSingleProviderFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Provider retrieved successfully',
    data: provider,
  });
});

const deleteProvider = catchAsync(async (req, res) => {
  const { id } = req.params;
  const provider = await ProviderServices.deleteProviderFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Provider deleted successfully',
    data: provider,
  });
});

export const ProviderControllers = {
  getAllProviders,
  getSingleProvider,
  deleteProvider,
};
