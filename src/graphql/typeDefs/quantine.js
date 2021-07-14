import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    allQuarantines:[Quarantine!]!
    getQuarantineWithPagination(page:Int!, limit:Int!, keyword:String):QuarantinePaginator!
    getQuarantineById(id:ID!):Quarantine!
  }

  extend type Mutation{
    createQuarantine(newQuarantine:QuarantineInput):QuarantineResponse!
    updateQuarantine(updatedQuarantine:QuarantineInput,id:ID!):QuarantineResponse!
    deleteQuarantine(id:ID!):QuarantineResponse!
  }

  type Quarantine {
    in:Boolean
   date_in: Date
   out:Boolean
   date_out: Date
   out_status:String,
   personalInfo:PersonalInfo!,
   quatantineInfo:QuarantineInfo!,
   others:String,
    createdAt:Date 
    updatedAt:Date
  }

  input QuarantineInput {
    in:Boolean
   date_in: Date
   out:Boolean
   date_out: Date
   out_status:String,
   personalInfo:ID!,
   quatantineInfo:ID!,
   others:String,    
  }
  type QuarantineResponse {
      success: Boolean 
      message:String
  }


  type QuarantinePaginator{
      quarantines:[Quarantine!]!
      paginator: Paginator!
  }
`