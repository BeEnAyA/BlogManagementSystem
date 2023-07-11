const db = require('../Model/dbConnection')
const Blog=db.blogs
const { QueryTypes } = require('sequelize')


exports.renderCreateBlog=(req,res)=>{
    res.render('createBlog',{activePage:'createBlogs'})
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

exports.renderSingleBlog=async (req,res)=>{
    console.log(req.params.blogId)
    const [blog]=await db.sequelize.query('SELECT * FROM blogs JOIN users ON blogs.userId=users.id WHERE blogs.id=?',{
        type:QueryTypes.SELECT,
        replacements:[req.params.blogId]
    })
    console.log(blog)

    res.render('blog.ejs',{blog:blog})
}


exports.renderMyBlogs=async (req,res)=>{
    const myBlogs=await Blog.findAll({where:{
        userId:req.user.id,
    }})

    res.render('myBlog',{myBlogs:myBlogs,activePage:'myBlogs'})
}

exports.renderEditBlog=async (req,res)=>{
   const blogData= await Blog.findOne({where:{
    id:req.params.id
   }})
   res.render('editBlog',{blog:blogData})
}

exports.updateBlog=async (req,res)=>{
    const updatedData={
        title:req.body.title,
        description:req.body.description,
    }
    if (req.file) {
        updatedData.image="http://localhost:4500/"+req.file.filename
    }

    const updateBlog=await Blog.update(updatedData,{
        where:{
            id:req.params.id
        }
    })

    res.redirect('/myBlogs')
}

exports.deleteBlog= async (req,res)=>{
    await Blog.destroy({
        where:{
            id:req.params.id
        }
    })

    res.redirect('/myBlogs')
}

exports.renderMySingleBlog= async (req,res)=>{
    const myBlog= await Blog.findOne({
        where:{
            id:req.params.id,
        }
    })
    res.render('myBlog-single',{activePage:'myBlogs',myBlog:myBlog})
}