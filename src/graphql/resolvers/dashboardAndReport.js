import moment from "moment";
import PersonalInfo from "../typeDefs/PersonalInfo";
export default {
  Query: {
    //group by age

    getGraphByday: async (_, { startDate, endDate,district }, { PersonalInfo }) => {
  
      var start = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
      var end = new Date(new Date(endDate).setUTCHours(23, 59, 59, 59));
      let confirmDateStart = {};
      let confirmEndDateQuery = {};
      let recoveredDateStart = {};
      let recoveredEndDateQuery = {};
      let deathDateStart = {};
      let deathEndDateQuery = {};
      let districtQuery={$match:{}};

      if(district!==null){
        districtQuery = {$match:{district:district}};
      }
      if (startDate !== null && endDate !== null) {
        confirmDateStart = { $gte: ["$currentState.confirmedAt", start] };
        confirmEndDateQuery = { $lt: ["$currentState.confirmedAt", end] };
        recoveredDateStart = { $gte: ["$currentState.recoveredAt", start] };
        recoveredEndDateQuery = { $lt: ["$currentState.recoveredAt", end] };
        deathDateStart = { $gte: ["$currentState.deathAt", start] };
        deathEndDateQuery = { $lt: ["$currentState.deathAt", end] };
      }
      const confirm = await PersonalInfo.aggregate([
        districtQuery,
        {
          $project: {
            yearMonthDayUTC: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$currentState.confirmedAt",
              },
            },
            confirm: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$currentState.confirm", true] },
                    confirmDateStart,
                    confirmEndDateQuery,
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
            _id: "$yearMonthDayUTC",
            confirm: { $sum: "$confirm" },
         
          },
        },
        {$match:{"confirm":{$ne:0}}},
        {$sort:{"_id":1}},
      ]);

      const recovered = await PersonalInfo.aggregate([
        // { $match: { "currentState.confirm": true } },
        districtQuery,
        {
          $project: {
            yearMonthDayUTC: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$currentState.recoveredAt",
              },
            },
            recovered: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$currentState.recovered", true] },
                    recoveredDateStart,
                    recoveredEndDateQuery,
                 
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
            _id: "$yearMonthDayUTC",
            recovered: { $sum: "$recovered" },
       
          },
        },
        {$match:{"recovered":{$ne:0}}},
        {$sort:{"_id":1}},
      ]);
      const death = await PersonalInfo.aggregate([
   
        // { $match: { "currentState.confirm": true } },
        districtQuery,
        {
          $project: {
            yearMonthDayUTC: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$currentState.deathAt",
              },
            },

            death: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$currentState.death", true] },
                    deathDateStart,
                    deathEndDateQuery,
             
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
            _id: "$yearMonthDayUTC",
            death: { $sum: "$death" },
          },
        },
        {$match:{"death":{$ne:0}}},
        {$sort:{"_id":1}},
      ]);

      return {
        confirm,
        recovered,
        death
      }
    },

    getGraphByage: async (_, { startDate, endDate }, { PersonalInfo }) => {
      var start = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
      var end = new Date(new Date(endDate).setUTCHours(23, 59, 59, 59));
      let confirmDateStart = {};
      let confirmEndDateQuery = {};
      let recoveredDateStart = {};
      let recoveredEndDateQuery = {};
      let deathDateStart = {};
      let deathEndDateQuery = {};
      if (startDate !== null && endDate !== null) {
        confirmDateStart = { $gte: ["$currentState.confirmedAt", start] };
        confirmEndDateQuery = { $lt: ["$currentState.confirmedAt", end] };
        recoveredDateStart = { $gte: ["$currentState.recoveredAt", start] };
        recoveredEndDateQuery = { $lt: ["$currentState.recoveredAt", end] };
        deathDateStart = { $gte: ["$currentState.deathAt", start] };
        deathEndDateQuery = { $lt: ["$currentState.deathAt", end] };
      }
      let d = [
        {
          $project: {
            age: 1,
            confirm: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$currentState.confirm", true] },
                    confirmDateStart,
                    confirmEndDateQuery,
                  ],
                },
                1,
                0,
              ],
            },
            recovered: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$currentState.recovered", true] },
                    recoveredDateStart,
                    recoveredEndDateQuery,
                  ],
                },
                1,
                0,
              ],
            },
            death: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$currentState.death", true] },
                    deathDateStart,
                    deathEndDateQuery,
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
            _id: "$age",
            confirm: { $sum: "$confirm" },
            recovered: { $sum: "$recovered" },
            death: { $sum: "$death" },
          },
        },
      ];

      const data = await PersonalInfo.aggregate(d);
      let keys = [
        { label: "0-5", death: 0, recovered: 0, confirm: 0 },
        { label: "6-11", death: 0, recovered: 0, confirm: 0 },
        { label: "12-17", death: 0, recovered: 0, confirm: 0 },
        { label: "18-45", death: 0, recovered: 0, confirm: 0 },
        { label: "46-59", death: 0, recovered: 0, confirm: 0 },
        { label: "61-?????????", death: 0, recovered: 0, confirm: 0 },
      ];

      data.map((el) => {
        if (el._id <= 5) {
          keys[0].death += el.death;
          keys[0].recovered += el.recovered;
          keys[0].confirm += el.confirm;
        }
        if (el._id >= 6 && el._id <= 11) {
          keys[1].death += el.death;
          keys[1].recovered += el.recovered;
          keys[1].confirm += el.confirm;
        }
        if (el._id >= 12 && el._id <= 17) {
          keys[2].death += el.death;
          keys[2].recovered += el.recovered;
          keys[2].confirm += el.confirm;
        }
        if (el._id >= 18 && el._id <= 45) {
          keys[3].death += el.death;
          keys[3].recovered += el.recovered;
          keys[3].confirm += el.confirm;
        }
        if (el._id >= 46 && el._id <= 59) {
          keys[4].death += el.death;
          keys[4].recovered += el.recovered;
          keys[4].confirm += el.confirm;
        }
        if (el._id >= 60) {
          keys[5].death += el.death;
          keys[5].recovered += el.recovered;
          keys[5].confirm += el.confirm;
        }
      
      });
      
      return keys;
    },

    //auth and private
    getDataForBarChart: async (
      _,
      { startDate, endDate, district, commune, village },
      { PersonalInfo }
    ) => {
      let confirmDateStart = {};
      let confirmEndDateQuery = {};
      let recoveredDateStart = {};
      let recoveredEndDateQuery = {};
      let deathDateStart = {};
      let deathEndDateQuery = {};
      var start = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
      var end = new Date(new Date(endDate).setUTCHours(23, 59, 59, 59));

      if (startDate !== null && endDate !== null) {
        confirmDateStart = { $gte: ["$currentState.confirmedAt", start] };
        confirmEndDateQuery = { $lt: ["$currentState.confirmedAt", end] };
        recoveredDateStart = { $gte: ["$currentState.recoveredAt", start] };
        recoveredEndDateQuery = { $lt: ["$currentState.recoveredAt", end] };
        deathDateStart = { $gte: ["$currentState.deathAt", start] };
        deathEndDateQuery = { $lt: ["$currentState.deathAt", end] };
      }

      let query = {};
      if (district === null) {
        query = [
          {
            $project: {
              district: 1,
              confirm: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$currentState.confirm", true] },
                      confirmDateStart,
                      confirmEndDateQuery,
                    ],
                  },
                  1,
                  0,
                ],
              },
              recovered: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$currentState.recovered", true] },
                      recoveredDateStart,
                      recoveredEndDateQuery,
                    ],
                  },
                  1,
                  0,
                ],
              },
              death: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$currentState.death", true] },
                      deathDateStart,
                      deathEndDateQuery,
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
              confirm: { $sum: "$confirm" },
              recovered: { $sum: "$recovered" },
              death: { $sum: "$death" },
            },
          },
        ];
      } else {
        if (village) {
          query = [
            { $match: { district: district } },
            {
              $project: {
                village: 1,
                confirm: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$currentState.confirm", true] },
                        confirmDateStart,
                        confirmEndDateQuery,
                      ],
                    },
                    1,
                    0,
                  ],
                },
                recovered: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$currentState.recovered", true] },
                        recoveredDateStart,
                        recoveredEndDateQuery,
                      ],
                    },
                    1,
                    0,
                  ],
                },
                death: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$currentState.death", true] },
                        deathDateStart,
                        deathEndDateQuery,
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
                _id: "$village",
                confirm: { $sum: "$confirm" },
                recovered: { $sum: "$recovered" },
                death: { $sum: "$death" },
              },
            },
          ];
        } else {
          query = [
            { $match: { district: district } },
            {
              $project: {
                commune: 1,
                confirm: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$currentState.confirm", true] },
                        confirmDateStart,
                        confirmEndDateQuery,
                      ],
                    },
                    1,
                    0,
                  ],
                },
                recovered: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$currentState.recovered", true] },
                        recoveredDateStart,
                        recoveredEndDateQuery,
                      ],
                    },
                    1,
                    0,
                  ],
                },
                death: {
                  $cond: [
                    {
                      $and: [
                        { $eq: ["$currentState.death", true] },
                        deathDateStart,
                        deathEndDateQuery,
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
                _id: "$commune",
                confirm: { $sum: "$confirm" },
                recovered: { $sum: "$recovered" },
                death: { $sum: "$death" },
              },
            },
          ];
        }
      }

      const data = await PersonalInfo.aggregate(query);
      return data;
    },

    // query = [
    //   {
    //     $project: {
    //       district: 1,
    //       confirm: {
    //         $cond: [
    //           {
    //             $and: [
    //               { $eq: ["$currentState.confirm", true] },
    //               { $gte: ["$currentState.confirmedAt", start] },
    //               { $lt: ["$currentState.confirmedAt", end] }
    //             ],
    //           },
    //           1,
    //           0,
    //         ],
    //       },
    //       recovered: {
    //         $cond: [
    //           {
    //             $and: [

    //               { $eq: ["$currentState.recovered", true] },
    //               { $gte: ["$currentState.recovered", start] },
    //               { $lt: ["$currentState.recovered", end] }
    //             ],
    //           },
    //           1,
    //           0,
    //         ],
    //       },
    //       death: {
    //         $cond: [
    //           {
    //             $and: [

    //               { $eq: ["$currentState.death", true] },
    //               { $gte: ["$currentState.death", start] },
    //               { $lt: ["$currentState.death", end] }
    //             ],
    //           },
    //           1,
    //           0,
    //         ],
    //       },
    //       //
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$district",
    //       confirm: { $sum: "$confirm" },
    //       recovered: { $sum: "$recovered" },
    //       death: { $sum: "$death" },

    //     },
    //   },
    // ]

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
      let district = "??????????????????";
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
      let deltaToday=0;
      let omicron = 0;
      let omicronToday=0;
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
      let totalAffectedPeople = 0;
      let totalAffectedPeopleToday = 0;

      let deltaConfirmFilledFromToday = 0;
      let omicronConfirmFilledFromToday = 0;
      let confirmFilledToday = 0;
      let recoveredFilledToday = 0;
      let deathFilledFromToday = 0;

      var today = new Date(new Date().setUTCHours(0, 0, 0, 0));
      var tomorrow = new Date(new Date().setUTCHours(23, 59, 59, 59));

      let totalHospital = await HospitalInfo.countDocuments({});
      let totalQuarantine = await QuarantineInfo.countDocuments({});

      if (district === ""||district===null || district === "???????????????????????????????????????") {
        //

        totalAffectedPeople = await PersonalInfo.countDocuments({
          "affectedFrom.patientCode": { $ne: null },
        });
        totalAffectedPeopleToday = await PersonalInfo.countDocuments({
          $and: [
            { "affectedFrom.patientCode": { $ne: null } },
            { affectedDate: { $gte: today, $lt: tomorrow } },
          ],
        });
        //???????????????????????????????????????????????????
        totalAffectedLocation = await AffectedLocation.countDocuments({});
        // ????????????????????????????????????????????????????????????????????????
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

        // ?????????????????????????????????????????????

        let totalAffectedPersoanl = await PersonalInfo.aggregate([
          { $match: { "currentState.confirm": false } },
          { $match: { affectedFrom: false } },
          { $group: { _id: 1, count: { $sum: 1 } } },
        ]);

        //??????????????????????????????????????????????????????????????????

        deltaToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "DELTA" },
            { "currentState.confirmedAt": { $gte: today, $lt: tomorrow } },
          ],
        });

        omicronToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "OMICRON" },
            { "currentState.confirmedAt": { $gte: today, $lt: tomorrow } },
          ],
        });

        //deltaConfirmFilledFromToday
        deltaConfirmFilledFromToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "DELTA" },
            {
              "currentState.confirmFormFilled": { $gte: today, $lt: tomorrow },
            },
          ],
        });

        omicronConfirmFilledFromToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "OMICRON" },
            {
              "currentState.confirmFormFilled": { $gte: today, $lt: tomorrow },
            },
          ],
        });

        delta = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "DELTA" },
          ],
        });

        omicron = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "OMICRON" },
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
        totalAffectedPeople = await PersonalInfo.countDocuments({
          $and: [
            { "affectedFrom.patientCode": { $ne: null } },
            { district: district },
          ],
        });
        totalAffectedPeopleToday = await PersonalInfo.countDocuments({
          $and: [
            { "affectedFrom.patientCode": { $ne: null } },
            { affectedDate: { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });

        deltaToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "DELTA" },
            { "currentState.confirmedAt": { $gte: today, $lt: tomorrow } },
            { district: district },
          ],
        });

        omicronToday = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "OMICRON" },
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

        omicronConfirmFilledFromToday = await PersonalInfo.countDocuments({
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

          omicron = await PersonalInfo.countDocuments({
          $and: [
            { "currentState.confirm": true },
            { "currentState.covidVariant": "OMICRON" },
            { district: district },
          ],
        });

        console.log(omicron);

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
            {
              "currentState.confirmFormFilled": { $gte: today, $lt: tomorrow },
            },
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
            {
              "currentState.recoveredFormFilled": {
                $gte: today,
                $lt: tomorrow,
              },
            },
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
        deathFilledFromToday = await PersonalInfo.countDocuments({
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
        omicronConfirmFilledFromToday: omicronConfirmFilledFromToday,
        omicron: omicron,
        omicronToday: omicronToday,
        delta: delta,
        deltaToday: deltaToday,
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
        totalAffectedPeople: totalAffectedPeople,
        totalAffectedPeopleToday: totalAffectedPeopleToday,
        confirmFilledToday,
        recoveredFilledToday,
        deathFilledFromToday,
        deltaConfirmFilledFromToday,
        // totalAffectedLocationOn:totalAffectedLocationOn,
        // totalAffectedLocationClose:totalAffectedLocationClose,
        // totalAffectedLocationNew:totalAffectedLocationNew
        // totalPeopleInHospitalization,
        // totalQuarantine,
        // totalAffectedLocation,
      };
console.log(dataForBoxes);
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
        },
        { $limit: 60 },
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
        { $limit: 60 },
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
        { $limit: 60 },
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
            //   $cond: [ {$and:[ { $eq: [ "$gender", "???????????????"] },{ $gte: [ "$confirmedAt", today] },]},1,0]
            // },
            menConfirmToday: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "???????????????"] },
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
                    { $eq: ["$gender", "????????????"] },
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
                    { $eq: ["$gender", "???????????????"] },
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
                    { $eq: ["$gender", "????????????"] },
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
                    { $eq: ["$gender", "???????????????"] },
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
                    { $eq: ["$gender", "????????????"] },
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
            //       $cond: [ { $eq: [ "$gender", "???????????????"] },
            //       0,1 ]
            //     },

            menRecovered: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "???????????????"] },
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
            //       $cond: [ { $eq: [ "$gender", "????????????"] }, 0,1 ]
            //   },
            womenRecovered: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "????????????"] },
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
            //     $cond:  [ { $eq: [ "$gender", "???????????????"] },0,1 ]
            //   },

            menDeathsToday: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "???????????????"] },
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
                    { $eq: ["$gender", "????????????"] },
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
            //     $cond: [ { $eq: [ "$gender", "???????????????"] }, 0,1 ]
            //   },

            womenDeathsToday: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "???????????????"] },
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
            //     $cond:  [ { $eq: [ "$gender", "????????????"] }, 0,1 ]
            // },

            womenDeaths: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$gender", "????????????"] },
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

      // ????????????????????????????????????
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

    InterViewReport: async (
      _,
      { startDate, endDate },
      { PersonalInfo, AffectedLocation }
    ) => {
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
                    { $eq: ["$nationality", "???????????????"] },
                    // {$eq: ["$gender","????????????"]},
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
                    { $eq: ["$nationality", "???????????????"] },
                    { $eq: ["$gender", "????????????"] },
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
                    { $eq: ["$nationality", "???????????????"] },
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
                    { $eq: ["$nationality", "?????????"] },
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
                    { $eq: ["$nationality", "?????????"] },
                    { $eq: ["$gender", "????????????"] },

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
                    { $eq: ["$nationality", "?????????"] },
                    // {$eq: ["$gender","????????????"]},
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

      let interview = data.filter((res) => res._id === true);
      let totalAffectedLocation = await AffectedLocation.countDocuments({});
      let fulltotalAffectedLocation = await AffectedLocation.countDocuments({
        $and: [
          { province: { $ne: null } },
          { district: { $ne: null } },
          { commune: { $ne: null } },
          { village: { $ne: null } },
        ],
      });

      // get total sampletest location
      const totaSampleTestLocation = await PersonalInfo.aggregate([
        { $unwind: "$sampleTest" },
        { $group: { _id: "$sampleTest.testLocation", count: { $sum: 1 } } },
      ]);
      let totalSampleTestLocation = totaSampleTestLocation.reduce(
        (init, data) => {
          return data.count + init;
        },
        0
      );

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
        { $match: { gender: "????????????" } },
        {
          $project: {
            all: { $size: "$sampleTest" },
          },
        },
        { $group: { _id: 1, totalSampleTest: { $sum: "$all" } } },
      ]);

      //
      let totalSampleTests = totalSampleTest[0].totalSampleTest
        ? totalSampleTest[0].totalSampleTest
        : 0;
      let totalSampleTestWomens = totalSampleTestWomen[0].totalSampleTest
        ? totalSampleTestWomen[0].totalSampleTest
        : 0;

      let interviewTotal = 0;
      let totalKhmer = 0;
      let totalWomenKhmer = 0;
      let totalWomenKhmerToday = 0;
      let totalChina = 0;
      let totalChinaToday = 0;
      let totalChinaWomen = 0;

      if (interview.length > 0) {
        interviewTotal = interview[0].interviewTotal;
        totalKhmer = interview[0].totalKhmer;
        totalWomenKhmer = interview[0].totalWomenKhmer;
        totalWomenKhmerToday = interview[0].totalWomenKhmerToday;
        totalChina = interview[0].totalChina;
        totalChinaToday = interview[0].totalChinaToday;
        totalChinaWomen = interview[0].totalChinaWomen;
      }

      const res = {
        interviewTotal,
        totalKhmer,
        totalWomenKhmer,
        totalWomenKhmerToday,

        totalChina,
        totalChinaToday,
        totalChinaWomen,
        totalSampleTestLocation: totalSampleTestLocation,
        totalSampleTest: totalSampleTests,
        totalSampleTestWomen: totalSampleTestWomens,
        totalAffectedLocation: totalAffectedLocation,
        fulltotalAffectedLocation: fulltotalAffectedLocation,
      };

      return res;
    },
  },
};

// let totalAffectedLocationNew = await AffectedLocation.countDocuments({
//   "createdAt": { $gte: today, $lt: tomorrow },
// });
// let totalAffectedLocationNew = await AffectedLocation.countDocuments({
//   "createdAt": { $gte: today, $lt: tomorrow },
// });
