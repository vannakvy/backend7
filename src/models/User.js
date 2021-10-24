import {
    model,
    Schema
} from 'mongoose';
import Paginate from 'mongoose-paginate-v2';
const roleSchema = Schema({
    role:{
        type: String,
         default:'BASIC',
         enum:["BASIC","SUPPER","DEVELOPER",
                                "ADMIN",
                                "DOCTOR",
                                "OFFICER",
                                "POLICE",
                                "QUARANTINECONTROLLER",
                                "DELETE_TRANSACTION",
                                "CREATE_TRANSACTION",
                                "UPDATE_TRANSACTION",
                                "CREATE_SHOP",
                                "DELETE_SHOP",
                                "UPDATE_SHOP",
                                "CREATE_PERSONALINFO",
                                "UPDATE_PERSONALINFO",
                                "DELETE_PERSONALINFO",
                                "PRINT_QRCODE",
                                "VIEW_SHOP_DETAIL",
                                "VIEW_BUYER_DETAIL",
                                "VIEW_ALL_SHOP",
                                "VIEW_SELLER",
                                "VIEW_BUYER",
                                "VIEW_ONE_SHOP",
                                "SHOP",
                                "SELLER"]
                            },
    
})

const pageSchema = Schema({
   page:String})

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    tel: String,
    
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true,
        default:"profile.png"
    },
    roles:[
        roleSchema
    ],
    pages:[
        pageSchema
    ]
}, {
    timestamps: true
});

UserSchema.plugin(Paginate)
const User = model('users', UserSchema);

export default User;