import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2'
//dddd

const PersonalInfoShema = mongoose.Schema({
    firstName:String,
    lastName:String,
    age:Number,
    gender:String,
    tel:String,
    nationality:String,
    occupation:String,
    idCard:String,
    profileImg:String,
    village:String,
    commune:String,
    district:String,
    province:String,
    other:String,
    relapse:Boolean,
    relapseAt:Date,
    vaccinated:{
        type:Number,
        default:0
    },
    sampleTest:[{
        date: {type: Date, required: true,default:new Date()},
        times:{type: Number, required: true,default:0},
        location:String,
        result:{type:Boolean,required: true, default:false},
        symptom:String,
        other:{
            type:String,
            default:"",
        },
       }],
    direct: {
        type: Boolean,
        required: true,
        default: false
    },
    case:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case'
    },
    currentState:{
        confirm:{
            type:Boolean,
            default: false
        },
        confirmedAt:Date,
        recovered:{
            type:Boolean,
            default: false
        }
        ,
        recoveredAt:Date,
        death:{
            type:Boolean,
            default: false
        },
        deathAt:Date
    }
},{
    timestamps: true
})


PersonalInfoShema.plugin(Paginate)

const PersonalInfo = mongoose.model("PersonalInfo",PersonalInfoShema);

export default PersonalInfo;