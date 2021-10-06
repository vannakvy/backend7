import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getShopWithPagination(province:String,district:String,commune:String,village:String,marketName:String,keyword:String,limit:Int,page:Int):ShopPaginator!
    getShopById(shopId:ID!):Shop!
    getAffectedShopBypatientIdWithPagination(marketName:String,keyword:String,limit:Int,page:Int,startDate:Date,endDate:Date,personalInfoId:ID!):ShopPaginator!
    getAffectedPeopleByShopIdWithPagination(marketName:String,keyword:String,limit:Int,page:Int,startDate:Date,endDate:Date,shopId:ID!):PeoplePaginator!
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
    shopNumber:String
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
    tel:String
  }
  type Shop{
    shopNumber:String
    _id:ID
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
    tel:String
  }

  type ShopPaginator{
  shops:[Shop]
  paginator:Paginator
  }
  type PeoplePaginator{
    transactions:[Transaction]
    paginator:Paginator
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
type Transaction{
  personalInfoId:PersonalInfo
  shopId:ID 
  createdAt:Date 
}

`;
