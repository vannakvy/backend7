import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    allPersonalInfos: [PersonalInfo!]!
    getPersonalInfoById(id: ID!): PersonalInfo!
    getConfirmedPersonalInfoByInterviewWithPagination(
      interview:Boolean, 
      page: Int!
      limit: Int!
      keyword: String
      ): PaginateResponse!
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
    deleteSampleTest(personalInfoId:ID!,sampleTestId:ID!):PersonalInfoResponse
    updateCurrentState(personalInfoId:ID!,updateValue:currentStatusInput):PersonalInfoResponse
  }
 
  type PersonalInfo {
    englishName:String,
    patientId:String
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
    relation:String,
    direct: Boolean
    other:String
    relapse: Boolean
    relapseAt: Date
    vaccinated: Int
    createdAt: Date
    updatedAt: Date
    interviewed: Boolean
    interviewedAt:Date
    currentState: currentStatus
    sampleTest:[SampleTest]
    travelHistory:TravelHistory
    illness:String,
    covidVariant:String,
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
    reasonForTesting:String,
    symptomStart:Date,
    labFormCompletedBy:String,
    specimentType:String,
    laboratory:String
  }
  type TravelHistory{
        arriveDate:Date,
        fromCountry:String,
        reasonForComing:String,
        leavingDate:Date,
        toCountry:String,
    },
    input TravelHistoryInput{
        arriveDate:Date,
        fromCountry:String,
        reasonForComing:String,
        leavingDate:Date,
        toCountry:String,
    },
  input SampleTestInput{
    reasonForTesting:String,
    date: Date,
    times:Int,
    location:String,
    result:Boolean,
    symptom:String,
    other:String,
    symptomStart:Date,
    labFormCompletedBy:String,
    specimentType:String,
    laboratory:String
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
    interviewedAt:Date
    covidVariant:String,
    englishName:String,
    patientId:String
    currentState:currentStatusInput
    firstName: String
    interviewed:Boolean
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
    travelHistory:TravelHistoryInput
    relation:String,
    illness:String
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
