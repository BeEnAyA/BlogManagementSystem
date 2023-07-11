const db=require('../Model/dbConnection')
const Comment=db.comments

exports.renderComments= async (req,res)=>{
   const blogId=req.params.blogId;
    res.render('comments.ejs',{id:blogId})
}

exports.createComment=async (req,res)=>{
    const{comment}=req.body
    // console.log(comment,req.params.blogId,req.user.id)
    await Comment.create({
        comment:comment,
        blogId:req.params.blogId,
        userId:req.user.id,

    })
    res.redirect('/blogs')
}