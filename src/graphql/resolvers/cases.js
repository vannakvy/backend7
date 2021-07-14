
const CaseLabels = {
    docs: "cases",
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

        //@Desc getting all the cases
        //@access private 
        //


        allCases:async(_,{},{Case})=>{
            const cases = await Case.find({});
            console.log(cases);
            return cases;
        },
        //@Desc Getting all cases  with pagination 
        //@access auth
        getCaseWithPagination:async(_,{page,limit,keyword},{Case})=>{
            const options = {
                page: page || 1,
                limit: limit || 10,
                customLabels: CaseLabels,
                sort: {
                  createdAt: -1,
                },
                // populate: "customer",
              };

              let query = {
                $or: [
                 
                  { village: { $regex: keyword, $options: "i" } },
                  { commune: { $regex: keyword, $options: "i" } },
                  { disctrict: { $regex: keyword, $options: "i" } },
                  { province: { $regex: keyword, $options: "i" } },
                ],
              };

              const cases = await Case.paginate(query, options);
              return cases;
        },
        //@Desc getting the Case by id
        //@access auth

        getCaseById:async(_  ,{id},{Case})=>{
            const cases = await Case.findById(id);
            return cases
        },
    },
    Mutation:{

        //@Desc create new case
        //@access auth
        createCase:async(_,{newCase},{Case})=>{
            try {
                const isExisted = await Case.findOne({caseName:newCase.caseName});
                if(isExisted){
                    return{
                        message:"The case with this name is already exist",
                        success: false
                    }
                }
                const cases = new Case(newCase);
                const isCreated = await cases.save();
                if(!isCreated){
                    return {
                        message:"Cannot create case",
                        success: false
                    }
                }
                return {
                    message:"case created successfully!",
                    success: true
                }
            } catch (error) {
                return {
                    message:"Cannot create case Please contact the admin",
                    success: false
                }
            }
        },

        //@Desc delete the case
        //@access admin

        deleteCase:async(_,{id},{Case})=>{
            try {
                const deletedInfo = await Case.findByIdAndDelete(id);

                console.log(deletedInfo)
                if(!deletedInfo){
                    return {
                        success: false,
                        message: "cannot delete this record"
                    }
                }
                return {
                    success: true,
                    message: "Case deleted successfully"
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

        updateCase:async(_,{id,updatedCase},{Case})=>{
            try {
                const isUpdated = await Case.findByIdAndUpdate(id,updatedCase);
                if(!isUpdated){
                    return {
                        success: false,
                        message: "Case updated not successfully"
                    }
                }
                console.log(isUpdated)
                return {
                    success: true,
                    message: "case updated successfully !"
                }

            } catch (error) {
                return {
                    success: false,
                    message: "cannot update the case please contact the admin"
                }
            }
        }

    }
}



