import { User } from "../models/user.model.js";
import { Documentmodel } from "../models/Documents.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { Backup } from "../models/Backup.model.js";

const registerUser=async (req,res)=>
{   
    try {
        let AvatarPath;
        if(req?.body)
        {
            if(req?.body?.Avatar.substr(-3).trim() === "png")
            {
                AvatarPath = req?.body?.Avatar;
            }
            else
            {
                const path = await uploadOnCloudinary(req?.body?.Avatar); 
                AvatarPath = path?.url
            }

            const userData = {"username":req?.body?.username,"email":req?.body?.email,"socketId":req?.body?.socketId,"Avatar":AvatarPath}

            const user = await User.find({"email":req?.body?.email});
            
            if(user.length > 0)
            {
                await User.updateOne({"email":req?.body?.email},userData);
                res
                .status(200)
                .json({"message":"Updated"})
            }

            if(req?.body && user.length<=0)
            {
                await User.create(userData);
                res
                .status(200)
                .json({"message":"created"})
            }
        }
        else
        {
            res.status(200).json({"message":"ok"})
        }
    } catch (error) {
        console.log(error);
        // throw new ApiError(500,"Something Wrong in Login");
    }
}

const EmptySocketId = async (req,res) => 
{
    try {
        const user = await User.find({"email":req?.body?.email});
        
        if(user.length > 0)
        {
            await User.updateOne({"email":req?.body?.email},{$set:{socketId:""}});
            res
            .status(200)
            .json({"message":"Updated"});
        }
        else
        {
            res
            .status(200)
            .json("User Not Found");
        }

    } catch (error) {
        throw new ApiError(500,"Something Wrong Empty Socket Id");
    }
}

const getAllUser = async (req,res) =>
{
    try {
        const user = await User.find();
        res.status(200)
        .json(user)
    } catch (error) {
        throw new ApiError(500,"Something Wrong in get all User");
    }
}

const getAllDocuments = async (req,res) =>
{
    try {
        const Document = await Documentmodel.find();
        res.status(200)
        .json(Document)
    } catch (error) {
        console.log(error);
        // throw new ApiError(500,"Something Wrong in getDocument");
    }
}

const deleteDocument = async (req,res) =>
{
    try {
        const Document = await Documentmodel.deleteOne({_id:req.body.id});
        res.status(200)
        .json(Document)
    } catch (error) {
        throw new ApiError(500,"Something Wrong in getDocument");
    }
}

const getAllHistory = async (req,res) =>
{
    try {
        const backup = await Backup.find();
        res.status(200)
        .json(backup)
    } catch (error) {
        throw new ApiError(500,"Something Wrong in getDocument");
    }
}

export {
    registerUser,
    EmptySocketId,
    getAllUser,
    getAllDocuments,
    deleteDocument,
    getAllHistory
}