import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getShopWithPagination(province:String,district:String,commune:String,village:String,marketName:String,keyword:String,limit:Int,page:Int):ShopPaginator! @isAuth(requires:VIEW_ALL_SHOP)
    getShopById(shopId:ID!):Shop!
    getAffectedShopBypatientIdWithPagination(marketName:String,keyword:String,limit:Int,page:Int,startDate:Date,endDate:Date,personalInfoId:ID!):Paginator1! @isAuth(requires:VIEW_BUYER_DETAIL)
    getAffectedPeopleByShopIdWithPagination(marketName:String,keyword:String,limit:Int,page:Int,startDate:Date,endDate:Date,shopId:ID!):PeoplePaginator! @isAuth(requires:VIEW_SHOP_DETAIL)
    # excelExport(startDate:Date, endDate:Date): [PersonalInfo!]!
    getSellerWithpagination(keyword:String,limit:Int,page:Int,isSeller:Boolean,marketName:String):PaginateResponse 
    getBuyerWithPagination(keyword:String,limit:Int,page:Int,startDate:Date, endDate:Date):PaginateResponse @isAuth(requires:VIEW_BUYER)
    getTransactionWithPagination(startDate:Date, endDate:Date,market:String,limit:Int,page:Int,marketName:String,keyword:String,shopName:String):Paginator3!
    getTransactionForGraph(startDate:Date,endDate:Date,marketName:String):GraphTranResponse!
    getDataForTotalBoxes(marketName:String):TotalResponse
    getMarketWithTotalScan:[MarketListResponse]
    testPopulate:String
  }
  
  extend type Mutation {
  createShop(newShop:shopInput):vendorResponse @isAuth(requires:CREATE_SHOP)
  updateShop(updatedShop:shopInput,shopId:ID):vendorResponse @isAuth(requires:UPDATE_SHOP)
  deleteShop(shopId:ID):vendorResponse @isAuth(requires: DELETE_SHOP)
  createPerson(newPersonal:newPersonalInfo):responseWithData
  sendingPhone(phonenumber:String):vendorResponse
  verifyCode(phonenumber:String,code:String,firstName:String, lastName:String):responseWithData
  createTransaction(personalInfoId:ID!,shopId:ID!):vendorResponse
  deleteTrasaction(transactionId:ID!):vendorResponse @isAuth(requires:DELETE_TRANSACTION)

  }
  type TotalResponse{
        totalTransaction: Int
        totalTransactionToday: Int
        totalBuyer: Int
        totalBuyerToday: Int
        totalShops: Int
        totalShopToday: Int
        totalMarket: Int
  }

  type MarketListResponse{
    _id:String,
    total:Int 
    today:Int
    totalShop:Int,
    totalShoptoday: Int
  }



type GraphTranResponse {
  graph_transaction:[GraphType]
  graph_buyer:[GraphType]
}

type GraphType{
  _id:String,
  total:Int
}


  type Paginator1{
    shops:[Transaction]
    paginator:Paginator!
  }
  type Paginator3{
    transactions: [Transaction],
    paginator:Paginator!
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
    marketName:String
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
    marketName:String
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
  _id:ID
  personalInfoId:PersonalInfo
  shopId:Shop
  createdAt:Date 
}

`;
