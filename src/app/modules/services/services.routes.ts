// Define your routes here

import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ServiceController } from './services.controller';
import { configureImagesUpload } from './services.utils';
import { ServiceValidation } from './services.validations';
const router = express.Router();

// Define your routes here
router.get('/', ServiceController.getAllFromDB);
router.get('/:id', ServiceController.getByIdFromDB);

router.post(
  '/',
  validateRequest(ServiceValidation.create),
  configureImagesUpload(),
  ServiceController.insertIntoDB
);
router.patch(
  '/:id',
  validateRequest(ServiceValidation.update),
  configureImagesUpload(),
  ServiceController.updateOneInDB
);
router.delete('/:id', ServiceController.deleteByIdFromDB);

export const ServiceRoutes = router;
