import { defaultFieldResolver } from "graphql";
import { ApolloError, SchemaDirectiveVisitor } from "apollo-server-express";

export class IsAuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      let [_, {}, {next, user, isAuth,roles }] = args;
      if (isAuth) {
        const result = await resolve.apply(this, args);
        return result;
      } else {
        throw new ApolloError(
          "អ្នកមិនត្រូវបានអនុញ្ញាតិអោយធ្វើការងារនេះទេ"
        );
      }
    };
  }
}
