import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    allHospitalizations: [Hospitalization!]!
    getHospitalizationWithPagination(
      page: Int!
      limit: Int!
      keyword: String
    ): HospitalizePaginator!
    getHospitalizationById(id: ID!): Hospitalization!
  }

  extend type Mutation {
    createHospitalization(
      newHospitalization: HospitalizeInput
    ): HospitalizeResponse!
    updateHospitalization(
      updatedHospitalization: HospitalizeInput
      id: ID!
    ): HospitalizeResponse!
    deleteHospitalization(id: ID!): HospitalizeResponse!
  }

  type Hospitalization {
    id: ID!
    hostpitalName: String
    village: String
    commune: String
    district: String
    province: String
    personInchage: String
    long: Float
    Lat: Float
    personalInfo: [Patient!]!
    createdAt: Date
    updatedAt: Date
  }

  input HospitalizeInput {
    hostpitalName: String
    village: String
    commune: String
    district: String
    province: String
    personInchage: String
    long: Float
    Lat: Float
  }

  type HospitalizeResponse {
    success: Boolean
    message: String
  }

  type HospitalizePaginator {
    hospitalizations: [Hospitalization!]!
    paginator: Paginator!
  }
`;
