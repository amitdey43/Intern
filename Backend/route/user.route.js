import express from "express";
import {  addMentor, allInternships, applyInternship, avaMentor, createUser, finalApply, forgotUserPasword, loginUser, logoutUser, recommendation, resetForgotPassword, sendUser, updateProfile, viewEachInternship } from "../controller/user.controller.js";
import { upload } from "../utilis/coludinary.js";
import { IsLoggedin } from "../middleware/isLoggedin.js";
let router= express.Router();

router.route("/register").post( upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),createUser)
router.route("/login").post(loginUser);
router.route("/forgot-password").post(forgotUserPasword);
router.route("/reset-password/:token").post(resetForgotPassword);
router.route("/internships").get(IsLoggedin,allInternships);
router.route("/internship").post(IsLoggedin,viewEachInternship);
router.route("/apply/:id").get(IsLoggedin,applyInternship);
router.route("/finalapply").post(
  IsLoggedin,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  finalApply
);
router.route("/dashboard").get(IsLoggedin,sendUser);

router.route("/updateProfile/:id").post(
  IsLoggedin,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  updateProfile
);
router.route("/logout").get(logoutUser);
router.route("/seementor").get(IsLoggedin,avaMentor);
router.route("/addmentor").post(IsLoggedin,addMentor);
router.route("/internships/:role").post(IsLoggedin,recommendation)
export default router