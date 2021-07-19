import mongoose from 'mongoose' 
import Paginate from 'mongoose-paginate-v2'

const CaseSchema = mongoose.Schema({
        caseName:String,
        village:String,
        commune:String,
        district:String,
        province:String,
        date:Date,
        long:Number,
        lat:Number,
        other:String
},{timestamps: true}) 

CaseSchema.plugin(Paginate)
const Case = mongoose.model("Case",CaseSchema);


export default Case;