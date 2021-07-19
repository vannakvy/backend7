import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allCases:[Case!]!
    getCaseWithPagination(page:Int!, limit:Int!, keyword:String):CasePaginator!
    getCaseById(id:ID!):Case!
  }

  extend type Mutation{
    createCase(newCase:CaseInput):CaseResponse!
    updateCase(updatedCase:CaseInput,id:ID!):CaseResponse!
    deleteCase(id:ID!):CaseResponse!
  }

  type Case {
        id:ID!
        caseName:String
        village:String
        commune:String
        district:String
        province:String
        other:String
        date:Date
        long:Float
        lat:Float
        createdAt:Date 
        updatedAt:Date
  }

  input CaseInput {
        caseName:String
        village:String
        commune:String
        district:String
        province:String
        date:Date
        long:Float
        lat:Float
        other:String
  }
  type CaseResponse {
      success: Boolean 
      message:String
  }

  type CasePaginator{
      cases:[Case!]!
      paginator: Paginator!
  }
`