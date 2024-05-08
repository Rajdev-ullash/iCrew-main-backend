import { Prisma, Service } from '@prisma/client';
import slugify from 'slugify';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { CloudinaryUploadFile } from '../../../interfaces/cloudinaryUpload';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import {
  deleteCloudinaryFiles,
  uploadToCloudinary,
} from '../../../shared/cloudinary';
import prisma from '../../../shared/prisma';
import { serviceSearchableFields } from './services.constants';
import { IServiceFilterRequest } from './services.interfaces';

// Your service code here
const insertIntoDB = async (data: Service): Promise<Service> => {
  const { name } = data;
  const baseSlug = slugify(name, { lower: true });
  const image = await uploadToCloudinary(
    data.image as unknown as CloudinaryUploadFile[]
  );
  const result = await prisma.service.create({
    data: {
      ...data,
      slug: baseSlug,
      image: image,
    },
  });
  // console.log(result);

  if (!result) {
    await deleteCloudinaryFiles(
      data.image as unknown as CloudinaryUploadFile[]
    );
  }

  return result;
};

const getAllFromDB = async (
  filters: IServiceFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Service[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, name, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: serviceSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.ServiceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.service.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.service.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Service | null> => {
  const result = await prisma.service.findUnique({
    where: {
      slug: id,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<Service>
): Promise<Service> => {
  const data = await prisma.service.findUnique({
    where: {
      slug: id,
    },
  });

  if (payload.image !== undefined && payload.image !== null) {
    const image = await uploadToCloudinary(
      payload.image as unknown as CloudinaryUploadFile[]
    );

    const result = await prisma.service.update({
      where: {
        id,
      },
      data: {
        ...payload,
        image,
      },
    });

    return result;
  } else {
    const result = await prisma.service.update({
      where: {
        id,
      },
      data: {
        ...payload,
        image: data?.image as Prisma.JsonValue[], // Assuming JsonValue type
      } as Prisma.ServiceUpdateInput,
    });

    return result;
  }
};

const deleteByIdFromDB = async (id: string): Promise<Service> => {
  const result = await prisma.service.delete({
    where: {
      slug: id,
    },
  });
  return result;
};

export const ServiceService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
