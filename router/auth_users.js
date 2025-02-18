const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  for(let user in users){
    if(users[user].userName === username && users[user].password === password){
      return true;
    }
  }
  return false
}

const getBookReview = (isbn) => {
  for (let book in books) {
    if (books[book].isbn === isbn) {
      return books[book];
    }
  }
  return null;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const userName = req.query.userName;
  const password = req.query.password;  
  if (!authenticatedUser(userName,password)){
    return res.status(401).send("Error: Invalid Credentials..!");
  }
  let accessToken = jwt.sign({
    data: userName
  },'access', {expiresIn: 60*60});
  req.session.authorization = {
    accessToken
  }
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  isbn = req.params.isbn;
  new_review = req.query.review;
  if (!req.session.authorization) {
    return res.status(401).send("Error: Unauthorized access, please log in.");
  }

  const { accessToken } = req.session.authorization;
  
  jwt.verify(accessToken, 'access', (err, decoded) => {
    if (err) {
      return res.status(401).send("Error: Invalid or expired token.");
    }
    session_userName = decoded.data;
    let book = getBookReview(isbn);
    console.log(book.reviews)
    
    book.reviews[session_userName] = {
        "review": new_review
    };
    console.log(book.reviews)
    
    return res.status(200).send(book);

  });
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  isbn = req.params.isbn;
  if (!req.session.authorization) {
    return res.status(401).send("Error: Unauthorized access, please log in.");
  }

  const { accessToken } = req.session.authorization;
  
  jwt.verify(accessToken, 'access', (err, decoded) => {
    if (err) {
      return res.status(401).send("Error: Invalid or expired token.");
    }
    session_userName = decoded.data;
    let book = getBookReview(isbn);
    
    delete book.reviews[session_userName]
    
    return res.status(200).send(book);

  });


});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
