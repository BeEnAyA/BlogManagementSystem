const db = require("../Model/dbConnection");
const Comment = db.comments;

exports.createComment = async (req, res) => {
  const { comment } = req.body;
  console.log("Hey man", req.params.blogId);
  await Comment.create({
    comment: comment,
    blogId: req.params.blogId,
    userId: req.user.id,
  });
  res.redirect("/blog/single/" + req.params.blogId + "#comments"); //This will redirect you to the same page also in the comments section directly
};

exports.renderEditComment = async (req, res) => {
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;
  const comment = await Comment.findOne({
    where: {
      id: commentId,
    },
  });
  res.render("editComment", { comment: comment });
};

exports.updateComment = async (req, res) => {
  const comment = req.body.comment;

  console.log(comment);
  const commentId = req.params.commentId;
  const blogId = req.params.blogId;

  await Comment.update(
    {
      comment: comment,
    },
    {
      where: {
        id: commentId,
      },
    }
  );

  res.redirect("/blog/single/" + blogId + "#comments");
};

exports.deleteComment = async (req, res) => {
  await Comment.destroy({
    where: {
      id: req.params.commentId,
    },
  });
  res.redirect("/blog/single/" + req.params.blogId + "#comments");
};
