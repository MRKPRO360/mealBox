import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProviderServices } from './provider.service';

const getAllCuisineSpecialties = catchAsync(async (req, res) => {
  const cuisineSpecialties =
    await ProviderServices.getAllCuisineSpecialtiesFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cusine specialties retrieved successfully',
    data: cuisineSpecialties,
  });
});

const getAllProviders = catchAsync(async (req, res) => {
  const provider = await ProviderServices.getAllProvidersFromDB(req?.query);

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

const updateProvider = catchAsync(async (req, res) => {
  const result = await ProviderServices.updateProviderInDB(req.body, req.file);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Provider updated successfully!',
    data: result,
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
  getAllCuisineSpecialties,
  getAllProviders,
  getSingleProvider,
  updateProvider,
  deleteProvider,
};
