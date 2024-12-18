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
  req.session.username = username;

  // return res.status(200).send("Customer successfully logged in");
  return res.status(200).json({
    message: "Successfully logged in",
    token: token
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;

  if (!review) {
    return res.status(400).json({
      message: "Review text is required"
    });
  }

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  const token = req.session.token;
  if (!token) {
    return res.status(403).json({
      message: "Access Denied, No Token Provided"
    });
  }

  try {
    const decoded = jwt.verify(token, "my_secret_key");
    const username = decoded.username;

    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    // return res.status(200).json({
    //   message: "Review successfully added/updated"
    // });
    return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated`);

  } catch (err) {
    return res.status(400).json({
      message: "Invalid or expired token"
    })
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  const bookReviews = books[isbn].reviews;
  if (!bookReviews || !bookReviews[username]) {
    return res.status(404).json({
      message: "No review found for this user"
    })
  }

  delete bookReviews[username];

  // return res.status(200).json({
  //   message: "Review deleted successfully",
  //   reviews: bookReviews
  // });
  return res.status(200).send(`Reviews for the ISBN ${isbn} posted by user deleted`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
