const { User } = require("../models");
const { signToken } = require("../utils/auth");

module.exports = {
  // Get a single user by ID or username
  async getSingleUser({ user = null, params }, res) {
    try {
      const foundUser = await User.findOne({
        $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
      })
        .select("-__v")
        .populate("cardio")
        .populate("resistance");

      if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(foundUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Create a new user
  async createUser({ body }, res) {
    try {
      const user = await User.create(body);
      const token = signToken(user);
      res.json({ token, user });
    } catch (err) {
      // Duplicate key error (e.g., username or email exists)
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ message: `${field} already exists` });
      }

      // Mongoose validation errors
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: messages.join(', ') });
      }

      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Login a user
  async login({ body }, res) {
    try {
      const user = await User.findOne({
        $or: [{ username: body.username }, { email: body.email }],
      });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const correctPw = await user.isCorrectPassword(body.password);

      if (!correctPw) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      const token = signToken(user);
      res.json({ token, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
};
