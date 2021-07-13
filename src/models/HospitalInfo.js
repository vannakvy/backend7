import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2'

const HospitalInfoSchema = mongoose.Schema({
    hostpitalName:String,
    village:String,
    commune: String,
    district: String,
    province:String,
    personInchage:String,
    long: Number,
    Lat: Number,
    handler:{
        firstName:String,
        lastName:String,
        position:String,
        other:String,
        tel:String
    },
})

HospitalInfoSchema.plugin(Paginate) 

const HospitalInfo = mongoose.model("HospitalInfo",HospitalInfoSchema)

export default HospitalInfo