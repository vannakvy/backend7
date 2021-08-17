import moment from "moment";
import PersonalInfo from "../typeDefs/PersonalInfo";
export default {
  Query: {


    //@Desc get all positive confirm and death 

    getPeopeleConfirmRecoverAndDeath:async(_,{startDate, endDate},{PersonalInfo})=>{

        const data1 = await PersonalInfo.find({$and:[{"currentState.recovered": true },{ "currentState.recoveredAt": { $gte: startDate,$lt: endDate}  }] })
        const data2 = await PersonalInfo.find({$and:[{"currentState.death": true },{ "currentState.deathAt": { $gte: startDate,$lt: endDate}  }] })
        const data3 = await PersonalInfo.find({$and:[{"currentState.confirm": true },{ "currentState.confirmedAt": { $gte: startDate,$lt: endDate}  }] })
        
       const  reportData ={
            recovered : data1,
            death:data2,
            confirm:data3
          }
          return reportData
    },

    
    // "$gte": new Date("2014-08-01"), "$lt": new Date("2014-08-02")


    // @Desc get totalSampleTest and today sample test 
    // Access auth 
    getAllAllSampleTest:async(_,{},{PersonalInfo})=>{
      var today = new Date(new Date().setUTCHours(0,0,0,0));
      var end= new Date(new Date().setUTCHours(23,59,59,59));
      let district = "សៀមរាប"
      let query = {};

      let data =  await PersonalInfo.aggregate([
        // { "$match":{ "district": district } },
          { "$match":{ "sampleTest.date": {$gte:today,$lt:end} } },
         
          { "$group": {
              "_id": 1,
              "count": {
                  "$sum": 1
              }
          } }
       ])
  
       let dataAll =  await PersonalInfo.aggregate([
        // { "$match":{ "district": district } },
        { "$project": {
              "all": { "$size": "$sampleTest" }
        } },
        { "$group": {"_id": 1,"count": {"$sum": "$all"}},
  
      },
     
     ])

        return {
          today: data[0].count,
          all:dataAll[0].count
        }
      },
      
    //@Desc getAllProvinces
    //@Access auth

    getAllProvince: async (
      _,
      { district },
      { PersonalInfo, Quarantine, Hospitalization, AffectedLocation,HospitalInfo,QuarantineInfo}
    ) => {
     
      
      let confirm = 0;
      let recover = 0;
      let death = 0;
      let confirmToday = 0;
      let recoveredToday = 0;
      let deathToday = 0;
      let quarantineToday=0;
      let sampleTest =0;
      let sampleTestToday=0;
      let dataToday=[];
      let dataAll=[];
      let totalAffectedLocation=0;
      let totalAffectedLocationToday=0;
      let totalAffectedLocationClosed=0;
      let totalAffectedLocationClosedToday=0;


      var today = new Date(new Date().setUTCHours(0,0,0,0));
      var tomorrow= new Date(new Date().setUTCHours(23,59,59,59));
   

      let totalHospital = await HospitalInfo.countDocuments({})
      let totalQuarantine = await QuarantineInfo.countDocuments({})
      // let totalAffectedLocation = await AffectedLocation.countDocuments({})
      // let totalAffectedLocationClose = await AffectedLocation.countDocuments({
      //   $and: [{ openAt: {$eq: null} }, { closeAt: {$ne: null} }],
      // });
     


      
      if (district === "" || district === "ករំីណីទាំងអស់") {

        totalAffectedLocation = await AffectedLocation.countDocuments({})
        totalAffectedLocationToday = await AffectedLocation.countDocuments({createdAt:{$gte:today,$lt:tomorrow}})
        totalAffectedLocationClosed = await AffectedLocation.countDocuments({ $and: [{ openAt: {$eq: null} }, { closeAt: {$ne: null} }]});
        totalAffectedLocationClosedToday = await AffectedLocation.countDocuments({ $and: [{ openAt: {$eq: null} }, { closeAt: {$ne: null} },{closedAt:{$gte:today,$lt:tomorrow}}]});
         dataAll =  await PersonalInfo.aggregate([
          // { "$match":{ "district": district } },
          { "$project": {
                "all": { "$size": "$sampleTest" }
          } },
          { "$group": {"_id": 1,"count": {"$sum": "$all"}},
          },
          
          ])   
     
       dataToday =  await PersonalInfo.aggregate([
        // { "$match":{ "district": district } },
          { "$match":{ "sampleTest.date": {$gte:today,$lt:tomorrow} } },
         
          { "$group": {
              "_id": 1,
              "count": {
                  "$sum": 1
              }
          } }
       ])
     

        confirm = await PersonalInfo.countDocuments({
          "currentState.confirm": true,
        });
        recover = await PersonalInfo.countDocuments({
          "currentState.recovered": true,
        });
        death = await PersonalInfo.countDocuments({
          "currentState.death": true,
        });
        // const confirmToday = await PersonalInfo.countDocuments({"currentState.confirm":true,"currentState.confirmedAt": new Date() });
     
        confirmToday = await PersonalInfo.countDocuments({
          "currentState.confirmedAt": { $gte: today, $lt: tomorrow },
        });
        recoveredToday = await PersonalInfo.countDocuments({
          "currentState.recoveredAt": { $gte: today, $lt: tomorrow },
        });
        deathToday = await PersonalInfo.countDocuments({
          "currentState.deathAt": { $gte: today, $lt: tomorrow },
        });

        deathToday = await PersonalInfo.countDocuments({
          "currentState.deathAt": { $gte: today, $lt: tomorrow },
        });

      } else {

        totalAffectedLocation = await AffectedLocation.countDocuments({"district":district})
        totalAffectedLocationToday = await AffectedLocation.countDocuments({ $and:[{"createdAt":{$gte:today,$lt:tomorrow}},{"district":district}]});

        totalAffectedLocationClosed = await AffectedLocation.countDocuments({ $and: [{ openAt: {$eq: null} }, { closeAt: {$ne: null} },{district:district}]});
        totalAffectedLocationClosedToday = await AffectedLocation.countDocuments({ $and: [{ openAt: {$eq: null} }, { closeAt: {$ne: null} },{closedAt:{$gte:today,$lt:tomorrow}},{district:district}]});

        confirm = await PersonalInfo.countDocuments({
          $and: [{ "currentState.confirm": true }, { district: district }],
        });
        recover = await PersonalInfo.countDocuments({
          $and: [{ "currentState.recovered": true }, { district: district }],
        });
        death = await PersonalInfo.countDocuments({
          $and: [{ "currentState.death": true }, { district: district }],
        });
        //   // const confirmToday = await PersonalInfo.countDocuments({"currentState.confirm":true,"currentState.confirmedAt": new Date() });

        confirmToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirmedAt": { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });

        recoveredToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.recoveredAt": { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });
        deathToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.deathAt": { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });

        sampleTestToday = await PersonalInfo.countDocuments({
          $and: [
            { sampleTest:{ $elemMatch:{ date:{ $gte: today, $lt: tomorrow } }}},
            { district: district },
          ],
        });


        dataAll =  await PersonalInfo.aggregate([
          { "$match":{ "district": district } },
          { "$project": {
                "all": { "$size": "$sampleTest" }
          } },
          { "$group": {"_id": 1,"count": {"$sum": "$all"}},
          
          },
          ])

      dataToday =  await PersonalInfo.aggregate([
        { "$match":{ "district": district } },
          { "$match":{ "sampleTest.date": {$gte:today,$lt:tomorrow} } },
          // { "$project": {
          //       "all": { "$size": "$sampleTest" }
          // } },
          { "$group": {
              "_id": 1,
              "count": {
                  "$sum": 1
              }
          } }
        ])


      //  if(dataToday ===[]){
      //    console.log("dataToday =0")
      //    sampleTestToday =0
      //  }else{
      //   sampleTestToday = dataToday[0].count
      //  }

      //  if(dataAll ===[]){
      //   sampleTest =0
      //   console.log("dataAll =0")
      // }else{
      //  sampleTest = dataAll[0].count
      // }
       
    
        
      }

if(dataAll.length!==0){
  sampleTest = dataAll[0].count
}
if(dataToday.length!==0){
  sampleTestToday = dataToday[0].count
}
      
      // console.log(dataToday[0].count,"dataToday",dataAll[0].count)


      let dataForBoxes = {
        sampleTest:sampleTest,
        sampleTestToday:sampleTestToday,
        confirmedCase: confirm,
        confirmedCaseToday: confirmToday,
        death: death,
        deathToday: deathToday,
        recovered: recover,
        recoveredToday: recoveredToday,
        totalHospital:totalHospital,
        totalQuarantine:totalQuarantine,
        totalAffectedLocation:totalAffectedLocation,
        totalAffectedLocationToday:totalAffectedLocationToday,
        totalAffectedLocationClosed:totalAffectedLocationClosed,
        totalAffectedLocationClosedToday:totalAffectedLocationClosedToday
        // totalAffectedLocationOn:totalAffectedLocationOn,
        // totalAffectedLocationClose:totalAffectedLocationClose,
        // totalAffectedLocationNew:totalAffectedLocationNew
        // totalPeopleInHospitalization,
        // totalQuarantine,
        // totalAffectedLocation,
      };

      console.log(dataForBoxes)
      return dataForBoxes;
    },

    getAllDistrictForMap: async (_, {}, { PersonalInfo }) => {
      var today = new Date(new Date().setUTCHours(0,0,0,0));
      // var tomorrow= new Date(new Date(endDate).setUTCHours(23,59,59,59));

      const data = await PersonalInfo.aggregate([
        {
          $project: {
            district: 1,
            confirm: {
              // Set to 1 if currentState.confirm = true
              $cond: [{ $eq: ["$currentState.confirm", true] }, 1, 0],
            },
            recovered: {
              // Set to 1 if currentState.recovered = true
              $cond: [{ $eq: ["$currentState.recovered", true] }, 1, 0],
            },
            death: {
              // Set to 1 if currentState.death = true
              $cond: [{ $eq: ["$currentState.death", true] }, 1, 0],
            },
       
            confirmedAt: {
              $cond: [{ $gte: ["$currentState.confirmedAt", today] }, 1, 0],
            },
            recoveredAt: {
              $cond: [{ $gte: ["$currentState.recoveredAt", today] }, 1, 0],
            },
            deathAt: {
              $cond: [{ $gte: ["$currentState.deathAt", today] }, 1, 0],
            },
          },
        },
        {
          $group: {
            _id: "$district",
            confirmedCase: { $sum: "$confirm" },
            recovered: { $sum: "$recovered" },
            death: { $sum: "$death" },
            confirmedCaseToday: { $sum: "$confirmedAt" },
            recoveredToday: { $sum: "$recoveredToday" },
            deathToday: { $sum: "$deathToday" },
         
          },
        },
      ]);

      return data;
    },

    //@Desc getting all the data and group for the graph
    getDataForGrap: async (_, {}, { PersonalInfo }) => {
      const convert = (e) => {
        let array = [];
        let limitDate = 50;
        e.map((load) => {
          if (load._id.month !== null) {
            if (limitDate == 0) return;
            let x = {
              x: `${load._id.month}/${load._id.day}/${load._id.year}`,
              y: load.value,
            };
            limitDate -= 1;
            array.push(x);
            // }
          }
        });
       let a =  array.sort(function(a, b){return new Date(a.x) - new Date(b.x)});
        return a;
      };

      // let group = await PersonalInfo.aggregate([
      //   {$match:{"currentState.confirm":true}},
      //   {$group:{
      //     _id:{
      //       month: { $month: "$currentState.confirmedAt" },
      //       day: { $dayOfMonth: "$currentState.confirmedAt" },
      //       year: { $year: "$currentState.confirmedAt" },
      //     },
      //     value: { $sum: 1 },
      //   }},
      // ])

      // console.log(group,"group")

      let confirm = await PersonalInfo.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$currentState.confirmedAt" },
              day: { $dayOfMonth: "$currentState.confirmedAt" },
              year: { $year: "$currentState.confirmedAt" },
            },
            value: { $sum: 1 },
          },
        },
      
      ]);
      let recovered = await PersonalInfo.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$currentState.recoveredAt" },
              day: { $dayOfMonth: "$currentState.recoveredAt" },
              year: { $year: "$currentState.recoveredAt" },
            },
            value: { $sum: 1 },
          },
        },
      ]);
      let deathAt = await PersonalInfo.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$currentState.deathAt" },
              day: { $dayOfMonth: "$currentState.deathAt" },
              year: { $year: "$currentState.deathAt" },
            },
            value: { $sum: 1 },
          },
        },
        // {$sort : { "$currentState.deathAt": 1 }}
        
      ]);
     
      return {
        cases: convert(confirm),
        recovered: convert(recovered),
        deaths: convert(deathAt),
      };
    },

    getDataForGrapBottom: async (_, {}, { PersonalInfo }) => {
      var now = new Date(); 
     let d = now.setDate(now.getDate() - 30);
   

      const convert = (e) => {
        let array = [];
       let labels = [];
        let limitDate = 30;
        e.map((load) => {
          if (load._id.month !== null) {
            if (limitDate == 0) return;
            let x = {
              x: `${load._id.month}/${load._id.day}/${load._id.year}`,
              y: load.value,
            };
            limitDate -= 1;
            array.push(x);
            labels.push(x.x)
            // }
          }
        });
      
       let a =  array.sort(function(a, b){return new Date(a.x) - new Date(b.x)});
        return a;
      };

      let confirm = await PersonalInfo.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$currentState.confirmedAt" },
              day: { $dayOfMonth: "$currentState.confirmedAt" },
              year: { $year: "$currentState.confirmedAt" },
            },
            value: { $sum: 1 },
          },
        },
      ]);
      let recovered = await PersonalInfo.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$currentState.recoveredAt" },
              day: { $dayOfMonth: "$currentState.recoveredAt" },
              year: { $year: "$currentState.recoveredAt" },
            },
            value: { $sum: 1 },
          },
        },
      ]);
      let deathAt = await PersonalInfo.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$currentState.deathAt" },
              day: { $dayOfMonth: "$currentState.deathAt" },
              year: { $year: "$currentState.deathAt" },
            },
            value: { $sum: 1 },
          },
        },
        // {$sort : { "$currentState.deathAt": 1 }}
        
      ]);
     
      return {
        cases: convert(confirm),
        recovered: convert(recovered),
        deaths: convert(deathAt),
      };
    },

    getDataForBarGraphTotal:async(_,{},{PersonalInfo})=>{
      const  confirm = await PersonalInfo.countDocuments({
         $and: [{ "currentState.confirm": true }],
       });
       const recovered = await PersonalInfo.countDocuments({
         $and: [{ "currentState.recovered": true }],
       });
      const  deaths = await PersonalInfo.countDocuments({
         $and: [{ "currentState.death": true }],
       });
       return {
         confirm,
         recovered,
         deaths
       }
     },

    // @Desc getting the data for report
    //auth and private
    getDataForReport: async (_, {startDate,endDate}, { PersonalInfo }) => {
      var today = new Date(new Date(startDate).setUTCHours(0,0,0,0));
      var tomorrow= new Date(new Date(endDate).setUTCHours(23,59,59,59));
      // var nd = tomorrow.toISOString();

      const data = await PersonalInfo.aggregate([
        {
          $project: {
            district: 1,
            // menConfirmToday: {
            //   $cond: [ {$and:[ { $eq: [ "$gender", "ប្រុស"] },{ $gte: [ "$confirmedAt", today] },]},1,0]
            // },
            menConfirmToday:{  $cond: [
              {$and: [
                  {$eq: ["$gender", "ប្រុស"]},
                  {$eq: ["$currentState.confirm",true]},
                  {$gte: ["$currentState.confirmedAt", today]},
                  {$lt: ["$currentState.confirmedAt",tomorrow]}
              ]}, 
              1, 
              0
          ]},


          womenConfirmToday:{  $cond: [
            {$and: [
                {$eq: ["$gender", "ស្រី"]},
                {$eq: ["$currentState.confirm",true]},
                {$gte: ["$currentState.confirmedAt", today]},
                {$lt: ["$currentState.confirmedAt",tomorrow]}
            ]}, 
            1, 
            0
        ]},
        menConfirm:{  $cond: [
          {$and: [
              {$eq: ["$gender", "ប្រុស"]},
              {$eq: ["$currentState.confirm",true]},
              // {$gte: ["$currentState.confirmedAt", today]},
              // {$lt: ["$currentState.confirmedAt",tomorrow]}
          ]}, 
          1, 
          0
      ]},
      womenConfirm:{  $cond: [
        {$and: [
            {$eq: ["$gender", "ស្រី"]},
            {$eq: ["$currentState.confirm",true]},
            // {$gte: ["$currentState.confirmedAt", today]},
            // {$lt: ["$currentState.confirmedAt",tomorrow]}
        ]}, 
        1, 
        0
      ]},

      menRecoveredToday:{  $cond: [
        {$and: [
            {$eq: ["$gender", "ប្រុស"]},
            {$eq: ["$currentState.recovered",true]},
            {$gte: ["$currentState.recoveredAt", today]},
            {$lt: ["$currentState.recoveredAt",tomorrow]}
        ]}, 
        1, 
        0
    ]},
   
      womenRecoveredToday:{  $cond: [
        {$and: [
            {$eq: ["$gender", "ស្រី"]},
            {$eq: ["$currentState.recovered",true]},
            {$gte: ["$currentState.recoveredAt", today]},
            {$lt: ["$currentState.recoveredAt",tomorrow]}
        ]}, 
        1, 
        0
    ]},
      //      menRecovered: {
      //       $cond: [ { $eq: [ "$gender", "ប្រុស"] },
      //       0,1 ]
      //     },

      menRecovered:{  $cond: [
        {$and: [
            {$eq: ["$gender", "ប្រុស"]},
            {$eq: ["$currentState.recovered",true]},
            // {$gte: ["$currentState.recoveredAt", today]},
            // {$lt: ["$currentState.recoveredAt",tomorrow]}
        ]}, 
        1, 
        0
    ]},


      //     womenRecovered: {
      //       $cond: [ { $eq: [ "$gender", "ស្រី"] }, 0,1 ]
      //   },
      womenRecovered:{  $cond: [
        {$and: [
            {$eq: ["$gender", "ស្រី"]},
            {$eq: ["$currentState.recovered",true]},
            // {$gte: ["$currentState.recoveredAt", today]},
            // {$lt: ["$currentState.recoveredAt",tomorrow]}
        ]}, 
        1, 
        0
    ]},
      

      //   //For Deaths
      //   menDeathsToday: {
      //     $cond:  [ { $eq: [ "$gender", "ប្រុស"] },0,1 ]
      //   },

      menDeathsToday:{  $cond: [
        {$and: [
            {$eq: ["$gender", "ប្រុស"]},
            {$eq: ["$currentState.death",true]},
            {$gte: ["$currentState.deathAt", today]},
            {$lt: ["$currentState.deathAt",tomorrow]}
        ]}, 
        1, 
        0
    ]},

      womenDeathsToday:{  $cond: [
        {$and: [
            {$eq: ["$gender", "ស្រី"]},
            {$eq: ["$currentState.death",true]},
            {$gte: ["$currentState.deathAt", today]},
            {$lt: ["$currentState.deathAt",tomorrow]}
        ]}, 
        1, 
        0
    ]},
    
      //    menDeaths: {
      //     $cond: [ { $eq: [ "$gender", "ប្រុស"] }, 0,1 ]
      //   },

      womenDeathsToday:{  $cond: [
        {$and: [
            {$eq: ["$gender", "ប្រុស"]},
            {$eq: ["$currentState.death",true]},
            // {$gte: ["$currentState.deathAt", today]},
            // {$lt: ["$currentState.deathAt",tomorrow]}
        ]}, 
        1, 
        0
    ]},
      //   womenDeaths: {
      //     $cond:  [ { $eq: [ "$gender", "ស្រី"] }, 0,1 ]
      // },

      womenDeaths:{  $cond: [
        {$and: [
            {$eq: ["$gender", "ស្រី"]},
            {$eq: ["$currentState.death",true]},
            // {$gte: ["$currentState.deathAt", today]},
            // {$lt: ["$currentState.deathAt",tomorrow]}
        ]}, 
        1, 
        0
    ]},
        //
          },
        },
        {
          $group: {
            _id: "$district",
            menConfirmToday: { $sum: "$menConfirmToday" },
           womenConfirmToday: { $sum: "$womenConfirmToday" },
           menConfirm: { $sum: "$menConfirm" },
           womenConfirm: { $sum: "$womenConfirm" },
           
           menRecoveredToday: { $sum: "$menConfirmToday" },
           womenRecoveredToday: { $sum: "$womenRecoveredToday" },
           menRecovered: { $sum: "$menRecovered" },
           womenRecovered: { $sum: "$womenRecovered" },

           menDeathsToday: { $sum: "$menDeathsToday" },
           womenDeathsToday: { $sum: "$womenDeathsToday" },
           menDeaths: { $sum: "$menDeaths" },
           womenDeaths: { $sum: "$womenDeaths" },
          },
        },
      ]);


   return data
     
    },

    //for resport 

    //@Desc get locations 
    //@auth 
 affectedLocationReport: async(_,{startDate,endDate},{AffectedLocation})=>{

  var today = new Date(new Date(startDate).setUTCHours(0,0,0,0));
  var tomorrow= new Date(new Date(endDate).setUTCHours(23,59,59,59));

// ទីតាំពាក់ព័ន
//1
     let totalAffectedLocation = await AffectedLocation.countDocuments({});

//2
    let totalAffectedLocationToday = await AffectedLocation.countDocuments({
    "createdAt": { $gte: today, $lt: tomorrow },
    });
//3
    let totalAffectedLocationNotClosed = await AffectedLocation.countDocuments({
      $and: [{ openAt: {$eq: null} }, { closeAt: {$eq: null} }],
    });

    let totalAffectedLocationNotClosedToday = await AffectedLocation.countDocuments({
      $and: [{ openAt: {$eq: null} }, { closeAt: {$eq: null}},{"createdAt": { $gte: today, $lt: tomorrow }}],
    });
//4
    let totalAffectedLocationOn = await AffectedLocation.countDocuments({
      $and: [
        { openAt: {$ne: null} },
        { closeAt: {$eq: null}},
        { openAt:{ $gte: today, $lt: tomorrow }} ],
    });
//5 
let closedLocation = await AffectedLocation.countDocuments({
  $and: [{ openAt: {$eq: null} }, { closeAt: {$ne: null} }],
});
//6
let closedLocationToday = await AffectedLocation.countDocuments({
  $and: [
    { closeAt: {$ne: null}},
    { openAt: {$eq: null} },
    { closeAt:{ $gte: today, $lt: tomorrow }} ],
});



//7
let openedLocation = await AffectedLocation.countDocuments({
  $and: [{ openAt: {$ne: null} }, { closeAt: {$ne: null} }],
});
//8
let openedLocationToday = await AffectedLocation.countDocuments({
  $and: [
    { closeAt: {$ne: null}},
    { openAt: {$ne: null} },
    { openAt:{ $gte: today, $lt: tomorrow }} ],
});
//9 
let coorporateLocation = await AffectedLocation.countDocuments({
  $and: [{ coorporate: {$eq: false} } ],
});
//10
let coorporateLocationToday = await AffectedLocation.countDocuments({
  $and: [
    { coorporate: {$eq: false} },
    { createdAt:{ $gte: today, $lt: tomorrow }} ],
});

return {
  totalAffectedLocation,
  totalAffectedLocationToday,
  totalAffectedLocationNotClosed,
  totalAffectedLocationOn,
  closedLocation,
  coorporateLocation,
  coorporateLocationToday,
  openedLocation,
  openedLocationToday,
  closedLocationToday,
  totalAffectedLocationNotClosedToday
}
 },

 InterViewReport:async(_,{startDate, endDate},{PersonalInfo})=>{


    

   
    ////
    var today = new Date(new Date(startDate).setUTCHours(0,0,0,0));
    var tomorrow= new Date(new Date(endDate).setUTCHours(23,59,59,59));
    const data = await PersonalInfo.aggregate([
      {
        $project: {
          interviewed: 1,
          gender:1,
          nationality:1,
          interviewTotal:{  $cond: [
            {$and: [
                {$eq: ["$interviewed",true]},
                // {$eq: ["$currentState.recovered",true]},
                // {$gte: ["$interviewedAt", today]},
                // {$lt: ["$interviewedAt",tomorrow]}
            ]}, 
            1, 
            0
        ]},
        totalKhmer:{  $cond: [
          {$and: [
              {$eq: ["$interviewed",true]},
              {$eq: ["$nationality","ខ្មែរ"]},
              // {$eq: ["$gender","ស្រី"]},
              // {$gte: ["$interviewedAt", today]},
              // {$lt: ["$interviewedAt",tomorrow]}
          ]}, 
          1, 
          0
      ]},
        
        totalWomenKhmer:{  $cond: [
          {$and: [
              {$eq: ["$interviewed",true]},
              {$eq: ["$nationality","ខ្មែរ"]},
              {$eq: ["$gender","ស្រី"]},
              // {$gte: ["$interviewedAt", today]},
              // {$lt: ["$interviewedAt",tomorrow]}
          ]}, 
          1, 
          0
      ]},
      totalWomenKhmerToday:{  $cond: [
        {$and: [
            {$eq: ["$interviewed",true]},
            {$eq: ["$nationality","ខ្មែរ"]},
            {$gte: ["$interviewedAt", today]},
            {$lt: ["$interviewedAt",tomorrow]}
        ]}, 
        1, 
        0
    ]},
    totalChinaToday:{  $cond: [
      {$and: [
          {$eq: ["$interviewed",true]},
          {$eq: ["$nationality","ចិន"]},
          {$gte: ["$interviewedAt", today]},
          {$lt: ["$interviewedAt",tomorrow]}
      ]}, 
      1, 
      0
  ]},
  totalChinaWomen:{  $cond: [
    {$and: [
        {$eq: ["$interviewed",true]},
        {$eq: ["$nationality","ចិន"]},
        {$eq: ["$gender","ស្រី"]},
        
        // {$gte: ["$interviewedAt", today]},
        // {$lt: ["$interviewedAt",tomorrow]}
    ]}, 
    1, 
    0
]},
totalChina:{  $cond: [
  {$and: [
      {$eq: ["$interviewed",true]},
      {$eq: ["$nationality","ចិន"]},
      // {$eq: ["$gender","ស្រី"]},
      // {$gte: ["$interviewedAt", today]},
      // {$lt: ["$interviewedAt",tomorrow]}
  ]}, 
  1, 
  0
]},
      },
    },
      {
        $group: {
          _id: "$interviewed",
          // today: { $sum: "$interviewedToday"},
          interviewTotal: { $sum: "$interviewTotal" },
          totalKhmer: { $sum: "$totalKhmer" },
          totalWomenKhmer: { $sum: "$totalWomenKhmer" },
          totalWomenKhmerToday: { $sum: "$totalWomenKhmerToday" },

          totalChina: { $sum: "$totalChina" },
          totalChinaToday: { $sum: "$totalChinaToday" },
          totalChinaWomen: { $sum: "$totalChinaWomen" },
          
        },
      },
    ]);



    const totaSampleTestLocation = await PersonalInfo.aggregate([
      { $unwind: "$sampleTest"},
      { $group: { _id: "$sampleTest.testLocation",count:{$sum:1} }},
    ] 
    )

  let  dataToday =  await PersonalInfo.aggregate([
      // { "$match":{ "district": district } },
        { "$match":{ "sampleTest.date": {$gte:today,$lt:tomorrow} } },
        { "$group": {
            "_id": 1,
            "count": {
                "$sum": 1
            }
        } }
     ])


     let dataAll =  await PersonalInfo.aggregate([
      // { "$match":{ "district": district } },
      { "$project": {
            "all": { "$size": "$sampleTest" }
      } },
      { "$group": {"_id": 1,"count": {"$sum": "$all"}},
    },
   ])


    // console.log(totaSampleTestLocation.length)
    // console.log(data)
    // console.log(dataToday)
    // console.log(dataAll)
    // console.log(totaSampleTestLocation)
    ///


    return {
      interviewTotal: data[0].interviewTotal
      
    };
 },
  },
};





// let totalAffectedLocationNew = await AffectedLocation.countDocuments({
//   "createdAt": { $gte: today, $lt: tomorrow },
// });
// let totalAffectedLocationNew = await AffectedLocation.countDocuments({
//   "createdAt": { $gte: today, $lt: tomorrow },
// });



