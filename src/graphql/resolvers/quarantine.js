const QuarantineLabels = {
  docs: "quarantines",
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
    //@Desc getting all the Quantine
    //@access private
    //

    allQuarantines: async (_, {}, { Quarantine }) => {
      const quarantines = await Quarantine.find({}).populate("personalInfo quarantineInfo");
      return quarantines;
    },
    //@Desc Getting all Quarantines  with pagination by quarantine Id
    //@access auth
    getQuarantineByQurantineIdWithPagination: async (
      _,
      { page, limit, keyword,quarantineInfoId},
      { Quarantine }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: QuarantineLabels,
        sort: {
          createdAt: -1,
        },
        populate:"personalInfo quarantineInfo",
      };

      let query = {
        $and:[{
          $or: [
              { personalType: { $regex: keyword, $options: "i" } },
            ],
          },
          { quarantineInfo: { $eq: quarantineInfoId.toString() } },
        ]
    };

      const quarantines = await Quarantine.paginate(query, options);
     
      
      return quarantines;
    },
    //@Desc getting the Quarantine by id
    //@access auth

    getQuarantineById: async (_, { id }, { Quarantine }) => {
      const quarantines = await Quarantine.findById(id).populae("personalInfo quarantineInfo");
      return quarantines;
    },
        //@Desc Getting all Quarantines  with pagination
    //@access auth
    getQuarantineWithPagination: async (
      _,
      { page, limit, keyword },
      { Quarantine }
    ) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: QuarantineLabels,
        sort: {
          createdAt: -1,
        },
        populate:"personalInfo quarantineInfo",
      };

    //   let query = {
    //     $and:[{
    //       $or: [
    //           { firstName: { $regex: keyword, $options: "i" } },
    //           { lastName: { $regex: keyword, $options: "i" } },
    //           { village: { $regex: keyword, $options: "i" } },
    //           { commune: { $regex: keyword, $options: "i" } },
    //           { disctrict: { $regex: keyword, $options: "i" } },
    //           { province: { $regex: keyword, $options: "i" } },
    //         ],
    //       },
    //       { quarantineInfo: { $eq: caseId.toString() } },
    //     ]
    // };

      const quarantines = await Quarantine.paginate({}, options);
   
      
      return quarantines;
    },
    //@Desc getting the Quarantine by id
    //@access auth

  
  },
  Mutation: {
    //@Desc create new Quarantine
    //@access auth
    createQuarantine: async (_, { newQuarantine }, { Quarantine }) => {
      try {
        const quarantines = new Quarantine(newQuarantine);
        const isCreated = await quarantines.save();
        if (!isCreated) {
          return {
            message: "Cannot create Quarantine",
            success: false,
          };
        }
        return {
          message: "Quarantine created successfully!",
          success: true,
        };
      } catch (error) {
        return {
          message: "Cannot create Quarantine Please contact the admin",
          success: false,
        };
      }
    },

    //@Desc delete the Quarantine
    //@access admin

    deleteQuarantine: async (_, { id }, { Quarantine }) => {
      try {
        const deletedInfo = await Quarantine.findByIdAndDelete(id);

  
        if (!deletedInfo) {
          return {
            success: false,
            message: "cannot delete this record",
          };
        }
        return {
          success: true,
          message: "Quarantine deleted successfully",
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

    updateQuarantine: async (_, { id, updatedQuarantine }, { Quarantine }) => {
      try {
        const isUpdated = await Quarantine.findByIdAndUpdate(
          id,
          updatedQuarantine
        );
        if (!isUpdated) {
          return {
            success: false,
            message: "Quarantine updated not successfully",
          };
        }
       
        
        return {
          success: true,
          message: "Quarantine updated successfully !",
        };
      } catch (error) {
        return {
          success: false,
          message: "cannot update the Quarantine please contact the admin",
        };
      }
    },
  },
};
