import { hrModel } from "../models/hrModel.js";
import asyncHandler from "../utilis/asyncHandler.js";
import sendToken from "../utilis/sendToken.js";
import ApiError from "../utilis/ApiError.js";
import { sendMAil } from "../utilis/sendMail.js";
import crypto from "crypto"
import { internshipModel } from "../models/internShip.js";
import { uhModel } from "../models/uhModel.js";
import { userModel } from "../models/userModel.js";

export const hrCreate= asyncHandler(async(req,res,next)=>{
    const existing = await hrModel.findOne({email:req.body.email});
    if(existing){
        return next(new ApiError(400,"Email already registered"));
    }
    const hr= await hrModel.create(req.body);
    sendToken(hr,201,res);
})

export const loginHr = asyncHandler(async(req,res,next)=>{
  let {email,password}= req.body;
  let hr= await hrModel.findOne({email}).select("+password");
  if(!hr){
    return next(new ApiError(400,"Email id or password is incorrect"));
  }
  let isCorrectPass= await hr.verifyPassword(password)
  if(!isCorrectPass){
    return next(new ApiError(400,"Email id or password is incorrect"));
  }
  sendToken(hr,201,res);
})

export const forgotHrPasword= asyncHandler(async (req,res,next)=>{
  const {email}= req.body;
  let hr= await hrModel.findOne({email});
  if(!hr){
    return next(new ApiError(400,"This user doesn't exist"));
  }
  let resetToken;
  try{
    resetToken = hr.generateResetPasswordToken();
    await hr.save({validateBeforeSave:false});
  }catch(err){
    hr.resetPasswordToken= undefined;
    hr.resetPasswordExpire= undefined;
    await hr.save({validateBeforeSave:false});
    return next(new ApiError(500,"There is problem to generate your resettoken"));
  }
  let resetLink= `http://localhost:5173/reset-password/hr/${resetToken}`;
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
      hr.resetPasswordToken= undefined;
      hr.resetPasswordExpire= undefined;
      await hr.save({validateBeforeSave:false});
      return next(new ApiError(400,"There is a problem to send email to you, Try again later"));
  }
})

export const resetForgotHrPassword = asyncHandler(async(req,res,next)=>{
  let {token}= req.params;
  let tokenn= crypto.createHash("sha256").update(token).digest("hex");
  let hr = await hrModel.findOne({
    resetPasswordToken:tokenn,
    resetPasswordExpire:{$gt: new Date(Date.now())}
  })

  if(!hr){
    return next(new ApiError(400,"Reset password link is Invalid or Expire"));
  }
  let {newpassword,confirmpassword} = req.body;
  if(newpassword !== confirmpassword){
    return next(new ApiError(400,"Password doesn't match"));
  }
  hr.password= newpassword;
  hr.resetPasswordToken=undefined;
  hr.resetPasswordExpire=undefined;
  await hr.save({validateBeforeSave:false});
  sendToken(hr,200,res);
})

export const createInternship = asyncHandler(async(req,res,next)=>{
    req.body.createdBy= req.user.id;
    req.body.companyname= req.user.companyName;
    let internShip= await internshipModel.create(req.body);
    let hr= await hrModel.findById(req.user.id);
    hr.internshipsPosted.push(internShip._id);
    await hr.save({validateBeforeSave:false});
    res.status(201).json({
      success: true,
      message: "Internship created successfully",
      internShip,
    });
})

export const getInternship= asyncHandler(async(req,res,next)=>{
    let internships= await internshipModel.find({createdBy:req.user.id});
    res.status(200).json({
      success:true,
      internships
    })
})

export const sendHr= asyncHandler(async(req,res,next)=>{
    let hr= await hrModel.findById(req.user._id).populate("shortlistedCandidates");
    let uh= await uhModel.find({hr:req.user._id}).populate("user").populate("hr").populate("internship");
    let totalc= uh.length;
    let shortlistUh= await uhModel.find({hr:req.user._id,status:"shortlisted"}).populate("user").populate("hr").populate("internship");
    console.log("shortlistUh");
    
    let shortlisted= 0,pending=0,rejected=0;
    uh.forEach((intern)=>{
      if(intern.status==="shortlisted"){
        shortlisted+=1;
      }
      if(intern.status==="pending"){
        pending+=1;
      }
      if(intern.status==="rejected"){
        rejected+=1;
      }
    })
    console.log("helloooo");
    
    res.status(200).json({
      success:true,
      hr,
      uh,
      totalc,
      shortlisted,
      shortlistUh,
      pending,
      rejected
    })
})

export const getUserForHr =asyncHandler(async(req,res,next)=>{
    let {id,internid}= req.params;
    console.log(id);
    console.log("hello");
    
    let internship= await internshipModel.findById(internid);
    let user= await userModel.findById(id);
    let uh= await uhModel.findOne({
      user:id,
      hr:req.user._id,
      internship:internid,
    })
    res.status(200).json({
      success:true,
      user,
      internship,
      uh,
    })
})

