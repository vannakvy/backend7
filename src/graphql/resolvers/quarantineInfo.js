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

    //@Desc get total people in the quarantine 
    //@Access auth 
    QuarantineDashboard:async(_,{quarantineId},{PersonalInfo})=>{
      var today = new Date(new Date().setUTCHours(0, 0, 0, 0));
      var tomorrow= new Date(new Date().setUTCHours(23,59,59,59));

      let totalInToday = await PersonalInfo.countDocuments(
      {$and:[ {quaranting: { $elemMatch: { quarantineInfo: quarantineId } }},{ quaranting: { $elemMatch: { date_in: {$gte:today,$lt:tomorrow}}}} ]} )   
      let totalIn = await PersonalInfo.countDocuments({quaranting: { $elemMatch: { quarantineInfo: quarantineId }}} );   

      let totalOutToday = await PersonalInfo.countDocuments(
          {$and:[ {quaranting: { $elemMatch: { quarantineInfo: quarantineId } }},{ quaranting: { $elemMatch: { date_out: {$gte:today,$lt:tomorrow}}}} ]} )   
      let totalOut = await PersonalInfo.countDocuments({$and:[ {quaranting: { $elemMatch: { quarantineInfo: quarantineId } }},
          { quaranting: { $elemMatch: { date_out: {$ne:null}}}} ]} );
          
   return {
       totalIn,
       totalInToday,
       totalOut,
       totalOutToday,

   }

  },
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
      if (!quarantines) {
        return {};
      }
      return quarantines;
    },
  },
  Mutation: {
    //@Desc create new Quarantine
    //@access auth
    createQuarantineInfo: async (
      _,
      { newQuarantineInfo },
      { QuarantineInfo }
    ) => {
      try {
        const isExisted = await QuarantineInfo.findOne({
          locationName: newQuarantineInfo.locationName,
          village: newQuarantineInfo.village,
        });
        if (isExisted) {
          return {
            message: "ឈ្មោះនេះមាននៅក្នុង ការកត់ត្រាហើយ",
            success: false,
            quarantineInfo: {},
          };
        }
        const quarantines = new QuarantineInfo(newQuarantineInfo);
        const isCreated = await quarantines.save();

        if (!isCreated) {
          return {
            message: "មិនអាចបង្កើតបានទេ",
            success: false,
            quarantineInfo: {},
          };
        }
        return {
          message: "ការបង្កើតទទួលបានជោកជ័យ!",
          success: true,
          quarantineInfo: isCreated,
        };
      } catch (error) {
        return {
          message: `មិនអាចបង្កើតបានទេ សូមមេត្តាទាក់ទង ខាងអភិវត្តកម្មវិធី ជាមួយនិងសារនេះ ${erro.message}`,
          success: false,
          quarantineInfo: {},
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

    updateQuarantineInfo: async (
      _,
      { id, updatedQuarantineInfo },
      { QuarantineInfo }
    ) => {
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
