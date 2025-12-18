import { GraphQLScalarType, Kind } from "graphql";

export const DateTime = new GraphQLScalarType({
  name: "DateTime",
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new Error("DateTime must be a Date");
  },
  parseValue(value) {
    return new Date(value as string);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});