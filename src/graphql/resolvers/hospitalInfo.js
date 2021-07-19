
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
              console.log(hospitalInfos)
              return hospitalInfos;
        },

        //@Desc getting the Hospitalization by id
        //@access auth

        getHospitalInfoById:async(_  ,{id},{HospitalInfo})=>{
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
                        success: false
                    }
                }
                return {
                    message:"HopitalInfo created successfully!",
                    success: true
                }
            } catch (error) {
                return {
                    message:"មិន​អាចបង្កើតទេ សូមទាក់ទង admin" ,
                    success: false
                }
            }
        },

        //@Desc delete the Hospitalization
        //@access admin 

        deleteHospitalInfo:async(_,{id},{HospitalInfo})=>{
            console.log(HospitalInfo)
        
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





