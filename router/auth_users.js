const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    return username === "Mahak" && password === "Mhk"
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const user = req.body;
    if (!user) {
        return res.status(404).json({ message: "Body Empty" });
    }
    if (user.username === "Mahak" && user.password === "Mhk") {
        let accessToken = jwt.sign({
            data: user
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken
        }
        return res.status(200).send("User successfully logged in");
    }
    return res.status(400).send("Invalid username/password");

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const user = req.user;
    const { username } = user.data

    let bookData = books[isbn];
    let reviewData = bookData.reviews;
    if (reviewData[username]) {
        bookData.reviewData[username] = review;
        return res.status(300).json(bookData);
    }
    bookData.reviewData = {
        username, review
    }
    return res.status(300).json(bookData);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const user = req.user;
    const { username } = user.data

    let bookData = books[isbn];
    const reviewData = bookData.reviews;
    if (reviewData[username]) delete bookData.reviewData[username]
    return res.status(300).json({ message: "Review Deleted" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
