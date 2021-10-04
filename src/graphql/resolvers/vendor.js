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
    // getSellerWithpagination
    //getShop
    getSellerWithpagination:async(_,{page,limit,keyword},{PersonalInfo})=>{
        const options = {
            page: page || 1,
            limit: limit || 10,
            customLabels: PersonalInfoLabels,
            sort: {
              createdAt: -1,
            },
            populate: "personalInfoId",
          };

          let query = {
              $and:[
                  {seller:true},
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
              ]
          };
          console.log(query)
          const sellers = await PersonalInfo.paginate(query, options);
          console.log(sellers);
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

          let query = {
            $or: [
              { name: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
            ],
          };

          const shops = await Shop.paginate(query, options);
          return shops;
    },
//@Desc get the shop by patient id for finding the shops that the the patient went to
//@Desc private 

    getAffectedShopWithBypatientIdPagination: async (_, {page,limit,keyword,marketName,startDate,endDate,personalInfoId}, {Transaction}) => {
        let createDateAt = {};
        const options = {
            page: page || 1,
            limit: limit || 10,
            customLabels: Transactionlabels,
            sort: {
              createdAt: -1,
            },
            populate: "personalInfoId",
          };

          if(startDate !== null ||  endDate !== null)  createDateAt = {"createdAt":{$gte:new Date(new Date(startDate).setUTCHours(0,0,0,0)),$lt: new Date(new Date(endDate).setUTCHours(23,59,59,59))}};
          let query = {
              $and:[createDateAt]
          };
          const shops = await Transaction.paginate(query, options);
          return shops;
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
        populate: "personalInfoId",
      };

      if(startDate !== null ||  endDate !== null)  createDateAt = {"createdAt":{$gte:new Date(new Date(startDate).setUTCHours(0,0,0,0)),$lt: new Date(new Date(endDate).setUTCHours(23,59,59,59))}};
      let query = {
          $and:[createDateAt]
      };
      const shops = await Transaction.paginate(query, options);
      return shops;
},
  },
  Mutation: {
    //@Desc Create transaction between the seller and the buyer
    //@Access public
    createTransaction: async (
      _,
      { shopId, personalInfoId },
      { Transaction }
    ) => {
      try {
        const transaction = await Transaction({
          shopId: shopId,
          PersonalInfoId: personalInfoId,
        });
        const created = await transaction.save();
        if (!created) {
          return {
            success: false,
            message: "cannot create transaction",
          };
        }
        return {
          success: true,
          message: "transaction created successfully!",
        };
      } catch (error) {
        return {
          success: false,
          message: "cannot create transaction",
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
        const updated = await Shop.findByIdAndUpdate(updatedShop);
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
    },

    //@Desc send the code to verify (code and the telephone number )
    //@Access public

    verifyCode: async (
      _,
      { phonenumber, code, firstName, lastName },
      { PersonalInfo }
    ) => {
      try {
        if (phonenumber && code.length === 6) {
          const verified = await client.verify
            .services(process.env.SERVICE_ID)
            .verificationChecks.create({
              to: `+${phonenumber}`,
              code: code,
            });
          if (!verified) {
            return {
              success: false,
              message: "Verified not success",
              id: null,
            };
          }

          const buyer = new PersonalInfo({
            firstName: firstName,
            lastName: lastName,
            tel: phonenumber,
            buyer: true,
          });

          const created = await buyer.save();
          if (created) {
            return {
              success: true,
              message: "Verified",
              id: created._id,
            };
          }
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
