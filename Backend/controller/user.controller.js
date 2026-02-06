import asyncHandler from "../utilis/asyncHandler.js";
import { userModel } from "../models/userModel.js";
import sendToken from "../utilis/sendToken.js";
import ApiError from "../utilis/ApiError.js";
import { sendMAil } from "../utilis/sendMail.js";
import crypto from "crypto"
import { internshipModel } from "../models/internShip.js";
import { ApiFunction } from "../utilis/ApiFunction.js";
import { uhModel } from "../models/uhModel.js";
import { mentorModel } from "../models/mentorModel.js";
import { muModel } from "../models/mentorUser.js";

export const createUser = asyncHandler(async (req, res, next) => {
  let body ={ ...req.body };
  let email= body.email;
  const existing = await userModel.findOne({email });
   if (existing) {
     return next(new ApiError(400,"Email already registered"))
   }

  if (body.skills && typeof body.skills=== "string") {
    try {
      body.skills = JSON.parse(body.skills);
    } catch {
      body.skills = body.skills.split(",").map((s) => s.trim());
    }
  }

  if (body.prefferedDomain && typeof body.prefferedDomain === "string") {
    try {
      body.prefferedDomain = JSON.parse(body.prefferedDomain);
    } catch {
      body.prefferedDomain = body.prefferedDomain.split(",").map((d) => d.trim());
    }
  }

  if (body.projects && typeof body.projects === "string") {
    try {
      body.projects = JSON.parse(body.projects);
    } catch {
      body.projects = [];
    }
  }

  let user = await userModel.create({
    ...body,
    resume: req.files?.resume?.[0]?.path || null,
    profilePic: req.files?.profilePic?.[0]?.path || null,
  });

  sendToken(user, 201, res);
});
export const loginUser = asyncHandler(async(req,res,next)=>{
  let {email,password}= req.body;
  let user= await userModel.findOne({email}).select("+password");
  if(!user){
    return next(new ApiError(400,"Email id or password is incorrect"));
  }
  let isCorrectPass= await user.verifyPassword(password)
  if(!isCorrectPass){
    return next(new ApiError(400,"Email id or password is incorrect"));
  }
  sendToken(user,201,res);
})

export const forgotUserPasword= asyncHandler(async (req,res,next)=>{
  const {email}= req.body;
  let user= await userModel.findOne({email});
  if(!user){
    return next(new ApiError(400,"This user doesn't exist"));
  }
  let resetToken;
  try{
    resetToken = user.generateResetPasswordToken();
    await user.save({validateBeforeSave:false});
  }catch(err){
    user.resetPasswordToken= undefined;
    user.resetPasswordExpire= undefined;
    await user.save({validateBeforeSave:false});
    return next(new ApiError(500,"There is problem to generate your resettoken"));
  }
  let resetLink= `http://localhost:5173/reset-password/user/${resetToken}`;
  let message= `To Reset password click this link ${resetLink}\n\nThis link will expire in 30 minutes\n\nIf you did not request for resetting password Igonr this message`;
  try{
      await sendMAil({
        message,
        email,
        subject:"Request for Reset Password 🔑"
      })
      res.status(200).json({
        success:true,
        resetToken,
        message:"Reset password link, Check your email"
      })
  }catch(err){
      user.resetPasswordToken= undefined;
      user.resetPasswordExpire= undefined;
      await user.save({validateBeforeSave:false});
      return next(new ApiError(400,"There is a problem to send email to you, Try again later"));
  }
})

export const resetForgotPassword = asyncHandler(async(req,res,next)=>{
  let {token}= req.params;
  let tokenn= crypto.createHash("sha256").update(token).digest("hex");
  let user = await userModel.findOne({
    resetPasswordToken:tokenn,
    resetPasswordExpire:{$gt: new Date(Date.now())}
  })

  if(!user){
    return next(new ApiError(400,"Reset password link is Invalid or Expire"));
  }
  let {newpassword,confirmpassword} = req.body;
  if(newpassword !== confirmpassword){
    return next(new ApiError(400,"Password doesn't match"));
  }
  user.password= newpassword;
  user.resetPasswordToken=undefined;
  user.resetPasswordExpire=undefined;
  await user.save({validateBeforeSave:false});
  sendToken(user,200,res);
})

export const allInternships= asyncHandler(async(req,res,next)=>{
  // let internships = await internshipModel.find();
  const apiFeature = new ApiFunction(internshipModel.find(),req.query).search().filter().stipend().sort();
  const products= await apiFeature.query;
  const skills= req.user.role=="Student"?req.user.skills:[]
  const role=req.user.role
  console.log(skills);
  
  
  res.status(200).json({
    success:true,
    products,
    skills,
    role
  })
})

