import moment from "moment";
import PersonalInfo from "../typeDefs/PersonalInfo";
export default {
  Query: {
    //@Desc get all positive confirm and death

    getPeopeleConfirmRecoverAndDeath: async (
      _,
      { startDate, endDate },
      { PersonalInfo }
    ) => {
      const data1 = await PersonalInfo.find({
        $and: [
          { "currentState.recovered": true },
          { "currentState.recoveredAt": { $gte: startDate, $lt: endDate } },
        ],
      });
      const data2 = await PersonalInfo.find({
        $and: [
          { "currentState.death": true },
          { "currentState.deathAt": { $gte: startDate, $lt: endDate } },
        ],
      });
      const data3 = await PersonalInfo.find({
        $and: [
          { "currentState.confirm": true },
          { "currentState.confirmedAt": { $gte: startDate, $lt: endDate } },
        ],
      });

      const reportData = {
        recovered: data1,
        death: data2,
        confirm: data3,
      };
      return reportData;
    },

    // "$gte": new Date("2014-08-01"), "$lt": new Date("2014-08-02")

    // @Desc get totalSampleTest and today sample test
    // Access auth
    getAllAllSampleTest: async (_, {}, { PersonalInfo }) => {
      var today = new Date(new Date().setUTCHours(0, 0, 0, 0));
      var end = new Date(new Date().setUTCHours(23, 59, 59, 59));
      let district = "សៀមរាប";
      let query = {};

      let data = await PersonalInfo.aggregate([
        // { "$match":{ "district": district } },
        { $match: { "sampleTest.date": { $gte: today, $lt: end } } },

        {
          $group: {
            _id: 1,
            count: {
              $sum: 1,
            },
          },
        },
      ]);

      let dataAll = await PersonalInfo.aggregate([
        // { "$match":{ "district": district } },
        {
          $project: {
            all: { $size: "$sampleTest" },
          },
        },
        { $group: { _id: 1, count: { $sum: "$all" } } },
      ]);

      return {
        today: data[0].count,
        all: dataAll[0].count,
      };
    },

    //@Desc getAllProvinces
    //@Access auth

    getAllProvince: async (
      _,
      { district },
      {
        PersonalInfo,
        Quarantine,
        Hospitalization,
        AffectedLocation,
        HospitalInfo,
        QuarantineInfo,
      }
    ) => {
      let delta = 0;
      let deltaToday;
      let confirm = 0;
      let recover = 0;
      let death = 0;
      let confirmToday = 0;
      let recoveredToday = 0;
      let deathToday = 0;
      let quarantineToday = 0;
      let sampleTest = 0;
      let sampleTestToday = 0;
      let dataToday = [];
      let dataAll = [];
      let totalAffectedLocation = 0;
      let totalAffectedLocationToday = 0;
      let totalAffectedLocationClosed = 0;
      let totalAffectedLocationClosedToday = 0;
      let totalAffectedPeople =0;
      let totalAffectedPeopleToday =0;

      let deltaConfirmFilledFromToday =0;
      let confirmFilledToday =0;
      let recoveredFilledToday =0;
      let deathFilledFromToday=0;

      var today = new Date(new Date().setUTCHours(0, 0, 0, 0));
      var tomorrow = new Date(new Date().setUTCHours(23, 59, 59, 59));

      let totalHospital = await HospitalInfo.countDocuments({});
      let totalQuarantine = await QuarantineInfo.countDocuments({});
  

      if (district === "" || district === "ករំីណីទាំងអស់") {
        // 

        totalAffectedPeople = await PersonalInfo.countDocuments({"affectedFrom.patientCode": {$ne:null}});
        totalAffectedPeopleToday = await PersonalInfo.countDocuments({$and:[{"affectedFrom.patientCode": {$ne:null}},{"affectedDate":{$gte:today,$lt:tomorrow}}]});
        //ទីតាំងពាក់ព័នសរុប
        totalAffectedLocation = await AffectedLocation.countDocuments({});
        // ទីតាំងពាក់ព័នសរុបថ្ងៃនេះ
        totalAffectedLocationToday = await AffectedLocation.countDocuments({
          createdAt: { $gte: today, $lt: tomorrow },
        });

        totalAffectedLocationClosed = await AffectedLocation.countDocuments({
          $and: [{ openAt: { $eq: null } }, { closeAt: { $ne: null } }],
        });
        totalAffectedLocationClosedToday =
          await AffectedLocation.countDocuments({
            $and: [
              { openAt: { $eq: null } },
              { closeAt: { $ne: null } },
              { closedAt: { $gte: today, $lt: tomorrow } },
            ],
          });
        dataAll = await PersonalInfo.aggregate([
          // { "$match":{ "district": district } },
          {
            $project: {
              all: { $size: "$sampleTest" },
            },
          },
          { $group: { _id: 1, count: { $sum: "$all" } } },
        ]);

        dataToday = await PersonalInfo.aggregate([
          // { "$match":{ "district": district } },
          { $match: { "sampleTest.date": { $gte: today, $lt: tomorrow } } },

          {
            $group: {
              _id: 1,
              count: {
                $sum: 1,
              },
            },
          },
        ]);

        // អ្នកពាក់ព័នសរុប 

      let totalAffectedPersoanl = await PersonalInfo.aggregate([
        {$match:{"currentState.confirm": false}},
        {$match:{"affectedFrom": false}},
        { $group: { _id: 1, count: { $sum: 1 } } },
      ]);


     

        //អ្នកពាក់ព័នសរុបថ្ងៃនេះ

        deltaToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "DELTA" },
            { "currentState.confirmedAt": { $gte: today, $lt: tomorrow } },
          ],
        });


        //deltaConfirmFilledFromToday 
        deltaConfirmFilledFromToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "DELTA" },
            { "currentState.confirmFormFilled": { $gte: today, $lt: tomorrow } },
          ],
        });

        delta = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "DELTA" },
          ],
        });

        

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
        //confirmFilledFormToday
        confirmFilledToday = await PersonalInfo.countDocuments({
          "currentState.confirmFormFilled": { $gte: today, $lt: tomorrow },
        });

        recoveredToday = await PersonalInfo.countDocuments({
          "currentState.recoveredAt": { $gte: today, $lt: tomorrow },
        });

        //recoveredFilledFromToday
        recoveredFilledToday = await PersonalInfo.countDocuments({
          "currentState.recoveredFormFilled": { $gte: today, $lt: tomorrow },
        });

        
        deathToday = await PersonalInfo.countDocuments({
          "currentState.deathAt": { $gte: today, $lt: tomorrow },
        });
        ////deathFilledFromToday
        deathFilledFromToday = await PersonalInfo.countDocuments({
          "currentState.deathFormFilled": { $gte: today, $lt: tomorrow },
        });


        // deathToday = await PersonalInfo.countDocuments({
        //   "currentState.deathAt": { $gte: today, $lt: tomorrow },
        // });
      } else {

        totalAffectedPeople = await PersonalInfo.countDocuments({$and:[{"affectedFrom.patientCode": {$ne:null}},{district:district}]});
        totalAffectedPeopleToday = await PersonalInfo.countDocuments({$and:[{"affectedFrom.patientCode": {$ne:null}},{"affectedDate":{$gte:today,$lt:tomorrow}},{district:district}]});






        deltaToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "DELTA" },
            { "currentState.confirmedAt": { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });

        deltaConfirmFilledFromToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "DELTA" },
            { "currentState.confirmedAt": { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });

        delta = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "DELTA" },
            { district: district },
          ],
        });


        totalAffectedLocation = await AffectedLocation.countDocuments({
          district: district,
        });
        totalAffectedLocationToday = await AffectedLocation.countDocuments({
          $and: [
            { createdAt: { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });

        totalAffectedLocationClosed = await AffectedLocation.countDocuments({
          $and: [
            { openAt: { $eq: null } },
            { closeAt: { $ne: null } },
            { district: district },
          ],
        });
        totalAffectedLocationClosedToday =
          await AffectedLocation.countDocuments({
            $and: [
              { openAt: { $eq: null } },
              { closeAt: { $ne: null } },
              { closedAt: { $gte: today, $lt: tomorrow } },
              { district: district },
            ],
          });

        confirm = await PersonalInfo.countDocuments({
          $and: [{ "currentState.confirm": true }, { district: district }],
        });
        recover = await PersonalInfo.countDocuments({
          $and: [{ "currentState.recovered": true }, { district: district }],
        });
        death = await PersonalInfo.countDocuments({
          $and: [{ "currentState.death": true }, { district: district }],
        });

        confirmToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirmedAt": { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });

        //confirmFilledToday
        confirmFilledToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirmFormFilled": { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });


        recoveredToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.recoveredAt": { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });

        //recoveredFilledToday
  recoveredFilledToday = await PersonalInfo.countDocuments({
    $and: [
      { "currentState.recoveredFormFilled": { $gte: today, $lt: tomorrow } },
      { district: district },
    ],
  });
        
        deathToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.deathAt": { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });

  ///deathFilledFromToday
  deathFilledFromToday =  await PersonalInfo.countDocuments({
    $and: [
      { "currentState.deathAt": { $gte: today, $lt: tomorrow } },
      { district: district },
    ],
  });




        sampleTestToday = await PersonalInfo.countDocuments({
          $and: [
            {
              sampleTest: {
                $elemMatch: { date: { $gte: today, $lt: tomorrow } },
              },
            },
            { district: district },
          ],
        });

        dataAll = await PersonalInfo.aggregate([
          { $match: { district: district } },
          {
            $project: {
              all: { $size: "$sampleTest" },
            },
          },
          { $group: { _id: 1, count: { $sum: "$all" } } },
        ]);

        dataToday = await PersonalInfo.aggregate([
          { $match: { district: district } },
          { $match: { "sampleTest.date": { $gte: today, $lt: tomorrow } } },
          // { "$project": {
          //       "all": { "$size": "$sampleTest" }
          // } },
          {
            $group: {
              _id: 1,
              count: {
                $sum: 1,
              },
            },
          },
        ]);


      }

      if (dataAll.length !== 0) {
        sampleTest = dataAll[0].count;
      }
      if (dataToday.length !== 0) {
        sampleTestToday = dataToday[0].count;
      }

      // console.log(dataToday[0].count,"dataToday",dataAll[0].count)

      let dataForBoxes = {
        delta:delta,
        deltaToday:deltaToday,
        sampleTest: sampleTest,
        sampleTestToday: sampleTestToday,
        confirmedCase: confirm,
        confirmedCaseToday: confirmToday,
        death: death,
        deathToday: deathToday,
        recovered: recover,
        recoveredToday: recoveredToday,
        totalHospital: totalHospital,
        totalQuarantine: totalQuarantine,
        totalAffectedLocation: totalAffectedLocation,
        totalAffectedLocationToday: totalAffectedLocationToday,
        totalAffectedLocationClosed: totalAffectedLocationClosed,
        totalAffectedLocationClosedToday: totalAffectedLocationClosedToday,
        totalAffectedPeople:totalAffectedPeople,
        totalAffectedPeopleToday:totalAffectedPeopleToday,
         confirmFilledToday,
         recoveredFilledToday,
         deathFilledFromToday,
         deltaConfirmFilledFromToday
        // totalAffectedLocationOn:totalAffectedLocationOn,
        // totalAffectedLocationClose:totalAffectedLocationClose,
        // totalAffectedLocationNew:totalAffectedLocationNew
        // totalPeopleInHospitalization,
        // totalQuarantine,
        // totalAffectedLocation,
      };


      return dataForBoxes;
    },

    getAllDistrictForMap: async (_, {}, { PersonalInfo }) => {
      var today = new Date(new Date().setUTCHours(0, 0, 0, 0));
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
        let limitDate = 10;
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

        let a = array.sort(function (a, b) {
          return new Date(a.x) - new Date(b.x);
        });
        return a;
      };


      let confirm = await PersonalInfo.aggregate([
        { $sort: { "currentState.confirmAt": -1 } },
        {
          $group: {
            _id: {
              month: { $month: "$currentState.confirmedAt" },
              day: { $dayOfMonth: "$currentState.confirmedAt" },
              year: { $year: "$currentState.confirmedAt" },
            },
            value: { $sum: 1 },
          },
        },{$limit:60}
      ]);

      let recovered = await PersonalInfo.aggregate([
        { $sort: { "currentState.recoveredAt": 1 } },
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
        {$limit:60}
      ]);
      let deathAt = await PersonalInfo.aggregate([
        { $sort: { "currentState.deathAt": 1 } },
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
        {$limit:60}
      ]);

      return {
        cases: convert(confirm),
        recovered: convert(recovered),
        deaths: convert(deathAt),
      };
    },

    // getDataForGrapBottom: async (_, {}, { PersonalInfo }) => {
    //   var now = new Date();
    //   let d = now.setDate(now.getDate() - 30);

    //   const convert = (e) => {
    //     let array = [];
    //     let labels = [];
    //     let limitDate = 30;
    //     e.map((load) => {
    //       if (load._id.month !== null) {
    //         if (limitDate == 0) return;
    //         let x = {
    //           x: `${load._id.month}/${load._id.day}/${load._id.year}`,
    //           y: load.value,
    //         };
    //         limitDate -= 1;
    //         array.push(x);
    //         labels.push(x.x);
    //         // }
    //       }
    //     });

    //     let a = array.sort(function (a, b) {
    //       return new Date(a.x) - new Date(b.x);
    //     });
    //     return a;
    //   };

    //   let confirm = await PersonalInfo.aggregate([
    //     {
    //       $group: {
    //         _id: {
    //           month: { $month: "$currentState.confirmedAt" },
    //           day: { $dayOfMonth: "$currentState.confirmedAt" },
    //           year: { $year: "$currentState.confirmedAt" },
    //         },
    //         value: { $sum: 1 },
    //       },
    //     },
    //   ]);
    //   let recovered = await PersonalInfo.aggregate([
    //     {
    //       $group: {
    //         _id: {
    //           month: { $month: "$currentState.recoveredAt" },
    //           day: { $dayOfMonth: "$currentState.recoveredAt" },
    //           year: { $year: "$currentState.recoveredAt" },
    //         },
    //         value: { $sum: 1 },
    //       },
    //     },
    //   ]);

     
    //   let deathAt = await PersonalInfo.aggregate([
    //     {
    //       $group: {
    //         _id: {
    //           month: { $month: "$currentState.deathAt" },
    //           day: { $dayOfMonth: "$currentState.deathAt" },
    //           year: { $year: "$currentState.deathAt" },
    //         },
    //         value: { $sum: 1 },
    //       },
    //     },
    //     // {$sort : { "$currentState.deathAt": 1 }}
    //   ]);


    //   return {
    //     cases: convert(confirm),
    //     recovered: convert(recovered),
    //     deaths: convert(deathAt),
    //   };
    // },

    getDataForBarGraphTotal: async (_, {}, { PersonalInfo }) => {
      const confirm = await PersonalInfo.countDocuments({
        $and: [{ "currentState.confirm": true }],
      });
      const recovered = await PersonalInfo.countDocuments({
        $and: [{ "currentState.recovered": true }],
      });
      const deaths = await PersonalInfo.countDocuments({
        $and: [{ "currentState.death": true }],
      });
      return {
        confirm,
        recovered,
        deaths,
      };
    },




    // @Desc getting the data for report
    //auth and private
    getDataForReport: async (_, { startDate, endDate }, { PersonalInfo }) => {
      var today = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
      var tomorrow = new Date(new Date(endDate).setUTCHours(23, 59, 59, 59));
      // var nd = tomorrow.toISOString();

      const data = await PersonalInfo.aggregate([
        {
          $project: {
            district: 1,
            // menConfirmToday: {
            //   $cond: [ {$and:[ { $eq: [ "$gender", "ប្រុស"] },{ $gte: [ "$confirmedAt", today] },]},1,0]
            // },
            menConfirmToday: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "ប្រុស"] },
                    { $eq: ["$currentState.confirm", true] },
                    { $gte: ["$currentState.confirmedAt", today] },
                    { $lt: ["$currentState.confirmedAt", tomorrow] },
                  ],
                },
                1,
                0,
              ],
            },

            womenConfirmToday: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "ស្រី"] },
                    { $eq: ["$currentState.confirm", true] },
                    { $gte: ["$currentState.confirmedAt", today] },
                    { $lt: ["$currentState.confirmedAt", tomorrow] },
                  ],
                },
                1,
                0,
              ],
            },
            menConfirm: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "ប្រុស"] },
                    { $eq: ["$currentState.confirm", true] },
                    // {$gte: ["$currentState.confirmedAt", today]},
                    // {$lt: ["$currentState.confirmedAt",tomorrow]}
                  ],
                },
                1,
                0,
              ],
            },
            womenConfirm: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "ស្រី"] },
                    { $eq: ["$currentState.confirm", true] },
                    // {$gte: ["$currentState.confirmedAt", today]},
                    // {$lt: ["$currentState.confirmedAt",tomorrow]}
                  ],
                },
                1,
                0,
              ],
            },

            menRecoveredToday: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "ប្រុស"] },
                    { $eq: ["$currentState.recovered", true] },
                    { $gte: ["$currentState.recoveredAt", today] },
                    { $lt: ["$currentState.recoveredAt", tomorrow] },
                  ],
                },
                1,
                0,
              ],
            },

            womenRecoveredToday: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "ស្រី"] },
                    { $eq: ["$currentState.recovered", true] },
                    { $gte: ["$currentState.recoveredAt", today] },
                    { $lt: ["$currentState.recoveredAt", tomorrow] },
                  ],
                },
                1,
                0,
              ],
            },
            //      menRecovered: {
            //       $cond: [ { $eq: [ "$gender", "ប្រុស"] },
            //       0,1 ]
            //     },

            menRecovered: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "ប្រុស"] },
                    { $eq: ["$currentState.recovered", true] },
                    // {$gte: ["$currentState.recoveredAt", today]},
                    // {$lt: ["$currentState.recoveredAt",tomorrow]}
                  ],
                },
                1,
                0,
              ],
            },

            //     womenRecovered: {
            //       $cond: [ { $eq: [ "$gender", "ស្រី"] }, 0,1 ]
            //   },
            womenRecovered: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "ស្រី"] },
                    { $eq: ["$currentState.recovered", true] },
                    // {$gte: ["$currentState.recoveredAt", today]},
                    // {$lt: ["$currentState.recoveredAt",tomorrow]}
                  ],
                },
                1,
                0,
              ],
            },

            //   //For Deaths
            //   menDeathsToday: {
            //     $cond:  [ { $eq: [ "$gender", "ប្រុស"] },0,1 ]
            //   },

            menDeathsToday: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "ប្រុស"] },
                    { $eq: ["$currentState.death", true] },
                    { $gte: ["$currentState.deathAt", today] },
                    { $lt: ["$currentState.deathAt", tomorrow] },
                  ],
                },
                1,
                0,
              ],
            },

            womenDeathsToday: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "ស្រី"] },
                    { $eq: ["$currentState.death", true] },
                    { $gte: ["$currentState.deathAt", today] },
                    { $lt: ["$currentState.deathAt", tomorrow] },
                  ],
                },
                1,
                0,
              ],
            },

            //    menDeaths: {
            //     $cond: [ { $eq: [ "$gender", "ប្រុស"] }, 0,1 ]
            //   },

            womenDeathsToday: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "ប្រុស"] },
                    { $eq: ["$currentState.death", true] },
                    // {$gte: ["$currentState.deathAt", today]},
                    // {$lt: ["$currentState.deathAt",tomorrow]}
                  ],
                },
                1,
                0,
              ],
            },
            //   womenDeaths: {
            //     $cond:  [ { $eq: [ "$gender", "ស្រី"] }, 0,1 ]
            // },

            womenDeaths: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "ស្រី"] },
                    { $eq: ["$currentState.death", true] },
                    // {$gte: ["$currentState.deathAt", today]},
                    // {$lt: ["$currentState.deathAt",tomorrow]}
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

      return data;
    },

    //for resport

    //@Desc get locations
    //@auth
    affectedLocationReport: async (
      _,
      { startDate, endDate },
      { AffectedLocation }
    ) => {
      var today = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
      var tomorrow = new Date(new Date(endDate).setUTCHours(23, 59, 59, 59));

      // ទីតាំពាក់ព័ន
      //1
      let totalAffectedLocation = await AffectedLocation.countDocuments({});

      //2
      let totalAffectedLocationToday = await AffectedLocation.countDocuments({
        createdAt: { $gte: today, $lt: tomorrow },
      });
      //3
      let totalAffectedLocationNotClosed =
        await AffectedLocation.countDocuments({
          $and: [{ openAt: { $eq: null } }, { closeAt: { $eq: null } }],
        });

      let totalAffectedLocationNotClosedToday =
        await AffectedLocation.countDocuments({
          $and: [
            { openAt: { $eq: null } },
            { closeAt: { $eq: null } },
            { createdAt: { $gte: today, $lt: tomorrow } },
          ],
        });
      //4
      let totalAffectedLocationOn = await AffectedLocation.countDocuments({
        $and: [
          { openAt: { $ne: null } },
          { closeAt: { $eq: null } },
          { openAt: { $gte: today, $lt: tomorrow } },
        ],
      });
      //5
      let closedLocation = await AffectedLocation.countDocuments({
        $and: [{ openAt: { $eq: null } }, { closeAt: { $ne: null } }],
      });
      //6
      let closedLocationToday = await AffectedLocation.countDocuments({
        $and: [
          { closeAt: { $ne: null } },
          { openAt: { $eq: null } },
          { closeAt: { $gte: today, $lt: tomorrow } },
        ],
      });

      //7
      let openedLocation = await AffectedLocation.countDocuments({
        $and: [{ openAt: { $ne: null } }, { closeAt: { $ne: null } }],
      });
      //8
      let openedLocationToday = await AffectedLocation.countDocuments({
        $and: [
          { closeAt: { $ne: null } },
          { openAt: { $ne: null } },
          { openAt: { $gte: today, $lt: tomorrow } },
        ],
      });
      //9
      let coorporateLocation = await AffectedLocation.countDocuments({
        $and: [{ coorporate: { $eq: false } }],
      });
      //10
      let coorporateLocationToday = await AffectedLocation.countDocuments({
        $and: [
          { coorporate: { $eq: false } },
          { createdAt: { $gte: today, $lt: tomorrow } },
        ],
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
        totalAffectedLocationNotClosedToday,
      };
    },

    InterViewReport: async (_, { startDate, endDate }, { PersonalInfo,AffectedLocation }) => {

     
      ////
      var today = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
      var tomorrow = new Date(new Date(endDate).setUTCHours(23, 59, 59, 59));

      const data = await PersonalInfo.aggregate([
        {
          $project: {
            interviewed: 1,
            gender: 1,
            nationality: 1,
            interviewTotal: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$interviewed", true] },
                    // {$eq: ["$currentState.recovered",true]},
                    // {$gte: ["$interviewedAt", today]},
                    // {$lt: ["$interviewedAt",tomorrow]}
                  ],
                },
                1,
                0,
              ],
            },
            totalKhmer: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$interviewed", true] },
                    { $eq: ["$nationality", "ខ្មែរ"] },
                    // {$eq: ["$gender","ស្រី"]},
                    // {$gte: ["$interviewedAt", today]},
                    // {$lt: ["$interviewedAt",tomorrow]}
                  ],
                },
                1,
                0,
              ],
            },

            totalWomenKhmer: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$interviewed", true] },
                    { $eq: ["$nationality", "ខ្មែរ"] },
                    { $eq: ["$gender", "ស្រី"] },
                    // {$gte: ["$interviewedAt", today]},
                    // {$lt: ["$interviewedAt",tomorrow]}
                  ],
                },
                1,
                0,
              ],
            },
            totalWomenKhmerToday: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$interviewed", true] },
                    { $eq: ["$nationality", "ខ្មែរ"] },
                    { $gte: ["$interviewedAt", today] },
                    { $lt: ["$interviewedAt", tomorrow] },
                  ],
                },
                1,
                0,
              ],
            },
            totalChinaToday: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$interviewed", true] },
                    { $eq: ["$nationality", "ចិន"] },
                    { $gte: ["$interviewedAt", today] },
                    { $lt: ["$interviewedAt", tomorrow] },
                  ],
                },
                1,
                0,
              ],
            },
            totalChinaWomen: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$interviewed", true] },
                    { $eq: ["$nationality", "ចិន"] },
                    { $eq: ["$gender", "ស្រី"] },

                    // {$gte: ["$interviewedAt", today]},
                    // {$lt: ["$interviewedAt",tomorrow]}
                  ],
                },
                1,
                0,
              ],
            },
            totalChina: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$interviewed", true] },
                    { $eq: ["$nationality", "ចិន"] },
                    // {$eq: ["$gender","ស្រី"]},
                    // {$gte: ["$interviewedAt", today]},
                    // {$lt: ["$interviewedAt",tomorrow]}
                  ],
                },
                1,
                0,
              ],
            },
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

      let interview = data.filter(res=>res._id===true)
      let totalAffectedLocation = await AffectedLocation.countDocuments({});
      let fulltotalAffectedLocation = await AffectedLocation.countDocuments({$and:[{province:{$ne:null}},{district:{$ne:null}},{commune:{$ne:null}},{village:{$ne:null}}]});
   
          // get total sampletest location 
          const totaSampleTestLocation = await PersonalInfo.aggregate([
            { $unwind: "$sampleTest" },
            { $group: { _id: "$sampleTest.testLocation", count: { $sum: 1 } } },
          ]);
         let totalSampleTestLocation = totaSampleTestLocation.reduce((init,data)=>{
          return data.count + init
         },0 )
 
      //get total sample test 
      let totalSampleTest = await PersonalInfo.aggregate([
        // { "$match":{ "district": district } },
        {
          $project: {
            all: { $size: "$sampleTest" },
          },
        },
        { $group: { _id: 1, totalSampleTest: { $sum: "$all" } } },
      ]);

      //get total sample test which is a women
      let totalSampleTestWomen = await PersonalInfo.aggregate([
        { "$match":{ "gender": "ស្រី" } },
        {
          $project: {
            all: { $size: "$sampleTest" },
          },
        },
        { $group: { _id: 1, totalSampleTest: { $sum: "$all" } } },
      ]);

      //
      let totalSampleTests = totalSampleTest[0].totalSampleTest? totalSampleTest[0].totalSampleTest :0;
      let totalSampleTestWomens = totalSampleTestWomen[0].totalSampleTest? totalSampleTestWomen[0].totalSampleTest :0;

      let interviewTotal= 0
      let totalKhmer = 0
      let totalWomenKhmer=  0
      let totalWomenKhmerToday = 0
      let totalChina = 0
      let totalChinaToday=  0
      let totalChinaWomen= 0

      if(interview.length > 0){
        interviewTotal= interview[0].interviewTotal
        totalKhmer = interview[0].totalKhmer
        totalWomenKhmer=  interview[0].totalWomenKhmer
        totalWomenKhmerToday = interview[0].totalWomenKhmerToday
        totalChina = interview[0].totalChina
        totalChinaToday=  interview[0].totalChinaToday
        totalChinaWomen= interview[0].totalChinaWomen

      }


      // interviewTotal: interview[0].interviewTotal? interview[0].interviewTotal:0 ,
      // totalKhmer: interview[0].totalKhmer?interview[0].totalKhmer:0,
      // totalWomenKhmer: interview[0].totalWomenKhmer?interview[0].totalWomenKhmer:0,
      // totalWomenKhmerToday: interview[0].totalWomenKhmerToday? interview[0].totalWomenKhmerToday:0,

      // totalChina: interview[0].totalChina? interview[0].totalChina :0,
      // totalChinaToday: interview[0].totalChinaToday? interview[0].totalChinaToday:0,
      // totalChinaWomen: interview[0].totalChinaWomen ? interview[0].totalChinaWomen:0,
const res = {
        interviewTotal,
        totalKhmer,
        totalWomenKhmer,
        totalWomenKhmerToday,

        totalChina,
        totalChinaToday,
        totalChinaWomen,
        totalSampleTestLocation:totalSampleTestLocation,
        totalSampleTest:totalSampleTests,
        totalSampleTestWomen:totalSampleTestWomens,
        totalAffectedLocation: totalAffectedLocation,
        fulltotalAffectedLocation:fulltotalAffectedLocation
      };
  
      return res
    },
  },
};

// let totalAffectedLocationNew = await AffectedLocation.countDocuments({
//   "createdAt": { $gte: today, $lt: tomorrow },
// });
// let totalAffectedLocationNew = await AffectedLocation.countDocuments({
//   "createdAt": { $gte: today, $lt: tomorrow },
// });
