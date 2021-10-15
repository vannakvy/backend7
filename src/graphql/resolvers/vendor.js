import mongoose from "mongoose";
import Transaction from "../../models/transaction";
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
    //
    //test query
    // testPopulate:async(_,{},{PersonalInfo})=>{
    //   const deleted = await PersonalInfo.deleteMany({buyer:true});

    //   console.log(deleted)
    // },

    getMarketWithTotalScan:async(_,{},{Transaction,Shop})=>{
      var start = new Date(new Date().setUTCHours(0, 0, 0, 0));
      var end = new Date(new Date().setUTCHours(23, 59, 59, 59));
   
     let   dateStart = { $gte: ["$createdAt", start] };
     let   dateEnd = { $lt: ["$createdAt", end] };
    

   
      let query = [
        {
          $project: {
            marketName: 1,
            total:1,
            today: {
              $cond: [
                {
                  $and: [
                    dateStart,
                    dateEnd,
                  ],
                },
                1,
                0,
              ],
            },
            //
          },
        },
        {
          $group: {
            _id: "$marketName",
            total: { $sum: 1 },
            today: { $sum: "$today" },
          },
        },
      ];

      let query2 = [
        {
          $project: {
            marketName: 1,
            totalShop:1,
            totalShoptoday: {
              $cond: [
                {
                  $and: [
                    dateStart,
                    dateEnd,
                  ],
                },
                1,
                0,
              ],
            },
            //
          },
        },
        {
          $group: {
            _id: "$marketName",
            totalShop: { $sum: 1 },
            totalShoptoday: { $sum: "$totalShoptoday" },
          },
        },
        {$match:{"_id":{$ne:null}}}
      ];

 const joinArray = (arr1, arr2) => {
        let arr = []
        arr1.map(load => {
            arr2.map(load1 => {
                if(load1._id === load._id){
                    arr.push({...load, ...load1})
                }
            })
        })
      return arr;
      }
      const marketList = await Transaction.aggregate(query);
      const shopGroup = await Shop.aggregate(query2);

 const newArr= joinArray(shopGroup,marketList);

      return newArr;
    },
