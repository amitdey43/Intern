import mongoose from "mongoose";

let umChatSchema= new mongoose.Schema({
    senderRef: {
        type: String,
        enum: ["User", "Mentor"],
        required: true
    },
    senderSide: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "senderRef",
        required: true
    },
    receiverRef: {
        type: String,
        enum: ["User", "Mentor"],
        required: true
    },
    receiverSide: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "receiverRef",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }

});

export const umChatModel= mongoose.model("Umchat",umChatSchema);