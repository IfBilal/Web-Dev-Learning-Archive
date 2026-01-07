import express from "express";
let taskid = 1;
let tasks = [];
let app = express();
let port = 3000;
let hostname = "127.0.0.1";

app.use(express.json());

//add a task
app.post("/todo", (req, res) => {
  if (req.body.task == undefined) {
    return res.status(400).send("No Task Provided");
  }
  let task = { id: taskid++, task: req.body.task };
  tasks.push(task);
  return res.status(201).send(task);
});

//list task by id
app.get("/todo/:id", (req, res) => {
  let task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).send("Task not found");
  }
  return res.status(201).send(task);
});

//list all the tasks
app.get("/todo", (req, res) => {
  res.status(201).send(tasks);
});

//update existing task
app.put("/todo/:id", (req, res) => {
  if (req.body.task == undefined) {
    return res.status(400).send("Task not given to update");
  }
  let id = parseInt(req.params.id);
  let task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).send("Task not found");
  }
  task.task = req.body.task;
  return res.status(200).send(`Task updated`);
});

//deleting a task
app.delete("/todo/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let index = tasks.findIndex((t) => t.id === id);
  if (index == -1) {
    return res.status(404).send("Task not found");
  }
  tasks.splice(index, 1);
  return res.status(200).send(`Task deleted`);
});

app.listen(port, hostname, () => {
  console.log(`Server running on port: ${port}\n`);
});
