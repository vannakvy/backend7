import { defaultFieldResolver } from "graphql";
import { ApolloError, SchemaDirectiveVisitor } from "apollo-server-express";

export class IsDeveloperDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      let [_, {}, { user, isAuth,roles }] = args;
    //   const isDeveloper = user.roles.includes({role:"BASIC"})
      if (isAuth) {
          console.log(user)
        const result = await resolve.apply(this, args);
        return result;
      } else {
        throw new ApolloError(
          "You must be the authenticated and a Developer to do this action"
        );
      }
    };
  }
}
