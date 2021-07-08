import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {error, success} from 'consola'
import {DB} from './index.js'

dotenv.config()

const connectDB =   async()=>{
    try{
        const conn =  await mongoose.connect(DB,{useFindAndModify: false,useUnifiedTopology:true,useNewUrlParser: true,useCreateIndex: true })
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


