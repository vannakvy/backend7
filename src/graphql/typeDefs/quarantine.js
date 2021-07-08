import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allQuarantines:[Quarantine!]!
    getQuarantineWithPagination(page:Int!, limit:Int!, keyword:String):QuarantinePaginator!
    getQuarantineById(id:ID!):Quarantine!
  }

  extend type Mutation{
    createQuarantine(newQuarantine:QuarantineInput):QuarantineResponse!
    updateQuarantine(updatedQuarantine:QuarantineInput,id:ID!):QuarantineResponse!
    deleteQuarantine(id:ID!):QuarantineResponse!
  }

  type Quarantine {
        id:ID
        locationName:String
        village:String
        commune: String
        district: String
        province:String
        personInchage:String
        long: Float
        Lat: Float
        citizens: [Patient!]!
        createdAt:Date 
        updatedAt:Date
  }
  type Patient{
      startDate:Date
      endDate:Date 
      citizen:PersonalInfo!
  }

  input PatientInput{
      startDate:Date
      endDate:Date 
      citizen:ID!
  }

  input QuarantineInput {
        locationName:String
        village:String
        commune: String
        district: String
        province:String
        personInchage:String
        long: Float
        Lat: Float
  }
  type QuarantineResponse {
      success: Boolean 
      message:String
  }

  type QuarantinePaginator{
      Quarantines:[Quarantine!]!
      paginator: Paginator!
  }
`