import mongoose from 'mongoose';
import Paginage from 'mongoose-paginate-v2';


const transactionSchema = new mongoose.Schema({
    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
    personalInfoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PersonalInfo"
    },
 
},{
    timestamps:true
});

transactionSchema.plugin(Paginage);

const Transaction = mongoose.model("Transaction",transactionSchema);

export default Transaction;