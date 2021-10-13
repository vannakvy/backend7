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
            SUPPER,
            DEVELOPER,
            POLICE,
            DOCTOR,
            OFFICER,
            QUARANTINECONTROLLER,
            DELETE_TRANSACTION,
            CREATE_TRANSACTION,
            UPDATE_TRANSACTION,
            CREATE_SHOP,
            DELETE_SHOP,
            UPDATE_SHOP,
            CREATE_PERSONALINFO,
            UPDATE_PERSONALINFO,
            DELETE_PERSONALINFO,
            PRINT_QRCODE,
            VIEW_SHOP_DETAIL,
            VIEW_BUYER_DETAIL,
            VIEW_ALL_SHOP,
            VIEW_SELLER,
            VIEW_ONE_SHOP,
            SHOP,
            VIEW_BUYER



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