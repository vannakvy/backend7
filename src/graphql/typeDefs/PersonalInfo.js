import { gql } from "apollo-server-express";

export default gql`
    extend type Query{
        allPernalInfo:[PersonalInfo!]!
        getPersonalInfoById(id:ID!):PersonalInfo!
        getPersonalInfoWithPagination(page:Int!, limit:Int!, keyword:String):PaginateResponse!
    }
    extend type Mutation{
        createPernalInfo(newInfo:PersonalInfoInput!):PersonalInfoResponse
        updatePersonalInfo(updatedInfo:PersonalInfoInput!,id:ID!):PersonalInfoResponse
        deletePersonalInfo(id:ID!): PersonalInfoResponse
    }

    type PersonalInfo{
        firstName:String
        lastName:String
        age:Int
        gender:String
        tel:String
        nationality:String
        ocupation:String
        idCard:String
        profileImg:String
        village:String
        commune:String
        disctrict:String
        province:String
        createdAt:Date
        updatedAt:Date
    }
    input PersonalInfoInput{       
         firstName:String
        lastName:String
        age:Int
        gender:String
        tel:String
        nationality:String
        ocupation:String
        idCard:String
        profileImg:String
        village:String
        commune:String
        disctrict:String
        province:String
    }
    type PersonalInfoResponse{
        success:Boolean
        message: String
    }

    type PaginateResponse {
        paginator: Paginator
        personalInfo: [PersonalInfo!]!
    }

`;
