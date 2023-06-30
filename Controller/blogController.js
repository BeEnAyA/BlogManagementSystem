const bcrypt = require('bcrypt')
const db = require('../Model/dbConnection')
const User=db.user
exports.renderHome=async (req,res)=>{
    res.render('home')
}

exports.renderRegistration=async (req,res)=>{
    res.render('registration')
}

exports.renderLogin=async (req,res)=>{
    res.render('login')
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
        image:"https://localhost:4500/"+req.file.filename,
    }

    console.log(user)

    const userCreated=await User.create(user)

    if(userCreated.length!=0){
        console.log("User created successfully")
        res.redirect('/login')
    }
    else{
        console.log("User creation failed.")
        res.redirect('/register')
    }
}

exports.makeLogin= async(req,res)=>{
    const {email,password}=req.body
    const foundUser= await User.findAll({
        where:{
            email:email,
        }
    })

    if (foundUser.length!=0){
       if(bcrypt.compareSync(password,foundUser[0].password)){
        res.redirect('/')
       }
       else{
        console.log("Login failed.")
        res.redirect('login')
       }
    }
}