const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let users = require("./usersdb.js");
const regd_users = express.Router();

const isValid = (username)=>{ //returns boolean
  return users.hasOwnProperty(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users[username] && users[username].password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (!isValid(username)) {
    return res.status(404).json({
      message: "Username not found"
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: "Invalid password"
    });
  }

  const token = jwt.sign({ username }, "my_secret_key", { expiresIn: "1h" });

  req.session.token = token;

  return res.status(200).send("Customer successfully logged in");
  // return res.status(200).json({
  //   message: "Successfully logged in",
  //   token: token
  // });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