export const viewEachInternship = asyncHandler(async(req,res,next)=>{
    let {id}= req.body;
    let internship = await internshipModel.findById(id).populate("createdBy");
    let {user}= req;
    res.status(200).json({
      success:true,
      internship,
      user
    })
})

export const applyInternship = asyncHandler(async(req,res,next)=>{
    let {id}= req.params;
    let userId= req.user._id;
    console.log(id);
    
    // let internShip= await internshipModel.findById(id);
    let user= await userModel.findById(userId);
    res.status(200).json({
      success:true,
      user,
      id,
    })
})

export const finalApply = asyncHandler(async(req,res,next)=>{
  let body ={ ...req.body };
  let userid= body.userid;
  let productid= body.productid;
  console.log("hellooooooooo");
  

  if (body.skills && typeof body.skills=== "string") {
    try {
      body.skills = JSON.parse(body.skills);
    } catch {
      body.skills = body.skills.split(",").map((s) => s.trim());
    }
  }

  if (body.prefferedDomain && typeof body.prefferedDomain === "string") {
    try {
      body.prefferedDomain = JSON.parse(body.prefferedDomain);
    } catch {
      body.prefferedDomain = body.prefferedDomain.split(",").map((d) => d.trim());
    }
  }

  if (body.projects && typeof body.projects === "string") {
    try {
      body.projects = JSON.parse(body.projects);
    } catch {
      body.projects = [];
    }
  }

  let updateData = {
    ...body,
    $push: { appliedInterships: { internship: productid } },
  };

  let p= await internshipModel.findById(productid);

  await uhModel.create({
    user:userid,
    internship:productid,
    hr:p.createdBy,
  })

if (req.files?.resume?.[0]?.path) {
  updateData.resume = req.files.resume[0].path;
}


if (req.files?.profilePic?.[0]?.path) {
  updateData.profilePic = req.files.profilePic[0].path;
}

let user = await userModel.findOneAndUpdate(
  { _id: userid },
  updateData,
  { new: true }
);

  await internshipModel.findByIdAndUpdate(
    productid,
    { $push: { userApplied: userid } },  
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Application submitted successfully",
    user,
  });

})

export const sendUser = asyncHandler(async(req,res,next)=>{
let user = await userModel.findById(req.user._id).populate("appliedInterships.internship")
  res.status(200).json({
    success:true,
    user,
  })
})

export const updateProfile= asyncHandler(async(req,res,next)=>{
    let body ={ ...req.body };
    let {id}= req.params;
    console.log(id);
    

    if (body.skills && typeof body.skills=== "string") {
      try {
        body.skills = JSON.parse(body.skills);
      } catch {
        body.skills = body.skills.split(",").map((s) => s.trim());
      }
    }

    if (body.prefferedDomain && typeof body.prefferedDomain === "string") {
      try {
        body.prefferedDomain = JSON.parse(body.prefferedDomain);
      } catch {
        body.prefferedDomain = body.prefferedDomain.split(",").map((d) => d.trim());
      }
    }

    if (body.projects && typeof body.projects === "string") {
      try {
        body.projects = JSON.parse(body.projects);
      } catch {
        body.projects = [];
      }
    }

    let updateData = {
      ...body,
    };


  if (req.files?.resume?.[0]?.path) {
    updateData.resume = req.files.resume[0].path;
  }


  if (req.files?.profilePic?.[0]?.path) {
    updateData.profilePic = req.files.profilePic[0].path;
  }

  let user = await userModel.findOneAndUpdate(
    { _id: id },
    updateData,
    { new: true }
  );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
})

export const logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});


export const avaMentor = asyncHandler(async(req,res,next)=>{
  let mentors= await mentorModel.find();
  let user = await userModel.findById(req.user._id);
  res.status(200).json({
    success:true,
    mentors,
    user
  })
})

export const addMentor= asyncHandler(async(req,res,next)=>{
  let {mentorid,userid}= req.body;
  let mentor = await mentorModel.findById(mentorid);
  mentor.assignedStudents.push(userid);
  await mentor.save({validateBeforeSave:false});
  let user = await userModel.findById(userid);
  user.mentorAssigned= mentorid;
  await user.save({validateBeforeSave:false});
  
  let m=await muModel.create({
    user:userid,
    mentor:mentorid,
  })
  res.status(200).json({
    success:true,
    mentor,
    user
  })
})

export const recommendation = asyncHandler(async (req, res, next) => {
  const { role } = req.params;
  const { huu } = req.body;
  console.log(huu);
  
  let x=1
  if(huu=="-1"){
    x=-1
  }

  let query = internshipModel.find({ domain: role }).sort({ stipend: x });

  const intern = await query;

  res.status(200).json({
    success: true,
    intern
  });
});
