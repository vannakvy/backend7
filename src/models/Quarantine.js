import mongoose from "mongoose";
import Paginate from "mongoose-paginate-v2";

const QuarantineSchema = mongoose.Schema({
  in: { type: Boolean, required: true, default: true },
  date_in: { type: Date, required: true, default: new Date() },
  personalType: {
    type: String,
    required: true,
    enum: ["សហគមន៍", "តាមផ្លូងអាកាស", "ពលករ"],
    default: "សហគមន៍",
  },
  date_out: { type: Date },
  out_status: String, // die, escape,negative, positive,
  personalInfo: { type: mongoose.Schema.Types.ObjectId, ref: "PersonalInfo" },
  quarantineInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuarantineInfo",
  },
  others: String,
});

QuarantineSchema.plugin(Paginate);

const Quarantine = mongoose.model("Quarantine", QuarantineSchema);

export default Quarantine;

