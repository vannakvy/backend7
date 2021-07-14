import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allHospitalizations:[Hospitalization!]!
    getHospitalizationWithPagination(page:Int!, limit:Int!, keyword:String):HospitalizationPaginator!
    getHospitalizationById(id:ID!):Hospitalization!
  }

  extend type Mutation{
    createHospitalization(newHospitalization:HospitalizationInput):HospitalizationResponse!
    updateHospitalization(updatedHospitalization:HospitalizationInput,id:ID!):HospitalizationResponse!
    deleteHospitalization(id:ID!):HospitalizationResponse!
  }

  type Hospitalization {
    id:ID
    in:Boolean
   date_in: Date
   out:Boolean
   date_out: Date
   out_status:String,
   personalInfo:PersonalInfo!,
   hospitalInfo:HospitalInfo!,
   others:String,
   samplTest:[SampleTest]
    createdAt:Date 
    updatedAt:Date
  }

  type SampleTest{
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

  input HospitalizationInput {
    in:Boolean
   date_in: Date
   out:Boolean
   date_out: Date
   out_status:String,
   personalInfo:ID!,
   hospitalInfo:ID!,
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