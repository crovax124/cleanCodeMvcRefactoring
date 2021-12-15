const express = require('express');

const blogController = require('../controllers/post-controllers');
const router = express.Router();

router.get('/', blogController.getHomepage);
router.get('/admin', blogController.getAdminPage);

router.post('/posts', blogController.postAdmin);
router.get('/posts/:id/edit', blogController.getEditPost);

router.post('/posts/:id/edit', blogController.postEditPost);
router.post('/posts/:id/delete', blogController.deletePost);

module.exports = router;
