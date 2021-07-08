import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allHospitalizes:[Hospitalize!]!
    getHospitalizeWithPagination(page:Int!, limit:Int!, keyword:String):HospitalizePaginator!
    getHospitalizeById(id:ID!):Hospitalize!
  }

  extend type Mutation{
    createHospitalize(newHospitalize:HospitalizeInput):HospitalizeResponse!
    updateHospitalize(updatedHospitalize:HospitalizeInput,id:ID!):HospitalizeResponse!
    deleteHospitalize(id:ID!):HospitalizeResponse!
  }

  type Hospitalize {
      id:ID!
    hostpitalName:String
    village:String
    commune: String
    district: String
    province:String
    personInchage:String
    long: Float
    Lat: Float
        personalInfo: [Patient!]!
        createdAt:Date 
        updatedAt:Date
  }
 

  input HospitalizeInput {
    hostpitalName:String
    village:String
    commune: String
    district: String
    province:String
    personInchage:String
    long: Float
    Lat: Float
  }

  type HospitalizeResponse {
      success: Boolean 
      message:String
  }

  type HospitalizePaginator{
      Hospitalizes:[Hospitalize!]!
      paginator: Paginator!
  }
`