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
        getAffectedLocationWithPagination:async(_,{page,limit,keyword, startDate, endDate,status},{AffectedLocation})=>{
            const options = {
                page: page || 1,
                limit: limit || 10,
                customLabels: AffectedLocationLabels,
                sort: {
                  createdAt: -1,
                },
                // populate: "case personalInfo",
              };

                
                let startfilterDate = new Date()
                let filterDate = new Date()
                var openAtSet = {};
                var closeAtSet = {};

                if(startDate !== null || endDate !== null){
                    let start = new Date(new Date(startDate).setUTCHours(0,0,0,0));
                    let end = new Date(new Date(endDate).setUTCHours(23,59,59,59));

                    // filterDate = new Date(endDate)
                    // filterDate = new Date(endDate)

                    openAtSet  = { "openAt": { $gte: start, $lt: end } }
                    closeAtSet  = { "closeAt": { $gte: start, $lt: end } }

                }

                let statusQuery = {}
                switch(status){
                    case "បើក":
                        statusQuery = {"openAt": { $lte: new Date(filterDate.setUTCHours(23,59,59,59)) }}
                        closeAtSet = {}
                        break;
                    case "បិទ":
                        statusQuery = {$and: [{"closeAt": { $lte: new Date(filterDate.setUTCHours(23,59,59,59)) }},{"openAt":{$eq:null}}] }
                        openAtSet = {}
                        break;
                    default:
                        statusQuery= {}
                        closeAtSet = {}
                        break;
                }


                console.log(openAtSet)

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
                        },
                        openAtSet,
                        closeAtSet,
                        statusQuery,
                    ]
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
               
                const affectedLocations = new AffectedLocation(newAffectedLocation);
                const isCreated = await affectedLocations.save();
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



