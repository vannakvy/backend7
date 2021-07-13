import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2' 

const HospitalizationSchema = mongoose.Schema({
  
    citizens:[
        {
            startDate:Date,
            endDate:Date,
            citizentId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "personalInfo",
                required: true
            }
        }
    ]
},{timestamps:true})

HospitalizationSchema.plugin(Paginate)
const Hospitalization = mongoose.model("Hospitalization",HospitalizationSchema)

export default Hospitalization;