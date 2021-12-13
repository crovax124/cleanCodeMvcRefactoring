const express = require('express');
const mongodb = require('mongodb');

const db = require('../data/database');
const Post = require('../models/posts')

const ObjectId = mongodb.ObjectId;
const router = express.Router();

router.get('/', function (req, res) {
  res.render('welcome', { csrfToken: req.csrfToken() });
});

router.get('/admin', async function (req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render('401');
  }

  const posts = await Post.fetchAll();

  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      title: '',
      content: '',
    };
  }

  req.session.inputData = null;

  res.render('admin', {
    posts: posts,
    inputData: sessionInputData,
    csrfToken: req.csrfToken(),
  });
});

router.post('/posts', async function (req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (
    !enteredTitle ||
    !enteredContent ||
    enteredTitle.trim() === '' ||
    enteredContent.trim() === ''
  ) {
    req.session.inputData = {
      hasError: true,
      message: 'Invalid input - please check your data.',
      title: enteredTitle,
      content: enteredContent,
    };

    res.redirect('/admin');
    return; // or return res.redirect('/admin'); => Has the same effect
  }

const newPost= new Post(enteredTitle, enteredContent);
await newPost.save();

  res.redirect('/admin');
});

router.get('/posts/:id/edit', async function (req, res) {
  const post = new Post(null, null, req.params.id);
  await post.fetch();

  if (!post.title || !post.content) {
    return res.render('404');
  }

  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      title: post.title,
      content: post.content,
    };
  }

  req.session.inputData = null;

  res.render('single-post', {
    post: post,
    inputData: sessionInputData,
    csrfToken: req.csrfToken(),
  });
});

router.post('/posts/:id/edit', async function (req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (
    !enteredTitle ||
    !enteredContent ||
    enteredTitle.trim() === '' ||
    enteredContent.trim() === ''
  ) {
    req.session.inputData = {
      hasError: true,
      message: 'Invalid input - please check your data.',
      title: enteredTitle,
      content: enteredContent,
    };



    res.redirect(`/posts/${req.params.id}/edit`);
    return; 
  }

  const updatePost = new Post(enteredTitle, enteredContent, req.params.id)
  await updatePost.save();


  res.redirect('/admin');
});

router.post('/posts/:id/delete', async function (req, res) {
 const deletePost = new Post('', '', req.params.id);
 await deletePost.delete();

  res.redirect('/admin');
});

module.exports = router;
