import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2'
//dddd

const PersonalInfoShema = mongoose.Schema({
    patientId:String,
    firstName:String,
    lastName:String,
    englishName:String,
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
    dob:Date,
    other:String,
    relapse:{
        type: Boolean,
        default:false,
    },
    relapseAt:Date,
  
    travelOverCountryHistory:{
        arriveDate:Date,
        fromCountry:String,
        reasonForComing:String,
        leavingDate:Date,
        toCountry:String,
    },
    interviewed:{
        type: Boolean,
        default: false
    },
    interviewedAt:Date,
    vaccinated:{
        type:Number,
        default:0
    },
    //ជំងឺប្រចាំកាយ
    chronic:String,
    sampleTest:[{
        specimentType:String,
        reasonForTesting:String,
        date: {type: Date, required: true,default:new Date()},
        times:{type: Number, required: true,default:0},
        Testlocation:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'AffectedLocation'
        },
        result:{type:Boolean,required: true, default:false},
        symptom:String,
        symptomStart:Date,
        labFormCompletedBy:String,
        laboratory:String,
        other:{
            type:String,
            default:"",
        },
       }],
     
       historyWithin14days:[{
        locationName:String,
        affectedLocation:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'AffectedLocation'
        },
        date:Date,
        description:String,
        direct:{
            type:Boolean,
            default: false
        }
       }],
    
       quaranting:[
           {
        coorporate:{
            type:Boolean,
            default:true,
        },
        date_in:Date,
        date_out:Date,
        personTypes:String,
        out_status:String,
        quarantineInfo:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuarantineInfo'
        },
       
       }],    
   

    affectedFrom:{
        patientId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'PersonalInfo'
        },
        relation:String,
        direct: {
            type:Boolean,
            default:true
        },
        ohter:String
    },
    hospitalization:[{
        date_in:Date,
        date_out:Date,
        hospitalName:String,
        hospitalInfo:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"HospitalInfo"
        },
        covidVarariant:String,
        coorporate:{
            type:Boolean,
            default:true
        },
        description:String
    }],
    currentStatus:{
        confirm:{
            type:Boolean,
            default: false
        },
        confirmedAt:Date,
        recovered:{
            type:Boolean,
            default: false
        } ,
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