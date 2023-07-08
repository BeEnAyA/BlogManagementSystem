const bcrypt = require('bcrypt')
const db = require('../Model/dbConnection')
const sendEmail = require('../Services/emailConfig')
const jwt=require("jsonwebtoken")
const User=db.users
const Blog=db.blogs

exports.renderHome=async (req,res)=>{
    const message=req.flash()
    const allBLogs=await Blog.findAll()
    res.render('home',{msg:message,blogs:allBLogs,activePage:'blogs'})

    
}

exports.renderRegistration=async (req,res)=>{
    res.render('registration')
}

exports.renderLogin=async (req,res)=>{
    const message=req.flash()
    res.render('login',{msg:message})
}

exports.makeRegistration=async (req,res)=>{
    const {fullname,email,phone,address,password}=req.body

    const encPassword=bcrypt.hashSync(password,10)
    const user={
        fullname:fullname,
        email:email,
        phone:phone,
        address:address,
        password:encPassword,
        image:"http://localhost:4500/"+req.file.filename,
    }

    const userCreated=await User.create(user)

    if(userCreated.length!=0){
        
        
        try {
            const options ={
                to:email,
                text:'You have successfully registered',
                subject: "Registration Successful",
            }
            await sendEmail(options)
            res.redirect('/')
          } catch (e) {
            console.log("Email could not be sent.");
            res.render("error");
          }
    }
    else{
        res.redirect('/register')
    }
}

exports.makeLogin= async (req,res)=>{
    console.log(
        "Its working"
    )

    const {email,password}=req.body
    const foundUser= await User.findAll({
        where:{
            email:email,
        }
    })

    if (foundUser.length!=0){
       if(bcrypt.compareSync(password,foundUser[0].password)){
       var token=jwt.sign({id:foundUser[0].id},process.env.SECRET_KEY,{expiresIn:86400,}) 
       console.log("token:",token)
       res.cookie('token',token)
       req.flash("success","Welcome "+foundUser[0].fullname)
       res.redirect('/blog')
       }
       else{
        console.log("Login failed.")
        res.redirect('/login')
       }
    }   
}

exports.renderVerifyEmail=async (req,res)=>{
    res.render('verifyEmail')
}

exports.sendOTP=async (req,res)=>{
    const email=req.body.email
    const foundEmail= await User.findAll({
        where:{
            email:email
        }
    })

    if(foundEmail.length!=0){
        const OTP = Math.floor(10000 + Math.random() * 90000);
        try {
            const options ={
                to:email,
                text:'Your OTP is '+OTP,
                subject: "Reset Password",
            }
            await sendEmail(options)

            foundEmail[0].otp=OTP
            foundEmail[0].save()
            res.render('resetPassword')
          } catch (e) {
            console.log("Email could not be sent.");
            res.render("error");
          }
    }
    else{
        res.redirect('/forgotPassword')
    }
}

exports.resetPassword=async (req,res)=>{
    const {otp,newPassword}=req.body
    const encPassword=bcrypt.hashSync(newPassword,10)
    const verifiedOTP=await User.findAll({
        where:{
            otp:otp
        }
    })
    if(verifiedOTP.length!=0){
        verifiedOTP[0].password=encPassword
        verifiedOTP[0].otp=null
        verifiedOTP[0].save()
        res.redirect('/login')
        console.log("Password Changed Successfully.")
    }
    else{
        res.render('resetPassword')
    }
}

exports.makeLogout=(req,res,)=>{
    res.clearCookie('token')
    req.flash('success','Logged out successfully!')
    res.redirect('/')
}