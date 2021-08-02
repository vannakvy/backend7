import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2'

const QuarantineInfoSchema = mongoose.Schema({
    locationName:String,
    village:String,
    commune: String,
    district: String,
    province:String,
    long: Number,
    lat: Number,
    other:String,
    capacity:{type:Number,required:true,default:0},
    locationType:String,
    //ប្រភេទ ពលករ​ សហគមន៍
    forPeopleType:String,
    personInCharge:{
        firstName:String,
        lastName:String,
        position:String,
        others:String,
        tel:String,
    },
},{
    timestamps: true
})

QuarantineInfoSchema.plugin(Paginate)
const QuarantineInfo = mongoose.model("QuarantineInfo",QuarantineInfoSchema)

export default QuarantineInfo