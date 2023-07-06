const db = require('../Model/dbConnection')
const Blog=db.blogs


exports.renderCreateBlog=(req,res)=>{
    res.render('createBlog')
}

exports.createBlog=async (req,res)=>{
    const {title,description,image}=req.body;
    const createdBlog=await Blog.create({
        title:title,
        description:description,
        image:"http://localhost:4500/"+req.file.filename,
        userId:req.user.id,
    })

    if(createdBlog){
        res.redirect("/blog")
    }
}

exports.renderMyBlogs=async (req,res)=>{
    const myBlogs=await Blog.findAll({where:{
        userId:req.user.id
    }})

    res.render('myBlog',{myBlogs:myBlogs})
}