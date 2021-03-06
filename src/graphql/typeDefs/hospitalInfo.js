import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    allHospitalInfos: [HospitalInfo!]!
    reportForImmigrantWorker(hospitalId:ID!):[recoveredReport!]

    getHospitalInfoWithPagination(
      page: Int!
      limit: Int!
      keyword: String
    ): HospitalInfoPaginator!
    getHospitalInfoById(id: ID!): HospitalInfo!
    hospitalDashboard(hospitalInfo:ID!):totalDataInHospital
  }
 
  extend type Mutation {
    createHospitalInfo(
      newHospitalInfo: HospitalInfoInput
    ): HospitalInfoResponseWithData! @isAuth(requires:SUPPER) 
    updateHospitalInfo(
      updatedHospitalInfo: HospitalInfoInput
      id: ID!
    ): HospitalInfoResponse! @isAuth(requires:SUPPER) 
    deleteHospitalInfo(id: ID!): HospitalInfoResponse! @isAuth(requires:SUPPER) 
  }
type recoveredReport{
  _id:String,
  total:Int
}
  type totalDataInHospital {
             totalIn:Int
             totalDeltaIn:Int 
             totalInWomen:Int
             totalInToday:Int
             totalInTodayWomen:Int
             totalOut:Int
             totalOutWomen:Int
             totalOutDelta:Int 
             totalOutToday:Int
             totalOutTodayWomen:Int 

  }

  type HospitalInfo {
    id: ID!
    hospitalName: String
    village: String
    commune: String
    district: String
    province: String
    long: Float
    lat: Float
    other:String
    createdAt: Date
    updatedAt: Date
    personInCharge: PersonInCharge
    locationType: String
  }

  input HospitalInfoInput {
    hospitalName: String
    village: String
    commune: String
    district: String
    province: String
    long: Float
    lat: Float
    other:String
    personInCharge:PersonInChargeInput
    locationType: String
  }

  type HospitalInfoResponse {
    success: Boolean
    message: String
  }

  type HospitalInfoResponseWithData{
    success: Boolean
    message: String
    hospitalInfos:HospitalInfo
  }

  type HospitalInfoPaginator {
    hospitalInfos: [HospitalInfo!]!
    paginator: Paginator!
  }
`;
