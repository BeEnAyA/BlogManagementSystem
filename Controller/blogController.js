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