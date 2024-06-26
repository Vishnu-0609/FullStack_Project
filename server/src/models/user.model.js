import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    socketId:{
        type:String
    },
    Avatar:{
        type:String
    }
},{timestamps:true});

// userSchema.pre("save", async function (next) {
//     if(!this.isModified("password")) return next();

//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// })

// userSchema.methods.isPasswordCorrect=async function(password)
// {
//     return await bcrypt.compare(password,this.password)
// }

export const User=mongoose.model("User",userSchema);