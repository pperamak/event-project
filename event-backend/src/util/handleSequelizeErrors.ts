import { GraphQLError } from "graphql";
import {
  UniqueConstraintError,
  ValidationError as SequelizeValidationError,
} from "sequelize";

/**
 * Wraps a function that might throw Sequelize errors
 * and rethrows them as GraphQL-friendly errors.
 */
export const handleSequelizeErrors = async <T>(
  fn: () => Promise<T>
): Promise<T> => {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      throw new GraphQLError("Email must be unique", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    if (err instanceof SequelizeValidationError) {
      throw new GraphQLError("Invalid input", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    throw err; // let unknown errors bubble up
  }
};