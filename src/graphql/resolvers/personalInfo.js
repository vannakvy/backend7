import moment from "moment";
import PersonalInfo from "../typeDefs/PersonalInfo";

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
    getSampleTestLocation: async (_, {}, { PersonalInfo }) => {
      let locationName = await PersonalInfo.aggregate([
        { $unwind: "$sampleTest" },
        { $group: { _id: "$sampleTest.testLocation" } },
      ]);
      return locationName;
    },

    //@Desc for export to the csv file
    //@Access  auth
    excelExport: async (_, { startDate, endDate }, { PersonalInfo }) => {
      const allData = await PersonalInfo.find({
        $and: [
          {
            sampleTest: {
              $elemMatch: {
                date: {
                  $gte: new Date("2021-08-05T00:00:00"),
                  $lt: new Date("2021-08-05T59:00:00"),
                },
              },
            },
          },
          { commune: "ចារឈូក" },
        ],
      });

      return allData;
    },
    //@Desc get perfornal info for the Hospital
    //@Access police
    getPeopleForSampleTestWithPagination: async (
      _,
      { page, limit, keyword, startDate, endDate, testLocation },
      { PersonalInfo, roles }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 25,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: 1,
        },
        //   populate: "case",
      };
      let query;
      let start;
      let end;
      let testLocationQuery = {};
      if (testLocation !== null) {
        testLocationQuery = {
          sampleTest: {
            $elemMatch: {
              $or: [{ testLocation: testLocation }, { testLocation: null }],
            },
          },
        };
      }
      if (startDate !== null || endDate !== null) {
        start = formatDate(startDate) + "T00:00:00.00";
        end = formatDate(endDate) + "T23:59:59.00";
        query = {
          $and: [
            {
              $or: [
                { patientId: { $regex: keyword, $options: "i" } },
                { englishName: { $regex: keyword, $options: "i" } },
                { firstName: { $regex: keyword, $options: "i" } },
                { lastName: { $regex: keyword, $options: "i" } },
                { village: { $regex: keyword, $options: "i" } },
                { commune: { $regex: keyword, $options: "i" } },
                { disctrict: { $regex: keyword, $options: "i" } },
                { province: { $regex: keyword, $options: "i" } },
                { patientId: { $regex: keyword, $options: "i" } },
                { idCard: { $regex: keyword, $options: "i" } },
                { tel: { $regex: keyword, $options: "i" } },
              ],
            },
            // { "currentState.confirm": false },
            //  { "sampleTest": { $ne: []} },
            //  { "district": { $ne: []} },
            // { "sampleTest.date": { $gte: startDate, $lt: endDate } },
            // { sampleTest: { $elemMatch: {  } }
            //  2021-08-05T17:00:00.032Z 2021-08-06T16:59:59.033Z date
            { sampleTest: { $elemMatch: { date: { $gte: start, $lt: end } } } },
            testLocationQuery,
          ],
        };
      } else {
        query = {
          $and: [
            {
              $or: [
                { patientId: { $regex: keyword, $options: "i" } },
                { englishName: { $regex: keyword, $options: "i" } },
                { firstName: { $regex: keyword, $options: "i" } },
                { lastName: { $regex: keyword, $options: "i" } },
                { village: { $regex: keyword, $options: "i" } },
                { commune: { $regex: keyword, $options: "i" } },
                { disctrict: { $regex: keyword, $options: "i" } },
                { province: { $regex: keyword, $options: "i" } },
                { patientId: { $regex: keyword, $options: "i" } },
                { idCard: { $regex: keyword, $options: "i" } },
                { tel: { $regex: keyword, $options: "i" } },
              ],
            },
            testLocationQuery,
            // { "currentState.confirm": false },
            // { "sampleTest": { $ne: []} },
            // { "sampleTest.date": { $gte: startDate, $lt: endDate } },
            // { sampleTest: { $elemMatch: {  } }
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
      { page, limit, keyword = "", startDate, endDate, hospitalId },
      { PersonalInfo }
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
          { hospitalizations: { $elemMatch: { hospitalInfo: hospitalId } } },
          // { "quarantine.date_in": { $gte: startDate, $lt: endDate } },
        ],
      };
      const personalInfos = await PersonalInfo.paginate(query, options);
      console.log(personalInfos);
      return personalInfos;
    },

    // the police
    //@Desc get perfornal info for the qurantine
    //@Access police

    getPeopleForQuarantineWithPagination: async (
      _,
      { quarantineInfoId, limit, page, keyword },
      { PersonalInfo }
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
          // { "currentState.confirm": { $eq: quarantineInfoId } },
          // { "quarantine.date_in": { $ne: null } },
          // { "quarantine.date_in": { $gte: startDate, $lt: endDate } },
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
      { PersonalInfo }
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
          // { "currentState.confirmedAt": { $gte: startDate, $lt: endDate } },
        ],
      };
      const personalInfos = await PersonalInfo.paginate(query, options);

      return personalInfos;
    },
    //Des

    //@Desc get affected Personalist
    //Access police

    getAffectedPersonalListWithPagination: async (
      _,
      { page, limit, keyword = "", patientId },
      { PersonalInfo }
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
          { "currentState.confirm": true },
          { "affectedFrom.patientCode": patientId },
        ],
      };
      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },
    //@Desc get all the personalInfo that is confirmed  for interview
    // @Access Auth
    getConfirmedPersonalInfoByInterviewWithPagination: async (
      _,
      { page, limit, keyword = "", interview },
      { PersonalInfo }
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
          { "currentState.confirm": true },
          { interviewed: interview },
        ],
      };
      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },

    //@Desc getting all the persinal info
    //@access private
    //

    allPersonalInfos: async (_, {}, { PersonalInfo }) => {
      const personalInfos = await PersonalInfo.find({}).populate("case");
      return personalInfos;
    },
    //@Desc Getting all the persoanl Info with pagination
    //@access auth
    getPersonalInfoWithPagination: async (
      _,
      { page, limit, keyword, currentState, startDate, endDate },
      { PersonalInfo }
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

      let current = {};

      switch (currentState) {
        case "វិជ្ជមាន":
          current = { "currentState.confirm": true}
          break;
        case "ជាសះស្បើយ":
          current = { "currentState.recovered": true}
          break;
        case "ស្លាប់":
          current = { "currentState.death": true}
          break;
        case "អវិជ្ជមាន":
          current = { "currentState.confirm": false}
          break;
      default:
        current = {}
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
        ],
      };
      const personalInfos = await PersonalInfo.paginate(query, options);

      return personalInfos;
    },

    //@Desc getting all the info by case Id with pagination \
    //@Access Auth

    getPersonalInfoByCaseWithPagination: async (
      _,
      { page, limit, keyword, caseId },
      { PersonalInfo }
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

      const personalInfos = await PersonalInfo.paginate(query, options);
      return personalInfos;
    },

    //@Desc getting the personalInfo by id
    //@access auth

    getPersonalInfoById: async (_, { id }, { PersonalInfo }) => {
      const persoanalInfo = await PersonalInfo.findOne({ _id: id });
      return persoanalInfo;
    },
  },

  Mutation: {
    //@Desc Delete the patient from hospital
    //Access admin

    deletePatientFromHospital: async (
      _,
      { personalInfoId, hospitalId },
      { PersonalInfo }
    ) => {
      try {
        let a = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $pull: { hospitalizations: { hospitalInfo: hospitalId } },
          }
        );
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
      { PersonalInfo }
    ) => {
      try {
        let a = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $pull: { quaranting: { quarantineInfo: quarantingId } },
          }
        );
        return {
          success: true,
          message: "Deleted Successfully",
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    //@Desc update simple test
    //@access doctor

    updateSampleTest: async (
      _,
      { personalInfoId, sampleTestId, sampleTest },
      { PersonalInfo }
    ) => {
      console.log(sampleTest);

      try {
        await PersonalInfo.findById(personalInfoId);
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
            },
          }
        );

        // if ((sampleTest.result = true)) {
        //   let updateState = {
        //     confirm: sampleTest.result,
        //     confirmedAt: sampleTest.resultDate,
        //     covidVariant: sampleTest.covidVariant,
        //   };

        //   const updated = await PersonalInfo.update(
        //     { _id: personalInfoId },
        //     {
        //       $set: {
        //         currentState: updateState,
        //       },
        //     }
        //   );


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

    // For police
    addPatientToHospital: async (
      _,
      { personalInfoId, newHospitalization },
      { PersonalInfo }
    ) => {
      try {
        const updatedData = await PersonalInfo.findByIdAndUpdate(
          personalInfoId,
          { $push: { hospitalizations: newHospitalization } }
        );
        console.log(updatedData);
        if (!updatedData) {
          return {
            success: false,
            message: "មិនទាន់មានអ្នកកំណត់ត្រានេះទេ",
          };
        }

        // let a = await PersonalInfo.updateOne(
        //   { _id: personalInfo },
        //   {
        //     $push: {
        //       hospitalizations: {
        //         $each: [newHospitalization],
        //         // $sort: { score: 1 },
        //         $slice: -5,
        //       },
        //     },
        //   }
        // );

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

    // deletePatientFromHospital

    // For police
    addPeopleToQuarantine: async (
      _,
      { personalInfo, newQuarantine },
      { PersonalInfo }
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
          quaranting: {
            $elemMatch: {
              quarantineInfo: newQuarantine.quarantineInfo.toString(),
            },
          },
        });

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
      { PersonalInfo }
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

    //@Desc update the current State
    //@Access auth
    updateCurrentState: async (
      _,
      { personalInfoId, updateValue },
      { PersonalInfo }
    ) => {
      try {
        const updated = await PersonalInfo.update(
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
            message: "Cannot this status ",
          };
        }
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
      { PersonalInfo }
    ) => {
      try {
        const updatedData = await PersonalInfo.findByIdAndUpdate(
          personalInfoId,
          { $push: { sampleTest: sampleTest } }
        );
        if (!updatedData) {
          return {
            success: false,
            message: "មិនទាន់មានអ្នកកំណត់ត្រានេះទេ",
          };
        }
        // if ((sampleTest.result = true)) {
        //   let updateState = {
        //     confirm: sampleTest.result,
        //     confirmedAt: sampleTest.resultDate,
        //     covidVariant: sampleTest.covidVariant,
        //   };

        //   const updated = await PersonalInfo.update(
        //     { _id: personalInfoId },
        //     {
        //       $set: {
        //         currentState: updateState,
        //       },
        //     }
        //   );
        // }

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
      { PersonalInfo }
    ) => {
      try {
        let a = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $pull: { historyWithin14days: { _id: historyWithin14Id } },
          }
        );

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

    // @Desc delete sample Test
    // @auth

    deleteSampleTest: async (
      _,
      { personalInfoId, sampleTestId },
      { PersonalInfo }
    ) => {
      try {
        let a = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $pull: { sampleTest: { _id: sampleTestId } },
          }
        );

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
    createPersonalInfo: async (_, { newInfo }, { PersonalInfo }) => {
      try {
        let exist = await PersonalInfo.findOne({
          $and: [
            { firstName: newInfo.firstName },
            { lastName: newInfo.lastName },
            { village: newInfo.village },
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

        const info = new PersonalInfo(newInfo);
        const personalInfo = await info.save();
        if (!personalInfo) {
          return {
            response: {
              message: "Cannot create personal Info",
              success: false,
            },
            personalInfo: {},
          };
        }
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

    deletePersonalInfo: async (_, { id }, { PersonalInfo }) => {
      try {
        const deletedInfo = await PersonalInfo.findByIdAndDelete(id);

        if (!deletedInfo) {
          return {
            success: false,
            message: "cannot delete this record",
          };
        }
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

    updatePersonalInfo: async (_, { id, updatedInfo }, { PersonalInfo }) => {
      try {
        const isUpdated = await PersonalInfo.findByIdAndUpdate(id, updatedInfo);
        if (!isUpdated) {
          return {
            success: false,
            message: "Personal Info updated not successfully",
          };
        }
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
