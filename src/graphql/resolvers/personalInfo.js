import moment from "moment";
import crypto from 'crypto'
import aws from 'aws-sdk'
import { promisify } from "util"
import mongoose from 'mongoose'
import { PubSub, withFilter } from "graphql-subscriptions";
const pubsub = new PubSub();

const randomBytes = promisify(crypto.randomBytes)
import {
  config
} from 'dotenv';
const logger = require("../../config/logger.js")


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

function formatDate(date) {
  var d = new Date(moment.parseZone(date).format("YYYY-MM-DD")),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export default {
  Query: {

 
    //For Doctor
    //@Desc Get location of the sample test
    //@Access Auth
    getSampleTestLocation: async (_, {}, { PersonalInfo,pubsub,req  }) => {
      let locationName = await PersonalInfo.aggregate([
        { $unwind: "$sampleTest" },
        { $group: { _id: "$sampleTest.testLocation" } },
      ]);

      return locationName;
    },

    //@Desc for export to the csv file
    //@Access  auth
    excelExport: async (_, { startDate, endDate }, { PersonalInfo }) => {
      // const allData = await PersonalInfo.find({
      //   $and: [
      //     {
      //       sampleTest: {
      //         $elemMatch: {
      //           date: {
      //             $gte: new Date("2021-08-05T00:00:00"),
      //             $lt: new Date("2021-08-05T59:00:00"),
      //           },
      //         },
      //       },
      //     },
      //     { commune: "ចារឈូក" },
      //   ],
      // });
      // return allData;
      const data = await PersonalInfo.aggregate([
        // {$group:{
        //   _id: "$currentState.confirmedAt" ,
        //       y: { $sum : 1 }
        // }}
        {$match:{"currentState.confirm":true}},
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$currentState.confirmedAt"} }, y: { $sum: 1 } } },
        { $sort: { _id: 1} }
      ]);

      

      
      return data
    },
    //@Desc get perfornal info for the Hospital
    //@Access police
    getPeopleForSampleTestWithPagination: async (
      _,
      { page, limit, keyword, startDate, endDate, testLocation,fillStartDate,fillEndDate },
      { PersonalInfo,pubsub,req}
    ) => {
  

      const options = {
        page: page || 1,
        limit: limit || 25,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        //   populate: "case",
      };
      let query;
      let start;
      let end;
      let testLocationQuery = {};
      let fillDateQuery = {};
      if(fillStartDate!==null && fillEndDate !==null){
        fillDateQuery = {"currentState.confirmFormFilled":{$gte:new Date(new Date(fillStartDate).setUTCHours(0,0,0,0)),$lt: new Date(new Date(fillEndDate).setUTCHours(23,59,59,59))}}; 
      }
 
      if (testLocation !== null) {
        if(testLocation===""){
          testLocationQuery = {
            sampleTest: {
              $elemMatch: {
                $or: [{ testLocation: testLocation }, { testLocation: null }],
              },
            },
          };
        }else{
          testLocationQuery = {sampleTest: {$elemMatch: {testLocation: testLocation }}}
        }
      }
 
      if (startDate !== null || endDate !== null) {
        start = formatDate(startDate) + "T00:00:00.00";
        end = formatDate(endDate) + "T23:59:59.00";
        // start = startDate;
        // end = endDate;
        query = {
          $and: [
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

            { sampleTest: { $elemMatch: { date: { $gte: start, $lt: end } } } },
            testLocationQuery,
            fillDateQuery
          ],
        };
      } else {
        query = {
          $and: [
            {
              $or: [
                {
                  "$expr": {
                    "$regexMatch": {
                      "input": { "$concat": ["$lastName", " ","$firstName"] },
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
            testLocationQuery,
            fillDateQuery
          ],
        };
      }



      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },

    //@Desc get perfornal info for the Hospital
    //@Access police

    getPatientForHospitalWithPagination: async (
      _,
      { page, limit, keyword = "", startDate, endDate, hospitalId,patientType,numberOfSampleTest,nextTest },
      { PersonalInfo,req, pubsub }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 20,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        //   populate: "case",
      };
      let hospitalizing = {};
      let recovered = {};
      let death = {};
      let sampleTestReminder = {};
      let left = {};
      let dateQuery = {}
      let sampleTestTimes = {};
      let bySampletTestNext = {}
    

      switch(patientType){
        case "កំពុងព្យាបាល":
           hospitalizing = {$or:[{ hospitalizations: { $elemMatch: { date_out: {$eq:null}}}},{ hospitalizations: { $elemMatch: { date_out: {$gt: new Date()}}}},]};
           recovered = {};
           death = {};
           sampleTestReminder = { };
           break; 

        case "ជាសះស្បើយ":
          hospitalizing = {};
          recovered = {"currentState.recovered":true};
          death = {};
          sampleTestReminder = {};
          left = {}
          break;
        case "ស្លាប់":
          hospitalizing = {};
          recovered = {};
          death = {"currentState.death":true};
          sampleTestReminder = {};
          left = {}
          break; 
        case "តាមដាន":
          hospitalizing ={};
          recovered = {};
          death = {};
          left = {}
          sampleTestReminder = { hospitalizations:{$elemMatch:{nextSampleTestDate:{$gte:new Date(new Date().setUTCHours(0,0,0,0)),$lt:new Date(new Date().setUTCHours(23,59,59,59))}}}};
          break;
        case "បានចាកចេញ":
          left = {$and:[ {hospitalizations: { $elemMatch: { date_out: {$ne:null}}}},{ hospitalizations: { $elemMatch: { date_out: {$lt: new Date(new Date().setUTCHours(0,0,0,0))}}}}, ]}
          hospitalizing ={};
          recovered = {};
          death = {};
          sampleTestReminder = {};
          break;
        default:
          hospitalizing ={};
          recovered = {};
          death = {};
          sampleTestReminder = {};
          left = {}
          break;
      }
   
      if(startDate !== null && endDate !== null && startDate !== undefined && endDate !== undefined){
        // console.log(startDate, endDate, district)
        var today = new Date(new Date(startDate).setUTCHours(0,0,0,0));
        var tomorrow= new Date(new Date(endDate).setUTCHours(23,59,59,59));
        dateQuery = { hospitalizations:{$elemMatch:{date_in:{$gte:today,$lt:tomorrow}} }}
        // { hospitalizations: { $elemMatch: { hospitalInfo: hospitalId } } },
      }

    
//find by array size 
  if(numberOfSampleTest){
    sampleTestTimes = { sampleTest :{$size : numberOfSampleTest}}
  }
  if(nextTest){
     bySampletTestNext = { hospitalizations:{$elemMatch:{nextSampleTestDate:{$gte:new Date(new Date(nextTest).setUTCHours(0,0,0,0)),$lt:new Date(new Date(nextTest).setUTCHours(23,59,59,59))}}}};
  }
 
      let query = {
        $and: [
          {
            $or: [
              { englishName: { $regex: keyword, $options: "i" } },
              { tel: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
              { patientId: { $regex: keyword, $options: "i" } },
              { idCard: { $regex: keyword, $options: "i" } },
            ],
          },
          { hospitalizations: { $elemMatch: { hospitalInfo: hospitalId } } },
          dateQuery,
          hospitalizing,
          recovered ,
          death ,
          sampleTestReminder ,
          left ,
          sampleTestTimes,
          bySampletTestNext
        ],
      };


      
      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },

    // the police
    //@Desc get perfornal info for the qurantine
    //@Access police

    getPeopleForQuarantineWithPagination: async (
      _,
      { quarantineInfoId, limit, page, keyword },
      { PersonalInfo,req,pubsub }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 20,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        //   populate: "case",
      };
      let query = {
        $and: [
          {
            $or: [
              { englishName: { $regex: keyword, $options: "i" } },
              { tel: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
              { patientId: { $regex: keyword, $options: "i" } },
              { idCard: { $regex: keyword, $options: "i" } },
            ],
          },
          { "quaranting.quarantineInfo": { $eq: quarantineInfoId } },
        
        ],
      };

      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },

    //@Desc get patient for interview
    //Access police

    getPatientForInterviewWithPagination: async (
      _,
      { page, limit, keyword = "", interview, startDate, endDate },
      { PersonalInfo,req,pubsub }
    ) => {

      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        //   populate: "case",
      };
      let query = {
        $and: [
          {
            $or: [
              { englishName: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
              { patientId: { $regex: keyword, $options: "i" } },
              { idCard: { $regex: keyword, $options: "i" } },
            ],
          },
          { sampleTest: { $elemMatch: { result: true } } },
          { interviewed: interview },
          // { "currentState.confirmedAt": { $gte: today, $lt: tomorrow } },
        ],
      };

      // pubsub.publish("USER_ACTION", {
      //   userActionWithPersonalInfo: {
      //     username:"Username :" +" "+ req.user.username +" "+ "Name :"+ req.user.firstName +" "+"LastName :"+req.user.lastName,
      //     userAction:" get patients for police to interview ",
      //     date:new Date(),
      //     type:"READ",
      //   },
      // });

      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },
    //Des

    //@Desc get affected Personalist
    //Access police

    getAffectedPersonalListWithPagination: async (
      _,
      { page, limit, keyword = "", patientId },
      { PersonalInfo,pubsub,req }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        //   populate: "case",
      };
      let query = {
        $and: [
          {
            $or: [
              { englishName: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
              { patientId: { $regex: keyword, $options: "i" } },
              { idCard: { $regex: keyword, $options: "i" } },
            ],
          },
          // { "currentState.confirm": true },
          // { "currentState.confirm": false },
          { "affectedFrom.patientCode": patientId },
        ],
      };
      // pubsub.publish("USER_ACTION", {
      //   userActionWithPersonalInfo: {
      //     username:"Username :" +" "+ req.user.username +" "+ "Name :"+ req.user.firstName +" "+"LastName :"+req.user.lastName,
      //     userAction:" getAffectedPersonalListWithPagination ",
      //     date:new Date(),
      //     type:"READ",
      //   },
      // });

      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },
    //@Desc get all the personalInfo that is confirmed  for interview
    // @Access Auth
    getConfirmedPersonalInfoByInterviewWithPagination: async (
      _,
      { page, limit, keyword = "", interview, startDate, endDate, district,village, commune,recovered,death,isFillDate},
      { PersonalInfo,req,pubsub }
    ) => {

      let dateQuery = {}
      if(startDate !== null && endDate !== null && startDate !== undefined && endDate !== undefined){
        var today = new Date(new Date(startDate).setUTCHours(0,0,0,0));
        var tomorrow= new Date(new Date(endDate).setUTCHours(23,59,59,59));
          if(isFillDate){
            dateQuery = { "currentState.confirmFormFilled": { $gte: today, $lt: tomorrow } }
          }else{
            dateQuery = { "currentState.confirmedAt": { $gte: today, $lt: tomorrow } }
          }
      }


      let districtQuery = {};
      let villageQuery = {};
      let communeQuery = {};
      let interviewQuery ={};
      if(district){
        districtQuery={ district: district}
      }

      if(village){
        villageQuery = {village:village}
      }
      if(commune){
        communeQuery = {commune:commune}
      }

      if(interview !==null){
       interviewQuery = { interviewed: interview };
      }
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: PersonalInfoLabels, 
        sort: {
          createdAt: -1,
        },
        //   populate: "case",
      };
      let query = {
        $and: [
          {
            $or: [
              { englishName: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
             
              { province: { $regex: keyword, $options: "i" } },
              { patientId: { $regex: keyword, $options: "i" } },
              { idCard: { $regex: keyword, $options: "i" } },
            ],
          },
          { "currentState.confirm": true },
          { "currentState.recovered": recovered },
          { "currentState.death": death },
         interviewQuery,
          districtQuery,
          dateQuery,
          villageQuery,
          communeQuery
        ],
      };

      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },

    //@Desc getting all the persinal info
    //@access private
    //

    allPersonalInfos: async (_, {}, { PersonalInfo }) => {
      const personalInfos = await PersonalInfo.find({});
      return personalInfos;
    },

    //@Desc get all the personal info that are not yet a patient 
    //@Access auth
    allPersonalInfosForThatNegative: async (_, {}, { PersonalInfo }) => {
      const personalInfos = await PersonalInfo.find({"currentState.confirm":false})
      return personalInfos;
    },

    getPersonalInfoWithPaginations: async (
      _,
      {   page,
          limit,
          covidType="",
          village,
          commune,
          district,
          province,
          firstName,
          lastName,
          confirm,
          death, 
          recovered,
          createdthisBy,
          updatedthisBy,
          createdSampleTestBy,
          createdSampleTestupdatedBy,
          createStartDate,
          createEndDate,
          confirmStartDate,
          confirmEndDate,
          recoveredStartDate,
          recoveredEndDate,
          deathStartDate,
          deathEndDate,
          sampleTestStartDate,  
          sampleTestEndDate
       },
      { PersonalInfo,req,pubsub }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        // populate: "case",
      };

      let con = {};
      let rec ={};
      let dea = {};
      let vill = {}
      let com = {};
      let dis ={};
      let prov = {};
      let first = {};
      let last = {};
      let createDateAt = {};
      let confirmDate = {};
      let deathDate = {};
      let recoveredDate = {};
      let sampleTestAtDate = {};
      let createdBy = {};
      let updateBy  = {};
      let sampleTestCreatedBy = {};
      let sampleTestUpdatedBy = {};
      let covidCon = {}


    con = {"currentState.confirm":confirm};
    rec = {"currentState.recovered":recovered};
    dea = {"currentState.death": death};

    if(recovered) con = {};
    if(death) {
      con = {}
      rec = {}
    }
      // 
      if(village) vill = {"village":village};
      if(commune) com = {"commune":commune};
      if(district) dis = {"district":district};
      if(province) prov = {"province":province};
      // ស្វែងរកតាមរយះ​ឈ្មោះ
      if(firstName) first = {"firstName":firstName};
      if(lastName) last= {"lastName":lastName}

      // confirmStartDate,
      // confirmEndDate,
      // ស្វែងរកប្រភេទកូវិដ
      if(covidType !== "" && covidType !== null)  covidCon = {"currentState.covidVariant":{$eq:covidType}};
      // ស្វែងរកតាមរយះថ្ងៃទីបង្កើត
      if(createStartDate !== null ||  createEndDate !== null)  createDateAt = {"createdAt":{$gte:new Date(new Date(createStartDate).setUTCHours(0,0,0,0)),$lt: new Date(new Date(createEndDate).setUTCHours(23,59,59,59))}};
      // ្វែងរកតាមរយះថ្ងៃទីឆ្លង
      if(confirmStartDate !==null && confirmEndDate !==null) confirmDate ={"currentState.confirmedAt":{$gte:new Date(new Date(confirmStartDate).setUTCHours(0,0,0,0)),$lt: new Date(new Date(confirmEndDate).setUTCHours(23,59,59,59))}}; 
      // ្វែងរកតាមរយះថ្ងៃទីស្លាប់
      if( deathStartDate !==null || deathEndDate!==null) deathDate ={"currentState.recoveredAt":{$gte:new Date(new Date(deathStartDate).setUTCHours(0,0,0,0)),$lt: new Date(new Date(deathEndDate).setUTCHours(23,59,59,59))}};
      // ្វែងរកតាមរយះថ្ងៃទីជា
      if(recoveredStartDate !==null || recoveredEndDate!==null)  recoveredDate ={"currentState.deathAt":{$gte:new Date(new Date(recoveredStartDate).setUTCHours(0,0,0,0)),$lt: new Date(new Date(recoveredEndDate).setUTCHours(23,59,59,59))}};
        // ស្វែងរកតាមរយះថ្ងៃទីការធ្វើតេស្ត
      if(sampleTestStartDate !==null || sampleTestEndDate !==null) sampleTestAtDate = {"sampleTest":{$elemMatch:{"date":{$gte:new Date(new Date(sampleTestStartDate).setUTCHours(0,0,0,0)),$lt:new Date(new Date(sampleTestEndDate).setUTCHours(23,59,59,59))}}}};

      // ស្វែងរកតាមរយះអ្នកចង្កើត
      if(createdthisBy) createdBy = {"createdBy":mongoose.Types.ObjectId(createdthisBy)};
      // ស្វែងរកតាមរយះអ្នកកែ
      if(updatedthisBy) updateBy = {"updatedBy": mongoose.Types.ObjectId(updatedthisBy)};
      // // ស្វែងរកតាមរយះអ្នកបញ្ជូលការយកសំណាក
       if(createdSampleTestBy) sampleTestCreatedBy = {"sampleTest":{$elemMatch:{"createdBy": mongoose.Types.ObjectId(createdSampleTestBy)}}};
      //  // ស្វែងរកតាមរយះអ្នកកែការយកសំណាក
       if(createdSampleTestupdatedBy) sampleTestUpdatedBy = {"sampleTest":{$elemMatch:{"updatedBy": mongoose.Types.ObjectId(createdSampleTestupdatedBy)}}};
      
      //

      let query = {
        $and: [
          con,
          rec,
          dea,
          vill,
          com,
          dis,
          prov,
          first,
          last,
          createDateAt,
          confirmDate,
          deathDate,
          recoveredDate,
          sampleTestAtDate,
          createdBy,
          updateBy ,
          sampleTestCreatedBy,
          sampleTestUpdatedBy,
          covidCon
        ],
      };
      // pubsub.publish("USER_ACTION", {
      //   userActionWithPersonalInfo: {
      //     username:"Username :" +" "+ req.user.username +" "+ "Name :"+ req.user.firstName +" "+"LastName :"+req.user.lastName,
      //     userAction:"getPersonalInfoWithPaginations ",
      //     date:new Date(),
      //     type:"READ",
      //   },
      // });
      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },



    //@Desc Getting all the persoanl Info with pagination
    //@access auth
    getPersonalInfoWithPagination: async (
      _,
      { page, limit, keyword, currentState, startDate,endDate,covidType="" },
      { PersonalInfo,req,pubsub }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        // populate: "case",
      };
      let today = "";
      let tomorrow = "";
      if(startDate !==null || endDate !==null){
        today = new Date(new Date(startDate).setUTCHours(0,0,0,0));
        tomorrow = new Date(new Date(endDate).setUTCHours(23,59,59,59));
      }

      let dateQuery = {}
      let current = {};
      let current1 = {};
      let current2 = {};
      let delta = {};

      switch (currentState) {
        case "វិជ្ជមាន":
          current = { "currentState.confirm": true}
          // current1 = { "currentState.recovered": false}
          // current2 = { "currentState.death": false}
          if(covidType!==""){
            delta = {"currentState.covidVariant": covidType}
            current1 = {}
            current2 = {}
          }
          
            if(today!==""){
              dateQuery = {"currentState.confirmedAt":{$gte:today,$lt:tomorrow}}
            }
          break;
        case "ជាសះស្បើយ":
          current = { "currentState.recovered": true}
          current1 = {}
          // current2 = { "currentState.death": false}
            if(today!==""){
              dateQuery = {"currentState.recoveredAt":{$gte:today,$lt:tomorrow}}
            }
          break;
        case "ស្លាប់":
          current = { "currentState.death": true}
            if(today!==""){
              dateQuery = {"currentState.deathAt":{$gte:today,$lt:tomorrow}}
            }
          break;
        case "អវិជ្ជមាន":
          current = { "currentState.confirm": false}
          current1 = { "currentState.recovered": false}
          current2 = { "currentState.death": false}
          
          break;
      default:
          current = {}
          dateQuery={}
          break;
      }

      let query = {
        $and: [
          {
            $or: [
              { tel: { $regex: keyword, $options: "i" } },
              { idCard: { $regex: keyword, $options: "i" } },
              { englishName: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
            ],
          },
          current,
          current1,
          current2,
          dateQuery,
          delta
          // {'currentState.confirmedAt': {$gte: '2021-08-13T00:00:00+07:00',$lt: '2021-08-14T00:00:00+07:00'}}
        ],
      };
      // pubsub.publish("USER_ACTION", {
      //   userActionWithPersonalInfo: {
      //     username:"Username :" +" "+ req.user.username +" "+ "Name :"+ req.user.firstName +" "+"LastName :"+req.user.lastName,
      //     userAction:"getPersonalInfoWithPagination ",
      //     date:new Date(),
      //     type:"READ",
      //   },
      // });

      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },

    //@Desc getting all the info by case Id with pagination \
    //@Access Auth

    getPersonalInfoByCaseWithPagination: async (
      _,
      { page, limit, keyword, caseId },
      { PersonalInfo,req,pubsub }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 20,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        // populate: "case",
      };

      let query = {
        $and: [
          {
            $or: [
              { tel: { $regex: keyword, $options: "i" } },
              { idCard: { $regex: keyword, $options: "i" } },
              { englishName: { $regex: keyword, $options: "i" } },
              { firstName: { $regex: keyword, $options: "i" } },
              { lastName: { $regex: keyword, $options: "i" } },
              { village: { $regex: keyword, $options: "i" } },
              { commune: { $regex: keyword, $options: "i" } },
              { disctrict: { $regex: keyword, $options: "i" } },
              { province: { $regex: keyword, $options: "i" } },
            ],
          },
          { case: { $eq: caseId.toString() } },
        ],
      };

      // pubsub.publish("USER_ACTION", {
      //   userActionWithPersonalInfo: {
      //     username:"Username :" +" "+ req.user.username +" "+ "Name :"+ req.user.firstName +" "+"LastName :"+req.user.lastName,
      //     userAction:"getPersonalInfoByCaseWithPagination ",
      //     date:new Date(),
      //     type:"READ",
      //   },
      // });

      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },

    //@Desc getting the personalInfo by id
    //@access auth

    getPersonalInfoById: async (_, { id }, { PersonalInfo,pubsub,req }) => {
      const persoanalInfo = await PersonalInfo.findOne({ _id: id });
      // pubsub.publish("USER_ACTION", {
      //   userActionWithPersonalInfo: {
      //     username:"Username :" +" "+ req.user.username +" "+ "Name :"+ req.user.firstName +" "+"LastName :"+req.user.lastName,
      //     userAction:"getPersonalInfoByCaseWithPagination ",
      //     date:new Date(),
      //     type:"READ",
      //   },
      // });

      return persoanalInfo;
    },
  },

  Subscription: {
    userActionWithPersonalInfo: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("USER_ACTION"),
    },

    // updateOrderonTheway: {
    //   //  subscribe: (_, userId, { pubsub }) => pubsub.asyncIterator(UPDATE_ORDER_CONFIRM,{userId:userId}),
    //   subscribe: withFilter(
    //     (_, orderId, { pubsub, Order }) => {
       
    //       // if (!user) throw new AuthenticationError('Unauthenticated')
    //       return pubsub.asyncIterator(UPDATE_ORDER_CONFIRM);
    //     },

    //     //comparing the order id from the subscription with the the order id being updated from the admin page 
    //     async({ updateOrderonTheway }, {orderId}, { Order }) => {
    //       // const orderExist = await Order.findById(orderId);
    //       // console.log(updateOrderonTheway._id, orderId)
    //       let id = updateOrderonTheway._id.toString()
    //       if (id === orderId) {
    //         return true;
    //       }
    //       return false;
    //     }
    //   ),
    // },
    // orderStateChange: {
    //   //  subscribe: (_, userId, { pubsub }) => pubsub.asyncIterator(UPDATE_ORDER_CONFIRM,{userId:userId}),
    //   subscribe: withFilter(
    //     (_, orderId, { pubsub, Order }) => {
    //       // if (!user) throw new AuthenticationError('Unauthenticated')
    //       return pubsub.asyncIterator(ORDER_STATE_CHANGE);
    //     },
    //     async({ orderStateChange }, {orderId}, { Order }) => {
    //       let id = orderStateChange.id
    //       if (id === orderId) {
    //         return true;
    //       }
    //       return false;
    //     }
    //   ),
    // },
  },

  Mutation: {
    // @Desc upload image url 

    uploadImageUrl:async(_,{},{req,pubsub})=>{
      const region = process.env.REGION
      const bucketName = process.env.BUCKET_NAME
      const accessKeyId = process.env.AWS_ACCESS_KEY_ID
      const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

      const s3 = new aws.S3({
        region,
        accessKeyId,
        secretAccessKey,
        signatureVersion: 'v4'
      })


  const rawBytes = await randomBytes(16)
  const imageName = rawBytes.toString('hex')

  const params = ({
    Bucket: bucketName,
    Key: imageName,
    Expires: 60
  })

  pubsub.publish("USER_ACTION", {
    userActionWithPersonalInfo: {
      username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
      userAction:"បញ្ចូលរូបភាព",
      date:new Date(),
      type:"CREATE",
    },
  });

  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  return uploadURL

    },

    //@Desc update the the historywithin14 days 
    //@access polic 
    updateHistoryWithin14days:async(_,{personalInfoId,historyWithin14Id,updateInfo},{PersonalInfo,req,pubsub})=>{
      try {
        await PersonalInfo.findOneAndUpdate(
          { _id: personalInfoId, "historyWithin14days._id": historyWithin14Id },
          {
            $set: {
              // midExamDetails.$.Marks
              "hospitalizations.$.locationName": updateInfo.locationName,
              "hospitalizations.$.affectedLocation": updateInfo.affectedLocation,
              "hospitalizations.$.date": updateInfo.date,
              "hospitalizations.$.lat": updateInfo.lat,
              "hospitalizations.$.long": updateInfo.long,
              "hospitalizations.$.other": updateInfo.other,
              "hospitalizations.$.description": updateInfo.description,
              "hospitalizations.$.direct": updateInfo.direct,
            },
          }
        );

        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"កែប្រែអ្នកប្រវត្តដំណើរក្នុងពេល ១៤ ថ្ងៃ",
            date:new Date(),
            type:"UPDATE",
          },
        });
        return {
          success: true,
          message: "កែរប្រែបានជោគជ័យ",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    //@Desc add Vaccination 
    //@ACCESS 
    addVaccination: async (
      _,
      { vaccination, personalInfoId },
      { PersonalInfo,pubsub,req }
    ) => {
      try {
        const updatedData = await PersonalInfo.findByIdAndUpdate(
          personalInfoId,
          { $push: { vaccination: vaccination } }
        );
        if (!updatedData) {
          return {
            success: false,
            message: "មិនទាន់មានអ្នកកំណត់ត្រានេះទេ",
          };
        }
        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"បញ្ចូលការចាក់វ៉ាក់សាំង",
            date:new Date(),
            type:"CREATE",
          },
        });
        return {
          success: true,
          message: "ជោគជ័យ",
        };


      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    //@Desc Delete the patient from hospital
    //Access admin

    deletePatientFromHospital: async (
      _,
      { personalInfoId, hospitalId },
      { PersonalInfo,pubsub,req }
    ) => {
      try {
  
        let a = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $pull: { hospitalizations: { _id: hospitalId } },
          }
        );
        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"លុបអ្នកជំងឺចេញ់ពីមន្ទីពេទ្យ",
            date:new Date(),
            type:"DELETE",
          },
        });
      
        return {
          success: true,
          message: "លុបបានជោគជ័យ",
        };
      } catch (error) {
        return {
          success: false,
          message: `លុបមិនបានជោគជ័យ សូមទាក់ទងអេតមិន ជាមួសារនេះ ${error.message}`,
        };
      }
    },

    //@Decs Delete the people from the quranrantine
    //@Access


    deletePeopleFromQuarantine: async (
      _,
      { personalInfoId, quarantingId },
      { PersonalInfo,pubsub,req }
    ) => {
      try {
      
        let a = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $pull: { quaranting: { _id: quarantingId } },
          }
        );

        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"លុបអ្នកពាក់ពន្ធចេញ់ពីមណ្ឌលចត្តឡីស័ក ",
            date:new Date(),
            type:"DELETE",
          },
        });

        return {
          success: true,
          message: "លុបទទួលបានជោគជ័យ",
        };
      } catch (error) {
        return {
          success: false,
          message: `លុបទិន្ន័យមិនបានទទួលបានជោគជ័យទេ ${error.message}`,
        };
      }
    },
    //@Desc update simple test
    //@access doctor

    updateSampleTest: async (
      _,
      { personalInfoId, sampleTestId, sampleTest },
      { PersonalInfo,req,pubsub }
    ) => {
   
      try {
       if(!req.user){
         return {
           success: false,
           message:"មិនអាចបានកែបានទេ"
         }
       }
        await PersonalInfo.findOneAndUpdate(
          { _id: personalInfoId, "sampleTest._id": sampleTestId },
          {
            $set: {
              // midExamDetails.$.Marks
              "sampleTest.$.date": sampleTest.date,
              "sampleTest.$.times": sampleTest.times,
              "sampleTest.$.testLocation": sampleTest.testLocation,
              "sampleTest.$.result": sampleTest.result,
              "sampleTest.$.symptom": sampleTest.symptom,
              "sampleTest.$.other": sampleTest.other,
              "sampleTest.$.reasonForTesting": sampleTest.reasonForTesting,
              "sampleTest.$.symptomStart": sampleTest.symptomStart,
              "sampleTest.$.labFormCompletedBy": sampleTest.labFormCompletedBy,
              "sampleTest.$.specimentType": sampleTest.specimentType,
              "sampleTest.$.laboratory": sampleTest.laboratory,
              "sampleTest.$.covidVariant": sampleTest.covidVariant,
              "sampleTest.$.resultDate": sampleTest.resultDate,
              "sampleTest.$.testType": sampleTest.testType,
              "sampleTest.$.formFillerName": sampleTest.formFillterName,
              "sampleTest.$.labFormCompletedByTel":
                sampleTest.labFormCompletedByTel,
              "sampleTest.$.formFillerTel": sampleTest.formFillerTel,
              "sampleTest.$.nextSampleTestDate": sampleTest.nextSampleTestDate,
              "sampleTest.$.updatedBy": req.user.id,
              
            },
          }
        );
        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"កែប្រែការយកសំណាក ",
            date:new Date(),
            type:"UPDATE",
          },
        });
        
        return {
          success: true,
          message: "Update Successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
//@Desc update the rabish data
    updateTestLocation:async(_,{query,update},{PersonalInfo})=>{
      await PersonalInfo.updateMany(
        { "sampleTest.testLocation": query},
        {
          $set: {
 
            "sampleTest.$.testLocation": update,
          },
        }
      );
      return "success"

    },

    // For police
    addPatientToHospital: async (
      _,
      { personalInfoId, newHospitalization },
      { PersonalInfo,req,pubsub }
    ) => {
      try {

        let isExisted = await PersonalInfo.findById(personalInfoId);
        if (!isExisted) {
          return {
            message: "មិនអាចបញ្ចូលបានទេព្រោះគ្មានបុគ្គលនេះទេ",
            success: false,
          };
        }

        let isAlreadyIn = await PersonalInfo.findOne({
          $and: [
            {"_id": personalInfoId},
            {hospitalizations:{$elemMatch:{hospitalInfo:newHospitalization.hospitalInfo}}}
          ]
        } );   
       
        if (isAlreadyIn) {
          return {
            message: "បុគ្គលនេះស្ថិតនៅក្នុងមណ្ឌលនេះម្តងហើយ",
            success: false,
          };
        }



        const updatedData = await PersonalInfo.findByIdAndUpdate(
          personalInfoId,
          { $push: { hospitalizations: newHospitalization } }
        );
        if (!updatedData) {
          return {
            success: false,
            message: "មិនទាន់មានអ្នកកំណត់ត្រានេះទេ",
          };
        }

        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"បញ្ចូលអ្នកជំងឺចូលក្នងមទ្ទីរពេទ្យ",
            date:new Date(),
            type:"CREATE",
          },
        });

        return {
          message: "បញ្ចូលបានជោកជ័យ",
          success: true,
        };
      } catch (error) {
        return {
          message: "មិនអាចបញ្ចូលបានទេ",
          success: error.message,
        };
      }
    },

    //@Desc update the people from the qurantine 
    //@Access polic and admin 

    // updatePeopleFromQuarantine: async (
    //   _,
    //   {personalInfoId,quarantineId,updateInfo},
    //   { PersonalInfo }
    // ) => {
   
    //   try {
      
    //     await PersonalInfo.findOneAndUpdate(
    //       { _id: personalInfoId, "quaranting._id": quarantineId },
    //       {
    //         $set: {
    //           // midExamDetails.$.Marks
    //           "quaranting.$.date_in": updateInfo.date_in,
    //           "quaranting.$.date_out": updateInfo.date_out,
    //           "quaranting.$.locationName": updateInfo.locationName,
    //           "quaranting.$.locationType": updateInfo.locationType,
    //           "quaranting.$.coorporate": updateInfo.coorporate,
    //           "quaranting.$.personType": updateInfo.personType,
    //           "quaranting.$.out_status": updateInfo.out_status,
    //           "quaranting.$.qurantineInfo": updateInfo.qurantineInfo,
    //           "quaranting.$.lat": updateInfo.lat,
    //           "quaranting.$.long": updateInfo.long,
              
    //         },
    //       }
    //     )

    //     return {
    //       success: true,
    //       message: "ការកែប្រែទទួលបានជោគជ័យ",
    //     };
    //   } catch (error) {
    //     return {
    //       success: false,
    //       message: error.message,
    //     };
    //   }
    // },



    //@Desc update the quarantine in the personalinfo 
    //@Access auth and super 
   
    updatePeopleFromQuarantine: async (
      _,
      {personalInfoId,quarantineInfoInnerId,updateInfo},
      { PersonalInfo,req,pubsub }
    ) => {
      try {
   await PersonalInfo.findOneAndUpdate(
          { _id: personalInfoId, "quaranting._id": quarantineInfoInnerId },
          {
            $set: {
              // midExamDetails.$.Marks
              "quaranting.$.date_in": updateInfo.date_in,
              "quaranting.$.date_out": updateInfo.date_out,
              "quaranting.$.locationName": updateInfo.locationName,
              "quaranting.$.locationType": updateInfo.locationType,
              "quaranting.$.coorporate": updateInfo.coorporate,
              "quaranting.$.personTypes": updateInfo.personTypes,
              "quaranting.$.out_status": updateInfo.out_status,
              "quaranting.$.quarantineInfo": updateInfo.quarantineInfo,
              "quaranting.$.lat": updateInfo.lat,
              "quaranting.$.long": updateInfo.long,
              "quaranting.$.roomNumber": updateInfo.roomNumber,
              "quaranting.$.totalRoomate": updateInfo.totalRoomate,
            },
          }
        )

        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"កែប្រែការបញ្ចូលអ្នកពាក់ព័ន្ធ",
            date:new Date(),
            type:"UPDATE",
          },
        });
        return {
          success: true,
          message: "ការកែប្រែទទួលបានជោគជ័យ",
        };
      } catch (error) {
        return {
          success: false,
          message: `សូមទាក់ទាងខាង IT ដើម្បីដោះស្រាយបញ្ហានេះ ${error.message}`,
        };
      }
    },
      
 //@Desc update the hospitalinfo in the personal info 
 //@Access auth and supper 
    updatePatientFromHospital: async (
      _,
      { personalInfoId,hospitalId,updateInfo},
      { PersonalInfo,pubsub,req }
    ) => {
     
      try {

       await PersonalInfo.findOneAndUpdate( 
          {  _id: personalInfoId, "hospitalizations._id": hospitalId},
          {
            $set: {
              "hospitalizations.$.date_in": updateInfo.date_in,  
              "hospitalizations.$.date_out": updateInfo.date_out,
              "hospitalizations.$.hospitalInfo": updateInfo.hospitalInfo,
              "hospitalizations.$.hospitalName": updateInfo.hospitalName,
              "hospitalizations.$.covidVariant": updateInfo.covidVariant,
              "hospitalizations.$.coorporate": updateInfo.coorporate,
              "hospitalizations.$.description": updateInfo.description,
              "hospitalizations.$.lat": updateInfo.lat,
              "hospitalizations.$.long": updateInfo.long,
              "hospitalizations.$.province": updateInfo.province,
              "hospitalizations.$.personTypes": updateInfo.personTypes,
              "hospitalizations.$.personTypes": updateInfo.personTypes,
              "hospitalizations.$.nextSampleTestDate": updateInfo.nextSampleTestDate,
              "hospitalizations.$.infection": updateInfo.infection,
            },
          }
        )

        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"កែប្រែការបញ្ចូលអ្នកជំងឺ",
            date:new Date(),
            type:"UPDATE",
          },
        });

        return {
          success: true,
          message: "Update Successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
      
    // deletePatientFromHospital
    // For police
    addPeopleToQuarantine: async (
      _,
      { personalInfo, newQuarantine },
      { PersonalInfo,pubsub,req }
    ) => {
      try {
        let isExisted = await PersonalInfo.findById(personalInfo);
        if (!isExisted) {
          return {
            message: "មិនអាចបញ្ចូលបានទេព្រោះគ្មានបុគ្គលនេះទេ",
            success: false,
          };
        }


        let isAlreadyIn = await PersonalInfo.findOne({
          $and: [
            {"_id": personalInfo},
            {quaranting:{$elemMatch:{quarantineInfo:newQuarantine.quarantineInfo}}}
          ]
        } );   
       
       
        if (isAlreadyIn) {
          return {
            message: "បុគ្គលនេះស្ថិតនៅក្នុងមណ្ឌលនេះម្តងហើយ",
            success: false,
          };
        }

        await PersonalInfo.updateOne(
          { _id: personalInfo },
          {
            $push: {
              quaranting: {
                $each: [newQuarantine],
                // $sort: { score: 1 },
                $slice: -5,
              },
            },
          }
        );
        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"បញ្ចូលអ្នកពាក់ព័ន្ធទៅក្នុងមណ្ឌលចត្តឡីស័ក",
            date:new Date(),
            type:"CREATE",
          },
        });
    
        return {
          message: "បញ្ចូលបានជោកជ័យ",
          success: true,
        };
      } catch (error) {
        return {
          message: "មិនអាចបញ្ចូលបានទេ",
          success: error.message,
        };
      }
    },

    //@Desc add history within 14 days
    //@Access police
    addHistoryWithin14days: async (
      _,
      { createLocation, personalInfoId },
      { PersonalInfo,req,pubsub }
    ) => {
      try {
        let isExisted = await PersonalInfo.findById(personalInfoId);
        if (!isExisted) {
          return {
            message: "មិនអាចបញ្ចូលបានទេ",
            success: false,
          };
        }
        await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $push: {
              historyWithin14days: {
                $each: [createLocation],
                $slice: -50,
              },
            },
          }
        );
        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"បញ្ចូលប្រវត្តដំណើរក្នុងរយះពេល ១៤​ថ្ងៃ",
            date:new Date(),
            type:"WRITE",
          },
        });
        return {
          message: "បញ្ចូលបានជោកជ័យ",
          success: true,
        };
      } catch (error) {
        return {
          message: "មិនអាចបញ្ចូលបានទេ",
          success: error.message,
        };
      }
    },

    //@Desc update the travel
    //@Access Police 

    updateTravelOverCountryHistory: async (
      _,
      { personalInfoId, updateValue },
      { PersonalInfo,req,pubsub }
    ) => {
      try {
        const updated = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $set: {
              travelOverCountryHistory: updateValue,
            },
          }
        );
        if (!updated) {
          return {
            success: false,
            message: "មិនអាចកែប្រែបានទេ ",
          };
        }

        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"កែប្រែប្រវត្តដំណើរ ក្រៅប្រទេសក្នុងរយះពេល ១៤​ថ្ងៃ",
            date:new Date(),
            type:"UPDATE",
          },
        });
        return {
          success: true,
          message: "កែប្រែបានជោគជ័យ",
        };
      } catch (error) {
       
        return {
          success: false,
          message: error.message,
        };
      }
    },


    //@Desc update the current State
    //@Access auth
    updateCurrentState: async (
      _,
      { personalInfoId, updateValue },
      { PersonalInfo,req,pubsub}
    ) => {
      try {
        const updated = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $set: {
              currentState: updateValue,
            },
          }
        );
        if (!updated) {
          return {
            success: false,
            message: "មិនអាចកែប្រែបានទេ  ",
          };
        }
        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"កែប្រែស្ថានភាពបចប្បន្នរបស់អ្នកជំងឺ",
            date:new Date(),
            type:"UPDATE",
          },
        });
        return {
          success: true,
          message: "កែប្រែបានជោគជ័យ ",
        };
      } catch (error) {
       
        return {
          success: false,
          message: error.message,
        };
      }
    },

      //@Desc update the current State
    //@Access auth
    updateAffectedFrom: async(
      _,
      { personalInfoId, updateValue },
      { PersonalInfo,req,pubsub }
    ) => {
      try {
        const updated = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $set: {
              affectedFrom: updateValue,
            },
          }
        );

        if (!updated) {
          return {
            success: false,
            message: "Cannot this status ",
          };
        }
        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"កែប្រែអ្នកពាក់ព័ន្ធ",
            date:new Date(),
            type:"UPDATE",
          },
        });
        return {
          success: true,
          message: "Updated successfully ",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },

    //@Desc add Sample test to the hospitalization
    //@Access goglobal
    recordSampleTest: async (
      _,
      { sampleTest, personalInfoId },
      { PersonalInfo,req,PubSub }
    ) => {
      try {
        if(!req.user){
          return {
            success: false, 
            message: "សូមមេត្តា lOGIN ម្តងទៀត រឺ​ refresh "
          }
        }
        let newSampleTest = {...sampleTest,createdBy:req.user.id};
        const updatedData = await PersonalInfo.findByIdAndUpdate(
          personalInfoId,
          { $push: { sampleTest: newSampleTest } }
        );
        if (!updatedData) {
          return {
            success: false,
            message: "មិនទាន់មានអ្នកកំណត់ត្រានេះទេ",
          };
        }

        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"បញ្ចូលការយកសំណាក",
            date:new Date(),
            type:"WRITE",
          },
        });
    
        return {
          success: true,
          message: "ជោគជ័យ",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },

    // @Desc delete History within 14 days
    // @auth

    deleteHistoryWithin14days: async (
      _,
      { personalInfoId, historyWithin14Id },
      { PersonalInfo,req,pubsub }
    ) => {
      try {
        let a = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $pull: { historyWithin14days: { _id: historyWithin14Id } },
          }
        );
        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"លុបប្រវត្តដំណើរក្នុង ១៤ថ្ងៃ",
            date:new Date(),
            type:"DELETE",
          },
        });
        return {
          success: true,
          message: "Deleted Successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "cannot delete please ask admin",
        };
      }
    },

    //@Desc delete the hospital from the the persoanl info
    //@access auth admin 
        // @Desc delete sample Test
    // @auth

    // deleteHospitalFromPersonalInfo: async (
    //   _,
    //   { personalInfoId, hospitalId },
    //   { PersonalInfo }
    // ) => {
    //   try {
    //     let a = await PersonalInfo.updateOne(
    //       { _id: personalInfoId },
    //       {
    //         $pull: { hospitalizations: { _id: hospitalId } },
    //       }
    //     );

    //     return {
    //       success: true,
    //       message: "មិនអាច លុបបានទេ",
    //     };
    //   } catch (error) {
    //     return {
    //       success: false,
    //       message: error.message,
    //     };
    //   }
    // },

    // @Desc delete sample Test
    // @auth

    deleteSampleTest: async (
      _,
      { personalInfoId, sampleTestId },

      { PersonalInfo,req ,pubsub}
    ) => {
      try {
        if(!req.user){
          return {
            success: false,
            message: "មិនអាចលុបបានទេ"
          }
        }
        let a = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $pull: { sampleTest: { _id: sampleTestId } },
          }
        );
        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"លុបការយកសំណាក",
            date:new Date(),
            type:"DELETE",
          },
        });
        return {
          success: true,
          message: "លុបបានជោគជ័យ",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },

    //@Desc delete the vacination from the personalInfo
    //@Access admin deleteVaccination
    deleteVaccination: async (
      _,
      { personalInfoId, vaccinationId },
      { PersonalInfo,req,pubsub }
    ) => {
      try {
        let a = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $pull: { vaccination: { _id: vaccinationId } },
          }
        );
        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"លុបការចាក់វ៉ាក់សាំង",
            date:new Date(),
            type:"DELETE",
          },
        });
        return {
          success: true,
          message: "មិនអាច លុបបានទេ",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },


    //@Desc create new Personal Info
    //@access auth
    createPersonalInfo: async (_, { newInfo }, { PersonalInfo,req,pubsub }) => {
      
      try {
        if(!req.user){
          return {
            response: {
              message: "សូមមេត្តា refresh រឺ login ជាថ្មី",
              success: false,
            },
            personalInfo: {},
          };
        }
        let newPersonalInfo = {...newInfo,createdBy: req.user.id}
        if(newInfo.patientId){
          let patientIdExist = await PersonalInfo.findOne({patientId:newInfo.patientId});
          if (patientIdExist) {
            return {
              response: {
                message: "សូមមេពិនិត្យ លេខសំគាល់អ្នកជំង្ងឺ ម្តងទៀតយើងពិនិតឃើញថា វាផ្ទូនស្ទូន",
                success: false,
              },
              personalInfo: {},
            };
          }
        }
       
        let exist = await PersonalInfo.findOne({
          $and: [
            { firstName: newInfo.firstName },
            { lastName: newInfo.lastName },
          ],
        });
        if (exist) {
          return {
            response: {
              message: "សូមមេពិនិត្យឈ្មោះ ម្តងទៀតយើងពិនិតឃើញថាមាន ទិន្ន័យស្ទូន",
              success: false,
            },
            personalInfo: {},
          };
        }
        const info = new PersonalInfo(newPersonalInfo);
        const personalInfo = await info.save();
        if (!personalInfo) {
          return {
            response: {
              message: "មិនអាចបង្កើតបានទេ",
              success: false,
            },
            personalInfo: {},
          };
        }
        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"បង្កើតប្រជាជនថ្មី",
            date:new Date(),
            type:"CREATE",
          },
        });
        return {
          response: {
            message: "success",
            success: true,
          },
          personalInfo: personalInfo,
        };
      } catch (error) {
        return {
          response: {
            message: "Cannot create personal Info",
            success: false,
          },
          personalInfo: personalInfo,
        };
      }
    },

    //@Desc delete the personal info
    //@access admin

    deletePersonalInfo: async (_, { id }, { PersonalInfo,req,PubSub,Transaction }) => {
      try {
        if(!req.user){
          return {
            success: false,
            message:"មិនអាចលុបបានទេ"
          }
        }
        const deletedInfo = await PersonalInfo.findByIdAndDelete(id);
        if (!deletedInfo) {
          return {
            success: false,
            message: "cannot delete this record",
          };
        }
        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"លុបប្រជាជន",
            date:new Date(),
            type:"DELETE",
          },
        });
        return {
          success: true,
          message: "Personal Info deleted successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: "Cannot delete this record please contact the admin",
        };
      }
    },

    //@Desc update the personal info
    //@access auth

    updatePersonalInfo: async (_, { id, updatedInfo }, { PersonalInfo,req,pubsub }) => {
      try {

        if(!req.user){
          return {
          
              message: "សូមមេត្តា refresh រឺ login ជាថ្មី",
              success: false,
        
          };
        }
        logger.info({
          level:"info",
          message:`personalInfo updated ${req.user.id}`,
          meta:req.user.id
        })

        let newPersonalInfo = {...updatedInfo,updatedBy:req.user.id}
        const isUpdated = await PersonalInfo.findByIdAndUpdate(id, newPersonalInfo);
        
        if (!isUpdated) {
          return {
            success: false,
            message: "Personal Info updated not successfully",
          };
        }
        pubsub.publish("USER_ACTION", {
          userActionWithPersonalInfo: {
            username:"ឈ្មោះ​៖ "+ req.user.lastName +" "+req.user.firstName,
            userAction:"កែប្រែប្រជាជន",
            date:new Date(),
            type:"UPDATE",
          },
        });
        return {
          success: true,
          message: "Cannot update this record please contact the admin",
        };
      } catch (error) {
        return {
          success: false,
          message: "Cannot update this record please contact the admin",
        };
      }
    },
  },
};
