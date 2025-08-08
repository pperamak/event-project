import { ZodSchema } from 'zod';

/**
 * Parses and validates data using the provided Zod schema.
 * Throws a descriptive error if validation fails.
 *
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns - The validated data
 */
export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  return schema.parse(data); // Throws an error if validation fails
}