
const db = require('../Model/dbConnection')
const Blog=db.blogs
const Comment=db.comments
const { QueryTypes } = require('sequelize')


exports.renderCreateBlog=(req,res)=>{
    res.render('createBlog',{activePage:'createBlogs',user:req.user})
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
        req.flash("success", "Blog Posted Successfully!")
        res.redirect("/blog")
    }
}

exports.renderSingleBlog=async (req,res)=>{
    //Query to fetch the single blog along with the details of the blog writer
    const [blog]=await db.sequelize.query('SELECT blogs.id,blogs.title,blogs.description,blogs.createdAt,blogs.image,users.fullname FROM blogs JOIN users ON blogs.userId=users.id WHERE blogs.id=?',{
        type:QueryTypes.SELECT,
        replacements:[req.params.blogId]
    })

    //Query to fetch the details of comments that is to be passed while rendering single blog
    const comments = await db.sequelize.query(
        'SELECT comments.id,comments.userId,comments.comment, comments.createdAt, users.fullname, users.image FROM comments JOIN users ON comments.userId = users.id WHERE blogId = ? ORDER BY comments.id DESC',
        {
          type: QueryTypes.SELECT,
          replacements: [req.params.blogId],
        }
      );

    const [commentCount]=await db.sequelize.query('SELECT COUNT(comments.id) AS commentCount FROM comments WHERE blogId = ?',{
        type:QueryTypes.SELECT,
        replacements:[req.params.blogId],
        rew:true
      })
    const loggedUser=req.user.id
    res.render('blog.ejs',{blog:blog,comments:comments,count:commentCount,activePage:'blogs',loggedUser:loggedUser,user:req.user})
}


exports.renderMyBlogs=async (req,res)=>{
    const myBlogs=await Blog.findAll({where:{
        userId:req.user.id,
    }})

    res.render('myBlog',{myBlogs:myBlogs,activePage:'myBlogs',user:req.user})
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
    res.render('myBlog-single',{activePage:'myBlogs',myBlog:myBlog,user:req.user})
}