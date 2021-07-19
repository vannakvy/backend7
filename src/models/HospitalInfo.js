import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2'

const HospitalInfoSchema = mongoose.Schema({
    hospitalName:String,
    village:String,
    commune: String,
    district: String,
    province:String,
    personInchage:String,
    long: Number,
    lat: Number,
    other:String,
    personInCharge:{
        firstName:String,
        lastName:String,
        position:String,
        others:String,
        tel:String
    },
})

HospitalInfoSchema.plugin(Paginate) 

const HospitalInfo = mongoose.model("HospitalInfo",HospitalInfoSchema)

export default HospitalInfo