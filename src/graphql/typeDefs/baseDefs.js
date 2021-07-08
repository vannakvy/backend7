import {
    gql
} from 'apollo-server-express';

export default gql`
        # directive @isAuth on FIELD_DEFINITION
        # directive @isDeveloper on FIELD_DEFINITION

        directive @isAuth(
            requires: Roles = BASIC,
          ) on OBJECT | FIELD_DEFINITION
          
          enum Roles {
            BASIC,
            ADMIN,
            DEVELOPER,
            POLICE
          }
        
        type Query {
            _:String
        }
        type Mutation{
            _:String
        }
        type Subscription {
            _:String
        }
`;