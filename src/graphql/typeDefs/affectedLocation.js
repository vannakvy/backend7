import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allAffectedLocations:[AffectedLocation!]!
    getAffectedLocationWithPagination(page:Int!, limit:Int!, keyword:String,startDate:Date, endDate:Date,status:String):AffectedLocationPaginator!
    getAffectedLocationById(id:ID!):AffectedLocation!
  }

  extend type Mutation{
    createAffectedLocation(newAffectedLocation:AffectedLocationInput):AffectedLocationResponseWithId! @isAuth(requires:SUPPER) 
    updateAffectedLocation(updatedAffectedLocation:AffectedLocationInput,id:ID!):AffectedLocationResponse! @isAuth(requires:SUPPER) 
    deleteAffectedLocation(id:ID!):AffectedLocationResponse! @isAuth(requires:SUPPER) 
  }

  type AffectedLocation {
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

  input AffectedLocationInput {
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
  type AffectedLocationResponse {
      success: Boolean 
      message:String
  }

  type AffectedLocationResponseWithId {
      success: Boolean 
      message:String
      affectedLocation: AffectedLocation
  }

  type AffectedLocationPaginator{
      affectedLocations:[AffectedLocation!]!
      paginator: Paginator!
  }
`