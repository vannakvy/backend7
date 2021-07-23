import moment from "moment";
export default {
  Query: {
    //@Desc getAllProvinces
    //@Access auth

    getAllProvince: async (
      _,
      { district },
      { PersonalInfo, Quarantine, Hospitalization }
    ) => {
      let confirm = 0;
      let recover = 0;
      let death = 0;
      let confirmToday = 0;
      let recoveredToday = 0;
      let deathToday = 0;
      if (district === "" || district === "ករំីណីទាំងអស់") {
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
        let today = new Date();
        today.setHours(0, 0, 0, 0); // set to 0:00
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        confirmToday = await PersonalInfo.countDocuments({
          "currentState.confirmedAt": { $gte: today, $lt: tomorrow },
        });
        recoveredToday = await PersonalInfo.countDocuments({
          "currentState.recoveredAt": { $gte: today, $lt: tomorrow },
        });
        deathToday = await PersonalInfo.countDocuments({
          "currentState.deathAt": { $gte: today, $lt: tomorrow },
        });
      } else {
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
        let today = new Date();
        today.setHours(0, 0, 0, 0); // set to 0:00
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

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
      }

      let dataForBoxes = {
        confirmedCase: confirm,
        confirmedCaseToday: confirmToday,
        death: death,
        deathToday: deathToday,
        recovered: recover,
        recoveredToday: recoveredToday,
        // totalQuarantine:allQuarantine,
        // totalQuantineToday:allHospitalToday,
        // totalHospital:allHospital,
        // allHospitalActive:allHospitalActive,
        // allHospitalToday:allHospitalToday,
        // totalHospitalToday:allHospitalToday,
        // allQuantineActive:allQuantineActive,
        // allQuantineToday:allQuantineToday,
      };
      return dataForBoxes;
    },
    getAllDistrictForMap: async (_, {}, { PersonalInfo }) => {
      let today = new Date();
      today.setHours(0, 0, 0, 0);

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
        let limitDate = 2;
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
        return array;
      };

      // const convert =(arr)=>{
      //   let limit = 15;
      //   var result = {};
      //   for (var i = 0; i < limit; i++) {

      //     if(arr[i]._id.month !== null) {
      //       let a = `${arr[i]._id.month}`
      //       console.log(a)
      //       result[a] = arr[i].confirm;
      //     }

      //   }
      //   console.log(result,"fff")
      //   return result;
      // }

      //   const convert = (e) => {
      //     let array = {}
      //     let limitDate = 4
      //     e.map(load => {
      //         var y =`${load._id.month}/${load._id.day}/${load._id.year}`
      //         if (load._id.month !== null) {
      //             if (new Date(y).getDate() > new Date().getDate() - limitDate && new Date(y).getDate() >= 0) {
      //                 let x = { [y]: load.confirm }
      //                 array = {...array, ...x}
      //             }
      //         }
      //     })
      //    return array;
      // }

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
      ]);
      // console.log(confirm);

      return {
        cases: convert(confirm),
        recovered: convert(recovered),
        deaths: convert(deathAt),
      };
    },
    // @Desc getting the data for report
    //auth and private
    getDataForReport: async (_, { start, end }, { PersonalInfo }) => {
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      const data = await PersonalInfo.aggregate([
        {
          $project: {
            district: 1,
            menConfirmToday: {
              $cond: [ {$and : [ { $eq: [ "$gender", "ប្រុស"] },
              { $gte: [ "$currentState.confirmedAt",today] }] }, 1,0 ]
            },
            womenConfirmToday: {
              $cond: [ {$and : [ { $eq: [ "$gender", "ស្រី"] },
             { $gte: [ "$currentState.confirmedAt",today] }] }, 1,0 ]
            },
             menConfirm: {
              $cond: [ {$and : [ { $eq: [ "$gender", "ប្រុស"] },
              { $eq: [ "$currentState.confirm",true] }] }, 1,0 ]
            },
            womenConfirm: {
              $cond: [ {$and : [ { $eq: [ "$gender", "ស្រី"] },
              { $eq: [ "$currentState.confirm",true] }] }, 1,0 ]
          },

          //For Recovery
          menRecoveredToday: {
            $cond: [ {$and : [ { $eq: [ "$gender", "ប្រុស"] },
            { $gte: [ "$currentState.recoveredAt",today] }] }, 1,0 ]
          },
          womenRecoveredToday: {
            $cond: [ {$and : [ { $eq: [ "$gender", "ស្រី"] },
           { $gte: [ "$currentState.recoveredAt",today] }] }, 1,0 ]
          },
           menRecovered: {
            $cond: [ {$and : [ { $eq: [ "$gender", "ប្រុស"] },
            { $eq: [ "$currentState.recovered",true] }] }, 1,0 ]
          },
          womenRecovered: {
            $cond: [ {$and : [ { $eq: [ "$gender", "ស្រី"] },
            { $eq: [ "$currentState.recovered",true] }] }, 1,0 ]
        },

        //For Deaths
        menDeathsToday: {
          $cond: [ {$and : [ { $eq: [ "$gender", "ប្រុស"] },
          { $gte: [ "$currentState.deathAt",today] }] }, 1,0 ]
        },
        womenDeathsToday: {
          $cond: [ {$and : [ { $eq: [ "$gender", "ស្រី"] },
         { $gte: [ "$currentState.deathAt",today] }] }, 1,0 ]
        },
         menDeaths: {
          $cond: [ {$and : [ { $eq: [ "$gender", "ប្រុស"] },
          { $eq: [ "$currentState.death",true] }] }, 1,0 ]
        },
        womenDeaths: {
          $cond: [ {$and : [ { $eq: [ "$gender", "ស្រី"] },
          { $eq: [ "$currentState.death",true] }] }, 1,0 ]
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

    },
  },
};
