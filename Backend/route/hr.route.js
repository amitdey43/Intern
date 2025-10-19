import express from "express"
import { createInternship, forgotHrPasword, getInterndatatoedit, getInternship, getUserForHr, hrCreate, interviewScheudle, loginHr, logoutHr, resetForgotHrPassword, sendHr, setInterview, updateInternship, userRejected, userShortlisted } from "../controller/hr.controller.js";
import { IsLoggedin } from "../middleware/isLoggedin.js";

const router= express.Router();

router.route("/register").post(hrCreate);
router.route("/login").post(loginHr);
router.route("/forgot-password").post(forgotHrPasword);
router.route("/reset-password/:token").post(resetForgotHrPassword);
router.route("/create-internship").post(IsLoggedin,createInternship);
router.route("/get-internships").get(IsLoggedin,getInternship);
router.route("/hrdetails").get(IsLoggedin,sendHr);
router.route("/getuserforhr/:id/:internid").get(IsLoggedin,getUserForHr);
router.route("/condition/shortlisted/:userid/:internid").get(IsLoggedin,userShortlisted);
router.route("/condition/reject/:userid/:internid").get(IsLoggedin,userRejected);
// router.route("/delete-internships/:internid").put(IsLoggedin,)
router.route("/get-internship/:internid").get(IsLoggedin,getInterndatatoedit);
router.route("/update-internship/:internid").put(IsLoggedin,updateInternship);
router.route("/logout").get(logoutHr);
router.route("/interviewschedule/:uhid").get(IsLoggedin,interviewScheudle);
router.route("/setinterview").post(IsLoggedin,setInterview);

export default router;