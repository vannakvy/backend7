import { gql } from "apollo-server-express";
export default gql`
  extend type Query {
 
    excelExport(startDate:Date, endDate:Date): [test!]!
    allPersonalInfos: [PersonalInfo!]!
    allPersonalInfosForThatNegative: [PersonalInfo!]!
    getSampleTestLocation: [SampleTestLocation]
    allPersonalInfosForExcel: [PersonalInfo!]!
    getPersonalInfoById(id: ID!): PersonalInfo!
    # for police
    getPatientForInterviewWithPagination(page:Int, limit:Int, keyword:String,interview:Boolean,startDate:Date, endDate:Date): PaginateResponse!
    getPeopleForQuarantineWithPagination(page:Int, limit:Int, keyword:String,quarantineInfoId:ID!): PaginateResponse!
    getAffectedPersonalListWithPagination(page:Int, limit:Int, keyword:String,patientId:ID!):PaginateResponse!
    # for the doctor 
    getPatientForHospitalWithPagination(page:Int, limit:Int, keyword:String,startDate:Date, endDate:Date,hospitalId:ID!,patientType:String,numberOfSampleTest:Int,nextTest:Date): PaginateResponse!
    getPeopleForSampleTestWithPagination(page:Int, limit:Int, keyword:String,startDate:String, endDate:String,testLocation:String,fillStartDate:Date,fillEndDate:Date): PaginateResponse!
  
    getConfirmedPersonalInfoByInterviewWithPagination(
      interview:Boolean, 
      page: Int!
      limit: Int!
      keyword: String,
      startDate: Date, endDate:Date, district:String,village:String, commune:String,recovered:Boolean,death:Boolean,isFillDate:Boolean
      ): PaginateResponse!
    getPersonalInfoWithPagination(
      page: Int!
      limit: Int!
      keyword: String,
      currentState:String,
      startDate:Date,
      endDate:Date,
      covidType:String,
    ): PaginateResponse!
    getPersonalInfoByCaseWithPagination(
      page: Int!
      limit: Int!
      keyword: String
      caseId:ID!
    ): PaginateResponse!

    getPersonalInfoWithPaginations(
      page: Int!
      limit: Int!
      keyword: String,
      currentState:String,
      startDate:Date,
      endDate:Date,
      covidType:String,
      currentState:String,
      village:String,
      commune:String,
      district:String,
      province:String,
      firstName:String,
      lastName:String,
      confirm:Boolean,
      death:Boolean, 
      recovered:Boolean,
      createdthisBy:ID,
      updatedthisBy:ID,
      createdSampleTestBy:ID,
      createdSampleTestupdatedBy:ID,
      createStartDate:Date,
      createEndDate:Date,
      confirmStartDate:Date,
      confirmEndDate:Date,
      recoveredStartDate:Date,
      recoveredEndDate:Date,
      deathStartDate:Date,
      deathEndDate:Date,
      sampleTestStartDate:Date,
      sampleTestEndDate:Date
    ): PaginateResponse!
  }
  
  extend type Mutation {
    createPersonalInfo(newInfo: PersonalInfoInput!): PersonalInfoResponseWithData @isAuth(requires:SUPPER) 
    recordSampleTest(sampleTest:SampleTestInput!,personalInfoId:ID!):PersonalInfoResponse! @isAuth(requires:SUPPER) 
    updatePersonalInfo(
      updatedInfo: PersonalInfoInput!
      id: ID!
    ): PersonalInfoResponse @isAuth(requires:SUPPER) 
    deletePersonalInfo(id: ID!): PersonalInfoResponse @isAuth(requires:ADMIN) 
    deleteSampleTest(personalInfoId:ID!,sampleTestId:ID!):PersonalInfoResponse @isAuth(requires:ADMIN) 
    updateSampleTest(personalInfoId:ID!,sampleTestId:ID!,sampleTest:SampleTestInput):PersonalInfoResponse 
    updateCurrentState(personalInfoId:ID!,updateValue:currentStatusInput):PersonalInfoResponse 
    updateAffectedFrom(personalInfoId:ID!,updateValue:AffectedFromInput):PersonalInfoResponse  

  # For police 
  addHistoryWithin14days(createLocation:HistoryWithin14daysInput,personalInfoId:ID!):PersonalInfoResponse @isAuth(requires:POLICE) 
  deleteHistoryWithin14days(personalInfoId:ID!,historyWithin14Id:ID!):PersonalInfoResponse @isAuth(requires:POLICE) 
  updateHistoryWithin14days(personalInfoId:ID!,historyWithin14Id:ID!,updateInfo:HistoryWithin14daysInput): PersonalInfoResponse  @isAuth(requires:POLICE) 


  addPeopleToQuarantine(newQuarantine:QuarantingInput,personalInfo:ID!):PersonalInfoResponse @isAuth(requires:SUPPER) 
  deletePeopleFromQuarantine(personalInfoId:ID!,quarantingId:ID!):PersonalInfoResponse @isAuth(requires:ADMIN) 
  updatePeopleFromQuarantine(personalInfoId:ID!,quarantineInfoInnerId:ID!,updateInfo:QuarantingInput):PersonalInfoResponse 

  addPatientToHospital(newHospitalization:HospitalizationsInput,personalInfoId:ID!):PersonalInfoResponse 
  deletePatientFromHospital(personalInfoId:ID!,hospitalId:ID!):PersonalInfoResponse @isAuth(requires:ADMIN) 
  updatePatientFromHospital(personalInfoId:ID!,hospitalId:ID!,updateInfo:HospitalizationsInput):PersonalInfoResponse @isAuth(requires:DOCTOR) 

  addVaccination(vaccination:VaccinationInput,personalInfoId:ID!):PersonalInfoResponse @isAuth(requires:SUPPER) 
  deleteVaccination(personalInfoId:ID!,vaccinationId:ID!):PersonalInfoResponse @isAuth(requires:ADMIN) 
  updateTestLocation(query:String,update:String):String @isAuth(requires:SUPPER) 

  # //
  updateTravelOverCountryHistory(personalInfoId:ID!,updateValue:TravelOverCountryHistoryInput):PersonalInfoResponse
  # UPLOAD IMAGE URL 
  uploadImageUrl:String

  }




  extend type Subscription {
    userActionWithPersonalInfo: Actions
    # newOrder: Order!
    # orderStateChange(orderId:ID!):NotiticationResponse!
    # updateOrderonTheway(orderId:ID!): Order!
}
type test {
  _id:String,
  y:Int
}
type Actions {
  username:String,
  userAction:String,
  date:Date,
  type:String,
}

  type SampleTestLocation{
    _id:String
  }
 
  type PersonalInfo {
    createdBy:ID 
    updatedBy:ID
    currentAddress:String,
    reasonForTestingOther:String,
    social:String,
    from:String,
    carPlateNumber: String,
    driverName:String,
    to: String, 
    souceOfSuspect:String,
    recievedLabFormAt:Date,
    officerId:String,
    updateAt:Date,
    workplaceInfo:String,
    totalCoworker:Int,
    pob:String,
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
    direct: Boolean
    other:String
    relapse: Boolean
    relapseAt: Date
    vaccination: [Vaccination]
    createdAt: Date
    updatedAt: Date
    interviewed: Boolean
    interviewedAt:Date
    interviewStatus:String,
    currentState: currentStatus
    sampleTest:[SampleTest]
    travelOverCountryHistory:TravelOverCountryHistory
    chronic:String,
    covidVariant:String,
    hospitalizations:[Hospitalizations]
    historyWithin14days:[HistoryWithin14days]
    affectedFrom: AffectedFrom
    quaranting:[Quarantings]
  }
  type Vaccination{
    id:ID
    date:Date
    times:Int 
    vaccineType:String
    vacinatedAt:String
  }
  input VaccinationInput{
    date:Date
    times:Int 
    vaccineType:String
    vacinatedAt:String
  }
  type Quarantings{
        id:ID
        roomNumber:String,
        totalRoomate:Int,
        coorporate:Boolean
        date_in:Date,
        date_out:Date,
        personTypes:String,
        out_status:String,
        quarantineInfo:ID
        locationType:String
        locationName:String,
        long:Float,
        lat:Float
        createdBy:ID 
        updatedBy:ID
  }
  input QuarantingInput{
        totalRoomate:Int,
        locationType:String
        coorporate:Boolean
        date_in:Date,
        date_out:Date,
        personTypes:String,
        out_status:String,
        quarantineInfo:ID
        locationName:String,
        roomNumber:String,
        lat:Float
        long:Float
  }
  type currentStatus{
        createdBy:ID 
        updatedBy:ID
        confirm:Boolean,
        confirmedAt:Date,
        recovered:Boolean,
        recoveredAt:Date,
        confirmFormFilled:Date,
        recoveredFormFilled:Date,
        deathFormFilled:Date,
        death:Boolean,
        deathAt:Date,
        covidVariant:String
        reasonForDeath:String
  }
  type SampleTest{
    nextSampleTestDate:Date,
    createdBy:ID 
    updatedBy:ID
    id:ID!
    date: Date,
    times:Int,
    testLocation:String,
    result:Boolean,
    symptom:String,
    other:String,
    reasonForTesting:String,
    symptomStart:Date,
    labFormCompletedBy:String,
    specimentType:String,
    laboratory:String,
    covidVariant:String,
    resultDate:Date,
    testType:String
    formFillerName:String,
    labFormCompletedByTel:String,
    formFillerTel:String,
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
    nextSampleTestDate:Date,
    covidVariant:String,
    reasonForTesting:String,
    date: Date,
    times:Int,
    testLocation:String,
    result:Boolean,
    symptom:String,
    other:String,
    symptomStart:Date,
    labFormCompletedBy:String,
    specimentType:String,
    laboratory:String
    resultDate:Date
    testType:String
    formFillerName:String,
    formFillerTel:String,
    labFormCompletedByTel:String,
  }
  input currentStatusInput{
        confirmFormFilled:Date,
        recoveredFormFilled:Date,
        deathFormFilled:Date,
        confirm:Boolean,
        confirmedAt:Date,
        recovered:Boolean,
        recoveredAt:Date,
        death:Boolean,
        deathAt:Date
        reasonForDeath:String,
        covidVariant:String
  }

  
  input PersonalInfoInput {
    currentAddress:String,
    pob:String,
    reasonForTestingOther:String,
    social:String,
    workplaceInfo:String,
    totalCoworker:Int,
    carPlateNumber: String,
    driverName:String,
    from:String,
    to: String, 

    souceOfSuspect:String,
    recievedLabFormAt:Date,
    officerId:String,
    updateAt:Date,
    covidVariant:String,

    englishName:String,
    patientId:String
    currentState:currentStatusInput
    firstName: String
    interviewed:Boolean
    interviewedAt:Date
    interviewStatus:String,
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
    chronic:String
    travelOverCountryHistoryHistory:TravelOverCountryHistoryInput
    affectedFrom: AffectedFromInput
    historyWithin14daysInput:HistoryWithin14daysInput
    vaccination:[VaccinationInput]
    sampleTest:SampleTestInput
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
    endDate:Date,
    id:ID!
    locationName: String
    lat:Float 
    long:Float
    affectedLocation: AffectedLocation
    date: Date
    description: String
    direct:Boolean
  }

  input HistoryWithin14daysInput {
    endDate:Date,
    locationName: String
    affectedLocation: ID!
    date: Date
    lat:Float 
    long:Float
    description: String
    direct:Boolean
  }

  type AffectedFrom{
    riskLevel:String,
    lastTouchAt:Date,
    relationType:String,
    affectedDate:Date
    patientName:String
    patientCode: String
    relation:String
    direct:Boolean
    otherAffect:String
  }

  input AffectedFromInput{
    riskLevel:String,
    lastTouchAt:Date,
    relationType:String,
    affectedDate:Date
    patientName:String
    patientCode: String
    relation: String
    direct: Boolean
    otherAffect:  String
  }
  type Hospitalizations{
    infection:String,
    nextSampleTestDate:Date,
    createdBy:ID 
    updatedBy:ID
    id:ID
    date_in: Date
    date_out: Date
    hospitalName: String
    hospitalInfo: ID
    covidVariant: String
    coorporate: Boolean
    description: String
    long:Float,
    lat:Float,
    province:String,
    personTypes:String,

  }
  input HospitalizationsInput{
    infection:String,
    nextSampleTestDate:Date,
    date_in: Date
    date_out: Date
    hospitalName: String
    hospitalInfo: ID!
    covidVariant: String
    coorporate: Boolean
    description: String
    long:Float,
    lat:Float,
    province:String,
    personTypes:String,

  }

  # type PersonalInfoResponeWithData{
  #   response:PersonalInfoResponse,
  #   hospitalInfo
  # }
`;
