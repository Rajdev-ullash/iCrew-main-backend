import { Admin, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const createAdmin = async (admin: Admin, user: User): Promise<User | null> => {
  // set role
  user.role = 'admin';
  user.isVerified = false;

  const isEmailExist = await prisma.admin.findFirst({
    where: {
      email: admin.email,
    },
  });

  if (isEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This email already exists');
  }

  const isMobileNumberExist = await prisma.admin.findFirst({
    where: {
      mobileNumber: admin.mobileNumber,
    },
  });

  if (isMobileNumberExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This mobile number already exists'
    );
  }

  const isUserNameExist = await prisma.admin.findFirst({
    where: {
      username: admin.username,
    },
  });

  if (isUserNameExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This username already exists');
  }

  const hashedPassword = await bcrypt.hash(
    user.password,
    Number(config.bycrypt_salt_rounds)
  );

  const data = await prisma.$transaction(async transactionClient => {
    const admins = await transactionClient.admin.create({
      data: {
        email: admin.email,
        username: admin.username,
        mobileNumber: admin.mobileNumber,
      },
    });

    const createNewUser = await transactionClient.user.create({
      data: {
        role: user.role,
        password: hashedPassword,
        adminId: admins.id,
      },
      include: {
        admin: true,
      },
    });

    if (!createNewUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    return createNewUser;
  });
  return data;
};

export const UserService = {
  createAdmin,
};
