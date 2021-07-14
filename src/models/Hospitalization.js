import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2'

const HospitalizationSchema = mongoose.Schema({
    in:{type:Boolean,required: true, default:true},
   date_in: {type: Date, required: true,default:new Date()},
   out:{type:Boolean,required: true, default:false},
   date_out: {type: Date},
   out_status:String,
   personalInfo:{type:mongoose.Schema.Types.ObjectId,ref:'PersonalInfo'},
   hospitalInfo:{type:mongoose.Schema.Types.ObjectId,ref:'HospitalInfo'},
   sampleTest:[{
    date: {type: Date, required: true,default:new Date()},
    times:{type: Number, required: true,default:0},
    location:String,
    result:{type:Boolean,required: true, default:false},
    symptom:String,
    other:String,
   }],
   others:String,
})

HospitalizationSchema.plugin(Paginate) 

const Hospitalization = mongoose.model("Hospitalization",HospitalizationSchema)

export default Hospitalization