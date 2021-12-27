const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    trim: true,
    required: true,
  },
  content: {
    type: String,
    trim: true,
    required: true,
  },
  photo: {
    type: String,
    required: false,
  },
  likes: {
    type: Array,
    default: [],
  },
  comments: [
    {
      content: String,
      created: { type: Date, default: Date.now },
      postedBy: { type: String, required: true },
    },
  ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
