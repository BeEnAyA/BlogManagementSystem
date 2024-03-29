const bcrypt = require("bcrypt");
const db = require("../Model/dbConnection");
const sendEmail = require("../Services/emailConfig");
const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");
const User = db.users;
const Blog = db.blogs;

exports.renderHome = async (req, res) => {
  const message = req.flash();
  const allBLogs = await db.sequelize.query(
    "SELECT blogs.id,blogs.title,blogs.description,blogs.image,blogs.createdAt,users.fullname FROM blogs JOIN users ON blogs.userId=users.id",
    {
      type: QueryTypes.SELECT,
    }
  );

  res.render("home", {
    msg: message,
    blogs: allBLogs,
    activePage: "blogs",
    user: req.user,
  });
};

exports.TestApi = async (req, res) => {
  const allBLogs = await db.sequelize.query(
    "SELECT blogs.id,blogs.title,blogs.description,blogs.image,blogs.createdAt,users.fullname FROM blogs JOIN users ON blogs.userId=users.id",
    {
      type: QueryTypes.SELECT,
    }
  );

  // if(!req.body.name){
  //   return res.status(400).send({
  //     // data: allBLogs,
  //     message: 'error',
  //   });
  // }

  
  res.status(200).send({
    data: allBLogs,
    message: 'Success',
  });
}

exports.renderRegistration = async (req, res) => {
  res.render("registration");
};

exports.renderLogin = async (req, res) => {
  const message = req.flash();
  res.render("login", { msg: message });
};

exports.makeRegistration = async (req, res) => {
  const { fullname, email, phone, address, password } = req.body;

  const encPassword = bcrypt.hashSync(password, 10);
  const user = {
    fullname: fullname,
    email: email,
    phone: phone,
    address: address,
    password: encPassword,
    image: "http://localhost:4500/" + req.file.filename,
  };

  const userCreated = await User.create(user);

  if (userCreated.length != 0) {
    try {
      const options = {
        to: email,
        text: "You have successfully registered",
        subject: "Registration Successful",
      };
      await sendEmail(options);
      res.redirect("/");
    } catch (e) {
      console.log("Email could not be sent.");
      res.render("error");
    }
  } else {
    res.redirect("/register");
  }
};

exports.makeLogin = async (req, res) => {
  console.log("Its working");

  const { email, password } = req.body;
  const foundUser = await User.findAll({
    where: {
      email: email,
    },
  });

  if (foundUser.length != 0) {
    if (bcrypt.compareSync(password, foundUser[0].password)) {
      var token = jwt.sign({ id: foundUser[0].id }, process.env.SECRET_KEY, {
        expiresIn: 86400,
      });
      console.log("token:", token);
      res.cookie("token", token);
      req.flash("success", "Welcome " + foundUser[0].fullname);
      res.redirect("/blog");
    } else {
      res.redirect("/login");
    }
  }
};

exports.renderVerifyEmail = async (req, res) => {
  res.render("verifyEmail");
};

exports.sendOTP = async (req, res) => {
  const email = req.body.email;
  // res.send(req.body)
  const foundEmail = await User.findAll({
    where: {
      email: email,
    },
  });

  if (foundEmail.length != 0) {
    const OTP = Math.floor(10000 + Math.random() * 900000);
    try {
      const options = {
        to: email,
        text: "Your OTP is " + OTP,
        subject: "Reset Password",
      };
      await sendEmail(options);

      foundEmail[0].otp = OTP;
      foundEmail[0].save();
      res.render("resetPassword");
    } catch (e) {
      console.log("Email could not be sent.");
      res.render("error");
    }
  } else {
    res.redirect("/forgotPassword");
  }
};

exports.resetPassword = async (req, res) => {
  const { otp, newPassword } = req.body;
  const encPassword = bcrypt.hashSync(newPassword, 10);
  const verifiedOTP = await User.findAll({
    where: {
      otp: otp,
    },
  });
  if (verifiedOTP.length != 0) {
    verifiedOTP[0].password = encPassword;
    verifiedOTP[0].otp = null;
    verifiedOTP[0].save();
    res.redirect("/login");
    console.log("Password Changed Successfully.");
  } else {
    res.render("resetPassword");
  }
};

exports.renderAccountSetting = async (req, res) => {
  const message = req.flash();
  res.render("accountSetting", { msg: message });
};

exports.changePassword = async (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const rePassword = req.body.rePassword;

  if (oldPassword === "" && newPassword != rePassword) {
    res.redirect("/changePassword");
    return;
  }

  if (bcrypt.compareSync(oldPassword, req.user.password)) {
    await User.update(
      {
        password: bcrypt.hashSync(newPassword, 10),
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );
    req.flash("success", "Password changed successfully!");
    res.redirect("/blog");
  } else {
    req.flash("failure", "Old password doesn't match !");
    res.redirect("/changePassword");
  }
};

exports.viewProfile = async (req, res) => {
  res.render("userProfile", { user: req.user });
};
exports.editProfile = async (req, res) => {
  res.render("editProfile", { user: req.user });
};

exports.updateProfile = async (req, res) => {
  const userData = {
    fullname: req.body.fullname,
    address: req.body.address,
    phone: req.body.phone,
  };

  if (req.file) {
    userData.image = "http://localhost:4500/" + req.file.filename;
  }

  await User.update(userData, {
    where: {
      id: req.user.id,
    },
  });

  res.redirect("/viewProfile");
};

exports.makeLogout = (req, res) => {
  res.clearCookie("token");
  req.flash("success", "Logged out successfully!");
  res.redirect("/");
};
