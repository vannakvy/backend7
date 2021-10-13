import mongoose from "mongoose";
import personalInfo from "./personalInfo";
const client = require("twilio")(process.env.ACCOUNT_ID, process.env.TOKEN_ID);
const Shoplabels = {
  docs: "shops",
  limit: "perPage",
  nextPage: "next",
  prevPage: "prev",
  meta: "paginator",
  page: "currentPage",
  pagingCounter: "slNo",
  totalDocs: "totalDocs",
  totalPages: "totalPages",
};
const Transactionlabels = {
    docs: "transactions",
    limit: "perPage",
    nextPage: "next",
    prevPage: "prev",
    meta: "paginator",
    page: "currentPage",
    pagingCounter: "slNo",
    totalDocs: "totalDocs",
    totalPages: "totalPages",
  };
  const PersonalInfoLabels = {
    docs: "personalInfos",
    limit: "perPage",
    nextPage: "next",
    prevPage: "prev",
    meta: "paginator",
    page: "currentPage",
    pagingCounter: "slNo",
    totalDocs: "totalDocs",
    totalPages: "totalPages",
  };

export default {
  Query: {

    //test query 

    getTransaction: async(_,{startDate, endDate, marketName},{Transaction})=>{
      
      let dateQuery = {};
      if(startDate !== null ||  endDate !== null)  dateQuery ={"createdAt":{$gte:new Date(new Date(startDate).setUTCHours(0,0,0,0)),$lt: new Date(new Date(endDate).setUTCHours(23,59,59,59))}};

      const transactions = await Transaction.find(dateQuery).populate({path:'personalInfoId', select: "tel firstName lastName"})
      .populate({path:'shopId',select:"marketName,name,shopNumber"});
     return transactions
    },

    // const options = { sort: [['personalInfo.name', 'asc' ]] };
// UserModel.find({})
//.populate({ path: 'group', select: 'nome', options })
    //get shop by id 
    //A
    
    getShopById: async(_,{shopId},{Shop})=>{
      const shop = await Shop.findById(shopId).populate("personalInfoId");
      return shop;
    },

    //getBuyerWithPagination 
    getBuyerWithPagination:async(_,{page,limit,keyword,startDate,endDate},{PersonalInfo})=>{
      const options = {
          page: page || 1,
          limit: limit || 10,
          customLabels: PersonalInfoLabels,
          sort: {
            createdAt: -1,
          },
          // populate: "",
        };
        let dateQuery = {};

        if(startDate !== null ||  endDate !== null)  dateQuery = {"createdAt":{$gte:new Date(new Date(startDate).setUTCHours(0,0,0,0)),$lt: new Date(new Date(endDate).setUTCHours(23,59,59,59))}};
        
  
     
    let    query = {
          $and: [
            dateQuery,
            {buyer:true},
            {
              $or: [
                {
                  "$expr": {
                    "$regexMatch": {
                      "input": { "$concat": ["$lastName"," ","$firstName"] },
                      "regex": keyword,  //Your text search here
                      "options": "i"
                    }
                  }
                },

                { englishName: { $regex: keyword, $options: "i" } },
                { tel: { $regex: keyword, $options: "i" } },
                { village: { $regex: keyword, $options: "i" } },
                { commune: { $regex: keyword, $options: "i" } },
                { disctrict: { $regex: keyword, $options: "i" } },
                { province: { $regex: keyword, $options: "i" } },
                { patientId: { $regex: keyword, $options: "i" } },
                { idCard: { $regex: keyword, $options: "i" } },

              ],
            },

        
          
          ],
        };

      
        const buyers = await PersonalInfo.paginate(query, options);
        
        return buyers;
  },

    // getSellerWithpagination
    //getShop
    getSellerWithpagination:async(_,{page,limit,keyword,isSeller,marketName},{PersonalInfo})=>{
        const options = {
            page: page || 1,
            limit: limit || 10,
            customLabels: PersonalInfoLabels,
            sort: {
              createdAt: -1,
            },
            populate: "personalInfoId",
          };
          let sellerQuery = {};
          let marketNameQuery = {};
          if(marketName!=="" && marketName!==undefined){
            marketNameQuery = {"marketName":marketName};
          }

          if(isSeller){
            sellerQuery = {"seller":true};
          }
      let    query = {
            $and: [
              sellerQuery,
              marketNameQuery,
              {
                $or: [
                  {
                    "$expr": {
                      "$regexMatch": {
                        "input": { "$concat": ["$lastName"," ","$firstName"] },
                        "regex": keyword,  //Your text search here
                        "options": "i"
                      }
                    }
                  },
  
                  { englishName: { $regex: keyword, $options: "i" } },
                  { tel: { $regex: keyword, $options: "i" } },
                  { village: { $regex: keyword, $options: "i" } },
                  { commune: { $regex: keyword, $options: "i" } },
                  { disctrict: { $regex: keyword, $options: "i" } },
                  { province: { $regex: keyword, $options: "i" } },
                  { patientId: { $regex: keyword, $options: "i" } },
                  { idCard: { $regex: keyword, $options: "i" } },

                ],
              },
  
          
            
            ],
          };

      
          const sellers = await PersonalInfo.paginate(query, options);
          
          return sellers;
    },
    getShopWithPagination:async(_,{page,limit,keyword,marketName},{Shop})=>{
        const options = {
            page: page || 1,
            limit: limit || 10,
            customLabels: Shoplabels,
            sort: {
              createdAt: -1,
            },
            populate: "personalInfoId",
          };
          let marketNameQuery ={};
          if(marketName!==undefined && marketName !==""){
            marketNameQuery = {"marketName":marketName};
          }

          let query = {
            $and:[
              marketNameQuery,
              {
            $or: [
              { name: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
            ],
          }
        
        ]};

          const shops = await Shop.paginate(query, options);
          return shops;
    },
//@Desc get the shop by patient id for finding the shops that the the patient went to
//@Desc private 

getAffectedShopBypatientIdWithPagination: async (_, {page,limit,keyword,marketName,startDate,endDate,personalInfoId}, {Transaction}) => {
        let createDateAt = {};
        const options = {
            page: page || 1,
            limit: limit || 10,
            customLabels: Shoplabels,
            sort: {
              createdAt: -1,
            },
            populate: "shopId personalInfoId",
          };

          if(startDate !== null ||  endDate !== null)  createDateAt = {"createdAt":{$gte:new Date(new Date(startDate).setUTCHours(0,0,0,0)),$lt: new Date(new Date(endDate).setUTCHours(23,59,59,59))}};
          let query = {
              $and:[createDateAt,{"personalInfoId":personalInfoId}]
          };
          const personals = await Transaction.paginate(query, options);
       
          return personals;
    },
    //@Desc get the people by shop id for finding the people went the affected shops
    //@Desc private 

    getAffectedPeopleByShopIdWithPagination: async (_, {page,limit,keyword,marketName,startDate,endDate,shopId}, {Transaction}) => {
    let createDateAt = {};
    const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: Transactionlabels,
        sort: {
          createdAt: -1,
        },
        populate: "shopId personalInfoId",
      };

      if(startDate !== null ||  endDate !== null)  createDateAt = {"createdAt":{$gte:new Date(new Date(startDate).setUTCHours(0,0,0,0)),$lt: new Date(new Date(endDate).setUTCHours(23,59,59,59))}};
      let query = {
          $and:[createDateAt,{"shopId":shopId}]
      };
      const shops = await Transaction.paginate(query, options);
    return shops;
    }
  },
  Mutation: {
    //@Desc Create transaction between the seller and the buyer
    //@Access public
    createTransaction: async (
      _,
      { shopId, personalInfoId },
      { Transaction ,PersonalInfo}
    ) => {
      try {
        console.log(shopId,personalInfoId,)
      const personExisted = await PersonalInfo.findById(personalInfoId);
      if(!personExisted){
        return {
          success:false,
          message:"PNE"
        }
      }

      //PNE = personalInfoId is not existed
        const transaction = new Transaction({
          shopId: shopId,
          personalInfoId: personalInfoId,
        });
       
        const created = await transaction.save();
        if (!created) {
          return {
            success: false,
            message: "cannot create transaction 1",
          };
        }
        return {
          success: true,
          message: "transaction created successfully! ",
        };
      } catch (error) {
        return {
          success: false,
          message: "cannot create transaction " + error,
        };
      }
    },
    //@Desc Create shop info for the seller
    //@Access public

    createShop: async (_, { newShop }, { Shop }) => {
      try {
        const shop = new Shop(newShop);
        const created = await shop.save();
        if(!created){
            return {
                message:"Shop is not created",
                success: false
            }
        }

        return {
            message:"new Shop created",
            success: true
        }
      } catch (error) {
          return {
              message:"Shop is not created",
              success: false
          }
      }
    },

    //@Desc update the shop 
    //@Access private 
updateShop:async(_,{updatedShop,shopId},{Shop})=>{
    try {
        const updated = await Shop.findByIdAndUpdate({_id:shopId},updatedShop);
        if(!updated){
            return {
                success:false,
                message:"Cannot update the shop"
            }
        }
        return {
            success:true,
            message:"updated successfully !"
        }
    } catch (error) {
        return {
            success:false,
            message:"Cannot update the shop"
        }
    }
},

//@Desc delete the shop from the database 
//@Access private 

deleteShop:async(_,{shopId},{Shop})=>{
    try {
        const deleted = await Shop.findByIdAndDelete(shopId);
        if(!deleted){
            return {
                message:"Shop not deleted",
                success: true
            }
        }
        return {
            message:"Shop deleted successfully !",
            success: true
        }
    } catch (error) {
        return {
            message: "Shop not deleted !",
            success: true
        }
    }
},


    //@Desc sending the telephone to verify with the twilio compnay
    //@Access public
    sendingPhone: async (_, { phonenumber }, {}) => {
      console.log(phonenumber);
      try {
        if (phonenumber) {
          let a = await client.verify
            .services(process.env.SERVICE_ID)
            .verifications.create({
              to: `+${phonenumber}`,
              channel: "sms",
            });
          if (a) {
            return {
              success: true,
              message: "message sent",
            };
          }
        }
      } catch (error) {
        console.log(error)
      }
  
    },

    //@Desc send the code to verify (code and the telephone number )
    //@Access public

    verifyCode: async (
      _,
      { phonenumber, code, firstName, lastName },
      { PersonalInfo }
    ) => {
      try {

const exist = await PersonalInfo.findOne({$and:[{"tel":phonenumber},{"firstName":firstName},{lastName:lastName}]});
let buyer;
if(!exist){
    buyer = new PersonalInfo({
        firstName: firstName,
        lastName: lastName,
        tel: phonenumber,
        buyer: true,
    });
}else{
  return {
    success: true,
    message: "Verified",
    id: exist._id,
  }
}
          const created = await buyer.save();
          if (created) {
            return {
              success: true,
              message: "Verified",
              id: created._id,
            };
          }
        
      } catch (error) {
        return {
          success: false,
          message: "Verified" + error.message,
          id: null,
        };
      }
    },
  },
};
