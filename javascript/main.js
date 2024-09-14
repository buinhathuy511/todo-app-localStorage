document.addEventListener("DOMContentLoaded", function () {
  const todoInput = document.getElementById("todo-input");
  const addButton = document.getElementById("add-button");
  const todoList = document.getElementById("todo-list");
  const logoutButton = document.getElementById("logout-button");
  const filterDropdown = document.getElementById("filter");
  const cancelButton = document.getElementById("cancel");

  function handleEnterKeydown(event) {
    if (event.key === "Enter") {
      addButton.click();
    }
  }
  todoInput.addEventListener("keydown", handleEnterKeydown);

  function handleEscKeydown(event) {
    if (event.key === "Escape") {
      cancelButton.click();
    }
  }
  todoInput.addEventListener("keydown", handleEscKeydown);

  function clearTodoInput() {
    todoInput.value = "";
  }
  cancelButton.addEventListener("click", clearTodoInput);

  // Check login with "Remember Me"
  function checkLoggedIn() {
    const loggedInUser =
      localStorage.getItem("LOGGED_IN_USER") ||
      sessionStorage.getItem("LOGGED_IN_USER");
    if (!loggedInUser) {
      window.location.href = "../html/login.html";
    } else {
      const user = JSON.parse(loggedInUser);
      document.getElementById(
        "welcome-message"
      ).innerHTML = `Hello <b>${user.userName}</b>! You are logged in`;
    }
  }
  checkLoggedIn();

  function handleLogout() {
    localStorage.removeItem("LOGGED_IN_USER");
    sessionStorage.removeItem("LOGGED_IN_USER");
    window.location.href = "../html/login.html";
  }
  logoutButton.addEventListener("click", handleLogout);

  // Get userId from localStorage
  function getUserId() {
    const loggedInUser = JSON.parse(
      localStorage.getItem("LOGGED_IN_USER") ||
        sessionStorage.getItem("LOGGED_IN_USER")
    );
    if (loggedInUser) {
      return loggedInUser.userId;
    } else {
      return null;
    }
  }

  function addTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem("TASKS")) || [];
    tasks.push(task);
    localStorage.setItem("TASKS", JSON.stringify(tasks));
  }

  function addTaskToUi() {
    const taskName = todoInput.value.trim();
    const userId = getUserId();
    if (taskName !== "") {
      const taskId = Date.now();
      const task = {
        taskId: taskId,
        taskName: taskName,
        ownerId: userId,
        status: "uncompleted",
      };
      addTaskToLocalStorage(task);
      displayTasks();
      todoInput.value = "";
      filterTasks();
    } else {
      alert("Please enter task name!");
    }
  }
  addButton.addEventListener("click", addTaskToUi);

  function removeTaskFromLocalStorage(taskId) {
    const tasks = JSON.parse(localStorage.getItem("TASKS")) || [];
    const userTasks = tasks.filter(function (task) {
      return task.taskId !== taskId;
    });
    localStorage.setItem("TASKS", JSON.stringify(userTasks));
  }

  function updateTaskInLocalStorage(taskId, taskName, status = "uncompleted") {
    const tasks = JSON.parse(localStorage.getItem("TASKS")) || [];
    const userTasks = tasks.map(function (task) {
      if (task.taskId === taskId) {
        return {
          ...task,
          taskName: taskName,
          status: status,
        };
      }
      return task;
    });
    localStorage.setItem("TASKS", JSON.stringify(userTasks));
  }

  function displayTasks() {
    const tasks = JSON.parse(localStorage.getItem("TASKS")) || [];
    const currentUserId = getUserId();
    todoList.innerHTML = "";

    const userTasks = tasks.filter(function (task) {
      return task.ownerId === currentUserId;
    });

    userTasks.forEach(function (task) {
      const taskDiv = document.createElement("div");
      taskDiv.className = "todo-item";

      if (task.status === "completed") {
        taskDiv.classList.add("completed");
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.status === "completed";

      const taskSpan = document.createElement("span");
      taskSpan.textContent = task.taskName;

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete";

      function deleteTask() {
        todoList.removeChild(taskDiv);
        removeTaskFromLocalStorage(task.taskId);
        filterTasks();
      }
      deleteButton.addEventListener("click", deleteTask);

      function editTask() {
        const taskInput = document.createElement("input");
        taskInput.type = "text";
        taskInput.value = taskSpan.textContent;
        taskDiv.replaceChild(taskInput, taskSpan);

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        taskDiv.replaceChild(saveButton, editButton);

        saveButton.addEventListener("click", function () {
          taskSpan.textContent = taskInput.value;
          taskDiv.replaceChild(taskSpan, taskInput);
          taskDiv.replaceChild(editButton, saveButton);
          updateTaskInLocalStorage(task.taskId, taskSpan.textContent);
        });
      }
      editButton.addEventListener("click", editTask);

      function handleCheckboxTask() {
        if (checkbox.checked) {
          taskDiv.classList.add("completed");
          todoList.appendChild(taskDiv);
          task.status = "completed";
        } else {
          taskDiv.classList.remove("completed");
          task.status = "uncompleted";
        }
        updateTaskInLocalStorage(task.taskId, task.taskName, task.status);
        filterTasks();
      }
      checkbox.addEventListener("change", handleCheckboxTask);

      taskDiv.appendChild(checkbox);
      taskDiv.appendChild(taskSpan);
      taskDiv.appendChild(editButton);
      taskDiv.appendChild(deleteButton);
      todoList.appendChild(taskDiv);
    });
  }

  function filterTasks() {
    const filterValue = filterDropdown.value;
    const tasks = todoList.querySelectorAll(".todo-item");

    tasks.forEach((task) => {
      const isCompleted = task.classList.contains("completed");

      switch (filterValue) {
        case "all":
          task.style.display = "flex";
          break;
        case "done":
          task.style.display = isCompleted ? "flex" : "none";
          break;
        case "undone":
          task.style.display = isCompleted ? "none" : "flex";
      }
    });
  }

  filterDropdown.addEventListener("change", filterTasks);

  displayTasks();
});
