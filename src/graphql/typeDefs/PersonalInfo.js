import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    allPersonalInfos: [PersonalInfo!]!
    getPersonalInfoById(id: ID!): PersonalInfo!
    getPersonalInfoWithPagination(
      page: Int!
      limit: Int!
      keyword: String
    ): PaginateResponse!
    getPersonalInfoByCaseWithPagination(
      page: Int!
      limit: Int!
      keyword: String
      caseId:ID!
    ): PaginateResponse!
  }

  extend type Mutation {
    createPersonalInfo(newInfo: PersonalInfoInput!): PersonalInfoResponse
    recordSampleTest(sampleTest:SampleTestInput!,personalInfoId:ID!):PersonalInfoResponse!
    updatePersonalInfo(
      updatedInfo: PersonalInfoInput!
      id: ID!
    ): PersonalInfoResponse
    deletePersonalInfo(id: ID!): PersonalInfoResponse
  }

  type PersonalInfo {
    id: ID
    firstName: String
    lastName: String
    age: Int
    gender: String
    tel: String
    nationality: String
    occupation: String
    idCard: String
    profileImg: String
    village: String
    commune: String
    district: String
    province: String
    case:Case
    direct: Boolean
    other:String
    relapse: Boolean
    relapseAt: Date
    vaccinated: Int
    createdAt: Date
    updatedAt: Date
    currentState: currentStatus
    sampleTest:[SampleTest]
  }

  type currentStatus{
        confirm:Boolean,
        confirmedAt:Date,
        recovered:Boolean,
        recoveredAt:Date,
        death:Boolean,
        deathAt:Date
  }
  type SampleTest{
    id:ID!
    date: Date,
    times:Int,
    location:String,
    result:Boolean,
    symptom:String,
    other:String,
  }

  input SampleTestInput{
    date: Date,
    times:Int,
    location:String,
    result:Boolean,
    symptom:String,
    other:String,
  }
  input currentStatusInput{
        confirm:Boolean,
        confirmedAt:Date,
        recovered:Boolean,
        recoveredAt:Date,
        death:Boolean,
        deathAt:Date
  }

  
  input PersonalInfoInput {
    currentState:currentStatusInput
    firstName: String
    lastName: String
    age: Int
    case:ID!
    direct: Boolean
    gender: String
    other:String
    tel: String
    nationality: String
    occupation: String
    idCard: String
    profileImg: String
    village: String
    commune: String
    district: String
    province: String
    relapse: Boolean
    relapseAt: Date
    vaccinated: Int
  }
  type PersonalInfoResponse {
    success: Boolean
    message: String
  }

  type PaginateResponse {
    paginator: Paginator
    personalInfos: [PersonalInfo!]!
  }
`;
