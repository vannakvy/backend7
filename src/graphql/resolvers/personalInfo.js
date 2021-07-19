
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
    Query:{

        //@Desc getting all the persinal info 
        //@access private 
        //


        allPersonalInfos:async(_,{},{PersonalInfo})=>{
            const personalInfos = await PersonalInfo.find({}).populate('case');
            return personalInfos;
        },
        //@Desc Getting all the persoanl Info with pagination 
        //@access auth
        getPersonalInfoWithPagination:async(_,{page,limit,keyword},{PersonalInfo})=>{
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

        getPersonalInfoByCaseWithPagination:async(_,{page,limit,keyword,caseId},{PersonalInfo})=>{
            const options = {
                page: page || 1,
                limit: limit || 10,
                customLabels: PersonalInfoLabels,
                sort: {
                  createdAt: -1,
                },
                // populate: "case",
              };

              let query = {
                  $and:[{
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
                  ]
               
              };

              const personalInfos = await PersonalInfo.paginate(query, options);
              return personalInfos;
        },




        //@Desc getting the personalInfo by id
        //@access auth

        getPersonalInfoById:async(_  ,{id},{PersonalInfo})=>{
            const persoanalInfo = await PersonalInfo.findById(id);
         let a=   Object.bsonsize(PersonalInfo.findById())
         console.log(a)
            return persoanalInfo
        },
    },
    Mutation:{

        //@Desc create new Personal Info
        //@access auth
        createPersonalInfo:async(_,{newInfo},{PersonalInfo})=>{
            try {
                const info = new PersonalInfo(newInfo);
                const personalInfo = await info.save();
                if(!personalInfo){
                    return {
                        message:"Cannot create personal Info",
                        success: false
                    }
                }
                return {
                    message:"Personal info created successfully!",
                    success: true
                }
            } catch (error) {
                return {
                    message:"Cannot create personal Please contact the admin",
                    success: false
                }
            }
        },

        //@Desc delete the personal info
        //@access admin

        deletePersonalInfo:async(_,{id},{PersonalInfo})=>{
            try {
                const deletedInfo = await PersonalInfo.findByIdAndDelete(id);

                console.log(deletedInfo)
                if(!deletedInfo){
                    return {
                        success: false,
                        message: "cannot delete this record"
                    }
                }
                return {
                    success: true,
                    message: "Personal Info deleted successfully"
                }
            } catch (error) {
                return {
                    success: false,
                    message: "Cannot delete this record please contact the admin"
                }
            }
        },

        //@Desc update the personal info
        //@access auth

        updatePersonalInfo:async(_,{id,updatedInfo},{PersonalInfo})=>{
            try {
                const isUpdated = await PersonalInfo.findByIdAndUpdate(id,updatedInfo);
                if(!isUpdated){
                    return {
                        success: false,
                        message: "Personal Info updated not successfully"
                    }
                }

                return {
                    success: true,
                    message: "Cannot update this record please contact the admin"
                }

            } catch (error) {
                return {
                    success: false,
                    message: "Cannot update this record please contact the admin"
                }
            }
        }

    }
}



