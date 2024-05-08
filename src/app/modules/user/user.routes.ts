import express from 'express';
// Define your routes here

import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validations';
const router = express.Router();

router.post(
  '/create-admin',
  validateRequest(UserValidation.createAdmin),
  UserController.createAdmin
);


export const UserRoutes = router;
