const jwt=require("jsonwebtoken")
const{promisify}=require("util")
const { users } = require("../Model/dbConnection")


exports.isAuthenticated=async (req,res,next)=>{
    const token=req.cookies.token
    if(!token){
        res.redirect('/')
        return
    }

    const decoded=await promisify(jwt.verify)(token,process.env.SECRET_KEY)

    const loggedInUser = await users.findOne({ where: { id: decoded.id } });

    if(!loggedInUser){
        res.render('/',)
    }else{
        req.user=loggedInUser

        if(req.session.flashMessage){
            res.locals.flashMessage=req.session.flashMessage
            req.session.flashMessage=null
        }
        
        next();
    }
}