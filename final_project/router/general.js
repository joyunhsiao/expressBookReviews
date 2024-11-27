const express = require('express');
let books = require("./booksdb.js");
let users = require("./usersdb.js");
let isValid = require("./auth_users.js").isValid;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (users[username]) {
    return res.status(400).json({
      message: "Username already exists"
    });
  }

  users[username] = { password };

  return res.status(201).json({
    message: "Customer successfully registered. Now you can login"
  });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const bookList = await new Promise((resolve) => {
      resolve(Object.values(books));
    });

    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred"
    })
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
  
    const bookDetails = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });

    return res.status(200).json(bookDetails);
  } catch (error) {
    if (error === "Book not found") {
      return res.status(404).json({
        message: error
      });
    }
    return res.status(500).json({
      message: "An error occurred"
    });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;

    const foundBook = await new Promise((resolve, reject) => {
      for (let bookId in books) {
        if (books[bookId].author === author) {
          return resolve(books[bookId]);
        }
      }
      reject("Book not found");
    });

    return res.status(200).json(foundBook);
  } catch (error) {
    if (error === "Book not found") {
      return res.status(404).json({
        message: error
      });
    }
    return res.status(500).json({
      message: "An error occurred"
    });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;

    const foundBook = await new Promise ((resolve, reject) => {
      for (let bookId in books) {
        if (books[bookId].title === title) {
          return resolve(books[bookId]);
        }
      }
      reject("Book not found");
    })

    return res.status(200).json(foundBook);
  } catch (error) {
    if (error === "Book not found") {
      return res.status(404).json({
        message: error
      });
    }
    return res.status(500).json({
      message: "An error occurred"
    });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({
      message: "Book not found"
    })
  }
});

module.exports.general = public_users;
