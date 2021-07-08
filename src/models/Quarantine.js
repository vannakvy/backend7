import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2';

const QuarantineSchema = mongoose.Schema({
    locationName:String,
    village:String,
    commune: String,
    district: String,
    province:String,
    personInchage:String,
    long: Number,
    Lat: Number,
    citizens:[
        {
            startDate:Date,
            endDate:Date,
            // citizentId:{
            //     type: mongoose.Schema.Types.ObjectId,
            //     ref: "citizens",
            //     required: true
            // }
        }
    ]
},{timestamps:true})

QuarantineSchema.plugin(Paginate)
const Quarantine = mongoose.model("Quantine",QuarantineSchema)

export default Quarantine;
