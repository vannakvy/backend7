import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allQuarantineInfos:[QuarantineInfo!]!
    getQuarantineInfoWithPagination(page:Int!, limit:Int!, keyword:String):QuarantineInfoPaginator!
    getQuarantineInfoById(id:ID!):QuarantineInfo!
  }

  extend type Mutation{
    createQuarantineInfo(newQuarantineInfo:QuarantineInfoInput):QuarantineInfoResponseWidthData! @isAuth(requires:SUPPER) 
    updateQuarantineInfo(updatedQuarantineInfo:QuarantineInfoInput,id:ID!):QuarantineInfoResponse! @isAuth(requires:SUPPER) 
    deleteQuarantineInfo(id:ID!):QuarantineInfoResponse! @isAuth(requires:SUPPER) 
  }

  type QuarantineInfo {
        capacity:Int
        id:ID
        locationName:String
        village:String
        commune: String
        district: String
        province:String
        long: Float
        lat: Float
        createdAt:Date 
        updatedAt:Date
        personInCharge:PersonInCharge
        other:String
        vaccinated:Int
        locationType:String
        forPeopleType:String
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
        vaccinated:Int
        locationType:String
        forPeopleType:String
  }
  type QuarantineInfoResponse {
      success: Boolean 
      message:String
  }
  type QuarantineInfoResponseWidthData{
      success: Boolean 
      message:String
      quarantineInfo:QuarantineInfo
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

