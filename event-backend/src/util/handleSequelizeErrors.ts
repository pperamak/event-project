import { GraphQLError } from "graphql";
import {
  UniqueConstraintError,
  ValidationError as SequelizeValidationError,
  ForeignKeyConstraintError
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

    if (err instanceof ForeignKeyConstraintError) {
      throw new GraphQLError("Invalid foreign key reference", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Fall back: unexpected errors
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });

    
  }
};