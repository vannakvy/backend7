import mongoose from 'mongoose';

const HospitalInfoLabels = {
    docs: "hospitalInfos",
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

        //@Desc get total patient that is recovered immigrant worker to a specific country 
        //@Access doctor 
        reportForImmigrantWorker:async(_,{hospitalId},{PersonalInfo,HospitalInfo})=>{
           let id = await mongoose.Types.ObjectId(hospitalId);
            // const data = await PersonalInfo.aggregate([
            //     // {$match:{hospitalizations:{$elemMatch:{hospitalInfo:{$eq:hospitalId.toString()}}}}},
            
            //     { $match:{hospitalizations: { $elemMatch: { hospitalInfo:{$eq:id}  } }} },
            //     {$match:{hospitalizations:{$elemMatch:{personTypes:"ពលករ"}}}},
            //     {$match:{"hospitalizations.province":{$ne:null}}},
            //     {$unwind:"$hospitalizations"},
            //     { $group: { _id: "$hospitalizations.province", total: { $sum: 1 } } },
            // ]);
                        const data = await PersonalInfo.aggregate([
                {$match:{"hospitalizations.province":{$ne:null}}},
                {$match:{"hospitalizations.hospitalInfo":{$eq:id}}},
                {$match:{"hospitalizations.personTypes":{$eq:"ពលករ"}}},
                // { $match:{hospitalizations: { $elemMatch: { hospitalInfo:{$eq:id}  } }} },
                // {$match:{hospitalizations:{$elemMatch:{personTypes:"ពលករ"}}}},
             
                {$unwind:"$hospitalizations"},
                { $group: { _id: "$hospitalizations.province", total: { $sum: 1 } } },
            ]);
            return data
        },

        
        //@Desc get data for the dashboard int each hopital 
        //@access auth 

        hospitalDashboard:async(_,{hospitalInfo},{PersonalInfo})=>{
            var today = new Date(new Date().setUTCHours(0, 0, 0, 0));
            var tomorrow= new Date(new Date().setUTCHours(23,59,59,59));
            let totalInToday = await PersonalInfo.countDocuments({$and:[ {hospitalizations: { $elemMatch: { hospitalInfo: hospitalInfo } }},{ hospitalizations: { $elemMatch: { date_in: {$gte:today,$lt:tomorrow}}}} ]} )   
            let totalInTodayWomen = await PersonalInfo.countDocuments({$and:[ {hospitalizations: { $elemMatch: { hospitalInfo: hospitalInfo } }},{ hospitalizations: { $elemMatch: { date_in: {$gte:today,$lt:tomorrow}}}},{gender:"ស្រី"} ]} )
           
            let totalIn = await PersonalInfo.countDocuments({hospitalizations: { $elemMatch: { hospitalInfo: hospitalInfo }}} );   
            let totalInWomen = await PersonalInfo.countDocuments({$and:[ {hospitalizations: { $elemMatch: { hospitalInfo: hospitalInfo } }},{gender:"ស្រី"} ]}); 
            let totalDeltaIn = await PersonalInfo.countDocuments({$and:[ {hospitalizations: { $elemMatch: { hospitalInfo: hospitalInfo } }},
                {hospitalizations: { $elemMatch: { covidVariant:"DELTA"} }} ]} )
             


            let totalOutToday = await PersonalInfo.countDocuments(
                {$and:[ {hospitalizations: { $elemMatch: { hospitalInfo: hospitalInfo } }},{ hospitalizations: { $elemMatch: { date_out: {$gte:today,$lt:tomorrow}}}} ]} ) 
            let totalOutTodayWomen = await PersonalInfo.countDocuments(
                    {$and:[ {hospitalizations: { $elemMatch: { hospitalInfo: hospitalInfo } }},{ hospitalizations: { $elemMatch: { date_out: {$gte:today,$lt:tomorrow}}}},{gender:"ស្រី"} ]} ) 

            let totalOut = await PersonalInfo.countDocuments({$and:[ {hospitalizations: { $elemMatch: { hospitalInfo: hospitalInfo } }},
                { hospitalizations: { $elemMatch: { date_out: {$ne:null}}}},{ hospitalizations: { $elemMatch: { date_out: {$lt: new Date(new Date().setUTCHours(0,0,0,0))}}}}, ]} );

            let totalOutWomen = await PersonalInfo.countDocuments({$and:[ {hospitalizations: { $elemMatch: { hospitalInfo: hospitalInfo } }},{gender:"ស្រី"},
                    { hospitalizations: { $elemMatch: { date_out: {$ne:null}}}},{ hospitalizations: { $elemMatch: { date_out: {$lt: new Date(new Date().setUTCHours(0,0,0,0))}}}},]});
            let totalOutDelta = await PersonalInfo.countDocuments({$and:[ {hospitalizations: { $elemMatch: { hospitalInfo: hospitalInfo } }}, {hospitalizations: { $elemMatch: { covidVariant:"DELTA"} }},
                    { hospitalizations: { $elemMatch: { date_out: {$ne:null}}}},{ hospitalizations: { $elemMatch: { date_out: {$lt: new Date(new Date().setUTCHours(0,0,0,0))}}}},]});

         return {
             totalIn,
             totalInToday,
             totalOut,
             totalOutToday,
             totalDeltaIn:totalDeltaIn,
             totalInWomen:totalInWomen,
             totalInTodayWomen:totalInTodayWomen,
             totalOutWomen:totalOutWomen,
             totalOutTodayWomen:totalOutTodayWomen ,
             totalOutDelta:totalOutDelta
  
         }
     
        },
        

        //@Desc hospital location 
        //@access private 
        //

        allHospitalInfos:async(_,{},{HospitalInfo})=>{
           
            const Hospitalizations = await HospitalInfo.find({});
            return Hospitalizations;
        },
        //@Desc Getting all Hospitalizations  with pagination 
        //@access auth
        getHospitalInfoWithPagination:async(_,{page,limit,keyword},{HospitalInfo})=>{
            const options = {
                page: page || 1,
                limit: limit || 10,
                customLabels: HospitalInfoLabels,
                sort: {
                  createdAt: -1,
                },
                // populate: "customer",
              };

              let query = {
                $or: [
                  { hospitalName: { $regex: keyword, $options: "i" } },
                  { village: { $regex: keyword, $options: "i" } },
                  { commune: { $regex: keyword, $options: "i" } },
                  { disctrict: { $regex: keyword, $options: "i" } },
                  { province: { $regex: keyword, $options: "i" } },
                ],
              };
              const hospitalInfos = await HospitalInfo.paginate(query, options);
              return hospitalInfos;
        },

        //@Desc getting the Hospitalization by id
        //@access auth

        getHospitalInfoById:async(_ ,{id},{HospitalInfo})=>{
            const hospitalInfos = await HospitalInfo.findById(id);
            return hospitalInfos
        },
    },
    Mutation:{
        //@Desc create new Hospitalization
        //@access auth
        createHospitalInfo:async(_,{newHospitalInfo},{HospitalInfo})=>{
            try {
                
                const isExisted = await HospitalInfo.findOne({hospitalName:newHospitalInfo.hospitalName});
                if(isExisted){
                    return{
                        message:"The hospital with this name is already exist",
                        success: false
                    }
                }
                const hospitalizations = new HospitalInfo(newHospitalInfo);
                const isCreated = await hospitalizations.save();
                if(!isCreated){
                    return {
                        message:"Cannot create HopitalInfo",
                        success: false,
                        hospitalInfos:null
                    }
                }
                return {
                    message:"HopitalInfo created successfully!",
                    success: true,
                    hospitalInfos:isCreated
                }
            } catch (error) {
                return {
                    message:"មិន​អាចបង្កើតទេ សូមទាក់ទង admin" ,
                    success: false,
                    hospitalInfos:null
                }
            }
        },


       
        //@Desc delete the Hospitalization
        //@access admin 

        deleteHospitalInfo:async(_,{id},{HospitalInfo})=>{
     
            
        
            try {
                const deletedHos = await HospitalInfo.findByIdAndDelete(id);

                if(!deletedHos){
                    return {
                        success: false,
                        message: "cannot delete this record"
                    }
                }
                return {
                    success: true,
                    message: "Hospitalization deleted successfully"
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

        updateHospitalInfo:async(_,{id,updatedHospitalInfo},{HospitalInfo})=>{
            try {
                const isUpdated = await HospitalInfo.findByIdAndUpdate(id,updatedHospitalInfo);
                if(!isUpdated){
                    return {
                        success: false,
                        message: "Hospital Info updated not successfully"
                    }
                }            
                return {
                    success: true,
                    message: "Hospital Info updated successfully !"
                }

            } catch (error) {
                return {
                    success: false,
                    message: "cannot update the Hospital Info please contact the admin"
                }
            }
        }
    }
}





