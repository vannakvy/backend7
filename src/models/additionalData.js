import mongoose from "mongoose";
import Paginate from "mongoose-paginate-v2";

const AdditionalSchema = mongoose.Schema(
  {
    district: String,
    positive:Number,
    positiveToday:Number,
    positiveWomen:Number,
    positiveWomenToday:Number,

    hospitalizing:Number,
    hospitalizingToday:Number,
    hospitalizingWomen:Number,
    hospitalizingWomenToday:Number,

    death:Number,
    deathWomen:Number,
    deathToday:Number,
    deathWomenToday:Number,

    recover:Number,
    recoverWomen:Number,
    recoverToday:Number,
    recoverWomenToday:Number,

    sampleTest:Number,
    sampleTestWomen:Number,
    sampleTestToday:Number,
    sampleTestWomenToday:Number,

    affected:Number,
    affectedWomen:Number,

    affectedToday:Number,
    affectedWomenToday:Number,
  },
  { timestamps: true }
);

AdditionalSchema.plugin(Paginate);
const Additional = mongoose.model(
  "Additional",
  AdditionalSchema
);

export default Additional;
