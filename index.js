const express=require('express')
const app=express()
const port=4500
const path = require("path")
const db = require("./Model/dbConnection")
app.set("view engine", "ejs")
require("./Config/dbConfig")
const controller = require('./Controller/blogController')
db.sequelize.sync({ force: false })
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const{storage,multer}=require('./Services/multerConfig')
const upload=multer({storage:storage})

app.listen(port, () => {
  console.log("Node server started at port 5000");
})


app.get("/", controller.renderHome)
app.get("/register", controller.renderRegistration)
app.get("/login", controller.renderLogin)
app.post("/makeRegistration",upload.single('image'),controller.makeRegistration)
app.post("/makeLogin",controller.makeLogin)
