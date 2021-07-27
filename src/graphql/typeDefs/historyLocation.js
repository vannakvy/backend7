import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allHistoryLocations:[HistoryLocation!]!
    getHistoryLocationById(id:ID!):HistoryLocation!
    getHistoryLocationByPersonalInfoId(personalId:ID!):[HistoryLocation!]!
  }

  extend type Mutation{
    createHistoryLocation(newHistoryLocation:HistoryLocationInput):HistoryLocationResponse!
    updatedHistoryLocation(updatedHistoryLocation:HistoryLocationInput,id:ID!):HistoryLocationResponse!
    deleteHistoryLocation(id:ID!):HistoryLocationResponse!
  }
  type HistoryLocation {
        id:ID!
        case:Case
        personalInfo:PersonalInfo
        affectedLocationId:AffectedLocation
        type:String
        date:Date
        other:String
  }
  input HistoryLocationInput {
        case:ID!
        personalInfo:ID!
        affectedLocationId:ID!
        type:String
        date:Date
        other:String
  }
  type HistoryLocationResponse {
      success: Boolean  
      message:String
  }

  type HistoryLocationPaginator{
      historyLocations:[HistoryLocation!]!
      paginator: Paginator!
  }
`

