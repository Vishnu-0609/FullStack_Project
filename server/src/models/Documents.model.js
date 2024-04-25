import { Schema,model } from "mongoose";

const Document = new Schema({
    _id:String,
    data:Object,
    name:String,
})

export const Documentmodel = model("Document",Document);