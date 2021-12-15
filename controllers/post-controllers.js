const Post = require("../models/posts");
const validation = require("../util/validation");

function getHomepage(req, res) {
  res.render("welcome");
}

async function getAdminPage(req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render("401");
  }

  const posts = await Post.fetchAll();

  const sessionInputData = validation.getSessionErrorData(req, {
    title: "",
    content: "",
  });

  res.render("admin", {
    posts: posts,
    inputData: sessionInputData,
  });
}

async function postAdmin(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (!validation.postIsValid(enteredTitle, enteredContent)) {
    validation.showErrorToSession(
      req,
      {
        message: "Invalid input - please check your data.",
        title: enteredTitle,
        content: enteredContent,
      },
      function () {
        res.redirect("/admin");
      }
    );

    return; // or return res.redirect('/admin'); => Has the same effect
  }

  const newPost = new Post(enteredTitle, enteredContent);
  await newPost.save();

  res.redirect("/admin");
}

async function getEditPost(req, res) {
  const post = new Post(null, null, req.params.id);
  await post.fetch();

  if (!post.title || !post.content) {
    return res.render("404");
  }

  const sessionInputData = validation.getSessionErrorData(req, {
    title: post.title,
    content: post.content,
  });

  res.render("single-post", {
    post: post,
    inputData: sessionInputData,
  });
}

async function postEditPost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (!validation.postIsValid(enteredTitle, enteredContent)) {
    validation.showErrorToSession(
      req,
      {
        message: "Invalid input - please check your data.",
        title: enteredTitle,
        content: enteredContent,
      },
      function () {
        res.redirect(`/posts/${req.params.id}/edit`);
      }
    );

    return;
  }

  const updatePost = new Post(enteredTitle, enteredContent, req.params.id);
  await updatePost.save();

  res.redirect("/admin");
}

async function deletePost(req, res) {
  const deletePost = new Post("", "", req.params.id);
  await deletePost.delete();

  res.redirect("/admin");
}

module.exports = {
  getHomepage: getHomepage,
  getAdminPage: getAdminPage,
  postAdmin: postAdmin,
  getEditPost: getEditPost,
  postEditPost: postEditPost,
  deletePost: deletePost,
};
