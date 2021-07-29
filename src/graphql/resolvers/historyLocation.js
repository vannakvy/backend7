

export default {
    Query:{

        //@Desc getting all the AffectedLocations
        //@access private 
        //

        allHistoryLocations:async(_,{},{HistoryLocation})=>{
            const historyLocations = await HistoryLocation.find({}).populate("case personalInfo AffectedLocation");
            return historyLocations;
        },

        //@Desc getting the AffectedLocation by id
        //@access auth

        getHistoryLocationById:async(_  ,{id},{HistoryLocation})=>{
            const historyLocation = await HistoryLocation.findById(id).populate("case personalInfo affectedLocationId");
 
            return historyLocation
        },
          //@Desc getting the History location  by personalInfo Id
        //@access auth

        getHistoryLocationByPersonalInfoId:async(_  ,{personalId},{HistoryLocation})=>{
            const historyLocations = await HistoryLocation.find({"personalInfo":personalId}).populate("case personalInfo affectedLocationId");
           
            
            return  historyLocations
        },
    },
    Mutation:{
        //@Desc create new AffectedLocation
        //@access auth
        createHistoryLocation:async(_,{newHistoryLocation},{HistoryLocation})=>{
            try {
               
                const historyLocations = new HistoryLocation(newHistoryLocation);
                const isCreated = await historyLocations.save();
                if(!isCreated){
                    return {
                        message:"Cannot create AffectedLocation",
                        success: false,
                    }
                }
                return {
                    message:"AffectedLocation created successfully!",
                    success: true,
                }
            } catch (error) {
                return {
                    message:"Cannot create AffectedLocation Please contact the admin",
                    success: false,
                }
            }
        },

        //@Desc delete the AffectedLocation
        //@access admin

        deleteHistoryLocation:async(_,{id},{HistoryLocation})=>{
            try {
                const deletedInfo = await HistoryLocation.findByIdAndDelete(id);
               
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

        updatedHistoryLocation:async(_,{id,updatedHistoryLocation},{HistoryLocation})=>{
            try {
                const isUpdated = await AffectedLocation.findByIdAndUpdate(id,updatedHistoryLocation);
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



