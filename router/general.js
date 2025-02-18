const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
const userName = req.query.userName;
const password = req.query.password;
let filtered_user = ''
if (userName === '' || password === ''){
  return res.status(400).send("Error: UserName or Password should not be Empty..!");
}else{
  filtered_user = users.filter((user) => user.userName === userName);

  if(filtered_user.length>0){
    return res.status(400).send("Error: UserName already exists..!");
  }else{
    users.push({
    "userName": userName ,
    "password": password
  });
  return res.status(200).send("User registration successfull");
}
}
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  let myPromise = new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve(books)
    },500)})

    myPromise.then((success)=>{
      res.send(success)
    })

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    let filtered_book = null;

    for (let book in books) {
        if (books[book].isbn === isbn) {
            filtered_book = books[book];
            break;
        }
    }

    if (filtered_book) {
        resolve(filtered_book);
    } else {
        reject("Book not found");
    }
  });

  myPromise
      .then((book) => {
          res.status(200).json(book);
      })
      .catch((error) => {
          res.status(404).json({ message: error });
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let myPromise = new Promise((resolve,reject) => {
    const author = req.params.author;
    let filtered_books = [];

      for (let book in books) {
          if (books[book].author === author) {
              filtered_books.push(books[book]); 
          }
      }
    if(filtered_books.length===0){
      reject("Book not found")
    }else{
      resolve(filtered_books)
    }
  });
  myPromise
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({message: error});
    })
  
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let myPromise = new Promise ((resolve,reject) =>{
    const title = req.params.title;
    let filtered_book= '';
      for (let book in books) {
          if (books[book].title === title) {
            filtered_book = books[book];
            break;
          }
      }
    if(filtered_book === ''){
      reject("Book not Found");
    }else{
      resolve(filtered_book);
    }
  });

  myPromise
    .then((book)=>{
      res.status(200).json(book);
    })
    .catch((error)=>{
      res.status(404).json({message:error});
    })
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book_reviews= '';
    for (let book in books) {
        if (books[book].isbn === isbn) {
          book_reviews = books[book].reviews;
          break;
        }
    }
  
    return res.status(300).send(book_reviews);
});

module.exports.general = public_users;
