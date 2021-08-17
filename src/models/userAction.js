import mongoose from "mongoose";
import Paginate from "mongoose-paginate-v2";

const UserActionSchema = mongoose.Schema(
  {
userId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
},
date:Date,
action:{
  type:String,
  default:""
},
log:{
  type:String,
  default:""
},
userName:String,
  },
  { timestamps: true }
);

UserActionSchema.plugin(Paginate);
const UserAction = mongoose.model(
  "UserAction",
  UserActionSchema
);

export default UserAction;
