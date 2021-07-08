

import mongoose from "mongoose";
import Paginate from 'mongoose-paginate-v2';

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId,required: true,ref: "customer"},
    orderItems: [
      {
        name:String,
        qty:{type:Number,required:true,default:0},
        productImage:String,
        category:String,
        salePrice:{type: Number,required:true,default:0},
        product: {type: mongoose.Schema.Types.ObjectId,required: String,ref: "product"},
      },
    ],
    paymentMethod: {type: String,required: true},
    taxPrice:{type:Number,required: true,default:0},
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice:{type:Number,required: true,default:0},
    orderConfirmed: {type:Boolean,  default:false},
    orderConfirmedAt: {type:Date,default:null},
    isPaid: {type:Boolean, required:true,default: false},
    paidAt: {type:Date,default:null},
    isDelivered: {type:Boolean, required:true, default:false},
    deliveredAt: {type:Date,default:null},
    shippingAddress:{
      address:String,
      long:{type:Number, required: true,default:0},
      lat:{type:Number, required: true,default:0},
      tel:Number,
      email:String,
    }
  },
  {
    timestamps: true,
  }
);

// const removeQtyFromProduct=(data)=>{
// data.forEach( async(data)=>{
//  await  Product.findByIdAndUpdate({_id: data.product.toString()}, {$inc: { countInStock: -data.qty} }, {new: false, upsert: true});
// })
// }
// orderSchema.pre('save', async function(next) {
//  await removeQtyFromProduct(this.orderItems)
// next()
// });

// entitySchema.pre('save', function(next) {
//   var doc = this;
//   counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, function(error, counter)   {
//       if(error)
//           return next(error);
//       doc.testvalue = counter.seq;
//       next();
//   });
// });


orderSchema.plugin(Paginate)
const Order = mongoose.model("order",orderSchema)

export default Order;