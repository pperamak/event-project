import { GraphQLError, GraphQLFormattedError } from "graphql";
import { UniqueConstraintError, ValidationError as SequelizeValidationError } from "sequelize";

export const formatGraphQLError = (
  formattedError: GraphQLFormattedError,
  error: unknown
): GraphQLFormattedError => {
  if (error instanceof GraphQLError) {
    const originalError = error.originalError;

    if ( originalError instanceof UniqueConstraintError) {
      return new GraphQLError("Email must be unique", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    if (originalError instanceof SequelizeValidationError) {
      return new GraphQLError("Invalid input", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }
  }

  return formattedError;
};