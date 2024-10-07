import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "./models/item";
import morgan from "morgan";
import cors from "cors";

dotenv.config();
const token = process.env.MYSECRETTOKEN;
const app = express();
const port = process.env.PORT;

// connect to mongodb
const mongoDbUrl: string = process.env.MONGO_DB_URL as string;
console.log(mongoDbUrl);

function isAdmin(req: express.Request) {
  const headers = req.headers;
  return headers.secrettoken === token;
}

// middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(morgan("dev"));
app.use(express.json());

// post add a item
app.post("/item", (req, res) => {
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
app.get("/item", (req, res) => {
  Item.find()
    .then((result) => {
      const onlyPublished = result.filter((item) => item.published);
      if (isAdmin(req)) {
        res.status(200).send(result);
        return;
      } else {
        res.status(200).send(onlyPublished);
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error fetching items");
      return;
    });
});

// get item by id
app.get("/item/:id", (req, res) => {
  const { id } = req.params;
  Item.findById(id)
    .then((result) => {
      if (!result) {
        res.status(404).send("Item not found");
        return;
      }
      if (isAdmin(req) || result.published) {
        res.status(200).send(result);
        return;
      }
      res.status(404).send("Item not found");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error fetching item");
      return;
    });
});

app.put("/item/:id", (req, res) => {
  const { id } = req.params;
  const item = new Item(req.body);
  if (!isAdmin(req)) {
    res.status(403).send("Not allowed");
    return;
  }
  Item.findByIdAndUpdate(id, item, { new: true })
    .then((result) => {
      if (!result) {
        res.status(404).send("Item not found");
        return;
      }
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error updating item");
    });
});

// delete item by id
app.delete("/item/:id", (req, res) => {
  const { id } = req.params;
  if (!isAdmin(req)) {
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
