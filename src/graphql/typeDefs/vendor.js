import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getShopWithPagination(province:String,district:String,commune:String,village:String,marketName:String,keyword:String,limit:Int,page:Int):[Shop!]!
    getShopById(shopId:ID!):Shop!
    getAffectedShopWithBypatientIdPagination(marketName:String,keyword:String,limit:Int,page:Int,startDate:Date,endDate:Date,personalInfoId:ID!):[Shop!]!
    getAffectedPeopleByShopIdWithPagination(marketName:String,keyword:String,limit:Int,page:Int,startDate:Date,endDate:Date,shopId:ID!):PaginateResponse
    # excelExport(startDate:Date, endDate:Date): [PersonalInfo!]!
    getSellerWithpagination(keyword:String,limit:Int,page:Int):PaginateResponse
  }
 
  extend type Mutation {
  createShop(newShop:shopInput):vendorResponse
  updateShop(updatedShop:shopInput,shopId:ID):vendorResponse
  deleteShop(shopId:ID):vendorResponse
  createPerson(newPersonal:newPersonalInfo):responseWithData
  sendingPhone(phonenumber:String):vendorResponse
  verifyCode(phonenumber:String,code:String,firstName:String, lastName:String):responseWithData
  createTransaction(personalInfoId:ID!,shopId:ID!):vendorResponse
  deleteTrasaction(transactionId:ID!):vendorResponse
  }
  input shopInput{
    name: String,
    registrationNumber: String,
    acknowledgeAs: String,
    registerDate: Date,
    village: String,
    commune: String,
    district: String,
    province: String,
    firstName: String,
    lastName: String,
    personalInfoId:ID
  }
  type Shop{
    id:ID
    name: String,
    registrationNumber: String,
    acknowledgeAs: String,
    registerDate: Date,
    village: String,
    commune: String,
    district: String,
    province: String,
    firstName: String,
    lastName: String,
    personalInfoId:PersonalInfo
  }
  type responseWithData{
  success: Boolean,
  message:String,
  id:ID
  }

  input newPersonalInfo{
    firstName:String, 
    lastName:String
    tel:String,
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
