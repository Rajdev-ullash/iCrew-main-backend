// Define your validations here

import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Service name is required',
    }),
    benefits: z.array(z.string()).refine(
      value => {
        return value !== undefined && value.length > 0; // Custom validation function
      },
      {
        message: 'At least one benefit is required', // Custom error message
        path: ['body', 'benefits'], // Path to the field in the error message
      }
    ),
    features: z.array(z.string()).refine(
      value => {
        return value !== undefined && value.length > 0; // Custom validation function
      },
      {
        message: 'At least one features is required', // Custom error message
        path: ['body', 'benefits'], // Path to the field in the error message
      }
    ),
  }),
});

const update = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Service name is required',
      })
      .optional(),
    benefits: z
      .array(z.string())
      .refine(
        value => {
          return value !== undefined && value.length > 0; // Custom validation function
        },
        {
          message: 'At least one benefit is required', // Custom error message
          path: ['body', 'benefits'], // Path to the field in the error message
        }
      )
      .optional(),
    features: z
      .array(z.string())
      .refine(
        value => {
          return value !== undefined && value.length > 0; // Custom validation function
        },
        {
          message: 'At least one features is required', // Custom error message
          path: ['body', 'benefits'], // Path to the field in the error message
        }
      )
      .optional(),
  }),
});

export const ServiceValidation = {
  create,
  update,
};
