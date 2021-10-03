import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getShops(province:String,district:String,commune:String,village:String,marketName:String,keyword:String,limit:Int,page:Int):[PersonalInfo!]!
    getAffectedShopOrPeople(province:String,district:String,commune:String,village:String,marketName:String,keyword:String,limit:Int,page:Int):[PersonalInfo!]!
    # excelExport(startDate:Date, endDate:Date): [PersonalInfo!]!
  }
 
  extend type Mutation {
  createShop(newShop:newShop):vendorResponse
  sendingCode(phoneNumber:Int):TransactionResponse
  verifyCode(phoneNumber:Int,code:Int):TransactionResponse
  createTransaction(personalInfoId:ID!,shopId:ID!):TransactionResponse
  deleteTrasaction(transactionId:ID!):TransactionResponse
  }
  type vendorResponse{
      success:Boolean,
      message:String
  }

type TransactionResponse{
    success: Boolean 
    message:String
    personalInfoId:ID
}

`;
