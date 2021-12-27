const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
    createPost: async (req, res) => {
        const newPost = new Post({
            userId: req.user.id, 
            content: req.body.content
        });
        try {
            const savedPost = await newPost.save();
            res.status(200).json({
                message: "Post added successfully",
                data: savedPost,
            });
        } catch (err) {
            res.status(500).json({
                message: "Post could not be added!",
                error: err,
            });
        }
    },

    deletePost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.post_id);
            if (post.userId === req.user.id) {
                await post.deleteOne();
                res.status(200).json("Post deleted successfully.");
            } else {
                res.status(403).json("You can delete only your post.");
            }
        } catch (err) {
            res.status(500).json({
                message: "Post not found!",
                error: err,
            });
        }
    },

    addNewComment: async (req, res, next) => {
        let comment = {};
        comment.postedBy = req.user.id;
        comment.content = req.body.content;
        try {
            const post = await Post.findByIdAndUpdate(
                req.params.post_id,
                { $push: { comments: comment } },
                { new: true }
            );
            res.status(200).json({
                message: "Comment added.",
                data: post,
            });
        } catch (err) {
            res.status(500).json({
                message: "Error fetching post's details.",
                error: err,
            });
        }
    },

    getComments: async (req, res) => {
        try {
            const post = await Post.findById(req.params.post_id);
            res.status(200).json({
                message: "Comments of the post!",
                data: post.comments,
            });
        } catch (err) {
            res.status(500).json({
                message: "Post not found!",
                error: err,
            });
        }
    },

    likeDislikePost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.post_id);
            if (!post.likes.includes(req.user.id)) {
                await post.updateOne({ $push: { likes: req.user.id } });
                res.status(200).json("The post has been liked.");
            } else {
                await post.updateOne({ $pull: { likes: req.user.id } });
                res.status(200).json("The post has been disliked.");
            }
        } catch (err) {
            res.status(500).json({
                message: "Error getting post!",
                error: err,
            });
        }
    },
};