export const userShortlisted = asyncHandler(async (req, res, next) => {
  let { userid, internid } = req.params;
  let hrid = req.user._id;

  let uh = await uhModel.findOne({
    user: userid,
    hr: hrid,
    internship: internid,
  });

  if (!uh) {
    return res.status(404).json({ message: "Application not found" });
  }

  uh.status = "shortlisted";
  await uh.save({ validateBeforeSave: false });

  let user = await userModel.findById(userid);
  let hr= await hrModel.findByIdAndUpdate(hrid,{
    $push: {shortlistedCandidates:userid}
  },{new:true})

  let updated = false;
  user.appliedInterships.forEach((intern) => {
    if (intern.internship.toString() === internid.toString()) {
      intern.status = "shortlisted";
      updated = true;
    }
  });

  if (updated) {
    await user.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    success: true,
    message: "User shortlisted successfully",
  });
});

export const userRejected= asyncHandler(async(req,res,next)=>{
  let { userid, internid } = req.params;
  let hrid = req.user._id;

  let uh = await uhModel.findOne({
    user: userid,
    hr: hrid,
    internship: internid,
  });

  if (!uh) {
    return res.status(404).json({ message: "Application not found" });
  }

  uh.status = "rejected";
  await uh.save({ validateBeforeSave: false });

  let user = await userModel.findById(userid);

  let updated = false;
  user.appliedInterships.forEach((intern) => {
    if (intern.internship.toString() === internid.toString()) {
      intern.status = "rejected";
      updated = true;
    }
  });

  if (updated) {
    await user.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    success: true,
    message: "User rejected successfully",
  });
})

// export const internDelete= asyncHandler(async(req,res,next)=>{
//   let {uh,Hr,internships}= req.body;
//   let {internid} = req.params;
//   await uhModel.findOneAndDelete({
//     internship: internid,
//     hr: req.user._id,

//   })
export const getInterndatatoedit= asyncHandler(async(req,res,next)=>{
  let {internid}= req.params;
  let internship = await internshipModel.findById(internid);
  if(!internship){
    return next(new ApiError(404,"Internship data not avaliable"))
  }
  res.status(200).json({
    success:true,
    internship
  })
})
  
export const updateInternship= asyncHandler(async(req,res,next)=>{
  let {internid}= req.params;
  let formData= req.body;
  let internship;
  try{
    internship= await internshipModel.findByIdAndUpdate(internid,formData,{new:true});
  }catch(err){
    return next(new ApiError(404,err.message))
  }
  res.status(200).json({
    success:true,
    internship
  })
})
// })
// export const getUsersForHr = asyncHandler(async(req,res,next)=>{
//   let internships = await internshipModel.find({createdBy:req.user._id}).populate("userApplied.internship");
//   let applyUsers= [];
//   internships.forEach((intern)=>{
//     applyUsers.push(...intern.userApplied);
//   })
  
//   res.status(200).json({
//     success:true,
//     applyUsers
//   })
// })
export const logoutHr = asyncHandler(async (req, res, next) => {
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

export const interviewScheudle= asyncHandler(async(req,res,next)=>{
    let {uhid}= req.params;
    let interviewUh = await uhModel.find({hr:req.user._id,status:"shortlisted",interviewtime:{$ne:null}}).populate("user").populate("hr").populate("internship");
    let uh = await uhModel.findById(uhid).populate("user").populate("hr").populate("internship");
    res.status(200).json({
      success:true,
      interviewUh,
      uh
    })
})

export const setInterview = asyncHandler(async(req,res,next)=>{
  let {selectedDate,selectedTime,uhid}= req.body;
  let setTimeInterview= await uhModel.findById(uhid).populate("user");
  selectedDate= selectedDate.slice(0,10);
  
  let date = new Date(`${selectedDate}T${selectedTime}:00`);
  
  if(date.getTimezoneOffset()==0) date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  console.log("date is ",date);
  let hrInterview = await uhModel.find({hr:req.user._id,status:"shortlisted",interviewtime:{$ne:null}});
  for(const interview of hrInterview){
    if(date.getTime()>=interview.interviewtime.getTime() && date.getTime()<=new Date(interview.interviewtime+30*60*1000).getTime()){
      return next(new ApiError(400,`Your scheduled Interview at ${interview.interviewtime.toLocaleTimeString({
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })} take minimum 30 minutes to end`))
    }
    if(date.getTime()<=interview.interviewtime.getTime() && new Date(date+30*60*1000).getTime()>=interview.interviewtime.getTime()){
      return next(new ApiError(400,`Next meeting starts at ${interview.interviewtime.toLocaleTimeString({
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`))
    }
  }
  setTimeInterview.interviewtime= date;
  await setTimeInterview.save({
    validateBeforeSave:false,
  })
  res.status(200).json({
    success:true,
    message:`Interview Scheduled with ${setTimeInterview.user.name} at ${date.toLocaleTimeString({
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`
  })
})