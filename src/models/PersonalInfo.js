import mongoose from 'mongoose'
import Paginate from 'mongoose-paginate-v2'
//dddd

const PersonalInfoShema = mongoose.Schema({
    // 
    reasonForTestingOther:String,
    //
    social:String,
    workplaceInfo:String,
    totalCoworker:Number,
   //police update
    carPlateNumber: String,
    driverName:String,
    from :String,
    to: String, 
    // 
    currentAddress:String,
    pob:String,

    souceOfSuspect:String,
    recievedLabFormAt:Date,
    officerId:String,
    updateAt:Date,
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
    interviewStatus:String,
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
        formFillerName:String,
        covidVariant:String,
        specimentType:String,
        reasonForTesting:String,
        date: {type: Date, required: true,default:new Date()},
        times:{type: Number, required: true,default:0},
        testLocation:{type:String,
        default:""},
        result:{type:Boolean,required: true, default:false},
        resultDate:Date,
        symptom:String,
        symptomStart:Date,
        labFormCompletedBy:String,
        labFormCompletedByTel:String,
        laboratory:String,
        testType:String,
        formFillerTel:String,
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
        endDate:Date,
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
        roomNumber:String,
        locationType:String,
        date_in:Date,
        date_out:Date,
        personTypes:String,
        totalRoomate:Number,
        out_status:String,
        quarantineInfo:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuarantineInfo'
        },
        long: {
            type:Number,
            default: 102.32
          },
          lat: {
            type:Number,
            default: 104.32
          },
        locationName:String
       }],    
    affectedFrom:{
        riskLevel:String,
        lastTouchAt:Date,
        relationType:String,
        
        affectedDate:Date,
        patientName:String,
        patientCode:String,
        relation:String,
        direct: {
            type:Boolean,
            default:true
        },
        otherAffect:String
    },
    hospitalizations:[{
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
        covidVariant:String,
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

