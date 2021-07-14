import {
    model,
    Schema
} from 'mongoose';
import Paginate from 'mongoose-paginate-v2';
const roleSchema = Schema({
    role:{
        type: String,
         enum:['BASIC','ADMIN','SUPPER','ACCOUNTANT','MARTMANAGER','CEO'], 
         default:'BASIC'},
    
})

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
    ]
}, {
    timestamps: true
});


UserSchema.plugin(Paginate)


const User = model('users', UserSchema);

export default User;