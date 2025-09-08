import ApiError from "../utilis/ApiError.js";
export let midError = (err,req,res,next)=>{
    err.message= err.message || "Invalid Error";
    err.status= err.status || 404;

    if(err.name=== "CastError"){
        err= new ApiError(400,`This id invalid resource ${err.path}`)
    }
    if(err.code===11000){
        err= new ApiError(400,`This ${Object.keys(err.keyValue)} is already avaliable, Please procced to login`);
    }
    res.status(err.status).json({
        success:false,
        message:err.message
    })
}