//@For boxes data
    getDataForTotalBoxes: async (
      _,
      {marketName},
      { PersonalInfo, Shop, Transaction }
    ) => {

      let marketNameQuery ={};
      if(marketName!==""){
        marketNameQuery = {"marketName":marketName};
      }

      var start = new Date(new Date().setUTCHours(0, 0, 0, 0));
      var end = new Date(new Date().setUTCHours(23, 59, 59, 59));
      const totalTransaction = await Transaction.countDocuments(marketNameQuery);
      const totalTransactionToday = await Transaction.countDocuments({
      $and:[{createdAt: { $gte: start, $lt: end }},
        marketNameQuery]
      });
      const totalBuyer = await PersonalInfo.countDocuments({ buyer: true });
      const totalBuyerToday = await PersonalInfo.countDocuments({
       $and:[{createdAt: { $gte: start, $lt: end }},{buyer:true}]
      });
      const totalShops = await Shop.countDocuments(marketNameQuery);
      const totalShopToday = await Shop.countDocuments({
        $and : [{createdAt: { $gte: start, $lt: end }},
        marketNameQuery]
      });
      const totalM = await Shop.aggregate([
        { $group: { _id: "$marketName", total: { $sum: 1 } } },
        { $match: { _id: { $ne: null } } },
        { $match: { _id: { $ne: "" } } },
      ]);
      const totalMarket = totalM.length;
      return {
        totalTransaction,
        totalTransactionToday,
        totalBuyer,
        totalBuyerToday,
        totalShops,
        totalShopToday,
        totalMarket,
      };
    },

    getTransactionForGraph: async (
      _,
      { marketName, startDate, endDate },
      { Transaction }
    ) => {
 
      let dateQuery = {};
      let marketNameQuery = {};
      if (marketName !== "" && marketName !== null) {
        marketNameQuery = { marketName: marketName };
      }

      if (startDate !== null || endDate !== null)
        dateQuery = {
          createdAt: {
            $gte: new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)),
            $lt: new Date(new Date(endDate).setUTCHours(23, 59, 59, 59)),
          },
        };
      
      const transGraph = await Transaction.aggregate([
        { $match: marketNameQuery },
        { $match: dateQuery },
        {
          $project: {
            yearMonthDayUTC: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$createdAt",
              },
            },
          },
        },
        {
          $group: {
            _id: "$yearMonthDayUTC",
            total: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      return transGraph;
    },

    getTransactionWithPagination: async (
      _,
      { page, limit, keyword, startDate, endDate, marketName, shopName },
      { Transaction }
    ) => {
      console.log(marketName,"dd")
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: Transactionlabels,
        sort: {
          createdAt: -1,
        },
        populate: "personalInfoId shopId",
      };
      let dateQuery = {};
      let marketNameQuery = {};
      let shopNameQuery = {};

      // if (shopName !== "" && shopName !== null) {
      //   shopNameQuery = { shopName: shopName };
      // }

      if (marketName !== "" && marketName !== null) {
        marketNameQuery = { marketName: marketName };
      }
      console.log(marketNameQuery)

      if (startDate !== null || endDate !== null)
        dateQuery = {
          createdAt: {
            $gte: new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)),
            $lt: new Date(new Date(endDate).setUTCHours(23, 59, 59, 59)),
          },
        };

      let query = {
        $and: [dateQuery, marketNameQuery],
      };

      const transactions = await Transaction.paginate(query, options);

      return transactions;
    },

    getShopById: async (_, { shopId }, { Shop }) => {
      const shop = await Shop.findById(shopId).populate("personalInfoId");
      return shop;
    },

    //getBuyerWithPagination
    getBuyerWithPagination: async (
      _,
      { page, limit, keyword, startDate, endDate },
      { PersonalInfo }
    ) => {
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

      if (startDate !== null || endDate !== null)
        dateQuery = {
          createdAt: {
            $gte: new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)),
            $lt: new Date(new Date(endDate).setUTCHours(23, 59, 59, 59)),
          },
        };

      let query = {
        $and: [
          dateQuery,
          { buyer: true },
          {
            $or: [
              {
                $expr: {
                  $regexMatch: {
                    input: { $concat: ["$lastName", " ", "$firstName"] },
                    regex: keyword, //Your text search here
                    options: "i",
                  },
                },
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
    getSellerWithpagination: async (
      _,
      { page, limit, keyword, isSeller, marketName },
      { PersonalInfo }
    ) => {
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
      if (marketName !== "" && marketName !== undefined) {
        marketNameQuery = { marketName: marketName };
      }

      if (isSeller) {
        sellerQuery = { seller: true };
      }
      let query = {
        $and: [
          sellerQuery,
          marketNameQuery,
          {
            $or: [
              {
                $expr: {
                  $regexMatch: {
                    input: { $concat: ["$lastName", " ", "$firstName"] },
                    regex: keyword, //Your text search here
                    options: "i",
                  },
                },
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
    getShopWithPagination: async (
      _,
      { page, limit, keyword, marketName },
      { Shop }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: Shoplabels,
        sort: {
          createdAt: -1,
        },
        populate: "personalInfoId",
      };
      let marketNameQuery = {};
      if (marketName !== undefined && marketName !== "") {
        marketNameQuery = { marketName: marketName };
      }

      let query = {
        $and: [
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
          },
        ],
      };

      const shops = await Shop.paginate(query, options);
      return shops;
    },
    //@Desc get the shop by patient id for finding the shops that the the patient went to
    //@Desc private

    getAffectedShopBypatientIdWithPagination: async (
      _,
      { page, limit, keyword, marketName, startDate, endDate, personalInfoId },
      { Transaction }
    ) => {
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

      if (startDate !== null || endDate !== null)
        createDateAt = {
          createdAt: {
            $gte: new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)),
            $lt: new Date(new Date(endDate).setUTCHours(23, 59, 59, 59)),
          },
        };
      let query = {
        $and: [createDateAt, { personalInfoId: personalInfoId }],
      };
      const personals = await Transaction.paginate(query, options);

      return personals;
    },
    //@Desc get the people by shop id for finding the people went the affected shops
    //@Desc private

    getAffectedPeopleByShopIdWithPagination: async (
      _,
      { page, limit, keyword, marketName, startDate, endDate, shopId },
      { Transaction }
    ) => {
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

      if (startDate !== null || endDate !== null)
        createDateAt = {
          createdAt: {
            $gte: new Date(new Date(startDate).setUTCHours(0, 0, 0, 0)),
            $lt: new Date(new Date(endDate).setUTCHours(23, 59, 59, 59)),
          },
        };
      let query = {
        $and: [createDateAt, { shopId: shopId }],
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
      { Transaction, PersonalInfo, Shop }
    ) => {
      try {

        const shopData = await Shop.findById(shopId);

        const personExisted = await PersonalInfo.findById(personalInfoId);
        if (!personExisted) {
          return {
            success: false,
            message: "PNE",
          };
        }

        //PNE = personalInfoId is not existed
        const transaction = new Transaction({
          shopId: shopId,
          personalInfoId: personalInfoId,
          marketName: shopData.marketName || "",
          shopName: shopData.name || "",
        });
console.log(transaction)
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
        if (!created) {
          return {
            message: "Shop is not created",
            success: false,
          };
        }

        return {
          message: "new Shop created",
          success: true,
        };
      } catch (error) {
        return {
          message: "Shop is not created",
          success: false,
        };
      }
    },

    //@Desc update the shop
    //@Access private
    updateShop: async (_, { updatedShop, shopId }, { Shop }) => {
      try {
        const updated = await Shop.findByIdAndUpdate(
          { _id: shopId },
          updatedShop
        );
        if (!updated) {
          return {
            success: false,
            message: "Cannot update the shop",
          };
        }
        return {
          success: true,
          message: "updated successfully !",
        };
      } catch (error) {
        return {
          success: false,
          message: "Cannot update the shop",
        };
      }
    },
    //@Desct delete the transaction by id
    //@acess admin

    deleteTrasaction: async (_, { transactionId }, { Transaction }) => {
      try {
        const deleted = await Transaction.findByIdAndDelete(transactionId);
        if (!deleted) {
          return {
            success: false,
            message: "Deleted not successfully ",
          };
        }

        return {
          success: true,
          message: "Deleted successfully ",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },

    //@Desc delete the shop from the database
    //@Access private

    deleteShop: async (_, { shopId }, { Shop }) => {
      try {
        const deleted = await Shop.findByIdAndDelete(shopId);
        if (!deleted) {
          return {
            message: "Shop not deleted",
            success: true,
          };
        }
        return {
          message: "Shop deleted successfully !",
          success: true,
        };
      } catch (error) {
        return {
          message: "Shop not deleted !",
          success: true,
        };
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
        console.log(error);
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
        const exist = await PersonalInfo.findOne({
          $and: [
            { tel: phonenumber },
            { firstName: firstName },
            { lastName: lastName },
          ],
        });
        let buyer;
        if (!exist) {
          buyer = new PersonalInfo({
            firstName: firstName,
            lastName: lastName,
            tel: phonenumber,
            buyer: true,
          });
        } else {
          return {
            success: true,
            message: "Verified",
            id: exist._id,
          };
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
