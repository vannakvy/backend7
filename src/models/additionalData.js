import mongoose from "mongoose";
import Paginate from "mongoose-paginate-v2";

const AdditionalSchema = mongoose.Schema(
  {
    district: String,
    positive:Number,
    positiveWomen:Number,

    hospitalizing:Number,
    hospitalizingWomen:Number,

    death:Number,
    deathWomen:Number,

    recover:Number,
    recoverWomen:Number,

    sampleTest:Number,
    sampleTestWomen:Number,

    affected:Number,
    affectedWomen:Number,
  },
  { timestamps: true }
);

AdditionalSchema.plugin(Paginate);
const Additional = mongoose.model(
  "Additional",
  AdditionalSchema
);

export default Additional;
