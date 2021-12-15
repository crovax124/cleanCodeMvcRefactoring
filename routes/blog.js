const express = require('express');

const blogController = require('../controllers/post-controllers');
const authProtection = require('../middlewares/auth-protection')

const router = express.Router();

router.get('/', blogController.getHomepage);

router.use(authProtection);                                 //executes the function for all the routes after this code.

router.get('/admin',  blogController.getAdminPage);

router.post('/posts', blogController.postAdmin);
router.get('/posts/:id/edit', blogController.getEditPost);

router.post('/posts/:id/edit', blogController.postEditPost);
router.post('/posts/:id/delete', blogController.deletePost);

module.exports = router;
