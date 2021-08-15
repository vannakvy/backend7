import mongoose from "mongoose";
import Paginate from "mongoose-paginate-v2";

const UserActionSchema = mongoose.Schema(
  {
    locationName: String,
    locationType:String,
    village: String,
    commune: String,
    district: String,
    province: String,
    other: String,
    openAt: {
      type: Date,
      default: null,
    },
    closeAt: {
      type: Date,
      default: null,
    },
    long: Number,
    lat: Number,
    coorporate: {
      type: Boolean,
      default: true,
    },
    infected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserActionSchema.plugin(Paginate);
const UserAction = mongoose.model(
  "UserAction",
  UserActionSchema
);

export default UserAction;
