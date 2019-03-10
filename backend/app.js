const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post')

const app = express();

mongoose.connect("mongodb+srv://w_mayur:2aieZH9icwEe7xWk@nodeproject-c0dzx.mongodb.net/node-mean?retryWrites=true", {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection failed');
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PUT, DELETE, OPTIONS');
  next();
})

app.post('/api/posts', (req, res, next) => {
  const posts = new Post({
    title: req.body.title,
    content: req.body.content
  });
  posts.save();

  // console.log(posts);
  res.status(201).json({
    message: 'Post Added Succesfully'
  })
})

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: documents
      })
    })
  const posts = [{
      id: "abcdefgh",
      title: "First server side post",
      content: "Coming from the server"
    },
    {
      id: "abcdefghi",
      title: "Second server side post",
      content: "Coming from the server"
    }
  ];

  res.status(200).json({
    message: "Posts fetched successfully",
    posts: posts
  })
})

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result)
    res.status(200).json({
      message: 'Post deleted'
    })
  })
  // console.log(req.params.id);

})


module.exports = app;
