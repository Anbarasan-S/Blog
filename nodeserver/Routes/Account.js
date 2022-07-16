const express=require('express');
const route=express.Router();
const User=require('../Model/User');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');

route.post('/signup',async(req,res)=>{
        const{email,password}=req.body;

        try
        {
            let user=await User.findOne({email});
    
            if(user)
            {
                return res.status(400).json({"msg":"User already exists!!"});
            }

            user=new User({email,password});
            user.password=await bcrypt.hash(user.password,10);
            
            const token=jwt.sign({
                email:email
            },process.env.JWT_SECRET);

            const verify_link=`127.0.0.1:5500/verify.html?token=${token}`;

            await sendEmail(email,verify_link);
            
                        
            await user.save();

            res.status(200).json({msg:"Verify the link sent to your email!!"});
        }
        catch(err)
        {
            console.log(`Error in signup ${err}`);
            res.status(500).json({msg:"Internal server error"});
        }    
});


route.post('/verify',async(req,res)=>{

        try
        {
            console.log(req.query.token);
            const token=req.query.token;
            const verified=jwt.verify(token,process.env.JWT_SECRET);

            if(!verified)
            {
                return res.status(400).json({msg:"Invalid verification link!!"});
            }

            const email=verified.email;
            

            const user=await User.findOne({email});
            if(!user)
            {
                return res.status(400).json({msg:"Invalid verification link!!"});
            }

            user.verified=true;
            await user.save();
            
            res.status(200).json({msg:"Account verified successfully. Login to continue"});
        }
        catch(err)
        {
            console.log(err);
            res.status(500).json({msg:"Internal server error"});          
        }
});

route.post('/login',async(req,res)=>{
    try
    {
        const {email,password}=req.body;
        if(!email||!password)
        {
            return res.status(400).json({msg:"Required fields are missing!!"});
        }
    
        const user=await User.findOne({email});
    
        if(!user)
        {
            return res.status(400).json({msg:"User does not exists"});
        }

        if(user.verified===false)
        {
            return res.status(400).json({msg:"User is not verified yet!!"});
        }
        
        const matched=await bcrypt.compare(password,user.password);

        if(!matched)
        {   
            return res.status(400).json({msg:"Invalid password"});
        }

        const token=jwt.sign({user:user._id},process.env.JWT_SECRET);

        res.status(200).json({msg:"Logged in successfully",token});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({msg:"Internal server error"});
    }
});




const sendEmail=async(receiver,token)=>{
    try
    {
        let transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.GMAIL_ID,
                pass:process.env.GMAIL_PASS
            }
        });

        const mailOptions={
            from:process.env.GMAIL_ID,
            to:receiver,
            subject:"Verification link for bloggy",
            text:token
        }

       await transporter.sendMail(mailOptions);
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
}

module.exports=route;


