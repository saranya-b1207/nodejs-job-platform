import mongoose from 'mongoose';
import colors from 'colors';

const connectDB=async()=>{
  try{
const conn=await mongoose.connect(process.env.MONG0_LOCAL_URL);
console.log(`Connected to Mongodb Database ${mongoose.connection.host}`.bgCyan.white);
  }
  catch(error){
    console.log(`Mongodb in error ${error}`.bgBlue.white);
  }
};
export default connectDB;