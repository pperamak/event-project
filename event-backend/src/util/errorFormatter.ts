import { GraphQLError, GraphQLFormattedError } from "graphql";
import { UniqueConstraintError, ValidationError as SequelizeValidationError } from "sequelize";
import jwt from "jsonwebtoken";
const { JsonWebTokenError, TokenExpiredError, NotBeforeError } = jwt;

export const formatGraphQLError = (
  formattedError: GraphQLFormattedError,
  error: unknown
): GraphQLFormattedError => {

  console.error("GraphQL Error:", error);

  if (error instanceof GraphQLError) {
    const originalError = error.originalError;

    if (originalError instanceof JsonWebTokenError) {
      return new GraphQLError("Invalid token", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    if (originalError instanceof TokenExpiredError) {
      return new GraphQLError("Token expired", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    if (originalError instanceof NotBeforeError) {
      return new GraphQLError("Token not active yet", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

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

    if (!error.extensions?.code || error.extensions.code === "INTERNAL_SERVER_ERROR") {
      return {
        message: "Internal server error",
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      };
    }
  }
  return formattedError;
};