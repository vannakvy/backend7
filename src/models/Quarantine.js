import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2';

const QuarantineSchema = mongoose.Schema({
    citizens:[
        {
            startDate:Date,
            endDate:Date,
            personalInfo:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "citizens",
                required: true
            }
        }
    ]
},{timestamps:true})

QuarantineSchema.plugin(Paginate)
const Quarantine = mongoose.model("Quantine",QuarantineSchema)

export default Quarantine;
