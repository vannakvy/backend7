import moment from 'moment'
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

    function formatDate(date) {
        var d = new Date(moment.parseZone(date).format("YYYY-MM-DD")),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-') ;
    }


export default {
    Query:{

        //@Desc getting all the AffectedLocations
        //@access private 
        //

        allAffectedLocations:async(_,{},{AffectedLocation})=>{
            const affectedLocations = await AffectedLocation.find({}).populate("case personalInfo");
         
            return affectedLocations;
        },
        //@Desc Getting all AffectedLocations  with pagination 
        //@access auth
        getAffectedLocationWithPagination:async(_,{page,limit,keyword, startDate, endDate},{AffectedLocation})=>{
            const options = {
                page: page || 1,
                limit: limit || 10,
                customLabels: AffectedLocationLabels,
                sort: {
                  createdAt: -1,
                },
                // populate: "case personalInfo",
              };
                
                
                var openAtSet = {};
                // let start;
                // let end;
                if(startDate !== null || endDate !== null){
                    let start = formatDate(startDate)+"T00:00:00.00";
                    let end = formatDate(endDate)+"T23:59:59.00";
                    openAtSet = { "openAt": { $gte: start, $lt: end } }
                }

                let query = {
                    $and:[
                        {
                        $or: [
                            { locationName: { $regex: keyword, $options: "i" } },
                            { village: { $regex: keyword, $options: "i" } },
                            { commune: { $regex: keyword, $options: "i" } },
                            { district: { $regex: keyword, $options: "i" } },
                            { province: { $regex: keyword, $options: "i" } },
                            ],
                        },openAtSet,
                    ]
                };
                

            const affectedLocations = await AffectedLocation.paginate(query, options);
            console.log(affectedLocations)
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
               
                // const isExisted = await AffectedLocation.find({locationName:newAffectedLocation.locationName});
                // console.log(locationName)
                // if(isExisted==[]){
                //     return{
                //         message:"The AffectedLocation with this name is already exist",
                //         success: false,
                //         affectedLocation:{}
                //     }
                // }
                const affectedLocations = new AffectedLocation(newAffectedLocation);
                const isCreated = await affectedLocations.save();
                console.log(isCreated)
                if(!isCreated){
                    return {
                        message:"Cannot create AffectedLocation",
                        success: false,
                        affectedLocation: {}
                    }
                }
                return {
                    message:"affectedLocation created successfully!",
                    success: true,
                    affectedLocation: isCreated
                }
            } catch (error) {
                return {
                    message:"Cannot create AffectedLocation Please contact the admin",
                    success: false,
                    affectedLocation: null
                }
            }
        },

        //@Desc delete the AffectedLocation
        //@access admin

        deleteAffectedLocation:async(_,{id},{AffectedLocation})=>{
            try {
                const deletedInfo = await AffectedLocation.findByIdAndDelete(id);
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



