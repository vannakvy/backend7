import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allHospitalizations:[Hospitalization!]!
    getHospitalizationWithPagination(page:Int!, limit:Int!, keyword:String):HospitalizationPaginator!
    getQuarantineByHospitalIdIdWithPagination(page:Int!, limit:Int!, keyword:String,hospitalId:ID!):HospitalizationPaginator!
    getHospitalizationByPersonalInfo(personalId:ID!):DataForPersonalInfo
    getHospitalizationById(id:ID!):Hospitalization!
  }

  extend type Mutation{
    createHospitalization(newHospitalization:HospitalizationInput):HospitalizationResponse!
    updateHospitalization(updatedHospitalization:HospitalizationInput,id:ID!):HospitalizationResponse!
    deleteHospitalization(id:ID!):HospitalizationResponse!
  }
type DataForPersonalInfo{
 hospitalInfo: Hospitalization
  quarantineInfo: Quarantine
}
  type Hospitalization {
    id:ID
    in:Boolean
   date_in: Date
   date_out: Date
   out_status:String,
   personalInfo:PersonalInfo!,
   hospitalInfo:HospitalInfo!,
   others:String,
   samplTest:[SampleTest]
    createdAt:Date 
    updatedAt:Date
  }

  input HospitalizationInput {
    in:Boolean
   date_in: Date
   date_out: Date
   out_status:String,
   personalInfo:ID,
   hospitalInfo:ID,
   others:String,
   samplTest:SampleTestInput
  }
  type HospitalizationResponse {
      success: Boolean 
      message:String
  }

  type HospitalizationPaginator{
      hospitalizations:[Hospitalization!]!
      paginator: Paginator!
  }
`