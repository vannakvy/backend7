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

    //@Desc get all the personalInfo that is confirmed  for interview 
    // @Access Auth 

    getConfirmedPersonalInfoByInterviewWithPagination: async (
        _,
        { page, limit, keyword="",interview },
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
            $and:[
                { $or: [
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
                {"currentState.confirm":true},
                { "interviewed":interview},
            ]
        }
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
      { page, limit, keyword },
      { PersonalInfo }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: PersonalInfoLabels,
        sort: {
          createdAt: -1,
        },
        populate: "case",
      };

      let query = {
        $or: [
          { firstName: { $regex: keyword, $options: "i" } },
          { lastName: { $regex: keyword, $options: "i" } },
          { village: { $regex: keyword, $options: "i" } },
          { commune: { $regex: keyword, $options: "i" } },
          { disctrict: { $regex: keyword, $options: "i" } },
          { province: { $regex: keyword, $options: "i" } },
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
      const persoanalInfo = await PersonalInfo.findById(id).populate("case");
      return persoanalInfo;
    },
  },
  Mutation: {
    //@Desc update the current State 
    //@Access auth 
    updateCurrentState:async(_,{personalInfoId,updateValue},{PersonalInfo})=>{
        try {
            const updated = await PersonalInfo.update(
                { _id: personalInfoId },
                { $set:
                   {
                     currentState: updateValue,
                   }
                }
            )
            if(!updated){
                return {
                    success : false,
                    message: "Cannot this status "
                }
            }
            return {
                success : true,
                message: "Updated successfully "
            }
        } catch (error) {
            return {
                success : false,
                message: error.message
            }
        }
    
    },




    //@Desc add Sample test to the hospitalization
    //@Access

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
        if (sampleTest.result === true) {
          await PersonalInfo.findByIdAndUpdate(personalInfoId, {
            $set: {
              "currentState.confirm": true,
              "currentState.confirmedAt": sampleTest.date,
            },
          });
        }

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

    // @Desc delete sample Test
    // @auth

    deleteSampleTest: async (
      _,
      { personalInfoId, sampleTestId },
      { PersonalInfo }
    ) => {
      try {
        //    let a =    await  PersonalInfo.update(
        //             { '_id': personalInfoId},
        //             { $pull: { sampleTest: { "_id": sampleTestId } } },
        //             false, // Upsert
        //             true, // Multi
        //         );
        //         console.log(a)

        // let  a = await PersonalInfo.findOneAndUpdate({"_id":personalInfoId}, { $pull: {sampleTest: sampleTestId} })
        // let a =await PersonalInfo.updateOne( {id: personalInfoId}, { $pullAll: {id: [sampleTestId] } } )
        let a = await PersonalInfo.updateOne(
          { _id: personalInfoId },
          {
            $pull: { sampleTest: { _id: sampleTestId } },
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
    //@Desc create new Personal Info
    //@access auth
    createPersonalInfo: async (_, { newInfo }, { PersonalInfo }) => {
      try {
        const info = new PersonalInfo(newInfo);
        const personalInfo = await info.save();
        if (!personalInfo) {
          return {
            message: "Cannot create personal Info",
            success: false,
          };
        }
        return {
          message: "Personal info created successfully!",
          success: true,
        };
      } catch (error) {
        return {
          message: "Cannot create personal Please contact the admin",
          success: false,
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
