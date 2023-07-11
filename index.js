const express=require('express')
const dotenv = require('dotenv');
const app=express()
const db = require("./Model/dbConnection")
require("./Config/dbConfig")
const path=require('path')
const authController=require('./Middleware/isAuthenticated')
const controller = require('./Controller/userController')
const blogController=require('./Controller/blogController')
const commentController=require('./Controller/commentController')
const session=require('express-session')
const flash=require('connect-flash')
const moment=require('moment')


db.sequelize.sync({ force: false })
app.set("view engine", "ejs")
app.use(require("cookie-parser")());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname,'Uploads/Blogs')));
app.use(express.static(path.join(__dirname,'Uploads/Users')));

app.use(session({
  secret : 'mySession',
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());
const{storage,blogStorage,multer}=require('./Services/multerConfig');
const catchAsync = require('./Services/catchAsync');

const upload=multer({storage:storage})
const blogUpload=multer({storage:blogStorage})


dotenv.config()

app.listen(process.env.PORT, () => {
  console.log("Node server started at port=localhost:4500");
})

app.locals.moment = moment; // Now moment can be used in any ejs file of the project

app.get("/", controller.renderLogin)
app.get("/blog",authController.isAuthenticated, controller.renderHome)
app.get("/register", controller.renderRegistration)
app.post("/makeRegistration",upload.single('image'),controller.makeRegistration)
app.post("/",controller.makeLogin)
app.get("/forgotPassword",controller.renderVerifyEmail)
app.post("/sendOTP",controller.sendOTP)
app.post("/resetPassword",controller.resetPassword)
app.get('/create',authController.isAuthenticated,blogController.renderCreateBlog)
app.post('/create',authController.isAuthenticated, blogUpload.single('image'),blogController.createBlog)
app.get('/logout', controller.makeLogout)

app.get('/myBlogs',authController.isAuthenticated,catchAsync(blogController.renderMyBlogs))
app.get('/editBlog/:id',authController.isAuthenticated,blogController.renderEditBlog)
app.post('/updateBlog/:id',authController.isAuthenticated,upload.single('image'),blogController.updateBlog)
app.get('/deleteBlog/:id',authController.isAuthenticated,blogController.deleteBlog)
app.get('/myBlogs/single/:id',authController.isAuthenticated,blogController.renderMySingleBlog)
// app.post('/comment/:blogId',authController.isAuthenticated,commentController.renderComments)
app.post('/comment/:blogId',authController.isAuthenticated,commentController.createComment)

app.get('/blog/single/:blogId',authController.isAuthenticated,blogController.renderSingleBlog)