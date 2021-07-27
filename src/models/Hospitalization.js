import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2'

const HospitalizationSchema = mongoose.Schema({
   date_in: {type: Date, required: true,default:new Date()},
   date_out: {type: Date,default:null},
   personalInfo:{type:mongoose.Schema.Types.ObjectId,ref:'PersonalInfo'},
   hospitalInfo:{type:mongoose.Schema.Types.ObjectId,ref:'HospitalInfo'},
   others:{
    type:String,
    default:"",
},
})

HospitalizationSchema.plugin(Paginate) 
const Hospitalization = mongoose.model("Hospitalization",HospitalizationSchema)

export default Hospitalization