let total_task = JSON.parse(localStorage.getItem("NoOfTasks")) || 0;
let completed_task = JSON.parse(localStorage.getItem("CompletedTasks")) || 0;
taskCount = document.querySelector(".total-tasks");
completeCount = document.querySelector(".completed-tasks");
taskCount.innerText = `Tasks: ${total_task}`;
completeCount.innerText = `Completed: ${completed_task}`;
filters = document.querySelectorAll(".filter-btns");
filters[0].classList.add("selected-filter");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let current_filter = 0;
lis = document.querySelector("ul");

function saveToLocal() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("NoOfTasks", JSON.stringify(total_task));
  localStorage.setItem("CompletedTasks", JSON.stringify(completed_task));
}
function showCompleted() {
  lis.innerHTML = "";
  for (let task of tasks) {
    if (task.state == "completed") {
      li = document.createElement("li");
      brk = document.createElement("br");
      li.dataset.id = task.id;
      span = document.createElement("span");
      span.innerText = task.title;
      span.className = "task-text";
      delete_btn = document.createElement("button");
      delete_btn.className = "delete";
      delete_btn.innerText = "Delete";
      li.append(span);
      li.append(brk);
      li.append(delete_btn);
      lis.append(li);
    }
  }
}

function showPending() {
  lis.innerHTML = "";
  for (let task of tasks) {
    if (task.state == "pending") {
      li = document.createElement("li");
      brk = document.createElement("br");
      li.dataset.id = task.id;
      span = document.createElement("span");
      span.innerText = task.title;
      span.className = "task-text";
      complete_btn = document.createElement("button");
      complete_btn.className = "mark-complete";
      complete_btn.innerText = "Completed";
      delete_btn = document.createElement("button");
      delete_btn.className = "delete";
      delete_btn.innerText = "Delete";
      li.append(span);
      li.append(brk);
      li.append(complete_btn);
      li.append(delete_btn);
      lis.append(li);
    }
  }
}

function showAll() {
  lis.innerHTML = "";
  for (task of tasks) {
    li = document.createElement("li");
    brk = document.createElement("br");
    li.dataset.id = task.id;
    span = document.createElement("span");
    span.innerText = task.title;
    span.className = "task-text";
    complete_btn = document.createElement("button");
    complete_btn.className = "mark-complete";
    complete_btn.innerText = "Completed";
    delete_btn = document.createElement("button");
    delete_btn.className = "delete";
    delete_btn.innerText = "Delete";
    li.append(span);
    li.append(brk);
    li.append(complete_btn);
    li.append(delete_btn);
    lis.append(li);
  }
}

let complete_list_btn = document.querySelector(".completed");
complete_list_btn.addEventListener("click", () => {
  for (filter of filters) {
    filter.classList.remove("selected-filter");
  }
  filters[1].classList.add("selected-filter");
  current_filter = 1;
  showCompleted();
});

let All_list_btn = document.querySelector(".all");
All_list_btn.addEventListener("click", () => {
  for (filter of filters) {
    filter.classList.remove("selected-filter");
  }
  filters[0].classList.add("selected-filter");
  current_filter = 0;
  showAll();
});

let pending_list_btn = document.querySelector(".pending");
pending_list_btn.addEventListener("click", () => {
  for (filter of filters) {
    filter.classList.remove("selected-filter");
  }
  filters[2].classList.add("selected-filter");
  current_filter = 2;
  showPending();
});

showAll();

document.querySelector("ul").addEventListener("click", (e) => {
  if (e.target.matches(".delete")) {
    let id = e.target.parentElement.dataset.id;

    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id == id) {
        if (tasks[i].state == "completed") {
          completed_task--;
          completeCount.innerText = `Completed: ${completed_task}`;
        }
        tasks.splice(i, 1);
        break;
      }
    }
    e.target.parentElement.remove();
    total_task--;
    taskCount.innerText = `Tasks: ${total_task}`;
    saveToLocal();
  }
});

document.querySelector("ul").addEventListener("click", (e) => {
  if (e.target.matches(".mark-complete")) {
    let id = e.target.parentElement.dataset.id;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id == id && tasks[i].state == "pending") {
        tasks[i].state = "completed";
        completed_task++;
        completeCount.innerText = `Completed: ${completed_task}`;
        break;
      }
    }
    if (current_filter == 2) showPending();
    saveToLocal();
  }
});

add = document.querySelector(".add-task");
add.addEventListener("click", () => {
  temp = document.querySelector("input");
  if (temp.value != "") {
    total_task++;
    taskCount.innerText = `Tasks: ${total_task}`;
    completeCount.innerText = `Completed: ${completed_task}`;
    let task = temp.value;
    temp.value = "";
    let taskID = crypto.randomUUID();
    tasks.push({ id: taskID, title: task, state: "pending" });

    if (current_filter == 0) showAll();
    else if (current_filter == 1) showCompleted();
    else if (current_filter == 2) showPending();

    saveToLocal();
  }
});
