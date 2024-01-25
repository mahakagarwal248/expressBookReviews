const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username/password are required!" });
    users.map((item) => {
        if (item.username === username) return res.status(400).json({ message: "User Already Exists!" });
    })
    const user = users.push({ username, password });
    return res.status(300).json({ message: "User Added!" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const { isbn } = req.params;
    const book = await books[isbn]
    return res.status(300).json(book);
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const { author } = req.params;
    const booksData = Object.values(books);
    const data = await booksData?.filter((item) => item.author === author)
    if (data && data.length > 0) {
        return res.status(300).json(data);
    }
    return res.status(404).json({ message: "No book found" });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const { title } = req.params;
    const booksData = Object.values(books);
    const data = await booksData?.filter((item) => item.title === title)
    if (data && data.length > 0) {
        return res.status(300).json(data);
    }
    return res.status(404).json({ message: "No book found" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    const bookData = books[isbn];
    if (bookData) {
        return res.status(300).json({ review: bookData?.reviews });
    }
    return res.status(404).json({ message: "No book found" });
});

module.exports.general = public_users;
