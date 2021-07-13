const QuarantineLabels = {
    docs: "quarantineInfos",
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
  
      allQuarantineInfos: async (_, {}, { QuarantineInfo }) => {
        const quarantines = await QuarantineInfo.find({});
        return quarantines;
      },
      //@Desc Getting all Quarantines  with pagination
      //@access auth
      getQuarantineInfoWithPagination: async (
        _,
        { page, limit, keyword },
        { QuarantineInfo }
      ) => {
        const options = {
          page: page || 1,
          limit: limit || 10,
          customLabels: QuarantineLabels,
          sort: {
            createdAt: -1,
          },
          // populate: "customer",
        };
  
        let query = {
          $or: [
            { locationName: { $regex: keyword, $options: "i" } },
            { village: { $regex: keyword, $options: "i" } },
            { commune: { $regex: keyword, $options: "i" } },
            { disctrict: { $regex: keyword, $options: "i" } },
            { province: { $regex: keyword, $options: "i" } },
          ],
        };
  
        const quarantines = await QuarantineInfo.paginate(query, options);
  
        return quarantines;
      },
      //@Desc getting the Quarantine by id
      //@access auth
  
      getQuarantineInfoById: async (_, { id }, { QuarantineInfo }) => {
        const quarantines = await QuarantineInfo.findById(id);
        //if there is no data in the database graphql will response with error , to prevent this we return {}
        if(!quarantines){
            return {}
        }
        return quarantines;
      },
    },
    Mutation: {
      //@Desc create new Quarantine
      //@access auth
      createQuarantineInfo: async (_, { newQuarantineInfo }, { QuarantineInfo }) => {
       
        try {
          const isExisted = await QuarantineInfo.findOne({
            locationName: newQuarantineInfo.locationName,
          });
  
          if (isExisted) {
            return {
              message: "The Quarantine with this name is already exist",
              success: false,
            };
          }
         
          const quarantines = new QuarantineInfo(newQuarantineInfo);
     
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
  
      deleteQuarantineInfo: async (_, { id }, { QuarantineInfo }) => {
        try {
          const deletedInfo = await QuarantineInfo.findByIdAndDelete(id);
  
    
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
  
      updateQuarantineInfo: async (_, { id, updatedQuarantineInfo }, { QuarantineInfo }) => {
        try {
          const isUpdated = await QuarantineInfo.findByIdAndUpdate(
            id,
            updatedQuarantineInfo
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
  