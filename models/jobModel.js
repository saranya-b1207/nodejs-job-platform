import mongoose from "mongoose";
const jobSchema=new mongoose.Schema({
    company:{
        type:String,
        required:[true,"Company name is required"]
},
position:{
    type:String,
    required:[true,"Job Position is required"],
    maxlength:100,
},
status:{
    type:String,
    required:['Pending','Reject','Interview'],
    default:'Pending',
},
workType:{
    type:String,
    required:['Full-time','Part-time','Intership','Contract'],
    default:"Full-time",
},
workLocation:{
    type:String,
    required:[true,'Work location required'],
    default:"India",
},
createdBy:{
    type:mongoose.Types.ObjectId,
    ref:'User',
},

},{timestamps:true});

export default mongoose.model('Job',jobSchema);