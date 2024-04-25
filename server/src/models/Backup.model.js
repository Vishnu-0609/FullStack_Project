import mongoose from "mongoose";

const backupSchema=new mongoose.Schema({
    email:String,
},{timestamps:true});

export const Backup=mongoose.model("Backup",backupSchema);