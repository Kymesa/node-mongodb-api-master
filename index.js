const express = require("express");
const cors = require("cors");
const app = express();
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

require("dotenv").config();
app.use(cors(corsOptions));
app.use(express.json());

const connectDB = require("./connectMongo");

connectDB();

const BookModel = require("./models/book.model");

app.get("/", async (req, res) => {
  return res.status(200).json({ msj: "OK!!!" });
});

app.get("/api/v1/books", async (req, res) => {
  const { limit = 5, orderBy = "name", sortBy = "asc", keyword } = req.query;
  let page = +req.query?.page;

  if (!page || page <= 0) page = 1;

  const skip = (page - 1) * +limit;

  const query = {};

  if (keyword) query.name = { $regex: keyword, $options: "i" };

  try {
    const data = await BookModel.find(query);
    // .skip(skip)
    // .limit(limit)
    // .sort({ [orderBy]: sortBy });S
    const totalItems = await BookModel.countDocuments(query);
    return res.status(200).json({
      msg: "Ok",
      totalItems,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

app.get("/api/v1/books/:id", async (req, res) => {
  try {
    const data = await BookModel.findById(req.params.id);

    if (data) {
      return res.status(200).json({
        msg: "Ok",
        data,
      });
    }

    return res.status(404).json({
      msg: "Not Found",
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

app.post("/api/v1/books", async (req, res) => {
  try {
    const { name, provider, category, price } = req.body;
    if (name && provider && category && price) {
      const book = new BookModel({
        name,
        provider,
        category,
        price,
      });
      // console.log(req.body);
      const data = await book.save();
      return res.status(200).json({
        msg: "Ok!!!",
        data,
      });
    } else {
      return res.status(200).json({
        msg: "INFORMACION INCORRECTA",
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

app.put("/api/v1/books/:id", async (req, res) => {
  try {
    const { name, provider, category, price } = req.body;
    const { id } = req.params;

    const data = await BookModel.findByIdAndUpdate(
      id,
      {
        name,
        provider,
        category,
        price,
      },
      { new: true }
    );

    return res.status(200).json({
      msg: "Ok",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

app.delete("/api/v1/books/:id", async (req, res) => {
  try {
    await BookModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      msg: "Ok",
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
    });
  }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
