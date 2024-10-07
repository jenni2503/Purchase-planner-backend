import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "./models/item";
import morgan from "morgan";
// import cors from "cors";

dotenv.config();
const token = process.env.MYSECRETTOKEN;
const app = express();
const port = process.env.PORT;

// connect to mongodb
const mongoDbUrl: string = process.env.MONGO_DB_URL as string;
console.log(mongoDbUrl);

// middleware
// app.use(
//   cors({
//     origin: "https://purchase-planner-frontend.vercel.app/",
//   })
// );
app.use(morgan("dev"));
app.use(express.json());

// post add a item
app.post("/add-item", (req, res) => {
  const item = new Item(req.body);
  item
    .save()
    .then((result) => {
      res.status(201).json(result);
      return;
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error saving the item");
      return;
    });
});

// get all items
app.get("/", (req, res) => {
  Item.find()
    .then((result) => {
      res.status(200).send(result);
      return;
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error fetching items");
      return;
    });
});

// get item by id
app.get("/items/:id", (req, res) => {
  const { id } = req.params;
  Item.findById(id)
    .then((result) => {
      if (!result) {
        res.status(404).send("Item not found");
        return;
      }
      res.status(200).send(result);
      return;
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error fetching item");
      return;
    });
});

// delete item by id
app.delete("/items/:id", (req, res) => {
  const { id } = req.params;
  const headers = req.headers;
  if (headers.secrettoken !== token) {
    res.status(403).send("Not allowed");
    return;
  }
  Item.findByIdAndDelete(id)
    .then((result) => {
      if (!result) res.status(404).send("Item not found");
      else res.status(204).send();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error deleting item");
      return;
    });
});

// connect to db first then let server listen for req
mongoose
  .connect(mongoDbUrl)
  .then((result) => {
    console.log("connected to db");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

// 404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404 Not Found" });
});
