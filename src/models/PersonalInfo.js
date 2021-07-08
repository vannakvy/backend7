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
    ocupation:String,
    idCard:String,
    profileImg:String,
    village:String,
    commune:String,
    disctrict:String,
    province:String,
    long:Number,
    lat:Number,
    relapse:Boolean,
    relapseAt:Date,
    vacinated:Number,
    history:[
        {
            positive:Boolean,
            positiveAt:Date,
            death:Boolean,
            deathAt:Date,
            recovered:Boolean,
            recoveredAt:Date,
            hospitalization:{
                type:mongoose.Schema.Types.ObjectId,
                ref: 'hospitalizations'
            },
        
            quarantine:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'quarantines'
            },
        
            case:{
                direct: {
                    type: Boolean,
                    required: true,
                    default: false
                },
                caseID:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'cases'
                }
            },

            relations:[{
                personalInfo:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'personalInfo'
                }
            }]

        }
    ]

},{
    timestamps: true
})

const PersonalInfo = mongoose.model("PersonalInfo",PersonalInfoShema);
export default PersonalInfo;