import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateReqBody = (schema: z.ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Parse and validate the reques body
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    next(error);
    //tähän tulee
    // Return validation error response
    //res.status(400).json({
      //error: "Invalid query parameters",
      //details: err.errors, // Provide detailed validation errors
    };
  };