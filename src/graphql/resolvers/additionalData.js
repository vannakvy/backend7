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

  

//   district: String,
//   positive:Number,
//   positiveWomen:Number,

//   hospitalizing:Number,
//   hospitalizingWomen:Number,

//   death:Number,
//   deathWomen:Number,

//   recover:Number,
//   recoverWomen:Number,

//   sampleTest:Number,
//   sampleTestWomen:Number,

//   affected:Number,
//   affectedWomen:Number,

export default {
    Query:{
        //@Desc get all the data of the additional data 
        //@access admin
        allAdditionalData:async(_,{district},{Additional})=>{
            let data = await Additional.findOne({district:district});
            return data;
        }
    },
    Mutation:{
        //@Desc create additional Data 
        //@Access admin only\
        createAdditional:async(_,{additionalData},{Additional})=>{
            try {

                let existed = await Additional.findOne({district:additionalData.district});
                if(existed){
                    return {
                    success:true,
                    message:"ទិន្នន័យស្រុកនេះបានបង្កើតហើយ សូមមេត្តាកែប្រែជំនួសការលុបវិញ់​៕"
                    }
                }
                let data = new Additional(additionalData);
                let created = await data.save();

                if(!created) return {success: false,message:"មិនអាចបង្កើតបានទេ"}
                return {
                    success:true,
                    message:"បង្កើតបានជោគជ័យ"
                }

            } catch (error) {
                return {success: false,message:`មិនអាចបង្កើតបានទេ ${error.message}`}
            }
        },

        //@Desc update the addtional data 
        //@ACCESS 
        updateAdditional:async(_ ,{updateData},{Additional}) =>{
            try {
                console.log(updateData)
               let updated = await Additional.findOneAndUpdate({district:updateData.district},{$set:updateData})

                if(!updated) return {success: false,message:"មិនអាចកែបានទេ"}
                return {
                    success:true,
                    message:"កែបានជោគជ័យ"
                }

            } catch (error) {
                return {success: false,message:`មិនអាចកែបានទេ ${error.message}`}
            }
        }

    }
}



