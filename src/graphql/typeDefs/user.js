import {
    gql
} from "apollo-server-express";

export default gql`
    extend type Query {
        # the rules start from the right to the left
        authUser: User! @isAuth(requires:ADMIN) 
        allUsers:[User!] @isAuth(requires:ADMIN) 
        getCurrentUser:User! 
        getUserWithPagination(page:Int,limit:Int,keyword:String):UserPaginator!  @isAuth(requires:ADMIN) 
    }
    extend type Mutation {
        registerUser(newUser: UserInput!): userResponse! @isAuth(requires:ADMIN) 
        addRole(userId:ID!role:String!): userResponse! @isAuth(requires:ADMIN) 
        addPage(userId:ID!page:String!): userResponse! @isAuth(requires:ADMIN) 
        deleteRole(userId:ID!,roleId:ID!): userResponse! @isAuth(requires:ADMIN) 
        deletePages(userId:ID!,pageId:ID!): userResponse! @isAuth(requires:ADMIN) 
        loginUser(username: String!, password: String!):Loggineduser! 
        deleteUser(userId:ID!):userResponse! @isAuth(requires:ADMIN) 
        updateAccount(userId:ID!,password:String!,username:String!):userResponse! @isAuth(requires:ADMIN) 
        updateUserDetail(userId:ID!,tel:String!,firstName:String!,lastName:String!,email:String!):userResponse! @isAuth(requires:ADMIN) 
        updateProfileImage(userId:ID!,image:String!):userResponse!
    }

    type Loggineduser{
        token:String,
         user:User

    }
    input UserInput {
        email:String!
        username:String!
        lastName: String!
        password: String!
        firstName: String!
        role: String!
        page:String,
        tel:String!
    }

    type User {
        id: ID!
        email:String!
        username:String!
        lastName: String!
        firstName: String!
        image:String
        roles:[Role!]!
        pages:[Page]!
        createdAt: String
        updatedAt: String
        tel:String
    }

    # type AuthUser {
    #     user: User!
    #     token:String!
    # }
    type Role {
       id:ID!
       role:String!
      }
      type Page {
       id:ID!
       page:String!
      }

      type userResponse{
          success: Boolean!
          message: String!

      }

    #   //for building the customer date 

     scalar Date

      type UserPaginator {
        users: [User!]!
        paginator: Paginator!
    }
    type Paginator {
        slNo: Int
        prev: Int
        next: Int
        perPage: Int
        totalPosts: Int
        totalPages: Int
        currentPage: Int
        hasPrevPage: Boolean
        hasNextPage: Boolean
        totalDocs:Int
    }
`;


