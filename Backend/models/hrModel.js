import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt"
import crypto from "crypto"

let hrSchema= new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Name is required"],
        trim:true,
        minLength: [3,"Name should contain atleast 3 character"],
    },
    email: {
        type: String,
        required: [true,"Student email is required"],
        trim:true,
        lowercase:true,
        validate: [validator.isEmail, "please enter valid email"],
        unique: true 
    },
    password:{
        type: String,
        required: [true,"Please enter your password"],
        minLength: [6, "Password should be contain more than 6 character"],
        select: false,
    },
    companyName: { 
        type: String,
        required: [true,"Please enter your Company Name"],
    },
    companyWebsite: { 
        type: String 
    },
    designation: { 
        type: String,
        required: [true,"Please enter your Designation"],
    },
    department: { 
        type: String,
        required: [true,"Please enter your Department"],
    },
    industryType: { 
        type: String,
        required: [true,"Please enter Industry type"],
    },
    officeLocation: { 
        type: String,
        required: [true,"Please enter your office location"],
    },
    internshipsPosted: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Internship" 
        }
    ],
    shortlistedCandidates: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }
    ],
    approvedCandidates: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        }
    ],
    role: { 
        type: String, 
        default: "HR",
        enum: ["Student","Mentor","HR"]  
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
},{timestamps:true})

hrSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password= await bcrypt.hash(this.password,10);
})
hrSchema.methods.getJWTToken= function(){
    return jwt.sign({id:this._id,role:this.role},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}
hrSchema.methods.verifyPassword= async function(oldpassword){
    return await bcrypt.compare(oldpassword,this.password)
}

hrSchema.methods.generateResetPasswordToken= function(){
    let resetToken= crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken= crypto.createHash("sha256").update(resetToken).digest('hex');
    this.resetPasswordExpire= new Date(Date.now()+30*60*1000)
    return resetToken;
}
export const hrModel = mongoose.model("HR",hrSchema);