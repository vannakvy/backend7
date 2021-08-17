import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allUserActions:[UserAction!]!
    getUserActionWithPagination(page:Int!, limit:Int!, keyword:String,startDate:Date, endDate:Date):UserActionPaginator!
    getUserActionById(id:ID!):UserAction!
  }

  extend type Mutation{
    createUserAction(newUserAction:UserActionInput):UserActionResponseWithId! @isAuth(requires:ADMIN) 
    updateUserAction(updatedUserAction:UserActionInput,id:ID!):UserActionResponse! @isAuth(requires:ADMIN) 
    deleteUserAction(id:ID!):UserActionResponse! @isAuth(requires:ADMIN) 
  }

  type UserAction {
        id:ID!
        action:String,
        userId:ID
        log:String 
        userName:String
  }

  input UserActionInput {
        locationName:String
        village:String
        commune:String 
  }
  type UserActionResponse {
      success: Boolean 
      message:String
  }

  type UserActionResponseWithId {
      success: Boolean 
      message:String
      UserAction: UserAction
  }

  type UserActionPaginator{
      UserActions:[UserAction!]!
      paginator: Paginator!
  }
`