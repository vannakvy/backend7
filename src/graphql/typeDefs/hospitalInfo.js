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
    ): HospitalInfoResponse!
    updateHospitalInfo(
      updatedHospitalInfo: HospitalInfoInput
      id: ID!
    ): HospitalInfoResponse!
    deleteHospitalInfo(id: ID!): HospitalInfoResponse!
  }

  type HospitalInfo {
    id: ID!
    hostpitalName: String
    village: String
    commune: String
    district: String
    province: String
    long: Float
    Lat: Float
    createdAt: Date
    updatedAt: Date
    personInCharge: PersonInCharge
    
  }

  input HospitalInfoInput {
    hostpitalName: String
    village: String
    commune: String
    district: String
    province: String
    long: Float
    Lat: Float
    personInCharge:PersonInChargeInput
  }

  type HospitalInfoResponse {
    success: Boolean
    message: String
  }

  type HospitalInfoPaginator {
    hospitalInfos: [HospitalInfo!]!
    paginator: Paginator!
  }
`;
