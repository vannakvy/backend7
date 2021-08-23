import mongoose from "mongoose";
import Paginate from "mongoose-paginate-v2";

const AdditionalTwoSchema = mongoose.Schema(
  {
    times:String,
    affectedLocation: Number, 
    newAffectedLocation: Number,
    notClosedLocation: Number,
    newNotClosedLocation: Number,

    closedLocation: Number,
    newClosedLocation: Number,

    openedLocation: Number, 
    newOpenLocation: Number, 

    notCoorporateLocation: Number,
    newNotCoorporateLocation: Number,

    totalInterviewed: Number, 
    reachedPatientForInterview: Number, 

    interviewChinese: Number, 
    interviewChineseWomen: Number,
    interviewChineseToday:Number,

    interViewCambodian: Number, 
    interViewCambodianToday:Number,
    interViewCambodianWomen: Number,

    interviewAndAdviceAffectedPeople: Number, 
    interviewAndAdviceAffectedPeopleWomen: Number,
    foundTotalAffectedLocation: Number, 
    fullFoundTotalAffectedLocation: Number,
    
    totalSampleTestLocation: Number,
    totalSampleTest: Number,
    totalSampleTestWomen: Number,
  },
  { timestamps: true }
);

AdditionalTwoSchema.plugin(Paginate);
const AdditionalTwo = mongoose.model(
  "AdditionalTwo",
  AdditionalTwoSchema
);

export default AdditionalTwo;
