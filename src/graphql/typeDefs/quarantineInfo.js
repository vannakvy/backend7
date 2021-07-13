import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allQuarantineInfos:[QuarantineInfo!]!
    getQuarantineInfoWithPagination(page:Int!, limit:Int!, keyword:String):QuarantineInfoPaginator!
    getQuarantineInfoById(id:ID!):QuarantineInfo!
  }

  extend type Mutation{
    createQuarantineInfo(newQuarantineInfo:QuarantineInfoInput):QuarantineInfoResponse!
    updateQuarantineInfo(updatedQuarantineInfo:QuarantineInfoInput,id:ID!):QuarantineInfoResponse!
    deleteQuarantineInfo(id:ID!):QuarantineInfoResponse!
  }

  type QuarantineInfo {
        id:ID
        locationName:String
        village:String
        commune: String
        district: String
        province:String
        personInchage:String
        long: Float
        Lat: Float
        createdAt:Date 
        updatedAt:Date
        personInCharge:PersonInCharge
  }

  input QuarantineInfoInput {
        locationName:String
        village:String
        commune: String
        district: String
        province:String
        personInchage:String
        long: Float
        Lat: Float
        personIncharge:PersonInChargeInput
   
        
  }
  type QuarantineInfoResponse {
      success: Boolean 
      message:String
  }
  type PersonInCharge{
        firstName:String
        lastName:String
        position:String
        other:String
        tel:String
  }

  input PersonInChargeInput{
        firstName:String
        lastName:String
        position:String
        other:String
        tel:String
  }

  type QuarantineInfoPaginator{
      quarantineInfos:[QuarantineInfo!]!
      paginator: Paginator!
  }
`