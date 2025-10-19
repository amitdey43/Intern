import mongoose from "mongoose";

let uhSchema= new mongoose.Schema({
      internship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Internship",
        required: true
      },
      status: {
        type: String,
        enum: ["pending", "shortlisted", "rejected", "accepted"], 
        default: "pending"
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      hr: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HR",
      },
      interviewtime:{
        type:Date,
        default:null
      }
},{timestamps:true})


export const uhModel = mongoose.model("UH",uhSchema);