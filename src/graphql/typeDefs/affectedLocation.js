import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allAffectedLocations:[AffectedLocation!]!
    getAffectedLocationWithPagination(page:Int!, limit:Int!, keyword:String,startDate:Date, endDate:Date):AffectedLocationPaginator!
    getAffectedLocationById(id:ID!):AffectedLocation!
  }

  extend type Mutation{
    createAffectedLocation(newAffectedLocation:AffectedLocationInput):AffectedLocationResponseWithId!
    updateAffectedLocation(updatedAffectedLocation:AffectedLocationInput,id:ID!):AffectedLocationResponse!
    deleteAffectedLocation(id:ID!):AffectedLocationResponse!
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