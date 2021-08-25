import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allAdditionalData(district:String):AdditonalData
    allAdditional:[AdditonalData]

    additionalDataTwo:[reportDatas]
  }

  extend type Mutation{
    createAdditional(additionalData:AdditonalDataInput): AdditioanalResponse! @isAuth(requires:ADMIN) 
    updateAdditional(district:String,updateData:AdditonalDataInput):AdditioanalResponse! @isAuth(requires:ADMIN) 
    
    # Neak naron report 
    createAdditionalTwo(createDatas:reportDatasInput): AdditioanalResponse 
    updateAdditionalTwo(updateData:reportDatasInput):AdditioanalResponse! 
    # deleteUserAction(id:ID!):UserActionResponse! @isAuth(requires:ADMIN)
  }

  input reportDatasInput {
    times:String,
    affectedLocation:Int 
    newAffectedLocation:Int
    notClosedLocation:Int
    newNotClosedLocation:Int

    closedLocation:Int
    newClosedLocation:Int

    openedLocation:Int 
    newOpenLocation:Int 

    notCoorporateLocation:Int
    newNotCoorporateLocation:Int

    totalInterviewed:Int 
    reachedPatientForInterview:Int 

    interviewChinese:Int 
    interviewChineseWomen:Int
    interviewChineseToday:Int

    interViewCambodian:Int 
    interViewCambodianWomen:Int
    interViewCambodianToday:Int

    interviewAndAdviceAffectedPeople:Int 
    interviewAndAdviceAffectedPeopleWomen:Int

    foundTotalAffectedLocation: Int 
    fullFoundTotalAffectedLocation:Int

    totalSampleTestLocation:Int
    totalSampleTest:Int
    totalSampleTestWomen:Int

  }

  type reportDatas {
    times:String,
    affectedLocation:Int 
    newAffectedLocation:Int

    notClosedLocation:Int
    newNotClosedLocation:Int

    closedLocation:Int
    newClosedLocation:Int

    openedLocation:Int 
    newOpenLocation:Int 

    notCoorporateLocation:Int
    newNotCoorporateLocation:Int

    interViewCambodianToday:Int


    interviewChineseToday:Int

    totalInterviewed:Int 
    reachedPatientForInterview:Int 

    interviewChinese:Int 
    interviewChineseWomen:Int

    interViewCambodian:Int 
    interViewCambodianWomen:Int

    interviewAndAdviceAffectedPeople:Int 
    interviewAndAdviceAffectedPeopleWomen:Int
    foundTotalAffectedLocation: Int 
    fullFoundTotalAffectedLocation:Int


    totalSampleTestLocation:Int
    totalSampleTest:Int
    totalSampleTestWomen:Int

  }

  type AdditonalData {
    district: String,
    positive:Int,
    positiveWomen:Int,

    hospitalizing:Int,
    hospitalizingWomen:Int,

    death:Int,
    deathWomen:Int,

    recover:Int,
    recoverWomen:Int,

    sampleTest:Int,
    sampleTestWomen:Int,

    affected:Int,
    affectedWomen:Int,

    positiveToday:Int,
    positiveWomenToday:Int,

    hospitalizingToday:Int,
    hospitalizingWomenToday:Int,

    deathToday:Int,
    deathWomenToday:Int,

    recoverToday:Int,
    recoverWomenToday:Int,

    sampleTestToday:Int,
    sampleTestWomenToday:Int,

    affectedToday:Int,
    affectedWomenToday:Int,
  }

  input AdditonalDataInput {
    district: String,
    positive:Int,
    positiveWomen:Int,

    hospitalizing:Int,
    hospitalizingWomen:Int,

    death:Int,
    deathWomen:Int,

    recover:Int,
    recoverWomen:Int,

    sampleTest:Int,
    sampleTestWomen:Int,

    affected:Int,
    affectedWomen:Int,
    positiveToday:Int,
    positiveWomenToday:Int,

    hospitalizingToday:Int,
    hospitalizingWomenToday:Int,

    deathToday:Int,
    deathWomenToday:Int,

    recoverToday:Int,
    recoverWomenToday:Int,

    sampleTestToday:Int,
    sampleTestWomenToday:Int,

    affectedToday:Int,
    affectedWomenToday:Int,
  }
  type AdditioanalResponse {
      success: Boolean 
      message:String
  }


`