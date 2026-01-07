import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import methodOverride from "method-override";

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

let port = 3000;
mongoose
  .connect("mongodb://127.0.0.1:27017/todo")
  .then(() => {
    console.log("Connected with mongoose");
  })
  .catch((err) => {
    console.log(err);
  });

let todoSchema = mongoose.Schema({
  task: {
    type: String,
    required: true,
    trim: true,
  },
});
let Todo = mongoose.model("Todo", todoSchema);

let app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

async function readTasks() {
  try {
    let tasks = await Todo.find();
    return tasks;
  } catch (err) {
    console.log(err);
    return [];
  }
}

app.get("/", async (req, res) => {
  let tasks = await readTasks();
  res.render("index", { tasks: tasks });
});

app.post("/add", async (req, res) => {
  try {
    let newTask = new Todo({ task: req.body.task });
    await newTask.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving task");
  }
});

app.delete("/delete", async (req, res) => {
  let id = req.body.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid task ID");
  }

  try {
    await Todo.findByIdAndDelete(id);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting task");
  }
});

app.get("/update/:id", async (req, res) => {
  let id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid task ID");
  }

  res.render("update", { id: id });
});

app.put("/update", async (req, res) => {
  let id = req.body.id;
  let task = req.body.task;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid task ID");
  }

  try {
    await Todo.findByIdAndUpdate(id, { task });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send(`Error updating task`);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
