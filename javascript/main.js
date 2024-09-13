document.addEventListener("DOMContentLoaded", function () {
  const todoInput = document.getElementById("id-todo-input");
  const addButton = document.getElementById("id-add-button");
  const todoList = document.getElementById("id-todo-list");
  const logoutButton = document.getElementById("id-logout-button");
  const filterDropdown = document.getElementById("id-filter");
  const cancelButton = document.getElementById("id-cancel");

  // Click enter to add task
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addButton.click();
    }
  });

  // Click esc to cancel input task
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      cancelButton.click();
    }
  });

  // Handle cancel
  cancelButton.addEventListener("click", function () {
    todoInput.value = "";
  });

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

  // Handle Logout
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("LOGGED_IN_USER");
    sessionStorage.removeItem("LOGGED_IN_USER");
    window.location.href = "../html/login.html";
  });

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

  // Save task to localStorage
  function addTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem("TASKS")) || [];
    tasks.push(task);
    localStorage.setItem("TASKS", JSON.stringify(tasks));
  }

  // Add new task
  addButton.addEventListener("click", function () {
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
  });

  // Remove task from localStorage
  function removeTaskFromLocalStorage(taskId) {
    let tasks = JSON.parse(localStorage.getItem("TASKS")) || [];
    tasks = tasks.filter(function (task) {
      return task.taskId !== taskId;
    });
    localStorage.setItem("TASKS", JSON.stringify(tasks));
  }

  // Update task in localStorage
  function updateTaskInLocalStorage(taskId, taskName, status = "uncompleted") {
    let tasks = JSON.parse(localStorage.getItem("TASKS")) || [];
    tasks = tasks.map(function (task) {
      if (task.taskId === taskId) {
        return {
          ...task,
          taskName: taskName,
          status: status,
        };
      }
      return task;
    });
    localStorage.setItem("TASKS", JSON.stringify(tasks));
  }

  // Show task from localStorage
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

      // Delete task
      deleteButton.addEventListener("click", function () {
        todoList.removeChild(taskDiv);
        removeTaskFromLocalStorage(task.taskId);
        filterTasks();
      });

      // Edit task
      editButton.addEventListener("click", function () {
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
      });

      // Checkbox task
      checkbox.addEventListener("change", function () {
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
      });

      taskDiv.appendChild(checkbox);
      taskDiv.appendChild(taskSpan);
      taskDiv.appendChild(editButton);
      taskDiv.appendChild(deleteButton);
      todoList.appendChild(taskDiv);
    });
  }

  // Filter task
  function filterTasks() {
    const filterValue = filterDropdown.value;
    const tasks = todoList.querySelectorAll(".todo-item");

    tasks.forEach((task) => {
      const isCompleted = task.classList.contains("completed");

      if (filterValue === "all") {
        task.style.display = "flex";
      } else if (filterValue === "done") {
        task.style.display = isCompleted ? "flex" : "none";
      } else if (filterValue === "undone") {
        task.style.display = isCompleted ? "none" : "flex";
      }
    });
  }

  filterDropdown.addEventListener("change", filterTasks);

  displayTasks();
});
