
const AffectedLocationLabels = {
    docs: "affectedLocations",
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

        //@Desc getting all the AffectedLocations
        //@access private 
        //


        allAffectedLocations:async(_,{},{AffectedLocation})=>{
            const affectedLocations = await AffectedLocation.find({}).populate("case personalInfo");
            console.log(affectedLocations);
            return affectedLocations;
        },
        //@Desc Getting all AffectedLocations  with pagination 
        //@access auth
        getAffectedLocationWithPagination:async(_,{page,limit,keyword},{AffectedLocation})=>{
            const options = {
                page: page || 1,
                limit: limit || 10,
                customLabels: AffectedLocationLabels,
                sort: {
                  createdAt: -1,
                },
                populate: "case personalInfo",
              };

              let query = {
                $or: [
                    { effectedLocationName: { $regex: keyword, $options: "i" } },
                  { village: { $regex: keyword, $options: "i" } },
                  { commune: { $regex: keyword, $options: "i" } },
                  { district: { $regex: keyword, $options: "i" } },
                  { province: { $regex: keyword, $options: "i" } },
                ],
              };

              const affectedLocations = await AffectedLocation.paginate(query, options);
              return affectedLocations;
        },
        //@Desc getting the AffectedLocation by id
        //@access auth

        getAffectedLocationById:async(_  ,{id},{AffectedLocation})=>{
            const affectedLocations = await AffectedLocation.findById(id);
            return affectedLocations
        },
    },
    Mutation:{

        //@Desc create new AffectedLocation
        //@access auth
        createAffectedLocation:async(_,{newAffectedLocation},{AffectedLocation})=>{
            try {
               
                const isExisted = await AffectedLocation.find({affectedLocationName:newAffectedLocation.affectedLocationName});
                console.log(isExisted)
                if(isExisted==[]){
                    return{
                        message:"The AffectedLocation with this name is already exist",
                        success: false
                    }
                }
             
                const affectedLocations = new AffectedLocation(newAffectedLocation);
                const isCreated = await affectedLocations.save();
                if(!isCreated){
                    return {
                        message:"Cannot create AffectedLocation",
                        success: false
                    }
                }
                return {
                    message:"AffectedLocation created successfully!",
                    success: true
                }
            } catch (error) {
                return {
                    message:"Cannot create AffectedLocation Please contact the admin",
                    success: false
                }
            }
        },

        //@Desc delete the AffectedLocation
        //@access admin

        deleteAffectedLocation:async(_,{id},{AffectedLocation})=>{
            try {
                const deletedInfo = await AffectedLocation.findByIdAndDelete(id);

                console.log(deletedInfo)
                if(!deletedInfo){
                    return {
                        success: false,
                        message: "cannot delete this record"
                    }
                }
                return {
                    success: true,
                    message: "AffectedLocation deleted successfully"
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

        updateAffectedLocation:async(_,{id,updatedAffectedLocation},{AffectedLocation})=>{
            try {
                const isUpdated = await AffectedLocation.findByIdAndUpdate(id,updatedAffectedLocation);
                if(!isUpdated){
                    return {
                        success: false,
                        message: "AffectedLocation updated not successfully"
                    }
                }
                console.log(isUpdated)
                return {
                    success: true,
                    message: "AffectedLocation updated successfully !"
                }

            } catch (error) {
                return {
                    success: false,
                    message: "cannot update the AffectedLocation please contact the admin"
                }
            }
        }

    }
}



