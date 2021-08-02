import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    allPersonalInfos: [PersonalInfo!]!
    getPersonalInfoById(id: ID!): PersonalInfo!
    # for police
    getPatientForInterviewWithPagination(page:Int, limit:Int, keyword:String,interview:Boolean,startDate:Date, endDate:Date): PaginateResponse!
    getPeopleForQuarantineWithPagination(page:Int, limit:Int, keyword:String,active:String,startDate:Date, endDate:Date): PaginateResponse!
    getAffectedPersonalListWithPagination(page:Int, limit:Int, keyword:String,patientId:ID!):PaginateResponse!
 
    # for the doctor 
    getPatientForHospitalPagination(page:Int, limit:Int, keyword:String,active:String,startDate:Date, endDate:Date): PaginateResponse!
    getPeopleForSampleTestWithPagination(page:Int, limit:Int, keyword:String,startDate:Date, endDate:Date): PaginateResponse!
  

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
    createPersonalInfo(newInfo: PersonalInfoInput!): PersonalInfoResponseWithData
    recordSampleTest(sampleTest:SampleTestInput!,personalInfoId:ID!):PersonalInfoResponse!
    updatePersonalInfo(
      updatedInfo: PersonalInfoInput!
      id: ID!
    ): PersonalInfoResponse
    deletePersonalInfo(id: ID!): PersonalInfoResponse
    deleteSampleTest(personalInfoId:ID!,sampleTestId:ID!):PersonalInfoResponse
    updateCurrentState(personalInfoId:ID!,updateValue:currentStatusInput):PersonalInfoResponse
  # For police 
  addHistoryWithin14days(createLocation:HistoryWithin14daysInput,personalInfoId:ID!):PersonalInfoResponse
  addPeopleToQuarantine(newQuarantine:QuarantingInput,personalInfo:ID!):PersonalInfoResponse
  # //delete  left 
  # //update left 
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
    dob: Date
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
    travelOverCountryHistory:TravelOverCountryHistory
    chronic:String,
    covidVariant:String,
    hospitalizations:Hospitalizations
    historyWithin14days:[HistoryWithin14days]
    affectedFrom: AffectedFrom
    quaranting:[Quarantings]
  }
  type Quarantings{
        id:ID
        coorporate:Boolean
        date_in:Date,
        date_out:Date,
        personTypes:String,
        out_status:String,
        quarantineInfo:QuarantineInfo
  }

  input QuarantingInput{
      coorporate:Boolean
        date_in:Date,
        date_out:Date,
        personTypes:String,
        out_status:String,
        quarantineInfo:ID!
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
    testLocation:AffectedLocation,
    result:Boolean,
    symptom:String,
    other:String,
    reasonForTesting:String,
    symptomStart:Date,
    labFormCompletedBy:String,
    specimentType:String,
    laboratory:String
  }
  type TravelOverCountryHistory{
        arriveDate:Date,
        fromCountry:String,
        reasonForComing:String,
        leavingDate:Date,
        toCountry:String,
    },
    input TravelOverCountryHistoryInput{
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
    testLocation:ID!,
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
    covidVariant:String,
    englishName:String,
    patientId:String
    currentState:currentStatusInput
    firstName: String
    interviewed:Boolean
    interviewedAt:Date
    lastName: String
    age: Int
    case:ID
    dob: Date
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
    travelOverCountryHistoryHistory:TravelOverCountryHistoryInput
    relation:String,
    chronic:String
    affectedFrom: AffectedFromInput
    historyWithin14daysInput:HistoryWithin14daysInput
  }
  type PersonalInfoResponse {
    success: Boolean
    message: String
  }
type PersonalInfoResponseWithData{
  response : PersonalInfoResponse
  personalInfo:PersonalInfo!
}
  type PaginateResponse {
    paginator: Paginator
    personalInfos: [PersonalInfo!]!
  }



  type HistoryWithin14days {
    locationName: String
    affectedLocation: AffectedLocation
    date: Date
    description: String
    direct:Boolean
  }

  input HistoryWithin14daysInput {
    locationName: String
    affectedLocation: ID!
    date: Date
    description: String
    direct:Boolean
  }

  type AffectedFrom{
    patientId: PersonalInfo
    relation:String
    direct:Boolean
    other:String
  }

  input AffectedFromInput{
    patientId: ID!
    relation: String
    direct: Boolean
    other:  String
  }

  type Hospitalizations{
    date_in: Date
    date_out: Date
    hospitalName: String
    hospitalInfo: HospitalInfo
    covidVariant: String
    coorporate: Boolean
    description: String
  }

  input HospitalizationsInput{
    date_in: Date
    date_out: Date
    hospitalName: String
    hospitalInfo: ID!
    covidVariant: String
    coorporate: Boolean
    description: String
  }



`;

