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
              [`${load._id.month}/${load._id.day}/${load._id.year}`]:
                load.confirm,
            };
            limitDate -= 1;
            array.push(x);
            // }
          }
        });
        return array;
      };

      let confirm = await PersonalInfo.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$currentState.confirmedAt" },
              day: { $dayOfMonth: "$currentState.confirmedAt" },
              year: { $year: "$currentState.confirmedAt" },
            },
            confirm: { $sum: 1 },
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
            recovered: { $sum: 1 },
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
            death: { $sum: 1 },
          },
        },
      ]);
      console.log(convert(confirm));
      console.log(convert(recovered));
      console.log(convert(deathAt));
      return {
        cases: convert(confirm),
        recovered: convert(recovered),
        deaths: convert(deathAt),
      };

      //   console.log(a)
      // console.log(recovered)
      // console.log(deaths)
    },
  },
};
