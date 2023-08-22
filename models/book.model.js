const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    author: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
