"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const item_1 = __importDefault(require("./models/item"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const token = process.env.MYSECRETTOKEN;
const app = (0, express_1.default)();
const port = process.env.PORT;
// connect to mongodb
const mongoDbUrl = process.env.MONGO_DB_URL;
console.log(mongoDbUrl);
// middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
// post add a item
app.post("/add-item", (req, res) => {
    const item = new item_1.default(req.body);
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
    item_1.default.find()
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
    item_1.default.findById(id)
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
    item_1.default.findByIdAndDelete(id)
        .then((result) => {
        if (!result)
            res.status(404).send("Item not found");
        else
            res.status(204).send();
    })
        .catch((err) => {
        console.log(err);
        res.status(500).send("Error deleting item");
        return;
    });
});
// connect to db first then let server listen for req
mongoose_1.default
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
