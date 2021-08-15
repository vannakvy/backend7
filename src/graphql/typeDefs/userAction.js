import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allUserActions:[UserAction!]!
    getUserActionWithPagination(page:Int!, limit:Int!, keyword:String,startDate:Date, endDate:Date):UserActionPaginator!
    getUserActionById(id:ID!):UserAction!
  }

  extend type Mutation{
    createUserAction(newUserAction:UserActionInput):UserActionResponseWithId! @isAuth(requires:SUPPER) 
    updateUserAction(updatedUserAction:UserActionInput,id:ID!):UserActionResponse! @isAuth(requires:SUPPER) 
    deleteUserAction(id:ID!):UserActionResponse! @isAuth(requires:SUPPER) 
  }

  type UserAction {
        id:ID!
        locationName:String
        village:String
        commune:String
        district:String
        province:String
        other:String
        openAt:Date 
        closeAt:Date
        long:Float
        lat:Float
        coorporate:Boolean
        infected:Boolean
        createdAt:Date 
        updatedAt:Date
        locationType:String
  }

  input UserActionInput {
        locationName:String
        village:String
        commune:String
        district:String
        province:String
        other:String
        openAt:Date 
        closeAt:Date
        long:Float
        lat:Float
        coorporate:Boolean
        infected:Boolean
        locationType:String
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