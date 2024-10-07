import mongoose from "mongoose";
import { Schema } from "mongoose";

const itemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  store: {
    type: String,
  },
  person: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
  },
  published: {
    type: Boolean,
    default: false,
  },
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
