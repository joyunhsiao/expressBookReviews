const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
  const token = req.header("Authorization");

  if (!token) {
    return res.status(403).json({
      message: "Access Denied, No Token Provided"
    })
  }

  try {
    const decoded = jwt.verify(token, "my_secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" });
  }
});
 
const PORT =5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
