import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: "Validation error", details: error.issues });
  } else if (error instanceof Error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
    console.error("Unknown error:", error);
    res.status(500).json({ error: "Unknown error occurred" });
  }
};