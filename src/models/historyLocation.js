import mongoose from 'mongoose' 

const HistoryLocationSchema = mongoose.Schema({
    case:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Case"
    },
    personalInfo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"PersonalInfo"
    },
    affectedLocationId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"AffectedLocation"
    },
    type:String,
    date:Date,
    other:String
},{timestamps: true}) 

const HistoryLocation = mongoose.model("HistoryLocation",HistoryLocationSchema);
export default HistoryLocation;