const express=require('express')
const dotenv = require('dotenv');
const app=express()
const port=4500
const path = require("path")
const db = require("./Model/dbConnection")
app.set("view engine", "ejs")
require("./Config/dbConfig")
const authController=require('./Middleware/isAuthenticated')
const controller = require('./Controller/blogController')
db.sequelize.sync({ force: false })
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const{storage,multer}=require('./Services/multerConfig')
const upload=multer({storage:storage})

dotenv.config()

app.listen(process.env.PORT, () => {
  console.log("Node server started at port:https//:localhost:4500");
})


app.get("/", controller.renderHome)
app.get("/register", controller.renderRegistration)
app.get("/login", controller.renderLogin)
app.post("/makeRegistration",upload.single('image'),controller.makeRegistration)
app.post("/makeLogin",controller.makeLogin)
app.get("/forgotPassword",controller.renderVerifyEmail)
app.post("/sendOTP",controller.sendOTP)
app.post("/resetPassword",controller.resetPassword)
