import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {error, success} from 'consola'
import {DB,IN_PROD} from './index.js'

dotenv.config()
const DB_URI = IN_PROD? "mongodb://192.168.1.152:27017/backupdata" : DB
console.log(DB_URI)
const connectDB =   async()=>{
    try{
        const conn =  await mongoose.connect(DB_URI,{useFindAndModify: false,useUnifiedTopology:true,useNewUrlParser: true,useCreateIndex: true })
        success({
            badge: true,
            message: `Successfully connected with the database ${conn.connection}`,
          });
    }catch(err){
        error({
            badge: true,
            message: err.message,
          });
    }
}

export default connectDB;


