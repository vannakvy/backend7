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


    vaccination:[{
        times:{
            type:Number,
            default:0
        },
        date:Date,
        vaccineType:String,
        vacinatedAt:String,
    }],
    //ជំងឺប្រចាំកាយ
    chronic:String,
    sampleTest:[{
        covidVariant:String,
        specimentType:String,
        reasonForTesting:String,
        date: {type: Date, required: true,default:new Date()},
        times:{type: Number, required: true,default:0},
        testLocation:String,
        result:{type:Boolean,required: true, default:false},
        resultDate:Date,
        symptom:String,
        symptomStart:Date,
        labFormCompletedBy:String,
        laboratory:String,
        testType:String,
        other:{
            type:String,
            default:"",
        },
       }],
       historyWithin14days:[{
        lat:Number,
        long:Number,
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
        locationType:String,
        date_in:Date,
        date_out:Date,
        personTypes:String,
        out_status:String,
        quarantineInfo:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuarantineInfo'
        },
        long:Number,
        lat:Number,
        locationName:String
       
       }],    
    affectedFrom:{
        date:Date,
        patientName:String,
        patientCode:String,
        relation:String,
        direct: {
            type:Boolean,
            default:true
        },
        otherAffect:String
    },
    hospitalization:[{
        long:Number,
        lat:Number,
        hospitalName:String,
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
    currentState:{
        covidVariant:String,
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

