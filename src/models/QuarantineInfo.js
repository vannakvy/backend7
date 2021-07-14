import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2'

const QuarantineInfoSchema = mongoose.Schema({
    locationName:String,
    village:String,
    commune: String,
    district: String,
    province:String,
    personInchage:String,
    long: Number,
    Lat: Number,
    other:String,
    capacity:{type:Number,required:true,default:0},
    personInCharge:{
        name:String,
        position:String,
        tel:String
    },
},{
    timestamps: true
})

QuarantineInfoSchema.plugin(Paginate)

const QuarantineInfo = mongoose.model("QuarantineInfo",QuarantineInfoSchema)

export default QuarantineInfo