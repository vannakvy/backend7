import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    allHospitalInfos: [HospitalInfo!]!
    getHospitalInfoWithPagination(
      page: Int!
      limit: Int!
      keyword: String
    ): HospitalInfoPaginator!
    getHospitalInfoById(id: ID!): HospitalInfo!
  }

  extend type Mutation {
    createHospitalInfo(
      newHospitalInfo: HospitalInfoInput
    ): HospitalInfoResponseWithData!
    updateHospitalInfo(
      updatedHospitalInfo: HospitalInfoInput
      id: ID!
    ): HospitalInfoResponse!
    deleteHospitalInfo(id: ID!): HospitalInfoResponse!
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
