const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const verifyToken = require("../middlewares/verifyToken");

router.post('/', verifyToken, PostController.createPost);
router.delete('/:post_id/delete', verifyToken, PostController.deletePost);
router.post('/:post_id/comment', verifyToken, PostController.addNewComment);
router.get('/:post_id/getComments', verifyToken, PostController.getComments);
router.post('/:post_id/likeDislike', verifyToken, PostController.likeDislikePost);

module.exports = router;