import mongoose from 'mongoose' 
import Paginate from 'mongoose-paginate-v2'

const AffectedLocationSchema = mongoose.Schema({
    affectedLocationName:String,
    village:String,
    commune:String,
    district:String,
    province:String,
    other:String,
    open:Boolean,
    openAt:Date,
    closeAt:Date,
    long:Number,
    lat:Number,
    coorporate:{
        type:Boolean,
        default:true
    },
    infected:{
        type:Boolean,
        default:false
    },
},{timestamps: true}) 

AffectedLocationSchema.plugin(Paginate)
const AffectedLocation = mongoose.model("AffectedLocation",AffectedLocationSchema);


export default AffectedLocation;