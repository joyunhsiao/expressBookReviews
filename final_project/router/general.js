const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const bookList = Object.values(books);
  return res.status(200).json(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({
      message: "Book not found"
    })
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  let foundBook = null;

  for (let bookId in books) {
    if (books[bookId].author === author) {
      foundBook = books[bookId];
      break;
    }
  }

  if (foundBook) {
    return res.status(200).json(foundBook);
  } else {
    return res.status(404).json({
      message: "Book not found"
    })
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  let foundBook = null;

  for (let bookId in books) {
    if (books[bookId].title === title) {
      foundBook = books[bookId];
      break;
    }
  }

  if (foundBook) {
    return res.status(200).json(foundBook);
  } else {
    return res.status(404).json({
      message: "Book not found"
    })
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
