import mongoose from "mongoose";
import Paginate from "mongoose-paginate-v2";

const AffectedLocationSchema = mongoose.Schema(
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
    long: {
      type:Number,
      default: 102.32
    },
    lat: {
      type:Number,
      default: 104.32
    },
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

AffectedLocationSchema.plugin(Paginate);
const AffectedLocation = mongoose.model(
  "AffectedLocation",
  AffectedLocationSchema
);

export default AffectedLocation;
