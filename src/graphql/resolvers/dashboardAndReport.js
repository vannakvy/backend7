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
      if (district === "") {
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

        // const allHospital = await Hospitalization.countDocuments({});
        // const allHospitalActive = await Hospitalization.countDocuments({"in":true});
        // const allHospitalToday = await Hospitalization.countDocuments({$and:[{"in":true},{"date_in": { $gte: today, $lt: tomorrow }}]});

        // const allQuarantine = await Quarantine.countDocuments({});
        // const allQuantineActive = await Quarantine.countDocuments({"in":true});
        // const allQuantineToday = await Quarantine.countDocuments({$and:[{"in":true},{"date_in": { $gte: today, $lt: tomorrow }}]});
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
      today.setHours(0, 0, 0, 0); // set to 0:00
      let tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() +1);

      console.log(today,tomorrow)
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
            confirmToday: [{
              $cond: [ {$and : [ { $gte: [ "$currentState.confirmedAt", today] },
              { $lt: [ "$currentState.confirmedAt",tomorrow] }] }, 1,0 ] 
            },]


            
            // recoveredToday: {
            //   // Set to 1 if value < 10
            //   $cond: [
            //     { "currentState.recoveredAt": { $gte: today, $lt: tomorrow } },
            //     1,
            //     0,
            //   ],
            // },
            // deathToday: {
            //   // Set to 1 if value < 10
            //   $cond: [
            //     { "currentState.deathAt": { $gte: today, $lt: tomorrow } },
            //     1,
            //     0,
            //   ],
            // },
          },
        },
        {
          $group: {
            _id: "$district",
            confirm: { $sum: "$confirm" },
            recovered: { $sum: "$recovered" },
            death: { $sum: "$death" },
            confirmToday: { $sum: "$confirmToday" },
            // recoveredToday: { $sum: "$recoveredToday" },
            // deathToday: { $sum: "$deathToday" },
          },
        },
      ]);
console.log("Ddd")
      console.log(data);

      // const data = await PersonalInfo.aggregate([
      //   { "$group": {
      //     "_id": "$district",
      //     "countOfUsers": { "$sum": 1 },  //Count the number of user ids
      //     "subscribersCount": { "$sum": { "$size": "$subscribers" }}  // Get the size of the subscribers array and make summation
      //   }}
      // ])
    },
  },
};
