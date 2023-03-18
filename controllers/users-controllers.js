const User =require('../models/user');
const {validationResult}=require('express-validator');
const HttpError=require('../models/error');
const getUsers=async(req,res,next)=>{
  let users;
try{
 users=await User.find({},'-password');
}catch(err){
  const error=new HttpError('Cannot get User,pls Try Again',500);
return next(error);
}
res.json({users:users.map(user=>user.toObject({getters:true}))});
}

const signup=async (req,res,next)=>{
const {name,email,password}=req.body;
let errors=validationResult(req);
if(!errors.isEmpty()){
  console.log("signup user error"+errors);
  return next(
   new HttpError("Invalid Inputs passed,Pls try Again!",422)
  );
}
let user;
try{
   user= await User.findOne({email:email});
   console.log("finding user error"+user);
}catch(err){
  const error=new HttpError('Sign up Failed Pls try Again',500);
return next(error);
}
if(!user){
const CreatedUser=new User({
  name,email:email.toLowerCase(),password,places:[],
  image:'https://res.cloudinary.com/diipdxyiw/image/upload/v1679165999/avatar_r74bmc.png'
});
try {
  await CreatedUser.save();
} catch (err) {
  const error=new HttpError('Signing up Failed,Pls Try again',500);
  return next(error);
}
res.status(201).json({user:CreatedUser.toObject({getters:true})});
}
else{
    return next( new HttpError('User Already Exists',422));
}
}

const login=async(req,res,next)=>{
const {email,password}=req.body;
let user;
try{
   user= await User.findOne({email:email.toLowerCase()});
   console.log("finding user error in login"+user);
}catch(err){
  const error=new HttpError('Sign up Failed Pls try Again',500);
return next(error);
}
if(!user||user.password!==password){
const error=new HttpError('Invalid Credentials,pls Try again',401);
return next(error);
}
else {
  if(user.password===password){
    res.json({"message":"Login Successfully",user:user.toObject({getters:true})});
  }
}
}

exports.signup=signup;
exports.getUsers=getUsers;
exports.login=login;