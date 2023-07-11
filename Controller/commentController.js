const db=require('../Model/dbConnection')
const Comment=db.comments

exports.createComment=async (req,res)=>{
    const{comment}=req.body
    console.log('Hey man',req.params.blogId)
    await Comment.create({
        comment:comment,
        blogId:req.params.blogId,
        userId:req.user.id,

    })
     res.redirect('/blog/single/'+req.params.blogId);
}