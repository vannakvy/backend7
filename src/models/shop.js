import mongoose from "mongoose";
import Paginate from "mongoose-paginate-v2";

const shopSchema = mongoose.Schema(
  {
    name: String,
    registrationNumber: String,
    acknowledgeAs: String,
    registerDate: Date,
    village: String,
    commune: String,
    district: String,
    province: String,
    firstName: String,
    lastName: String,
    personalInfoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonalInfo",
    },
  },
  {
    timestamps: true,
  }
);

shopSchema.plugin(Paginate);

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
