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
        capacity:Int
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
        other:String
  }

  input QuarantineInfoInput {
        locationName:String
        village:String
        commune: String
        district: String
        province:String
        long: Float
        lat: Float
        other:String
        capacity:Int
        personInCharge:PersonInChargeInput
  }
  type QuarantineInfoResponse {
      success: Boolean 
      message:String
  }
  type PersonInCharge{
        firstName:String
        lastName:String
        position:String
        others:String
        tel:String
  }

  input PersonInChargeInput{
        firstName:String
        lastName:String
        position:String
        others:String
        tel:String
  }

  type QuarantineInfoPaginator{
      quarantineInfos:[QuarantineInfo!]!
      paginator: Paginator!
  }
`

