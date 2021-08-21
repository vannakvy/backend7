import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allAdditionalData(district:String):AdditonalData
    # getAdditionalDataByDistrict(district:String):AdditonalData!
  }

  extend type Mutation{
    createAdditional(additionalData:AdditonalDataInput): AdditioanalResponse! @isAuth(requires:ADMIN) 
    updateAdditional(district:String,updateData:AdditonalDataInput):AdditioanalResponse! @isAuth(requires:ADMIN) 
    # deleteUserAction(id:ID!):UserActionResponse! @isAuth(requires:ADMIN)
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
  }
  type AdditioanalResponse {
      success: Boolean 
      message:String
  }


`