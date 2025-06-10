import userSchema from "../models/user.model.js";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";

const {sign}=jwt



export async function registerUser(req,res){
    const {username,email,password,cpassword}=req.body
    console.log(username,email,password,cpassword);
    if(!(username&&email&&password))
        return res.status(404).send({msg:"fields are empty"})
    if(password!=cpassword)
        return res.status(404).send({msg:"password not match"})

    const data=await userSchema.findOne({email})
    
    if(data)
        return res.status(404).send({msg:"email already exist"})
    
    const hPassword=await bcrypt.hash(password,10)
    console.log(hPassword);

    await userSchema.create({username,email,password:hPassword}).then(()=>{
        res.status(201).send({msg:"successfully created"})
    }).catch((err)=>{
        res.status(500).send({msg:err})
    })
    
}  

export async function loginUser(req,res){
    const {email,password} = req.body
    if(!(email&&password))
        return res.status(404).send({msg:"fields are empty"})

    const user=await userSchema.findOne({email})
    if(user==null)
        return res.status(404).send({msg:"email is not valid"})
    const sucess=await bcrypt.compare(password,user.password) 
    console.log(sucess)
    if(!sucess)
        return res.status(404).send({msg:"incorrept password"})

    const token=await sign({userID:user._id},process.env.JWT_KEY,{expiresIn:"24h"})
    res.status(200).send({msg:"successfully loged in ",token})
}

export async function Home(req,res){
    try {
        console.log("end point");
        console.log(req.user);
        const _id=req.user.userID;
        const user=await userSchema.findOne({_id});
        res.status(200).send({username:user.username})
        
    } catch (error) {
        res.status(400).send({error})
    }
}