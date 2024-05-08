import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { CloudinaryUploadFile } from '../../../interfaces/cloudinaryUpload';
import { ServiceService } from './services.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { serviceFilterableFields } from './services.constants';

// Your controller code here
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  // console.log(shopper);

  const data: any = {
    ...req.body,
    image: ((req.files as { image?: CloudinaryUploadFile[] })?.image ||
      []) as CloudinaryUploadFile[],
  };

  const result = await ServiceService.insertIntoDB(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, serviceFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ServiceService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ServiceService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service fetched successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id);
  // console.log(req.body);
  const result = await ServiceService.updateOneInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ServiceService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service deleted successfully',
    data: result,
  });
});

export const ServiceController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
